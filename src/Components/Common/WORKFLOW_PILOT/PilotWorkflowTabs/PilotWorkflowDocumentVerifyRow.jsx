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

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { contextVar } from '@/Components/context/contextVar'
import ApiHeader from '@/Components/api/ApiHeader'
import { FcDocument } from 'react-icons/fc'
import Modal from 'react-modal'
import { FiInfo } from 'react-icons/fi'
import BarLoader from '@/Components/Common/Loaders/BarLoader';
import { nullToNA } from '@/Components/Common/PowerupFunctions';
import { RxCross2 } from 'react-icons/rx';
import photo from '@/Components/assets/photo.png'

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

function PilotWorkflowDocumentVerifyRow(props) {

    const [errorImage, seterrorImage] = useState([])

    const { notify } = useContext(contextVar);

    const [modalIsOpen, setIsOpen] = useState(false);
    const [docStatus, setdocStatus] = useState(0)
    const [docRemarks, setdocRemarks] = useState('')
    const [index, setindex] = useState()
    const [docId, setdocId] = useState(null)
    const [docUrl, setdocUrl] = useState()
    const [isloading, setisloading] = useState(false)
    const [docType, setdocType] = useState('')

    // notify function
    const verifyDocumentNotification = (type) => {
        { (type == 'Verified') && notify('Document Verified Successfully!', 'success') }
        { (type == 'Rejected') && notify('Document Rejected Successfully!', 'error') }
    }

    const openModal = () => setIsOpen(true)
    const closeModal = () => {
        setIsOpen(false)
        setIsOpen2(false)
    }
    const afterOpenModal = () => { }

    // taking action functin for verify
    const verifyAction = (actionType, id) => {
        setdocStatus(actionType)
        setindex(id)
        closeModal()
        verifyModal()
    }

    const verifyModal = () => {
        openModal()
    }

    const openModal2 = () => setIsOpen2(true)
    const [modalIsOpen2, setIsOpen2] = useState(false);

    const modalFun = (doc, type, id) => {
        openModal2()
        setdocUrl(doc)
        setdocType(type)
        setdocId(id)
    }

    // Verification documents function
    const submitData = () => {
        if (docStatus != "Verified" && docRemarks == '') {
            notify('Please enter comment.', 'error')
            return
        }
        setisloading(true)
        console.log("submitting verification with values => ", docStatus, "and", docRemarks, "and", index)
        // return
        let requestBody = {
            applicationId: props?.id,
            id: index,
            docStatus: docStatus,
            docRemarks: docRemarks
        }
        closeModal()

        console.log('before verify document...', requestBody)
        axios[props?.api?.api_verifyDocuments?.method](props?.api?.api_verifyDocuments?.url, requestBody, ApiHeader())
            .then((res) => {
                console.log("submitting doc status data => ")
                if (res?.data?.status) {
                    verifyDocumentNotification(docStatus)
                    props.refresh()
                } else {
                    props?.activateBottomErrorCard(true, res?.data?.message)
                }
                setdocRemarks('')
                setisloading(false)

            })
            .catch((err) => {
                console.log("error submitting status => ", err)
                setdocRemarks('')
                setisloading(false)
                props?.activateBottomErrorCard(true, 'Some error occured while verifying document. Please try again later')
            })
    }

    // Check error image
    const checkImage = (id) => {
        return errorImage?.some(docId => docId == id)
    }

    return (
        <>
            {
                isloading && <BarLoader />
            }
            <tr>

                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {props.index + 1}
                    </p>
                </td>
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                    {nullToNA(props?.docList?.doc_code)} {props?.docList?.owner_name != "" && <span className='font-semibold italic text-gray-700'>({props?.docList?.owner_name})</span>}
                    </p>
                </td>
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm cursor-pointer" onClick={() => modalFun(`${props?.docList?.doc_path}`, props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1], props?.docList?.id)}>

                    <div className="flex items-center">
                        {(props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'pdf' || props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'pdf/') &&
                            <div className="flex-shrink-0 text-[28px] shadow-xl">
                                <FcDocument />
                            </div>
                        }
                        {(props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'jpg' || props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'jpg/') &&
                            <div className="flex-shrink-0 shadow-xl p-1">
                                <img onError={() => seterrorImage(prev => [...prev, props?.docList?.id])} src={checkImage(props?.docList?.id) ? photo : `${props?.docList?.doc_path}`} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                            </div>
                        }
                        {(props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'jpeg' || props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'jpeg/') &&
                            <div className="flex-shrink-0 shadow-xl p-1">
                                <img onError={() => seterrorImage(prev => [...prev, props?.docList?.id])} src={checkImage(props?.docList?.id) ? photo : `${props?.docList?.doc_path}`} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                            </div>
                        }
                        {(props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'png' || props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'png/') &&
                            <div className="flex-shrink-0 shadow-xl p-1">
                                <img onError={() => seterrorImage(prev => [...prev, props?.docList?.id])} src={checkImage(props?.docList?.id) ? photo : `${props?.docList?.doc_path}`} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                            </div>
                        }

                    </div>
                </td>
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">

                    {
                        props?.docList?.doc_code == 'PHOTOGRAPH' &&
                        <p className="whitespace-no-wrap">
                            NA
                        </p>
                    }
                    {
                        props?.docList?.doc_code != 'PHOTOGRAPH' &&
                        <>
                            <p className="whitespace-no-wrap">
                                {props?.docList?.verify_status == 0 && <>Pending</>}</p>
                            <p className="text-green-500 whitespace-no-wrap">
                                {props?.docList?.verify_status == 1 && <>Verified</>}</p>
                            <p className="text-red-500 whitespace-no-wrap">
                                {props?.docList?.verify_status == 2 && <>Rejected</>}
                            </p>
                        </>
                    }




                </td>
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {nullToNA(props?.docList?.remarks)}
                    </p>
                </td>
            </tr>

            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >

                <div class=" rounded-lg shadow-xl border-2 bg-white md:ml-32 py-4 px-8 md:px-4 flex flex-col items-center justify-center gap-y-4 w-full md:w-[30vw] animate__animated animate__zoomIn animate__faster">
                    <div className="absolute top-2 font-normal bg-red-200 hover:bg-red-300 right-2 rounded-full p-2 cursor-pointer" onClick={closeModal}>
                        <RxCross2 />
                    </div>

                    <div className='flex flex-wrap font-semibold gap-4 justify-center items-center'>
                        <span><FiInfo /></span>
                        {docStatus == 'Verified' && <span>Verify Document ?</span>}
                        {docStatus == 'Rejected' && <span>Reject Document ?</span>}
                    </div>
                    <div className='flex flex-col flex-wrap gap-1 justify-center w-full px-4'>
                        <span className='text-sm font-semibold'>Comment :</span>
                        <textarea type="text" name="docRemarks" id="" className="form-control block px-3 py-1.5 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none shadow-md text-xs" placeholder='Enter your comments here...' rows={2} onChange={(e) => setdocRemarks(e.target.value)} />
                    </div>

                    <div className='flex flex-wrap justify-center items-center px-6 md:px-10'>
                        {docStatus == 'Verified' && <button type="submit" className="px-4 py-2 bg-green-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out" onClick={() => submitData("Verified")}>Verify</button>}

                        {docStatus == 'Rejected' && <button type="submit" className="px-4 py-2 bg-red-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out" onClick={() => submitData("Rejected")}>Reject</button>}

                    </div>

                </div>

            </Modal>

            <Modal
                isOpen={modalIsOpen2}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                className='w-screen h-screen flex justify-center items-center'
                contentLabel="Example Modal"
            >


                <div class=" rounded-lg shadow-xl border-2 bg-white border-gray-200 md:ml-32 p-4 animate__animated animate__zoomIn animate__faster  w-full md:w-[60vw] h-[80vh]" >
                    <div className="absolute top-2 font-normal bg-red-200 hover:bg-red-300 right-2 rounded-full p-2 cursor-pointer" onClick={closeModal}>
                        <RxCross2 />
                    </div>

                    {
                        checkImage(docId) ? <>
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
                                            <img src={docUrl} alt="" srcset="" />
                                        </div>
                                    </>
                                }
                            </>
                    }
                    <div className="absolute bottom-10 text-center left-[26.5vw] text-sm">
                        {props?.docList?.verify_status == 0 && <div className="flex gap-4">
                            <button onClick={() => verifyAction("Verified", props?.docList?.id)} className='flex-initial bg-green-200 px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:bg-green-800 hover:text-white text-black flex items-center'>
                                Verify
                            </button>
                            <button onClick={() => verifyAction("Rejected", props?.docList?.id)} className='flex-initial bg-red-200 px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:bg-red-800 hover:text-white text-black items-center flex'>
                                Reject
                            </button>
                        </div>}
                    </div>
                </div>

            </Modal>

        </>
    )
}

export default PilotWorkflowDocumentVerifyRow
