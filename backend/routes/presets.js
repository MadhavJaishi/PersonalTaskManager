import supabase from '../utils/supabase.js';
import express from 'express';
const Router = express.Router();

Router.post('/', async (req, res) => {
    const { user_id, title, description, notes, targetDuration } = req.body;
    const { data, error } = await supabase
        .from('presets')
        .insert([{ user_id, title, settings }])
        .select()
        .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ preset: data });
});

Router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { data, error } = await supabase
        .from('presets')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ presets: data });
});

export default Router;