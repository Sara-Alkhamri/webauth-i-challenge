const express = require('express');
const UsersRouter = require('./users/users-router')

const session = require('express-session') //import experess-session
const KnexSessionStore = require('connect-session-knex')(session);

const knexConfig = require('./data/db-config')

const server = express();

//session object
const sessionConfig = {
    name: 'newSesh', // default would be "sid"
    secret: 'keep it secret, keep it safe!', // use an environment variable for this
    cookie: {
      httpOnly: true, // JS cannot access the cookies
      maxAge: 1000 * 60 * 60, // expiration time in milliseconds
      secure: false, // use cookie over HTTPS only. Should be true in production
    },
    resave: false,
    saveUninitialized: true, // read about GDPR compliance about cookies
  
    // change to use our database instead of memory to save the sessions
    store: new KnexSessionStore({
      knex: knexConfig,
      createtable: true, // automatically create the sessions table
      clearInterval: 1000 * 60 * 30, // delete expired sessions every 30
    }),
  };

server.use(express.json());
server.use(session(sessionConfig))

server.use('/api', UsersRouter)

module.exports = server;