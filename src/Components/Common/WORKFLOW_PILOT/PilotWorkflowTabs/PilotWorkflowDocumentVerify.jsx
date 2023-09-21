//////////////////////////////////////////////////////////////////////////////////////
//    Author - R U Bharti
//    Version - 1.0
//    Date - 14 july 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - PropertySafWorkflowTimeline (closed)
//    DESCRIPTION - PropertySafWorkflowTimeline Component
//      
//////////////////////////////////////////////////////////////////////////////////////


import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import PropertySafDocumentVerifyRow from './PilotWorkflowDocumentVerifyRow';
import axios from 'axios';
import ApiHeader from '@/Components/api/ApiHeader'
import BarLoader from '@/Components/Common/Loaders/BarLoader';
import { RxCross2 } from 'react-icons/rx';


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
Modal.setAppElement('#root');
function PilotWorkflowDocumentVerify(props) {

    const [docList, setDocList] = useState()
    const [modalIsOpen, setIsOpen] = useState(false);
    const [docUrl, setDocUrl] = useState('')
    const [docType, setdocType] = useState('')
    const [loader, setloader] = useState(false);
    const [refresh, setrefresh] = useState(0)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)
    const afterOpenModal = () => { }


    useEffect(() => {
        setloader(true)

        let requestBody = {
            applicationId: props?.id
        }
        axios[props?.api?.api_documentList?.method](props?.api?.api_documentList?.url, requestBody, ApiHeader())
            .then((res) => {
                console.log("getting doc status and verify in doc verify===========> ", res)
                setDocList(res?.data?.data)
                // SETTING ALL DOC VERIFY STATUS TO RESTRICT SEND LEVEL
                props?.setallDocumentVerifyStatus(res?.data?.message?.docVerifyStatus)
                setloader(false)
            })
            .catch((err) => {
                console.log("getting doc status and verify in doc verify error  ===========> ", err)
                setloader(false)
            })
    }, [refresh])

    const modalAction = (incomingDocUrl, type) => {
        setDocUrl(incomingDocUrl)
        setdocType(type)
        openModal()
    }

    return (
        <>
            {loader && <BarLoader />}
            <div className="px-4 font-semibold font-serif w-full">
                <span></span>
            </div>

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
                                            View/Verify
                                            <div className='font-normal text-xs'>(Click on document to verify)</div>
                                        </th>
                                        <th scope="col" className="px-5 py-2 border-b border-gray-200 text-gray-800  text-left text-sm capitalize">
                                            Status
                                        </th>
                                        <th scope="col" className="px-5 py-2 border-b border-gray-200 text-gray-800  text-left text-sm capitalize">
                                            Remarks
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {docList?.length == 0 && <tr><td colSpan={5} className="text-center"><span className='bg-red-200 text-sm text-red-400 italic my-4 px-4 py-2 rounded-md shadow-lg'>No Document Found !!</span></td></tr>}

                                    {
                                        docList?.map((data, index) => (
                                            <PropertySafDocumentVerifyRow activateBottomErrorCard={props?.activateBottomErrorCard} api={props?.api} openModal={modalAction} id={props?.id} docList={data} index={index} refresh={() => setrefresh(refresh + 1)} />
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
                style={customStyles}
                contentLabel="Example Modal"
            >

                <div class=" rounded-lg shadow-xl border-2 border-gray-100 ml-32 p-4 animate__animated animate__zoomIn animate__faster" style={{ 'width': '60vw', 'height': '80vh' }}>
                    <div className="absolute top-2 font-normal bg-red-200 hover:bg-red-300 right-2 rounded-full p-2 cursor-pointer" onClick={closeModal}>
                        <RxCross2 />
                    </div>
                    {
                        docType == 'pdf' && <>
                            <iframe className='w-full h-full' src={docUrl} frameborder="0"></iframe>
                        </>
                    }
                    {
                        docType != 'pdf' && <>
                            <div className='w-full h-full flex items-center justify-center'>
                                <img src={docUrl} alt="" srcset="" />
                            </div>
                        </>
                    }
                </div>

            </Modal>

            <div className='w-full mt-20'></div>
        </>
    )
}

export default PilotWorkflowDocumentVerify
