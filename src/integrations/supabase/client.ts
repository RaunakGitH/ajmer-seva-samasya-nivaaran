
import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = 'https://gxxsjvhknmcykgvinhno.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4eHNqdmhrbm1jeWtndmluaG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNDc0ODYsImV4cCI6MjA2MDgyMzQ4Nn0.3NjrgBC5JdA3eA5QCki6nQaUxJmmhdPSMe_xQ820z1g'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'ajmer-seva-samasya-nivaaran@1.0.0'
    }
  }
})
