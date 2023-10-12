///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : PilotWorkflowDocumentRow
// 👉 Status      : Close
// 👉 Description : This component is for rendering document list.
// 👉 Functions   :  
//                  1. checkImage -> To check image is available in error list or not
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import { nullToNA } from '@/Components/Common/PowerupFunctions'
import React, { useState } from 'react'
import { FcDocument } from 'react-icons/fc'
import photo from '@/Components/assets/photo.png'

function PilotWorkflowDocumentRow(props) {

    // 👉 State constant to store error image list 👈
    const [errorImage, seterrorImage] = useState([])

    // 👉 Function 1 👈
    const checkImage = (id) => {
        return errorImage?.some(docId => docId == id)
    }

    return (
        <>
            {/* 👉 Document Row 👈 */}
            <tr>

                {/* 👉 Serial No. 👈 */}
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {props?.index + 1}
                    </p>
                </td>

                {/* 👉 Document Name 👈 */}
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {nullToNA(props?.docList?.document_name)}
                    </p>
                </td>

                {/* 👉 Document thumbnail 👈 */}
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm cursor-pointer" onClick={() => props.openModal(props?.docList?.doc_path, props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1], checkImage(props?.docList?.id))}>
                    <div className="flex items-center">
                        {(props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'pdf' || props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'pdf/') &&
                            <div className="flex-shrink-0 text-[28px]">
                                <FcDocument />
                            </div>
                        }
                        {(props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] != 'pdf' && props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] != 'pdf/') &&
                            <div className="flex-shrink-0 px-1 py-2">
                                <img src={checkImage(props?.docList?.id) ? photo : props?.docList?.doc_path} onError={() => seterrorImage(prev => [...prev, props?.docList?.id])} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                            </div>
                        }
                        {/* {(props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'jpeg' || props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'jpeg/') &&
                            <div className="flex-shrink-0 px-1 py-2">
                                <img src={checkImage(props?.docList?.id) ? photo : props?.docList?.doc_path} onError={() => seterrorImage(prev => [...prev, props?.docList?.id])} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                            </div>
                        }
                        {(props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'png' || props?.docList?.doc_path?.split('.')[props?.docList?.doc_path?.split('.')?.length - 1] == 'png/') &&
                            <div className="flex-shrink-0 px-1 py-2">
                                <img src={checkImage(props?.docList?.id) ? photo : props?.docList?.doc_path} onError={() => seterrorImage(prev => [...prev, props?.docList?.id])} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                            </div>
                        } */}

                    </div>
                </td>

                {/* 👉 Document verification status 👈 */}
                {/* <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    {
                        props?.docList?.doc_code == 'PHOTOGRAPH' &&
                        <p className="whitespace-no-wrap">

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
                </td> */}

                {/* 👉 Document Remarks 👈 */}
                {/* <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    {nullToNA(props?.docList?.remarks)}
                </td> */}

            </tr>
        </>
    )
}

export default PilotWorkflowDocumentRow
