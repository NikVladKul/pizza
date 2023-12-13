const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MysqlStore } = require('wwebjs-mysql');
const mysql = require('mysql2/promise');
const qrcode = require('qrcode-terminal');
//const db = require('./dbmysql').db;
//const db = require('../../app');
require('dotenv').config();

const tableInfo = {
  table: 'wsp_sessions',
  session_column: 'session_name',
  data_column: 'data',
  updated_at_column: 'updated_at'
}

const pool = mysql.createPool({
  host: process.env.DB_MYSQL_HOST,
  user: process.env.DB_MYSQL_USER,
  password: process.env.DB_MYSQL_PASSWORD,
  database: process.env.DB_MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,  // max number of concurrent conections
  queueLimit: 0         // max number of conections on queue (0 = limitless)
});

const store = new MysqlStore({ pool: pool, tableInfo: tableInfo })

const client = new Client({
  authStrategy: new RemoteAuth({
    store: store,
    backupSyncIntervalMs: 3600000,
    session: 'RemoteAuth'
  })
  //puppeteer: { headless: false }
});

client.on('qr', (qr) => {
  // Generate and scan this code with your phone
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});

client.on('message', msg => {
  if (!msg.participant) {
    console.log(msg.body);
    let from = msg.from.slice(7, 11);
    console.log(msg.from);
    if (msg.from == '79298490643') {
      let message = msg.body;
      msg.reply(message.split("").reverse().join("") + 'Привет ' + msg.notifyName);
    }
  }
});

client.on('authenticated', session => {
  console.log('AUTHENTICATED');
});

client.on('remote_session_saved', session => {
  console.log('SESSION SAVED', session);
});

client.on('ready', () => {
  console.log('Client is ready!');
});


client.initialize();

module.exports.clientWhatsapp = client;
