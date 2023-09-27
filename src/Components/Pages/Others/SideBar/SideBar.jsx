///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : SideBar
// 👉 Status      : Close
// 👉 Description : This screen is designed to handle sidebar.
// 👉 Functions   :  
//                  1. dropFun -> To handle drop down.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useContext } from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './SideBar.css'
import 'animate.css'
import { MdOutlineDashboard, MdOutlineSpaceDashboard } from 'react-icons/md';
import { contextVar } from '@/Components/context/contextVar'
import { BsBuildings, BsCaretRight } from 'react-icons/bs';
import { GiTakeMyMoney } from 'react-icons/gi'

const SideBar = (props) => {

  // 👉 Context constants 👈
  const { toggleBar, settoggleBar, userDetails } = useContext(contextVar)

  // 👉 State constants 👈
  const [dropDown, setdropDown] = useState(false)
  const [dropName, setdropName] = useState('')

  // 👉 CSS constants 👈
  const dropMenuBtn = `block w-full pl-7 py-2 px-6 clear-both whitespace-nowrap text-sm hover:bg-sky-100 hover:text-[#1A4D8C] rounded-md text-sm animate__animated animate__fadeIn animate__faster `
  const mobileMenuBtn = `block py-3 px-4 hover:bg-sky-100 hover:text-[#1A4D8C] rounded-md animate__animated animate__fadeIn animate__faster `
  const open1 = 'animate__animated animate__slideInLeft animate__faster bg-[#1A4D8C] w-[17rem] '
  const open3 = 'animate__animated animate__fadeInLeft animate__faster '
  const close1 = 'w-0 sm:w-3 bg-[#1A4D8C] animate__animated '
  const close3 = 'animate__animated animate__fadeOutLeft animate__faster '

  // 👉 Function 1 👈
  const dropFun = (val) => {
    setdropDown(!dropDown)
    setdropName(val)
  }


  return (
    <>

      {/* 👉 ======Main Section========== 👈 */}
      <header className={(toggleBar ? open1 : close1) + ' relative select-none transition-all duration-200 h-full text-white pt-2'}>

        {<div class={(toggleBar ? open3 : close3) + " bg-[#1A4D8C] w-full inset-0 "} id="mobile-menu">

          <nav id="mobile-nav" class="flex flex-col ltr:right-0 rtl:left-0 w-full top-0 py-4 ">

            <div class="mb-auto text-sm 2xl:text-base text-gray-50">

              {/* 👉 ========logo========== 👈 */}
              <div class="text-center mb-4">
                <div class="text-sm text-gray-200 flex flex-col items-start justify-center relative">
                  <span className='flex justify-center w-full'> <span className='text-[50px] flex justify-center py-2 text-white'><GiTakeMyMoney /></span></span>
                  <span className='flex justify-center w-full'>{userDetails?.user_name}</span>
                  <span className='flex justify-center w-full'>{userDetails?.roles?.map((elem) => elem)}</span>
                </div>
                <hr className='my-4' />
              </div>

              {/* 👉 =====menus======  👈*/}
              <div class=" text-sm px-4 overflow-y-auto scrollbar-width-10 scrollbar-track-blue-100 scrollbar-thumb-blue-700 scrollbar-thumb-rounded-full scrollbar-thumb-hover-blue-500 transition-all duration-200">
                <nav class="relative flex flex-wrap items-center justify-between overflow-x-hidden">
                  <ul id="side-menu" class="w-full float-none flex flex-col">
                    {
                      props?.menu?.map((item) => <>
                        <li className='relative cursor-pointer mb-1' onClick={() => { (window.innerWidth <= 763 && item?.children?.length == 0) && settoggleBar(!toggleBar) }}>
                          <NavLink to={item?.path == '' ? null : item?.path} className={({ isActive }) => ((isActive && item?.children?.length == 0) ? "bg-sky-100 text-[#133e71] " : " ") + `${mobileMenuBtn} ` + 'flex gap-4 items-center'} onClick={() => {
                            dropFun(item?.name)
                            dropName == item?.name && setdropName('')
                          }}> <span><MdOutlineDashboard /></span> <div className='flex justify-between items-center flex-1'><span>{item?.name}</span>{(item?.path == null || item?.path == '') && <span className={(dropName == item?.name) ? 'transition-all duration-200 ease-in-out rotate-90' : 'transition-all duration-200 ease-in-out rotate-0'}><BsCaretRight /></span>}</div> </NavLink>

                          {(item?.children?.length > 0 && (dropName == item?.name)) && <ul class="block rounded rounded-t-none top-full py-0.5 ltr:text-left rtl:text-right mb-4 bg-[#133e71]" >
                            {
                              item?.children?.map((elem) => <>
                                <li class="relative cursor-pointer mt-1" onClick={() => { window.innerWidth <= 763 && settoggleBar(!toggleBar) }}>
                                  <NavLink to={elem?.path} className={({ isActive }) => (isActive ? "bg-sky-100 text-[#133e71] " : " ") + `${dropMenuBtn} ` + 'flex gap-3 items-center'}><span><MdOutlineSpaceDashboard /></span> <span className=''>{elem?.name}</span></NavLink>
                                </li>
                              </>)
                            }
                          </ul>}
                        </li>
                      </>)
                    }
                  </ul>
                </nav>
              </div>

            </div>

          </nav>

        </div>}

      </header>

    </>
  )
}
export default SideBar