const router = require('express').Router();
const passport = require('passport');
const isAuth = require('./auth').isAuth;
const genPassword = require('../modules/lib/crypto').genPassword;

let fork = { successRedirect: '/', failureRedirect: '/login-error', failureMessage: true };

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

router.get('/logout', function (req, res, next) { // выход
  req.logout(function (err) {
    if (err) { return next(err); }
    req.session.destroy();
    res.redirect('/');
  });
});

router.get('/login-fail', function (req, res, next) { // вход при попытке что-то сделать будуче не авторизованным
  fork.successRedirect = '/order';
  res.render('login', { "message": 'Вы не авторизованы!' });
});

router.get('/login-error', function (req, res, next) { // вход при ошибке авторизации
  let msg = {};
  if (req.session.messages[0] === '!Phone') {
    msg = { "message": 'Номер не зарегистрирован!' }
  }
  if (req.session.messages[0] === '!Password') {
    msg = { "message": 'Не верный пароль!' }
  }
  res.render('login', msg);
});

// ***************************** POST запросы **************************************

router.post('/login', passport.authenticate('local', fork));

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post('/signup', function (req, res, next) {
  const db = require('../app');

  db.isUserPhone(req.body.phone).then((result) => {
    if (result) {
      res.render('login', { "message": 'Вы уже зарегистрированы!' });// Пользователь с таким телефоном есть!
    } else {
      const saltHash = genPassword(req.body.password);
      db.addUser({
        salt: saltHash.salt,
        passw: saltHash.hash,
        name: req.body.username,
        phone: req.body.phone,
        email: req.body.email,
        addres: req.body.addres
      }).then(res.redirect(fork.successRedirect));
    }
  });

  //const saltHash = genPassword(req.body.password);
  //db.addUser({
  //  salt: saltHash.salt,
  //  passw: saltHash.hash,
  //  name: req.body.username,
  //  phone: req.body.phone,
  //  email: req.body.email,
  //  addres: req.body.addres
  //}).then(res.redirect(fork.successRedirect));


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