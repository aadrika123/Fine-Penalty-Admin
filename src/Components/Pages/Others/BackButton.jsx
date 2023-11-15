import React from 'react'
import { Outlet } from 'react-router-dom'

const BackButton = () => {
    return (
        <>
            <button className='absolute top-2 left-2 px-4 py-1 bg-slate-500 text-sm text-white hover:bg-slate-600' onClick={() => window.history.back()} >Back</button>
            <Outlet />
        </>
    )
}

export default BackButton