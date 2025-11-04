import supabase from '../utils/supabase.js';
import express from 'express';
const Router = express.Router();

Router.post('/addTask', async (req, res) => {
    const { user_id, title, description, notes, targetDuration } = req.body;
    const { data, error } = await supabase
        .from('tasks')
        .insert([{ user_id, title, description, notes, targetDuration, timeSpent: 0 }])
        .select()
        .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ task: data });
});

Router.get('/today:user_id', async (req, res) => {
    const { user_id } = req.params;
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(now.setHours(23, 59, 59, 999)).toISOString();
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user_id)
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .order('created_at', { ascending: true });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ tasks: data });
});

Router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ tasks: data });
});

export default Router;