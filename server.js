const express = require('express');
const path = require('path'); //path allow the code to know the files locations
const bodyParser = require('body-parser'); //body-parser allow the code to send and recieve data
const knex = require('knex'); //knex will allow the cde to access the database(farmlink)

const app = express();

let initialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(path.join(initialPath)));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
})

app.listen(3000, (req, res) => {
    console.log('listening on port 3000.......')
})
const bcrypt = require('bcrypt'); // for password hashing

// Make sure knex is configured correctly
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1', // or your db host
    user : 'your_db_user',
    password : 'your_db_password',
    database : 'your_db_name'
  }
});

// ------------------- REGISTER ROUTE -------------------
app.post("/register", async (req, res) => {
    const { role, firstname, lastname, parish, company_name, address, contact_number, email, password } = req.body;

    if (!role || !email || !password) {
        return res.status(400).send("Missing required fields.");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // hash password

        if (role === "consumer") {
            // Validate required consumer fields
            if (!firstname || !lastname || !parish || !address) {
                return res.status(400).send("Missing consumer information.");
            }

            // Insert into consumers table
            await db('consumers').insert({
                firstname,
                lastname,
                email,
                password: hashedPassword,
                parish,
                address
            });

            return res.send("Consumer registered successfully!");

        } else if (role === "manufacturer") {
            // Validate required manufacturer fields
            if (!company_name || !address) {
                return res.status(400).send("Missing manufacturer information.");
            }

            // Insert into manufacturers table
            await db('manufacturers').insert({
                company_name,
                email,
                password: hashedPassword,
                address,
                contact_number
            });

            return res.send("Manufacturer registered successfully!");
        } else {
            return res.status(400).send("Invalid role selected.");
        }

    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error. Possibly email already exists.");
    }
});
// ------------------- LOGIN ROUTE -------------------
app.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).send("Missing login fields.");
    }

    try {
        let user;

        if (role === "consumer") {
            user = await db('consumers').where({ email }).first();
            if (!user) return res.status(400).send("Consumer not found.");
        } else if (role === "manufacturer") {
            user = await db('manufacturers').where({ email }).first();
            if (!user) return res.status(400).send("Manufacturer not found.");
        } else {
            return res.status(400).send("Invalid role selected.");
        }

        // Compare hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).send("Incorrect password.");

        // Redirect based on role
        if (role === "consumer") {
            // Pass parish in query to filter discounts
            return res.redirect(`/consumer/discounts?parish=${user.parish}`);
        } else if (role === "manufacturer") {
            return res.redirect("/manufacturer_dashboard.html"); // placeholder page
        }

    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error.");
    }
});
// ------------------- GET DISCOUNTS FOR A PARISH -------------------
app.get("/api/discounts", async (req, res) => {
    const { parish } = req.query;

    if (!parish) return res.status(400).json({ error: "Parish is required." });

    try {
        const discounts = await db('discounts').where({ parish }).select('title', 'reason', 'valid_until');
        return res.json(discounts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error." });
    }
});
// Add a new discount
app.post('/api/add-discount', async (req, res) => {
    const { parish, title, reason, valid_until } = req.body;

    if (!parish || !title || !reason || !valid_until) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        await db('discounts').insert({ parish, title, reason, valid_until });
        return res.json({ message: 'Discount added successfully!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error.' });
    }
});
app.get('/api/all-discounts', async (req, res) => {
    try {
        const discounts = await db('discounts').select('parish', 'title', 'reason', 'valid_until');
        return res.json(discounts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error.' });
    }
});
