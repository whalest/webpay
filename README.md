# webpay-by

![webpay-by](https://github.com/whalest/webpay/blob/main/assets/main.png?raw=true)

Webpay.by form fields api for Belarus payment system

- axios
- typescript (autocomplete all filed)

ideal for `express` micro-service

## Generate form

```ts
import { WebPayForm } from 'webpay-by'

const isTest = process.env.NODE_ENV === 'development'

const webpay = new WebPayForm({
  fields: {
    wsb_storeid: isTest ? '444433331' : '444433333',
    wsb_store: 'store_name',
    wsb_test: isTest ? 1 : 0,
    wsb_order_num: `31467`,
    wsb_customer_name: 'Alex Bream',
    wsb_email: 'sales@webpay.by',
    wsb_phone: '+375172198434',
    wsb_notify_url: `https://mysite.com/pay/notify`,
    wsb_return_url: `https://mysite.com/pay/success`,
    wsb_cancel_return_url: `https://mysite.com/pay/cancel`,
    wsb_startsesstime: +new Date(),
  },
  secret: 'adsd231edqsada4',
})

webpay.addItem({
  name: `Apple iPhone XR 64GB`,
  price: 1200,
  quantity: 1,
})

webpay.getForm()
```

and see vue component in examples folder

# CheckSign

use node module `crypto` (not support in browser)

```ts
import { checkSign } from 'webpay-by'

const result = checkSign(
  {
    batch_timestamp,
    currency_id,
    amount,
    payment_method,
    order_id,
    site_order_id,
    transaction_id,
    payment_type,
    rrn,
  },
  'adsd231edqsada4'
)

if (!result) {
  console.log('error checking sign')
}
```

inspired [node-webpayby](https://github.com/menavita/node-webpayby)

## TODO

- add examples
