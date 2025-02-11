import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';

import routers from './routes';

const { PORT = 3000, BASE_PATH, MONGO_URI } = process.env;
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(`${MONGO_URI}/mynewdb`);

app.use('/', routers);

app.listen(PORT, () => {
  console.log(BASE_PATH);
});
