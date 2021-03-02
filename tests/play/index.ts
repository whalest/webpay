import { WebPayForm, checkSign } from "../../dist";
import dayjs from "dayjs";

const start = async (baby?: string) => {
  const webpay = new WebPayForm({
    fields: {
      wsb_storeid: "614441705",
      wsb_store: "Название Вашего магазина",
      wsb_order_num: "ORDER-12345678",
      wsb_startsessdatetime: dayjs().add(20, "m").format(),
      wsb_startsesstime: dayjs().add(20, "m").unix(),
    },
    items: [
      {
        id: "3",
        name: "123",
        price: 0.23,
        quantity: 2,
      },
      {
        name: "Сертификат на 3$",
        price: 5,
        quantity: 1,
      },
    ],

    secret: "f3f5e53bb808",
  });

  const result = webpay.getForm();

  console.log(result);
};

start();

const res = checkSign(
  {
    batch_timestamp: "1610370522",
    currency_id: "BYN",
    amount: "100",
    payment_method: "cc",
    order_id: "187313",
    site_order_id: "19440",
    transaction_id: "246485428",
    payment_type: "4",
    rrn: "136663692426",
    wsb_signature: "ab88459db0110b0677568c777caf2ebe",
    action: "0",
    rc: "W0001(00)",
    approval: "136663",
  },
  "f3f5e53bb808"
);
console.log(res);
