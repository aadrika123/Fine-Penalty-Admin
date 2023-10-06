///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : FpPayment
// 👉 Status      : Close
// 👉 Description : This component is for payment.
// 👉 Functions   :  
//                  1. activateBottomErrorCard -> To activate error card
//                  2. getDetailsFun           -> To fetch the details of a specific marriage registration.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProjectApiList from '@/Components/api/ProjectApiList'
import ApiHeader3 from '@/Components/api/ApiHeader'
import BarLoader from '@/Components/Common/Loaders/BarLoader'
import BottomErrorCard from '@/Components/Common/BottomErrorCard'
import { indianAmount, indianDate, nullToNA } from '@/Components/Common/PowerupFunctions'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'
import PaymentCard from './PaymentCard'
import useSetTitle from '@/Components/Common/useSetTitle'
import ApiHeader from '@/Components/api/ApiHeader'

const FpPayment = () => {

    // 👉 To set title 👈
    useSetTitle("Fines & Penalties Payment")

    // 👉 API constant 👈
    const { api_getChallanById } = ProjectApiList()

    // 👉 URL constant 👈
    const { id } = useParams()

    // 👉 Navigation constant 👈
    const navigate = useNavigate()

    // 👉 State constants 👈
    const [loader, setloader] = useState(false)
    const [details, setdetails] = useState(null)
    const [errorState, seterrorState] = useState(false)
    const [errorMessage, seterrorMessage] = useState('')

    // 👉 Function 1 👈
    const activateBottomErrorCard = (state, msg) => {
        seterrorMessage(msg)
        seterrorState(state)
        if (!state) {
            window.history.back()
        }
    }

    // 👉 Function 2 👈
    const getDetailsFun = () => {
        setloader(true)
        AxiosInterceptors.post(api_getChallanById, { challanId: id }, ApiHeader())
            .then((res) => {
                console.log("getting response of user data => ", res)
                if (res?.data?.status) {
                    console.log("user data => ", res?.data?.data)
                    setdetails(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, res?.data?.message)
                }
            })
            .catch((err) => {
                console.log("getting error user details marriage => ", err)
                activateBottomErrorCard(true, "Error getting user details, please try again later !")
            })
            .finally(() => {
                setloader(false)
            })
    }

    // 👉 To call Function 2 👈
    useEffect(() => {
        getDetailsFun()
    }, [])

    return (
        <>

            {/* 👉 Loader 👈 */}
            {
                loader && <BarLoader />
            }

            {/* 👉 Error Card 👈 */}
            {errorState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={errorMessage} />}

            {!loader &&

                // 👉 Main Section 👈
                <div className='animate__animated animate__fadeIn animate__faster overflow-x-hidden overflow-y-scroll w-[99%] mx-auto rounded-md gap-6 h-full p-[1vw]'>

                    {/* 👉 Heading 👈 */}
                    <div className='flex justify-center mb-6'>
                        <h1 className='bg-white shadow-lg shadow-indigo-300 text-indigo-400 w-max font-semibold text-2xl px-6 py-2 border border-indigo-400'>Fines & Penalties Payment</h1>
                    </div>

                    {/* 👉 Details sections 👈 */}
                    <div className='flex items-center flex-wrap w-full text-sm bg-white p-4 shadow-lg gap-2 mt-4'>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[27%]'>
                            <div>Name</div>
                            <div className='font-semibold text-base'>{nullToNA(details?.full_name)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[22%]'>
                            <div>Mobile No.</div>
                            <div className='font-semibold text-base'>{nullToNA(details?.mobile)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[22%]'>
                            <div>Challan No. </div>
                            <div className='font-semibold text-base'>{nullToNA(details?.challan_no)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[22%]'>
                            <div>Challan Date </div>
                            <div className='font-semibold text-base'>{indianDate(details?.challan_date)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full'>
                            <div>Violation Made </div>
                            <div className='font-semibold text-base'>{nullToNA(details?.violation_name)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[22%]'>
                            <div>Violation Section </div>
                            <div className='font-semibold text-base'>{nullToNA(details?.violation_section)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[22%]'>
                            <div>Penalty Amount </div>
                            <div className='font-semibold text-base'>{indianAmount(details?.amount)}</div>
                        </div>
                    </div>

                    {/* 👉 Payment Card 👈 */}
                    <div>

                        {details?.is_bpl ? <>
                            <div className="w-full h-full bg-white sm:p-20 p-2">
                                <div>
                                    <div className="text-center font-semibold text-3xl">As you belongs to BPL category, so you don't need to pay. And your application is sent for verification.</div>
                                    <div className="text-center mt-6">
                                        <button className={`mr-4 bg-white border border-indigo-500 text-indigo-500 px-4 py-1 shadow-lg hover:scale-105 rounded-sm`} onClick={() => navigate(`/fp-details/${id}`)}>View Application</button>
                                    </div>
                                </div>
                            </div>
                        </> : <>
                            {
                                details?.payment_status ?
                                    <div className="w-full h-full bg-white sm:p-20 p-2">
                                        <div>
                                            <div className="text-center font-semibold text-3xl">Payment Already Done. You can view your receipt or challan.</div>
                                            <div className="text-center mt-6">
                                                <button className={`mr-4 bg-indigo-500  text-white px-6 py-1 shadow-lg hover:scale-105 rounded-sm`} onClick={() => navigate(`/fp-receipt/${encodeURIComponent(details?.tran_no)}`)}>View Receipt</button>
                                                <button className={`mr-4 bg-white border border-indigo-500 text-indigo-500 px-4 py-1 shadow-lg hover:scale-105 rounded-sm`} onClick={() => navigate(`/challan/${id}`)}>View Challan</button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <PaymentCard demand={details} />
                            }
                        </>}

                    </div>

                </div>
            }

        </>
    )
}

export default FpPayment