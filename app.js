const DataBase = require('./modules/conf/database');
const express = require('express');

const db = new DataBase;
const app = express();
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));

db.connectDb();

app.get('/', (request, response) => {
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
            goods = result;
            return db.getAllGoodsStock();
        }).then((stock) => {
            response.render('index', { "category": category, "goods": goods, "stock": stock });
        });
});

app.use("/mysql", function (request, response) {
    if (request.query.goods_in_cat) {
        db.getGoodsInCategory(request.query.goods_in_cat)
            .then((result) => response.json(result));

    } else if (request.query.good_id) {
        db.getGoodId(request.query.good_id)
            .then((result) => response.json(result));
    }
});




app.listen(8000);




