/* eslint-disable no-param-reassign */

const express = require('express')

const Router = express.Router()
const {
	checkoutOnePayDomestic,
	checkoutOnePayInternational,
	callbackOnePayDomestic,
	callbackOnePayInternational,
} = require('./onepay-handlers');
const { checkoutVNPay, callbackVNPay } = require('./vnpay-handlers');
const { checkoutNganLuong, callbackNganLuong } = require('./nganluong-handlers');
const { checkoutSohaPay, callbackSohaPay } = require('./sohapay-handlers');

const routes = Router();

/**
 * GET home page with the mock shopping cart
 */
// routes.get('/', (req, res) => {
// 	res.render('index', { title: 'Nau Store' });
// });

/**
 * GET thank you page
 */
routes.get('/success', (req, res) => {
	res.json({
		title: 'VilaVila-Videos',
		isSucceed: true,
	});
});

routes.get('/fail', (req, res) => {
	res.json({
		title: 'VilaVila-Videos'
	});
});

routes.post('/payment/checkout', (req, res) => {
	const userAgent = req.headers['user-agent'];
	console.log('userAgent', userAgent);

	const params = Object.assign({}, req.body);

	const clientIp =
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null);

	const amount = parseInt(params.amount.replace(/,/g, ''), 10);
	const now = new Date();

	// NOTE: only set the common required fields and optional fields from all gateways here, redundant fields will invalidate the payload schema checker
	const checkoutData = {
		amount,
		clientIp: clientIp.length > 15 ? '127.0.0.1' : clientIp,
		locale: 'vn',
		currency: 'VND',
		deliveryProvince: params.billingStateProvince || '',
		customerEmail: params.email,
		orderId: `node-${now.toISOString()}`,
		// returnUrl: ,
		transactionId: `node-${now.toISOString()}`, // same as orderId (we don't have retry mechanism)
		customerId: params.email,
	};

	// pass checkoutData to gateway middleware via res.locals
	res.locals.checkoutData = checkoutData;

	// Note: these handler are asynchronous
	let asyncCheckout = null;
	switch (params.paymentMethod) {
		case 'onepayInternational':
			asyncCheckout = checkoutOnePayInternational(req, res);
			break;
		case 'onepayDomestic':
			asyncCheckout = checkoutOnePayDomestic(req, res);
			break;
		case 'vnPay':
			asyncCheckout = checkoutVNPay(req, res);
			break;
		case 'nganluong':
			// this param is not expected in other gateway
			checkoutData.customerName = `${params.firstname || ''} ${params.lastname || ''}`.trim();
			checkoutData.paymentMethod = 'ATM_ONLINE';
			checkoutData.bankCode = 'EXB';
			asyncCheckout = checkoutNganLuong(req, res);
			break;
		case 'nganluongvisa':
			// this param is not expected in other gateway
			checkoutData.customerName = `${params.firstname || ''} ${params.lastname || ''}`.trim();
			checkoutData.paymentMethod = 'VISA';
			asyncCheckout = checkoutNganLuong(req, res);
			break;
		case 'sohaPay':
			asyncCheckout = checkoutSohaPay(req, res);
			break;
		default:
			break;
	}

	if (asyncCheckout) {
		asyncCheckout
			.then(checkoutUrl => {
				res.writeHead(301, { Location: checkoutUrl.href });
				res.end();
			})
			.catch(err => {
				res.send(err.message);
			});
	} else {
		res.send('Payment method not found');
	}
});

routes.get('/payment/:gateway/callback', (req, res) => {
	const gateway = req.params.gateway;
	console.log('gateway', req.params.gateway);
	let asyncFunc = null;

	switch (gateway) {
		case 'onepaydom':
			asyncFunc = callbackOnePayDomestic(req, res);
			break;
		case 'onepayintl':
			asyncFunc = callbackOnePayInternational(req, res);
			break;
		case 'vnpay':
			asyncFunc = callbackVNPay(req, res);
			break;
		case 'sohapay':
			asyncFunc = callbackSohaPay(req, res);
			break;
		case 'nganluong':
			asyncFunc = callbackNganLuong(req, res);
			break;
		default:
			break;
	}

	if (asyncFunc) {
		asyncFunc.then(() => {
			res.json({
				title: `VilaVila-Videos ${gateway.toUpperCase()}`,
				isSucceed: res.locals.isSucceed,
				email: res.locals.email,
				orderId: res.locals.orderId,
				price: res.locals.price,
				message: res.locals.message,
			});
		});
	} else {
		res.send('No callback found');
	}
});

module.exports = routes;
