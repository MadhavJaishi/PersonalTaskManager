import express from 'express';
import supabase from '../../utils/supabase.js';

const Router = express.Router();

Router.get('/:user_id?', async (req, res) => {
    try {
        const userId = req.user?.id || req.params.user_id || req.query.user_id;

        let query = supabase.from('credentials').select('*');
        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.post('/addCredential', async (req, res) => {
    try {
        const { user_id, app, username, password } = req.body;
        const effectiveUserId = req.user?.id || user_id;

        if (!app || !username || !password) {
            return res.status(400).json({ error: 'App name, username/email, and password are required.' });
        }

        const { data, error } = await supabase
            .from('credentials')
            .insert([{ user_id: effectiveUserId, app, username, password }])
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.put('/editCredential/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { app, username, password } = req.body;

        const updateFields = {};
        if (app !== undefined) updateFields.app = app;
        if (username !== undefined) updateFields.username = username;
        if (password !== undefined) updateFields.password = password;

        const { data, error } = await supabase
            .from('credentials')
            .update(updateFields)
            .eq('id', id)
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.delete('/deleteCredential/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('credentials')
            .delete()
            .eq('id', id);

        if (error) return res.status(400).json({ error: error.message });
        res.json({ success: true, message: 'Credential deleted successfully', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default Router;
