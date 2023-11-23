//////////////////////////////////////////////////////////////////////////////////////
//    Author -TALIB HUSSAIN
//    Version - 1.0
//    Date -
//    Revision - 1
//    Component  -
//    Date : 15-11-23
//////////////////////////////////////////////////////////////////////////////////////

import Logo from "/logo1.png";


export default async function RazorpayPaymentScreenUpdated(orderId, dreturn) {
  console.log("the order id is....", orderId);
  var options = {
    description: 'Test payment',
    image: Logo,
    currency: 'INR',
    // key: '82d12be6-c5be-4f73-b94e-4793d7b99c10', //saying auth failed means working but wrong auth key
    key: 'rzp_test_NXHWEn0nSMDcnm',
    amount: 5000,
    name: 'Fines',
    order_id: orderId,
    prefill: {
      // email: profileData?.email,
      // contact: profileData?.mobileNumber,
      // name: profileData?.name,
      email: 'abc@gmail.com',
      contact: '9123254999',
      name: 'Mark Test',
    },
    theme: { color: "#3399cc" },
    handler: (response) => {
      console.log("Payment success:", response);
      console.log('payment response....')
      // _verifyOrder({ ...response, amount: data.amount, id: data.id, cartIds: data.cartIds });
      // _verifyOrder({ ...response });
    },
  };
  const rzpay = new Razorpay(options);
  rzpay.on("payment.failed", function (response) {
  console.log('payment failed....',response)
  });
  rzpay.open();
}