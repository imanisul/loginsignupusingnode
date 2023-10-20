  const express = require('express');
  const app = express();


  
  app.use(express.json());


  const authRouter = require('./router/authRoute.js');
  const databaseconnect = require('./config/databaseConfig.js');
  const CookieParser = require('cookie-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
  // connect to db
  databaseconnect();

  app.use(express.json());
  app.use(cookieParser());

  app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
 }))
  // Auth router
  app.use('/api/auth', authRouter);


  app.use('/', (req, res) => {
    res.status(200).json({ data: 'JWTauth server ;)' });
  });

  module.exports = app;