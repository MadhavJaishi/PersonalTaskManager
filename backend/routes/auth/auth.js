import supabase from '../../utils/supabase.js'
import express from 'express'
const Router = express.Router()

// Step 1: Send OTP (login or signup depending on shouldCreateUser)
Router.post('/send-otp', async (req, res) => {
  const { email } = req.body
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  })
  if (error) return res.status(400).json({ error: error.message })
  res.json({ ok: true })
})

// Step 2: Verify OTP and forward session
Router.post('/verify-otp', async (req, res) => {
  const { email, otptoken, username } = req.body

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otptoken,
    type: 'email',
  })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  const { session, user } = data

  const userPayload = {
    user_id: user.id,
    email,
  }
  if (username && username.trim()) {
    userPayload.username = username.trim()
  }

  await supabase.from('users').upsert(userPayload, { onConflict: 'user_id' })

  // Retrieve stored user record from 'users' table to ensure username is returned
  const { data: dbUser } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const finalUser = {
    id: user.id,
    email: user.email || email,
    username: dbUser?.username || username?.trim() || email.split('@')[0],
  }

  res.cookie('sb_access', session.access_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 4,
  })

  res.cookie('sb_refresh', session.refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  })

  return res.json({
    ok: true,
    user: finalUser,
  })
})

Router.get('/me', async (req, res) => {
  const access = req.cookies.sb_access
  const refresh = req.cookies.sb_refresh

  if (!access && !refresh) {
    return res.status(401).json({ error: 'Not Authenticated' })
  }
  const { data: accessData } = await supabase.auth.getUser(access)

  if (accessData?.user) {
    const { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', accessData.user.id)
      .single()

    return res.json({
      user: {
        id: accessData.user.id,
        email: accessData.user.email,
        username: dbUser?.username || accessData.user.email?.split('@')[0],
      },
    })
  }

  if (refresh) {
    const { data: refreshData, refreshError } =
      await supabase.auth.refreshSession({ refresh_token: refresh })
    if (refreshError) {
      return res.status(401).json({ error: 'Session expired' })
    }
    const newSession = refreshData.session

    const { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', newSession.user.id)
      .single()

    return res.json({
      user: {
        id: newSession.user.id,
        email: newSession.user.email,
        username: dbUser?.username || newSession.user.email?.split('@')[0],
      },
    })
  }
  return res.status(401).json({ error: 'Not Authenticated' })
})

Router.post('/update-username', async (req, res) => {
  const { username } = req.body
  const { foundUser } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()
  if (foundUser) {
    return res
      .status(400)
      .json({ error: 'User already exists with this username' })
  }
  await supabase.from('users').update('username', username)
  return res.json({ ok: true })
})

Router.post('/logout', (req, res) => {
  res.clearCookie('sb_access')
  res.clearCookie('sb_refresh')
  res.json({ ok: true })
})

export default Router
