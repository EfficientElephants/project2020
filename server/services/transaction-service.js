const { ReadPreference } = require('mongodb');
const Transaction = require('../models/transaction-model');

require('../mongo').connect();

function get(req, res) {
  const { query } = req;
  const { userId, dates } = query;
  let docquery;
  if (dates === 'all' || dates === undefined) {
    docquery = Transaction.find({ userId }).sort({ date: 'descending', createdAt: 'descending' }).read(ReadPreference.NEAREST);
  } else {
    docquery = Transaction.find({ userId, monthYearId: dates }).sort({ date: 'descending', createdAt: 'descending' }).read(ReadPreference.NEAREST);
  }

  return docquery
    .then((transactions) => {
      res.json(transactions);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function create(req, res) {
  const { item, date, price, category, transactionType, monthYearId } = req.body;
  const { query } = req;
  const { userId } = query;
  const transaction = new Transaction({
    userId,
    date,
    item,
    price,
    category,
    transactionType,
    monthYearId
  });
  transaction
    .save()
    .then(() => {
      res.json(transaction);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}


function update(req, res) {
  const { item, date, price, category, _id, monthYearId } = req.body;
  Transaction.findOne({ _id })
    .then((restransaction) => {
      const transaction = restransaction;
      transaction.item = item;
      transaction.date = date;
      transaction.price = price;
      transaction.category = category;
      transaction.monthYearId = monthYearId;
      transaction.updatedAt = Date.now();
      transaction
        .save()
        .then(() => {
          res.json(transaction);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function destroy(req, res) {
  const { _id } = req.params;

  Transaction.findOneAndDelete({ _id })
    .then((transaction) => {
      if (!transaction) {
        res.status(400).send('Transaction Not Found');
      } else {
        res.json(transaction);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function getTotalsAll(req, res) {
  const { userId, dates } = req.params;
  let transactionQuery;
  if (dates === 'all') {
    transactionQuery = Transaction.aggregate([
      {
        $match: {
          userId: `${userId}`
        }
      }, {
        $group: {
          _id: '$category',
          totals: {
            $sum: '$price'
          }
        }
      }
    ]);
  } else {
    transactionQuery = Transaction.aggregate([
      {
        $match: {
          userId: `${userId}`,
          monthYearId: `${dates}`
        }
      }, {
        $group: {
          _id: '$category',
          totals: {
            $sum: '$price'
          }
        }
      }
    ]);
  }
  return transactionQuery
    .then((all) => {
      res.json(all);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function getSpendingTotal(req, res) {
  const { userId, dates } = req.params;
  let transactionQuery;
  if (dates === 'all') {
    transactionQuery = Transaction.aggregate([
      {
        $match: {
          userId: `${userId}`,
          category: { $ne: 'Income' }
        }
      }, {
        $group: {
          _id: '$userId',
          spendingTotal: {
            $sum: '$price'
          }
        }
      }
    ]);
  } else {
    transactionQuery = Transaction.aggregate([
      {
        $match: {
          userId: `${userId}`,
          monthYearId: `${dates}`,
          category: { $ne: 'Income' }
        }
      }, {
        $group: {
          _id: '$userId',
          spendingTotal: {
            $sum: '$price'
          }
        }
      }
    ]);
  }
  return transactionQuery
    .then((all) => {
      res.json(all);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function getIncomeTotal(req, res) {
  const { userId, dates } = req.params;
  let transactionQuery;
  if (dates === 'all') {
    transactionQuery = Transaction.aggregate([
      {
        $match: {
          userId: `${userId}`,
          category: 'Income'
        }
      }, {
        $group: {
          _id: '$userId',
          incomeTotal: {
            $sum: '$price'
          }
        }
      }
    ]);
  } else {
    (
      transactionQuery = Transaction.aggregate([
        {
          $match: {
            userId: `${userId}`,
            monthYearId: `${dates}`,
            category: 'Income'
          }
        }, {
          $group: {
            _id: '$userId',
            incomeTotal: {
              $sum: '$price'
            }
          }
        }
      ])
    );
  }
  return transactionQuery
    .then((all) => {
      res.json(all);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function earliestTransaction(req, res) {
  const { userId } = req.params;
  const docquery = Transaction.find({ userId }).sort({ date: 'ascending' }).limit(1).read(ReadPreference.NEAREST);
  return docquery
    .then((transactions) => {
      res.json(transactions);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}


module.exports = {
  get,
  create,
  update,
  destroy,
  getTotalsAll,
  getSpendingTotal,
  getIncomeTotal,
  earliestTransaction
};
