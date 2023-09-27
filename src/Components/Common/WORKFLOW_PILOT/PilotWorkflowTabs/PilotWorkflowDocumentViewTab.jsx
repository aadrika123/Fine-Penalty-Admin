//////////////////////////////////////////////////////////////////////////////////////
//    Author - R U Bharti
//    Version - 1.0
//    Date - 26th Nov, 2022
//    Revision - 1
//    Project - JUIDCO
/////////////////////////////////////////////////////////////////////////////////////////////

import { useState, useEffect } from 'react'
import PilotWorkflowDocumentRow from "./PilotWorkflowDocumentRow"
import Modal from 'react-modal';
import ApiHeader from '@/Components/api/ApiHeader'
import axios from 'axios';
import BarLoader from '@/Components/Common/Loaders/BarLoader';
import { RxCross2 } from 'react-icons/rx'

function PropertySafDocumentView(props) {

    const [docList, setDocList] = useState()
    const [loader, setloader] = useState(false);
    const [docType, setdocType] = useState('')

    useEffect(() => {
        setloader(true)
        console.log("before document fetch ", props?.id)
        let requestBody = {
            applicationId: props?.id
        }
        axios[props?.api?.api_documentList?.method](props?.api?.api_documentList?.url, requestBody, ApiHeader())
            .then((res) => {
                console.log("document list at pilotworkflowdocumentview ", res)
                if (res?.data?.status) {
                    setDocList(res?.data?.data)
                } else {
                    props?.activateBottomErrorCard(true, res?.data?.message)
                }
                setloader(false)
            })
            .catch((err) => {
                console.log("error at pilotworkflowdocumentview ", err)
                props?.activateBottomErrorCard(true, 'Some error occured while fetching document list. Please try again later')
                setloader(false)
            })

    }, [])


    const [modalIsOpen, setIsOpen] = useState(false);
    const [docUrl, setDocUrl] = useState('')
    const [errorImage, seterrorImage] = useState(false)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)
    const afterOpenModal = () => { }

    const modalAction = (incomingDocUrl, type, isErr) => {
        console.log('incoming doc url modal => ', incomingDocUrl, type, isErr)
        setDocUrl(incomingDocUrl)
        setdocType(type)
        seterrorImage(isErr)
        openModal()
    }

    console.log('doucment api at document view mr', props?.api)

    return (
        <>
            {loader && <BarLoader />}

            <div className="container mx-auto  max-w-3xl ml-0  px-1 py-1 shadow-lg rounded-lg">
                <div className="py-0">
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-0 overflow-x-auto">
                        <div className="inline-block min-w-full rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead className='bg-sky-100'>
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
                                    {(docList?.length == 0 && !loader) && <tr className='mt-5'><td colSpan={5} className="text-center"><span className='bg-red-200 text-sm text-red-400 italic my-4 px-4 py-2 rounded-md shadow-lg'>No Document Found !!</span></td></tr>}
                                    {
                                        docList?.map((data, index) => (
                                            <PilotWorkflowDocumentRow api={props?.api} openModal={modalAction} docList={data} index={index} />
                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
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

            <div className='w-full mt-20'></div>
        </>
    )
}

export default PropertySafDocumentView
