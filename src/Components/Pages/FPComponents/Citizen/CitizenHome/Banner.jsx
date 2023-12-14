import React from 'react'
import './style.css'
import { SiYoutube } from 'react-icons/si'
import { FcDocument } from 'react-icons/fc'
import actPdf from '../../../../assets/PDF/Act&Rules.pdf'
import { useNavigate } from 'react-router-dom'
import secretary from '../assets/secretary.jpg'
import banner from '../assets/bg.svg'
import b1 from '../assets/b1.svg'
import b2 from '../assets/b2.svg'
import b3 from '../assets/b3.svg'
import shape from '../assets/shape.svg'

const Banner = () => {

    const navigate = useNavigate()

    const linkStyle = color => `flex gap-1 text-xs md:text-sm items-center bg-${color}-100 text-gray-800 px-4 py-1 rounded-md drop-shadow-sm border border-white hover:scale-105 transition-all duration-250 cursor-pointer`

    const quickLinks = [
        { label: "Search Challan", link: "search-challan/direct" },
        { label: "Know Your Enforcement Officer", link: "enforcement-officer-list" },
        { label: "Know Your Enforcement Cell", link: "enforcement-cell-list" },
        { label: "Violation List", link: "violation-list" }
    ]

    const linksBlock = (elem, index) => {
        return (
            <div onClick={() => navigate(`/${elem?.link}`)} className={`flex gap-2 items-center text-base cursor-pointer group w-max`}>
                <span className='col-span-1'>{index + 1}.</span>
                <span className='col-span-11 group-hover:underline border text-sm bg-green-50 hover:bg-[#99B37C] hover:text-white rounded-sm text-black px-4 py-0.5'>{elem?.label}</span>
            </div>
        )
    }

    return (
        <>

            <div className=' w-full h-[88vh] flex flex-col'>
                <div className='flex items-center justify-center w-full h-max p-2 border-b '>
                    <div className='flex'>
                        <a onClick={() => navigate('/search-challan/direct')} className={linkStyle('indigo')}>Citizen</a>
                        <a onClick={() => navigate('/login')} className={linkStyle('indigo')}>Admin Login</a>
                        <a href='https://youtu.be/5n_iTWCfg-k' target="_blank" className={linkStyle('red')}><SiYoutube size={26} className='text-red-600' /> Manual Video</a>
                        <a href={actPdf} target="_blank" className={linkStyle('sky')}><FcDocument size={26} /> View Manual</a>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row h-full items-center justify-center'>

                    <div className="flex-1 md:w-[40%]  md:relative flex flex-col items-center justify-start">
                        <img src={banner} className="w-[50%] absolute top-44 md:top-0 md:static  md:w-[60%] animate__animated animate__fadeIn animate__faster  m-2 object-contain drop-shadow-md  h-max border-double" alt="" srcset="" />
                        {/* <img src={b1} alt="" srcset="" className='animate__animated animate__zoomIn animate__faster opacity-90 drop-shadow-md absolute w-[40%] -top-[40px] -right-4' /> */}
                        {/* <img src={b3} alt="" srcset="" className='animate__animated animate__zoomIn animate__faster opacity-90 drop-shadow-md absolute w-[40%] top-[35%] right-[80px]' /> */}
                        {/* <img src={b2} alt="" srcset="" className='animate__animated animate__zoomIn animate__faster opacity-90 drop-shadow-md absolute w-[35%] bottom-0 -right-[80px]' /> */}

                            <img src={b1} alt="" srcset="" className='animate__animated animate__zoomIn animate__faster opacity-90 drop-shadow-md w-[30%] md:w-[30%] absolute top-[180px] left-[30px]  md:-top-[50px] md:left-[150px]' />
                            <img src={b3} alt="" srcset="" className='animate__animated animate__zoomIn animate__faster opacity-90 drop-shadow-md w-[30%] md:w-[33%] absolute top-[280px] left-[30px] md:top-[150px] md:-left-[50px]' />
                            <img src={b2} alt="" srcset="" className='animate__animated animate__zoomIn animate__faster opacity-90 drop-shadow-md w-[30%] md:w-[35%] hidden md:block md:absolute top-[330px] left-[200px] md:-bottom-[100px] md:left-[0]' />
                    </div>

                    {/* spacer */}
                    <div className="mt-80 md:mt-0">

                    </div>


                    <div className='md:w-1/2 flex items-start flex-col justify-center p-4 h-full'>
                        <h5 className='text-start font-semibold '>Ranchi Municipal Corporation</h5>
                        <h1 className='text-3xl md:text-7xl font-bold font-serif w-full text-start mb-4 '>Fines &amp; Penalties</h1>

                        <article className='text-xl text-gray-700 '>
                            E-Governance initiative to streamline and simplify the citizen-centric services provided by the Urban Local Bodies (ULBs) in Jharkhand.
                        </article>


                        <div className='flex flex-wrap w-full my-4 '>
                            <h5 className='italic text-start text-2xl font-semibold font-sans border-b border-dashed border-gray-400 w-max pr-2 '>Quick Links</h5>

                            <div className='w-full flex flex-col flex-wrap md:pl-28 my-2 gap-2'>
                                {
                                    quickLinks?.map((elem, index) => linksBlock(elem, index))
                                }
                            </div>

                        </div>
                    </div>


                </div>

            </div>


            {/* <div className='w-full h-[90vh] md:h-[90vh]  flex relative overflow-hidden' >

              

                <img className='h-0 md:h-[97vh] absolute top-7 left-0 -mt-10 z-50' src={shape ?? ''} />

                <div className='flex-initial px-6 md:px-8 relative h-[100%] flex justify-center items-center z-50'>
                    <div className='flex w-[140%] items-center justify-between -right-44 absolute top-4 '>
                    <img src={secretary} alt="" srcset="" className='w-[9%]' />
                    <div className='flex gap-2'>
                        <a onClick={() => window.open('/citizen', '_blank')} className={linkStyle('indigo')}>Citizen Login</a>
                        <a onClick={() => navigate('/login')} className={linkStyle('indigo')}>Admin Login</a>
                        <a href='https://youtu.be/5n_iTWCfg-k' target="_blank" className={linkStyle('red')}><SiYoutube size={26} className='text-red-600' /> Manual Video</a>
                        <a href={actPdf} target="_blank" className={linkStyle('sky')}><FcDocument size={26} /> View Manual</a>
                    </div>
                </div>

                    <div className='w-full '>

                        <div className="text-3xl md:text-4xl font-bold mb-2 text-[#99B37C]">Fines &amp; Penalties</div>
                        <hr className='border-2 w-20 mb-2 border-[#99B37C]' />
                        <h1 className="text-lg text-black font-PublicSans md:w-[350px] mb-6"> E-Governance initiative to streamline and simplify the citizen-centric services provided by the Urban Local Bodies (ULBs) in Jharkhand.</h1>

                        <div>
                            <button className='flex md:text-base text-sm bg-amber-500 hover:bg-amber-600 hover:shadow-xl px-14 py-2 rounded-full shadow-md text-white' onClick={() => navigate('/search-challan/direct')}>
                                Search Challan
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>

                            </button>

                            <div className='flex flex-col w-max flex-wrap gap-2 mt-4'>
                                <button className='flex w-max md:text-base text-sm bg-green-700 hover:bg-green-800 hover:shadow-xl px-10 py-2 rounded-full shadow-md text-white' onClick={() => navigate('/violation-list')}>Violation List</button>
                                <button className='flex md:text-base text-sm bg-zinc-50 border hover:bg-zinc-100 hover:shadow-xl px-10 py-2 rounded-full shadow-md text-green-700' onClick={() => navigate('/enforcement-officer-list')}>Know Your Enforcement Officer</button>
                                <button className='flex md:text-base text-sm bg-zinc-50 border hover:bg-zinc-100 hover:shadow-xl px-10 py-2 rounded-full shadow-md text-green-700' onClick={() => navigate('/enforcement-cell-list')}>Know Your Enforcement Cell</button>
                            </div>
                        </div>

                    </div>
                </div>

                <div>
                    <img src={banner} alt="" srcset="" className='ml-36' />
                </div>
            </div> */}



            {/* <main className='banner h-[90vh]'>
                <div className=' h-[90vh] text-white flex justify-center items-center relative'>

                    <div className='w-full flex items-center justify-center h-full p-4 backdrop-brightness-[0.4]'>


                        <div className='max-w-[1366px]'>
                            <h5 className='text-center font-semibold'>Ranchi Municipal Corporation</h5>
                            <h1 className='text-6xl font-bold font-serif w-full text-center mb-4'>Fines &amp; Penalties</h1>

                            <article className='text-xl text-gray-100'>
                                E-Governance initiative to streamline and simplify the citizen-centric services provided by the Urban Local Bodies (ULBs) in Jharkhand.
                            </article>


                            <div className='flex flex-wrap w-full my-4'>
                                <h5 className='italic text-start text-2xl font-semibold font-sans border-b border-dashed w-max pr-2'>Quick Links</h5>

                                <div className='w-full flex flex-col flex-wrap pl-28 my-2 gap-2'>
                                    {
                                        quickLinks?.map((elem, index) => linksBlock(elem, index))
                                    }
                                </div>

                            </div>
                        </div>

                        <div className='flex w-[70%]  items-center justify-end gap-4 absolute top-4 '>
                            <div className='flex gap-2'>
                                <a onClick={() => window.open('/citizen', '_blank')} className={linkStyle('indigo')}>Citizen Login</a>
                                <a onClick={() => navigate('/login')} className={linkStyle('indigo')}>Admin Login</a>
                                <a href='https://youtu.be/5n_iTWCfg-k' target="_blank" className={linkStyle('red')}><SiYoutube size={26} className='text-red-600' /> Manual Video</a>
                                <a href={actPdf} target="_blank" className={linkStyle('sky')}><FcDocument size={26} /> View Manual</a>
                            </div>
                        </div>

                    </div>

                </div>
            </main> */}
        </>
    )
}

export default Banner