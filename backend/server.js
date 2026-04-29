const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Pool Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Health Check
app.get('/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ status: 'Backend API is running', database: 'Connected' });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// ================== STUDENT ROUTES ==================

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.query('SELECT * FROM student ORDER BY id DESC');
    connection.release();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by roll_no
app.get('/api/students/:roll_no', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [student] = await connection.query('SELECT * FROM student WHERE roll_no = ?', [req.params.roll_no]);
    connection.release();
    if (student.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(student[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create student
app.post('/api/students', async (req, res) => {
  const { fullname, semester, phone_no, email, subject1, subject2, subject3, subject4, subject5, subject6 } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO student (fullname, semester, phone_no, email, subject1, subject2, subject3, subject4, subject5, subject6) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [fullname, semester, phone_no, email, subject1, subject2, subject3, subject4, subject5, subject6]
    );
    const [students] = await connection.query('SELECT * FROM student ORDER BY id DESC LIMIT 1');
    connection.release();
    res.status(201).json({ message: 'Student created', student: students[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  const { fullname, semester, phone_no, email, subject1, subject2, subject3, subject4, subject5, subject6 } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE student SET fullname=?, semester=?, phone_no=?, email=?, subject1=?, subject2=?, subject3=?, subject4=?, subject5=?, subject6=? WHERE id=?',
      [fullname, semester, phone_no, email, subject1, subject2, subject3, subject4, subject5, subject6, req.params.id]
    );
    connection.release();
    res.json({ message: 'Student updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM student WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================== EXAM ROUTES ==================

// Get all exams
app.get('/api/exams', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [exams] = await connection.query('SELECT * FROM exam ORDER BY id DESC');
    connection.release();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get exam by student_id
app.get('/api/exams/:student_id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [exam] = await connection.query('SELECT * FROM exam WHERE student_id = ?', [req.params.student_id]);
    connection.release();
    if (exam.length === 0) return res.status(404).json({ error: 'Exam data not found' });
    res.json(exam[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create exam
app.post('/api/exams', async (req, res) => {
  const { student_id, subject1, subject2, subject3, subject4, subject5, subject6 } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO exam (student_id, subject1, subject2, subject3, subject4, subject5, subject6) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [student_id, subject1 || 0, subject2 || 0, subject3 || 0, subject4 || 0, subject5 || 0, subject6 || 0]
    );
    const [exams] = await connection.query('SELECT * FROM exam WHERE student_id = ?', [student_id]);
    connection.release();
    res.status(201).json({ message: 'Exam created', exam: exams[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update exam
app.put('/api/exams/:id', async (req, res) => {
  const { subject1, subject2, subject3, subject4, subject5, subject6 } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE exam SET subject1=?, subject2=?, subject3=?, subject4=?, subject5=?, subject6=? WHERE id=?',
      [subject1, subject2, subject3, subject4, subject5, subject6, req.params.id]
    );
    connection.release();
    res.json({ message: 'Exam updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================== ATTENDANCE ROUTES ==================

// Get all attendance records
app.get('/api/attendance', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [attendance] = await connection.query('SELECT * FROM attendance ORDER BY id DESC');
    connection.release();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance by student_id
app.get('/api/attendance/:student_id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [attendance] = await connection.query('SELECT * FROM attendance WHERE student_id = ?', [req.params.student_id]);
    connection.release();
    if (attendance.length === 0) return res.status(404).json({ error: 'Attendance record not found' });
    res.json(attendance[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create attendance record
app.post('/api/attendance', async (req, res) => {
  const { student_id, subject1, subject2, subject3, subject4, subject5, subject6 } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO attendance (student_id, subject1, subject2, subject3, subject4, subject5, subject6) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [student_id, subject1 || 0, subject2 || 0, subject3 || 0, subject4 || 0, subject5 || 0, subject6 || 0]
    );
    const [records] = await connection.query('SELECT * FROM attendance WHERE student_id = ?', [student_id]);
    connection.release();
    res.status(201).json({ message: 'Attendance created', attendance: records[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================== DASHBOARD ROUTES ==================

// Get dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [[{ total_students }]] = await connection.query('SELECT COUNT(*) AS total_students FROM student');
    const [[ { avg_grade }]] = await connection.query('SELECT AVG(CAST(SUBSTRING(grade, 1, 1) AS UNSIGNED)) AS avg_grade FROM exam');
    const [[{ total_fine }]] = await connection.query('SELECT COALESCE(SUM(total_fine), 0) AS total_fine FROM attendance');
    connection.release();
    res.json({ total_students, avg_grade: avg_grade || 0, total_fine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student report with exam and attendance
app.get('/api/dashboard/report', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [report] = await connection.query(`
      SELECT 
        s.id,
        s.roll_no,
        s.fullname,
        s.semester,
        e.total,
        e.percentage,
        e.grade,
        a.total_fine,
        a.dropout_subjects
      FROM student s
      LEFT JOIN exam e ON s.id = e.student_id
      LEFT JOIN attendance a ON s.id = a.student_id
      ORDER BY s.id DESC
    `);
    connection.release();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`? Backend API running on port ${PORT}`);
  console.log(`?? Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});