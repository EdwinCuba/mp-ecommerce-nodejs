var express = require('express');
var exphbs  = require('express-handlebars');

const { createPreference } = require('./mercadopago');

var port = process.env.PORT || 3000

var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

const getPaymentDataFromQuery = (query) => ({
    collectionId: query.collection_id || '-',
    collectionStatus: query.collection_status || '-',
    reference: query.external_reference || '-',
    paymentType: query.payment_type || '-',
    preferenceId: query.preference_id || '-',
    siteId: query.site_id || '-',
    processingMode: query.processing_mode || '-',
    merchantId: query.merchant_account_id || '-',
    paymentId: query.payment_id || '-',
    paymentMethod: query.payment_method_id || '-'
})

app.get('/', function (req, res) {
    res.render('home', {
        section: 'home'
    });
});

app.get('/detail', function (req, res) {
    res.render('detail', {
        section: 'item',
        ...req.query
    });
});

app.get('/failure', function (req, res) {
    res.render('payment-status', {
        section: '',
        status: 'failure',
        title: 'Ups... Ocurrio un error en el pago :(',
        ...getPaymentDataFromQuery(req.query)
    })
})
app.get('/pending', function (req, res) {
    res.render('payment-status', {
        section: '',
        status: 'pending',
        title: 'Tu pago esta pendiente',
        ...getPaymentDataFromQuery(req.query)
    })
})
app.get('/success', function (req, res) {
    res.render('payment-status', {
        section: '',
        status: 'success',
        title: 'Tu pago ha sido procesado con exito :)',
        ...getPaymentDataFromQuery(req.query)
    })
})

app.post('/create-preference', async function (req, res) {
    const { deviceId, payer, product } = req.body;
    const preference = await createPreference({ deviceId, payer, product });

    res.json(preference);
})

app.post('/payment-notification', async function (req, res) {
    const notification = req.body;
    console.log(notification);
    res.status(201).end();
})

app.listen(port);