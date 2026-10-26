/* ═══════════════════════════════════════════════════════════════
   MODE DÉMO — client en mémoire qui imite les requêtes Supabase
   utilisées par hooks.js, pré-rempli avec six semaines fictives.
   Rien n'est envoyé ni conservé : un rechargement repart de zéro.
   ═══════════════════════════════════════════════════════════════ */
import { PROGRAM, WEEK, PROFILE } from './data'

const DAYS = 42
const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d }

// Pseudo-aléatoire déterministe : la démo est la même à chaque visite
let seed = 7
const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }

const MEALS = [
  "Fromage blanc + amandes / poulet riz brocoli / shaker / omelette salade",
  "Fromage blanc + fruit / boeuf patate douce / soupe + fromage blanc",
  "Fromage blanc + beurre de cacahuete / thon pates completes / shaker / poisson legumes",
  "Fromage blanc + amandes / dinde quinoa / restaurant (raisonnable)",
]
const FEEDBACK = [
  "Bonne energie a la salle, charges en hausse sur le developpe.",
  "Un peu fatigue, sommeil court.",
  "Seance solide, bonne congestion.",
  "Faim en fin de journee, a surveiller.",
  "Journee propre, rien a signaler.",
]

function seedData() {
  const weight_log = [], daily_checks = [], daily_log = [], workout_log = []
  let id = 1

  for (let n = DAYS; n >= 1; n -= 3) {
    const progress = (DAYS - n) / DAYS
    const w = PROFILE.start - progress * (PROFILE.start - PROFILE.target) * 0.45 + (rand() - 0.5) * 0.4
    weight_log.push({ id: id++, date: toISO(daysAgo(n)), weight_kg: Math.round(w * 10) / 10,
      body_fat_pct: n % 9 === 0 ? Math.round((19 - progress * 2.5) * 10) / 10 : null })
  }

  for (let n = 30; n >= 1; n--) {
    const ok = (p) => rand() < p
    daily_checks.push({ id: id++, date: toISO(daysAgo(n)), protein: ok(0.85), water: ok(0.75),
      no_junk: ok(0.8), creatine: ok(0.95), training: ok(0.6), sleep: ok(0.55) })
  }

  for (let n = 10; n >= 1; n--) {
    daily_log.push({ id: id++, date: toISO(daysAgo(n)), meals: MEALS[n % MEALS.length],
      energy: 2 + Math.floor(rand() * 4), feedback: FEEDBACK[n % FEEDBACK.length] })
  }

  // Séances : suivent la semaine type du programme, avec une progression légère des charges
  for (let n = 35; n >= 1; n--) {
    const d = daysAgo(n)
    const sched = WEEK[(d.getDay() + 6) % 7]
    if (sched.type !== "gym") continue
    const session = PROGRAM.find(s => s.id === sched.s)
    const week = Math.floor((35 - n) / 7)
    const exercises = session.exercises.map(ex => {
      const base = parseFloat(ex.weight) || 0
      const reps = parseInt(String(ex.reps).split("-").pop(), 10) || 10
      return { name: ex.name, sets: Array.from({ length: ex.sets }).map((_, i) => ({
        weight: base ? Math.round((base + week * 2.5) * 2) / 2 : 0, reps: Math.max(1, reps - i) })) }
    })
    workout_log.push({ id: id++, date: toISO(d), session_id: session.id, exercises,
      duration_min: 60 + Math.floor(rand() * 15), notes: null })
  }

  return { weight_log, daily_checks, daily_log, workout_log, nextId: id }
}

const db = seedData()

class Query {
  constructor(table) { this.table = table; this.filters = []; this.op = "select" }
  select() { return this }
  insert(row) { this.op = "insert"; this.payload = row; return this }
  update(values) { this.op = "update"; this.payload = values; return this }
  eq(col, val) { this.filters.push(r => r[col] === val); return this }
  order(col, { ascending = true } = {}) { this.sort = { col, ascending }; return this }
  limit(n) { this.max = n; return this }
  single() { this.one = true; return this }
  maybeSingle() { this.one = true; return this }

  run() {
    const rows = db[this.table]
    if (this.op === "insert") {
      const row = { id: db.nextId++, ...this.payload }
      rows.push(row)
      return { data: this.one ? row : [row], error: null }
    }
    if (this.op === "update") {
      rows.filter(r => this.filters.every(f => f(r))).forEach(r => Object.assign(r, this.payload))
      return { data: null, error: null }
    }
    let out = rows.filter(r => this.filters.every(f => f(r)))
    if (this.sort) {
      const { col, ascending } = this.sort
      out = [...out].sort((a, b) => (a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0) * (ascending ? 1 : -1))
    }
    if (this.max) out = out.slice(0, this.max)
    return { data: this.one ? (out[0] ?? null) : out, error: null }
  }

  then(resolve, reject) { return Promise.resolve(this.run()).then(resolve, reject) }
}

export const demoClient = { from: (table) => new Query(table) }
