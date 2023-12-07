///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : ViolationIndex
// 👉 Date        : 21-09-2023
// 👉 Status      : Close
// 👉 Description : CRUD opeartion for department, section and violation master.
// 👉 Functions   :  
//                  1. activateBottomErrorCard -> Activate error card to show in screen.
//                  2. handleModal             -> To handle dialog type.
//                  3. getViolationList        -> To get violation list.
//                  4. inputBox                -> To map input field.
//                  5. submitFun               -> Submit final data
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useEffect, useRef, useState } from "react";
import ListTable from "@/Components/Common/ListTable/ListTable";
import { CgPlayListAdd } from "react-icons/cg";
import ApiHeader from "@/Components/api/ApiHeader";
import useSetTitle from "@/Components/Common/useSetTitle";
import AxiosInterceptors from "@/Components/Common/AxiosInterceptors";
import ProjectApiList from "@/Components/api/ProjectApiList";
import { checkErrorMessage, indianAmount, indianDate, nullToNA } from "@/Components/Common/PowerupFunctions";
import ShimmerEffectInline from "@/Components/Common/Loaders/ShimmerEffectInline";
import BarLoader from "@/Components/Common/Loaders/BarLoader";
import BottomErrorCard from "@/Components/Common/BottomErrorCard";
import { RxCross2 } from "react-icons/rx";
import * as yup from 'yup'
import { useFormik } from "formik";
import { FiAlertCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
// import AssignViolation from "./AssignViolation";
import { MdAssignmentAdd } from "react-icons/md";

const CitizenViolationList = () => {

    // 👉 To Set Title 👈
    useSetTitle('Violation Master')

    // 👉 API constants 👈
    const {
        // api_violationMasterList,
        api_updateViolation,
        api_deleteViolation,
        api_addViolation,
        api_listDepartment,
        api_addDepartment,
        api_updateDepartment,
        api_deleteDepartment,
        api_listSection,
        api_addSection,
        api_updateSection,
        api_deleteSection,
        api_getSectionList,
        api_getDepartmentList,
    api_violation_list,

    } = ProjectApiList()


    // 👉 Dialog useRef 👈
    const dialogRef = useRef()

    // 👉 State constants 👈
    const [violationDataList, setViolationDataList] = useState([])
    const [loader, setLoader] = useState(false)
    const [loader2, setLoader2] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [errorState, setErrorState] = useState(false)
    const [modalType, setModalType] = useState('')
    const [vId, setvId] = useState(null)
    const [violationData, setviolationData] = useState(null)
    const [violationSectionList, setViolationSectionList] = useState([])
    const [departmentList, setDepartmentList] = useState([])
    const [violationList, setViolationList] = useState([])
    const [sLoader, setsLoader] = useState(false)
    const [mType, setMType] = useState('violation')

    // 👉 CSS constants 👈
    const editButton = "border border-sky-800 text-sky-800 mx-1 px-3 py-1 rounded-sm shadow-lg hover:shadow-xl hover:bg-sky-800 hover:text-white"
    const deleteButton = "border border-red-300 text-red-400 mx-1 px-3 py-1 rounded-sm shadow-lg hover:shadow-xl hover:bg-red-800 hover:text-white"
    const addButton = "float-right bg-[#1A4D8C] px-3 py-1 rounded-sm shadow-lg hover:shadow-xl hover:bg-[#113766] hover:text-white text-white flex items-center"
    const labelStyle = 'text-gray-800 text-sm'
    const inputStyle = 'border focus:outline-none drop-shadow-sm focus:drop-shadow-md px-4 py-1 text-gray-700 shadow-black placeholder:text-sm'
    const fileStyle = 'block w-full border focus:outline-none drop-shadow-sm focus:drop-shadow-md p-1 text-sm text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-sm file:border file:text-xs file:font-semibold file:bg-zinc-100 hover:file:bg-zinc-200'

    const buttonStyle = (color) => {
        return `px-4 py-1 text-sm bg-${color}-500 hover:bg-${color}-600 select-none rounded-sm hover:drop-shadow-md text-white`
    }

    const tabButtonStyle = (status) => {
        return `border border-slate-700 ${status ? 'bg-slate-700 text-white' : 'text-slate-700 shadow-2xl shadow-slate-700'} mx-1 px-3 py-1 rounded-sm hover:bg-slate-700 hover:text-white text-sm`
    }

    // 👉 Function 1 👈
    const activateBottomErrorCard = (state, message) => {
        setErrorState(state)
        setErrorMessage(message)
    }

    // 👉 Function 2 👈
    const handleModal = (type, data = null) => {

        setModalType(type)

        console.log(type, ":::::::::", data)

        

        dialogRef.current.showModal()
    }

    // 👉 Table Columns 👈
    const DCOLUMNS = [
        {
            Header: "#",
            Cell: ({ row }) => <div className="pr-2">{row?.index + 1}</div>,
        },
        {
            Header: "Department",
            accessor: "department_name",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.department_name)),
        },
        {
            Header: "Created At",
            accessor: "date",
            Cell: ({ cell }) => (indianDate(cell.row.original?.date)),
        },
        {
            Header: "Action",
            accessor: "id",
            Cell: ({ cell }) => (
                <div className="flex flex-row flex-wrap gap-2">
                    {/* <button
                        onClick={() => handleModal('edit', cell?.row?.original)}
                        className={editButton}
                    >
                        Edit
                    </button> */}

                    <button
                        onClick={() => handleModal('delete', cell?.row?.original?.id)}
                        className={deleteButton}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const SCOLUMNS = [
        {
            Header: "#",
            Cell: ({ row }) => <div className="pr-2">{row?.index + 1}</div>,
        },
        {
            Header: "Department",
            accessor: "department_name",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.department_name)),
        },
        {
            Header: "Violation Section",
            accessor: "violation_section",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_section)),
        },
        {
            Header: "Created At",
            Cell: ({ cell }) => (indianDate(cell.row.original?.date)),
        },
        {
            Header: "Action",
            accessor: "id",
            Cell: ({ cell }) => (
                <div className="flex flex-row flex-wrap gap-2">
                    {/* <button
                        onClick={() => handleModal('edit', cell?.row?.original)}
                        className={editButton}
                    >
                        Edit
                    </button> */}

                    <button
                        onClick={() => handleModal('delete', cell?.row?.original?.id)}
                        className={deleteButton}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const VCOLUMNS = [
        {
            Header: "#",
            Cell: ({ row }) => <div className="pr-2">{row?.index + 1}</div>,
        },
        {
            Header: "Violation Name",
            accessor: "violation_name",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_name)),
        },
        {
            Header: "Violation Section",
            accessor: "violation_section",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_section)),
        },
        {
            Header: "Department",
            accessor: "department_name",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.department_name)),
        },
        {
            Header: "Penalty Amount",
            accessor: "penalty_amount",
            Cell: ({ cell }) => (indianAmount(cell.row.original?.penalty_amount)),
        },
        // {
        //     Header: "On Spot",
        //     accessor: 'on_spot',
        //     Cell: ({ cell }) => <>
        //         {
        //             (cell.row.original?.on_spot) ?
        //                 <span className="text-green-400 font-semibold">Yes</span>
        //                 :
        //                 <span className="text-red-400 font-semibold">No</span>
        //         }
        //     </>,
        // },
        // {
        //     Header: "Created By",
        //     accessor: "created_by",
        //     Cell: ({ cell }) => (nullToNA(cell.row.original?.created_by)),
        // },
        // {
        //     Header: "Created At",
        //     accessor: "date",
        //     Cell: ({ cell }) => (indianDate(cell.row.original?.date)),
        //     className: ' w-[7%] '
        // },
        // {
        //     Header: "Action",
        //     accessor: "id",
        //     Cell: ({ cell }) => (
        //         <div className="flex flex-row flex-wrap gap-2">
        //             {/* <button
        //                 onClick={() => handleModal('edit', cell?.row?.original)}
        //                 className={editButton}
        //             >
        //                 Edit
        //             </button> */}

        //             <button
        //                 onClick={() => handleModal('delete', cell?.row?.original?.id)}
        //                 className={deleteButton}
        //             >
        //                 Delete
        //             </button>
        //         </div>
        //     ),
        // },
    ];

    // 👉 Form Fields JSON 👈
    const basicForm = [
        {
            title: "Department",
            key: "department",
            width: `${mType == 'department' ? ' md:w-full ' : (mType == 'section' ? ' md:w-[45%] ' : ' md:w-[20%] ')} w-full `,
            type: (mType == 'department' ? 'text' : 'select'),
            hint: "Enter department",
            required: true,
            options: departmentList,
            okey: 'id',
            ovalue: 'department_name'
        },
        {
            title: "Violation Section",
            key: "violationSection",
            width: `${mType == 'section' ? ' md:w-[45%] ' : ' md:w-[20%] '} w-full ${mType != 'department' ? 'block ' : 'hidden '}`,
            type: (mType == 'section' ? 'number' : 'select'),
            hint: "Enter violation section",
            required: mType != 'department' && true,
            options: violationSectionList,
            okey: 'id',
            ovalue: 'violation_section'
        },
        {
            title: "Violation Name",
            key: "violationMade",
            width: `md:w-[20%] w-full ${(mType != 'department' && mType != 'section') ? 'block ' : 'hidden '}`,
            type: 'text',
            hint: "Enter violation name",
            required: (mType != 'department' && mType != 'section') && true,
            options: violationList,
            okey: 'id',
            ovalue: 'violation_name'
        },
        {
            title: "Penalty Amount",
            key: "penaltyAmount",
            width: `md:w-[20%] w-full ${mType == 'violation' ? 'block ' : 'hidden '}`,
            type: 'number',
            hint: "Enter penalty Amount",
            required: mType == 'violation' && true
        },
    ]

    // 👉 Formik validation schema 👈
    const schema = yup.object().shape(
        [...basicForm]?.reduce((acc, elem) => {

            if (elem?.required) {
                acc[elem.key] = yup.string().required(elem?.hint)
            }

            return acc;
        }, {})
    );

    // 👉 Formik initial values 👈
    const initialValues = {
        department: "",
        violationMade: '',
        violationSection: '',
        penaltyAmount: '',
    }

    // 👉 Formik constant 👈
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: schema,
        onSubmit: (values) => {
            submitFun(values)
        }
    })

    // 👉 Function 3 👈
    const getViolationList = () => {

        setViolationDataList([])

        setLoader(true)

        let url;

        if (mType == 'department') {
            url = api_listDepartment
        }
        if (mType == 'section') {
            url = api_listSection
        }
        if (mType == 'violation') {
            url = api_violation_list
        }

        AxiosInterceptors
            .post(url, {}, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setViolationDataList(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
                console.log('fp violation list response => ', res)
            })
            .catch((err) => {
                activateBottomErrorCard(true, 'Server Error! Please try again later.')
                console.log('error fp violation list => ', err)
            })
            .finally(() => {
                setLoader(false)
            })
    }

    // 👉 Function 4 👈
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
                                <option value={null}>Select</option>
                                {
                                    (typeof options === 'object') && options?.map((elem) => <option className='' value={elem[okey]}>{elem[ovalue]}</option>)
                                }
                            </>
                    }
                </select>}
            </div>
        );
    }

    // 👉 To call Function 3 👈
    useEffect(() => {
        getViolationList()
    }, [mType])

    return (
        <>

            {/* 👉 Loader 👈 */}
            {loader2 && <BarLoader />}

            {/* 👉 Error Card 👈 */}
            {errorState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={errorMessage} />}

            <div className="poppins p-4 px-6">

                {/* 👉 Heading 👈 */}
                <div className="uppercase font-semibold text-gray-700 text-2xl py-2 text-center tracking-[0.7rem]">
                    Violation   List
                </div>

                <div className="w-full h-[0.15rem] bg-gray-400 mb-6"></div>

               


                {/* 👉 Table Loader 👈 */}
                {loader && <ShimmerEffectInline />}

                {/* 👉 Table 👈 */}
                {!loader &&
                    <>
                        {violationDataList?.length > 0 ?

                            <>
                                
                                {
                                    mType == 'violation' &&
                                    <ListTable
                                        columns={VCOLUMNS}
                                        dataList={violationDataList}
                                        exportStatus={false}
                                    />
                                }


                            </>
                            :
                            <>
                                
                                <div className="bg-red-100 text-red-500 py-2 text-lg font-semibold text-center border border-red-500 drop-shadow-sm">Oops! No Data Found.</div>
                            </>}

                    </>}
            </div>

            {/* 👉 Dialog form 👈 */}
            <dialog ref={dialogRef} className={`relative overflow-clip animate__animated animate__zoomIn animate__faster ${(modalType != 'delete' && mType == 'violation') && ' w-[90vw] md:max-w-[1080px]'}`}>

                {/* 👉 Cross button 👈 */}
                {modalType != 'assign' && modalType != 'delete' && <span onClick={() => (dialogRef.current.close(), formik.resetForm())} className="block p-1 bg-red-100 hover:bg-red-500 rounded-full hover:text-white cursor-pointer transition-all duration-200 absolute top-2 right-2"><RxCross2 /></span>}

                {/* 👉 Form 👈 */}
                {modalType != 'assign' && modalType != 'delete' && <form onChange={(e) => (formik.handleChange(e), handleChange(e))} onSubmit={formik.handleSubmit} className="p-4 px-8 py-6 shadow-lg">
                    <section className='flex gap-4 flex-wrap'>

                        <header className='w-full font-semibold text-xl capitalize text-sky-700 border-b pb-1 text-center'>{modalType} {mType}</header>

                        {
                            basicForm?.map((elem) => {
                                return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, elem?.options, elem?.okey, elem?.ovalue)
                            })
                        }

                        {formik.values?.violationMade != '' && <div className='flex flex-wrap gap-2 text-sm w-full'>

                            <span className='block w-full md:w-[15%]'>Violation Name :</span>
                            {formik.values?.violationMade}<span className="animate-ping">|</span>

                        </div>}

                    </section>

                    <footer className="mt-4 flex justify-center">
                        <button type="submit" className={buttonStyle('green')}>{modalType == 'add' && 'Add'}{modalType == 'edit' && 'Update'}</button>
                    </footer>

                </form>}

            </dialog>

        </>
    );
}
export default CitizenViolationList;