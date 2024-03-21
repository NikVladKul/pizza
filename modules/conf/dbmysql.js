const mysql = require("mysql2");
//const genPassword = require('../lib/crypto').genPassword;
const createDb = require("./createdb").createDb;

let pool = {};

let db = {};

db.getAllCategory = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT id, name, activ FROM category", (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res);
    });
  });
};

db.getActivCategory = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT id, name FROM category WHERE activ=1", (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res);
    });
  });
};

db.getHeadOrders = (days, hide) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT headorders.id, addres, name, phone, delivery, ready FROM headorders, users WHERE (${+Date.now().toString()}-headorders.id)/86400000<${days} AND headorders.iduser=users.id ${
        hide === 1 ? "AND headorders.ready=0" : ""
      }`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.getListOrders = (idOrders) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT quantity, ready, goods.name, goods.id, category.name AS category FROM orders, goods, category WHERE orders.id=${idOrders} AND orders.goods=goods.id AND goods.category=category.id`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.getGoodsInCategory = (cat) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM goods WHERE (category=" + cat + " AND activ=1)",
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.getGoodsInOrder = (list) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM goods WHERE id IN (" + list + ")", (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res);
    });
  });
};

db.getAllGoodsStock = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM goods WHERE (stock=1 AND activ=1)",
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.getAllGoods = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM goods", (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res);
    });
  });
};

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
};

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
};

db.isUserPhone = (phone) => {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT EXISTS(SELECT * FROM users WHERE phone = '" + phone + "')";
    pool.query(sql, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      let vals = Object.values(res[0]);
      resolve(vals[0]);
    });
  });
};

db.getUserEmail = (email) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT id,name FROM users WHERE email = '" + email + "'";
    pool.query(sql, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res[0]);
    });
  });
};

db.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM users";
    pool.query(sql, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res);
    });
  });
};

db.getUniqOrders = (id) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT DISTINCT id, ready FROM orders WHERE id=" + id;
    pool.query(sql, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res);
    });
  });
};

db.addUser = (user) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO users(name, passw, activ, phone, email, addres, salt) VALUES('${user.name}', '${user.passw}', 1, '${user.phone}', '${user.email}', '${user.addres}', '${user.salt}')`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.addGoods = (goods) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO goods(name, img, description, cost, category, activ, stock) VALUES('${goods.name}', '${goods.img}', '${goods.description}', '${goods.cost}', '${goods.category}', '${goods.activ}', '${goods.stock}')`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.addCat = (cat) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO category(name, activ) VALUES('${cat.name}', '${cat.activ}')`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.addOrder = (idOrder, goodsRow) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO orders(id, goods, quantity, cost) VALUES('${idOrder}', '${goodsRow.id}', '${goodsRow.quantity}', '${goodsRow.cost}')`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.addOrderHead = (idOrder, user, amount, delivery) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO headorders(id, iduser, totalamount, delivery) VALUES('${idOrder}', '${user.id}', '${amount}', '${delivery}')`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.updateUserPassword = (salt, hash, userId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE users SET salt = '${salt}', passw = '${hash}' WHERE id = '${userId}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.updateGoods = (id, field, value) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE goods SET ${field} = '${value}' WHERE id = '${id}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.updateCat = (id, field, value) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE category SET ${field} = '${value}' WHERE id = '${id}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.updateUsers = (id, field, value) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE users SET ${field} = '${value}' WHERE id = '${id}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.updateOrders = (idOrder, field, value, idGoods) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE orders SET ${field} = '${value}' WHERE id = '${idOrder}' AND goods = '${idGoods}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.updateHeadOrders = (idOrder, value) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE headorders SET ready = '${value}' WHERE id = '${idOrder}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

//*************************************       RESET      ********************** */

db.isReset = (userId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT EXISTS(SELECT * FROM reset WHERE user_id = '" + userId + "')",
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        let vals = Object.values(res[0]);
        resolve(vals[0]);
      }
    );
  });
};

db.getReset = (token) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT user_id FROM reset WHERE token = '${token}'`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res[0]);
      }
    );
  });
};

db.deleteReset = (userId) => {
  return new Promise((resolve, reject) => {
    pool.query(`DELETE FROM reset WHERE user_id = '${userId}'`, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(res[0]);
    });
  });
};

db.deleteResetScheduler = (token, userId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `CREATE EVENT ${token} ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 2 HOUR DO DELETE FROM reset WHERE user_id = ${userId}`,
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.updateReset = (token, userId) => {
  return new Promise((resolve, reject) => {
    db.isReset(userId)
      .then((res) => {
        if (res === 0) {
          pool.query(
            `INSERT INTO reset(token, user_id) VALUES('${token}', '${userId}')`,
            (err, res) => {
              if (err) {
                console.log(err);
                reject(err);
              }
              resolve(res);
            }
          );
        } else {
          pool.query(
            `UPDATE reset SET token = '${token}', created_at = CURRENT_TIMESTAMP WHERE user_id = '${userId}'`,
            (err, res) => {
              if (err) {
                console.log(err);
                reject(err);
              }
              resolve(res);
            }
          );
        }
        db.deleteResetScheduler(token, userId);
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

createDb().then(
  (pool = mysql.createPool({
    host: process.env.DB_MYSQL_HOST,
    user: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // max number of concurrent conections
    queueLimit: 0, // max number of conections on queue (0 = limitless)
  })),
  (module.exports.pool = pool)
);

module.exports.db = db;
