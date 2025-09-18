import supabase from '../utils/supabase.js';
import express from 'express';
const Router = express.Router();

Router.post('/', async (req, res) => {
    const { user_id, task_id, start_time, end_time, total_time } = req.body;
    const date = new Date().toISOString();
    const { data, error } = await supabase
        .from('reflections')
        .insert([{ user_id, task_id, start_time, end_time, total_time, date }])
        .select()
        .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ reflection: data });
});

export default Router;