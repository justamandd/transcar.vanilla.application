require('../db.connection');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 8080;

const usersController = require('./controllers/users.controller');

app.use(cors()); 
app.use(express.json());

/*
Geração de código aleatório:

slice(2) ==> código de 11 chars
slice(13) ==> um único char

 Math.random().toString(36).slice(2);
*/

app.get('/', async (req, res) => {
    res.send('Você está acessando a API!');
})

app.get('/users', async (req, res, next) => {
    try {
        const users = await usersController.list('users').then(res => res);

        res.send(users.rows);    
    } catch (error) {
        next(error)
    }
});

app.get('/users/:name', async (req, res, next) => {
    const { name } = req.params;

    try {
        const user = await usersController.search('users', name).then(res => res);

        res.send(user.rows[0]);    
    } catch (error) {
        next(error)
    }
});

app.post('/users', async (req, res, next) => {
    const { id, name } = req.body;

    try {
        const user = await usersController.insert('users', { id, name }).then(res => res);
        
        res.send(user.rows[0]);
    } catch (error) {
        
    }

});

app.put('/users/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const user = await usersController.update('users', { id, name }).then(res => res);

        res.send(user.rows[0]);
    } catch (error) {
        next(error);
    }
});

app.delete('/users/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await usersController.delete('users', id).then(res => res);

        res.send(user);
    } catch (error) {
        next(error);
    }
})

app.listen(port, () => console.log('App running on port http://localhost:' + port));