import React from 'react'
import { AiOutlineRight } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

const ShortcutCard = (props) => {
    
    const navigate = useNavigate()

    return (
        <div className="w-full rounded overflow-hidden shadow-lg bg-white p-2 px-10 flex items-center gap-6">
            <div className='flex-1'>{props?.heading}</div>
            <div onClick={() => navigate(props?.path)} className='cursor-pointer hover:bg-indigo-200 w-10 h-10 bg-indigo-50 rounded-full inline-flex justify-center items-center'><AiOutlineRight className="inline text-indigo-500" />
            </div>

        </div>
    )
}

export default ShortcutCard