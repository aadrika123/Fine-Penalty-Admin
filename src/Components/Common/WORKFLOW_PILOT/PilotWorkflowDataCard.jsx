//////////////////////////////////////////////////////////////////////////////////////
//    Author - R U Bharti
//    Version - 1.0
//    Date - 14 july 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - PropertySafWorkflowTimeline (closed)
//    DESCRIPTION - PropertySafWorkflowTimeline Component
/////////////////////////////////////////////////////////////////////////////////////////////

import { indianDate, nullToNA } from '@/Components/Common/PowerupFunctions'
import React from 'react'
import { GrHomeRounded } from 'react-icons/gr'


function PilotWorkflowDataCard(props) {

    console.log('form url at ...', props?.workflow)
    console.log('tab index in data card for ...', props?.tabIndex, props?.applicationData)
    return (
        <>
            <div className="bg-white">
                <div className="mx-auto my-5 md:p-5 ">
                    <div className="md:flex no-wrap md:-mx-2 ">

                        <div className="border border-zinc-50 w-full md:w-3/12 mx-2 md:shadow-xl flex md:justify-center items-center py-4">
                            
                            <div className="bg-white md:items-center my-auto">
                                <div className="image overflow-hidden md:text-center">
                                    <div className='text-indigo-600 font-bold text-2xl leading-8'>{nullToNA(props?.applicationData?.data?.application_no)}</div>
                                    <div className='text-sm text-gray-600'>Application No.</div>
                                </div>
                                <div className="image overflow-hidden md:text-center mt-3 md:mt-10">
                                    <div className='text-gray-900 font-bold text-lg leading-8'>{indianDate(props?.applicationData?.data?.apply_date)}</div>
                                    <div className='text-sm text-gray-600'>Apply Date</div>
                                </div>
                            </div>

                        </div>
                        
                        <div className="w-full md:w-9/12 mx-2 border border-zinc-50 py-4 h-full bg-white md:shadow-xl">
                            <div className=" mt-6 md:p-3  rounded-sm">
                                <div className="flex items-center md:pl-4 space-x-2 font-semibold text-gray-900 leading-8">
                                    <span clas="text-green-500">
                                        <GrHomeRounded />
                                    </span>
                                    <span className="tracking-wide">{nullToNA(props?.applicationData?.data?.fullDetailsData?.cardArray?.headerTitle)}</span>
                                    {props?.applicationData?.data?.parked == true && <span className='float-right text-right text-red-600 px-4  border border-red-500 rounded-lg'>Back to Citizen Case</span>}
                                </div>


                                {/* DETAILS DATA */}
                                <div className="text-gray-700 py-2 md:py-6">
                                    <div className="grid md:grid-cols-2 text-sm">
                                        {
                                            props?.applicationData?.data?.fullDetailsData?.cardArray?.data?.map((data) => (
                                                <div className="grid grid-cols-2">
                                                    <div className="md:px-4 py-2 font-semibold">{nullToNA(data?.displayString)} : </div>
                                                    <div className="md:px-4 py-2">{nullToNA(data?.value)}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className=' mt-6 -mb-6 pl-4 flex'>
                                        {/* {props?.boxType=='inbox' && <button className={`float-right mr-4 bg-white border border-indigo-500 text-indigo-500 px-4 py-1 shadow-lg hover:scale-105 rounded-sm hover:bg-indigo-500 hover:text-white whitespace-nowrap`} onClick={() => window.open(`fp-form/${props?.id}`, '_blank')}>Edit Form</button>} */}
                                    </div>
                                </div>
                            </div>

                            <div className="md:my-4">

                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default PilotWorkflowDataCard
/**
 * Exported to :
 * 1. PropertySafDetailsTabs Component
 * 
 */