import { supabase } from '@/scripts/supabase'

export const $POST = async (payload, route) => {
  const { data, error } = await supabase.auth.getSession()
  if (error) return console.log(error.message)

  const { access_token } = data?.session
  if (!access_token) return console.log('No token')

  const res = await fetch(`http://localhost:5000/${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(payload),
  })

  const body = await res.json()
  return body
}
