import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const BackButton = () => {

    const navigate = useNavigate()

    const navigateFun = () => {

        if(window.history.length == 0){
            navigate('/fines')
        } else {
            window.history.back()
        }

    }

    return (
        <>
            <button className='relative top-2 left-2 px-4 py-1 bg-slate-500 text-sm text-white hover:bg-slate-600' onClick={() => navigateFun()} >Back</button>
            <Outlet />
        </>
    )
}

export default BackButton