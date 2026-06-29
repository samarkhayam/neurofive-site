import { unstable_cache } from 'next/cache'
import { supabase } from './supabase'

// Cache internee data for 30 seconds per email
export const getInterneesByEmail = unstable_cache(
  async (email) => {
    const { data } = await supabase
      .from('internees')
      .select('id, full_name, field, status, start_date, end_date, cohort_id, cert_paid, internee_id')
      .eq('email', email)
      .order('created_at', { ascending: false })
    return data || []
  },
  ['internees-by-email'],
  { revalidate: 30 }
)

// Cache cohort data for 60 seconds
export const getCohortById = unstable_cache(
  async (cohortId) => {
    const { data } = await supabase
      .from('cohorts')
      .select('id, name, is_active, cohort_code')
      .eq('id', cohortId)
      .single()
    return data
  },
  ['cohort-by-id'],
  { revalidate: 60 }
)

// Cache task stats — shorter TTL since these change more
export const getTaskStats = unstable_cache(
  async (interneeId) => {
    const { data } = await supabase
      .from('internee_tasks')
      .select('id, status, submission_url, submitted_at, reviewed_at, feedback, task_id, tasks(id, title, description, week_number, order_index, track)')
      .eq('internee_id', interneeId)
      .order('created_at', { ascending: true })
    return data || []
  },
  ['task-stats'],
  { revalidate: 15 }
)