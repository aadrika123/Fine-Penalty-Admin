import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast';
import './login.css'
import { RotatingLines } from "react-loader-spinner";
import ProjectApiList from '@/Components/api/ProjectApiList';
import ApiHeader from '@/Components/api/ApiHeader';
import img from '@/Components/assets/img.svg'
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
                          {
                            name: 'Reports',              path: '',                   children: [
                              { name: 'Challan Generated Report', path: '/challan-generated-report' },
                              { name: 'Violation Wise Report',     path: '/violation-wise-report'     },
                              { name: 'Collection Report',         path: '/collection-report'         }
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

            <header className=" h-[10vh] border-b border-gray-200 bg-white darks:bg-gray-800 darks:border-gray-800">
                <div className="container mx-auto xl:max-w-6xl ">
                    {/* Navbar */}
                    <nav className="flex flex-row flex-nowrap items-center justify-between mt-0 py-4 px-6" id="desktop-menu">
                        {/* logo */}
                        <a className="flex items-center py-2 ltr:mr-4 rtl:ml-4 text-xl" href="../index.html">
                            <div className='flex gap-2'> <span className='w-7'><img src={ulb_data()?.ulb_logo} alt="" srcset="" /></span> <span className="font-bold text-xl">Ranchi Nagar Nigam, Ranchi</span></div>
                        </a>
                        {/* menu */}
                        <ul className="flex ltr:ml-auto rtl:mr-auto mt-2">
                            {/* Customizer (Only for demo purpose) */}
                            <li x-data="{ open: false }" className="relative">
                                <a href="javascript:;" className="py-3 px-4 flex text-sm rounded-full focus:outline-none" aria-controls="mobile-canvas" aria-expanded="false" >
                                    <span className="sr-only">Customizer</span>
                                    <svg className="block h-6 w-6" xmlnsXlink="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                                    </svg>
                                    {/* <i class="text-2xl fas fa-cog"></i> */}
                                </a>
                                {/* Right Offcanvas */}
                                <div className="fixed w-full h-full inset-0 z-50" id="mobile-canvas" xDescription="Mobile menu" x-show="open" style={{ display: 'none' }}>
                                    {/* bg open */}
                                    <span className="fixed bg-gray-900 bg-opacity-70 w-full h-full inset-x-0 top-0" />
                                    <nav id="mobile-nav" className="flex flex-col ltr:right-0 rtl:left-0 w-72 fixed top-0 bg-white darks:bg-gray-800 h-full overflow-auto z-40 scrollbars show" >
                                        <div className="p-6 bg-indigo-500 text-gray-100 border-b border-gray-200 darks:border-gray-700">
                                            <div className="flex flex-row justify-between">
                                                <h3 className="text-md font-bold">Customizer</h3>
                                                <button type="button" className="inline-block w-4 h-4">
                                                    <svg xmlnsXlink="http://www.w3.org/2000/svg" fill="currentColor" className="inline-block text-gray-100 bi bi-x-lg" viewBox="0 0 16 16" id="x-lg"><path d="M1.293 1.293a1 1 0 011.414 0L8 6.586l5.293-5.293a1 1 0 111.414 1.414L9.414 8l5.293 5.293a1 1 0 01-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 01-1.414-1.414L6.586 8 1.293 2.707a1 1 0 010-1.414z" /></svg>
                                                    {/* <i class="fas fa-times"></i> */}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="py-3 px-6 border-b border-gray-200 darks:border-gray-700">
                                            <p className="text-base text-semibold">Color Scheme</p>
                                            <div className="flex flex-row">
                                                <div className="relative inline-block w-8 py-3 mt-0.5 ltr:mr-3 rtl:ml-3 align-middle select-none transition duration-200 ease-in">
                                                    <input type="checkbox" name="lightdark" id="lightdark" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white darks:bg-gray-900 border-2 darks:border-gray-700 appearance-none cursor-pointer" />
                                                    <label htmlFor="lightdark" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 darks:bg-gray-700 cursor-pointer" />
                                                </div>
                                                <p className="text-sm text-gray-500 self-center">Light and Dark</p>
                                            </div>
                                        </div>
                                        <div className="py-3 px-6 border-b border-gray-200 darks:border-gray-700">
                                            <p className="text-base text-semibold">Sidebar Color</p>
                                            <div className="flex flex-row">
                                                <div className="relative inline-block w-8 py-3 mt-0.5 ltr:mr-3 rtl:ml-3 align-middle select-none transition duration-200 ease-in">
                                                    <input type="checkbox" name="sidecolor" id="sidecolor" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white darks:bg-gray-900 border-2 darks:border-gray-700 appearance-none cursor-pointer" />
                                                    <label htmlFor="sidecolor" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 darks:bg-gray-700 cursor-pointer" />
                                                </div>
                                                <p className="text-sm text-gray-500 self-center">Light and Dark</p>
                                            </div>
                                        </div>
                                        <div className="py-3 px-6 border-b border-gray-200 darks:border-gray-700">
                                            <p className="text-base text-semibold">Direction</p>
                                            <div className="flex flex-row">
                                                <div className="relative inline-block w-8 py-3 mt-0.5 ltr:mr-3 rtl:ml-3 align-middle select-none transition duration-200 ease-in">
                                                    <input type="checkbox" name="rtlmode" id="rtlmode" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white darks:bg-gray-900 border-2 darks:border-gray-700 appearance-none cursor-pointer" />
                                                    <label htmlFor="rtlmode" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 darks:bg-gray-700 cursor-pointer" />
                                                </div>
                                                <p className="text-sm text-gray-500 self-center">LTR and RTL</p>
                                            </div>
                                        </div>
                                        <div className="py-3 px-6 border-b border-gray-200 darks:border-gray-700">
                                            <p className="text-base text-semibold">Layout</p>
                                            <div className="relative mb-3">
                                                <a href="../index.html" className="inline-block py-2 px-2.5 mt-2 rounded text-sm text-gray-500 bg-gray-100 darks:bg-gray-900 darks:bg-opacity-20 darks:hover:bg-opacity-60 hover:text-indigo-500 hover:bg-gray-200 self-center">Default</a>
                                                <a href="../layout-compact.html" className="inline-block py-2 px-2.5 mt-2 rounded text-sm text-gray-500 bg-gray-100 darks:bg-gray-900 darks:bg-opacity-20 darks:hover:bg-opacity-60 hover:text-indigo-500 hover:bg-gray-200 self-center">Compact</a>
                                                <a href="../layout-topnav.html" className="inline-block py-2 px-2.5 mt-2 rounded text-sm text-gray-500 bg-gray-100 darks:bg-gray-900 darks:bg-opacity-20 darks:hover:bg-opacity-60 hover:text-indigo-500 hover:bg-gray-200 self-center">Topnav</a>
                                            </div>
                                        </div>
                                        <div id="customcolor" className="py-3 px-6 border-b border-gray-200 darks:border-gray-700">
                                            <p className="text-base text-semibold">Primary Color</p>
                                            <div className="relative my-3">
                                                <div id="custred" title="red" className="inline-block p-3 ltr:mr-1.5 rtl:ml-1.5 bg-red-500 hover:opacity-90 rounded-full cursor-pointer" />
                                                <div id="custyellow" title="yellow" className="inline-block p-3 ltr:mr-1.5 rtl:ml-1.5 bg-yellow-500 hover:opacity-90 rounded-full cursor-pointer" />
                                                <div id="custgreen" title="green" className="inline-block p-3 ltr:mr-1.5 rtl:ml-1.5 bg-green-500 hover:opacity-90 rounded-full cursor-pointer" />
                                                <div id="custblue" title="blue" className="inline-block p-3 ltr:mr-1.5 rtl:ml-1.5 bg-blue-500 hover:opacity-90 rounded-full cursor-pointer" />
                                                <div id="custpurple" title="purple" className="inline-block p-3 ltr:mr-1.5 rtl:ml-1.5 bg-purple-500 hover:opacity-90 rounded-full cursor-pointer" />
                                                <div id="custpink" title="pink" className="inline-block p-3 ltr:mr-1.5 rtl:ml-1.5 bg-pink-500 hover:opacity-90 rounded-full cursor-pointer" />
                                                <div id="custindigo" title="reset color" className="inline-block cursor-pointer">
                                                    <svg xmlnsXlink="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
                                                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
                                                    </svg></div>
                                            </div>
                                        </div>
                                        <div className="pt-6 px-6">
                                            <div x-data="{ open: true }" x-show="open" className="flex justify-between items-center relative bg-yellow-100 text-yellow-900 p-3 rounded-lg mb-4">
                                                <div>
                                                    How to apply? please read the documentation on <a href="../docs/customize.html" className="underline font-semibold">Customize page</a>
                                                </div>
                                                <button type="button" >
                                                    <span className="text-2xl">×</span>
                                                    {/* <i class="fas fa-times"></i> */}
                                                </button>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </li>{/* End Customizer (Only for demo purpose) */}
                            <li className="relative">
                                <a href="#" className="py-3 px-4 flex hover:text-indigo-500 focus:outline-none">
                                    <div className="relative inline-block">Login</div>
                                </a>
                            </li>
                            <li className="relative">
                                <a href="#" className="py-3 px-4 flex hover:text-indigo-500 focus:outline-none">
                                    <div className="relative inline-block">Register</div>
                                </a>
                            </li>
                        </ul>
                    </nav>

                </div>
            </header>
            <main className='h-[80vh] bg-gray-100 flex justify-center items-center'>
                <div className="py-8 md:py-12 bg-gray-100 darks:bg-gray-900 darks:bg-opacity-40">
                    <div className="container mx-auto px-4 xl:max-w-6xl">
                        <div className="flex flex-wrap -mx-4 flex-row">
                            <div className="flex-shrink max-w-full px-4 w-full lg:w-1/2">
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
                                                {/* <div className="mb-6">
                                                        <input className="form-checkbox h-5 w-5 text-indigo-500 darks:bg-gray-700 border border-gray-300 darks:border-gray-700 rounded focus:outline-none" type="checkbox" defaultValue id="remember" />
                                                        <label className="" htmlFor="remember">
                                                            Remember me
                                                        </label>
                                                    </div> */}
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
                                                    {/* <span className='text-gray-700 text-sm font-semibold cursor-pointer w-full text-center' onClick={() => setchange(true)}>Change Password</span> */}
                                                </div>
                                                {/* <p className="text-center mb-2">Don't have an account? <a className="hover:text-indigo-500" href="#">Register</a></p> */}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink max-w-full px-4 w-full lg:w-1/2">
                                <div className="text-center mt-6 lg:mt-0">

                                    <img src={img} alt="welcome" className="max-w-full h-auto mx-auto" />
                                    <div className="px-4 mt-12">
                                        <h1 className="text-bold text-4xl mb-2">Serve Citizen Services with Ease of Access</h1>
                                        <p className="text-lg mb-4 text-gray-500">Manage citizen government services with easy of access and serve them in no time. </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className=" h-[10vh] bg-white py-6 border-t border-gray-200 darks:bg-gray-800 darks:border-gray-800">
                <div className="container mx-auto px-4 xl:max-w-6xl ">
                    <div className="mx-auto px-4">
                        <div className="flex flex-wrap flex-row -mx-4">
                            <div className="flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:ltr:text-left md:rtl:text-right">
                                {/* <ul className="ltr:pl-0 rtl:pr-0">
                                        <li className="inline-block ltr:mr-3 rtl:ml-3">
                                            <a className="hover:text-indigo-500" href="#">Support</a>
                                        </li>
                                        <li className="inline-block ltr:mr-3 rtl:ml-3">
                                            <a className="hover:text-indigo-500" href="#">Help Center</a>
                                        </li>
                                        <li className="inline-block ltr:mr-3 rtl:ml-3">
                                            <a className="hover:text-indigo-500" href="#">Privacy</a>
                                        </li>
                                        <li className="inline-block ltr:mr-3 rtl:ml-3">
                                            <a className="hover:text-indigo-500" href="#">Terms of Service</a>
                                        </li>
                                    </ul> */}
                            </div>
                            <div className="flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:ltr:text-right md:rtl:text-left">
                                {/* <p className="mb-0 mt-3 md:mt-0">
                                        <a href="#" className="hover:text-indigo-500">{`${ulb_data().ulb_name}`}</a> | All right reserved
                                    </p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    )
}

export default Login;