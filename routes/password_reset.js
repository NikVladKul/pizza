const router = require('express').Router()
const pool = require('../modules/conf/dbmysql').pool;
const multer = require('multer');
const upload = multer();
const crypto = require('crypto');
const db = require('../modules/conf/dbmysql').db;
const sendEmail = require('../modules/lib/mail').sendEmail;


router.get('/reset', (req, res) => res.render('reset'))

router.get('/reset-confirm/:token', (req, res) => {
  const token = req.params.token;
  db.getReset(token).then((result) => {
    if (result) {
      res.render('reset-confirm', { "token": token });
    } else {
      res.render('login', { "message": 'Ссылка не действительна!' });
    }
  });
})


router.post('/reset', upload.none(), (req, res) => {
  if (req.body.email) {
    db.getUserEmail(req.body.email).then((result) => {
      if (result) {
        const token = crypto.randomUUID().toString().replace(/-/g, '');
        db.updateReset(token, result.id);
        const resetLink = `${process.env.DOMAIN}/reset-confirm/${token}`;
        sendEmail({
          to: req.body.email,
          subject: 'Password Reset',
          text: `Привет ${result.name}, ваша ссылка на восстановление пароля: ${resetLink}. 
          Ссылка действительна в течении 2х часов. 
          Если вы не запрашивали ссылку, игнорируйте это сообщение`
        });
        res.send({ "result": false, "message": 'Такой email есть!' });// Пользователь с таким телефоном есть!
      } else {
        res.send({ "result": false, "message": 'Такой email не зарегистрирован!' });// Пользователь с таким телефоном есть!
      }
    }).catch((err) => {
      console.log(err);
      res.send({ "result": false, "message": 'Не удалось создать ссылку!' });// Пользователь с таким телефоном есть!
    });
  } else {
    res.send({ "result": false, "message": 'Не указан email!' });// Пользователь с таким телефоном есть!
  }
});

router.post('/reset-confirm/:token', async (req, res) => {
  const token = req.params.token;
  const userId = await db.getReset(token);

  // Обновить пароль у user
  // Удалить reset token
  // Перенаправить на login сообщить об успехе
  console.log("new password");

  /* Update user */
  //let user = await User.findOne({ _id: passwordReset.user })
  //user.password = req.body.password

  //user.save().then(async savedUser => {
  //  /* Delete password reset document in collection */
  //  await PasswordReset.deleteOne({ _id: passwordReset._id })
  //  /* Redirect to login page with success message */
  //  req.flash('success', 'Password reset successful')
  //  res.redirect('/login')
  //}).catch(error => {
  //  /* Redirect back to reset-confirm page */
  //  req.flash('error', 'Failed to reset password please try again')
  //  return res.redirect(`/reset-confirm/${token}`)
  //})
});

module.exports = router