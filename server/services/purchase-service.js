const Purchase = require('../models/purchase-model');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function get(req, res) {
  const { query } = req;
  const { userId } = query;
  const docquery = Purchase.find({userId: userId}).sort({createdAt: 'descending'}).read(ReadPreference.NEAREST);
  return docquery
    .then(purchases => {
      res.json(purchases);
    })
    .catch(err => {
      res.status(500).send(err);
    })
}

function create(req, res) {
  const { item, price, category } = req.body;
  const { query } = req;
  const { userId } = query;
  const purchase = new Purchase({ userId, item, price, category});
  purchase
    .save()
    .then(() => {
      res.json(purchase);
    })
    .catch(err => {
      res.status(500).send(err);
    });
  }
  

function update(req, res) {
  const { item, price, category, _id} = req.body;

  Purchase.findOne({ _id })
  .then(purchase => {
    purchase.item = item;
    purchase.price = price;
    purchase.category = category;
    purchase.updatedAt = Date.now();
    purchase.save().then(res.json(purchase));
  })
  .catch(err => {
    res.status(500).send(err);
  });
}

function destroy(req, res) {
  const { _id } = req.params;

  Purchase.findOneAndRemove({ _id })
    .then(purchase => {
      res.json(purchase);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function getTotalsAll(req, res) {
  const {userId} = req.params;
  return Purchase.aggregate([
    {
      '$match': {
        'userId': `${userId}`
      }
    }, {
      '$group': {
        '_id': '$category', 
        'totals': {
          '$sum': '$price'
        }
      }
    }
  ])
  .then(all => {
    res.json(all);
  })
  .catch(err => {
    res.status(500).send(err);
  });
}

module.exports = { get, create, update, destroy, getTotalsAll };