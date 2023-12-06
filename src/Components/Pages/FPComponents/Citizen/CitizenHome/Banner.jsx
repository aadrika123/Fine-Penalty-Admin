import React from 'react'
import fp from '../assets/fp.jpg'
import './style.css'

const Banner = () => {
  return (
    <>
    <div className='banner h-[90vh]'>
        <div className='backdrop-brightness-50 h-[90vh] text-white flex flex-wrap flex-col items-center justify-center'>
            
            <h1 className='text-7xl font-bold font-serif w-full text-center mb-6'>Fines &amp; Penalties</h1>

            <article className='text-2xl text-gray-100'>
            E-Governance initiative to streamline and simplify the citizen-centric services provided by the Urban Local Bodies (ULBs) in Jharkhand.
            </article>

        </div>
    </div>
    </>
  )
}

export default Banner