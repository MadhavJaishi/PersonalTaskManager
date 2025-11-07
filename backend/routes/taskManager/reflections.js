import supabase from '../../utils/supabase.js';
import express from 'express';
const Router = express.Router();

Router.post('/addReflection', async (req, res) => {
    const { user_id, content, mood } = req.body;
    const date = new Date().toISOString();
    const { data, error } = await supabase
        .from('reflections')
        .insert([{ user_id, content, mood, date }])
        .select()
        .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ reflection: data });
});

Router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { data, error } = await supabase
        .from('reflections')
        .update({ content, mood })
        .eq('id', id)
        .select()
        .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ reflection: data });
});

export default Router;

// I need to create enums for mood on the frontend.

// I need to create enums for tags and categories for tasks.