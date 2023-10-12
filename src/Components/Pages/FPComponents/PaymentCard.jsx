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

function PaymentCard(props) {

    // 👉 URL constant 👈
    const { id } = useParams()

    // 👉 API constant 👈
    const { api_challanOfflinePayment } = ProjectApiList()

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

            if (values?.paymentMode == 'ONLINE') {
                goPayment()
            } else {
                setIsOpen(true)
            }

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

    // 👉 Function 5 👈
    const getOrderId = async () => {
        setisLoading(true)
        let url
        let orderIdPayload

        url = ''
        orderIdPayload = {
            applicationId: id,
        }
        console.log('before get order id...', orderIdPayload)
        AxiosInterceptors.post(url, orderIdPayload, ApiHeader3())  // This API will generate Order ID
            .then((res) => {
                console.log("Order Id Response ", res?.data)
                if (res?.data?.status === true) {
                    console.log("OrderId Generated True", res?.data?.data)
                    setOpenQr(true)
                }
                else {
                    activateBottomErrorCard(true, res?.data?.message)
                }
                setisLoading(false)
            })
            .catch((err) => {
                console.log("ERROR :-  Unable to Generate Order Id ", err)
                setisLoading(false)
                activateBottomErrorCard(true, "Unable to generate order id")

            })


    }

    // 👉 Function 6 👈
    const makePayment = (data) => {
        seterroState(false)
        setisLoading(true)
        let url
        let requestBody


        url = api_challanOfflinePayment
        requestBody = {
            applicationId: props?.demand?.application_id,
            challanId : id,
            paymentMode: data?.paymentMode,
        }

        console.log('before make payment..', requestBody)
        AxiosInterceptors.post(url, requestBody, ApiHeader3())
            .then(function (response) {
                console.log('fine and penalty payment response...', response?.data)
                if (response?.data?.status) {
                    settranNo(response?.data?.data?.tran_no)
                    setResponseScreenStatus(response?.data?.status)
                } else {
                    activateBottomErrorCard(true, response?.data?.message)
                }

                setisLoading(false)
            })
            .catch(function (error) {
                console.log('fine and penalty payment error..', error)
                activateBottomErrorCard(true, 'Error occured. Please try again later.')
                setisLoading(false)
            })
    }

    // 👉 Function 7 👈
    const goPayment = () => {
        setIsOpen(false)
        if (formik.values?.paymentMode == 'ONLINE') {
            getOrderId()
        } else {
            makePayment(formik.values)
        }
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

                <div className=" block p-4 w-full md:py-6 rounded-lg bg-white mx-auto ">

                    <form onSubmit={formik.handleSubmit} onChange={handleChange} className="p-4 relative">
                        <div className="grid grid-cols-12">

                            {/* 👉 Select Box 👈 */}
                            <div className="form-group mb-6 col-span-12 md:col-span-6 md:px-4">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold"><small className=" mt-1 text-sm font-semibold text-red-600 inline ">*</small>Payment Mode</label>
                                <select {...formik.getFieldProps('paymentMode')} type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer"
                                >

                                    <option value="CASH" >Cash</option>
                                    {/* <option value="CHEQUE" >Cheque</option> */}
                                    {/* <option value="DD" >DD</option> */}
                                    {/* <option value="ONLINE" >Online</option> */}

                                </select>
                                <span className="text-red-600 absolute text-xs">{formik.touched.paymentMode && formik.errors.paymentMode ? formik.errors.paymentMode : null}</span>
                            </div>

                            {/* 👉 Remarks 👈 */}
                            <div className="form-group mb-6 col-span-12 md:col-span-6 md:px-4">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Remarks</label>
                                <input {...formik.getFieldProps('remarks')} type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                                    placeholder="Enter Remarks" />
                                <span className="text-red-600 absolute text-xs">{formik.touched.remarks && formik.errors.remarks ? formik.errors.remarks : null}</span>
                            </div>

                            {/* 👉 toggle inputs of payment mode 👈 */}
                            {
                                (paymentMode == 'CHEQUE' || paymentMode == 'DD') && <>
                                    <div className="form-group mb-6 col-span-12 md:col-span-6 md:px-4">
                                        <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold"><small className=" mt-1 text-sm font-semibold text-red-600 inline ">*</small>Bank Name</label>
                                        <input {...formik.getFieldProps('bankName')} type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                                            placeholder="Enter Bank Name" />
                                        <span className="text-red-600 absolute text-xs">{formik.touched.bankName && formik.errors.bankName ? formik.errors.bankName : null}</span>
                                    </div>
                                    <div className="form-group mb-6 col-span-12 md:col-span-6 md:px-4">
                                        <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold"><small className=" mt-1 text-sm font-semibold text-red-600 inline ">*</small>Branch Name</label>
                                        <input {...formik.getFieldProps('branchName')} type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                                            placeholder="Enter Branch Name" />
                                        <span className="text-red-600 absolute text-xs">{formik.touched.branchName && formik.errors.branchName ? formik.errors.branchName : null}</span>
                                    </div>
                                    <div className="form-group mb-6 col-span-12 md:col-span-6 md:px-4">
                                        <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold"><small className=" mt-1 text-sm font-semibold text-red-600 inline ">*</small>Cheque/DD No</label>
                                        <input {...formik.getFieldProps('cheque_dd_no')} type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                                            placeholder="Enter Cheque/DD No" />
                                        <span className="text-red-600 absolute text-xs">{formik.touched.cheque_dd_no && formik.errors.cheque_dd_no ? formik.errors.cheque_dd_no : null}</span>
                                    </div>
                                    <div className="form-group mb-6 col-span-12 md:col-span-6 md:px-4">
                                        <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold"><small className=" mt-1 text-sm font-semibold text-red-600 inline ">*</small>Cheque/DD Date</label>
                                        <input {...formik.getFieldProps('cheque_dd_date')} type="date" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer"
                                            placeholder="Enter new ward no." />
                                        <span className="text-red-600 absolute text-xs">{formik.touched.cheque_dd_date && formik.errors.cheque_dd_date ? formik.errors.cheque_dd_date : null}</span>
                                    </div>
                                </>
                            }

                            {/* 👉 line break 👈 */}
                            <div className='col-span-12'></div>

                            {/* 👉 Payment Amount Details 👈 */}
                            {/* <div className="form-group mb-6 col-span-12 md:col-span-6 md:px-4">
                                <span>Amount :</span> <span className='font-mono font-semibold'>{indianAmount(props?.demand?.payment_amount)}</span>
                            </div>
                            <div className="form-group mb-6 col-span-12 md:col-span-6 md:px-4">
                                <span>Penalty :</span> <span className='font-mono font-semibold'>{indianAmount(props?.demand?.penalty_amount)}</span>
                            </div> */}
                            <div className="form-group mb-6 col-span-12 md:col-span-6 md:px-4">
                                <div className='w-2/3'><span>Total Payable Amount :</span> <span className='font-mono font-semibold text-xl'>{indianAmount(props?.demand?.amount)}</span></div>
                            </div>
                        </div>

                        {/* 👉 Payment Button 👈 */}
                        <div className="col-span-12 grid grid-cols-2 sm:mt-10 mt-6">

                            <div className=''>

                            </div>

                            {/* 👉 Payment Button 👈 */}
                            <div className='md:pl-10 text-right'>

                                {formik.values.paymentMode != "ONLINE" ?
                                    <button type='submit' className="sm:ml-4 font-bold sm:px-6 px-1.5 py-2 bg-indigo-500 text-white text-xs sm:text-sm leading-tight uppercase rounded  hover:bg-indigo-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out shadow-xl border border-white"><span className='sm:mr-2 mr-1'>Pay </span>
                                        {indianAmount(props?.demand?.amount)}
                                    </button>
                                    :
                                    <button type='submit' className="sm:ml-4 font-bold sm:px-6 px-1.5 py-2 bg-indigo-500 text-white text-xs sm:text-sm leading-tight uppercase rounded  hover:bg-indigo-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out shadow-xl border border-white"><span className='sm:mr-2 mr-1'>Genrate QR</span>
                                    </button>}
                            </div>

                        </div>

                    </form>

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

export default PaymentCard