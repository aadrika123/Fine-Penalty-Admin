import React from 'react'

function MailboxLink(props) {
    return (
        <>

            <span className={(props.activeStatus ? "bg-indigo-500  rounded-md text-white font-semibold shadow-lg" : " text-gray-500 border border-gray-500 rounded-md") + " cursor-pointer flex items-center py-1 px-2 text-base text whitespace-nowrap"}>
                <svg className={(props.activeStatus ? "text-white font-semibold" : " text-gray-500") + " w-6 h-6 transition duration-75  group-hover:text-gray-900 "} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                <span className="sm:ml-3 text-xs sm:text-sm">{props.title} </span>
            </span>

        </>
    )
}

export default MailboxLink