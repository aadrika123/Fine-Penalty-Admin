//////////////////////////////////////////////////////////////////////////////////////
//    Author - Talib Hussain
//    Version - 1.0
//    Date - 24 june 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - WorkFlow
//    DESCRIPTION - WorkFlow Component
//////////////////////////////////////////////////////////////////////////////////////
import CheckBoxInput from '@/Components/Shared/CheckBoxInput'
import RippleAnimation from '@/Components/Shared/RippleAnimation'
import TextArea from '@/Components/Shared/TextArea'
import { useState } from 'react'
import MemebersAction from './MemebersAction'
import TimeLine2 from './TimeLine2'

function WorkFlow() {
    const [escalateStatus, setescalateStatus] = useState(false)


    const swithEscalateStatus = (status) => {
        setescalateStatus(status)
    }


    const [user, setuser] = useState('')
    return (
        <>
            <div className="grid grid-cols-12 shadow-lg border-2 border-gray-200 relative">
                <div className={'bg-gray-200 col-span-12 md:col-span-3 h-auto'}>
                    <h1 className={(escalateStatus ? 'bg-sky-200' : 'bg-sky-200') + '  text-black font-semibold text-center py-2 mb-8'}>Members {escalateStatus ? <RippleAnimation /> : ''}</h1>
                    {/**RippleAnimation to  highlight escalated application*/}
                    <MemebersAction />
                    <div className='px-2 mt-4 h-auto'>
                        <h1 className='text-xs'>Comments</h1>
                        <div className='h-28'><TextArea bgColor="bg-gray-100" value="Enter comments here" /></div>
                        <div className="flex mt-2">
                            <div className='flex-1'><button className='bg-green-300 text-black rounded-sm px-1 py-0 hover:shadow-lg'><a className='' style={{ 'fontSize': '10px' }} target="_blank" href="https://www.google.com/inputtools/try/">Type Hindi &#8594;</a></button></div>
                            <div className='flex-1'><button style={{ 'fontSize': '10px' }} className='bg-green-500 text-white rounded-sm px-2 hover:shadow-lg py-1'>Send Comment</button></div>

                        </div>
                        <div><CheckBoxInput fun={swithEscalateStatus} /></div>
                        <div><button
                            className="block w-full bg-sky-500 border-2  shadow-lg text-white text-sm font-semibold rounded-lg  focus:outline-none focus:shadow-outline  hover:shadow-xs p-3 py-2 hover:bg-sky-600 hover:text-white my-4">Approved</button></div>

                    </div>
                </div>
                <div className='col-span-12 md:col-span-9 bg-white'>
                    {/* <TimeLine /> */}
                    <TimeLine2 />
                </div>
            </div>
        </>
    )
}

export default WorkFlow
/**
 * Exported to :
 * 1.DetailsTabs Component
 * 
 */