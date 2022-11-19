require('../db.connection');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 8080;

const routes = require('./routes/index');

app.use(cors()); 
app.use(express.json());
app.use(routes);

app.get('/', async (req, res) => {
    res.send('Você está acessando a API!');
})

app.listen(port, () => console.log('App running on port http://localhost:' + port));