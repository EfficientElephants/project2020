const Transaction = require('../models/transaction-model');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function get(req, res) {
  const { query } = req;
  const { userId } = query;
  const docquery = Transaction.find({userId: userId}).sort({createdAt: 'descending'}).read(ReadPreference.NEAREST);
  return docquery
    .then(transactions => {
      res.json(transactions);
    })
    .catch(err => {
      res.status(500).send(err);
    })
}

function create(req, res) {
  const { item, price, category, transactionType } = req.body;
  const { query } = req;
  const { userId } = query;
  const transaction = new Transaction({ userId, item, price, category, transactionType});
  transaction
    .save()
    .then(() => {
      res.json(transaction);
    })
    .catch(err => {
      res.status(500).send(err);
    });
  }
  

function update(req, res) {
  const { item, price, category, _id} = req.body;

  Transaction.findOne({ _id })
  .then(transaction => {
    transaction.item = item;
    transaction.price = price;
    transaction.category = category;
    transaction.createdAt = Date.now();
    transaction.save().then(res.json(transaction));
  })
  .catch(err => {
    res.status(500).send(err);
  });
}

function destroy(req, res) {
  const { _id } = req.params;

  Transaction.findOneAndRemove({ _id })
    .then(transaction => {
      res.json(transaction);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

module.exports = { get, create, update, destroy };