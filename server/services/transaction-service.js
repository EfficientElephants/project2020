const Transaction = require('../models/transaction-model');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function get(req, res) {
  const { query } = req;
  const { userId } = query;
  const docquery = Transaction.find({userId: userId}).sort({date: 'descending', createdAt: 'descending'}).read(ReadPreference.NEAREST);
  return docquery
    .then(transactions => {
      res.json(transactions);
    })
    .catch(err => {
      res.status(500).send(err);
    })
}

function create(req, res) {
  const { item, date, price, category, transactionType } = req.body;
  const { query } = req;
  const { userId } = query;
  const transaction = new Transaction({ userId, date, item, price, category, transactionType});
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
  const { item, date, price, category, _id} = req.body;
  Transaction.findOne({ _id })
  .then(transaction => {
    transaction.item = item;
    transaction.date = date;
    transaction.price = price;
    transaction.category = category;
    transaction.updatedAt = Date.now();
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

function getTotalsAll(req, res) {
  const {userId} = req.params;
  return Transaction.aggregate([
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

function getSpendingTotal(req, res) {
  const {userId} = req.params;
  return Transaction.aggregate([
    {
      '$match': {
        'userId': `${userId}`,
        'category': {'$ne':'Income'}
      }
    }, {
      '$group': {
        '_id': '$userId', 
        'spendingTotal': {
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



module.exports = { get, create, update, destroy, getTotalsAll, getSpendingTotal };