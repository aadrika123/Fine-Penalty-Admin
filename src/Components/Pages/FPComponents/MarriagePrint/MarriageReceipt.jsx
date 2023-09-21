///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : MarriagePayment
// 👉 Status      : Close
// 👉 Description : This component is for payment.
// 👉 Functions   :  
//                  1. activateBottomErrorCard -> To activate error card
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useEffect, useState } from 'react'
import './Reciept.css'
import ProjectApiList from '@/Components/api/ProjectApiList'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'
import BarLoader from '@/Components/Common/Loaders/BarLoader'
import { nullToNA, indianAmount, indianDate, checkErrorMessage } from '@/Components/Common/PowerupFunctions'
import QrCode from './QrCode'
import ApiHeader3 from '@/Components/api/ApiHeader'
import { AiFillPrinter } from 'react-icons/ai'
import BottomErrorCard from '@/Components/Common/BottomErrorCard'
import useSetTitle from '@/Components/Common/useSetTitle'
import { useParams } from 'react-router-dom'

const MarriageReceipt = () => {

    // 👉 To set title 👈
    useSetTitle("Marriage Receipt")

    // 👉 URL constant 👈
    const { tran } = useParams()

    // 👉 Decoding URL 👈
    var tranNo = decodeURIComponent(tran)

    // 👉 API constant 👈
    const { api_MarriageReceipt } = ProjectApiList()

    // 👉 State constants 👈
    const [samDetails, setsamDetails] = useState()
    const [erroState2, seterroState2] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setisLoading] = useState(false)

    // 👉 Funtion 1 👈
    const activateBottomErrorCard = (state, msg) => {
        setErrorMessage(msg)
        seterroState2(state)
        if (!state) {
            window.history.back()
        }
    }

    // 👉 To get receipt details 👈
    useEffect(() => {

        seterroState2(false)
        setisLoading(true)

        AxiosInterceptors.post(api_MarriageReceipt, { transactionNo: tranNo }, ApiHeader3())
            .then((res) => {
                console.log('getting marriage receipt details => ', res)
                setisLoading(false)

                if (res?.data?.status) {
                    setsamDetails(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
            })
            .catch((err) => {
                console.log("getting marriage receipt error => ", err)
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

            {/* 👉 Print Button 👈 */}
            <div className='fixed bottom-10 text-center  justify-center items-center  w-screen z-40'>
                <button onClick={() => window.print()} className="ml-4 font-bold px-6 py-1 bg-indigo-500 text-white  text-sm leading-tight uppercase rounded  hover:bg-indigo-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out shadow-xl border border-white">
                    <AiFillPrinter className='inline text-lg' />
                    Print
                </button>
            </div>

            <div className="flex items-center justify-center text-black print:border-2 print:border-dashed print:border-black" id="printableArea">
                <div className="container w-[70%]  overflow-x-hidden border-2 print:border-none border-dashed border-black py-4 px-3 relative">

                    <img src={samDetails?.ulbDetails?.state_logo} alt="Background Image" srcset="" className='absolute top-[20%] left-[18%] backImage opacity-10' />

                    {/* 👉 Logo Heading 👈 */}
                    <div>
                        <div className="flex flex-col justify-center items-center gap-x-4">
                            <img src={samDetails?.ulbDetails?.ulb_logo} alt="Logo" srcset="" className="h-16 w-16" />
                            <span className="text-3xl font-bold uppercase">{samDetails?.ulbDetails?.ulb_name}</span>
                        </div>
                        <div className='w-full flex justify-center'>
                            <div className='w-full flex justify-center mt-2'>
                                <div className='grid grid-cols-6 w-max'>
                                    <div className="col-span-6 uppercase border-2 font-bold border-black px-8 py-1 text-md">Marriage Payment Receipt</div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* 👉 Basic Details 👈 */}
                    <div className='flex justify-between font-semibold mb-2 pt-4 gap-2'>
                        <div className="text-start text-xs font-semibold w-[65%]">
                            Bride Name: <span className="font-normal capitalize">{nullToNA(samDetails?.bride_name)}</span> <br />
                            Groom Name: <span className="font-normal capitalize">{nullToNA(samDetails?.groom_name)}</span> <br />
                            Marriage Place: <span className="font-normal capitalize">{nullToNA(samDetails?.marriage_place)}</span> <br />
                            Marriage Date: <span className="font-normal capitalize">{indianDate(samDetails?.marriage_date)}</span>
                        </div>
                        <div className="text-left text-xs w-[35%]">
                            Application No.: <span className="font-normal">{nullToNA(samDetails?.application_no)}</span> <br />
                            Receipt Date: <span className="font-normal">{indianDate(samDetails?.tran_date)}</span> <br />
                            Transaction No.: <span className="font-normal">{nullToNA(tran)}</span>
                        </div>

                    </div>

                    {/* 👉 Space 👈 */}
                    <div>
                        <p className="text-xs mb-2">

                        </p>
                    </div>

                    {/* 👉 Amount Details 👈 */}
                    <div className='text-xs flex flex-col gap-1 pb-4'>

                        <div className='flex flex-col sm:flex-row print:flex-row'>
                            <h1 className='flex text-gray-900 font-sans '>A Sum of :</h1>
                            <h1 className='flex font-sans font-normal pl-2 '>{indianAmount(samDetails?.total_paid_amount)}</h1>
                        </div>
                        <div className='flex  flex-col sm:flex-row print:flex-row'>
                            <h1 className='flex text-gray-900 font-sans '>(in words) :</h1>
                            <h1 className='flex font-sans font-normal pl-2 border-b border-dashed border-gray-600 '> {nullToNA(samDetails?.paid_amount_in_words)} Rupees Only</h1>
                        </div>
                        <div className='flex  flex-col sm:flex-row print:flex-row'>
                            <h1 className='flex text-gray-900 font-sans'>Vide :  <span className=' font-sans font-normal ml-1'>{nullToNA(samDetails?.payment_mode)}</span></h1>
                        </div>
                    </div>

                    {/* 👉 Table 👈 */}
                    <div>
                        <table className="text-xs w-full border-2 border-black">

                            <tr className="font-semibold">
                                <td className="border-2 border-black w-[50%] px-2">Description</td>
                                <td className="border-2 border-black w-[25%] px-2">Amount</td>
                            </tr>

                            <tr>
                                <td className="px-2 border-2 border-black">Registration Amount</td>
                                <td className="px-2 border-2 border-black">{indianAmount(samDetails?.registration_amount)}</td>
                            </tr>
                            <tr>
                                <td className="px-2 border-2 border-black">Penalty Amount</td>
                                <td className="px-2 border-2 border-black">{indianAmount(samDetails?.penalty_amount)}</td>
                            </tr>

                            <tr>
                                <td className="px-2 border-2 border-black font-semibold text-right" colSpan={1}>Total Amount</td>
                                <td className="px-2 border-2 border-black">{indianAmount(samDetails?.total_paid_amount)} </td>
                            </tr>

                        </table>
                    </div>

                    {/* 👉 QR 👈 */}
                    <div className="my-4 w-full flex flex-row justify-between items-start">

                        <div>
                            <QrCode size='60' url={window.location.href} />
                        </div>

                    </div>

                    {/* 👉 bottom note 👈 */}
                    <div className="font-semibold mt-4 text-sm">
                        NOTE: This is a computer generated receipt. This receipt does not require physical signature.
                    </div>

                </div>
            </div>
        </>
    )
}

export default MarriageReceipt