//////////////////////////////////////////////////////////////////////////////////////
//    Author - Talib Hussain
//    Version - 1.0
//    Date - 24 june 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - MemebersAction
//    DESCRIPTION - MemebersAction Component
//////////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import { useQuery } from "react-query";
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';

function MemebersAction() {
    const { isLoading, data, isError, error } = useQuery("first-query", () => {
        return AxiosInterceptors.get("http://localhost:3001/levelCandidateList");
    });
    return (
        <>
            <div className='px-2'>
                <select className="shadow-lg h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-pointer"  >
                    {!isLoading ?
                        data.data.map((data) => (
                            <option value={data.id}>{data.designation}</option>
                        )) : ''
                    }

                </select>
            </div>
        </>
    )
}

export default MemebersAction
/**
 * Exported to :
 * 1. WorkFlow Component
 * 
 */