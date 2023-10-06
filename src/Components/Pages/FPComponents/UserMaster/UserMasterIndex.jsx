///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : UserMaster
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

const UserMaster = () => {

    // 👉 To Set Title 👈
    useSetTitle('Violation Master')

    // 👉 API constants 👈
    const {
        api_violationMasterList,
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
        api_getDepartmentList
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
    const [mType, setMType] = useState('department')

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

        switch (type) {
            case 'add': {

            } break;

            case 'edit': {
                setviolationData(data)

                if (mType == 'department') {
                    formik.setFieldValue('department', data?.department_name)
                }
                if (mType == 'section') {
                    formik.setFieldValue('violationSection', data?.violation_section)
                    formik.setFieldValue('department', data?.department_id)
                }
                if (mType == 'violation') {
                    formik.setFieldValue('violationName', data?.violation_name)
                    formik.setFieldValue('violationSection', data?.violation_section_id)
                    formik.setFieldValue('department', data?.department_id)
                    formik.setFieldValue('penaltyAmount', data?.penalty_amount)
                }

            } break;

            case 'delete': {
                setvId(data)
            } break;
        }

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
            Cell: ({ cell }) => (nullToNA(cell.row.original?.department_name)),
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

    const SCOLUMNS = [
        {
            Header: "#",
            Cell: ({ row }) => <div className="pr-2">{row?.index + 1}</div>,
        },
        {
            Header: "Department",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.department_name)),
        },
        {
            Header: "Violation Section",
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
            Header: "Department",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.department_name)),
        },
        {
            Header: "Violation Section",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_section)),
        },
        {
            Header: "Violation Name",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_name)),
        },
        {
            Header: "Penalty Amount",
            Cell: ({ cell }) => (indianAmount(cell.row.original?.penalty_amount)),
        },
        {
            Header: "On Spot",
            Cell: ({ cell }) => <>
                {
                    (cell.row.original?.on_spot) ?
                        <span className="text-green-400 font-semibold">Yes</span>
                        :
                        <span className="text-red-400 font-semibold">No</span>
                }
            </>,
        },
        {
            Header: "Created By",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.created_by)),
        },
        {
            Header: "Created At",
            Cell: ({ cell }) => (indianDate(cell.row.original?.date)),
            className: ' w-[7%] '
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
            type: (mType == 'section' ? 'text' : 'select'),
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
            url = api_violationMasterList
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

    // 👉 Function 5 👈
    const submitFun = (values) => {

        setLoader2(true)

        dialogRef.current.close()

        console.log(modalType, values)

        let payload;
        let url;

        switch (modalType) {
            case 'add': {

                if (mType == 'department') {
                    payload = {
                        departmentName: values?.department
                    }
                    url = api_addDepartment
                }
                if (mType == 'section') {
                    payload = {
                        violationSection: values?.violationSection,
                        departmentId: values?.department
                    }
                    url = api_addSection
                }
                if (mType == 'violation') {
                    payload = {
                        violationName: values?.violationMade,
                        sectionId: values?.violationSection,
                        penaltyAmount: values?.penaltyAmount,
                        departmentId: values?.department
                    }
                    url = api_addViolation
                }

            } break;

            case 'edit': {

                if (mType == 'department') {
                    payload = {
                        id: violationData?.id,
                        departmentName: values?.department
                    }
                    url = api_updateDepartment
                }
                if (mType == 'section') {
                    payload = {
                        id: violationData?.id,
                        violationSection: values?.violationSection,
                        department: values?.department
                    }
                    url = api_updateSection
                }
                if (mType == 'violation') {
                    payload = {
                        id: violationData?.id,
                        violationName: values?.violationMade,
                        violationSection: values?.violationSection,
                        penaltyAmount: values?.penaltyAmount,
                        department: values?.department
                    }
                    url = api_updateViolation
                }

            } break;

            case 'delete': {

                if (mType == 'department') {
                    url = api_deleteDepartment
                    payload = {
                        departmentId: vId
                    }
                }
                if (mType == 'section') {
                    url = api_deleteSection
                    payload = {
                        sectionId: vId
                    }
                }
                if (mType == 'violation') {
                    url = api_deleteViolation
                    payload = {
                        id: vId
                    }
                }

            } break;
        }

        AxiosInterceptors
            .post(url, payload, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    toast.success(res?.data?.message)
                    getViolationList()
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
                console.log('fp violation response => ', res)
            })
            .catch((err) => {
                activateBottomErrorCard(true, 'Server Error! Please try again later.')
                console.log('error violation list => ', err)
            })
            .finally(() => {
                setLoader2(false)
                formik.resetForm()
            })
    }

    const getDepartmentList = () => {

        setsLoader(true)

        AxiosInterceptors
            .post(api_getDepartmentList, {}, ApiHeader())
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

    // const getViolationNameList = (value) => {

    //     setsLoader(true)

    //     let payload = {
    //         sectionId: value,
    //         departmentId: formik.values.department
    //     }

    //     AxiosInterceptors
    //         .post(api_violationMasterList, {}, ApiHeader())
    //         .then((res) => {
    //             if (res?.data?.status) {
    //                 setViolationList(res?.data?.data)
    //             } else {
    //             }
    //             console.log('fp violation list response => ', res)
    //         })
    //         .catch((err) => {
    //             console.log('error fp violation list => ', err)
    //         })
    //         .finally(() => {
    //             setsLoader(false)
    //         })
    // }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        console.log(name)

        // if (name == 'violationSection') {
        //     getViolationNameList(value)
        // }

        if (name == 'department') {
            getViolationSectionList(value)
        }
    }

    // 👉 To call Function 3 👈
    useEffect(() => {
        mType != 'department' && getDepartmentList()
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
                    Violation   Master
                </div>

                <div className="w-full h-[0.15rem] bg-gray-400 mb-6"></div>

                <div className="flex gap-1 w-full flex-wrap my-6">
                    <button onClick={() => setMType('roles')} className={tabButtonStyle(mType == 'department')}>Role Master</button>
                    <button onClick={() => setMType('users')} className={tabButtonStyle(mType == 'section')}>User Master</button>
                    <button onClick={() => setMType('violation')} className={tabButtonStyle(mType == 'violation')}>Violation Master</button>
                </div>


                {/* 👉 Table Loader 👈 */}
                {loader && <ShimmerEffectInline />}

                {/* 👉 Table 👈 */}
                {!loader &&
                    <>
                        {violationDataList?.length > 0 ?

                            <>
                                <button onClick={() => handleModal('add')} className={addButton + 'capitalize flex gap-1 items-center'} >
                                    <CgPlayListAdd /> Add <span className="capitalize">{mType}</span>
                                </button>

                                {
                                    mType == 'department' &&
                                    <ListTable
                                        columns={DCOLUMNS}
                                        dataList={violationDataList}
                                    />
                                }
                                {
                                    mType == 'section' &&
                                    <ListTable
                                        columns={SCOLUMNS}
                                        dataList={violationDataList}
                                    />
                                }
                                {
                                    mType == 'violation' &&
                                    <ListTable
                                        columns={VCOLUMNS}
                                        dataList={violationDataList}
                                    />
                                }


                            </>
                            :
                            <>
                                <div className="flex justify-end mb-2">
                                    <button
                                        onClick={() => handleModal('add')}
                                        className={addButton + 'capitalize flex gap-1 items-center'}
                                    >
                                        <CgPlayListAdd /> Add <span className="capitalize">{mType}</span>
                                    </button>
                                </div>
                                <div className="bg-red-100 text-red-500 py-2 text-lg font-semibold text-center border border-red-500 drop-shadow-sm">Oops! No Data Found.</div>
                            </>}

                    </>}
            </div>

            {/* 👉 Dialog form 👈 */}
            <dialog ref={dialogRef} className={`relative overflow-clip animate__animated animate__zoomIn animate__faster ${(modalType != 'delete' && mType == 'violation') && ' w-[90vw] md:max-w-[1080px]'}`}>

                {/* 👉 Cross button 👈 */}
                {modalType != 'delete' && <span onClick={() => (dialogRef.current.close(), formik.resetForm())} className="block p-1 bg-red-100 hover:bg-red-500 rounded-full hover:text-white cursor-pointer transition-all duration-200 absolute top-2 right-2"><RxCross2 /></span>}

                {/* 👉 Form 👈 */}
                {modalType != 'delete' && <form onChange={(e) => (formik.handleChange(e), handleChange(e))} onSubmit={formik.handleSubmit} className="p-4 px-8 py-6 shadow-lg">
                    <section className='flex gap-4 flex-wrap'>

                        <header className='w-full font-semibold text-xl capitalize text-sky-700 border-b pb-1 text-center'>{modalType} {mType}</header>

                        {
                            basicForm?.map((elem) => {
                                return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, elem?.options, elem?.okey, elem?.ovalue)
                            })
                        }

                    </section>

                    <footer className="mt-4 flex justify-center">
                        <button type="submit" className={buttonStyle('green')}>{modalType == 'add' && 'Add'}{modalType == 'edit' && 'Update'}</button>
                    </footer>

                </form>}

                {/* 👉 Delete Box 👈 */}
                {
                    modalType == 'delete' &&
                    <>
                        <div className=' z-50 px-6 py-4 flex flex-col gap-4 '>
                            <div className='flex items-center gap-6'>
                                <span className='text-red-500 bg-red-100 p-2 block rounded-full drop-shadow-md shadow-red-300'><FiAlertCircle size={25} /></span>
                                <div className='flex flex-col gap-2'>
                                    <span className='text-xl font-semibold border-b pb-1'>Confirmation Box</span>
                                    <span className='text-base'>Are you sure want to delete ?</span>
                                </div>
                            </div>
                            <div className='flex justify-end gap-2'>
                                <button className='text-white bg-slate-400 hover:bg-slate-500 px-4 py-1 text-sm ' onClick={() => dialogRef.current.close()}>No</button>
                                <button className='text-white bg-red-500 hover:bg-red-600 px-4 py-1 text-sm ' onClick={() => submitFun()}>Yes</button>
                            </div>
                        </div>
                    </>
                }

            </dialog>

        </>
    );
}
export default UserMaster;