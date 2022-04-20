const express = require('express')
// import exphbs from 'express-handlebars';
const bodyParser = require('body-parser')
// const routes = require('./routes')
const path = require('path');

const { OnePayDomestic } = require('vn-payments');
const { OnePayInternational } = require('vn-payments');
const { VNPay } = require('vn-payments');
const { SohaPay } = require('vn-payments');
const { NganLuong } = require('vn-payments');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase/auth');

const serviceAccount = require('./path/to/serviceAccountKey.json');

const defaultApp = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();



const cors = require('cors');

// const { firestore } = require('../src/firebase/utils');
const app = express()
app.disable('x-powered-by');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

  const onepayIntl = new OnePayInternational({
    paymentGateway: 'https://mtf.onepay.vn/vpcpay/vpcpay.op',
    merchant: 'TESTONEPAY',
    accessCode: '6BEB2546',
    secureSecret: '6D0870CDE5F24F34F3915FB0045120DB',
  });

  /* eslint-disable no-param-reassign */
  const TEST_CONFIG = VNPay.TEST_CONFIG;
  const vnpay = new VNPay({
    paymentGateway: TEST_CONFIG.paymentGateway,
    merchant: TEST_CONFIG.merchant,
    secureSecret: TEST_CONFIG.secureSecret,
  });

  app.post('/payment/checkout/:amount/:email/:paymentMethod/:userID', (req, res) => {
    // const userAgent = req.headers['user-agent'];
	// console.log('userAgent', userAgent);
    // const params = Object.assign({}, req.body);
    console.log(req.params.amount)
    const userId = req.params.userID

    switch (req.params.paymentMethod) {
      case 'onepayInternational': {
        const clientIp =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
        const now = new Date();
      
        // construct checkout payload from form data and app's defaults
        const checkoutData = {
          clientIp: clientIp.length > 15 ? '127.0.0.1' : clientIp,
          amount: parseInt(req.params.amount, 10),
          customerId: req.params.email,
          currency: 'VND',
          orderId: `node-${now.toISOString()}`,
          transactionId: `node-${now.toISOString()}`,
          /*...*/
        };

        checkoutData.againLink = `http://${req.headers.host}/`; // back URL when user cancel payment
	      checkoutData.returnUrl = `http://${req.headers.host}/payment/onepayintl/${userId}/callback`;

        // buildCheckoutUrl is async operation and will return a Promise
        onepayIntl
          .buildCheckoutUrl(checkoutData)
          .then(checkoutUrl => {
            res.writeHead(301, { Location: checkoutUrl.href });
            res.end();
          })
          .catch(err => {
            res.send(err);
          });
        break;
      }
      case 'vnPay':{
        const clientIp =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
        const now = new Date();
      
        // construct checkout payload from form data and app's defaults
        const checkoutData = {
          clientIp: clientIp.length > 15 ? '127.0.0.1' : clientIp,
          amount: parseInt(req.params.amount, 10),
          customerId: req.params.email,
          currency: 'VND',
          orderId: `node-${now.toISOString()}`,
          transactionId: `node-${now.toISOString()}`,
          /*...*/
        };

        checkoutData.returnUrl = `http://${req.headers.host}/payment/vnpay/${userId}/callback`;
        checkoutData.orderInfo = 'Thanh toan giay adidas';
        checkoutData.orderType = 'fashion';

        vnpay.buildCheckoutUrl(checkoutData).then(checkoutUrl => {
          res.writeHead(301, { Location: checkoutUrl.href });
          res.end();
        })
        .catch(err => {
          res.send(err);
        });
        break;
      }
      default:
        break;
    }

    
  });

  app.get('/payment/:gateway/:userId/callback', (req, res) => {
  
    switch (req.params.gateway) {
      case 'onepayintl': {
        const query = req.query;
        onepayIntl.verifyReturnUrl(query).then(results => {
          console.log(results)
          if (results.isSuccess) {
            console.log("success")
            res.render('success', {
              title: 'Nau Store - Thank You',
              orderId: results.orderId,
              amount: results.amount,
              message: results.message,
            });
          } else {
            console.log("fail")
            res.render('errors', {
              title: 'Nau Store - Payment Errors',
              message: results.message,
            });
          }
        });
      }

      case 'vnpay': {
        const query = req.query;

        vnpay.verifyReturnUrl(query).then(results => {
          console.log(results)
          if (results.isSuccess) {
            const washingtonRef = db.collection('users').doc(req.params.userId);

            // Atomically incarement the population of the city by 50.
            const resa = washingtonRef.update({
              point: FieldValue.increment(results.amount)
            });

            res.writeHead(301, {
              Location: `http://localhost:3000/getPointSuccess/${results.isSuccess}`
            }).end();
            // res.render('success', {
            //   title: 'Nau Store - Thank You',
            //   orderId: results.orderInfo,
            //   amount: results.amount,
            //   message: results.message,
            // });
            // res.locals.email = 'tu.nguyen@naustud.io';
            // res.locals.orderId = results.transactionId || '';
            // res.locals.price = results.amount;
            // res.locals.isSucceed = results.isSuccess;
            // res.locals.message = results.message;
          } else {
            res.locals.isSucceed = false;
          }
        });
      }
    }
  
    
  });
// app.use(express.static(path.join(__dirname, "vilavila-video", "build")))

// // fix views folder location
// app.set('PointLayout', path.join(__dirname, '../src/components/PointLayout'));
// // View engine setup
// const jsx = exphbs.create({
// 	extname: '.jsx',
// 	defaultLayout: 'default',
// 	layoutsDir: path.join(__dirname, '../src/components/PointLayout'),
// 	// Specify helpers which are only registered on this instance.
// 	// helpers: {
// 	// 		foo: function () { return 'FOO!'; },
// 	// 		bar: function () { return 'BAR!'; }
// 	// }
// });

// app.engine('jsx', jsx.engine);
// app.set('view engine', 'jsx');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, './public')));

// Routes
// app.use('/getPoint', routes);

// Catch 404 and forward to error handler
// app.use((req, res, next) => {
// 	const err = new Error('Not Found');
// 	err.status = 404;
// 	next(err);
// });

// // Error handler
// // eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
// 	res.status(err.status || 500).render('error', {
// 		message: err.message,
// 	});
// });

// Routes
// app.use('/', routesHandler)

app.delete('/adminAccount/:id', (req, res) => {
  console.log(`DELETE request account with id ${req.params.id}`);
  
  getAuth(defaultApp)
  .deleteUser(req.params.id)
  .then(() => {
    console.log('Successfully deleted user');
  })
  .catch((error) => {
    console.log('Error deleting user:', error);
  });
})

const PORT = process.env.PORT || 5000; //bacend routing port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})