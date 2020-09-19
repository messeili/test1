'use strict'
//dependencies
const dotenv = require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

//Routes
app.get('/', homePageHandler);
app.post('/addJokes', addJokes);
app.get('/favJokes', favJokesPage)
app.get('/joke/:id', jokeDetails)
app.put('/updateJoke/:id', updateJoke);
app.delete('/deleteJoke/:id', deleteJoke);
app.get('/ranJokes', ranJokes);






//functions
function homePageHandler(req, res) {
    let url = `https://official-joke-api.appspot.com/jokes/programming/ten`;
    superagent.get(url)
        .then(results => {
            console.log(results.body);
            res.render('pages/homepage', { data: results.body });
        })
}
function addJokes(req, res) {
    let { id, type, setup, punchline } = req.body;
    let SQL = `INSERT INTO test1 (id,type,setup,punchline) VALUES ($1,$2,$3,$4);`;
    let VALUES = [id, type, setup, punchline];
    client.query(SQL, VALUES)
        .then(() => {
            res.redirect('/favJokes')
        })

}

function favJokesPage(req, res) {
    let SQL = `SELECT * FROM test1;`
    client.query(SQL)
        .then((results => {
            res.render('pages/favJokes', { data: results.rows });
        }))
}

function jokeDetails(req, res) {
    let id = req.params.id;
    let SQL = `SELECT * FROM test1 WHERE idp=$1;`;
    let VALUES = [id];
    client.query(SQL, VALUES)
        .then((results) => {
            res.render('pages/jokesDetails', { data: results.rows[0] });
        })

}

function deleteJoke(req, res) {
    let id = req.params.id;
    let SQL = ` DELETE FROM test1 WHERE idp=$1;`;
    let VALUES = [id];
    client.query(SQL, VALUES)
        .then(() => {
            res.redirect('/favJokes')
        })
}


function updateJoke(req, res) {
    let idp = req.params.id;
    let { id, type, setup, punchline } = req.body;
    let SQL = ` UPDATE test1 SET id=$1,type=$2,setup=$3,punchline=$4 WHERE idp=$5;`;
    let VALUES = [id, type, setup, punchline, idp];
    client.query(SQL, VALUES)
        .then(() => {
            res.redirect(`/joke/${idp}`)
        })
}

function ranJokes(req, res) {
    let url = `https://official-joke-api.appspot.com/jokes/programming/random`
    superagent.get(url)
        .then((results) => {
            res.render('pages/ranJokes', { data: results.body[0] })
        })
}


client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`listening to PORT: ${PORT}`);
    })
});


