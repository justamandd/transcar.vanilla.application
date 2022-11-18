require('../db.connection');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 8080;

const usersController = require('./controllers/users.controller');
const routes = require('./routes/index');

app.use(cors()); 
app.use(express.json());
app.use(routes);

/*
Geração de código aleatório:

slice(2) ==> código de 11 chars
slice(13) ==> um único char

 Math.random().toString(36).slice(2);
*/

app.get('/', async (req, res) => {
    res.send('Você está acessando a API!');
})

app.listen(port, () => console.log('App running on port http://localhost:' + port));