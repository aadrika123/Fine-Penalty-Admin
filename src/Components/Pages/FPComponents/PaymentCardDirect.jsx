///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : PaymentCard
// 👉 Status      : Close
// 👉 Description : Payment card exported to MarriagePayment.jsx.
// 👉 Functions   :  
//                  1. activateBottomErrorCard -> To activate error card
//                  2. handleChange            -> To handle input value.      
//                  3. closeModal              -> To close modal.    
//                  4. checkRuleSet            -> To check validation.    
//                  5. getOrderId              -> To generate order Id.    
//                  6. makePayment             -> For offline payment.     
//                  7. goPayment               -> For check payment method to make payment.  
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import Modal from 'react-modal'
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup'
import { allowCharacterNumberInput, allowCharacterSpaceCommaInput, allowNumberCharacterInput, allowNumberInput, indianAmount } from '@/Components/Common/PowerupFunctions';
import BottomErrorCard from '@/Components/Common/BottomErrorCard';
import CommonModal from '@/Components/Common/CommonModal';
import { FiAlertCircle } from 'react-icons/fi'
import BarLoader from '@/Components/Common/Loaders/BarLoader';
import ProjectApiList from '@/Components/api/ProjectApiList';
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';
import ApiHeader3 from '@/Components/api/ApiHeader';
import { RxCross1 } from 'react-icons/rx'
import QRCode from 'react-qr-code';
import ApiHeader from '@/Components/api/ApiHeader';
import RazorpayPaymentScreen from '@/Components/Common/RazorpayPaymentScreen';

// 👉 CSS constant for Modal 👈
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: 'none'
    },
};

function PaymentCardDirect(props) {

    // 👉 URL constant 👈
    const { id } = useParams()

    // 👉 API constant 👈
    const { api_challanOfflinePayment,api_generateOrderId } = ProjectApiList()

    // 👉 Navigation constant 👈
    const navigate = useNavigate()

    // 👉 State constants 👈
    const [responseScreenStatus, setResponseScreenStatus] = useState(false)
    const [isLoading, setisLoading] = useState(false);
    const [erroState, seterroState] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [tranNo, settranNo] = useState(null)
    const [erroMessage, seterroMessage] = useState(null);
    const [openQr, setOpenQr] = useState(false)
    const [paymentMode, setPaymentMode] = useState()

    // 👉 Link to direct payment using QR code 👈
    // In the upiLink variable, replace your-vpa@provider with your Virtual Payment Address (VPA) and MerchantName with the name of the merchant. Modify other parameters like mc (Merchant Category Code), tid (Transaction ID), tr (Order ID), tn (Payment Description), am (Amount), and cu (Currency) as needed.
    const upiLink = `upi://pay?pa=your-vpa@provider&pn=MerchantName&mc=1234&tid=1234567890&tr=order-id&tn=Payment%20Description&am=${props?.demand?.total_payable_amount}&cu=INR`;

    // 👉 Formik validation schema 👈
    let schema = yup.object({
        paymentMode: yup.string().required('select payment mode'),
        remarks: yup.string(),

        bankName: yup.string(),
        branchName: yup.string(),
        cheque_dd_no: yup.string(),
        cheque_dd_date: yup.string(),

    })

    // 👉 Formik constant 👈
    const formik = useFormik({
        initialValues: {
            paymentMode: 'CASH',

            remarks: '',
            bankName: '',
            branchName: '',
            cheque_dd_no: '',
            cheque_dd_date: '',
            payAdvance: '',
            advanceAmount: '',

        },

        validationSchema: schema,

        onSubmit: (values) => {
            console.log('values at submit payment', values)
            let ruleOk = checkRuleSet(values)
            if (!ruleOk) {
                return
            }
            getOrderId()

        }
    })

    // 👉 Function 1 👈
    const activateBottomErrorCard = (state, msg) => {
        seterroMessage(msg)
        seterroState(state)
    }

    // 👉 Function 2 👈
    const handleChange = (e) => {
        let name = e.target.name
        let value = e.target.value


        { (name == 'paymentMode') && setPaymentMode(value) }

        { name == 'remarks' && formik.setFieldValue("remarks", allowCharacterSpaceCommaInput(value, formik.values.remarks, 100)) }
        { name == 'bankName' && formik.setFieldValue("bankName", allowCharacterSpaceCommaInput(value, formik.values.bankName, 100)) }
        { name == 'branchName' && formik.setFieldValue("branchName", allowCharacterSpaceCommaInput(value, formik.values.branchName, 100)) }
        { name == 'cheque_dd_no' && formik.setFieldValue("cheque_dd_no", allowCharacterNumberInput(value, formik.values.cheque_dd_no, 20)) }
        { name == 'advanceAmount' && formik.setFieldValue("advanceAmount", allowNumberInput(value, formik.values.advanceAmount, 10)) }
    }

    // 👉 Function 3 👈
    const closeModal = () => setIsOpen(false);

    // 👉 Function 4 👈
    const checkRuleSet = (values) => {
        console.log('vlaues at ruleset..', values)
        if (values.paymentMode == 'CHEQUE' || values.paymentMode == 'DD') {
            if (values.bankName == '' || values.bankName == null) {
                activateBottomErrorCard(true, 'Please enter bank name')
                return false
            }
            if (values.branchName == '' || values.branchName == null) {
                activateBottomErrorCard(true, 'Please enter branch name')
                return false
            }
            if (values.cheque_dd_no == '' || values.cheque_dd_no == null) {
                activateBottomErrorCard(true, 'Please enter cheque/dd no.')
                return false
            }
            if (values.cheque_dd_date == '' || values.cheque_dd_date == null) {
                activateBottomErrorCard(true, 'Please enter cheque/dd date')
                return false
            }

        }
        return true
    }

    const paymentResponse = ()=>{
        console.log('payment response....')
    }

    // ════════════════════║ THIS FUNCTION GENERATES THE ORDER ID   ║═════════════════════════
    const getOrderId = async (values) => {
        setisLoading(true)
    
     let requestBody = {
        amount:props?.demand?.amount,
        challanId:id,
        applicationId:props?.demand?.application_id,
     }
    
        console.log( "orderidpayload at payment before...", requestBody);

        AxiosInterceptors.post(api_generateOrderId, requestBody, ApiHeader()) // This API will generate Order ID
          .then((res) => {
            console.log("Order Id Response ", res?.data);
            if (res?.data?.status === true) {
              console.log("OrderId Generated True", res?.data?.data);
              RazorpayPaymentScreen(res?.data?.data?.order_id, paymentResponse); //Send Response Data as Object (amount, orderId, ulbId, departmentId, applicationId, workflowId, userId, name, email, contact) will call razorpay payment function to show payment popup
            }
            else {
              // props.showLoader(false)
              activateBottomErrorCard(true, 'Error occured. Please try again later.')
            }
          })
          .catch((err) => {
            activateBottomErrorCard(true, 'Error occured. Please try again later.')
            console.log("ERROR :-  Unable to Generate Order Id ", err)
          }).finally(()=>{
            setisLoading(false)
          });
      };


    // 👉 Function 6 👈
    // const makePayment = (data) => {
    //     seterroState(false)
    //     setisLoading(true)
    //     let url
    //     let requestBody


    //     url = api_challanOfflinePayment
    //     requestBody = {
    //         applicationId: props?.demand?.application_id,
    //         challanId : id,
    //         paymentMode: data?.paymentMode,
    //     }

    //     console.log('before make payment..', requestBody)
    //     AxiosInterceptors.post(url, requestBody, ApiHeader3())
    //         .then(function (response) {
    //             console.log('fine and penalty payment response...', response?.data)
    //             if (response?.data?.status) {
    //                 settranNo(response?.data?.data?.tran_no)
    //                 setResponseScreenStatus(response?.data?.status)
    //             } else {
    //                 activateBottomErrorCard(true, response?.data?.message)
    //             }

    //             setisLoading(false)
    //         })
    //         .catch(function (error) {
    //             console.log('fine and penalty payment error..', error)
    //             activateBottomErrorCard(true, 'Error occured. Please try again later.')
    //             setisLoading(false)
    //         })
    // }

    // 👉 Function 7 👈
    const goPayment = () => {
        setIsOpen(false)
            getOrderId()
    }

    // 👉 Loader 👈
    if (isLoading) {
        return (
            <>
                <BarLoader />
            </>
        )
    }

    // 👉 View screen after successfull payment 👈
    if (responseScreenStatus == true) {
        return (
            <>
                <div className="w-full h-full bg-white sm:p-20 p-2">
                    <div>
                        <div className="text-center font-semibold text-3xl">Your payment has been successfully done !</div>
                        <div className="text-center mt-6">
                            <button className={`mr-4 bg-indigo-500  text-white px-6 py-1 shadow-lg hover:scale-105 rounded-sm`} onClick={() => navigate(`/fp-receipt/${encodeURIComponent(tranNo)}`)}>View Receipt</button>
                            <button className={`mr-4 bg-white border border-indigo-500 text-indigo-500 px-4 py-1 shadow-lg hover:scale-105 rounded-sm`} onClick={() => navigate(`/challan/${id}`)}>View Challan</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // 👉 QR code screen 👈
    if (openQr) {
        return (<CommonModal>

            <div className='relative bg-white w-[90vw] md:w-[50vw] h-[80vh] md:h-[35vw] py-8 gap-8 border rounded-md shadow-lg shadow-indigo-50 border-indigo-600 flex flex-col justify-center items-center'>
                <button className='absolute top-4 right-4 font-bold bg-red-200 p-2 rounded-full shadow-sm hover:bg-red-400' onClick={() => setOpenQr(false)}><RxCross1 /></button>
                <div className='flex justify-center'><span className='font-semibold border-b text-xl uppercase'>Scan To Pay</span>
                </div>
                <QRCode value={upiLink} />
                <div className=' font-semibold bg-green-300 px-8 py-1.5 rounded-sm'>
                    {indianAmount(props?.demand?.total_payable_amount)}
                </div>
            </div>

        </CommonModal>)
    }

    return (

        <>
            {/* 👉 Error card 👈 */}
            {erroState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={erroMessage} />}

            {/* 👉 Main Section 👈 */}
            <div className={` block sm:p-4 mt-4 w-full md:py-4 md:px-40 md:pb-0 md:pt-0 rounded-lg shadow-lg bg-white md:w-full mx-auto  overflow-x-auto mb-20 `}>

                <div className="p-4 w-full md:py-6 rounded-lg bg-white mx-auto flex justify-center items-center flex-col">

                            {/* 👉 line break 👈 */}
                            <div className="md:px-4">
                                <span>Total Payable Amount :</span> <span className='font-mono font-semibold text-xl'>{indianAmount(props?.demand?.amount)}</span>
                            </div>
                    <div className='mt-4'>
                                    <button onClick={getOrderId} type='button' className="sm:ml-4 font-bold sm:px-6 px-1.5 py-2 bg-indigo-500 text-white text-xs sm:text-sm leading-tight uppercase rounded  hover:bg-indigo-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out shadow-xl border border-white"><span className='sm:mr-2 mr-1'>Pay </span>
                                        {indianAmount(props?.demand?.amount)}
                                    </button>
                                   
                            </div>

                </div>

               

            </div>

            {/* 👉 Confirmation Modal 👈 */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >

                <div class="relative bg-white rounded-lg shadow-xl border-2 border-gray-50">
                    <button onClick={closeModal} type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" >
                        <svg class="w-5 h-5" fill="currentColor" ><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                    <div class="p-6 text-center">
                        <div className='w-full flex h-10'> <span className='mx-auto'><FiAlertCircle size={30} /></span></div>
                        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Confirm Payment</h3>
                        <button type="button" class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2" onClick={goPayment}>
                            Yes, I'm sure
                        </button>

                    </div>
                </div>

            </Modal>

        </>
    )
}

export default PaymentCardDirect