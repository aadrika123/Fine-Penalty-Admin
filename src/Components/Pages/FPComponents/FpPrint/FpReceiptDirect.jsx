///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : FpReceipt
// 👉 Status      : Close
// 👉 Description : Receipt generating.
// 👉 Functions   :  
//                  1. activateBottomErrorCard -> To activate error card
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useEffect, useState } from 'react'
import './Reciept.css'
import ProjectApiList from '@/Components/api/ProjectApiList'
import BarLoader from '@/Components/Common/Loaders/BarLoader'
import { nullToNA, indianDate, checkErrorMessage } from '@/Components/Common/PowerupFunctions'
import { AiFillPrinter } from 'react-icons/ai'
import BottomErrorCard from '@/Components/Common/BottomErrorCard'
import useSetTitle from '@/Components/Common/useSetTitle'
import { useParams } from 'react-router-dom'
import rmclogo from '@/Components/assets/rmc.png'
import swachhBharat from '@/Components/assets/swachhBharat.png'
import ApiHeader from '@/Components/api/ApiHeader'
import QrCode from './QrCode'
import axios from 'axios'

const FpReceiptDirect = () => {

    // 👉 To set title 👈
    useSetTitle("Receipt")

    // 👉 URL constant 👈
    const { tranNo } = useParams()

    // 👉 Decoded url value 👈
    const transaction_no = decodeURIComponent(tranNo)

    // 👉 API constant 👈
    const { api_FpReceipt } = ProjectApiList()

    // 👉 State constants 👈
    const [receiptDetails, setreceiptDetails] = useState(null)
    const [erroState2, seterroState2] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setisLoading] = useState(false)

    // 👉 Funtion 1 👈
    const activateBottomErrorCard = (state, msg) => {
        setErrorMessage(msg)
        seterroState2(state)
        // if (!state) {
        //     window.history.back()
        // }
    }

    // 👉 To get receipt details 👈
    useEffect(() => {

        seterroState2(false)
        setisLoading(true)

        axios.post(api_FpReceipt, { transactionNo: transaction_no }, ApiHeader())
            .then((res) => {
                console.log('getting challan 2 details => ', res)
                setisLoading(false)

                if (res?.data?.status) {
                    setreceiptDetails(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
            })
            .catch((err) => {
                console.log("getting challan 2 error => ", err)
                setisLoading(false)
                activateBottomErrorCard(true, "Some error occured! Please try again later!!!")

            })
    }, [])


    return (
        <>

            {/* 👉 Error card 👈 */}
            {erroState2 && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={errorMessage} />}

            {/* 👉 Loader 👈 */}
            {isLoading && <BarLoader />}

            <div className="w-full h-screen md:pt-10">
                <div className="md:w-4/5 mx-auto shadow-xl bg-gray-50 md:py-10">

                    {/* 👉 Print Button 👈 */}
                    <div className='fixed bottom-10 text-center  justify-center items-center  w-screen z-40'>
                        <button onClick={() => window.print()} className="ml-4 font-bold px-6 py-1 bg-indigo-500 text-white  text-xs md:text-sm leading-tight uppercase rounded  hover:bg-indigo-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out shadow-xl border border-white">
                            <AiFillPrinter className='inline text-lg' />
                            Print
                        </button>
                    </div>

                    <div className="mx-auto print:block flex justify-center print:w-[98vw] print:drop-shadow-none print:shadow-none print:appearance-none" id="printableArea">
                        <div className="md:w-[70%] print:w-auto overflow-x-hidden border-2 border-dashed border-black py-4 px-2 md:px-3 relative h-[80vh] print:h-full print:border-2 print:border-black font-semibold">

                            {/* 👉 Logo & Heading 👈 */}
                            <div className=''>
                                <div className="flex flex-col justify-center items-center gap-x-4 md:absolute print:top-[4%] top-[5%] left-[25%] print:left-[5%]">
                                    <img src={rmclogo} alt="Logo" srcset="" className="h-16 w-16 appearance-none mix-blend-darken" />
                                    <span className="text-3xl font-bold uppercase">{receiptDetails?.ulbDetails?.ulb_name}</span>
                                </div>
                                <div className='w-full flex justify-center'>
                                    <div className='w-full flex justify-center mt-2'>
                                        <div className='flex flex-col items-center'>
                                            <div className=" text-xl md:text-2xl underline font-bold px-2 md:px-8 ">कार्यालय : राँची नगर निगम, राँची</div>
                                            <div className=" font-bold px-2 md:px-8 text-base mt-2">कचहरी रोड, राँची, पिन नo- 834001</div>
                                            <div className=" font- px-2 md:px-8 text-sm">E-mail ID- support@ranchimunicipal.com</div>
                                            <div className=" font- px-2 md:px-8 text-sm font-normal">Toll Free Number: 1800 890 4115</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 👉 Challan Details 👈 */}
                            <div className='grid grid-cols-12 items-center text-xs md:text-sm mt-8 gap-y-2 '>

                                <div className="col-span-12 md:col-span-8 flex gap-2">
                                    <div className="">रसीद क्रमांक:- </div>
                                    <div className="font-normal">{nullToNA(receiptDetails?.tran_no)}</div>
                                </div>

                                <div className="col-span-12 md:col-span-4 flex gap-2">
                                    <div className="">प्राप्ति दिनांक:- </div>
                                    <div className="font-normal">{indianDate(receiptDetails?.tran_date)}</div>
                                </div>

                                <div className="col-span-12 md:col-span-8 flex gap-2">
                                    <div className="">प्राप्त चालान क्रमांक:- </div>
                                    <div className="font-normal">{nullToNA(receiptDetails?.challan_no)}</div>
                                </div>

                                <div className="col-span-12 md:col-span-4 flex gap-2">
                                    <div className="">चालान दिनांक:- </div>
                                    <div className="font-normal">{indianDate(receiptDetails?.challan_date)}</div>
                                </div>

                                <div className="col-span-12 flex gap-2">
                                    <div className="">विभाग:- </div>
                                    <div className="font-normal">{nullToNA(receiptDetails?.department)}</div>
                                </div>

                                <div className="col-span-12 flex gap-2">
                                    <div className="w-full md:w-[10%] print:w-[15%]">कृत का विवरण:- </div>
                                    <div className="font-normal">{nullToNA(receiptDetails?.violation_name)}</div>
                                </div>

                            </div>


                            {/* 👉 Basic Details 👈 */}
                            <div className='flex justify-between mb-2 pt-4 gap-2 mt-6'>
                                <div className="text-start text-xs md:text-sm w-full flex flex-wrap gap-y-2 ">

                                    <div className="w-full flex gap-2 flex-wrap">
                                        <div className=""> श्रीमान/श्रीमती </div>
                                        <div className="w-[45%] border-dashed border-b-2 border-gray-500 font-normal ">{nullToNA(receiptDetails?.full_name)}</div>
                                        <div>से प्राप्त रुपये</div>
                                        <div className="w-[25%] border-dashed border-b-2 border-gray-500 font-normal ">{nullToNA(receiptDetails?.amount)}</div>
                                        <div>की राशि </div>
                                        <div className="w-[45%] border-dashed border-b-2 border-gray-500 font-normal ">{nullToNA(receiptDetails?.amount_in_words)}</div>
                                        <div>(शब्दों में)। नकद/चेक/डिमांड ड्राफ्ट/बैंकर्स चेक संख्या द्वारा </div>
                                        <div className="w-[25%] border-dashed border-b-2 border-gray-500 font-normal ">{nullToNA(receiptDetails?.payment_mode)}</div>
                                        <div>की ओर </div>
                                        <div className="w-[25%] border-dashed border-b-2 border-gray-500 font-normal ">{indianDate(receiptDetails?.tran_date)}</div>
                                        <div>दिनांक पर अंकित </div>
                                        <div className="w-[25%] border-dashed border-b-2 border-gray-500 font-normal ">{nullToNA(receiptDetails?.bank_name)}</div>
                                        <div>बैंक,</div>
                                        <div className="w-[25%] border-dashed border-b-2 border-gray-500 font-normal ">{nullToNA(receiptDetails?.branch_name)}</div>
                                        <div>बैंक का स्थान।</div>
                                        <div>रु.</div>
                                        <div className="w-[25%] border-dashed border-b-2 border-gray-500 font-normal ">{nullToNA(receiptDetails?.amount)}</div>
                                        <div>(आकृति में)</div>
                                        <div className="w-[45%] border-dashed border-b-2 border-gray-500 font-normal ">{nullToNA(receiptDetails?.amount_in_words)} ।</div>
                                    </div>

                                    <div className="w-full mt-16 flex justify-between items-center">
                                        <div className="w-[30%]">
                                            <QrCode url={window.location.href + '/direct'} size={90} />
                                        </div>
                                        <div className='w-[40%] flex flex-col gap-2 '>
                                            <div className='flex gap-1 w-full'><div className='w-full border-b-2 border-dashed border-gray-500'></div></div>
                                            <div>प्राधिकृत अधिकारी/ कर्मचारी का हस्ताक्षर</div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* 👉 bottom note 👈 */}
                            <div className="pt-1 mt-4 text-xs md:text-sm font-normal">

                                Note  :- Payment by cheque is subject to clearance.

                            </div>

                            {/* 👉 Bottom Contact Details 👈 */}
                            <div className='flex justify-start items-center mt-6 font-normal text-xs'>
                                अधिक जानकारी के लिए संपर्क करे : udhd.jharkhand.gov.in, 1800 890 4115 or 0651-3500700
                            </div>

                            {/* 👉 Bottom Image 👈 */}
                            <div className='flex justify-center items-center mt-4'>
                                <img src={swachhBharat} alt="" className="h-10 opacity-70" />
                            </div>

                            {/* 👉 Bottom Message 👈 */}
                            <div className='flex justify-center items-center mt-4 text-xs font-normal'>
                                यह रसीद कंप्यूटर द्वारा बनाई गई है और इसमें हस्ताक्षर की आवश्यकता नहीं है।
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default FpReceiptDirect