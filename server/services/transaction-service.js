const Transaction = require('../models/transaction-model');
const ReadPreference = require('mongodb').ReadPreference;

require('../mongo').connect();

function get(req, res) {
  const { query } = req;
  const { userId, dates } = query;
  //console.log(dates);
  if (dates === 'all' || dates === undefined){
    console.log(dates);
    docquery = Transaction.find({userId: userId}).sort({date: 'descending', createdAt: 'descending'}).read(ReadPreference.NEAREST);
  }else {
    docquery = Transaction.find({userId: userId, monthYearId: dates}).sort({date: 'descending', createdAt: 'descending'}).read(ReadPreference.NEAREST);
  }
  
  return docquery
    .then(transactions => {
      res.json(transactions);
    })
    .catch(err => {
      res.status(500).send(err);
    })
}

function create(req, res) {
  const { item, date, price, category, transactionType, monthYearId } = req.body;
  const { query } = req;
  const { userId } = query;
  const transaction = new Transaction({ userId, date, item, price, category, transactionType, monthYearId});
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
  const { item, date, price, category, _id, monthYearId} = req.body;
  Transaction.findOne({ _id })
  .then(transaction => {
    transaction.item = item;
    transaction.date = date;
    transaction.price = price;
    transaction.category = category;
    transaction.monthYearId = monthYearId
    transaction.updatedAt = Date.now();
    transaction.save().then(() => {
      res.json(transaction)})})
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
  const {userId, dates} = req.params;
  if (dates === 'all') {
    transactionQuery = Transaction.aggregate([
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
  } else {
    transactionQuery = Transaction.aggregate([
      {
        '$match': {
          'userId': `${userId}`,
          'monthYearId': `${dates}`
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
  }
  return transactionQuery
  .then(all => {
    res.json(all);
  })
  .catch(err => {
    res.status(500).send(err);
  });
}

function getSpendingTotal(req, res) {
  const {userId, dates} = req.params;
  if (dates === 'all'){
    transactionQuery =  Transaction.aggregate([
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
  } else{
    transactionQuery = Transaction.aggregate([
      {
        '$match': {
          'userId': `${userId}`,
          'monthYearId': `${dates}`,
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
  }
  return transactionQuery
  .then(all => {
    res.json(all);
  })
  .catch(err => {
    res.status(500).send(err);
  });
}

function getIncomeTotal(req, res) {
  const {userId, dates} = req.params;
  if (dates === 'all') {
    transactionQuery = Transaction.aggregate([
      {
        '$match': {
          'userId': `${userId}`,
          'category': 'Income'
        }
      }, {
        '$group': {
          '_id': '$userId', 
          'incomeTotal': {
            '$sum': '$price'
          }
        }
      }
    ])
  } else(
    transactionQuery = Transaction.aggregate([
      {
        '$match': {
          'userId': `${userId}`,
          'monthYearId': `${dates}`,
          'category': 'Income'
        }
      }, {
        '$group': {
          '_id': '$userId', 
          'incomeTotal': {
            '$sum': '$price'
          }
        }
      }
    ])
  )


  return transactionQuery
  .then(all => {
    res.json(all);
  })
  .catch(err => {
    res.status(500).send(err);
  });
}



module.exports = { get, create, update, destroy, getTotalsAll, getSpendingTotal, getIncomeTotal };