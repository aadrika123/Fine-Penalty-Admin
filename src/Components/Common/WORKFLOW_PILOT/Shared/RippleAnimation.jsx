//////////////////////////////////////////////////////////////////////////////////////
//    Author - Talib Hussain
//    Version - 1.0
//    Date - 24 june 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - RippleAnimation
//    DESCRIPTION - RippleAnimation Component
//////////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import { AiFillBell } from 'react-icons/ai'

function RippleAnimation() {
    return (
        <>
            <div className="absolute -top-6 -left-2">
                <div className="bg-orange-600 w-5 h-5 rounded-full  animate-ping">
                </div>
                <div className=' w-3 h-3 rounded-full absolute top-1 left-1'> <AiFillBell color='red' /></div>
                <div className='relative -top-4 left-6 text-black font-semibold text-xs'>This Application has been escalated</div>

            </div>

        </>
    )
}

export default RippleAnimation
/**
 * Exported to :
 * 1. WorkFlow Component
 * 
 */