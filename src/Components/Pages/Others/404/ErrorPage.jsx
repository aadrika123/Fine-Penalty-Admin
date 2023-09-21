import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ErrorPage.css'

const ErrorPage = () => {
    const navigate = useNavigate()
    return (
        <>
            <div class="wrap-error animate__animated animate__fadeIn animate__faster">
                <div class="d-flex align-items-center h-100">
                    <div class="h-screen">
                        <div class="row border w-full h-full flex justify-center pt-[20vh]">
                            <div class="col-sm-8 offset-sm-2 text-center text-white">
                                <h1 class="msg"><span>4</span><span>0</span><span>4</span></h1>
                                <h5 class=" text-xl">Oops! Page not found</h5>
                                <p class="mb-4 text-xl">We are sorry, but the page you requested was not found !</p>
                                <button class="btn btn-dark px-6 py-2 text-white border-2 border-gray-100 hover:border-2 hover:border-[#7387f6] hover:text-[#667bf2] hover:bg-white" onClick={() => navigate('/home')} title="Home URL">
                                    Go home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ErrorPage