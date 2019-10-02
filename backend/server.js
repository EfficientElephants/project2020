const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
const router = express.Router();

// Possibly for CORS problem
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header(
//   'Access-Control-Allow-Headers',
//   'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
//   });
//   app.options('*', cors());

// this is our MongoDB database
const dbRoute =
  'mongodb+srv://petean09:SeniorProject2020@cluster0-yi9vr.gcp.mongodb.net/test?retryWrites=true&w=majority';
  // 'mongodb://petean09:SeniorProject2020@ds129098.mlab.com:29098/heroku_2gt4pps3';

// connects our back end code with the database
// MONGODB _URI is for remote deploy and dbRoute is for localhost
mongoose.connect(process.env.MONGODB_URI || dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create method
// this method adds new data in our database
router.post('/putData', (req, res) => {
  console.log('putData', data.message, data.id);
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.message = message;
  data.id = id;
  
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use('/api', router);


/*Adds the react production build to serve react requests*/
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
}

/*React root*/
app.get('*', (req, res) => {
res.sendFile('../client/build/index.html');
});

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));