import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wyjyixzbpkwvqgrkzeia.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5anlpeHpicGt3dnFncmt6ZWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDIyMzYsImV4cCI6MjA4MTIxODIzNn0.zis8ofjFag1JdfptMIB9XejOC9DTbHtSgKymJX3odvM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
