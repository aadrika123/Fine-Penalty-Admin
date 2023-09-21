//////////////////////////////////////////////////////////////////////////////////////
//    Author - Talib Hussain
//    Version - 1.0
//    Date - 14 july 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - PropertySafTimeline (closed)
//    DESCRIPTION - PropertySafTimeline Component
//////////////////////////////////////////////////////////////////////////////////////
import React from 'react'

function PilotWorkflowCommentTimeline(props) {

   
    return (
        <>
            <div className="container bg-white mx-auto w-full">
                <div className="relative wrap overflow-hidden md:p-10 h-full">
                    <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border" style={{ "left": "50%" }}></div>
                    <div className="mb-8 flex justify-between items-center w-full right-timeline">
                        <div className="order-1 w-5/12"></div>
                        <div className="z-10 flex items-center order-1 bg-orange-300 shadow-xl w-6 h-6 rounded-full">
                            <h1 className="mx-auto font-semibold text-sm text-white">{props.index}</h1>
                        </div>
                        <div className="order-1 bg-orange-200 rounded-lg shadow-xl w-5/12 px-6 py-4">
                            <h3 className="mb-1 font-bold text-gray-800 text-xs">{props?.comment}</h3>
                            <p className="text-sm leading-snug tracking-wide text-gray-600 text-opacity-60 text-xs">{props?.track_date} </p>
                            <p className="text-sm mt-2 leading-snug tracking-wide text-gray-600 text-opacity-100 text-xs">{props?.role} </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PilotWorkflowCommentTimeline
/**
 * Exported to :
 * 1 PropertySafWorkflowTimeline Component
 * 
 */