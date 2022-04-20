const { OnePayDomestic, OnePayInternational } = require('vn-payments');
/* eslint-disable no-param-reassign */
// const { Countries } = require('../countries');

const onepayIntl = new OnePayInternational({
	paymentGateway: 'https://mtf.onepay.vn/vpcpay/vpcpay.op',
	merchant: 'TESTONEPAY',
	accessCode: '6BEB2546',
	secureSecret: '6D0870CDE5F24F34F3915FB0045120DB',
});

const onepayDom = new OnePayDomestic({
	paymentGateway: 'https://mtf.onepay.vn/onecomm-pay/vpc.op',
	merchant: 'ONEPAY',
	accessCode: 'D67342C2',
	secureSecret: 'A3EFDFABA8653DF2342E8DAC29B51AF0',
});

module.exports = function checkoutOnePayDomestic(req, res) {
	const checkoutData = res.locals.checkoutData;
	checkoutData.returnUrl = `http://${req.headers.host}/payment/onepaydom/callback`;

	return onepayDom.buildCheckoutUrl(checkoutData).then(checkoutUrl => {
		res.locals.checkoutUrl = checkoutUrl;

		return checkoutUrl;
	});
}

module.exports = function callbackOnePayDomestic(req, res) {
	const query = req.query;

	return onepayDom.verifyReturnUrl(query).then(results => {
		if (results) {
			res.locals.email = 'tu.nguyen@naustud.io';
			res.locals.orderId = results.orderId || '';
			res.locals.price = results.amount;

			res.locals.isSucceed = results.isSuccess;
			res.locals.message = results.message;
		} else {
			res.locals.isSucceed = false;
		}
	});
}

module.exports = function checkoutOnePayInternational(req, res) {
	const checkoutData = res.locals.checkoutData;

	checkoutData.againLink = `http://${req.headers.host}/`; // back URL when user cancel payment
	checkoutData.returnUrl = `http://${req.headers.host}/payment/onepayintl/callback`;

	return onepayIntl.buildCheckoutUrl(checkoutData).then(checkoutUrl => {
		res.locals.checkoutUrl = checkoutUrl;

		return checkoutUrl;
	});
}

module.exports = function callbackOnePayInternational(req, res) {
	const query = req.query;

	return onepayIntl.verifyReturnUrl(query).then(results => {
		if (results) {
			res.locals.email = 'tu.nguyen@naustud.io';
			res.locals.orderId = results.orderId || '';
			res.locals.price = results.amount;
			// res.locals.billingStreet = results.billingStreet;
			// res.locals.billingCountry = Countries[results.billingCountry];
			// res.locals.billingStateProvince = results.billingStateProvince;
			// res.locals.billingCity = results.billingCity;
			// res.locals.billingPostalCode = results.billingPostCode;

			res.locals.isSucceed = results.isSuccess;
			res.locals.message = results.message;
		} else {
			res.locals.isSucceed = false;
		}
	});
}
