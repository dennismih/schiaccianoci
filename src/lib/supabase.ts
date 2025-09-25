import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface MediaItem {
  id: string
  file_name: string
  file_type: string
  file_data: string // base64
  uploader_id: string
  created_at: string
  aspect_ratio: number
}