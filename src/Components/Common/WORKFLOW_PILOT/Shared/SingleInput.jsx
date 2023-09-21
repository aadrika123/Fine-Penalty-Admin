//////////////////////////////////////////////////////////////////////////////////////
//    Author - Talib Hussain
//    Version - 1.0
//    Date - 24 june 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - SingleInput
//    DESCRIPTION - SingleInput Component
//////////////////////////////////////////////////////////////////////////////////////
import React from 'react'

function SingleInput(props) {
    return (
        <>
            <div class="mb-6">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">{props.label}</label>
                <input onChange={(e) => props.fun(e.target.value, props.id)} type={props.inputType} id={props.id} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="" required />
            </div>
        </>
    )
}

export default SingleInput
/**
 * Exported to :
 * 1. App.js
 */