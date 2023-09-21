//////////////////////////////////////////////////////////////////////////////////////
//    Author - Talib Hussain
//    Version - 1.0
//    Date - 24 june 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - TextArea
//    DESCRIPTION - TextArea Component
//////////////////////////////////////////////////////////////////////////////////////
import React from 'react'

function TextArea(props) {
    return (
        <>
            <div className="relative mb-4 h-full">
                <textarea onChange={(event) => props.commentFun(event.target.value)} className={"shadow-lg w-full rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-full text-sm outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out " + props.bgColor + " focus:bg-white"}>{props.value}</textarea>
            </div>
        </>
    )
}

export default TextArea
/**
 * Exported to :
 * 1. App.js
 * 
 */