import React from 'react'
import cm from '../assets/cm.png'

const Branding = () => {
    return (
        <>
            <div className='relative w-full h-full bg-[#99B37C]'>
                <div className='absolute h-full w-full top-0 opacity-20'> </div>
                <div className='flex justify-between px-2 sm:px-20 py-1.5 items-center'>
                    <img src={cm} alt="" className='w-16 sm:w-20 h-16 sm:h-20 block border-2 shadow-md rounded-full transform -scale-x-100' />
                    <div className='flex flex-col items-center justify-center'>
                        <span className='text-sm sm:text-4xl font-bold text-center uppercase'>Urban Development &amp; Housing Department</span>
                        <span className='text-xs sm:text-base'>Government of Jharkhand</span>
                    </div>
                    <img src={"http://203.129.217.246:8000/Uploads/Icon/jharkhand.png"} alt="" className='w-16 sm:w-20 h-16 sm:h-20 block border-2 shadow-md rounded-full' />
                </div>
            </div>
        </>
    )
}

export default Branding