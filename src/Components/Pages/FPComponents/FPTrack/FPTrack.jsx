import React, { useContext, useState } from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom';
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';
import { contextVar } from '@/Components/context/contextVar';
import ProjectApiList from '@/Components/api/ProjectApiList';

const FPTrack = () => {
    const [grievanceData, setGrievanceData] = useState()
    const [message, setMessage] = useState()
    const [list, setList] = useState(false)

    const navigate = useNavigate()

    const { api_FPTrack } = ProjectApiList();

    const { notify } = useContext(contextVar)

    // formik Start

    const validationSchema = yup.object({
        // searchBy: yup.string().required('Require'),
        // trackNo: yup.string().required('Require'),
        // mobile: yup.string().required('Require'),
    })
    const initialValues = {
        // searchBy: '',
        trackNo: '',
        mobile: '',
    }
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        onSubmit: (values, resetForm) => {
            console.log("Value.....", values)
            submitForm(values)
        },
        validationSchema
    })

    const handleChange = (event) => {
        let name = event.target.name
        let value = event.target.value

    };



    // formik END


    const submitForm = (data) => {

        if (data?.trackNo == '' && data?.mobile == '') {
            // notify("You haven't enter any details to search", info)
            return;
        }

        AxiosInterceptors?.post(api_FPTrack, { "applicationNo": data.trackNo, "mobileNo": data.mobile })
            .then((res) => {

                setList(res?.data?.status)

                if (res.data.status) {
                    setGrievanceData(res.data.data)
                    console.log("Grievance Details..", res.data.data)
                    notify('Grievance Details Fetched', 'success')
                } else {
                    console.log("Failed to get Grievance details", res)
                    notify('Failed to get Grievance details', 'error')
                }
            })
            .catch((err) => {
                notify('Error Failed to get Grievance details', 'error')
                console.log("Error Failed to get Grievance details", err)
                setList(false)
            })
    }

    return (
        <>
            <div className='w-full flex justify-center gap-x-8 items-center p-4 md:p-6 transition-all duration-200'>

                <aside className='md:w-[20vw] w-full bg-slate-50 shadow-md h-max'>
                    <div className="flex justify-center mt-5 p-4">
                        <p className="font-semibold text-xl text-gray-600 text-center border-b-2  pb-2"> Track Your Fine & Penalty </p>
                    </div>
                    <form onSubmit={formik.handleSubmit} onChange={handleChange} >
                        <div className=" space-y-5  rounded-md px-8 pb-6  ">

                            <div>
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                                    Application Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="trackNo"
                                    onChange={formik.handleChange}
                                    className=" w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                                />
                                <p className="text-red-500 text-xs">
                                    {formik.touched.trackNo && formik.errors.trackNo ? formik.errors.trackNo : null}
                                </p>
                            </div>
                            <div className='text-sm font-semibold text-gray-700 text-center'>OR</div>
                            <div>
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="mobile"
                                    onChange={formik.handleChange}
                                    className=" w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md"
                                />
                                <p className="text-red-500 text-xs">
                                    {formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : null}
                                </p>
                            </div>


                            <div className="mt-4 flex justify-center items-center gap-x-3">
                                <button type='button' onClick={() => navigate(-1)} className='bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-1'>Back</button>
                                <button
                                    type="submit"
                                    className=" bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1"
                                >
                                    Track
                                </button>
                            </div>
                        </div>
                    </form>
                </aside>

                <aside className={`${list ? 'w-[60vw]' : 'w-[0vw]'} overflow-clip transition-all duration-300 h-full`}>
                    <div className='border bg-slate-50 items-center m-auto justify-between p-5 w-full rounded-sm shadow-sm space-y-5'>
                        <div className='flex justify-evenly border-b pb-2'>
                            <p>Register Date : <span className='text-indigo-600 font-semibold'>{grievanceData?.apply_date}</span></p>
                            <p>Application No : <span className='text-indigo-600 font-semibold'>{grievanceData?.application_no}</span></p>
                            <p>Status : <span className='text-green-600 font-semibold'>Active</span></p>
                        </div>

                        <div className='grid grid-cols-3'>
                            <div className='my-2'>
                                <p>Name</p>
                                <p className='text-lg font-semibold text-gray-800'>{grievanceData?.applicant_name}</p>
                            </div>
                            <div className='my-2'>
                                <p>Phone</p>
                                <p className='text-lg font-semibold text-gray-800'>{grievanceData?.mobile_no}</p>
                            </div>
                            <div className='my-2'>
                                <p>Email</p>
                                <p className='text-lg font-semibold text-gray-800'>{grievanceData?.email}</p>
                            </div>
                            <div className='my-2'>
                                <p>District</p>
                                <p className='text-lg font-semibold text-gray-800'>Ranchi</p>
                            </div>
                            <div className='my-2'>
                                <p>ULB</p>
                                <p className='text-lg font-semibold text-gray-800'>Ranchi Municipal Corporation</p>
                            </div>
                            <div className='my-2'>
                                <p>Ward</p>
                                <p className='text-lg font-semibold text-gray-800'>{grievanceData?.ward_id}</p>
                            </div>
                        </div>
                        <div className=''>
                            <p className='font-semibold my-2'>Your Grievance</p>
                            {grievanceData?.description}
                        </div>
                        <div className=''>
                            <p className='font-semibold my-2'>Other Information</p>
                            {grievanceData?.other_info || "N/A"}
                        </div>
                    </div>
                </aside>

            </div>
        </>
    )
}

export default FPTrack