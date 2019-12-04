const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const register = require('./controllers/register')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'smartbrain'
    }
  });

//users = db.select('*').from('users').then(data => data.json()));

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
 const { email, password} = req.body;
 if(!email || !password){
    return res.status(400).json('incorrect submission')
}
 db.select('*').from('login')
 .where('email', '=', email)
 .then(data => {
     const isValid = bcrypt.compareSync(password, data[0].hash);
     if(isValid){
         return db.select('*').from('users')
         .where('email', '=', email)
         .then(user => {
             res.json(user[0])
         })
         .catch(err => res.status(400).json('unable to get user'))
     } else {
         res.status(400).json('invalid credentials')
     }
 })
 .catch(err => res.status(400).json('invalid credentials'))
})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db('users').where('id', id).then(user => {
       if(user.length){
            res.json(user[0])  
       }else{
           res.status(400).json('not found')
       }
    })
    .catch(err => ("error getting user"))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('unable to get entry'))
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
});