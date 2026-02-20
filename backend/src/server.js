import express from 'express';
import path from 'path';
import cors from 'cors';
import {serve} from "inngest/express"; // Import the Inngest Express middleware

import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { inngest, functions } from './config/inngest.js';

const app = express();

const __dirname=path.resolve();

app.use(express.json());
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));


app.use("/api/inngest",serve({client:inngest,functions}))


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/home", (req, res) => {
    res.send("Raman World!");
});

if(ENV.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`Server is running on port ${ENV.PORT}`);
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

startServer();