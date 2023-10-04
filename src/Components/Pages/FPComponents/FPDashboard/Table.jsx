import ShimmerEffectInline from '@/Components/Common/Loaders/ShimmerEffectInline'
import { nullToNA } from '@/Components/Common/PowerupFunctions'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Table = (props) => {

    const navigate = useNavigate()

    return (
        <>
            <table className="min-w-full leading-normal">
                <thead className='bg-indigo-100'>
                    <tr className='font-semibold'>
                        <th scope="col" className="px-2 py-2 border-b border-gray-200 text-gray-800  text-left text-sm">
                            #
                        </th>
                        {
                            props?.heading?.map((elem) =>
                                <th scope="col" className="px-2 py-2 border-b border-gray-200 text-gray-800  text-left text-sm">
                                    {elem}
                                </th>
                            )
                        }
                        <th scope="col" className="px-2 py-2 border-b border-gray-200 text-gray-800  text-left text-sm">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className='bg-white'>
                    {props?.loading
                        ?
                        <tr>
                            <td colSpan={props?.heading?.length + 2}><ShimmerEffectInline /></td>
                        </tr>
                        :
                        <>
                            {
                                Array.isArray(props?.data) && <>
                                    {
                                        props?.data?.length > 0 ?
                                            <>
                                                {
                                                    props?.data?.slice(0, 10)?.map((value, index) =>
                                                        <>
                                                            <tr className="bg-white shadow-lg border-b border-gray-200">
                                                                <td className="px-2 py-2 text-sm text-left">{index + 1}</td>
                                                                {
                                                                    props?.dataKey?.map((elem, index) =>
                                                                        <td className={`px-2 py-2 text-sm text-left ${index == props?.dataKey?.length - 1  && 'w-[7%]'}`}>{nullToNA(value[elem])}</td>
                                                                    )
                                                                }
                                                                <td className="px-2 py-2 text-sm text-left"> <button  className="w-max cursor-pointer px-4 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm" onClick={() => navigate(`${props?.viewLink}${value?.id}`)}>View</button></td>
                                                            </tr>
                                                        </>)
                                                }
                                            </>
                                            :
                                            <tr>
                                                <td colSpan={props?.heading?.length + 2} className="text-center text-red-500 font-semibold py-4">No Application Found</td>
                                            </tr>
                                    }
                                </>
                            }
                        </>
                    }


                </tbody>
            </table>
        </>
    )
}

export default Table