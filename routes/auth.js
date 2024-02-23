module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    next();
  } else {
    res.redirect('/login-fail');
  }
}

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isadmin === 1) {
    next();
  } else {
    //res.locals.msg = 'У вас не достаточно прав!';
    //console.log(res.locals);
    let msg = encodeURIComponent('У вас не достаточно прав');
    //res.json({ msg: 'У вас не достаточно прав!' });
    res.redirect('/login-fail?msg=' + msg);
  }
}

module.exports.isCook = (req, res, next) => {
  if (req.isAuthenticated() && req.user.iscook === 1) {
    next();
  } else {
    res.redirect('/login-fail');
  }
}


//module.exports.isAdmin = (req, res, next) => {
//  if (req.isAuthenticated() && req.user.admin) {
//    next();
//  } else {
//    res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
//  }
//}