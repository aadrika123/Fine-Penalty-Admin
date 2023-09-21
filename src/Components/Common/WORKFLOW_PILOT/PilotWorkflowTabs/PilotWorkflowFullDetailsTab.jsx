import React, { useState } from 'react'
import {MdTag} from 'react-icons/md'
import { nullToNA } from '@/Components/Common/PowerupFunctions'

function PilotWorkflowFullDetailsTab(props) {
    const [editStatus, seteditStatus] = useState(false)
    const [btcStatus, setbtcStatus] = useState(false)
    const [normalState, setnormalState] = useState(true)
    const [selectList, setselectList] = useState([])
    const [selectListToShow, setselectListToShow] = useState([])
   


    const selectAction = (status, key, displayString) => {

        console.log('id...', displayString)
        // return
        // ADD TO LIST IF CHECKED 
        // if (status) {
        let tempSelectList = [...selectList, key]
        let tempSelectListToShow = [...selectListToShow, displayString]

        setselectList(tempSelectList)
        setselectListToShow(tempSelectListToShow)
        // }

        // REMOVE FORM LIST IF UNCHECKED

    }
    console.log('lis....', selectListToShow)
    return (
        <>

            {/* {!normalState && btcStatus && selectListToShow?.length !=0 && <div className='text-white bg-indigo-600 p-10 shadow-xl w-60 absolute left-20 bottom-20 rounded-lg border-2 border-white' style={{ 'zIndex': 1000 }}>
                <h1 className='font-semibold'>Chnages for BTC</h1>
                {
                    selectListToShow.map((data, index) => (
                        <div>{index + 1}. {data}</div>
                    ))
                }
                <div>

                </div>

                <button className='bg-white border-2 border-white-500 text-indigo-500  shadow-lg text-sm font-semibold rounded-lg  focus:outline-none focus:shadow-outline  hover:shadow-xs p-3 py-2 px-6 hover:bg-white-600 my-4 text-center mr-2'>Send BTC</button>
            </div>

            } */}

            {/* // FOR BTC CHECKOBOX AND EDIT ACTION */}
            {/* <div className='w-full pl-10'>
                <span className='font-semibold text-indigo-500'>{editStatus && 'Edit Property Details'} {btcStatus && 'Select BTC Fields'}</span>
                <span className='float-right'>
                    {normalState && <button onClick={() => {
                        seteditStatus(true)
                        setnormalState(false)
                    }} className='border-2 border-indigo-500 text-indigo-400  shadow-lg text-sm font-semibold rounded-lg  focus:outline-none focus:shadow-outline  hover:shadow-xs p-3 py-2 px-6 hover:bg-indigo-600 hover:text-white my-4 text-center mr-2'><TbEdit className="inline" /> Edit</button>}
                    {normalState && <button onClick={() => {
                        setbtcStatus(true)
                        setnormalState(false)
                    }} className='border-2 border-indigo-500 text-indigo-400  shadow-lg text-sm font-semibold rounded-lg  focus:outline-none focus:shadow-outline  hover:shadow-xs p-3 py-2 px-6 hover:bg-indigo-600 hover:text-white my-4 text-center'>BTC</button>}
                    {!normalState && <button onClick={() => {
                        seteditStatus(false)
                        setbtcStatus(false)
                        setnormalState(true)
                    }} className='border-2 border-gray-500 text-gray-400  shadow-lg text-sm font-semibold rounded-lg  focus:outline-none focus:shadow-outline  hover:shadow-xs p-3 py-2 px-6 hover:bg-gray-600 hover:text-white my-4 text-center'>Exit</button>}
                    {!normalState && btcStatus && <button onClick={() => {
                        alert('send btc')
                        seteditStatus(false)
                        setbtcStatus(false)
                        setnormalState(true)
                    }} className='bg-indigo-500 text-white  shadow-lg text-sm font-semibold rounded-lg  focus:outline-none focus:shadow-outline  hover:shadow-xs p-3 py-2 px-6 hover:bg-indigo-600 hover:text-white my-4 text-center ml-4'>Send BTC</button>}
                    {!normalState && editStatus && <button onClick={() => {
                        alert('submit edit')
                        seteditStatus(false)
                        setbtcStatus(false)
                        setnormalState(true)
                    }} className='bg-indigo-500 text-white  shadow-lg text-sm font-semibold rounded-lg  focus:outline-none focus:shadow-outline  hover:shadow-xs p-3 py-2 px-6 hover:bg-indigo-600 hover:text-white my-4 text-center ml-4'>Submit Changes</button>}
                </span>
            </div> */}
            <div class="rounded-lg pt-4 z-50 w-full md:w-[70vw] md:h-[70vh]" >

                <div className=''>

                    {/* basic details */}
                    {props?.applicationData?.data?.fullDetailsData?.dataArray?.map((data) => (
                        <div className="w-full md:w-[69vw] " >
                            <div className="container mx-auto mb-0 mt-1 p-2 md:p-5 py-1 ">
                                <div className="md:flex no-wrap md:-mx-2 ">
                                    <div className="w-full md:mx-2 ">
                                        <div className="md:p-3  rounded-sm">
                                            <div className="flex items-center pl-0 space-x-2 font-semibold text-gray-900 leading-8 mb-2">
                                                <div className="tracking-wide flex-1"><MdTag className="inline font-semibold" /> {nullToNA(data?.headerTitle)}</div>
                                            </div>
                                            <div className=' rounded-lg  py-6 bg-sky-50 shadow-xl'>
                                                <div className="grid grid-cols-10 space-y-2  pl-4 ">
                                                    {data?.data?.map((data) => (
                                                        <div className='col-span-5 md:col-span-2 text-xs'>
                                                            <div className='font-bold text-sm'>{nullToNA(data?.value)}</div>
                                                            <div className='text-gray-500 flex'>{nullToNA(data?.displayString)}
                                                                {/* {btcStatus && <input onClick={(e) => selectAction(e.target.value, data?.key, data?.displayString)} id={`check${data?.key}`} type="checkbox" className="ml-2 cursor-pointer w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                                                </input>}
                                                                {editStatus && <input id={`input${data?.key}`} value={data?.value} type="text" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                                                                    placeholder="Enter new ward no." />} */}
                                                            </div>
                                                        </div>
                                                    ))}

                                                </div>

                                            </div>

                                        </div>



                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {
                        props?.applicationData?.data?.fullDetailsData?.tableArray?.map((data) => (
                            <div className="w-full md:w-[69vw] overflow-x-auto" >
                                <div className="container mx-auto mb-0 mt-1 md:p-5 py-1 ">
                                    <div className="md:flex no-wrap md:-mx-2 ">
                                        <div className="w-full md:mx-2 ">
                                            <div className="px-1 md:p-3 rounded-sm">
                                                <div className="flex items-center pl-0 space-x-2 font-semibold text-gray-900 leading-8 mb-2">
                                                    <span className="tracking-wide"><MdTag className="inline font-semibold" /> {nullToNA(data?.headerTitle)}</span>
                                                </div>

                                                <>
                                                    <table className='min-w-full leading-normal mt-2 bg-sky-50 shadow-xl'>
                                                        <thead className='font-bold text-left text-sm bg-sky-50 text-gray-600'>
                                                            <tr>
                                                                {/* <th className="px-2 py-3 border-b border-gray-200  text-xs capitalize text-left">#</th> */}
                                                                {data?.tableHead?.map((head) => (
                                                                    <th className="px-2 py-3 border-b border-gray-200  text-xs capitalize text-left">{nullToNA(head)}</th>
                                                                ))}



                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-sm">

                                                            <>
                                                                {data?.tableData?.map((dataIn, index) => (
                                                                    <tr className="bg-sky-50  border-b border-gray-200">
                                                                        {/* <td className="px-2 py-2 text-sm text-left">{index + 1}</td> */}
                                                                        {dataIn?.map((dataIn2) => (
                                                                            <td className="px-2 py-2 text-sm text-left">{nullToNA(dataIn2)}</td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </>


                                                        </tbody>
                                                    </table>
                                                </>


                                            </div>



                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="h-40 w-full"></div>

            </div>
        </>
    )
}

export default PilotWorkflowFullDetailsTab