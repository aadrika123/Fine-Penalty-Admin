import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast';
import './login.css'
import { RotatingLines } from "react-loader-spinner";
import ProjectApiList from '@/Components/api/ProjectApiList';
import img from '@/Components/assets/fp.png'
import { getLocalStorageItem } from '@/Components/Common/localstorage';
import ulb_data from '@/Components/Common/DynamicData';
import axios from 'axios';

function NewPassowd() {

    const { api_setPassword } = ProjectApiList()

    const { token, id } = useParams()

    const schema = Yup.object().shape({
        password: Yup.string()
            .min(6, "Minimum six character !")
            .max(50, "Too Long!")
            .required("Password required")
            .matches(
                /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                "Password Must Contains (Capital, Smail, Number, Special) eg - Abc123#."
            ),
        cpassword: Yup.string()
            .label("confirm password")
            .required()
            .oneOf([Yup.ref("password"), null], "Passwords must match"),
    })

    const [loaderStatus, setLoaderStatus] = useState(false)

    const formik = useFormik({
        initialValues: {
            password: '',
            cpassword: ''
        },
        validationSchema: schema,
        onSubmit: values => {
            submitFun(values)
        },
    })

    const navigate = useNavigate()

    const header = {
        timeout: 60000,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'Content-Type': "application/json",
            "API-KEY": "eff41ef6-d430-4887-aa55-9fcf46c72c99"
        },
    };

    //authUser function which authenticate user credentials
    const submitFun = (values) => {
        setLoaderStatus(true)
        let requestBody = {
            id: id,
            password: values?.password
        }
        console.log('--1--before login send...', requestBody)
        axios.post(api_setPassword, requestBody, header)
            .then(function (response) {
                console.log("set password response => ", response.data)
                // return
                if (response.data.status == true) {

                    toast.success("Password created successfully !!!")
                    navigate('/')

                }
                else {
                    console.log('false...')
                    setLoaderStatus(false)
                    toast.error(response?.data?.message)
                }
            })
            .catch(function (error) {
                setLoaderStatus(false)
                console.log('set password error => ', error)
                toast.error('Server Error')
            })

    }

    return (
        <>

            <header className=" border-b border-gray-200 bg-white darks:bg-gray-800 darks:border-gray-800">
                <div className="container mx-auto xl:max-w-6xl ">
                    {/* Navbar */}
                    <nav className="flex flex-row flex-nowrap items-center justify-center mt-0 py-4 px-6 " id="desktop-menu">
                        {/* logo */}
                        <a className="flex items-center py-2 ltr:mr-4 rtl:ml-4 text-xl cursor-default" >
                            <div className='flex gap-2'> <span className='w-7'><img src={ulb_data()?.ulb_logo} alt="" srcset="" /></span> <span className="font-bold text-xl">Ranchi Nagar Nigam, Ranchi</span></div>
                        </a>
                    </nav>

                </div>
            </header>
            <main className=' bg-gray-100 flex justify-center items-center md:h-[80vh]'>
                <div className="py-8 bg-gray-100 darks:bg-gray-900 darks:bg-opacity-40">
                    <div className="mx-auto px-4 ">
                        <div className="flex flex-wrap flex-row justify-center gap-2 items-center">

                            <div className=" px-4 w-full md:w-[30%]">
                                {/* login form */}
                                <div className="max-w-full w-full px-2 sm:px-12 lg:pr-20 mb-12 lg:mb-0">
                                    <div className="relative">
                                        <div className="p-6 sm:py-8 sm:px-12 rounded-lg bg-white darks:bg-gray-800 shadow-xl">
                                            <form onSubmit={formik.handleSubmit} onChange={formik.handleChange}>
                                                <div className="text-center">
                                                    <h1 className="text-2xl leading-normal mb-3 font-bold text-gray-800 darks:text-gray-300 text-center">Set Your New Password</h1>
                                                </div>
                                                <hr className="block w-12 h-0.5 mx-auto my-5 bg-gray-700 border-gray-700" />
                                                <div className="mb-6">
                                                    <label htmlFor="inputemail" className="inline-block mb-2">New Password <span className='font-semibold text-red-500'>*</span></label>
                                                    <input {...formik.getFieldProps('password')} className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 darks:text-gray-300 darks:bg-gray-700 darks:border-gray-700 darks:focus:border-gray-600" defaultValue aria-label="password" type="password" required />
                                                    <span className='text-red-600 text-xs'>{formik.touched.password && formik.errors.password ? formik.errors.password : null}</span>
                                                </div>
                                                <div className="mb-6">
                                                    <div className="flex flex-wrap flex-row">
                                                        <div className="flex-shrink max-w-full w-1/2">
                                                            <label htmlFor="inputpass" className="inline-block mb-2">Confirm Password <span className='font-semibold text-red-500'>*</span></label>
                                                        </div>
                                                    </div>
                                                    <input {...formik.getFieldProps('cpassword')} className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 darks:text-gray-300 darks:bg-gray-700 darks:border-gray-700 darks:focus:border-gray-600" aria-label="password" type="password" defaultValue required />
                                                    <span className='text-red-600 text-xs'>{formik.touched.cpassword && formik.errors.cpassword ? formik.errors.cpassword : null}</span>
                                                </div>
                                                <div className="grid mb-4">
                                                    {loaderStatus ?
                                                        <div className='flex justify-center'>
                                                            <RotatingLines
                                                                strokeColor="grey"
                                                                strokeWidth="5"
                                                                animationDuration="0.75"
                                                                width="25"
                                                                visible={true}
                                                            />
                                                        </div>
                                                        : <button type="submit" className="py-2 px-4 inline-block text-center rounded leading-normal text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0">
                                                            Set Password
                                                        </button>
                                                    }

                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 w-full md:w-[45%]">
                                <div className="text-center mt-6 lg:mt-0">

                                    <img src={img} alt="welcome" className="w-[60%] h-auto mx-auto hue-rotate-[90deg]" />
                                    <div className="px-4 mt-12">
                                        <h1 className="text-bold text-4xl mb-2">Fines & Penalties Admin Portal</h1>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            <footer className=" bg-white py-6 border-t border-gray-200 darks:bg-gray-800 darks:border-gray-800">
                <div className="container mx-auto px-4 xl:max-w-6xl ">
                    <div className="mx-auto px-4">
                        <div className="flex flex-wrap flex-row -mx-4">
                            <div className="flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:ltr:text-left md:rtl:text-right">
                            </div>
                            <div className="flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:ltr:text-right md:rtl:text-left">
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    )
}

export default NewPassowd;