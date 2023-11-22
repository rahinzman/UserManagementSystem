const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//parsing middle layers
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

// templating engine
const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

//connection pool

const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    port            : 3306,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});
  
// Connect to db
pool.getConnection((err, connection) =>{
    if(err) throw err;
    console.log('Connected as ID ' + connection.threadId);
})

//router
const routes = require('./server/routes/user');
app.use('/', routes)

app.listen(port, () => console.log(`listening on port ${port}`));
