///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : FpApplicationList
// 👉 Status      : Close
// 👉 Description : This component is to view application list.
// 👉 Functions   :  
//                  1. getAllList  -> To fetch all list.
//                  2. fetchData   -> To fetch with some payload.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
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

const FpApplicationList = () => {

    // 👉 Setting title 👈
    useSetTitle("Fines & Penalties Application List")

    // 👉 API constant 👈
    const { api_getInfractionList } = ProjectApiList()

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
            Header: "Violation Name",
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
            accessor: "amount",
            Cell: ({ cell }) => (indianAmount(cell.row.original?.amount))
        },
        {
            Header: "Apply Date",
            accessor: "date",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.date)),
            className: 'w-[7%]'
        },
        {
            Header: "Action",
            Cell: ({ cell }) => (
                <div className="flex gap-2 ">
                    <button
                        onClick={() => {
                            navigate(`/fp-details/${cell?.row?.original?.id}`)
                        }}
                        className="border border-sky-700 text-sky-700 px-3 py-1 rounded-sm shadow-md hover:shadow-xl hover:bg-sky-700 
                        hover:text-white "
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

    // 👉 Validation schema constant 👈
    const schema = yup.object({
        searchBy: yup.string().required("Select filter type"),
        entry: yup.string().required("Enter the parameter"),
    });

    // 👉 Formik constant 👈
    const formik = useFormik({
        initialValues: {
            searchBy: "",
            entry: "",
        },
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

    return (
        <>

            {/* 👉 Searching Form 👈 */}
            <form onSubmit={formik.handleSubmit} onChange={formik.handleChange} className="bg-white poppins p-4">

                {/* 👉 Header 👈 */}
                <h1 className="text-xl font-semibold uppercase text-center text-gray-700 border-b border-gray-400 mb-4 pb-1">Fines & Penalties Application List</h1>

                <div className="flex flex-row flex-wrap gap-x-4 items-center gap-y-2 pb-4 mb-2 border-b">

                    {/* 👉 Filter Field 👈 */}
                    <div className='w-full md:w-[25%]'>
                        <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                            Filter By<span className="text-red-500">*</span>
                        </label>
                        <select
                            {...formik.getFieldProps('searchBy')}
                            className={`${formik.errors.searchBy ? 'text-red-400 font-semibold border border-solid border-red-400 placeholder-red-300 shadow-red-100 ' : 'text-gray-700 font-normal border border-solid border-gray-400 placeholder-gray-400 '} cursor-pointer w-full px-3 py-1 text-sm  bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none shadow-sm`}
                        >
                            <option value="">Select</option>
                            <option value="applicationNo">Application Number</option>
                            <option value="mobile">Mobile Number</option>
                        </select>
                    </div>

                    {/* 👉 Parameter Field 👈 */}
                    <div className='w-full md:w-[25%] '>
                        <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                            Parameter
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...formik.getFieldProps('entry')}
                            placeholder='Enter the parameter'
                            className=" w-full px-3 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-gray-400 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-400 shadow-md"
                        />
                    </div>

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
                        {viewAll && <div className='' onClick={() => getAllList()}>
                            {
                                !loader &&
                                <div
                                    className="cursor-pointer text-center w-full border border-indigo-600 bg-indigo-500 hover:bg-indigo-600 text-white shadow-md rounded-sm text-sm font-semibold px-5 py-1"
                                >
                                    View All Applications
                                </div>}
                        </div>}

                    </div>
                </div>

            </form>

            {/* 👉 Table 👈 */}
            <div className="bg-white p-4">
                <ListTableConnect
                    api={api_getInfractionList} // sending api
                    columns={columns} // sending column
                    requestBody={requestBody}
                    changeData={changeData} // sending body
                    search={false}
                    loader={(status) => setloader(status)}
                />
            </div>

        </>
    );
}

export default FpApplicationList