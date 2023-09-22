///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : ViolationIndex
// 👉 Date        : 21-09-2023
// 👉 Status      : Close
// 👉 Description : CRUD opeartion for violation master.
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
import { checkErrorMessage, indianAmount, nullToNA } from "@/Components/Common/PowerupFunctions";
import ShimmerEffectInline from "@/Components/Common/Loaders/ShimmerEffectInline";
import BarLoader from "@/Components/Common/Loaders/BarLoader";
import BottomErrorCard from "@/Components/Common/BottomErrorCard";
import { RxCross2 } from "react-icons/rx";
import * as yup from 'yup'
import { useFormik } from "formik";
import { FiAlertCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

const ViolationIndex = () => {

    // 👉 To Set Title 👈
    useSetTitle('Violation Master')

    // 👉 API constants 👈
    const { api_violationMasterList, api_updateViolation, api_deleteViolation, api_addViolation } = ProjectApiList()

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

    // 👉 CSS constants 👈
    const editButton = "border border-sky-800 text-sky-800 mx-1 px-3 py-1 rounded-md shadow-lg hover:shadow-xl hover:bg-sky-800 hover:text-white"
    const deleteButton = "border border-red-300 text-red-400 mx-1 px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:bg-red-800 hover:text-white"
    const addButton = "float-right bg-[#1A4D8C] px-3 py-1 rounded-sm shadow-lg hover:shadow-xl hover:bg-[#113766] hover:text-white text-white flex items-center"
    const labelStyle = 'text-gray-800 text-sm'
    const inputStyle = 'border focus:outline-none drop-shadow-sm focus:drop-shadow-md px-4 py-1 text-gray-700 shadow-black placeholder:text-sm'
    const fileStyle = 'block w-full border focus:outline-none drop-shadow-sm focus:drop-shadow-md p-1 text-sm text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-sm file:border file:text-xs file:font-semibold file:bg-zinc-100 hover:file:bg-zinc-200'

    const buttonStyle = (color) => {
        return `px-4 py-1 text-sm bg-${color}-500 hover:bg-${color}-600 select-none rounded-sm hover:drop-shadow-md text-white`
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
                formik.setFieldValue('violationName', data?.violation_name)
                formik.setFieldValue('violationSection', data?.violation_section)
                formik.setFieldValue('penaltyAmount', data?.penalty_amount)
            } break;

            case 'delete': {
                setvId(data)
            } break;
        }

        dialogRef.current.showModal()
    }

    // 👉 Table Columns 👈
    const COLUMNS = [
        {
            Header: "#",
            Cell: ({ row }) => <div className="pr-2">{row?.index + 1}</div>,
        },
        {
            Header: "Violation Name",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_name)),
        },
        {
            Header: "Violation Section",
            Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_section)),
        },
        {
            Header: "Penalty Amount",
            Cell: ({ cell }) => (indianAmount(cell.row.original?.penalty_amount)),
        },
        {
            Header: "Action",
            accessor: "id",
            Cell: ({ cell }) => (
                <div className="flex flex-row flex-wrap gap-2">
                    <button
                        onClick={() => handleModal('edit', cell?.row?.original)}
                        className={editButton}
                    >
                        Edit
                    </button>

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
        { title: "Violation Name", key: "violationName", type: 'text', hint: "Enter violation name", required: true },
        { title: "Violation Section", key: "violationSection", type: 'text', hint: "Enter violation section", required: true },
        { title: "Penalty Amount", key: "penaltyAmount", type: 'number', hint: "Enter penalty Amount", required: true },
    ]

    // 👉 Formik validation schema 👈
    const schema = yup.object().shape(
        [...basicForm]?.reduce((acc, elem) => {
            if ((elem?.type != 'select' && elem?.type != 'option') && elem.required) {
                acc[elem.key] = yup.string().required(elem.hint);
            }
            if (elem?.type == 'select' || elem?.type == 'option') {
                if (elem?.check) {
                    acc[elem.key] = yup.string().when(elem?.check, {
                        is: (value) => value == '1',
                        then: () => elem?.required ? yup.string().required(elem?.hint) : yup.string()
                    });
                }
            }
            return acc;
        }, {})
    );

    // 👉 Formik initial values 👈
    const initialValues = {
        violationName: '',
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

        setLoader(true)

        AxiosInterceptors
            .post(api_violationMasterList, {}, ApiHeader())
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
    const inputBox = (key, title = '', type, width = '', hint = '', required = false, accept, options = []) => {
        return (
            <div className={`flex flex-col ${width} `}>
                {title != '' && <label htmlFor={key} className={labelStyle}>{title} {required && <span className='text-red-500 text-xs font-bold'>*</span>} : </label>}
                {type != 'select' && type != 'file' && <input {...formik.getFieldProps(key)} type={type} className={inputStyle + `${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`} name={key} id="" placeholder={hint} />}
                {type == 'file' && <input {...formik.getFieldProps(key)} type={type} className={fileStyle + `${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 text-red-400 file:border-red-200 file:text-red-400' : ' focus:border-zinc-300 border-zinc-200 file:border-zinc-300 file:text-gray-600'}`} name={key} id="" placeholder={hint} accept={accept} />}
                {type == 'select' && <select {...formik.getFieldProps(key)} className={inputStyle + `${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`}>
                    {
                        options?.map((elem) => <option value={elem?.value}>{elem?.title}</option>)
                    }
                </select>}
                {/* {(formik.touched[key] && formik.errors[key]) && <span className='text-xs text-red-500'>{formik.errors[key]}</span>} */}
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
                payload = {
                    violationName: values?.violationName,
                    violationSection: values?.violationSection,
                    penaltyAmount: values?.penaltyAmount
                }
                url = api_addViolation
            } break;

            case 'edit': {
                payload = {
                    id: violationData?.id,
                    violationName: values?.violationName,
                    violationSection: values?.violationSection,
                    penaltyAmount: values?.penaltyAmount
                }
                url = api_updateViolation
            } break;

            case 'delete': {
                payload = {
                    id: vId
                }
                url = api_deleteViolation
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

    // 👉 To call Function 3 👈
    useEffect(() => {
        getViolationList()
    }, [])


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

                {/* 👉 Table Loader 👈 */}
                {loader && <ShimmerEffectInline />}

                {/* 👉 Table 👈 */}
                {!loader &&
                    <>
                        {violationDataList?.length > 0 ?

                            <>
                                <ListTable
                                    columns={COLUMNS}
                                    dataList={violationDataList}
                                >
                                    <button
                                        onClick={() => handleModal('add')}
                                        className={addButton}
                                    >
                                        <CgPlayListAdd /> Add Violation
                                    </button>
                                </ListTable>
                            </>
                            :
                            <>
                                <div className="flex justify-end mb-2">
                                    <button
                                        onClick={() => handleModal('add')}
                                        className={addButton}
                                    >
                                        <CgPlayListAdd /> Add Violation
                                    </button>
                                </div>
                                <div className="bg-red-100 text-red-500 py-2 text-lg font-semibold text-center border border-red-500 drop-shadow-sm">Oops! No Data Found.</div>
                            </>}

                    </>}
            </div>

            {/* 👉 Dialog form 👈 */}
            <dialog ref={dialogRef} className="relative overflow-clip animate__animated animate__zoomIn animate__faster">

                {/* 👉 Cross button 👈 */}
                {modalType != 'delete' && <span onClick={() => (dialogRef.current.close(), formik.resetForm())} className="block p-1 bg-red-100 hover:bg-red-500 rounded-full hover:text-white cursor-pointer transition-all duration-200 absolute top-2 right-2"><RxCross2 /></span>}

                {/* 👉 Form 👈 */}
                {modalType != 'delete' && <form onChange={formik.handleChange} onSubmit={formik.handleSubmit} className="p-4 px-8 py-6 shadow-lg">
                    <section className='flex gap-4 flex-wrap'>

                        <header className='w-full font-semibold text-xl capitalize text-sky-700 border-b pb-1 text-center'>{modalType} Violation</header>

                        {
                            basicForm?.map((elem) => {
                                return inputBox(elem?.key, elem?.title, elem?.type, '', elem?.hint, elem?.required)
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
export default ViolationIndex;