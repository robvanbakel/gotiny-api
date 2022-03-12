const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Import routes
const redirectCode = require('./routes/redirectCode');
const resolveCodeToLink = require('./routes/resolveCodeToLink');
const generateCode = require('./routes/generateCode');

// Redirect user to original URL
app.get('/:id', (req, res) => redirectCode(req, res));

// Return original URL in plain text
app.get('/api/:id', (req, res) => resolveCodeToLink(req, res));

// Generate new GoTiny link
app.post('/api', (req, res) => generateCode(req, res));

// Start server
app.listen(process.env.PORT, () => console.log(`GoTiny running on port ${process.env.PORT}`));
