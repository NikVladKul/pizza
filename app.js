const express = require('express');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const MySQLStore = require('express-mysql-session')(session);
const fs = require('fs');
const http = require('http');
const https = require('https');
const passport = require("passport");
const privateKey = fs.readFileSync('cert/key.pem', 'utf8');
const certificate = fs.readFileSync('cert/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
require('dotenv').config();
const routers = require('./routes');
const pool = require('./modules/conf/dbmysql').pool;

const sessionStore = new MySQLStore({ createDatabaseTable: true }, pool);

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            secure: true,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

require('./modules/conf/passport');

app.use(passport.authenticate('session'));

app.use('/', routers);
app.use('/', require('./routes/password_reset'));

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(err);
    //  res.render('error');
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);


httpServer.listen(process.env.PORT_HTTP, process.env.HOST, () => { console.log(`HTTP слушает ${process.env.PORT_HTTP}`) });
// For https
httpsServer.listen(process.env.PORT_HTTPS, process.env.HOST, () => { console.log(`HTTPS слушает ${process.env.PORT_HTTPS}`) });

//app.listen(8000);
//module.exports = db;



