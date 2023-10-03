import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'
import BottomErrorCard from '@/Components/Common/BottomErrorCard'
import ShimmerEffectInline from '@/Components/Common/Loaders/ShimmerEffectInline'
import { checkErrorMessage, nullToNA } from '@/Components/Common/PowerupFunctions'
import ApiHeader from '@/Components/api/ApiHeader'
import ProjectApiList from '@/Components/api/ProjectApiList'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const DifferenceDetails = () => {

    const { id } = useParams()

    const { api_compData } = ProjectApiList()

    const [cList, setcList] = useState([])
    const [loader, setLoader] = useState(false)
    const [errorState, setErrorState] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const activateBottomErrorCard = (state, message) => {
        setErrorState(state)
        setErrorMessage(message)
    }

    const fetchComparisionList = () => {

        setLoader(true)

        AxiosInterceptors
            .post(api_compData, { applicationId: id }, ApiHeader())
            .then((res) => {

                console.log("getting comparision chart response => ", res)

                if (res?.data?.status) {
                    setcList(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }

            })
            .catch((err) => {
                console.log("error getting comp chart => ", err)
                activateBottomErrorCard(true, "Server Error, Please try again later !!!")

            })
            .finally(() => {
                setLoader(false)
                setErrorState(false)
            })
    }

    useEffect(() => {
        fetchComparisionList()
    }, [])

    return (
        <>
            {/* 👉 Error Card 👈 */}
            {errorState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={errorMessage} />}

            {/* 👉 Main Screen 👈 */}
            <div className='w-full flex flex-col gap-5  p-4 md:p-6 transition-all duration-200'>
                {/* 👉 Header 👈 */}
                <h1 className="text-2xl font-semibold uppercase text-center text-gray-700 border-b border-gray-400 mb-4 pb-1 tracking-widest">Comparision Chart</h1>

                {
                    loader && <ShimmerEffectInline />
                }

                {!loader &&

                    <>

                        <div className='bg-white p-4'>
                            <table className='w-full grid grid-cols-12'>
                                <tr className='col-span-12 grid grid-cols-12 items-center bg-slate-200 p-2 text-slate-600 text-lg'>
                                    <th className='col-span-4 text-start font-bold '>#</th>
                                    <th className='col-span-4 text-start font-bold '>Apply Data</th>
                                    <th className='col-span-4 text-start font-bold '>Approved Data</th>
                                </tr>
                                {
                                    cList?.length > 0 ?
                                        <>{cList?.map((elem) =>
                                            <>
                                                <tr className='col-span-12 grid grid-cols-12 items-center px-2 py-1.5 border-b'>
                                                    <td className='col-span-4 font-semibold'>{elem?.displayString}</td>
                                                    <td className='col-span-4'>{nullToNA(elem?.applied)}</td>
                                                    <td className='col-span-4'>{nullToNA(elem?.final)}</td>
                                                </tr>
                                            </>
                                        )}
                                        </>
                                        :
                                        <tr className='col-span-12 mt-4 w-full border border-red-200 bg-red-100 text-center text-red-500 py-2 text-lg'>
                                            <td colSpan={3} className='flex justify-center'>Oops! No Comparision Data available.</td>
                                        </tr>
                                }

                            </table>
                        </div>

                    </>

                }

            </div>
        </>
    )
}

export default DifferenceDetails