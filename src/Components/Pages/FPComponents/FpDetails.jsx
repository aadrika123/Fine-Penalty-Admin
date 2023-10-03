///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : FpDetails
// 👉 Status      : Close
// 👉 Description : This component is to view fine & penalty details (Dynamic data).
// 👉 Functions   :  
//                  1. activateBottomErrorCard -> To activate error card
//                  2. getDetails              -> To fetch the details of marriage.
//                  3. getDocListFun           -> To fetch the list of uploaded documents of marriage.
//                  4. openModal               -> To open the document viewer modal.
//                  5. closeModal              -> To close the document viewer modal.
//                  6. modalAction             ->  To perform action for modal
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing packages 👈
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'
import ProjectApiList from '@/Components/api/ProjectApiList'
import BarLoader from '@/Components/Common/Loaders/BarLoader'
import { nullToNA } from '@/Components/Common/PowerupFunctions'
import { MdTag } from 'react-icons/md'
import BottomErrorCard from '@/Components/Common/BottomErrorCard'
import ApiHeader3 from '@/Components/api/ApiHeader'
import PilotWorkflowDocumentRow from '@/Components/Common/WORKFLOW_PILOT/PilotWorkflowTabs/PilotWorkflowDocumentRow'
import Modal from 'react-modal';
import { RxCross2 } from 'react-icons/rx'
import useSetTitle from '@/Components/Common/useSetTitle'

const FpDetails = () => {

    // 👉 To set title 👈
    useSetTitle("Fine & Penalty Details")

    // 👉 URL constant 👈
    const { id } = useParams()

    // 👉 API constants 👈
    const { fpDetails, getFpUploadedDocument } = ProjectApiList()

    // 👉 Navigation constant 👈
    const navigate = useNavigate()

    // 👉 State Constants 👈
    const [loader, setLoader] = useState(false)
    const [marriageData, setMarriageData] = useState(null)
    const [errorState, setErrorState] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [docList, setDocList] = useState(null)
    const [docType, setdocType] = useState(null)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [docUrl, setDocUrl] = useState('')
    const [errorImage, seterrorImage] = useState(false)

    // 👉 Function 1 👈
    const activateBottomErrorCard = (state, message) => {
        setErrorState(state)
        setErrorMessage(message)
        // if (state == false) {
        //     navigate(`/fp-list`)
        // }
    }

    // 👉 Function 2 👈
    const getDetails = () => {
        AxiosInterceptors.post(fpDetails, { applicationId: id }, ApiHeader3())
            .then((res) => {

                console.log('fine & penalties details response => ', res)
                if (res?.data?.status) {
                    setMarriageData(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, res?.data?.message)
                }
            })
            .catch((err) => {
                console.log("fine & penalties details error  => ", err)
                activateBottomErrorCard(true, "Some error occured! Please try again later")
            })
            .finally(() => {
                setLoader(false)
            })
    }

    // 👉 Function 3 👈
    const getDocListFun = () => {
        AxiosInterceptors.post(getFpUploadedDocument, { applicationId: id }, ApiHeader3())
            .then((res) => {

                console.log('fine & penalties doc list response => ', res)
                if (res?.data?.status) {
                    setDocList(res?.data?.data)
                } else {
                    // activateBottomErrorCard(true, res?.data?.message)
                }
            })
            .catch((err) => {
                console.log("fine & penalties details error  => ", err)
                // activateBottomErrorCard(true, "Some error occured! Please try again later")
            })
            .finally(() => {
                setLoader(false)
            })
    }

    // 👉 Function 4 👈
    const openModal = () => setIsOpen(true)

    // 👉 Function 5 👈
    const closeModal = () => setIsOpen(false)

    // 👉 Function 6 👈
    const modalAction = (incomingDocUrl, type, isErr) => {
        console.log('incoming doc url modal => ', incomingDocUrl, type, isErr)
        setDocUrl(incomingDocUrl)
        setdocType(type)
        seterrorImage(isErr)
        openModal()
    }

    // 👉 To call Function 2 & Function 3 👈
    useEffect(() => {

        setLoader(true)

        getDetails()
        getDocListFun()

    }, [id])

    // 👉 Loader 👈
    if (loader) {
        return (<BarLoader />)
    }

    return (
        <>
            {/* 👉 Error card 👈 */}
            {errorState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={errorMessage} />}

            {/* 👉 Main Section 👈 */}
            <div class=" py-4 w-full bg-white rounded-md shadow-md" >

                <div className=''>

                    {/* 👉 Fine & Penalty Details 👈 */}
                    <div className="w-full " >
                        <div className="container mx-auto mb-0 mt-1 p-2 md:p-5 py-1 ">
                            <div className="md:flex no-wrap md:-mx-2 ">
                                <div className="w-full md:mx-2 ">
                                    <div className="md:p-3  rounded-sm">
                                        <div className="flex items-center pl-0 space-x-2 font-semibold text-gray-900 leading-8 mb-2">
                                            <div className="tracking-wide flex-1 text-xl font-semibold uppercase text-center text-gray-700 border-b border-gray-400 mb-4 pb-1">Fine & Penalty Details </div>
                                        </div>
                                        <div className=' rounded-lg  py-6 bg-white shadow-xl' >
                                            <div className="grid grid-cols-10 space-y-2  pl-4 ">
                                                <div className='col-span-5 md:col-span-3 text-xs'>
                                                    <div className='font-bold text-sm'>{nullToNA(marriageData?.application_no)}</div>
                                                    <div className='text-gray-500 flex'>Application No.
                                                    </div>
                                                </div>
                                                <div className='col-span-5 md:col-span-3 text-xs'>
                                                    <div className='font-bold text-sm'>{nullToNA(marriageData?.apply_date)}</div>
                                                    <div className='text-gray-500 flex'>Apply Date
                                                    </div>
                                                </div>


                                            </div>

                                        </div>

                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 👉 Address Details 👈 */}
                    {marriageData?.fullDetailsData?.dataArray?.map((data) => (
                        <div className="w-full " >
                            <div className="container mx-auto mb-0 mt-1 p-2 md:p-5 py-1 ">
                                <div className="md:flex no-wrap md:-mx-2 ">
                                    <div className="w-full md:mx-2 ">
                                        <div className="md:p-3  rounded-sm">
                                            <div className="flex items-center pl-0 space-x-2 font-semibold text-gray-900 leading-8 mb-2">
                                                <div className="tracking-wide flex-1"><MdTag className="inline font-semibold" /> {nullToNA(data?.headerTitle)}</div>
                                            </div>
                                            <div className=' rounded-lg  py-6 bg-white shadow-xl'>
                                                <div className="grid grid-cols-10 space-y-2  pl-4 ">
                                                    {data?.data?.map((data) => (
                                                        <div className='col-span-5 md:col-span-2 text-xs'>
                                                            <div className='font-bold text-sm'>{nullToNA(data?.value)}</div>
                                                            <div className='text-gray-500 flex'>{nullToNA(data?.displayString)}
                                                            </div>
                                                        </div>
                                                    ))}

                                                </div>

                                            </div>

                                        </div>



                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* 👉 Violation Details 👈 */}
                    {
                        marriageData?.fullDetailsData?.tableArray?.map((data) => (
                            <div className="w-full overflow-x-auto" >
                                <div className="container mx-auto mb-0 mt-1 md:p-5 py-1 ">
                                    <div className="md:flex no-wrap md:-mx-2 ">
                                        <div className="w-full md:mx-2 ">
                                            <div className="px-1 md:p-3 rounded-sm">
                                                <div className="flex items-center pl-0 space-x-2 font-semibold text-gray-900 leading-8 mb-2">
                                                    <span className="tracking-wide"><MdTag className="inline font-semibold" /> {nullToNA(data?.headerTitle)}</span>
                                                </div>

                                                <>
                                                    <table className='min-w-full leading-normal mt-2 bg-white shadow-xl'>
                                                        <thead className='font-bold text-left text-sm bg-white text-gray-600'>
                                                            <tr>
                                                                {data?.tableHead?.map((head) => (
                                                                    <th className="px-2 py-3 border-b border-gray-200  text-xs capitalize text-left">{nullToNA(head)}</th>
                                                                ))}



                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-sm">

                                                            <>
                                                                {data?.tableData?.map((dataIn, index) => (
                                                                    <tr className="bg-white  border-b border-gray-200">
                                                                        {dataIn?.map((dataIn2) => (
                                                                            <td className="px-2 py-2 text-sm text-left">{nullToNA(dataIn2)}</td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </>


                                                        </tbody>
                                                    </table>
                                                </>


                                            </div>



                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                    {/* 👉 Document List 👈 */}
                    <div className="container mx-auto mt-10  px-4  rounded-lg">
                        <h1 className='px-1 font-semibold font-serif text-gray-500 mt-10'><MdTag className="inline" /> Document List</h1>
                        <div className="py-0 shadow-xl mt-3">
                            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-0 overflow-x-auto">
                                <div className="inline-block min-w-full rounded-lg overflow-hidden">
                                    <table className="min-w-full leading-normal">
                                        <thead className='bg-white'>
                                            <tr className='font-semibold'>
                                                <th scope="col" className="px-5 py-2 border-b border-gray-200 text-gray-800  text-left text-sm capitalize">
                                                    #
                                                </th>
                                                <th scope="col" className="px-5 py-2 border-b border-gray-200 text-gray-800  text-left text-sm capitalize">
                                                    Document Name
                                                </th>
                                                <th scope="col" className="px-5 py-2 border-b border-gray-200 text-gray-800  text-left text-sm capitalize">
                                                    View
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {/* 👉 Document Row 👈 */}
                                            {
                                                docList && <>
                                                    {(docList?.length == 0 && !loader) && <tr className='mt-10 py-20'><td colSpan={5} className="text-center"><span className='bg-red-200 text-sm text-red-400 italic my-4 px-4 py-2 rounded-md shadow-lg '>No Document Found !!</span></td></tr>}
                                                    {
                                                        docList?.map((data, index) => (
                                                            <PilotWorkflowDocumentRow openModal={modalAction} docList={data} index={index} />
                                                        ))
                                                    }
                                                </>
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* 👉 Modal to show document 👈 */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className='w-screen h-screen flex justify-center items-center'
                contentLabel="Example Modal"
            >

                <div class=" rounded-lg shadow-xl border-2 border-gray-200 bg-white md:ml-32 p-4 animate__animated animate__zoomIn animate__faster w-full md:w-[60vw] h-[80vh]" >
                    <div className="absolute top-2 font-normal bg-red-200 hover:bg-red-300 right-2 rounded-full p-2 cursor-pointer" onClick={closeModal}>
                        <RxCross2 />
                    </div>

                    {
                        (errorImage == true || errorImage == 'true') ? <>
                            <div className='w-full h-full bg-gray-700 flex items-center justify-center text-gray-200'>
                                <div className='border-r-2 border-gray-200 pr-4'>Error</div>
                                <div className='pl-4'>Document not visible</div>
                            </div>
                        </>
                            :
                            <>
                                {
                                    docType == 'pdf' && <>
                                        <iframe className='w-full h-full' src={docUrl} frameborder="0"></iframe>
                                    </>
                                }
                                {
                                    docType != 'pdf' && <>
                                        <div className='w-full h-[77vh] overflow-auto flex flex-wrap items-center justify-center'>
                                            <img src={docUrl} alt="" srcset="" className=' ' />
                                        </div>
                                    </>
                                }
                            </>
                    }

                </div>

            </Modal>

        </>
    )
}

export default FpDetails