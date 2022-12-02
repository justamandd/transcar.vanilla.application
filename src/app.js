require('dotenv').config();
require('module-alias/register');

const config = require('@config');

const cors = require('cors');
const express = require('express');
const app = express();

const routes = require('@routes');

app.use(cors()); 
app.use(express.json());
app.use(routes);

app.get('/', async (req, res) => {
    res.send('Você está acessando a API da TRANSCAR!');
})

app.listen(config.app.port, () => console.log('App running on port http://localhost:' + config.app.port));