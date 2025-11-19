import express from 'express';
import supabase from '../utils/supabase.js';

const Router = express.Router();

Router.get('/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;

        const { data, error } = await supabase
            .from('credentials')
            .select('*')
            .eq('user_id', user_id)
            .order('date', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.json({ credentials: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
Router.post('/addCredential', async (req, res) => {
    try {
        const { user_id, app, username, password } = req.body;
        const { data, error } = await supabase
            .from('credentials')
            .insert([{ user_id, app, username, password }])
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json({ credentials: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.post('/updateCredential/:id', async (req, res) => {
    try {
        const { user_id, app, username, password } = req.body;
        const credentialId = req.params;
        const { data, error } = await supabase
            .from('credentials')
            .update([{ user_id, app, username, password }])
            .eq('id', credentialId)
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json({ credentials: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

Router.put('/editCredential/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { app, username, password } = req.body;

        const { data, error } = await supabase
            .from('credentials')
            .update({ app, username, password })
            .eq('id', id)
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json({ credentials: data });
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
        res.json({ message: 'Credential deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default Router;
