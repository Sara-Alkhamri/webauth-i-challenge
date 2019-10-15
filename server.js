const express = require('express');
const UsersRouter = require('./users/users-router')
const server = express();

const session = require('express-session') //import experess-session

//session object
const sessionConfig = {
    name: 'newSesh',
    secret: 'Keep it secret',
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: false,
      },
      resave: false,
      saveUninitialized: true,
}

server.use(express.json());
server.use(session(sessionConfig))

server.use('/api', UsersRouter)

module.exports = server;