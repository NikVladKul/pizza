const router = require('express').Router();
const passport = require('passport');
const isAuth = require('./auth').isAuth;
const isAdmin = require('./auth').isAdmin;
const isCook = require('./auth').isCook;
const genPassword = require('../modules/lib/crypto').genPassword;
const clientWhatsapp = require('../modules/conf/whatsapp').clientWhatsapp;
const multer = require('multer');
const upload = multer({ dest: './upload/' });
const db = require('../modules/conf/dbmysql').db;
const sharp = require("sharp");
const unlinkSync = require("fs").unlinkSync;
sharp.cache(false);

let user = { phone: "", code: "" };

let fork = { successRedirect: '/', failureRedirect: '/login-error', failureMessage: true };

// *************************** GET запросы ****************************
router.get('/admin', isAdmin, (req, res) => {
  db.getAllGoods()
    .then((goods) => {
      db.getAllCategory()
        .then((category) => {
          //console.log(category);
          res.render('admin', { "goods": goods.sort(sortArray('name', false, (a) => a.toUpperCase())), "category": category });
        }).catch((err) => console.log(err));
    });
});

router.get('/cook', isCook, (req, res) => {
  res.render('cook');
});

router.get('/getusers', isAdmin, (req, res) => {
  db.getAllUsers().then((result) => res.send(result.sort(sortArray('phone', false, (a) => a.toUpperCase())))).catch((err) => console.log(err));
});


router.get('/', (request, response) => { // стартовая страница
  fork.successRedirect = '/';

  let category;
  let goods;
  db.getActivCategory()
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
        response.render('index', { "category": category, "goods": goods, "stock": stock, "user": request.user.name, "user_id": request.user.id, "is_admin": request.user.isadmin, "is_cook": request.user.iscook });
      } else response.render('index', { "category": category, "goods": goods, "stock": stock });
    });
});

router.get('/order', isAuth, (request, response) => { // оформление заказа
  if (request.query.cart) {
    const cart = JSON.parse(request.query.cart);
    const list = Object.keys(cart);
    const products = {};
    let total = 0;

    db.getGoodsInOrder(list)
      .then((result) => {
        for (i = 0; i < result.length; i++) {
          products[result[i]['id']] = result[i];
        }
        for (let key in cart) {
          products[key]["amount"] = products[key]["cost"] * cart[key];
          total += products[key]["amount"];
          products[key]["quantity"] = cart[key];
        }
        //console.log(products);
        response.render('order', { "user": request.user.name, "user_id": request.user.id, "total": total, "goods": products });
      });
  } else response.redirect('/');
});

router.get('/signup', function (req, res, next) { // регистрация
  res.render('index');
});

router.get('/sendcode', async function (request, response) {
  user.phone = request.headers.number;
  const number = request.headers.number.replace(/[\+\(\) ]/g, ""); //    '+7 (222) 222 2222'
  let code = randomCode();
  user.code = code;
  //console.log(number, code);
  let resSend = {};
  try {
    if (await sendToNumber(number + "@c.us", code)) {
      resSend = { res: true };
    } else {
      resSend = { res: false };
    }
  } catch (err) {
    console.log(err);
    resSend = { res: false };
  }
  response.send(resSend);
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
  let message = req.query.msg;
  console.log(message);
  fork.successRedirect = '/order';
  res.render('login', { "message": (message) ? message : 'Вы не авторизованы!' });
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

router.post('/newcat', upload.none(), (req, res) => {
  try {
    const cat = {
      name: req.body.name,
      activ: (req.body.activ) ? 1 : 0,
    };
    db.addCat(cat).then((result) => {
      res.send(result);
    }).catch((err) => {
      console.log(err);
    });
  } catch (error) {
    res.send(false);
    console.log(error);
  }
});

router.post('/newgoods', upload.single('filedata'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).send("no file");
    }
    const compressedFileName = req.file.filename.split(".")[0];
    const compressedImageFilePath = `./public/photo/${compressedFileName}.jpg`;
    await sharp(req.file.path)
      .jpeg({ quality: 25 })
      .toFile(compressedImageFilePath)
      .then(() => {
        unlinkSync(`./upload/${compressedFileName}`);
        const goods = {
          name: req.body.name,
          img: `/photo/${compressedFileName}.jpg`,
          description: req.body.description,
          cost: req.body.cost,
          category: req.body.category,
          activ: (req.body.activ) ? 1 : 0,
          stock: (req.body.stock) ? 1 : 0
        };
        db.addGoods(goods).then((result) => {
          result.img = `/photo/${compressedFileName}.jpg`;
          res.send(result);
        }).catch((err) => {
          unlinkSync(`./public/photo/${compressedFileName}.jpg`);
          console.log(err);
        });
      });
  } catch (error) {
    res.send(false);
    console.log(error);
  }

});

router.post('/upload', upload.single('filedata'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).send("Не корректный файл изображения");
    }

    const compressedFileName = req.file.filename.split(".")[0];
    const compressedImageFilePath = `./public/photo/${compressedFileName}.jpg`;

    await sharp(req.file.path)
      .jpeg({ quality: 25 })
      .toFile(compressedImageFilePath)
      .then(() => {
        unlinkSync(`./upload/${compressedFileName}`);
        unlinkSync(`./public${req.body.oldUrl}`);
        res.send(`/photo/${compressedFileName}.jpg`);
      });
  } catch (error) {
    res.send(false);
    console.log(error);
  }
})

router.post('/confirm-order', upload.none(), function (req, res, next) {
  //console.log(req.user);
  const cart = JSON.parse(req.body.cart);
  const user = req.user;
  const amount = JSON.parse(req.body.amount);
  const delivery = (Boolean(req.body.delivery)) ? 1 : 0;
  const idOrder = Date.now().toString();

  db.addOrderHead(idOrder, user, amount, delivery)
    .then(result => {
      const promises = [];
      for (const key in cart) {
        if (Object.hasOwnProperty.call(cart, key)) {
          const goodsRow = cart[key];
          promises.push(db.addOrder(idOrder, goodsRow));
        }
      }
      Promise.all(promises)
        .then(() => {
          //ПОСЛАТЬ СООБЩЕНИЕ В КУХНЮ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          //ПОСЛАТЬ СООБЩЕНИЕ В КУХНЮ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          //ПОСЛАТЬ СООБЩЕНИЕ В КУХНЮ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          //ПОСЛАТЬ СООБЩЕНИЕ В КУХНЮ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          res.render('accepted', { "user": req.user.name, "user_id": req.user.id, "delivery": delivery });
        })
        .catch((err) => console.log(err))
    });

});

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post('/signup', upload.none(), function (req, res, next) {
  if ((req.body.phone === user.phone) && (req.body.code === user.code)) {

    db.isUserPhone(req.body.phone).then((result) => {
      if (result) {
        res.send({ "result": false, "message": 'Вы уже зарегистрированы!' });// Пользователь с таким телефоном есть!
      } else {

        const saltHash = genPassword(req.body.password);
        db.addUser({
          salt: saltHash.salt,
          passw: saltHash.hash,
          name: req.body.username,
          phone: req.body.phone,
          email: req.body.email,
          addres: req.body.addres
        }).then((result) => {
          res.send({ "result": true, "message": 'Регистрация завершена' });
          //res.render('login', { "message": 'Регистрация завершена' });
        });
      }
    });
  } else if (!(req.body.phone === user.phone)) res.send({ "result": false, "message": 'Не верный номер' });
  else if (!(req.body.code === user.code)) res.send({ "result": false, "message": 'Не верный код' });

  // ***************************** Whatsapp запросы **************************************



});

// ***************************** MySQL запросы **************************************

router.use("/mysql", async function (request, response) { // запросы к базе
  if (request.query.goods_in_cat) {
    db.getGoodsInCategory(request.query.goods_in_cat)
      .then((result) => response.json(result));
  } else if (request.query.cat_update_id) {
    const buffers = [];
    for await (const chunk of request) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const param = JSON.parse(data); // парсим строку в json
    db.updateCat(request.query.cat_update_id, param.field, param.value)
      .then(result => response.json(result));
  } else if (request.query.good_id) {
    db.getGoodId(request.query.good_id)
      .then((result) => response.json(result));
  } else if (request.query.goods_update_id) {
    const buffers = [];
    for await (const chunk of request) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const param = JSON.parse(data); // парсим строку в json
    db.updateGoods(request.query.goods_update_id, param.field, param.value)
      .then(result => response.json(result));
  } else if (request.query.users_update_id) {
    const buffers = [];
    for await (const chunk of request) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const param = JSON.parse(data); // парсим строку в json
    db.updateUsers(request.query.users_update_id, param.field, param.value)
      .then(result => response.json(result));
  }
});

async function sendToNumber(number, message) {
  let isRegistered = await clientWhatsapp.isRegisteredUser(number);
  console.log(isRegistered);
  if (isRegistered) {
    return clientWhatsapp.sendMessage(number, message);
  } else {
    console.log('Not registered');
    return false;
  }
}

function randomCode(length = 4) {
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  var result = "";
  for (var i = 0; i < length; i++) {
    var index = Math.ceil(Math.random() * 9);
    result += chars[index];
  }
  return result;
}

const sortArray = (field, reverse, primer) => {

  const key = primer ?
    function (x) {
      return primer(x[field]);
    } :
    function (x) {
      return x[field];
    };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  }
}

module.exports = router;