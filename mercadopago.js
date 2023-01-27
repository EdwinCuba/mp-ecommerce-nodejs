const mercadopago = require('mercadopago');

const INTEGRATOR_ID = 'dev_24c65fb163bf11ea96500242ac130004';
const ACCESS_TOKEN = 'APP_USR-5803173797352206-050918-e3faf048a99e583771de8f2d1fb47065-1120797873'
mercadopago.configure({
  access_token: ACCESS_TOKEN,
  integrator_id: INTEGRATOR_ID,
})

const HOST = process.env.HOST || 'http://localhost:3000';

const createPreference = async ({ deviceId, product, payer: customer }) => {
  const payer = {
    name: customer.firstName,
    surname: customer.lastName,
    email: customer.email,
    phone: {
      area_code: "51",
      number: customer.phone
    },
    address: {
      zip_code: customer.address.zipCode,
      street_name: customer.address.streetName,
      street_number: customer.address.streetNumber
    }
  }

  const items = [
    {
      id: product.id,
      title: product.name,
      description: product.description,
      picture_url: product.imageUrl,
      category_id: 'phones',
      quantity: product.quantity,
      unit_price: product.price,
    }
  ];

  const back_urls = {
    success: `${HOST}/success`,
    pending: `${HOST}/pending`,
    failure: `${HOST}/failure`,
  }

  const payment_methods = {
    excluded_payment_methods: [{ id: 'visa' }],
    installments: 6
  }

  const preference = {
    payer,
    items,
    back_urls,
    payment_methods,
    auto_return: 'approved',
    external_reference: 'edwincubad@gmail.com',
    notification_url: `${HOST}/payment-notification`
  }
  
  const newPreference = await mercadopago.preferences.create(preference, {
    headers: { 'x-meli-session-id': deviceId },
  })
  
  return { id: newPreference.body.id };
}

module.exports = { createPreference };