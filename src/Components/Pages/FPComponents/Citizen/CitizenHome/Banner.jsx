import React from 'react'
import './style.css'
import { SiYoutube } from 'react-icons/si'
import { FcDocument } from 'react-icons/fc'
import actPdf from '../../../../assets/PDF/Act&Rules.pdf'

const Banner = () => {

    const linkStyle = color => `flex gap-1 text-sm items-center bg-${color}-100 text-gray-800 px-4 py-1 rounded-md drop-shadow-md hover:scale-105 transition-all duration-250 cursor-pointer`
    const buttonStyle = color => `flex gap-1 text-sm items-center bg-${color}-100 text-gray-800 px-4 py-1 rounded drop-shadow-md hover:bg-${color}-500 hover:text-white transition-all duration-250 cursor-pointer `

    const quickLinks = [
        {label: "Know Your Enforcement Officer List",  link: "enforcement-officer-list"},
        {label: "Know Your Enforcement Cell List",  link: "enforcement-cell-list"},
        {label: "Violation List",  link: "violation-list"},
    ]

    const linksBlock = (elem, index) => {
        return (
            <div onClick={() => window.open(`/fines/${elem?.link}`, '_blank')} className={`grid grid-cols-12 items-center text-base cursor-pointer group w-full`}>
                <span className='col-span-1'>{index+1}.</span>
                <span className='col-span-11 group-hover:underline'>{elem?.label}</span>
            </div>
        )
    }

    return (
        <>
            <main className='banner h-[90vh]'>
                <div className='backdrop-brightness-50 h-[90vh] text-white flex justify-center items-center relative'>

                    <div className='flex flex-wrap flex-col items-center justify-center max-w-[1366px] h-full p-4 '>

                        <h1 className='text-7xl font-bold font-serif w-full text-center mb-4'>Fines &amp; Penalties</h1>

                        <article className='text-xl text-gray-100'>
                            E-Governance initiative to streamline and simplify the citizen-centric services provided by the Urban Local Bodies (ULBs) in Jharkhand.
                        </article>

                        <div className='flex gap-4 my-4 absolute top-0 right-2'>
                            <a onClick={() => window.open('/citizen', '_blank')} className={linkStyle('indigo')}>Citizen Login</a>
                            <a onClick={() => window.open('/fines', "_blank")} className={linkStyle('indigo')}>Admin Login</a>
                            <a href='https://youtu.be/5n_iTWCfg-k' target="_blank" className={linkStyle('red')}><SiYoutube size={26} className='text-red-600' /> Manual Video</a>
                            <a href={actPdf} target="_blank" className={linkStyle('sky')}><FcDocument size={26} /> View Manual</a>
                        </div>

                        <div className='flex flex-wrap w-full'>
                            <h5 className='italic text-start text-2xl font-semibold font-sans border-b border-dashed w-max pr-2'>Quick Links</h5>
                            
                            <div className='w-full flex flex-wrap pl-28 my-2'>
                                {
                                    quickLinks?.map((elem, index) => linksBlock(elem, index))
                                }
                            </div>

                        </div>
                    </div>



                </div>
            </main>
        </>
    )
}

export default Banner