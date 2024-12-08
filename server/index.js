const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const app = express();
const port = 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Database connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "web_prog",
  password: "postgres",
  port: 5432,
});

// Session configuration
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "user_sessions",
    }),
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Routes

// User registration
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    //const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, password]
      //[username, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      // if (await bcrypt.compare(password, user.password)) {
      if (await password ==  user.password) {  
        req.session.userId = user.id;
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// User logout
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Could not log out" });
    } else {
      res.json({ message: "Logout successful" });
    }
  });
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new product
app.post("/api/products", isAuthenticated, async (req, res) => {
  const { name, description, price, image_url } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO products (name, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, image_url]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Update a product
app.put("/api/products/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, image_url = $4 WHERE id = $5 RETURNING *",
      [name, description, price, image_url, id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product
app.delete("/api/products/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM products WHERE id = $1",
      [id]
    );
    if (rowCount > 0) {
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Get all news
app.get("/api/news", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM news ORDER BY date_published DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a news item
app.post("/api/news", isAuthenticated, async (req, res) => {
  const { title, content, date_published } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO news (title, content, date_published) VALUES ($1, $2, $3) RETURNING *",
      [title, content, date_published]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add news" });
  }
});

// Update a news item
app.put("/api/news/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { title, content, date_published } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE news SET title = $1, content = $2, date_published = $3 WHERE id = $4 RETURNING *",
      [title, content, date_published, id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "News not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update news" });
  }
});

// Delete a news item
app.delete("/api/news/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query("DELETE FROM news WHERE id = $1", [
      id,
    ]);
    if (rowCount > 0) {
      res.json({ message: "News deleted successfully" });
    } else {
      res.status(404).json({ error: "News not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete news" });
  }
});

// Get all orders
app.get("/api/orders", isAuthenticated, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM orders ORDER BY order_date DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new order
app.post("/api/orders", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    product,
    quantity,
    comments,
  } = req.body;

  try {
    // Вставка заказа в базу данных
    const { rows } = await pool.query(
      "INSERT INTO orders (first_name, last_name, email, phone, address, product_id, quantity, comments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        firstName,
        lastName,
        email,
        phone,
        address,
        product,
        quantity,
        comments,
      ]
    );

    // Здесь формируем тело письма
    const orderData = {
      name: firstName,
      lastName: lastName,
      phone: phone,
      address: address,
      product: product, // Предполагается, что это ID продукта
      quantity: quantity,
      comments: comments,
    };

    // Отправка email через EmailJS
    await emailjs.send("service_fga11wz", "template_ecxbrns", {
      name: orderData.name,
      lastName: orderData.lastName,
      phone: orderData.phone,
      address: orderData.address,
      product: orderData.product,
      quantity: orderData.quantity,
      comments: orderData.comments,
    });

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add order" });
  }
});

// Delete an order
app.delete("/api/orders/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query("DELETE FROM orders WHERE id = $1", [
      id,
    ]);
    if (rowCount > 0) {
      res.json({ message: "Order deleted successfully" });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});



// Получение списка администраторов
app.get("/api/admins", async (req, res) => {
  try {
    const admins = await pool.query("SELECT id, username, created_at FROM users");
    res.json(admins.rows);
  } catch (error) {
    console.error("Ошибка при получении администраторов:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Регистрация нового администратора
app.post("/api/admin/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, password]
      // [username, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Редактирование администратора
app.put("/api/admins/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    // const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const updateQuery = `
      UPDATE users 
      SET username = COALESCE($1, username), 
          password = COALESCE($2, password)
      WHERE id = $3
      RETURNING id, username, created_at
    `;
    // const updatedAdmin = await pool.query(updateQuery, [username, hashedPassword, id]);
    const updatedAdmin = await pool.query(updateQuery, [username, password, id]);

    if (updatedAdmin.rows.length === 0) {
      return res.status(404).json({ error: "Администратор не найден" });
    }
    res.json(updatedAdmin.rows[0]);
  } catch (error) {
    console.error("Ошибка при редактировании администратора:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Удаление администратора
app.delete("/api/admins/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteQuery = "DELETE FROM users WHERE id = $1 RETURNING id";
    const deletedAdmin = await pool.query(deleteQuery, [id]);

    if (deletedAdmin.rows.length === 0) {
      return res.status(404).json({ error: "Администратор не найден" });
    }
    res.json({ message: "Администратор удален" });
  } catch (error) {
    console.error("Ошибка при удалении администратора:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
  