import React, { useMemo } from 'react'
import { MdVerified } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'

const Heading = (props) => {

    const navigate = useNavigate()

    // const applyButton = useMemo(() => {
    //     const lowercaseMatchForApply = props?.matchForApply.map(role => role.toLowerCase());
    //     return Array.isArray(props?.allRole) && props?.allRole.some(role => lowercaseMatchForApply.includes(role.toLowerCase()));
    // }, [props?.allRole]);

    // const wfButton = useMemo(() => {
    //     const lowercaseMatchForWf = props?.matchForSafWf.map(role => role.toLowerCase());
    //     return Array.isArray(props?.allRole) && props?.allRole.some(role => lowercaseMatchForWf.includes(role.toLowerCase()));
    // }, [props?.allRole]);

    return (
        <div className=' bg-white shadow-xl py-4 px-2 md:px-6 md:py-6 mt-4 mx-10 mb-10 animate__animated animate__fadeInDown animate__faster'>
            <div className="flex flex-col md:flex-row">

                <div className="flex-initial ml-4">
                    <div className='text-2xl font-bold text-black google-roboto capitalize'>{props?.heading}</div>
                    <div className='mt-1'>
                        <span className='text-gray-600'><MdVerified className="inline text-green-500 text-xl" />{props?.subHeading}</span>
                    </div>
                    <div></div>
                </div>
                <div className="flex-1 flex text-right justify-center items-center md:justify-end md:items-end h-full mt-4 md:mt-0">



                    <Tooltip anchorId="button-3" />
                    <button id="button-3" data-tooltip-content="Click to change password." onClick={() => navigate(props?.changePasswordLink)} className="mr-4 cypress_floor_add_update text-gray-700 px-4 md:px-8 py-3 bg-white-600 font-medium border text-xs leading-tight capitalize rounded-xl shadow-md hover:bg-indigo-500 hover:shadow-lg focus:bg-indigo-500 hover:text-white focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out">Change Password</button>


                    {
                        props?.allRole?.user_type == 'CO' &&
                        <> 
                            <Tooltip anchorId="button-1" />
                            <button id="button-1" data-tooltip-content="Click to go to fine & penalty workflow." onClick={() => navigate(props?.mainWorkflowLink)} className="cypress_floor_add_update text-white px-4 md:px-8 py-3 bg-indigo-500 font-medium border text-xs leading-tight capitalize rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out">Fine & Penalty Workflow</button>
                        </>
                    }

                    {/* {
                        applyButton &&
                        <>
                            <Tooltip anchorId="button-2" />
                            <button id="button-2" data-tooltip-content="Click to apply marriage." onClick={() => navigate(props?.applyLink)} className="cypress_floor_add_update text-white px-4 md:px-8 py-3 bg-indigo-500 font-medium border text-xs leading-tight capitalize rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out">Apply Marriage</button>
                        </>} */}

                </div>
            </div>
        </div>
    )
}

export default Heading