import supabase from '../../utils/supabase.js';
import express from 'express';
const Router = express.Router();

Router.post('/addReflection', async (req, res) => {
    try {
        const { user_id, content, mood, date } = req.body;
        const effectiveUserId = req.user?.id || user_id;
        const reflectionDate = date || new Date().toISOString();

        const { data, error } = await supabase
            .from('reflections')
            .insert([{ user_id: effectiveUserId, content, mood, date: reflectionDate }])
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json({ reflection: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.get('/:user_id?', async (req, res) => {
    try {
        const userId = req.user?.id || req.params.user_id || req.query.user_id;
        let query = supabase.from('reflections').select('*');
        if (userId) query = query.eq('user_id', userId);

        const { data, error } = await query.order('date', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.json({ reflections: data || [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { content, mood } = req.body;

        const { data, error } = await supabase
            .from('reflections')
            .update({ content, mood })
            .eq('id', id)
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json({ reflection: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('reflections')
            .delete()
            .eq('id', id);

        if (error) return res.status(400).json({ error: error.message });
        res.json({ success: true, message: 'Reflection deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default Router;