const mysql = require('mysql2');
const genPassword = require('../lib/crypto').genPassword;

let pool = mysql.createPool({
  host: process.env.DB_MYSQL_HOST,
  user: process.env.DB_MYSQL_USER,
  password: process.env.DB_MYSQL_PASSWORD,
  //database: process.env.DB_MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,  // max number of concurrent conections
  queueLimit: 0         // max number of conections on queue (0 = limitless)
});

const db = {};

db.createTableWps = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица WSP_session      */
    pool.query(`CREATE TABLE IF NOT EXISTS ${process.env.DB_MYSQL_DATABASE}.wsp_sessions (
                    id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                    session_name varchar(255) NOT NULL, 
                    data longblob,
                    created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP) 
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`, function (err, res) {
      if (err) {
        console.log('Ошибка сервера', err);
        reject(err);
      } else {
        if (res.warningStatus === 1) console.log('Таблица wsp_sessions найдена');
        else console.log('Таблица wsp_sessions создана');
        resolve();
      }
    });
  })
};

db.createTableCategory = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица Category  категории продуктов    */
    pool.query(`CREATE TABLE IF NOT EXISTS ${process.env.DB_MYSQL_DATABASE}.category (
                    id int AUTO_INCREMENT PRIMARY KEY, 
                    name varchar(200) DEFAULT NULL, 
                    img varchar(500) DEFAULT NULL,
                    description text,
                    activ tinyint DEFAULT NULL) 
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`, function (err, res) {
      if (err) {
        console.log('Ошибка сервера', err);
        reject(err);
      } else {
        if (res.warningStatus === 1) console.log('Таблица category найдена');
        else console.log('Таблица category создана');
        resolve();
      }
    });
  })
};

db.createTableGoods = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица Goods  продукты    */
    pool.query(`CREATE TABLE IF NOT EXISTS ${process.env.DB_MYSQL_DATABASE}.goods (
                    id int AUTO_INCREMENT PRIMARY KEY, 
                    name varchar(300) DEFAULT NULL, 
                    img varchar(500) DEFAULT NULL,
                    description text,
                    cost int DEFAULT NULL,
                    category int DEFAULT NULL,
                    activ tinyint DEFAULT NULL,
                    stock tinyint DEFAULT NULL) 
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`, function (err, res) {
      if (err) {
        console.log('Ошибка сервера');
        reject(err);
      } else {
        if (res.warningStatus === 1) console.log('Таблица goods найдена');
        else console.log('Таблица goods создана');
        resolve();
      }
    });
  })
};

db.createTableUsers = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица Users  пользователи    */
    pool.query(`CREATE TABLE IF NOT EXISTS ${process.env.DB_MYSQL_DATABASE}.users (
                id int AUTO_INCREMENT PRIMARY KEY, 
                name varchar(100) DEFAULT NULL, 
                passw varchar(128) DEFAULT NULL,
                phone varchar(17) DEFAULT NULL UNIQUE KEY, 
                email varchar(100) DEFAULT NULL, 
                addres varchar(500) DEFAULT NULL, 
                activ tinyint DEFAULT NULL,
                isRoot tinyint DEFAULT NULL,
                isAdmin tinyint DEFAULT NULL,
                isCoock tinyint DEFAULT NULL,
                salt varchar(64) DEFAULT NULL,
                UNIQUE KEY phone_UNIQUE (phone),
                UNIQUE KEY name_UNIQUE (name)) 
                ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`, function (err, res) {
      if (err) {
        console.log('Ошибка сервера');
        reject(err);
      } else {
        if (res.warningStatus === 1) console.log('Таблица users найдена');
        else console.log('Таблица users создана');
        resolve();
      }
    });
  })
};

db.createBase = () => {
  return new Promise((resolve, reject) => {
    console.log(" createBase ");
    pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_MYSQL_DATABASE}`, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

db.addRoot = function () {
  let saltHash = genPassword(process.env.ROOT_CODE);
  return new Promise((resolve, reject) => {
    pool.query(`INSERT INTO users(id, name, passw, phone, activ, isRoot, isAdmin, isCoock, salt) VALUES(1, 'root', '${saltHash.hash}', '+7 (999) 555 4455', 1, 1, 1, 1, '${saltHash.salt}')`, (err, res) => {
      resolve();
    });
  })
};

async function checkDb() {
  try {
    Promise.all([
      await db.createBase(),
      await db.createTableWps(),
      await db.createTableUsers(),
      await db.createTableCategory(),
      await db.createTableGoods(),
    ]);
    await db.addRoot();
  } catch (err) {
    console.log("ошибка", err);
  }
}

module.exports.createDb = async () => {
  await checkDb();
};
