///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : ChallanGeneratingReport
// 👉 Status      : Open
// 👉 Description : This component will show challan generated reports with some parameters.
// 👉 Functions   :  
//                  1. inputBox          -> Function to map input field.
//                  2. getViolationList  -> To fetch violation list.
//                  3. fetchData         -> To fetch data by some parameters.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useEffect } from 'react'
import ListTableConnect from "@/Components/Common/ListTableBP/ListTableConnect";
import { useFormik } from "formik";
import { useState } from "react";
import { RiFilter2Line } from "react-icons/ri";
import { RotatingLines } from "react-loader-spinner";
import * as yup from 'yup'
import ProjectApiList from "@/Components/api/ProjectApiList";
import { useNavigate } from "react-router-dom";
import { getCurrentDate, indianAmount, nullToNA } from "@/Components/Common/PowerupFunctions";
import useSetTitle from "@/Components/Common/useSetTitle";
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';
import ApiHeader from '@/Components/api/ApiHeader';

const ChallanGeneratingReport = () => {

    // 👉 Setting title 👈
    useSetTitle("Challan Generated Report")

    // 👉 API constant 👈
    const { api_ChallanGeneratingReport, api_getUserList } = ProjectApiList()
    const [userList, setUserList] = useState([])
    
    // 👉 Navigate constant 👈
    const navigate = useNavigate()
    
    // 👉 Column constant 👈
    const columns = [
        {
            Header: "Sl.No.",
            Cell: ({ row }) => <div>{row?.index + 1}</div>
        },
        {
            Header: "Officer Name",
            accessor: "user_name",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.user_name))
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
            Header: "Challan Type",
            accessor: "challan_type",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.challan_type))
        },
        {
            Header: "Challan Category",
            accessor: "challan_category",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.challan_category))
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
            Header: "Penalty Amount",
            accessor: "total_amount",
            Cell: ({ cell }) => (
                <>
                    <span className={`${cell?.row?.original?.payment_status ? 'bg-green-500' : 'bg-red-400'} text-white px-2 py-0.5 drop-shadow-md`}>{indianAmount(cell.row.original?.total_amount)}</span>
                </>
            )
        },
    ]

    // 👉 State Constants 👈
    const [requestBody, setrequestBody] = useState({})
    const [changeData, setchangeData] = useState(0)
    const [loader, setloader] = useState(false);
    const [sLoader, setsLoader] = useState(false)

    // 👉 CSS Constants 👈
    const labelStyle = 'text-gray-800 text-sm'
    const inputStyle = 'border focus:outline-none drop-shadow-sm focus:drop-shadow-md px-4 py-1 text-gray-700 shadow-black placeholder:text-sm'

    // 👉 Filter Form JSON 👈
    const formDataList = [
        { title: "From Date", key: "fromDate", width: 'md:w-[20%] w-full', type: 'date', hint: "", required: true, options: '', okey: '', ovalue: '' },
        { title: "Upto Date", key: "uptoDate", width: 'md:w-[20%] w-full', type: 'date', hint: "", required: true, options: '', okey: '', ovalue: '' },
        { title: "Users", key: "users", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name", options: userList, okey: 'id', ovalue: 'user_name' },
        { title: "Challan Type", key: "challanType", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name", options: [{ id: 'Via Verification', value: 'Via Verification' }, { id: 'On Spot', value: 'On Spot' }], okey: 'id', ovalue: 'value' },
        // { title: "Challan Category", key: "challanCategory", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name", options: [{ id: 1, value: 'E-Rickshaw' }, { id: 2, value: 'Others' }], okey: 'id', ovalue: 'value' },
    ]

    // 👉 Function 1 👈
    const inputBox = (key, title = '', type, width = '', hint = '', required = false, options = [], okey = '', ovalue = '') => {
        return (
            <div className={`flex flex-col ${width} `}>
                {title != '' && <label htmlFor={key} className={labelStyle}>{title} {required && <span className='text-red-500 text-xs font-bold'>*</span>} : </label>}
                {type != 'select' && type != 'file' && <input {...formik.getFieldProps(key)} type={type} className={inputStyle + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`} name={key} id="" placeholder={hint} />}
                {type == 'select' && <select {...formik.getFieldProps(key)} className={inputStyle + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 text-red-400' : ' focus:border-zinc-300 border-zinc-200 '}`}>
                    {
                        sLoader ?
                            <option>Loading...</option>
                            :
                            <>
                                <option value="">All</option>
                                {
                                    options?.map((elem) => <option className='' value={elem[okey]}>{elem[ovalue]}</option>)
                                }
                            </>
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

    // 👉 Initial values 👈
    const initialValues = {
        fromDate: getCurrentDate(),
        uptoDate: getCurrentDate(),
        users: '',
        challanType: '',
        challanCategory: '',
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
    const getViolationList = () => {

        setsLoader(true)

        AxiosInterceptors
            .post(api_getUserList, {}, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setUserList(res?.data?.data)
                } else {
                }
                console.log('fp violation list response => ', res)
            })
            .catch((err) => {
                console.log('error fp violation list => ', err)
            })
            .finally(() => {
                setsLoader(false)
            })
    }

    // 👉 Function 3 👈
    const fetchData = (data) => {
        setrequestBody({
            fromDate: data?.fromDate,
            uptoDate: data?.uptoDate,
            userId: data?.users,
            challanType: data?.challanType,
            // challanCategory: data?.challanCategory,
        })

        setchangeData(prev => prev + 1)

    };

    // 👉 To call Funtion 2 👈
    useEffect(() => {
        getViolationList()
    }, [])

    return (
        <>

            {/* 👉 Searching Form 👈 */}
            <form onSubmit={formik.handleSubmit} onChange={formik.handleChange} className="bg-white poppins p-4 mb-8">

                <h1 className="text-xl font-semibold uppercase text-center text-gray-700 border-b border-gray-400 mb-4 pb-1">Challan Generated Report</h1>

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
            {Object.keys(requestBody).length !== 0 &&
                <ListTableConnect
                    api={api_ChallanGeneratingReport} // sending api
                    columns={columns} // sending column
                    requestBody={requestBody}
                    changeData={changeData} // sending body
                    search={false}
                    loader={(status) => setloader(status)}
                />}

        </>
    );
}


export default ChallanGeneratingReport