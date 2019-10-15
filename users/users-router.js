const express = require('express');
const bcrypt = require('bcryptjs');

const Users = require('./users-model');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("It's Alive!")
})

router.get('/users', protected, (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

//Creates a user using the information sent inside the body of the request. 
//Hash the password before saving the user to the database.
router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10) //hash the password
    user.password = hash; //override the password with the hash
    Users.add(user)
    .then(saved => {
        res.status(201).json(saved)
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

router.post('/login', (req, res) => {
    let {username, password} = req.body;
    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                console.log('login:', req.session)
                res.status(200).json({ message: `Welcome ${user.username}!` });
              } else {
                res.status(401).json({ message: 'You shall not pass!' });
              }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get('/logout', (req, res) => {
    if(req.session) {
      req.session.destroy(err => {
        res.status(200).json({message: 'you can checkout'})
      });
    }
})
//middleware
function protected (req, res, next) {
    // let {username, password} = req.headers;
    // if (username && password) {
    // Users.findBy({ username })
    //     .first()
    //     .then(user => {
    //         if (user && bcrypt.compareSync(password, user.password)) {
    //             next();
    //           } else {
    //             res.status(401).json({ message: 'You shall not pass!' });
    //           }
    //     })
    //     .catch(error => {
    //         res.status(500).json(error);
    //     });
    // } else {
    //     res.status(400).json({mesage: 'please provide credentials'})
    // }   
    console.log('request:', req.session)
    if(req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'You cannot pass' });
    }
}

module.exports = router;