import React, { useEffect } from 'react'
import ListTableConnect from "@/Components/Common/ListTableBP/ListTableConnect";
import { useFormik } from "formik";
import { useState } from "react";
import { RiFilter2Line } from "react-icons/ri";
import { RotatingLines } from "react-loader-spinner";
import * as yup from 'yup'
import ProjectApiList from "@/Components/api/ProjectApiList";
import { useNavigate } from "react-router-dom";
import { indianAmount, indianDate, nullToNA } from "@/Components/Common/PowerupFunctions";
import { useMemo } from "react";
import useSetTitle from "@/Components/Common/useSetTitle";
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';
import ApiHeader from '@/Components/api/ApiHeader';

const FpApplyReport = () => {
    // 👉 Setting title 👈
    useSetTitle("Fines & Penalties Apply Report")

    // 👉 API constant 👈
    const { api_ViolationWiseReport, api_getViolationList } = ProjectApiList()
    const [violationList, setViolationList] = useState([])

    const [sLoader, setsLoader] = useState(false)

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
            Header: "Holding No",
            accessor: "holding_no",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.holding_no))
        },
        {
            Header: "Application No",
            accessor: "application_no",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.application_no))
        },
        {
            Header: "Violatioin Name",
            accessor: "violation_name",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_name))
        },
        {
            Header: "Violation Section",
            accessor: "violation_section",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_section))
        },
        {
            Header: "Penalty Amount",
            accessor: "penalty_amount",
            Cell: ({ cell }) => (indianAmount(cell.row.original?.penalty_amount))
        },
        // {
        //     Header: "Previous Violation",
        //     accessor: "previous_violation_offence",
        //     Cell: ({ cell }) => (nullToNA(cell.row.original?.previous_violation_offence))
        // },
        {
            Header: "Apply Date",
            accessor: "date",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.date))
        },
        {
            Header: "Action",
            Cell: ({ cell }) => (
                <div className="flex gap-2 ">
                    <button
                        onClick={() => {
                            navigate(`/fp-details/${cell?.row?.original?.id}`)
                        }}
                        className="bg-sky-200 px-3 py-1 rounded-md shadow-lg hover:shadow-xl hover:bg-sky-500 
                  hover:text-white text-black"
                    >
                        View
                    </button>
                </div>
            ),
        }
    ]

    // 👉 State Constants 👈
    const [requestBody, setrequestBody] = useState({})
    const [changeData, setchangeData] = useState(0)
    const [loader, setloader] = useState(false);
    const [viewAll, setviewAll] = useState(false)

    // 👉 CSS Constants 👈
    const labelStyle = 'text-gray-800 text-sm'
    const inputStyle = 'border focus:outline-none drop-shadow-sm focus:drop-shadow-md px-4 py-1 text-gray-700 shadow-black placeholder:text-sm'
    const fileStyle = 'block w-full border focus:outline-none drop-shadow-sm focus:drop-shadow-md p-1 text-sm text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-sm file:border file:text-xs file:font-semibold file:bg-zinc-100 hover:file:bg-zinc-200'

    const formDataList = [
        { title: "Violation Made", key: "violationMade", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name", options: violationList, okey: 'id', ovalue: 'violation_name' },
        { title: "Violation Section", key: "violationSection", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name", options: violationList, okey: 'violation_section_id', ovalue: 'violation_section' },
    ]

    const inputBox = (key, title = '', type, width = '', hint = '', required = false, options = [], okey = '', ovalue = '') => {
        return (
            <div className={`flex flex-col ${width} `}>
                {title != '' && <label htmlFor={key} className={labelStyle}>{title} {required && <span className='text-red-500 text-xs font-bold'>*</span>} : </label>}
                {type != 'select' && type != 'file' && <input {...formik.getFieldProps(key)} type={type} className={inputStyle + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`} name={key} id="" placeholder={hint} />}
                {type == 'select' && <select {...formik.getFieldProps(key)} className={inputStyle + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`}>
                    {
                        sLoader ?
                            <option>Loading...</option>
                            :
                            <>
                                <option value={null}>Select</option>
                                {
                                    options?.map((elem) => <option value={elem[okey]}>{elem[ovalue]}</option>)
                                }
                            </>
                    }
                </select>}
            </div>
        );
    }

    const schema = yup.object().shape(
        [...formDataList]?.reduce((acc, elem) => {
            if ((elem?.type != 'select' && elem?.type != 'option') && elem.required) {
                acc[elem.key] = yup.string().required(elem.hint);
            }
            if (elem?.type == 'select' || elem?.type == 'option') {
                if (elem?.check && elem?.required) {
                    acc[elem.key] = yup.string().required(elem?.hint)
                }
            }
            return acc;
        }, {})
    );

    const initialValues = {
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

    // 👉 Function 1 👈
    const getAllList = () => {

        formik.setFieldValue('searchBy', '')
        formik.setFieldValue("entry", '')

        setrequestBody({})

        setviewAll(false)

        setchangeData(prev => prev + 1)

    }

    // 👉 Function 2 👈
    const fetchData = (data) => {
        setviewAll(true)
        setrequestBody({
            [data?.searchBy]: data?.entry
        })

        setchangeData(prev => prev + 1)

    };

    const getViolationList = () => {

        setsLoader(true)

        AxiosInterceptors
            .post(api_getViolationList, {}, ApiHeader())
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

    useEffect(() => {
        getViolationList()
    }, [])

    return (
        <>

            {/* 👉 Searching Form 👈 */}
            <form onSubmit={formik.handleSubmit} onChange={formik.handleChange} className="bg-white poppins p-4">

                <h1 className="text-xl font-semibold uppercase text-center text-gray-700 border-b border-gray-400 mb-4 pb-1">Fines & Penalties Apply Report</h1>

                <section className='flex gap-4 flex-wrap my-6'>

                    {
                        formDataList?.map((elem) => {
                            return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, elem?.options, elem?.okey, elem?.ovalue)
                        })
                    }
                    {/* 👉 Submit Button 👈 */}
                    <div className="mt-4 w-full md:w-[30%] flex flex-row flex-wrap items-center gap-x-4 gap-y-2 md:mt-6">
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


                {/* {viewAll && <div className='' onClick={() => getAllList()}>
                        {
                            !loader &&
                            <div
                                className="cursor-pointer text-center w-full border border-indigo-600 bg-indigo-500 hover:bg-indigo-600 text-white shadow-md rounded-sm text-sm font-semibold px-5 py-1"
                            >
                                View All Applications
                            </div>}
                    </div>} */}
            </form>

            {/* 👉 Table 👈 */}
            {Object.keys(requestBody).length !== 0 && <ListTableConnect
                api={api_FpApplyReport} // sending api
                columns={columns} // sending column
                requestBody={requestBody}
                changeData={changeData} // sending body
                search={false}
                loader={(status) => setloader(status)}
            />}

        </>
    );
}


export default FpApplyReport