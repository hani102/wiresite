# PakWires Website

Full HTML/CSS/JS website for PakWires, a cable and copper wire supplier, with a Node/Express backend and SQLite contact enquiry database.

## Features

- Responsive PakWires landing website with product catalogue, industries, quality workflow, project supply section, and contact form.
- Interactive product filters and mobile navigation.
- Express API endpoint for contact form submissions.
- SQLite database stored at `pakwires.sqlite`.
- Security headers through Helmet.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## API

- `GET /api/health` checks backend and database connectivity.
- `POST /api/enquiries` saves a contact form enquiry.

Required fields: `name`, `email`, and `message`.
