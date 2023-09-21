import React from 'react'

const Tab = (props) => {
  return (
    <>
    <div onClick={props?.action} className={`cursor-pointer transition-all duration-300 w-[4rem] text-center py-2 font-semibold ${props?.active ? 'border-b-2 border-indigo-500' : 'border-none'}`}>
        {props?.label}
    </div>
    </>
  )
}

export default Tab