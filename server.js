const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'password',
        database: 'test'
    }
})

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date(),
        },
        {
            id: "124",
            name: "Sally",
            email: "sally@gmail.com",
            password: "bananas",
            entries: 0,
            joined: new Date(),
        },
    ],
};
app.get("/", (req, res) => {
    res.send(database.users);
});

app.post("/signin", (req, res) => {
    if (
        req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password
    ) {
        res.json(database.users[0]);
    } else {
        res.status(400).json("error logging in");
    }
    res.json("signing");
});

app.post("/register", (req, res) => {
    const { email, name } = req.body;
    db('users').returning('*').insert({
        email: email,
        name: name, 
        joined: new Date()
    }).then(users => res.json(users[0])).catch(err => res.status(400).json('unable to register'))
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id
    }).then(users => {
        if (users.length) {
res.json((users[0]))
        } else {
            res.status(400).json('Not found')
        }
        
    })
    .catch(err => res.status(400).json('error getting user'))
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    database.users.forEach((user) => {
        if (user.id === id) {
            user.entries++;
            return res.json(user.entries);
        }
    });
    res.status(404).json("no such user");
});

app.listen(3000, () => {
    console.log("App is running");
});
