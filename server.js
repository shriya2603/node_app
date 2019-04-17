const express       = require('express');
const app           = express();
const port          = process.env.Port || 8080;
const mongoose      = require('mongoose');
const passport      = require('passport');
const flash         = require('connect-flash');
const morgan        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const session       = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const configDB      = require('./config/database.js');

//database connection
// const MongoClient   = require('mongodb').MongoClient;
// const client        = new MongoClient(configDB.url, {useNewUrlParser:true});
//  client.connect(err => {
//    const collection = client.db('app').collection('apli');  // perform actions on the collection object
//     // client.close();
//   });

  mongoose.connect(configDB.url,{ useNewUrlParser: true },()=>{
    console.log('jsbdsh');
  } );

require('./config/passport')(passport);//pass passport for configuration

//setup express application
app.use(morgan('dev')); //log every request to the console
app.use(cookieParser()); //read cookies
app.use(bodyParser());//get information from html forms

app.set('view engine','ejs');

//required for passport
app.use(session({
  secret:'jsgjdksgd',
  // saveUninitialized: true,
  resave:true,
  store: new MongoDBStore({ uri: 'mongodb://127.0.0.1:27017/node_auth',
  collection: 'mySessions'}),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

app.use(passport.initialize()); // passport starts
app.use(passport.session());// it will take the session which is just before it.
app.use(flash()); //flash messages stored in session
// app.use(function(req,res,next){
//   console.log(req.session);
//   console.log("====");
//   console.log(req.user);
//   next();
// });
//routes
// require('./app/routes.js')(app,passport);//load our routes and pass in our app and configered passport
var auth = express.Router();
require('./app/routes/auth.js')(auth, passport);
app.use('/auth',auth);

var secure = express.Router();
require('./app/routes/secure.js')(secure, passport);
app.use('/',secure);

//token auth
var api =express.Router();
require('./app/routes/api.js')(api, passport);
app.use('/api', api);

//launch
app.listen(port);
console.log('app listens to port '+port);