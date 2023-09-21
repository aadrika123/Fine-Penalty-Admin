//////////////////////////////////////////////////////////////////////////////////////
//    Author - Talib Hussain
//    Version - 1.0
//    Date - 14 july 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - WorkflowTimelineCard (closed)
//    DESCRIPTION - WorkflowTimelineCard Component
//////////////////////////////////////////////////////////////////////////////////////
import React from 'react'

function WorkflowTimelineCard(props) {
   
    return (
        <>
            <div className="container bg-white mx-auto w-full">
                <div className="relative wrap overflow-hidden md:p-10 h-full">
                    <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border" style={{ "left": "50%" }}></div>
                    <div className="mb-0 flex justify-between items-center w-full right-timeline">
                        <div className="order-1 w-5/12"></div>
                        <div className="z-10 flex items-center order-1 bg-indigo-300 shadow-xl w-6 h-6 rounded-full">
                            <h1 className="mx-auto font-semibold text-sm text-white">{props?.index+1}</h1>
                        </div>
                        <div className="order-1 bg-sky-200 rounded-lg shadow-xl w-5/12 px-6 py-4">
                            <h3 className="mb-1 font-bold text-gray-700 text-xs">{props?.data?.commentedByRoleName}</h3>
                            {/* <p className="leading-snug tracking-wide text-gray-600 text-opacity-60 text-xs">{props?.data?.remarks != '' ? props?.data?.remarks : <span className='text-red-500 font-bold'>Application is pending here </span>}</p> */}
                            <p className="leading-snug tracking-wide text-gray-600 text-opacity-60 text-xs">{props?.data?.message}</p>
                            <div><p className="leading-snug tracking-wide text-gray-600 text-opacity-60 text-xs">forward date - {props?.data?.forward_date}</p></div>
                            <div><p className="leading-snug tracking-wide text-gray-600 text-opacity-60 text-xs">Received date - {props?.data?.forward_date}</p></div>
                            {/* <p className="mt-2 leading-snug tracking-wide text-gray-600 text-opacity-100 text-xs">{JSON.stringify(props?.data?.receiving_date).slice(1,17)} </p> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WorkflowTimelineCard
/**
 * Exported to :
 * 1 PropertySafWorkflowTimeline Component
 * 
 */