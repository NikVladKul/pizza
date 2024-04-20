const mysql = require("mysql2");
const genPassword = require("../lib/crypto").genPassword;

let pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10, // max number of concurrent conections
  queueLimit: 0, // max number of conections on queue (0 = limitless)
});

const db = {};

db.createTableWps = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица WSP_session      */
    pool.query(
      `CREATE TABLE IF NOT EXISTS ${process.env.MYSQLDATABASE}.wsp_sessions (
                    id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                    session_name varchar(255) NOT NULL, 
                    data longblob,
                    created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP) 
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`,
      function (err, res) {
        if (err) {
          console.log("Ошибка сервера", err);
          reject(err);
        } else {
          if (res.warningStatus === 1)
            console.log("Таблица wsp_sessions найдена");
          else console.log("Таблица wsp_sessions создана");
          resolve();
        }
      }
    );
  });
};

db.createTableReset = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица reset      */
    pool.query(
      `CREATE TABLE IF NOT EXISTS ${process.env.MYSQLDATABASE}.reset (
                    id int AUTO_INCREMENT PRIMARY KEY,
                    token varchar(32) NOT NULL,
                    created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                    user_id int)
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`,
      function (err, res) {
        if (err) {
          console.log("Ошибка сервера", err);
          reject(err);
        } else {
          if (res.warningStatus === 1) console.log("Таблица reset найдена");
          else console.log("Таблица reset создана");
          resolve();
        }
      }
    );
  });
};

db.createTableCategory = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица Category  категории продуктов    */
    pool.query(
      `CREATE TABLE IF NOT EXISTS ${process.env.MYSQLDATABASE}.category (
                    id int AUTO_INCREMENT PRIMARY KEY, 
                    name varchar(200) DEFAULT NULL, 
                    img varchar(500) DEFAULT NULL,
                    description text,
                    activ tinyint DEFAULT 0) 
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`,
      function (err, res) {
        if (err) {
          console.log("Ошибка сервера", err);
          reject(err);
        } else {
          if (res.warningStatus === 1) console.log("Таблица category найдена");
          else console.log("Таблица category создана");
          resolve();
        }
      }
    );
  });
};

db.createTableGoods = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица Goods  продукты    */
    pool.query(
      `CREATE TABLE IF NOT EXISTS ${process.env.MYSQLDATABASE}.goods (
                    id int AUTO_INCREMENT PRIMARY KEY, 
                    name varchar(300) DEFAULT NULL, 
                    img varchar(500) DEFAULT NULL,
                    description text,
                    cost int DEFAULT NULL,
                    category int DEFAULT NULL,
                    activ tinyint DEFAULT 0,
                    stock tinyint DEFAULT 0) 
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`,
      function (err, res) {
        if (err) {
          console.log("Ошибка сервера");
          reject(err);
        } else {
          if (res.warningStatus === 1) console.log("Таблица goods найдена");
          else console.log("Таблица goods создана");
          resolve();
        }
      }
    );
  });
};

db.createTableOrders = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица Goods  продукты    */
    pool.query(
      `CREATE TABLE IF NOT EXISTS ${process.env.MYSQLDATABASE}.orders (
                    id varchar(20) DEFAULT NULL, 
                    goods int DEFAULT NULL, 
                    quantity int DEFAULT NULL, 
                    cost int DEFAULT NULL, 
                    ready tinyint DEFAULT 0) 
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`,
      function (err, res) {
        if (err) {
          console.log("Ошибка сервера");
          reject(err);
        } else {
          if (res.warningStatus === 1) console.log("Таблица orders найдена");
          else console.log("Таблица orders создана");
          resolve();
        }
      }
    );
  });
};

db.createTableHeadOrders = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица Goods  продукты    */
    pool.query(
      `CREATE TABLE IF NOT EXISTS ${process.env.MYSQLDATABASE}.headorders (
                    id varchar(20) PRIMARY KEY, 
                    iduser int DEFAULT NULL, 
                    totalamount int DEFAULT NULL, 
                    delivery tinyint DEFAULT 0,
                    ready tinyint DEFAULT 0) 
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`,
      function (err, res) {
        if (err) {
          console.log("Ошибка сервера");
          reject(err);
        } else {
          if (res.warningStatus === 1)
            console.log("Таблица HeadOrders найдена");
          else console.log("Таблица HeadOrders создана");
          resolve();
        }
      }
    );
  });
};

db.createTableUsers = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица Users  пользователи    */
    pool.query(
      `CREATE TABLE IF NOT EXISTS ${process.env.MYSQLDATABASE}.users (
                id int AUTO_INCREMENT PRIMARY KEY,
                name varchar(100) DEFAULT NULL,
                passw varchar(128) DEFAULT NULL,
                phone varchar(17) DEFAULT NULL UNIQUE KEY,
                email varchar(100) DEFAULT NULL UNIQUE KEY,
                addres varchar(500) DEFAULT NULL,
                activ tinyint DEFAULT 0,
                isRoot tinyint DEFAULT 0,
                isAdmin tinyint DEFAULT 0,
                isCook tinyint DEFAULT 0,
                salt varchar(64) DEFAULT NULL,
                UNIQUE KEY phone_UNIQUE (phone),
                UNIQUE KEY name_UNIQUE (name))
                ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
      function (err, res) {
        if (err) {
          console.log("Ошибка сервера");
          reject(err);
        } else {
          if (res.warningStatus === 1) console.log("Таблица users найдена");
          else console.log("Таблица users создана");
          resolve();
        }
      }
    );
  });
};

db.createBase = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.MYSQLDATABASE}`,
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.addRoot = function () {
  let saltHash = genPassword(process.env.ROOT_CODE);
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO users(id, name, passw, phone, activ, isRoot, isAdmin, isCoock, salt) VALUES(1, 'root', '${saltHash.hash}', '+7 (999) 555 4455', 1, 1, 1, 1, '${saltHash.salt}')`,
      (err, res) => {
        resolve();
      }
    );
  });
};

db.createTableConstatnts = () => {
  return new Promise((resolve, reject) => {
    //***********    Таблица Goods  продукты    */
    pool.query(
      `CREATE TABLE IF NOT EXISTS ${process.env.MYSQLDATABASE}.constants (
                    namesite varchar(50) DEFAULT NULL, 
                    slogan varchar(50) DEFAULT NULL, 
                    daliverycost int DEFAULT NULL)
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`,
      function (err, res) {
        if (err) {
          console.log("Ошибка сервера");
          reject(err);
        } else {
          if (res.warningStatus === 1) console.log("Таблица constants найдена");
          else console.log("Таблица constants создана");
          resolve();
        }
      }
    );
  });
};

async function checkDb() {
  try {
    Promise.all([
      await db.createBase(),
      await db.createTableWps(),
      await db.createTableUsers(),
      await db.createTableCategory(),
      await db.createTableGoods(),
      await db.createTableReset(),
      await db.createTableOrders(),
      await db.createTableHeadOrders(),
      await db.createTableConstatnts(),
    ]);
    await db.addRoot();
  } catch (err) {
    console.log("ошибка", err);
  }
}

module.exports.createDb = async () => {
  await checkDb();
};
