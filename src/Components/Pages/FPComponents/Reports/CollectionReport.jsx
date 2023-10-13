///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : CollectionReport
// 👉 Status      : Close
// 👉 Description : This component will show collection reports with some parameters.
// 👉 Functions   :  
//                  1. inputBox          -> Function to map input field.
//                  2. fetchData         -> To fetch data by some parameters.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React from 'react'
import ListTableConnect from "@/Components/Common/ListTableBP/ListTableConnect";
import { useFormik } from "formik";
import { useState } from "react";
import { RiFilter2Line } from "react-icons/ri";
import { RotatingLines } from "react-loader-spinner";
import * as yup from 'yup'
import ProjectApiList from "@/Components/api/ProjectApiList";
import { useNavigate } from "react-router-dom";
import { getCurrentDate, indianAmount, indianDate, nullToNA } from "@/Components/Common/PowerupFunctions";
import useSetTitle from "@/Components/Common/useSetTitle";

const CollectionReport = () => {

    // 👉 Setting title 👈
    useSetTitle("Collection Report")

    // 👉 API constant 👈
    const { api_CollectionReport } = ProjectApiList()

    // 👉 Navigate constant 👈
    const navigate = useNavigate()

    // 👉 Column constant 👈
    const columns = [
        {
            Header: "Sl.No.",
            Cell: ({ row }) => <div>{row?.index + 1}</div>
        },
        {
            Header: "Name",
            accessor: "full_name",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.full_name))
        },
        {
            Header: "Mobile No.",
            accessor: "mobile",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.mobile))
        },
        {
            Header: "Challan No",
            accessor: "challan_no",
            Cell: ({ cell }) => (
                <div className='underline cursor-pointer' onClick={() => cell?.row?.original?.challan_id && navigate(`/challan/${cell?.row?.original?.challan_id}`)}>
                    {nullToNA(cell.row.original?.challan_no)}
                </div>
            )
        },
        {
            Header: "Violation Made",
            accessor: "violation_name",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_name))
        },
        {
            Header: "Violation Section",
            accessor: "violation_section",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_section))
        },
        {
            Header: "Violation Place",
            accessor: "violation_place",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_place))
        },
        {
            Header: "Transaction No",
            accessor: "tran_no",
            Cell: ({ cell }) => (
                <div className='underline cursor-pointer' onClick={() => cell.row.original?.tran_no && navigate(`/fp-receipt/${cell.row.original?.tran_no}`)}>
                    {nullToNA(cell.row.original?.tran_no)}
                </div>
                )
        },
        {
            Header: "Transaction Date",
            accessor: "tran_date",
            Cell: ({ cell }) => (indianDate(cell.row.original?.tran_date))
        },
        {
            Header: "Payment Mode",
            accessor: "payment_mode",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.payment_mode))
        },
        {
            Header: "Penalty Amount",
            accessor: "total_amount",
            Cell: ({ cell }) => (indianAmount(cell.row.original?.total_amount))
        },
    ]

    // 👉 State Constants 👈
    const [requestBody, setrequestBody] = useState({})
    const [changeData, setchangeData] = useState(0)
    const [loader, setloader] = useState(false);

    // 👉 CSS Constants 👈
    const labelStyle = 'text-gray-800 text-sm'
    const inputStyle = 'border focus:outline-none drop-shadow-sm focus:drop-shadow-md px-4 py-1 text-gray-700 shadow-black placeholder:text-sm'

    const formDataList = [
        { title: "From Date", key: "fromDate", width: 'md:w-[20%] w-full', type: 'date', hint: "", required: true, options: '', okey: '', ovalue: '' },
        { title: "Upto Date", key: "uptoDate", width: 'md:w-[20%] w-full', type: 'date', hint: "", required: true, options: '', okey: '', ovalue: '' },
        {
            title: "Payment Mode", key: "paymentMode", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name",
            options: [
                { id: 'CASH', value: 'Cash' },
                // { id: 'CHEQUE', value: 'Cheque' },
                // { id: 'DD', value: 'DD' },
                // { id: 'ONLINE', value: 'Online' },
            ],
            okey: 'id', ovalue: 'value'
        },
    ]

    // 👉 Function 1 👈
    const inputBox = (key, title = '', type, width = '', hint = '', required = false, options = [], okey = '', ovalue = '') => {
        return (
            <div className={`flex flex-col ${width} `}>
                {title != '' && <label htmlFor={key} className={labelStyle}>{title} {required && <span className='text-red-500 text-xs font-bold'>*</span>} : </label>}
                {type != 'select' && type != 'file' && <input {...formik.getFieldProps(key)} type={type} className={inputStyle + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`} name={key} id="" placeholder={hint} />}
                {type == 'select' && <select {...formik.getFieldProps(key)} className={inputStyle + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 text-red-400' : ' focus:border-zinc-300 border-zinc-200 '}`}>

                                <option value="">All</option>
                                {
                                    options?.map((elem) => <option className='' value={elem[okey]}>{elem[ovalue]}</option>)
                                }

                </select>}
            </div>
        );
    }

    // 👉 Validation Schema 👈
    const schema = yup.object().shape(
        [...formDataList]?.reduce((acc, elem) => {

            if (elem?.required) {
                acc[elem.key] = yup.string().required(elem?.hint)
            }

            return acc;
        }, {})
    );

    // 👉 Formik initial values 👈
    const initialValues = {
        fromDate: getCurrentDate(),
        uptoDate: getCurrentDate(),
        paymentMode: ''
    }

    // 👉 Formik constant 👈
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: schema,
        onSubmit: (values) => {
            fetchData(values)
        },
    });

    // 👉 Function 2 👈
    const fetchData = (data) => {
        setrequestBody({
            fromDate: data?.fromDate,
            uptoDate: data?.uptoDate,
            paymentMode: data?.paymentMode
        })

        setchangeData(prev => prev + 1)

    };

    return (
        <>

            {/* 👉 Searching Form 👈 */}
            <form onSubmit={formik.handleSubmit} onChange={formik.handleChange} className="bg-white poppins p-4 mb-8">

                <h1 className="text-xl font-semibold uppercase text-center text-gray-700 border-b border-gray-400 mb-4 pb-1">Collection Report</h1>

                <section className='flex gap-4 flex-wrap my-6'>

                    {
                        formDataList?.map((elem) => {
                            return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, elem?.options, elem?.okey, elem?.ovalue)
                        })
                    }
                    {/* 👉 Submit Button 👈 */}
                    <div className="mt-4 w-full md:w-[30%] flex flex-row flex-wrap items-center gap-x-4 gap-y-2 md:mt-4">
                        <div className=" ">{
                            loader ?
                                <>
                                    {
                                        <div className='flex justify-center'>
                                            <RotatingLines
                                                strokeColor="grey"
                                                strokeWidth="5"
                                                animationDuration="0.75"
                                                width="25"
                                                visible={true}
                                            />
                                        </div>
                                    }
                                </>
                                :

                                <button
                                    type="submit"
                                    className=" flex items-center border border-green-600 bg-green-500 hover:bg-green-600 text-white shadow-md rounded-sm  text-sm px-5 py-1"
                                >
                                    <span className=""><RiFilter2Line fontSize={''} /></span>
                                    <span>Search Record</span>
                                </button>

                        }
                        </div>
                    </div>
                </section>

            </form>

            {/* 👉 Table 👈 */}
            {Object.keys(requestBody).length !== 0 && <ListTableConnect
                api={api_CollectionReport} // sending api
                columns={columns} // sending column
                requestBody={requestBody}
                changeData={changeData} // sending body
                search={false}
                loader={(status) => setloader(status)}
            />}

        </>
    );
}


export default CollectionReport