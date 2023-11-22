const DataBase = require('./modules/conf/database');// класс взаимодействия с базой MySQL
const express = require('express');
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const fs = require('fs');
const http = require('http');
const https = require('https');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var crypto = require("crypto");
const privateKey = fs.readFileSync('cert/key.pem', 'utf8');
const certificate = fs.readFileSync('cert/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const db = new DataBase;
db.connectDb();
const sessionStore = new MySQLStore({ createDatabaseTable: true }, db.dbConnect);

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'cookie_secret',
        resave: true,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000000
        }
    })
);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);


app.get('/', (request, response) => { // стартовая страница
    let category;
    let goods;
    db.getAllCategory()
        .then((result) => {
            if (result.length === 0) {
                category = [{ id: 0, name: 'Ничего нет...' }];
            } else {
                category = result;
            }
            return db.getGoodsInCategory(category[0]['id']);
        }).then((result) => {
            goods = result;
            return db.getAllGoodsStock();
        }).then((stock) => {
            response.render('index', { "category": category, "goods": goods, "stock": stock });
        });
});

app.use("/mysql", function (request, response) { // запросы к базе
    if (request.query.goods_in_cat) {
        db.getGoodsInCategory(request.query.goods_in_cat)
            .then((result) => response.json(result));

    } else if (request.query.good_id) {
        db.getGoodId(request.query.good_id)
            .then((result) => response.json(result));
    }
});

app.post('/login/password', function (request, response) {
    console.log();
})


httpServer.listen(8000, () => { console.log('HTTP слушает 8000') });
// For https
httpsServer.listen(8443, () => { console.log('HTTPS слушает 8443') });

//app.listen(8000);




