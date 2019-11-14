const Purchase = require('../models/purchase-model');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function get(req, res) {
  const docquery = Purchase.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(purchases => {
      res.json(purchases);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function create(req, res) {
  const { item, price, category } = req.body;

  const purchase = new Purchase({ item, price, category});
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
  const { item, price, category } = req.body;

  Purchase.findOne({ createdAt })
    .then(purchase => {
      purchase.item = item;
      purchase.price = price;
      purchase.category = category;
      purchase.save().then(res.json(purchase));
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function destroy(req, res) {
  const { createdAt } = req.params;

  Purchase.findOneAndRemove({ createdAt })
    .then(purchase => {
      res.json(purchase);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

module.exports = { get, create, update, destroy };