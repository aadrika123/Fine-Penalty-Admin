///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : ViolationWiseReport
// 👉 Status      : Open
// 👉 Description : This component will violation wise reports with some parameters.
// 👉 Functions   :  
//                  1. inputBox          -> Function to map input field.
//                  2. fetchData         -> To fetch data by some parameters.
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

const ViolationWiseReport = () => {

    // 👉 Setting title 👈
    useSetTitle("Violation Wise Report")

    // 👉 API constant 👈
    const { api_ViolationWiseReport, api_getViolationList, api_getSectionList, api_listDepartment, api_violationMasterList } = ProjectApiList()
    const [violationList, setViolationList] = useState([])
    const [violationSectionList, setViolationSectionList] = useState([])
    const [departmentList, setDepartmentList] = useState([])

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
            Header: "Penalty Amount",
            accessor: "total_amount",
            Cell: ({ cell }) => (indianAmount(cell.row.original?.total_amount))
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
        { title: "Department", key: "department", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name", options: departmentList, okey: 'id', ovalue: 'department_name' },
        { title: "Violation Section", key: "violationSection", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name", options: violationSectionList, okey: 'id', ovalue: 'violation_section' },
        { title: "Violation Made", key: "violationMade", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name", options: violationList, okey: 'id', ovalue: 'violation_name' },
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

    // 👉 Formik initial values 👈
    const initialValues = {
        fromDate: getCurrentDate(),
        uptoDate: getCurrentDate(),
        department: "",
        violationMade: '',
        violationSection: '',
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
            // departmentId : data?.department,
            // violationSectionId : data?.violationSection,
            violationId: data?.violationMade
        })

        setchangeData(prev => prev + 1)

    };

    // 👉 Function 3 👈
    const getDepartmentList = () => {

        setsLoader(true)

        AxiosInterceptors
            .post(api_listDepartment, {}, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setDepartmentList(res?.data?.data)
                } else {
                }
                console.log('fp department list response => ', res)
            })
            .catch((err) => {
                console.log('error fp department list => ', err)
            })
            .finally(() => {
                setsLoader(false)
            })
    }

    // 👉 Function 4 👈
    const getViolationSectionList = (value) => {

        console.log(value)

        setsLoader(true)

        AxiosInterceptors
            .post(api_getSectionList, { departmentId: value }, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setViolationSectionList(res?.data?.data)
                } else {
                }
                console.log('fp violation section list response => ', res)
            })
            .catch((err) => {
                console.log('error fp violation section list => ', err)
            })
            .finally(() => {
                setsLoader(false)
            })
    }

    // 👉 Function 5 👈
    const getViolationList = (value) => {

        setsLoader(true)

        let payload = {
            sectionId: value,
            departmentId: formik.values.department
        }

        AxiosInterceptors
            .post(api_getViolationList, payload, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setViolationList(res?.data?.data)
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

    // 👉 Function 6 👈
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name == 'violationSection') {
            getViolationList(value)
        }

        if (name == 'department') {
            getViolationSectionList(value)
        }
    }

    useEffect(() => {
        getDepartmentList()
        // getViolationList()
    }, [])

    return (
        <>

            {/* 👉 Searching Form 👈 */}
            <form onChange={(e) => (formik.handleChange(e), handleChange(e))} onSubmit={formik.handleSubmit} className='w-full h-full p-4 mb-6 border border-zinc-200 bg-zinc-50'>

                <h1 className="text-xl font-semibold uppercase text-center text-gray-700 border-b border-gray-400 mb-4 pb-1">Violation Wise Report</h1>

                <section className='flex gap-4 flex-wrap my-6'>

                    {
                        formDataList?.map((elem) => {
                            return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, elem?.options, elem?.okey, elem?.ovalue)
                        })
                    }

                    {formik.values?.violationMade != '' && <div className='flex flex-wrap gap-2 text-sm w-full'>

                        <span className='block w-full md:w-[10%]'>Violation Made :</span>
                        {
                            Array.isArray(violationList) && violationList?.map((elem) => <>
                                {formik.values.violationMade == elem?.id && <span className='block w-full md:w-[85%] font-semibold'>{elem?.violation_name}</span>}
                            </>)
                        }
                    </div>}

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


            </form >

            {/* 👉 Table 👈 */}
            {
                Object.keys(requestBody).length !== 0 &&
                <ListTableConnect
                    api={api_ViolationWiseReport} // sending api
                    columns={columns} // sending column
                    requestBody={requestBody}
                    changeData={changeData} // sending body
                    search={false}
                    loader={(status) => setloader(status)}
                />
            }

        </>
    );
}


export default ViolationWiseReport