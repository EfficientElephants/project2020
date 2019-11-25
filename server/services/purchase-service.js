const Purchase = require('../models/purchase-model');
const ReadPreference = require('mongodb').ReadPreference;
const UserSession = require('../models/user-session-model');

require('../mongo').connect();

function get(req, res) {
  console.log('purchaseService');
  const { query } = req;
  const { userId } = query;
  console.log(userId);
  const docquery = Purchase.find({
    userId: userId
  }).read(ReadPreference.NEAREST);
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
  console.log('create here');
  const purchase = new Purchase({ userId, item, price, category});
  console.log('here');
  purchase
    .save()
    .then(() => {
      res.json(purchase);
    })
    .catch(err => {
      res.status(500).send(err);
    });
  // get token from local storage. token = _id in the UserSession
  // const obj = JSON.parse(localStorage.getItem('expense_app'));
  // console.log('worked');
  // obj = JSON.parse(obj);
  // const { token } = obj;
  // console.log(token);
  // UserSession.find({
  //   _id: token
  // }, (err, user) => {
  //   if (err) {
  //     return res.send({
  //       success: false,
  //       message: 'Error: Server error3'
  //   });
  //   } 
  
      // fetch('api/getUserId?token=' + token)
      // .then(res => res.json())
      // .then(json => {
      //     if (json.success){
      //       console.log('right here');
      //       const userId = json.userId
            
      //       // purchase.userId = user.userId;
            
      //     } else {
      //         // handle error
      //         console.log('not working');
      //     }
      // })
    }
  

    


function update(req, res) {
  const { item, price, category, _id} = req.body;

  Purchase.findOne({ _id })
    .then(purchase => {
      purchase.item = item;
      purchase.price = price;
      purchase.category = category;
      purchase.createdAt = Date.now();
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

module.exports = { get, create, update, destroy };