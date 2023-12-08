import React, { useEffect, useState } from 'react'
import logo from '../../assets/stateLogo.png'
import {FaHome} from 'react-icons/fa'
import {IoPersonSharp} from 'react-icons/io5'
import {RiTeamFill} from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

const BrandingRmc = () => {

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const navigate = useNavigate()

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };

    const formattedDateTime = currentDateTime.toLocaleString('en-US', options);

    return (
        <>
            <div>

                <div className='bg-gradient-to-r from-[#546B9B] via-[#211A7F] to-[#546B9B] w-screen flex justify-between px-28 py-1'>
                    <span className='text-sm text-white'>Welcome Guest | <span className='cursor-pointer' onClick={() => navigate('/login')}>Official Login</span></span>
                    <span className='text-sm text-white'>{formattedDateTime}</span>
                </div>

                <div>
                    <div class="relative bg-gray-50 overflow-hidden flex">
                        <div class="absolute top-0 right-[47.8%] bottom-0 w-24 bg-gray-50 transform skew-x-[45deg]"></div>
                        <div className='bg-[#5C789F] w-1/2 flex py-2 px-10 gap-10 '>
                            <img src={logo} alt="" className='w-16 bg-white rounded-full' srcset="" />
                            <div className='text-white flex flex-col text-2xl'>
                                <span className=''>Ranchi Municipal Corporation</span>
                                <span>रांची नगर निगम</span>
                            </div>
                        </div>

                        <div className='w-1/2 flex flex-col items-center justify-center'>
                            <div className='flex flex-col w-max'>
                            <span className='flex gap-1 items-center text-base'><IoPersonSharp /> Welcome Guest</span>
                            <span className='flex gap-1 items-center text-base text-gray-500 cursor-pointer' onClick={() => navigate('/login')}><RiTeamFill /> Official Login</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='bg-[#0F1151] w-screen flex justify-between px-4 py-1.5 '>
                    <span className='flex gap-1 items-center text-white cursor-pointer' onClick={() => navigate('/')}><FaHome /> HOME</span>
                </div>

            </div>
        </>
    )
}

export default BrandingRmc