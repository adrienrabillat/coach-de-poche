import { createClient } from '@supabase/supabase-js'
import { demoClient } from './demoClient'

// Vitrine publique : VITE_DEMO_MODE=true, données fictives en mémoire, aucune base.
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

export const supabase = DEMO_MODE
  ? demoClient
  : createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
