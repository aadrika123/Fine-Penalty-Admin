//////////////////////////////////////////////////////////////////////////////////////
//    Author -TALIB HUSSAIN
//    Version - 1.0
//    Date -
//    Revision - 1
//    Component  -
//    Date : 15-11-23
//////////////////////////////////////////////////////////////////////////////////////

import Logo from "/logo1.png";
import ApiHeader from "../api/ApiHeader";
import AxiosInterceptors from "./AxiosInterceptors";
import ProjectApiList from "../api/ProjectApiList";

const { api_verifyPaymentStatus } = ProjectApiList();

export default async function RazorpayPaymentScreen(orderId, dreturn) {
  console.log("the order id is....", orderId);

  let returnData;
  var options = {
    //   "prodAppKey": "82d12be6-c5be-4f73-b94e-4793d7b99c10", //
    //   "demoAppKey": "82d12be6-c5be-4f73-b94e-4793d7b99c10",
    key: "rzp_test_3MPOKRI8WOd54p",
    // key: "82d12be6-c5be-4f73-b94e-4793d7b99c10",
    amount: 200,
    currency: "INR",
    image: Logo,
    name: "UD&HD",
    description: "This is used for Testing Purpose",
    order_id: orderId,
    handler: async function (response) {
      // callApiLog(response)  // This function send the data to direct database => backend will verify the data
      console.log("All response", response);
      console.log("Payment ID", response.razorpay_payment_id);
      returnData = "data from handle: payment success";
      dreturn({ status: true, message: "Payment Success", data: response });
    },
    prefill: {
      name: "test mart",
      email: "testemail",
      contact: "9123254999",
    },
    modal: {
      ondismiss: function (response) {
        console.log("Payment Cancel BY user", response);
      },
      onfailed: function (response) {
        console.log("Payment Failed Response modal", response);
      },
    },
    theme: {
      color: "#3399cc",
    },
  };
  var pay = new window.Razorpay(options);

  pay.on("payment.failed", function (response) {
    console.log("Failed Response", response);
    // callApiLogFailed(response)  // This functin called when payment got failed. and data log will saved in bacend => using api 2
    dreturn({ status: false, message: "Payment Failed", data: response });
  });

  pay.open();

  return returnData;
}

//API 2 - when payment success we will keep the log in backend
const callApiLog = (response) => {
  const sendPayload = {
    razorpayOrderId: response.razorpay_order_id,
    razorpayPaymentId: response.razorpay_payment_id,
    razorpaySignature: response.razorpay_signature,
  };

  AxiosInterceptors.post(api_verifyPaymentStatus, sendPayload, ApiHeader()) /// This API Will save the data. When response come after payment Sucess -> Not Nessesary
    .then((res) => {
      console.log("2nd API Data saved ", res);
    })
    .catch((err) => {
      console.log("Error when inserting 2 api data ", err);
    });
};

//API 2 - when payment failed we will keep the log in backend
const callApiLogFailed = (response) => {
  const sendPayload = {
    razorpayOrderId: response.error.metadata.order_id,
    razorpayPaymentId: response.error.metadata.payment_id,
    reason: response.error.reason,
    source: response.error.source,
    step: response.error.step,
    code: response.error.code,
    description: response.error.description,
  };

  AxiosInterceptors.post(api_verifyPaymentStatus, sendPayload, ApiHeader()) /// This API Will save the data. When response come after payment FAILED -> Not Nessesary
    .then((res) => {
      console.log("2nd API Filed Data saved ", res);
    })
    .catch((err) => {
      console.log("Error when inserting 2 api Failed data ", err);
    });
  // }

  return RazorpayPaymentScreen;
};
