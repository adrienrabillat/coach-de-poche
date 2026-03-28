import { useState, useEffect, useRef } from 'react'
import {
  ChevronRight, ChevronDown, Check, Play, Pause, RotateCcw, Plus,
  Trophy, Flame, TrendingDown, ArrowRight, Star, Download, Activity,
  Apple, Dumbbell, Target, Award, Zap, Shield
} from 'lucide-react'
import { PROGRAM, WEEK, MEALS, CHECKS, MILESTONES, STRENGTH, ACHIEVEMENTS } from './data'
import { useWeightLog, useDailyChecks, useDailyLog, useWorkoutLog, exportCSV, toISO } from './hooks'

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════ */
const C = {
  bg: "#f5f3ef", card: "#ffffff", cardAlt: "#fafaf7",
  green: "#6b8e5a", greenDark: "#4a6b3c", greenLight: "#e8f0e4", greenMuted: "#9bb48d",
  olive: "#8a9a5b", warm: "#c9956b", warmLight: "#fdf0e6", cream: "#f9f5ee",
  text: "#2c2c2c", textSec: "#6b6b6b", textMuted: "#a0a0a0",
  border: "#e8e5df", borderLight: "#f0ede8",
  danger: "#d4644a", dangerLight: "#fce8e4",
  shadow: "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
  radius: 16, radiusSm: 12, radiusXs: 8,
}

/* ═══════════════════════════════════════════════════════════════
   MICRO COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
const card = { background: C.card, borderRadius: C.radius, boxShadow: C.shadow, overflow: "hidden" }
const cardPad = { ...card, padding: "16px 18px" }

function CircleProgress({ value, max, size = 110, sw = 10, color = C.green, children }) {
  const r = (size - sw) / 2, circ = 2 * Math.PI * r, pct = Math.min(value / max, 1)
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.borderLight} strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  )
}

function RestTimer({ sec }) {
  const [left, setLeft] = useState(sec)
  const [on, setOn] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (on && left > 0) {
      ref.current = setInterval(() => setLeft(t => { if (t<=1) { clearInterval(ref.current); setOn(false); return 0 } return t-1 }), 1000)
    }
    return () => clearInterval(ref.current)
  }, [on])
  const reset = () => { clearInterval(ref.current); setLeft(sec); setOn(false) }
  const m = Math.floor(left/60), ss = left%60, done = left===0
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: done ? C.greenLight : on ? C.warmLight : C.cardAlt, borderRadius: 8, padding: "4px 8px" }}>
      <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, fontSize: 13, color: done ? C.green : on ? C.warm : C.text, minWidth: 32 }}>
        {m}:{String(ss).padStart(2,"0")}
      </span>
      {!on && left===sec && <button onClick={()=>setOn(true)} style={{ all:"unset", cursor:"pointer", display:"flex" }}><Play size={12} color={C.green} /></button>}
      {on && <button onClick={()=>{clearInterval(ref.current);setOn(false)}} style={{ all:"unset", cursor:"pointer", display:"flex" }}><Pause size={12} color={C.warm} /></button>}
      {(done||(!on&&left<sec)) && <button onClick={reset} style={{ all:"unset", cursor:"pointer", display:"flex" }}><RotateCcw size={10} color={C.textMuted} /></button>}
      {done && <span style={{ fontSize: 10, fontWeight: 800, color: C.green }}>GO</span>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HOME TAB
   ═══════════════════════════════════════════════════════════════ */
function HomeTab({ weightLog, checkLog }) {
  const todayStr = toISO()
  const tc = checkLog[todayStr] || {}
  const checked = CHECKS.filter(c => tc[c.k]).length
  const lastW = weightLog.length > 0 ? weightLog[weightLog.length-1].weight_kg : 86.4
  const lost = (86.4 - lastW).toFixed(1)
  const remaining = Math.max(0, lastW - 77).toFixed(1)

  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const weekDates = Array.from({length:7}, (_,i) => {
    const d = new Date(now); d.setDate(now.getDate() + mondayOffset + i); return d
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ padding: "0 2px" }}>
        <div style={{ fontSize: 13, color: C.textMuted }}>Bonjour</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 14 }}>Ad</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {weekDates.map((d, i) => {
            const isToday = d.toDateString() === now.toDateString()
            const sched = WEEK[i]
            return (
              <div key={i} style={{ flex: 1, textAlign: "center", padding: "8px 2px", borderRadius: 12, background: isToday ? C.green : "transparent" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: isToday ? "rgba(255,255,255,0.7)" : C.textMuted }}>{sched.d}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: isToday ? "#fff" : C.text, margin: "2px 0" }}>{d.getDate()}</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: isToday ? "rgba(255,255,255,0.8)" : (sched.type==="gym" ? C.green : sched.type==="run" ? C.olive : C.textMuted) }}>
                  {sched.type==="gym" ? sched.s : sched.type==="run" ? "Run" : "Off"}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ ...cardPad, display: "flex", alignItems: "center", gap: 16 }}>
        <CircleProgress value={Math.max(0, 86.4 - lastW)} max={9.4} color={C.green}>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{remaining}</span>
          <span style={{ fontSize: 10, color: C.textMuted }}>kg restants</span>
        </CircleProgress>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ background: C.greenLight, borderRadius: 10, padding: "8px 12px", flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.greenDark }}>{lastW}</div>
              <div style={{ fontSize: 10, color: C.greenMuted }}>kg actuel</div>
            </div>
            <div style={{ background: C.warmLight, borderRadius: 10, padding: "8px 12px", flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.warm }}>{lost > 0 ? `-${lost}` : "0"}</div>
              <div style={{ fontSize: 10, color: C.warm }}>kg perdus</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ l:"Cal",v:"2100",c:C.warm },{ l:"Prot",v:"160g",c:C.danger },{ l:"Gluc",v:"190g",c:C.green },{ l:"Lip",v:"65g",c:C.olive }].map((m,i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ height: 3, borderRadius: 2, background: m.c, marginBottom: 4, opacity: 0.5 }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{m.v}</div>
                <div style={{ fontSize: 9, color: C.textMuted }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={cardPad}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Aujourd'hui</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: checked===CHECKS.length ? C.green : C.warm }}>{checked}/{CHECKS.length}</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {CHECKS.map((c,i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: tc[c.k] ? C.green : C.borderLight, transition: "background 0.2s" }} />
          ))}
        </div>
      </div>

      <div style={cardPad}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Force — Objectifs 3 mois</div>
        {STRENGTH.map((s,i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "5px 0", borderBottom: i<STRENGTH.length-1 ? `1px solid ${C.borderLight}` : "none", fontSize: 12 }}>
            <span style={{ flex: 1, fontWeight: 600, color: C.text }}>{s.ex}</span>
            <span style={{ color: C.textMuted, marginRight: 6 }}>{s.cur}</span>
            <ArrowRight size={10} color={C.textMuted} />
            <span style={{ color: C.green, fontWeight: 700, marginLeft: 6 }}>{s.tgt}</span>
          </div>
        ))}
      </div>

      <div style={cardPad}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Jalons</div>
        {MILESTONES.map((m,i) => {
          const reached = lastW <= m.w
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i<MILESTONES.length-1 ? `1px solid ${C.borderLight}` : "none", opacity: reached ? 0.4 : 1 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: reached ? C.greenLight : C.cardAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {reached ? <Check size={12} color={C.green} /> : <span style={{ fontSize: 10, fontWeight: 700, color: C.textMuted }}>{i+1}</span>}
              </div>
              <div style={{ flex: 1, fontSize: 12 }}>
                <strong>{m.w} kg</strong>
                <span style={{ color: C.textMuted, marginLeft: 6, fontSize: 11 }}>{m.t}</span>
              </div>
              <span style={{ fontSize: 11, color: C.textMuted }}>{m.n}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROGRAM TAB — with weight/reps logging per set
   ═══════════════════════════════════════════════════════════════ */
function SetInput({ sessionColor, onLog, defaultW = "", defaultR = "" }) {
  const [w, setW] = useState(defaultW)
  const [r, setR] = useState(defaultR)
  const [logged, setLogged] = useState(false)

  const log = () => {
    if (w && r) { onLog(parseFloat(w), parseInt(r)); setLogged(true) }
  }

  if (logged) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4, background: sessionColor, borderRadius: 8, padding: "6px 10px" }}>
        <Check size={12} color="#fff" />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{w}x{r}</span>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      <input type="number" placeholder="kg" value={w} onChange={e=>setW(e.target.value)}
        style={{ width: 44, padding: "6px 4px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, textAlign: "center", outline: "none", background: C.card }} />
      <span style={{ fontSize: 10, color: C.textMuted }}>x</span>
      <input type="number" placeholder="rep" value={r} onChange={e=>setR(e.target.value)}
        onKeyDown={e => e.key==="Enter" && log()}
        style={{ width: 38, padding: "6px 4px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, textAlign: "center", outline: "none", background: C.card }} />
      <button onClick={log} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: (w && r) ? sessionColor : C.borderLight, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check size={12} />
      </button>
    </div>
  )
}

function ProgramTab({ saveWorkout }) {
  const [open, setOpen] = useState(null)
  const [setLogs, setSetLogs] = useState({}) // { "A-0-0": { w: 80, r: 10 } }
  const [saved, setSaved] = useState({})

  const logSet = (sid, ei, si, w, r) => {
    setSetLogs(p => ({ ...p, [`${sid}-${ei}-${si}`]: { w, r } }))
  }

  const prog = (session) => {
    let t = 0, d = 0
    session.exercises.forEach((ex, ei) => {
      for (let i = 0; i < ex.sets; i++) { t++; if (setLogs[`${session.id}-${ei}-${i}`]) d++ }
    })
    return { t, d, p: t > 0 ? Math.round(d / t * 100) : 0 }
  }

  const saveSession = async (session) => {
    const exercises = session.exercises.map((ex, ei) => ({
      name: ex.name,
      sets: Array.from({ length: ex.sets }).map((_, si) => {
        const log = setLogs[`${session.id}-${ei}-${si}`]
        return log ? { weight: log.w, reps: log.r } : null
      }).filter(Boolean)
    })).filter(e => e.sets.length > 0)

    if (exercises.length > 0) {
      await saveWorkout(session.id, exercises)
      setSaved(p => ({ ...p, [session.id]: true }))
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ ...cardPad, background: C.cream, border: `1px solid ${C.border}`, boxShadow: "none" }}>
        <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>
          <strong>Rotation A / B / C / D.</strong> Note tes poids et reps pour chaque serie. Timer = temps de repos entre series.
        </div>
      </div>
      {PROGRAM.map(session => {
        const p = prog(session)
        const isOpen = open === session.id
        const isSaved = saved[session.id]
        return (
          <div key={session.id} style={{ ...card, border: isOpen ? `2px solid ${session.color}` : `1px solid ${C.border}` }}>
            <button onClick={() => setOpen(isOpen ? null : session.id)}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: session.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: session.color, flexShrink: 0 }}>{session.id}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{session.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", padding: "2px 8px", borderRadius: 6, background: C.cardAlt, color: C.textMuted }}>{session.tag}</span>
                </div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{session.focus}</div>
              </div>
              {p.d > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: p.p===100 ? C.green : session.color }}>{p.p}%</span>}
              {isOpen ? <ChevronDown size={16} color={C.textMuted} /> : <ChevronRight size={16} color={C.textMuted} />}
            </button>
            {isOpen && (
              <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                {session.exercises.map((ex, ei) => (
                  <div key={ei} style={{ background: C.cardAlt, borderRadius: C.radiusSm, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                      <div style={{ flex: 1, minWidth: 140 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{ex.name}</div>
                        <div style={{ fontSize: 11, color: session.color, fontWeight: 600, marginTop: 1 }}>Objectif: {ex.sets} x {ex.reps} — {ex.weight}</div>
                      </div>
                      <RestTimer sec={ex.rest} />
                    </div>
                    <div style={{ fontSize: 11, color: C.textSec, marginBottom: 8, lineHeight: 1.4 }}>{ex.notes}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {Array.from({length: ex.sets}).map((_,si) => (
                        <div key={si} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, minWidth: 16 }}>S{si+1}</span>
                          <SetInput sessionColor={session.color} onLog={(w,r) => logSet(session.id, ei, si, w, r)} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {/* Save session button */}
                <button onClick={() => saveSession(session)} disabled={isSaved || p.d === 0}
                  style={{
                    width: "100%", padding: "12px 0", borderRadius: C.radiusSm, border: "none", cursor: p.d > 0 && !isSaved ? "pointer" : "default",
                    background: isSaved ? C.greenLight : p.d > 0 ? session.color : C.borderLight,
                    color: isSaved ? C.greenDark : p.d > 0 ? "#fff" : C.textMuted,
                    fontWeight: 700, fontSize: 13, transition: "all 0.2s"
                  }}>
                  {isSaved ? "Seance enregistree" : `Sauvegarder la seance ${session.id}`}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   NUTRITION TAB
   ═══════════════════════════════════════════════════════════════ */
function NutritionTab() {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={cardPad}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 12 }}>Objectifs journaliers</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ l:"Calories",v:2100,mx:2500,u:"",c:C.warm },{ l:"Proteines",v:160,mx:200,u:"g",c:C.danger },{ l:"Glucides",v:190,mx:300,u:"g",c:C.green },{ l:"Lipides",v:65,mx:100,u:"g",c:C.olive }].map((m,i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.3px" }}>{m.l}</div>
              <div style={{ height: 5, borderRadius: 3, background: C.borderLight, overflow: "hidden", marginBottom: 3 }}>
                <div style={{ height: "100%", borderRadius: 3, background: m.c, width: `${(m.v/m.mx)*100}%` }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{m.v}<span style={{ fontWeight: 400, color: C.textMuted }}>{m.u}</span></div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 8 }}>Deficit ~400 kcal/j. Petit-dej low carb pour garder de la marge le soir.</div>
      </div>

      <div style={cardPad}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 8 }}>Supplements</div>
        {[{ n:"Creatine",d:"5g/jour, tous les jours" },{ n:"Gainer",d:"1 scoop post-training (jours salle)" },{ n:"Pre-Workout",d:"Avant seance, pas apres 16h" }].map((s,i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i<2 ? `1px solid ${C.borderLight}` : "none", fontSize: 12 }}>
            <span style={{ fontWeight: 700, color: C.text }}>{s.n}</span>
            <span style={{ color: C.textSec }}>{s.d}</span>
          </div>
        ))}
      </div>

      {MEALS.map(meal => (
        <div key={meal.id} style={card}>
          <button onClick={() => setOpen(open===meal.id ? null : meal.id)}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "14px 16px", display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{meal.title}</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{meal.sub}</div>
            </div>
            {open===meal.id ? <ChevronDown size={16} color={C.textMuted} /> : <ChevronRight size={16} color={C.textMuted} />}
          </button>
          {open===meal.id && (
            <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
              {meal.opts.map((o,oi) => (
                <div key={oi} style={{ background: C.cardAlt, borderRadius: C.radiusSm, padding: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: C.text, marginBottom: 4 }}>{o.n}</div>
                  {o.cal > 0 && (
                    <div style={{ display: "flex", gap: 10, marginBottom: 6, fontSize: 11 }}>
                      <span style={{ color: C.warm, fontWeight: 700 }}>{o.cal} cal</span>
                      <span style={{ color: C.danger, fontWeight: 700 }}>{o.prot}g prot</span>
                    </div>
                  )}
                  {o.items.map((item,ii) => (
                    <div key={ii} style={{ fontSize: 11, color: C.textSec, padding: "2px 0 2px 10px", borderLeft: `2px solid ${C.border}`, marginBottom: 1 }}>{item}</div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{ ...cardPad, background: C.greenLight, border: "1px solid #c8dbc0", boxShadow: "none" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.greenDark, marginBottom: 6 }}>Meal Prep — Dimanche</div>
        {["1kg poulet/dinde au four","800g riz ou quinoa","1.5kg brocoli/haricots (vapeur ou four)","Separer en 5 tupperwares","Lun-Mer au frigo, Jeu-Ven au congelo","Sortir le congelo mercredi soir"].map((step,i) => (
          <div key={i} style={{ fontSize: 11, color: C.greenDark, padding: "2px 0" }}>{i+1}. {step}</div>
        ))}
        <div style={{ fontSize: 10, color: C.greenMuted, marginTop: 6, fontStyle: "italic" }}>Poulet cuit = 3-4 jours au frigo max. D'ou frigo/congelo.</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TRACKER TAB
   ═══════════════════════════════════════════════════════════════ */
function TrackerTab({ weightLog, addWeight, checkLog, toggleCheck, dailyLog, saveDailyLog, workoutData }) {
  const [newW, setNewW] = useState("")
  const [newBf, setNewBf] = useState("")
  const [saving, setSaving] = useState(false)
  const todayStr = toISO()
  const tc = checkLog[todayStr] || {}
  const todayLog = dailyLog[todayStr] || { meals: '', energy: 3, feedback: '' }
  const [meals, setMeals] = useState(todayLog.meals)
  const [energy, setEnergy] = useState(todayLog.energy)
  const [feedback, setFeedback] = useState(todayLog.feedback)
  const [logSaved, setLogSaved] = useState(false)
  const logTimer = useRef(null)

  const handleAdd = async () => {
    const w = parseFloat(newW)
    if (w > 0 && w < 200 && !saving) {
      setSaving(true)
      await addWeight(w, newBf ? parseFloat(newBf) : null)
      setNewW(""); setNewBf("")
      setSaving(false)
    }
  }

  const checked = CHECKS.filter(c => tc[c.k]).length
  const lastW = weightLog.length > 0 ? weightLog[weightLog.length-1].weight_kg : 86.4

  const perfectDays = Object.values(checkLog).filter(d => CHECKS.every(c => d[c.k])).length
  const noJunkStreak = (() => {
    let streak = 0
    const dates = Object.keys(checkLog).sort().reverse()
    for (const d of dates) { if (checkLog[d]?.noJunk) streak++; else break }
    return streak
  })()

  const fmtShort = (iso) => { const [y,m,d] = iso.split("-"); return `${d}/${m}` }

  const ICONS = { first_week: Star, minus_2kg: TrendingDown, streak_14: Shield, milestone_84: Trophy, minus_5kg: Flame, milestone_80: Award, streak_30: Zap, milestone_77: Trophy }

  const achStatus = ACHIEVEMENTS.map(a => {
    let unlocked = false
    if (a.type === "weight") unlocked = lastW <= a.threshold
    else if (a.type === "streak") unlocked = perfectDays >= a.threshold
    else if (a.type === "nojunk") unlocked = noJunkStreak >= a.threshold
    return { ...a, unlocked }
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Checklist */}
      <div style={cardPad}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Checklist</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: checked===CHECKS.length ? C.green : C.warm }}>{checked}/{CHECKS.length}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {CHECKS.map(c => {
            const on = tc[c.k]
            return (
              <button key={c.k} onClick={() => toggleCheck(c.k)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: C.radiusSm,
                border: "none", cursor: "pointer", textAlign: "left",
                background: on ? C.greenLight : C.cardAlt, transition: "all 0.15s"
              }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: on ? C.green : C.card, border: on ? "none" : `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {on && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: on ? C.greenDark : C.text }}>{c.l}</span>
              </button>
            )
          })}
        </div>
        {checked === CHECKS.length && (
          <div style={{ marginTop: 8, textAlign: "center", padding: 8, background: C.greenLight, borderRadius: C.radiusSm, fontSize: 12, color: C.greenDark, fontWeight: 700 }}>Journee parfaite.</div>
        )}
      </div>

      {/* Daily Log — meals + energy + feedback */}
      <div style={cardPad}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Journal du jour</span>
          {logSaved && <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>Sauvegarde</span>}
        </div>

        {/* Energy level */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, fontWeight: 600 }}>Energie</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setEnergy(n)} style={{
                flex: 1, padding: "8px 0", borderRadius: C.radiusXs, border: "none", cursor: "pointer",
                background: energy >= n ? C.green : C.cardAlt,
                color: energy >= n ? "#fff" : C.textMuted,
                fontWeight: 700, fontSize: 12, transition: "all 0.15s"
              }}>{n}</button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.textMuted, marginTop: 2 }}>
            <span>Mort</span><span>En forme</span>
          </div>
        </div>

        {/* Meals text */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, fontWeight: 600 }}>Repas du jour</div>
          <textarea value={meals} onChange={e => setMeals(e.target.value)}
            placeholder="Ex: matin FB amandes, midi poulet riz brocoli, soir pates bolo"
            rows={2}
            style={{ width: "100%", padding: "8px 10px", borderRadius: C.radiusXs, border: `1px solid ${C.border}`, fontSize: 12, outline: "none", background: C.card, resize: "vertical", fontFamily: "inherit", lineHeight: 1.4, boxSizing: "border-box" }} />
        </div>

        {/* Feedback */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, fontWeight: 600 }}>Comment ca s'est passe ?</div>
          <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
            placeholder="Ex: bonne seance, envie de sucre le soir, mal dormi..."
            rows={2}
            style={{ width: "100%", padding: "8px 10px", borderRadius: C.radiusXs, border: `1px solid ${C.border}`, fontSize: 12, outline: "none", background: C.card, resize: "vertical", fontFamily: "inherit", lineHeight: 1.4, boxSizing: "border-box" }} />
        </div>

        <button onClick={async () => {
          await saveDailyLog(meals, energy, feedback)
          setLogSaved(true)
          setTimeout(() => setLogSaved(false), 2000)
        }}
          style={{ width: "100%", padding: "10px 0", borderRadius: C.radiusSm, border: "none", background: C.green, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          Sauvegarder le journal
        </button>
      </div>

      {/* Weight */}
      <div style={cardPad}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Poids</span>
          <button onClick={() => exportCSV(weightLog, checkLog, dailyLog, workoutData)}
            style={{ display: "flex", alignItems: "center", gap: 4, background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 11, color: C.textSec, fontWeight: 600 }}>
            <Download size={11} /> Export CSV
          </button>
        </div>

        <div style={{ height: 120, background: C.cardAlt, borderRadius: C.radiusSm, padding: 10, marginBottom: 10, overflow: "hidden" }}>
          {weightLog.length > 1 ? (() => {
            const ws = weightLog.map(w=>w.weight_kg)
            const min = Math.min(...ws, 77)-1, max = Math.max(...ws)+1, range = max-min
            const h = 95, w = Math.max(200, (weightLog.length-1)*45)
            const pts = weightLog.map((e,i) => ({ x: weightLog.length===1 ? w/2 : i*(w/(weightLog.length-1))+10, y: h-((e.weight_kg-min)/range)*h+5, ...e }))
            const tgtY = h-((77-min)/range)*h+5
            return (
              <svg width="100%" height={h+18} viewBox={`0 0 ${w+20} ${h+18}`} preserveAspectRatio="xMidYMid meet">
                <line x1={0} y1={tgtY} x2={w+20} y2={tgtY} stroke={C.green} strokeDasharray="3,3" strokeWidth={1} opacity={0.5} />
                <text x={w+2} y={tgtY-3} fill={C.green} fontSize={8} fontWeight="600">77</text>
                <polyline fill="none" stroke={C.green} strokeWidth={2} strokeLinejoin="round" points={pts.map(p=>`${p.x},${p.y}`).join(" ")} />
                {pts.map((p,i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={3} fill={C.green} />
                    <text x={p.x} y={p.y-7} textAnchor="middle" fill={C.text} fontSize={8} fontWeight="700">{p.weight_kg}</text>
                    <text x={p.x} y={h+14} textAnchor="middle" fill={C.textMuted} fontSize={7}>{fmtShort(p.date)}</text>
                  </g>
                ))}
              </svg>
            )
          })() : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: C.textMuted, fontSize: 12 }}>Ajoute des pesees pour voir la courbe</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <input type="number" step="0.1" placeholder="kg" value={newW} onChange={e=>setNewW(e.target.value)}
            onKeyDown={e => e.key==="Enter" && handleAdd()}
            style={{ flex: 1, padding: "10px 12px", borderRadius: C.radiusSm, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", background: C.card, minWidth: 0 }} />
          <input type="number" step="0.1" placeholder="BF%" value={newBf} onChange={e=>setNewBf(e.target.value)}
            onKeyDown={e => e.key==="Enter" && handleAdd()}
            style={{ width: 60, padding: "10px 8px", borderRadius: C.radiusSm, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", background: C.card }} />
          <button onClick={handleAdd} disabled={saving}
            style={{ padding: "10px 14px", borderRadius: C.radiusSm, border: "none", background: saving ? C.textMuted : C.green, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            <Plus size={14} style={{ verticalAlign: "middle" }} />
          </button>
        </div>

        {weightLog.length > 0 && (
          <div style={{ marginTop: 10, maxHeight: 150, overflowY: "auto" }}>
            {[...weightLog].reverse().map((e,i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.borderLight}`, fontSize: 11 }}>
                <span style={{ color: C.textMuted }}>{fmtShort(e.date)}</span>
                <span style={{ fontWeight: 700, color: C.text }}>{e.weight_kg} kg</span>
                {e.body_fat_pct && <span style={{ color: C.warm }}>{e.body_fat_pct}%</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div style={cardPad}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Recompenses</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {achStatus.map((a,i) => {
            const Icon = ICONS[a.id] || Trophy
            return (
              <div key={i} style={{
                padding: 12, borderRadius: C.radiusSm, textAlign: "center",
                background: a.unlocked ? a.color + "15" : C.cardAlt,
                border: a.unlocked ? `2px solid ${a.color}` : `1px solid ${C.borderLight}`,
                opacity: a.unlocked ? 1 : 0.5,
              }}>
                <Icon size={22} color={a.unlocked ? a.color : C.textMuted} style={{ marginBottom: 4 }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: a.unlocked ? a.color : C.textMuted }}>{a.title}</div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{a.desc}</div>
                {a.unlocked && <div style={{ fontSize: 9, fontWeight: 700, color: a.color, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Debloque</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "home", label: "Accueil", icon: Activity },
  { id: "program", label: "Seances", icon: Dumbbell },
  { id: "nutrition", label: "Nutrition", icon: Apple },
  { id: "tracker", label: "Suivi", icon: Target },
]

export default function App() {
  const [tab, setTab] = useState("home")
  const { data: weightLog, add: addWeight, loading: wLoading } = useWeightLog()
  const { data: checkLog, toggle: toggleCheck, loading: cLoading } = useDailyChecks()
  const { data: dailyLog, save: saveDailyLog, loading: dLoading } = useDailyLog()
  const { data: workoutData, save: saveWorkout } = useWorkoutLog()

  if (wLoading || cLoading || dLoading) {
    return (
      <div style={{ minHeight: "100dvh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 32, height: 32, border: `3px solid ${C.borderLight}`, borderTopColor: C.green, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <div style={{ fontSize: 13, color: C.textMuted }}>Chargement...</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, maxWidth: 430, margin: "0 auto", position: "relative", paddingBottom: 72 }}>
      <div style={{ height: 48, background: C.bg }} />
      <div style={{ padding: "0 16px 16px" }}>
        {tab === "home" && <HomeTab weightLog={weightLog} checkLog={checkLog} />}
        {tab === "program" && <ProgramTab saveWorkout={saveWorkout} />}
        {tab === "nutrition" && <NutritionTab />}
        {tab === "tracker" && <TrackerTab weightLog={weightLog} addWeight={addWeight} checkLog={checkLog} toggleCheck={toggleCheck} dailyLog={dailyLog} saveDailyLog={saveDailyLog} workoutData={workoutData} />}
      </div>
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.borderLight}`, display: "flex", padding: "6px 0 env(safe-area-inset-bottom, 8px) 0", zIndex: 1000,
      }}>
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 0",
            }}>
              <Icon size={20} color={active ? C.green : C.textMuted} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? C.green : C.textMuted }}>{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
