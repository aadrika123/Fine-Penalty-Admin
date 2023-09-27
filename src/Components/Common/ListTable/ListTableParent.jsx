//////////////////////////////////////////////////////////////////////////////////////
//    Author - R U Bharti
//    Version - 1.0
//    Date - 24 june 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - ListTableParent
//    DESCRIPTION - ListTableParent Component
//////////////////////////////////////////////////////////////////////////////////////
import { useState } from 'react'
import ListTable from './ListTable'
import { useQuery } from "react-query";
import axios from 'axios'
import { format } from 'date-fns'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';


function ListTableParent() {
    const { isLoading, data, isError, error } = useQuery("first-query", () => {
        return AxiosInterceptors.get("http://localhost:3001/applicationList");
    });

    const COLUMNS = [

        {
            Header: 'Ward No.',
            accessor: 'ward_no'
        },
        {
            Header: 'Saf No.',
            accessor: 'saf_no'
        },
        {
            Header: 'Owner Name',
            accessor: 'owner_name'
        },
        {
            Header: 'Property Type',
            accessor: 'property_type'
        },
        {
            Header: 'Assessment Type',
            accessor: 'assessment_type', Cell: ({ cell }) => (

                <div className={' rounded-full shadow-lg h-7 mx-auto w-7 font-semibold text-center py-1 text-sm px-1  ' + (cell.row.values.assessment_type == 'New Assessment' ? 'bg-green-200 text-green-900 ' : '') + (cell.row.values.assessment_type == 'Reassessment' ? 'bg-indigo-200 text-indigo-900 ' : '') + (cell.row.values.assessment_type == 'Mutation' ? 'bg-red-200 text-red-900 ' : '')}>
                    {/* {cell.row.values.assessment_type} */}
                    {Array.from(cell.row.values.assessment_type)[0]}
                </div>
            )
        }
        ,
        {
            Header: 'Received at',
            accessor: 'received_at',
            Cell: ({ value }) => { return format(new Date(value), 'dd/MM/yyyy') }

        },
        {
            Header: 'Action',
            accessor: 'id',
            Cell: ({ cell }) => (
                <button className='bg-sky-200 px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:bg-sky-800 hover:text-white text-black'>
                    {/* View {cell.row.values.id} */}
                    View
                </button>
            )
        }
    ]

    return (
        <>

            {isLoading && <h1>Looading ...</h1>}
            {!isLoading && <ListTable columns={COLUMNS} dataList={data?.data} />}
        </>
    )
}

export default ListTableParent