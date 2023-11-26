const express = require('express');
const router = require('express').Router();
const passport = require('passport');
const isAuth = require('./auth').isAuth;
//const isAuth = require('./auth').isAuth;
let fork = { successRedirect: '/', failureRedirect: '/login-error' };


// *************************** GET запросы ****************************

router.get('/', (request, response) => { // стартовая страница
  fork.successRedirect = '/';
  const db = require('../app');
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
      if (result.length === 0) {
        goods = [{ id: 0, name: 'Ничего нет...' }];
      } else {
        goods = result;
      }
      return db.getAllGoodsStock();
    }).then((stock) => {
      if (request.isAuthenticated()) {
        response.render('index', { "category": category, "goods": goods, "stock": stock, "user": request.user.name });
      } else response.render('index', { "category": category, "goods": goods, "stock": stock });
    });
});

router.get('/order', isAuth, (request, response) => { // оформление заказа
  response.render('order', { "user": request.user.name });
});

router.get('/signup', function (req, res, next) { // регистрация
  res.render('index');
});

router.get('/login', function (req, res, next) { // вход
  res.render('login'); //       render('index');
});

router.get('/logout', function (req, res, next) { // вход
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/login-fail', function (req, res, next) { // вход
  fork.successRedirect = '/order';
  res.render('login', { "message": 'Вы не авторизованы!' }); //       render('index');
});

router.get('/login-error', function (req, res, next) { // вход
  fork.successRedirect = '/order';
  res.render('login', { "message": 'Ошибка авторизации!' }); //       render('index');
});

// ***************************** POST запросы **************************************

router.post('/login', passport.authenticate('local', fork
  //{
  //successRedirect: '/order',
  //failureRedirect: '/login'
  //}
));

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post('/signup', function (req, res, next) {
  const saltHash = genPassword(req.body.password);

  console.log(req.body);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  db.addUser({
    salt: salt,
    passw: hash,
    name: req.body.username,
    phone: req.body.phone,
    email: req.body.email,
    addres: req.body.addres
  }).then();

  res.redirect("/");
});

// ***************************** MySQL запросы **************************************

router.use("/mysql", function (request, response) { // запросы к базе
  const db = require('../app');
  if (request.query.goods_in_cat) {
    db.getGoodsInCategory(request.query.goods_in_cat)
      .then((result) => response.json(result));

  } else if (request.query.good_id) {
    db.getGoodId(request.query.good_id)
      .then((result) => response.json(result));
  }
});


module.exports = router;