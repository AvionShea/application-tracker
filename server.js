// This section loads modules.  It loads the Express server and stores
// it in "express", then creates a application, a router, and a path handler
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const PORT = 3000;
const dotenv = require('dotenv');
dotenv.config();

const DB_PW = process.env.POSTGRES_DB_PW;
const DB_NAME = process.env.POSTGRES_DB_NAME;

app.use(express.json());

// This part sets up the database
const { Pool } = require('pg');
// You may need to modify the password or database name in the following line:
const connectionString = `postgres://postgres:${DB_PW}@localhost/${DB_NAME}`;

const pool = new Pool({ connectionString: connectionString });

// This line says when it's looking for a file linked locally, check in sub-folder "public"
app.use(express.static(path.join(__dirname, 'public')));

// This creates a new anonymous function that runs whenever someone calls "get" on the server root "/"
router.get('/', function (req, res) {
    // It just returns a file to their browser from the same directory it's in, called tracker.html
    res.sendFile(path.join(__dirname, 'tracker.html'));
});

app.use("/", router);

// Allow Express to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/api/applications', async (req, res) => {
    console.log("Received body:", req.body);
    try {
        const {
            company_name,
            role_title,
            work_type,
            role_type,
            date_applied,
            application_method,
            job_posting_link,
            tech_stack,
            application_status,
            interview_stage,
            interview_date,
            contact_person,
            notes
        } = req.body;

        const result = await pool.query(`
        INSERT INTO applications (
          company_name, role_title, work_type, role_type, date_applied,
          application_method, job_posting_link, tech_stack,
          application_status, interview_stage, interview_date,
          contact_person, notes
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING *
      `, [
            company_name,
            role_title,
            work_type,
            role_type,
            date_applied,
            application_method,
            job_posting_link,
            tech_stack,
            application_status,
            interview_stage,
            interview_date || null,
            contact_person,
            notes
        ]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error saving job application' });
    }
});

app.get('/api/applications', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM applications ORDER BY date_applied DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving applications:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/applications/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM applications WHERE application_id = $1', [id]);
        res.sendStatus(204); // No content
    } catch (err) {
        console.error('Error deleting application:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// PATCH route to update one or more fields without replacing the entire entry
app.patch('/api/applications/:id', async (req, res) => {
    const { id } = req.params;
    const {
        application_status,
        interview_stage,
        notes,
        interview_date
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE applications
         SET application_status = $1,
             interview_stage = $2,
             notes = $3,
             interview_date = $4
         WHERE application_id = $5
         RETURNING *`,
            [application_status, interview_stage, notes, interview_date, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating application:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



let server = app.listen(PORT, () => {
    console.log(`App Server via Express is running on http://localhost:${PORT}`);
    console.log("To quit, press CTRL + C");
});