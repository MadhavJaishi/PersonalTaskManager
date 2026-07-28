import supabase from '../../utils/supabase.js';
import express from 'express';
const Router = express.Router();

// Helper to get effective user_id
const getUserId = (req) => {
    return req.user?.id || req.body?.user_id || req.params?.user_id || req.query?.user_id;
};

// Create Task
Router.post('/addTask', async (req, res) => {
    try {
        const { user_id, title, description, notes, targetDuration, priority, category, due_date } = req.body;
        const effectiveUserId = req.user?.id || user_id;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Task title is required' });
        }

        const taskPayload = {
            user_id: effectiveUserId,
            title: title.trim(),
            description: description || '',
            notes: notes || '',
            targetDuration: Number(targetDuration) || 0,
            timeSpent: 0,
            priority: priority !== undefined ? String(priority) : null,
            is_completed: false,
            ...(category && { category }),
            ...(due_date && { due_date })
        };

        const { data, error } = await supabase
            .from('tasks')
            .insert([taskPayload])
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get today's tasks
Router.get('/today/:user_id?', async (req, res) => {
    try {
        const userId = getUserId(req);
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

        let query = supabase
            .from('tasks')
            .select('*');

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query
            .gte('created_at', startOfDay)
            .lte('created_at', endOfDay)
            .order('created_at', { ascending: true });

        if (error) return res.status(400).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all tasks (supports search, priority, is_completed filters)
Router.get('/:user_id?', async (req, res) => {
    try {
        const userId = getUserId(req);
        const { search, priority, completed } = req.query;

        let query = supabase.from('tasks').select('*');

        if (userId) {
            query = query.eq('user_id', userId);
        }
        if (priority && priority !== 'All') {
            const match = priority.match(/\d+/);
            const pNum = match ? match[0] : priority;
            query = query.eq('priority', pNum);
        }
        if (completed !== undefined) {
            query = query.eq('is_completed', completed === 'true');
        }
        if (search) {
            query = query.ilike('title', `%${search}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Task
Router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, notes, targetDuration, timeSpent, priority, is_completed, category, due_date } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (notes !== undefined) updateData.notes = notes;
        if (targetDuration !== undefined) updateData.targetDuration = Number(targetDuration);
        if (timeSpent !== undefined) updateData.timeSpent = Number(timeSpent);
        if (priority !== undefined) updateData.priority = priority !== null ? String(priority) : null;
        if (is_completed !== undefined) updateData.is_completed = Boolean(is_completed);
        if (category !== undefined) updateData.category = category;
        if (due_date !== undefined) updateData.due_date = due_date;

        const { data, error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle completion status
Router.patch('/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;
        const { data: existingTask, error: fetchErr } = await supabase
            .from('tasks')
            .select('is_completed')
            .eq('id', id)
            .single();

        if (fetchErr) return res.status(400).json({ error: fetchErr.message });

        const nextState = !existingTask.is_completed;
        const { data, error } = await supabase
            .from('tasks')
            .update({ is_completed: nextState })
            .eq('id', id)
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Task
Router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) return res.status(400).json({ error: error.message });
        res.json({ success: true, message: 'Task deleted successfully', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default Router;