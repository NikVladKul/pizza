const mysql = require('mysql2');

class DataBase {
    constructor() {
        this.baseInfo = {
            host: 'localhost',
            user: 'root',
            password: 'root',
            //database: 'main'
        }
        this.dbName = 'main';
        this.dbConnect = {};
    }

    // #region *******************************  Инициализация, создание, подключение к БД  ******************************* */
    createTables() {
        return Promise.all([
            new Promise((resolve, reject) => {
                //***********    Таблица Admin     */
                this.dbConnect.query(`CREATE TABLE IF NOT EXISTS admin (
                    id int AUTO_INCREMENT PRIMARY KEY, 
                    name varchar(45) DEFAULT NULL, 
                    passw varchar(100) DEFAULT NULL,
                    activ tinyint DEFAULT NULL) 
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`, function (err, res) {
                    if (err) {
                        console.log('Ошибка сервера');
                        reject(err);
                    } else {
                        if (res.warningStatus === 1) console.log('Таблица admin найдена');
                        else console.log('Таблица admin создана');
                        resolve();
                    }
                });
            }),

            new Promise((resolve, reject) => {
                //***********    Таблица Category  категории продуктов    */
                this.dbConnect.query(`CREATE TABLE IF NOT EXISTS category (
                    id int AUTO_INCREMENT PRIMARY KEY, 
                    name varchar(200) DEFAULT NULL, 
                    img varchar(500) DEFAULT NULL,
                    description text,
                    activ tinyint DEFAULT NULL) 
                    ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`, function (err, res) {
                    if (err) {
                        console.log('Ошибка сервера');
                        reject(err);
                    } else {
                        if (res.warningStatus === 1) console.log('Таблица category найдена');
                        else console.log('Таблица category создана');
                        resolve();
                    }
                });
            }),

            new Promise((resolve, reject) => {
                //***********    Таблица Goods  продукты    */
                this.dbConnect.query(`CREATE TABLE IF NOT EXISTS goods (
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
            }),

            new Promise((resolve, reject) => {
                //***********    Таблица Users  пользователи    */
                this.dbConnect.query(`CREATE TABLE IF NOT EXISTS users (
                id int AUTO_INCREMENT PRIMARY KEY, 
                name varchar(100) DEFAULT NULL, 
                passw varchar(100) DEFAULT NULL,
                phone varchar(15) DEFAULT NULL, 
                email varchar(100) DEFAULT NULL, 
                addres varchar(500) DEFAULT NULL, 
                activ tinyint DEFAULT NULL) 
                ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci`, function (err, res) {
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
        ]);
    }

    connectDb() {
        new Promise((resolve, reject) => {
            this.dbConnect = mysql.createConnection(this.baseInfo);
            this.dbConnect.query(`CREATE DATABASE ${this.dbName} /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */`, function (err, res) {
                if (err && err.errno === 1007) console.log('База найдена');
                else console.log('База создана');
                resolve();
            });
        }).then((res) => {
            new Promise((resolve, reject) => {
                this.dbConnect.query(`USE ${this.dbName}`, function (err, res) {
                    if (err) {
                        console.log('Ошибка сервера');
                        reject(err);
                    }
                    else {
                        console.log('База подключена');
                        resolve();
                    }
                });
            })
        }).then((res) => {
            return this.createTables();
        }).then((res) => {
            return new Promise((resolve, reject) => {
                this.addRoot();
                resolve();
            });
        });
    }

    addRoot() {
        return new Promise((resolve, reject) => {
            this.dbConnect.query(`INSERT INTO admin(id, name, passw, activ) VALUES(1, 'root', 'nikvlad', 1)`, (err, res) => {
                resolve();
            });
        })
    }
    // #endregion *******************************  Инициализация, создание, подключение к БД  ******************************* */

    getAllCategory() {
        return new Promise((resolve, reject) => {
            this.dbConnect.query("SELECT id, name FROM category WHERE activ=1", (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    getGoodsInCategory(cat) {
        return new Promise((resolve, reject) => {
            this.dbConnect.query("SELECT * FROM goods WHERE (category=" + cat + " AND activ=1)", (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    getAllGoodsStock() {
        return new Promise((resolve, reject) => {
            this.dbConnect.query("SELECT * FROM goods WHERE (stock=1 AND activ=1)", (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(res);
            });
        });
    }


    getGoodId(id) {
        return new Promise((resolve, reject) => {
            this.dbConnect.query("SELECT * FROM goods WHERE (id=" + id + ")", (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(res);
            });
        });

    }

}

module.exports = DataBase;