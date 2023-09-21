///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : MarriagePayment
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
import { indianDate, nullToNA } from '@/Components/Common/PowerupFunctions'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'
import PaymentCard from './PaymentCard'
import useSetTitle from '@/Components/Common/useSetTitle'

const MarriagePayment = () => {

    // 👉 To set title 👈
    useSetTitle("Marriage Payment")

    // 👉 API constant 👈
    const { api_getDetails } = ProjectApiList()

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
        AxiosInterceptors.post(api_getDetails, { applicationId: id }, ApiHeader3())
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
                        <h1 className='bg-white shadow-lg shadow-indigo-300 text-indigo-500 border-[0.17vw] border-indigo-500 px-[4vw] py-[1.5vh] w-max font-semibold text-[2.8vh]'>Marriage Payment Screen</h1>
                    </div>

                    {/* 👉 Details sections 👈 */}
                    <div className='flex items-center flex-wrap w-full text-sm bg-white p-4 shadow-lg gap-2 mt-4'>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[22%]'>
                            <div>Application No. </div>
                            <div className='font-semibold text-base'>{nullToNA(details?.application_no)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[22%]'>
                            <div>Groom Name </div>
                            <div className='font-semibold text-base'>{nullToNA(details?.groom_name)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[22%]'>
                            <div>Bride Name </div>
                            <div className='font-semibold text-base'>{nullToNA(details?.bride_name)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[22%]'>
                            <div>Marriage Date </div>
                            <div className='font-semibold text-base'>{indianDate(details?.marriage_date)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[22%]'>
                            <div>Marriage Place </div>
                            <div className='font-semibold text-base'>{nullToNA(details?.marriage_place)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[27%]'>
                            <div>Either of the Bride or Groom belongs to BPL category ?</div>
                            <div className='font-semibold text-base'>{nullToNA(details?.is_bpl)}</div>
                        </div>
                        <div className='flex flex-col flex-wrap justify-center w-full md:w-[22%]'>
                            <div>Appointment Date </div>
                            <div className='font-semibold text-base'>{indianDate(details?.appointment_date)}</div>
                        </div>
                    </div>

                    {/* 👉 Payment Card 👈 */}
                    <div>

                        {details?.is_bpl ? <>
                            <div className="w-full h-full bg-white sm:p-20 p-2">
                                <div>
                                    <div className="text-center font-semibold text-3xl">As you belongs to BPL category, so you don't need to pay. And your application is sent for verification.</div>
                                    <div className="text-center mt-6">
                                        <button className={`mr-4 bg-white border border-indigo-500 text-indigo-500 px-4 py-1 shadow-lg hover:scale-105 rounded-sm`} onClick={() => navigate(`/marriage-details/${id}`)}>View Application</button>
                                    </div>
                                </div>
                            </div>
                        </> : <PaymentCard demand={details} />}

                    </div>

                </div>
            }

        </>
    )
}

export default MarriagePayment