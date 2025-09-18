import supabase from '../utils/supabase.js';
import express from 'express';
const Router = express.Router();

// Step 1: Send OTP (login or signup depending on shouldCreateUser)
Router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
    });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ ok: true });
});

// Step 2: Verify OTP and forward session
Router.post('/verify-otp', async (req, res) => {
    const { username, email, token } = req.body;
    const { data, error } = await supabase.auth.verifyOtp({
        username,
        email,
        token,
        type: 'email',
    });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ session: data.session });
});

export default Router;