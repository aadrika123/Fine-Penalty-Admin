///////////////////////////////////////////////////////////////////////
// Author : R U Bharti
// Project : JUIDCO
///////////////////////////////////////////////////////////////////////

import React,{useEffect, useState} from "react";
import {ImCross} from 'react-icons/im'
import Modal from 'react-modal'
import { nullToNA } from "@/Components/Common/PowerupFunctions";
import check from '@/Components/assets/check.png'

const ApplicationSubmitScreen = (props) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log("enter in submission screen with application no.  =>  ", props?.appNo)
    props?.openSubmit == true && openModal()
  }, [props?.openSubmit])
  

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    props?.refresh()
    setIsOpen(false);
  };
  console.log('dfjlsdjfkl', modalIsOpen)
  const afterOpenModal = () => {};

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        className="z-20 h-screen w-screen backdrop-blur-sm flex flex-row justify-center items-center overflow-auto"
        contentLabel="Example Modal"
      >
        <div class="md:m-0 m-2 rounded-lg shadow-lg shadow-indigo-300 md:w-[50vw] md:h-max w-full relative border-2 border-indigo-500 bg-gray-50 px-2 md:px-6 py-2 md:py-4 h-max border-t-2 border-l-2 overflow-auto">
        <div className="absolute top-2 z-10 bg-red-200 hover:bg-red-300 right-2 rounded-full p-2 cursor-pointer" onClick={closeModal}>
                    <ImCross fontSize={10}/>
                </div>

          <div className="poppins text-xl font-semibold w-full pt-6 px-8">
            <div className="bg-indigo-600 font-semibold rounded-sm w-full 2xl:text-2xl text-lg text-center shadow-sm text-white px-4 py-2 poppins uppercase">
              {nullToNA(props?.heading)}
            </div>

            <div className="bg-white grid grid-cols-12 my-4 rounded-md shadow-lg">
              
              <div className="col-span-4 p-6 ">
                <img src={check} alt="" srcset="" className="w-[10rem]"/>
              </div>

              <div className="col-span-8 p-6 poppins font-normal">
                <div className="poppins text-green-500 font-semibold 2xl:text-2xlxl text-lg">You have successfully verified the form.</div>
                <div className="poppins mt-4 text-sm 2xl:text-lg">Challan No. : <span className="poppins font-semibold">{nullToNA(props?.appNo)}</span></div>
                <div className="poppins mt-4 text-sm 2xl:text-lg"> You can track the your application through the application number. </div>
                <div></div>
                <div></div>
              </div>

            </div>

            <div className="flex items-center justify-center my-6">
                <button className="2xl:px-6 px-3 py-1.5 2xl:py-2.5 cursor-pointer bg-blue-500 text-white font-medium text-xs  poppins rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" onClick={closeModal}>{props?.button}</button>
            </div>

          </div>
        </div>
      </Modal>
    </>
  );
};

export default ApplicationSubmitScreen;
