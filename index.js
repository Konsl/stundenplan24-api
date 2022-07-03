import express from 'express';
import APIRouter from './api/api-router.js';
import cors from 'cors';
import compression from 'compression';

const app = express();
app.use(cors())
app.use(compression())
app.use("/api", APIRouter);
app.listen(80);