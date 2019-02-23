const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : '',
      password : '',
      database : 'smart-brain'
    }
  });
 //db.select('*').from('users'); 

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    //res.send(database.users);
    db.select('*').from('users')
    .then(user => {
        if(user.length) {
              res.json(user);
        }else{
            res.status(400).json('No user Found!')
        }
    })
    .catch(err => res.status(400).json('Error getting users...'))
}
)

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) =>  {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app is running on route ${PORT}`);
});

/* 
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user (update user image detection count)
*/