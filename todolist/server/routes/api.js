const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Register new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, userId: user.id });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Get tasks for a user
router.get('/tasks/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('Fetching tasks for userId:', userId);
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 AND completed = false', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add a task for a user
router.post('/tasks', async (req, res) => {
  const { userId, description } = req.body;
  console.log('Adding task for userId:', userId, 'Description:', description);
  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, description, completed) VALUES ($1, $2, $3) RETURNING *',
      [userId, description, false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a task's completion status
router.put('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { completed } = req.body;
  console.log('Updating taskId:', taskId, 'to completed:', completed);
  try {
    const result = await pool.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, taskId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
router.delete('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  console.log('Deleting taskId:', taskId);
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [taskId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
