const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "pakwires.sqlite");
const db = new Database(dbPath);

try {
  db.pragma("journal_mode = TRUNCATE");
} catch (error) {
  console.warn("SQLite journal mode optimization unavailable, continuing with default journal mode.");
}
db.prepare(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    product TEXT,
    quantity TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`).run();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://unpkg.com"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(cors());
app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

app.post("/api/enquiries", (req, res) => {
  const body = req.body || {};
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const company = String(body.company || "").trim();
  const product = String(body.product || "").trim();
  const quantity = String(body.quantity || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  const insert = db.prepare(`
    INSERT INTO enquiries (name, email, phone, company, product, quantity, message)
    VALUES (@name, @email, @phone, @company, @product, @quantity, @message)
  `);

  const result = insert.run({ name, email, phone, company, product, quantity, message });
  return res.status(201).json({ ok: true, enquiryId: result.lastInsertRowid });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "PakWires", database: "connected" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`PakWires site running at http://localhost:${port}`);
});
