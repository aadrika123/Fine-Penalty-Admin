import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast';
import './login.css'
import { RotatingLines } from "react-loader-spinner";
import ProjectApiList from '@/Components/api/ProjectApiList';
import ApiHeader from '@/Components/api/ApiHeader';
import img from '@/Components/assets/fp.png'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';
import { getLocalStorageItem, setLocalStorageItem, setLocalStorageItemStrigified } from '@/Components/Common/localstorage';
import ulb_data from '@/Components/Common/DynamicData';
import { checkErrorMessage } from '@/Components/Common/PowerupFunctions';
import { contextVar } from '@/Components/context/contextVar';

const { api_login, api_getFreeMenuList } = ProjectApiList()

const validationSchema = Yup.object({
    username: Yup.string().required('Enter Username'),
    password: Yup.string().required('Enter Password')
})

function Login() {

    const { setmenuList, setuserDetails, setheartBeatCounter } = useContext(contextVar)
    const [loaderStatus, setLoaderStatus] = useState(false)

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: values => {
            authUser()
        },
        validationSchema
    })

    const navigate = useNavigate()

    useEffect(() => {
        (getLocalStorageItem('token') != 'null' && getLocalStorageItem('token') != null) && navigate('/home')
    }, [])

    const header = {
        headers:
        {
            Accept: 'application/json',
        }
    }

    //authUser function which authenticate user credentials
    const authUser = (e) => {
        setLoaderStatus(true)
        let requestBody = {
            email: formik.values.username,
            password: formik.values.password
        }
        console.log('--1--before login send...', requestBody)
        AxiosInterceptors.post(api_login, requestBody, header)
            .then(function (response) {
                console.log("message check login ", response.data)
                // return
                if (response.data.status == true) {
                    setLocalStorageItem('token', response?.data?.data?.token)
                    setLocalStorageItemStrigified('userDetails', response?.data?.data?.userDetails)

                    if( response?.data?.data?.userDetails?.user_type == 'CO') {
                        setLocalStorageItemStrigified('menuList', [
                          { name: 'Home',                 path: '/home',              children: [] },
                          { name: 'Application List',     path: '/fp-list',           children: [] },
                          { name: 'Search Challan',       path: '/search-challan',    children: [] },
                          { name: 'Workflow',             path: '/fp-workflow',       children: [] },
                        ])
                      }
                      if( response?.data?.data?.userDetails?.user_type == 'EC') {
                        setLocalStorageItemStrigified('menuList', [
                          { name: 'Home',                 path: '/home',              children: [] },
                          { name: 'Application List',     path: '/fp-list',           children: [] },
                          { name: 'Search Challan',       path: '/search-challan',    children: [] },
                          { name: 'Violation Master',     path: '/violation-master',  children: [] },
                          {
                            name: 'Reports',              path: '',                   children: [
                              { name: 'Challan Generated Report', path: '/challan-generated-report' },
                              { name: 'Violation Wise Report',     path: '/violation-wise-report'     },
                              { name: 'Collection Report',         path: '/collection-report'         },
                              { name: 'Comparision Report',         path: '/comparision-report'         }
                            ]
                          },
                        ])
                      }
                      if( response?.data?.data?.userDetails?.user_type == 'JSK') {
                          setLocalStorageItemStrigified('menuList', [
                            { name: 'Home',                 path: '/home',              children: [] },
                            { name: 'Application List',     path: '/fp-list',           children: [] },
                            { name: 'Search Challan',       path: '/search-challan',    children: [] },
                          ])
                      }

                    fetchMenuList()
                    setheartBeatCounter(prev => prev + 1)
                    navigate('/home') //navigate to home page after login

                    toast.success("Login Successfull")

                }
                else {
                    console.log('false...')
                    setLoaderStatus(false)
                    toast.error(response?.data?.message)
                }
            })
            .catch(function (error) {
                setLoaderStatus(false)
                console.log('--2--login error...', error)
                toast.error('Server Error')
            })

    }

    // 3 CHANGE FOR SINGLE AUTH
    const fetchMenuList = () => {
        let requestBody = {
            moduleId: 10
        }
        console.log("request body", requestBody)

        AxiosInterceptors.post(api_getFreeMenuList, requestBody, ApiHeader())
            .then(function (response) {
                console.log('fetched menu list.....', response?.data?.data?.userDetails?.roles)
                // return
                if (response.data.status == true) {
                    // setLocalStorageItemStrigified('menuList', response?.data?.data?.permission)
                    // setLocalStorageItemStrigified('userDetails', response?.data?.data?.userDetails)

                    setmenuList(response?.data?.data?.permission)
                    setuserDetails(response?.data?.data?.userDetails)

                } else {
                    console.log('false menu list => ', response?.data?.message)
                    setLoaderStatus(false)
                    seterrorMsg(checkErrorMessage(response.data.message))
                }
            })
            .catch(function (error) {
                setLoaderStatus(false)
                // seterroState(true)
                console.log('--2--login error...', error)
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
                                            <form onSubmit={formik.handleSubmit}>
                                                <div className="text-center">
                                                    <h1 className="text-2xl leading-normal mb-3 font-bold text-gray-800 darks:text-gray-300 text-center">Welcome Back</h1>
                                                </div>
                                                <hr className="block w-12 h-0.5 mx-auto my-5 bg-gray-700 border-gray-700" />
                                                <div className="mb-6">
                                                    <label htmlFor="inputemail" className="inline-block mb-2">Username</label>
                                                    <input {...formik.getFieldProps('username')} className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 darks:text-gray-300 darks:bg-gray-700 darks:border-gray-700 darks:focus:border-gray-600" defaultValue aria-label="email" type="email" required />
                                                    <span className='text-red-600 text-xs'>{formik.touched.username && formik.errors.username ? formik.errors.username : null}</span>
                                                </div>
                                                <div className="mb-6">
                                                    <div className="flex flex-wrap flex-row">
                                                        <div className="flex-shrink max-w-full w-1/2">
                                                            <label htmlFor="inputpass" className="inline-block mb-2">Password</label>
                                                        </div>
                                                    </div>
                                                    <input {...formik.getFieldProps('password')} className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 darks:text-gray-300 darks:bg-gray-700 darks:border-gray-700 darks:focus:border-gray-600" aria-label="password" type="password" defaultValue required />
                                                    <span className='text-red-600 text-xs'>{formik.touched.password && formik.errors.password ? formik.errors.password : null}</span>
                                                </div>
                                                <div className="grid">
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
                                                            <svg xmlnsXlink="http://www.w3.org/2000/svg" fill="currentColor" className="inline-block w-4 h-4 ltr:mr-2 rtl:ml-2 bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                                                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
                                                                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                                            </svg>Login
                                                        </button>
                                                    }

                                                </div>
                                            </form>
                                            {/* =========buttons for change and reset password========= */}
                                            <div className="my-4">
                                                <div className='flex flex-col items-center justify-center flex-wrap gapx-x-2 gap-y-2 w-full poppins'>
                                                    <span className='text-gray-700 text-sm font-semibold cursor-pointer w-full text-center' onClick={() => setmobileCardStatus(true)}>Forgot Password</span>
                                                </div>
                                            </div>

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

export default Login;