//////////////////////////////////////////////////////////////////////////////////////
//    Author - Talib Hussain
//    Version - 1.0
//    Date - 6 august 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - PropertySafDocumentRow (closed)
//    DESCRIPTION - PropertySafDocumentRow Component
//////////////////////////////////////////////////////////////////////////////////////
import React,{useContext} from 'react'
import axios from 'axios';
import { contextVar } from '@/Components/Context/Context'


function PropertySafCustomTabRow(props) {
    //destructuring notify function to activate toast
    const { notify } = useContext(contextVar);

    const verifyDocument = (type, docId) => {
        let url;
        { type == 'verify' && (url = 'https://') }
        { type == 'reject' && (url = 'https://') }
        //api call to accept or reject document
        // axios.delete(`${url}/${docId}`)
        //     .then(function (response) {
        //         { type == 'verify' && (console.log('verified')) }
        //         { type == 'reject' && (console.log('rejected')) }

        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     })
        //     .then(function () {
        //     });
        { (type=='verify') && notify('Document Verfied Successfully!','success') }
        { (type=='reject') && notify('Document Rejected Successfully!','error') }
    }
    return (
        <>
            <tr>

                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {props.index + 1}
                    </p>
                </td>
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        Aadhar Card
                    </p>
                </td>
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm" onClick={() => props.openModal('http://192.168.0.16:822/RMCDMC/public/assets/img/pdf_logo.png')}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <a href="#" className="block relative">
                                <img alt="profil" src="http://192.168.0.16:822/RMCDMC/public/assets/img/pdf_logo.png" className="mx-auto object-cover rounded-full h-10 w-10 " />
                            </a>
                        </div>
                    </div>
                </td>
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    <p className="text-red-900 whitespace-no-wrap">
                        Rejected.
                    </p>
                </td>
                <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                    <div className="flex gap-4">
                        <button onClick={() => verifyDocument('verify', props.id)} className='flex-initial bg-green-200 px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:bg-green-800 hover:text-white text-black flex items-center'>
                            Verify
                        </button>
                        <button onClick={() => verifyDocument('reject', props.id)} className='flex-initial bg-red-200 px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:bg-red-800 hover:text-white text-black items-center flex'>
                            Reject
                        </button>

                    </div>
                </td>
            </tr>
        </>
    )
}

export default PropertySafCustomTabRow
/**
 * Exported to :
 * 1. PropertySafDocumentView Component
 * 
 */