import express from 'express';
import dotenv from 'dotenv';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, '../client');

app.use(express.static(clientPath));

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`));