import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wglsmhuitsbraqmehard.supabase.co'
const supabaseKey = 'sb_publishable_ai5Mz_9PdsviEy6Gw0DtOQ_Qe_GBDP-'

export const supabase = createClient(supabaseUrl, supabaseKey)
