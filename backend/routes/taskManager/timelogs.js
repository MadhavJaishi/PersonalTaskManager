import supabase from '../../utils/supabase.js';
import express from 'express';
const Router = express.Router();

Router.post('/', async (req, res) => {
    try {
        const { user_id, task_id, start_time, end_time, total_time } = req.body;
        const effectiveUserId = req.user?.id || user_id;
        const date = new Date().toISOString();
        const { data, error } = await supabase
            .from('timelogs')
            .insert([{ user_id: effectiveUserId, task_id, start_time, end_time, total_time, date }])
            .select()
            .single();
        if (error) return res.status(400).json({ error: error.message });
        res.json({ timelog: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.get('/:user_id?', async (req, res) => {
    try {
        const userId = req.user?.id || req.params.user_id || req.query.user_id;
        let query = supabase.from('timelogs').select('*');
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query.order('date', { ascending: false });
        if (error) return res.status(400).json({ error: error.message });
        res.json({ timelogs: data || [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default Router;