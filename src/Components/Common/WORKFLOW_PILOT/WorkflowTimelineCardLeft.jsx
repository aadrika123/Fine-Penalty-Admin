import { indianDate, nullToNA } from '@/Components/Common/PowerupFunctions'
import React from 'react'

function WorkflowTimelineCardLeft(props) {
    return (
        <div>
            <div className="container bg-white mx-auto w-full">
                <div className="relative wrap overflow-hidden md:p-10 md:py-4 h-full">
                    {/* <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border" style={{ "left": "50%" }}></div> */}
                    <div className="mb-0 flex justify-between items-center w-full right-timeline">

                        <div className="relative order-1 bg-sky-100 rounded-lg shadow-xl w-9/12 px-6 py-4">

                            <div className="z-1 flex items-center bg-sky-400 shadow-xl w-6 h-6 rounded-full absolute top-0 left-0">
                                <h1 className="mx-auto font-semibold text-sm text-white">{props?.index + 1}</h1>
                            </div>
                            <div className="flex items-center space-x-2">
                                <img
                                    className="inline-block h-12 w-12 rounded-full"
                                    src="https://overreacted.io/static/profile-pic-c715447ce38098828758e525a1128b87.jpg"
                                    alt="Dan_Abromov"
                                />
                                <span className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">{nullToNA(props?.data?.name)}</span>
                                    {props?.agency && <span className="text-sm font-medium text-gray-500">{nullToNA(props?.data?.commentedBy)}</span>}
                                </span>
                            </div>
                            {props?.agency && <div className="mb-1  ">

                                {/* <span className='bg-gray-500 text-white px-2 rounded-sm font-normal py-1 text-xs'>{nullToNA(props?.data?.commentedBy)}</span> */}
                                <span className='text-xs'>forwarded to</span> <span className='bg-gray-500 text-white px-2 rounded-sm font-normal py-1 text-xs'>{nullToNA(props?.data?.forwarded_to)}</span></div>}
                            <p className=" leading-snug tracking-wide text-gray-800 text-xs"><span className='text-gray-600'>Comment</span> : {nullToNA(props?.data?.message)} </p>
                            <div><p className="leading-snug tracking-wide text-gray-800 text-xs">
                                <span className='text-gray-600'>{props?.agency?'Received Date':'Date'}</span> : <span className='font-semibold'>{indianDate(props?.data?.track_date)}</span></p></div>
                            {props?.agency && <div><p className="leading-snug tracking-wide text-gray-800 text-xs"><span className='text-gray-600'>Forward Date</span> : <span className='font-semibold'>{indianDate(props?.data?.forward_date)} {nullToNA(props?.data?.forward_time)}</span></p></div>}

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkflowTimelineCardLeft