const express = require('express');
const { Router } = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./utils/db');
const setupMiddlewares = require('./utils/middlewares');
const routes = require('./routes/__index');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());

setupMiddlewares(app);

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
