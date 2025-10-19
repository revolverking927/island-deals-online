const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

const app = express();

// Knex / Postgres config
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '12.comQw',
    database : 'islanddeals'
  }
});

const initialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(initialPath));

// Root
app.get('/', (req, res) => {
  res.sendFile(path.join(initialPath, "index.html"));
});

// ------------------- REGISTER ROUTE -------------------
app.post("/register", async (req, res) => {
  const { role, name, parish, company_name, email, password } = req.body;

  if (!role || !email || !password) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    if (role === "consumer") {
        console.log("te");
      // Validate consumer-specific fields
      if (!name || !parish) {
        return res.status(400).json({ error: "Missing consumer information (name or parish)." });
      }

      // Insert consumer and return inserted row
      const inserted = await db('consumers')
        .insert({
          name,
          email,
          password,
          parish
        })
        .returning('*');

      const user = inserted[0];
      // auto-login (redirect to consumer discounts with parish param)
      return res.redirect(`/consumer_dashboard.html?parish=${encodeURIComponent(user.parish)}`);

    } else if (role === "manufacturer") {
      // Validate manufacturer-specific fields
      if (!company_name) {
        return res.status(400).json({ error: "Missing manufacturer information (company_name)." });
      }

      const inserted = await db('manufacturers')
        .insert({
          company_name,
          email,
          password
        })
        .returning('*');

      const user = inserted[0];
      console.log(123);
      // auto-login (redirect to manufacturer dashboard)
      return res.redirect('/manufacturer_dashboard.html');
    } else {
      return res.status(400).json({ error: "Invalid role selected." });
    }
  } catch (err) {
    console.error("Register error:", err);
    // If unique constraint / duplicate email etc. return meaningful message
    return res.status(500).json({ error: "Server error. Possibly email already exists." });
  }
});

// ------------------- LOGIN ROUTE -------------------
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing login fields." });
  }

  try {
    let user;
    if (role === "consumer") {
      user = await db('consumers').where({ email }).first();
      if (!user) return res.status(400).json({ error: "Consumer not found." });

      const match = password === user.password;
      if (!match) return res.status(400).json({ error: "Incorrect password." });

      // Successful login -> redirect to consumer_discounts.html with parish
      return res.redirect(`/consumer_dashboard.html?parish=${encodeURIComponent(user.parish)}`);

    } else if (role === "manufacturer") {
      user = await db('manufacturers').where({ email }).first();
      if (!user) return res.status(400).json({ error: "Manufacturer not found." });

      const match = password === user.password;
      if (!match) return res.status(400).json({ error: "Incorrect password." });

      // Successful login -> redirect to manufacturer dashboard
      return res.redirect('/manufacturer_dashboard.html');
    } else {
      return res.status(400).json({ error: "Invalid role selected." });
    }

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

// ------------------- GET DISCOUNTS FOR A PARISH -------------------
app.get("/api/discounts", async (req, res) => {
  const { parish, search } = req.query;
  if (!parish) return res.status(400).json({ error: "Parish is required." });

  try {
    let query = db('discounts').where({ parish }).select(
      'discount_id', // include for identification if needed
      'title',
      'reason',
      'valid_until',
      'product',
      'original_price',
      'discounted_price'
    );

    // optional keyword search in title
    if (search && search.trim() !== '') {
      query = query.andWhere('title', 'ilike', `%${search.trim()}%`);
    }

    const discounts = await query;
    return res.json(discounts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
});


app.post('/api/add-discount', async (req, res) => {
  const { parish, title, reason, valid_until, manufacturer_id, product, original_price, discounted_price } = req.body;

  if (!parish || !title || !reason || !valid_until || !manufacturer_id || !product || !original_price || !discounted_price) {
    return res.status(400).json({ message: 'All fields are required including manufacturer_id.' });
  }

  try {
    await db('discounts').insert({
      manufacturer_id,
      parish,
      title,
      reason,
      valid_until,
      product,
      original_price,
      discounted_price
    });
    return res.json({ message: 'Discount added successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

app.get('/api/all-discounts', async (req, res) => {
  try {
    const discounts = await db('discounts').select('discount_id', 'product','original_price','discounted_price','parish', 'title', 'reason', 'valid_until');
    return res.json(discounts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// get discounts posted by a specific manufacturer
app.get('/api/manufacturer/discounts', async (req, res) => {
  const { manufacturer_id } = req.query;
  if (!manufacturer_id) return res.status(400).json({ error: "Missing manufacturer id" });

  try {
    const discounts = await db('discounts')
      .where({ manufacturer_id })
      .select('discount_id', 'product','original_price','discounted_price','parish', 'title', 'reason', 'valid_until');

    return res.json(discounts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.get('/products', async (req, res) => {
    try {
        const manufacturerId = req.user.id; // assuming authentication middleware
        const searchQuery = req.query.search || '';

        const products = await db('products')
            .where('manufacturer_id', manufacturerId)
            .andWhere('title', 'ilike', `%${searchQuery}%`)
            .select('id', 'title', 'original_price', 'discounted_price', 'valid_until');

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all discounts/products for a manufacturer
app.get('/api/manufacturer/products/:manufacturer_id', async (req, res) => {
  const { manufacturer_id } = req.params;

  try {
    const products = await knex('manufacturer_discounts')
      .where({ manufacturer_id })
      .orderBy('created_at', 'desc');

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


// ------------------- DELETE DISCOUNT -------------------
app.delete('/api/discount/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  // manufacturer_id can be sent in body or query (fallback)
  const manufacturer_id = req.body?.manufacturer_id || req.query?.manufacturer_id;

  if (!id || !manufacturer_id) {
    return res.status(400).json({ error: "Missing discount id or manufacturer_id" });
  }

  try {
    const discount = await db('discounts').where({ discount_id: id }).first();
    if (!discount) return res.status(404).json({ error: "Discount not found" });

    if (parseInt(discount.manufacturer_id, 10) !== parseInt(manufacturer_id, 10)) {
      return res.status(403).json({ error: "Unauthorized: not your discount" });
    }

    await db('discounts').where({ discount_id: id }).del();
    return res.json({ message: "Discount deleted successfully" });
  } catch (err) {
    console.error("Delete discount error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});


// ------------------- CURRENT USER (checks both tables) -------------------
app.get('/current-user', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "No email provided" });

  try {
    let user = await db('consumers').where({ email }).first();
    if (user) {
      if (user.password) delete user.password;
      return res.json({
        role: "consumer",
        consumer_id: user.consumer_id,
        name: user.name,
        email: user.email,
        parish: user.parish
      });
    }

    user = await db('manufacturers').where({ email }).first();
    if (user) {
      if (user.password) delete user.password;
      return res.json({
        role: "manufacturer",
        manufacturer_id: user.manufacturer_id,
        company_name: user.company_name,
        email: user.email
      });
    }

    return res.status(404).json({ error: "User not found" });
  } catch (err) {
    console.error("Current-user error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}.......`);
});
