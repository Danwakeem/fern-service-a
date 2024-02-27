import express from "express";
import serverless from "serverless-http";
import { register } from './generated';
import { imdb } from './routes/imdb';

const app = express();

app.use(express.json());

register(app, { imdb });

module.exports.handler = serverless(app);
