import supabase from '../../utils/supabase.js';
import express from 'express';
const Router = express.Router();

// Helper to get effective user_id
const getUserId = (req) => {
    const rawId = req.user?.id || req.body?.user_id || req.params?.user_id || req.query?.user_id;
    if (!rawId || rawId === '0' || rawId === 0 || rawId === 'null' || rawId === 'undefined') {
        return null;
    }
    return rawId;
};

// Create Task
Router.post('/addTask', async (req, res) => {
    try {
        const { user_id, title, description, notes, targetDuration, priority, category, due_date } = req.body;
        const effectiveUserId = getUserId(req);

        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Task title is required' });
        }

        const taskPayload = {
            ...(effectiveUserId && { user_id: effectiveUserId }),
            title: title.trim(),
            description: description || '',
            notes: notes || '',
            targetDuration: Number(targetDuration) || 0,
            timeSpent: 0,
            priority: priority !== undefined && priority !== null ? String(priority) : '1',
        };

        // Try inserting full payload with extended fields
        let { data, error } = await supabase
            .from('tasks')
            .insert([{
                ...taskPayload,
                is_completed: false,
                ...(category && { category }),
                ...(due_date && { due_date })
            }])
            .select()
            .single();

        // If insert fails due to column schema mismatch (e.g. missing is_completed/category columns), fallback to basic payload
        if (error) {
            console.error('Supabase addTask insert error, trying fallback payload:', error.message);
            const fallbackResult = await supabase
                .from('tasks')
                .insert([taskPayload])
                .select()
                .single();
            data = fallbackResult.data;
            error = fallbackResult.error;
        }

        if (error) {
            console.error('Supabase addTask final error:', error);
            return res.status(400).json({ error: error.message });
        }

        res.json(data);
    } catch (err) {
        console.error('addTask exception:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get today's tasks
Router.get('/today/:user_id?', async (req, res) => {
    try {
        const userId = getUserId(req);
        let query = supabase.from('tasks').select('*');

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('GET /tasks/today error:', error.message);
            return res.status(400).json({ error: error.message });
        }
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all tasks (supports search, priority, is_completed filters)
Router.get('/:user_id?', async (req, res) => {
    try {
        const userId = getUserId(req);
        const { search, priority } = req.query;

        let query = supabase.from('tasks').select('*');

        if (userId) {
            query = query.eq('user_id', userId);
        }
        if (priority && priority !== 'All') {
            const match = priority.match(/\d+/);
            const pNum = match ? match[0] : priority;
            query = query.eq('priority', pNum);
        }
        if (search) {
            query = query.ilike('title', `%${search}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('GET /tasks error:', error.message);
            return res.status(400).json({ error: error.message });
        }
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

        let { data, error } = await supabase
            .from('tasks')
            .update({
                ...updateData,
                ...(is_completed !== undefined && { is_completed: Boolean(is_completed) }),
                ...(category !== undefined && { category }),
                ...(due_date !== undefined && { due_date })
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('PUT /tasks update fallback:', error.message);
            const fallback = await supabase
                .from('tasks')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            data = fallback.data;
            error = fallback.error;
        }

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
            .select('*')
            .eq('id', id)
            .single();

        if (fetchErr) return res.status(400).json({ error: fetchErr.message });

        const nextState = !existingTask.is_completed;

        let { data, error } = await supabase
            .from('tasks')
            .update({ is_completed: nextState })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            res.json({ ...existingTask, is_completed: nextState });
            return;
        }

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