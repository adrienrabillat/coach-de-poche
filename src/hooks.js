import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

const toISO = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`

// --- Weight Log ---
export function useWeightLog() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data: rows } = await supabase
      .from('weight_log').select('*').order('date', { ascending: true })
    setData(rows || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const add = async (weight, bf = null) => {
    const { data: row, error } = await supabase
      .from('weight_log')
      .insert({ date: toISO(), weight_kg: weight, body_fat_pct: bf })
      .select().single()
    if (!error && row) setData(prev => [...prev, row])
    return { row, error }
  }

  return { data, loading, add, refresh: fetch }
}

// --- Daily Checks ---
export function useDailyChecks() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data: rows } = await supabase
      .from('daily_checks').select('*').order('date', { ascending: false }).limit(90)
    const map = {}
    ;(rows || []).forEach(r => {
      map[r.date] = { protein: r.protein, water: r.water, noJunk: r.no_junk, creatine: r.creatine, training: r.training, sleep: r.sleep }
    })
    setData(map)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const toggle = async (key) => {
    const today = toISO()
    const current = data[today] || {}
    const newVal = !current[key]
    const updated = { ...current, [key]: newVal }
    setData(prev => ({ ...prev, [today]: updated }))
    const dbKey = key === 'noJunk' ? 'no_junk' : key
    const { data: existing } = await supabase.from('daily_checks').select('id').eq('date', today).maybeSingle()
    if (existing) {
      await supabase.from('daily_checks').update({ [dbKey]: newVal, updated_at: new Date().toISOString() }).eq('id', existing.id)
    } else {
      await supabase.from('daily_checks').insert({
        date: today, protein: updated.protein||false, water: updated.water||false,
        no_junk: updated.noJunk||false, creatine: updated.creatine||false,
        training: updated.training||false, sleep: updated.sleep||false,
      })
    }
  }

  return { data, loading, toggle, refresh: fetch }
}

// --- Daily Log (meals text + energy + feedback) ---
export function useDailyLog() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data: rows } = await supabase
      .from('daily_log').select('*').order('date', { ascending: false }).limit(90)
    const map = {}
    ;(rows || []).forEach(r => {
      map[r.date] = { id: r.id, meals: r.meals || '', energy: r.energy || 3, feedback: r.feedback || '' }
    })
    setData(map)
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const save = async (meals, energy, feedback) => {
    const today = toISO()
    const current = data[today]

    const payload = { meals, energy, feedback, updated_at: new Date().toISOString() }

    if (current?.id) {
      await supabase.from('daily_log').update(payload).eq('id', current.id)
    } else {
      await supabase.from('daily_log').insert({ date: today, ...payload })
    }

    setData(prev => ({ ...prev, [today]: { ...prev[today], meals, energy, feedback } }))
  }

  return { data, loading, save, refresh: fetch }
}

// --- Workout Log ---
export function useWorkoutLog() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data: rows } = await supabase
      .from('workout_log').select('*').order('date', { ascending: false }).limit(50)
    setData(rows || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const save = async (sessionId, exercises, durationMin = null, notes = null) => {
    const { data: row, error } = await supabase
      .from('workout_log')
      .insert({ date: toISO(), session_id: sessionId, exercises, duration_min: durationMin, notes })
      .select().single()
    if (!error && row) setData(prev => [row, ...prev])
    return { row, error }
  }

  return { data, loading, save, refresh: fetch }
}

// --- Full CSV Export (with daily log + workout log) ---
export function exportCSV(weightLog, checkLog, dailyLog = {}, workoutLog = []) {
  // Build workout lookup by date
  const workoutByDate = {}
  ;(workoutLog || []).forEach(w => {
    if (!workoutByDate[w.date]) workoutByDate[w.date] = []
    workoutByDate[w.date].push(w)
  })

  let csv = "date,weight_kg,body_fat_pct,protein,water,no_junk,creatine,training,sleep,energy,meals,feedback,session,workout_duration_min,workout_notes,workout_exercises\n"
  const allDates = [...new Set([
    ...weightLog.map(w => w.date), ...Object.keys(checkLog), ...Object.keys(dailyLog), ...Object.keys(workoutByDate)
  ])].sort()

  const esc = (s) => s ? `"${String(s).replace(/"/g, '""')}"` : ''

  allDates.forEach(date => {
    const w = weightLog.find(x => x.date === date)
    const c = checkLog[date] || {}
    const dl = dailyLog[date] || {}
    const workouts = workoutByDate[date] || [null]

    workouts.forEach(wo => {
      // Flatten exercises JSONB into readable string: "Bench Press: 80x10,85x8,85x6 | Incline DB: 30x10,32x8"
      let exStr = ''
      if (wo?.exercises && Array.isArray(wo.exercises)) {
        exStr = wo.exercises.map(ex => {
          const sets = (ex.sets || []).filter(s => s.weight || s.reps)
            .map(s => `${s.weight||0}x${s.reps||0}`).join(',')
          return `${ex.name}:${sets}`
        }).join(' | ')
      }

      csv += `${date},${w?w.weight_kg:''},${w?(w.body_fat_pct||''):''},${c.protein?1:0},${c.water?1:0},${c.noJunk?1:0},${c.creatine?1:0},${c.training?1:0},${c.sleep?1:0},${dl.energy||''},${esc(dl.meals)},${esc(dl.feedback)},${wo?wo.session_id:''},${wo?wo.duration_min||'':''},${esc(wo?.notes)},${esc(exStr)}\n`
    })
  })

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = `ad_fitness_${toISO()}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

export { toISO }
