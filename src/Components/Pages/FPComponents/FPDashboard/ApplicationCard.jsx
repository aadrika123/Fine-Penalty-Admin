import { getCurrentDate, indianDate, nullToZero } from '@/Components/Common/PowerupFunctions'
import forms from '@/Components/assets/forms.png'
import React from 'react'
import './home.css'

const ApplicationCard = (props) => {
    return (
        <div class="transform hover:scale-105 transition duration-300 shadow-xl">
            <div class="p-5 bg-white">
                <div class="flex justify-between border-b pb-4">
                    <span
                        className='w-10 h-10 bg-indigo-100 rounded-full flex justify-center items-center'>
                        <img className='bg-indigo-50 rounded-full p-1' src={forms} alt="" />
                    </span>
                    <div
                        class="bg-indigo-100 rounded-full h-6 px-2 flex justify-items-center text-indigo-600 font-semibold text-xs">
                        <span class="flex items-center">{indianDate(getCurrentDate())}</span>
                    </div>
                </div>
                <div class="ml-2 w-full flex-1">
                    <div>
                        <div class="flex justify-between mt-4 pr-4">
                            <div class="mt-1 text-base text-gray-600">{props?.heading}</div>
                            <div className='font-bold leading-8 text-xl'>
                                {props?.loading ? <div class="spinner2"></div> : nullToZero(props?.total)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApplicationCard