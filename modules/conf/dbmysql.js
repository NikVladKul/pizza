const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_MYSQL_HOST,
  user: process.env.DB_MYSQL_USER,
  password: process.env.DB_MYSQL_PASSWORD,
  database: process.env.DB_MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,  // max number of concurrent conections
  queueLimit: 0         // max number of conections on queue (0 = limitless)
});

let db = {};
db.connect = pool;

db.getAllCategory = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT id, name FROM category WHERE activ=1", (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res);
    });
  });
}

db.getGoodsInCategory = (cat) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM goods WHERE (category=" + cat + " AND activ=1)", (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res);
    });
  });
}

db.getAllGoodsStock = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM goods WHERE (stock=1 AND activ=1)", (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res);
    });
  });
}

db.getGoodId = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM goods WHERE (id=" + id + ")", (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res);
    });
  });
}

db.getUserPhone = (phone) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM users WHERE (phone='" + phone + "')";
    pool.query(sql, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res[0]);
    });
  });
}

db.isUserPhone = (phone) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT EXISTS(SELECT * FROM users WHERE phone = '" + phone + "')";
    pool.query(sql, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      let vals = Object.values(res[0]);
      resolve(vals[0]);
    });
  });
}

db.addUser = (user) => {
  return new Promise((resolve, reject) => {
    pool.query(`INSERT INTO users(name, passw, activ, phone, email, addres, salt) VALUES('${user.name}', '${user.passw}', 1, '${user.phone}', '${user.email}', '${user.addres}', '${user.salt}')`, (err, res) => {
      //console.log(res);
      if (err) console.log(err);
      resolve(res);
    });
  })
}

module.exports.db = db;
module.exports.pool = pool;