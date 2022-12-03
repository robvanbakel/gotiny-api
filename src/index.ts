import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import redirectCode from './routes/redirectCode';
import resolveCodeToLink from './routes/resolveCodeToLink';
import generateCode from './routes/generateCode';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Redirect user to original URL
app.get('/:id', (req, res) => redirectCode(req, res));

// Return original URL in plain text
app.get('/api/:id', (req, res) => resolveCodeToLink(req, res));

// Generate new GoTiny link
app.post('/api', (req, res) => generateCode(req, res));

app.listen(process.env.PORT, () => console.log(`GoTiny running on port ${process.env.PORT}`));
