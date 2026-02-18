import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import { connect } from 'http2';
import { connectDB } from './config/db.js';

const app = express();

const __dirname=path.resolve();

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