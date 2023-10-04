///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : FpChallan2
// 👉 Status      : Close
// 👉 Description : Challan Receipt generating.
// 👉 Functions   :  
//                  1. activateBottomErrorCard -> To activate error card
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useEffect, useState } from 'react'
import './Reciept.css'
import ProjectApiList from '@/Components/api/ProjectApiList'
import BarLoader from '@/Components/Common/Loaders/BarLoader'
import { nullToNA, indianAmount, indianDate, checkErrorMessage } from '@/Components/Common/PowerupFunctions'
import { AiFillPrinter } from 'react-icons/ai'
import BottomErrorCard from '@/Components/Common/BottomErrorCard'
import useSetTitle from '@/Components/Common/useSetTitle'
import { useNavigate, useParams } from 'react-router-dom'
import ApiHeader2 from '@/Components/api/ApiHeader2'
import rmclogo from '@/Components/assets/rmc.png'
import swachhBharat from '@/Components/assets/swachhBharat.png'
import axios from 'axios'
import { FaRegEye } from 'react-icons/fa'
import { BiMoney } from 'react-icons/bi'
import { getLocalStorageItemJsonParsed } from '@/Components/Common/localstorage'

const FpChallan2 = () => {

    // 👉 To set title 👈
    useSetTitle("Challan")

    // 👉 URL constant 👈
    const { id } = useParams()

    // 👉 Navigate constant 👈
    const navigate = useNavigate()

    // 👉 Storing localstorage data in constant 👈
    const userDetails = getLocalStorageItemJsonParsed('userDetails')

    // 👉 API constant 👈
    const { api_fpChallan2 } = ProjectApiList()

    // 👉 State constants 👈
    const [challanDetails, setchallanDetails] = useState(null)
    const [erroState2, seterroState2] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setisLoading] = useState(false)

    // 👉 Funtion 1 👈
    const activateBottomErrorCard = (state, msg) => {
        setErrorMessage(msg)
        seterroState2(state)
        if (!state) {
            window.history.back()
        }
    }

    // 👉 To get receipt details 👈
    useEffect(() => {

        seterroState2(false)
        setisLoading(true)

        axios.post(api_fpChallan2, { challanId: id }, ApiHeader2())
            .then((res) => {
                console.log('getting challan 2 details => ', res)
                setisLoading(false)

                if (res?.data?.status) {
                    setchallanDetails(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
            })
            .catch((err) => {
                console.log("getting challan 2 error => ", err)
                setisLoading(false)
                activateBottomErrorCard(true, "Some error occured! Please try again later!!!")

            })
    }, [])


    return (
        <>

            {/* 👉 Error card 👈 */}
            {erroState2 && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={errorMessage} />}

            {/* 👉 Loader 👈 */}
            {isLoading && <BarLoader />}

            {/* 👉 Print Button 👈 */}
            <div className='fixed bottom-10 text-center flex justify-center items-center gap-4  w-screen z-40'>
                <button onClick={() => window.print()} className="border border-indigo-600 w-24 py-1 rounded-sm shadow-md hover:shadow-xl bg-indigo-500 hover:bg-indigo-600 
                            text-white flex items-center justify-center gap-1 ">
                    <AiFillPrinter className='inline text-lg' />
                    Print
                </button>
                {/* {cell?.row?.original?.hasExpired ? */}
                {/* <>
                         <button
                         onClick={() => {
                             navigate(`/challan/${id}`)
                         }}
                         className="border border-sky-700 text-sky-700 w-24 py-1 rounded-sm shadow-md hover:shadow-xl hover:bg-sky-700 
                     hover:text-white flex items-center justify-center gap-1"
                     >
                        <span className=" -scale-x-100"><MdOutlineSettingsBackupRestore/></span> Regenerate
                     </button>
                     
                         <button className="border border-red-600 text-red-500 w-24 py-1 rounded-sm shadow-md  flex items-center justify-center gap-1 ">
                           <RxLinkBreak2/> Expired
                         </button>
                         </>
                         : 
                        <>*/}

                {(userDetails?.user_type == "JSK" && !challanDetails?.payment_status) && <button
                    onClick={() => {
                        navigate(`/fp-pay/${id}`)
                    }}
                    className="border border-orange-600 w-24 py-1 rounded-sm shadow-md hover:shadow-xl bg-orange-500 hover:bg-orange-600 
                            text-white flex items-center justify-center gap-1 "
                >
                    <BiMoney /> Pay
                </button>
                }
                {(userDetails?.user_type != "JSK" && !challanDetails?.payment_status) &&
                    <div
                        className="border border-red-600 w-max px-4 py-1 rounded-sm shadow-md bg-red-500
                            text-white flex items-center justify-center gap-1 "
                    >
                        <BiMoney /> Payment Not Done
                    </div>
                }
                {/* </>} */}

                {challanDetails?.payment_status &&
                    <button
                        onClick={() => {
                            navigate(`/fp-receipt/${challanDetails?.tran_no}`)
                        }}
                        className="border border-green-600 w-24 py-1 rounded-sm shadow-md hover:shadow-xl bg-green-500 hover:bg-green-600 
                    text-white flex items-center justify-center gap-1 "
                    >
                        <FaRegEye /> Receipt
                    </button>}
            </div>

{/* <div className='bg-none w-[70%] h-[80vh] absolute flex justify-center items-center ml-[11.5vw]'>
                        <div className='bg-red-100 border border-red-500 text-red-600 text-center text-2xl py-1 w-full'>Challan Expired</div>
</div> */}

            <div className="mx-auto print:block flex justify-center print:w-[98vw] print:drop-shadow-none print:shadow-none print:appearance-none" id="printableArea">


                <div className="w-[70%] print:w-auto overflow-x-hidden border-2 border-dashed border-black py-4 px-3 relative h-[80vh] print:h-full print:border-2 print:border-black font-semibold">

                    {/* 👉 Logo & Heading 👈 */}
                    <div className=''>
                        <div className="flex flex-col justify-center items-center gap-x-4 absolute print:top-[4%] top-[5%] left-[25%] print:left-[5%]">
                            <img src={rmclogo} alt="Logo" srcset="" className="h-16 w-16 appearance-none mix-blend-darken" />
                            <span className="text-3xl font-bold uppercase">{challanDetails?.ulbDetails?.ulb_name}</span>
                        </div>
                        <div className='w-full flex justify-center'>
                            <div className='w-full flex justify-center mt-2'>
                                <div className='flex flex-col items-center'>
                                    <div className=" text-2xl underline font-bold px-8 ">कार्यालय : राँची नगर निगम, राँची</div>
                                    <div className=" font-bold px-8 text-base mt-2">कचहरी रोड, राँची, पिन नo- 834001</div>
                                    <div className=" font- px-8 text-sm">E-mail ID- support@ranchimunicipal.com</div>
                                    <div className=" font- px-8 text-sm font-normal">Toll Free Number: 1800 890 4115</div>
                                    <div className=" font-semibold px-8 text-sm">{challanDetails?.challan_print_type == '1' ? '(चालान - ख)' : '(चालान - क)'} </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 👉 Challan Details 👈 */}
                    <div className='grid grid-cols-12 items-center text-sm mt-4 border-b pb-2 border-gray-700'>

                        <div className="col-span-8 flex gap-2">
                            <div className="">रसीद क्रमांक:- </div>
                            <div className="font-normal">{nullToNA(challanDetails?.challan_no)}</div>
                        </div>

                        <div className="col-span-4 flex gap-2">
                            <div className="">दिनांक:- </div>
                            <div className="font-normal">{indianDate(challanDetails?.challan_date)}</div>
                        </div>

                        <div className="col-span-6 flex gap-2">
                            <div className="">शाखा का नाम:- </div>
                            <div className="">सिटी इंफोर्स्मेंट सेल</div>
                        </div>


                    </div>


                    {/* 👉 Basic Details 👈 */}
                    <div className='flex justify-between mb-2 pt-2 gap-2'>
                        <div className="text-start text-sm w-full flex flex-wrap gap-y-1 ">

                            <div className="w-[2%]">1.</div>
                            <div className="w-[98%] flex gap-2">
                                <div className="w-[23%]">दोषी व्यक्ति का नाम :- </div>
                                <div className="w-[83%]">
                                    <div className='w-full flex gap-2'><div className='w-[20%]'>श्री/ श्रीमती/सुश्री </div> <div className="w-[80%] border-b-2 border-dashed border-gray-500 font-normal">{nullToNA(challanDetails?.full_name)}</div></div>
                                </div>
                            </div>

                            <div className="w-[2%]">2.</div>
                            <div className="w-[98%] flex gap-2">
                                <div className="w-[23%]">पिता / पति का नाम :-  </div>
                                <div className="w-[83%]">
                                    <div className='w-full flex gap-2'><div className='w-[20%]'>श्री/स्व </div> <div className="w-[80%] border-b-2 border-dashed border-gray-500 font-normal">
                                        {nullToNA(challanDetails?.guardian_name)}
                                    </div></div>
                                </div>
                            </div>

                            <div className="w-[2%]">3.</div>
                            <div className="w-[98%] flex gap-2">
                                <div className="w-[23%]">पता :-  </div>
                                <div className="w-[83%]">
                                    <div className='w-full flex gap-2'><div className="w-full border-b-2 border-dashed border-gray-500 font-normal flex gap-2">
                                        <span>{challanDetails?.street_address}</span>
                                        <span>{challanDetails?.city}</span>
                                        <span>{challanDetails?.region}</span>
                                        <span>{challanDetails?.postal_code}</span>
                                    </div></div>
                                </div>
                            </div>

                            <div className="w-[2%]">4.</div>
                            <div className="w-[98%] flex gap-2">
                                <div className="w-[23%]">कृत्य का प्रकार  :- </div>
                                <div className="w-[83%] border-b-2 border-gray-500 border-dashed font-normal">{nullToNA(challanDetails?.violation_name)}</div>
                            </div>

                            <div className="w-[2%]">5.</div>
                            <div className="w-[98%] flex gap-2 flex-wrap">
                                <div className="">झारखंड नगरपालिका अधिनियम 2011 की धारा </div>
                                <div className="w-[15%] border-dashed border-b-2 border-gray-500 font-normal ">{nullToNA(challanDetails?.violation_section)}</div>
                                <div>के अधीन या उप नियम / विनियम की कंडिका</div>
                                <div className="w-[85%] border-dashed border-b-2 border-gray-500 font-normal ">{nullToNA(challanDetails?.violation_name)}</div>
                                <div>के अधीन दण्ड शुल्क अधिरोपित।  </div>
                            </div>

                            <div className="w-[2%]">6.</div>
                            <div className="w-[98%] flex gap-2">
                                <div className="w-[23%]">कृत्य स्थल :- </div>
                                <div className="w-[83%] border-b-2 border-gray-500 border-dashed font-normal">{nullToNA(challanDetails?.violation_place)}</div>
                            </div>

                            <div className="w-[2%]">7.</div>
                            <div className="w-[98%] flex gap-2">
                                <div className="w-[23%]">निर्धारित दण्ड शुल्क :- </div>
                                <div className="w-[83%]">
                                    <div className='w-full flex gap-2'><div className='w-[12%]'>(अंको में )</div> <div className="w-[86%] border-b-2 border-dashed border-gray-500 font-normal">{indianAmount(challanDetails?.amount)}</div></div>
                                    <div className='w-full flex gap-2'><div className='w-[12%]'>(शब्दों में)</div> <div className="w-[86%] border-b-2 border-dashed border-gray-500 font-normal">{nullToNA(challanDetails?.amount_in_words)}</div></div>
                                </div>
                            </div>

                            <div className="w-[50%] mt-6 flex justify-start">
                                <div className='h-36 w-36 border border-gray-700 flex items-center justify-center'>
                                    <img src={challanDetails?.geo_tagged_image} alt="violation image" srcset="" className='' />
                                </div>
                            </div>
                            <div className="w-[50%] mt-6 flex justify-end items-center">
                                <div className='w-full flex flex-col gap-2 '>
                                    <div className='flex gap-1 w-full'><div>हस्ताक्षर</div> <div className='w-[50%] border-b-2 border-dashed border-gray-500'></div></div>
                                    <div>निर्गत करने वाले प्राधिकृत पदाधिकारी</div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 👉 bottom note 👈 */}
                    <div className="pt-1 mt-4 border-t border-gray-700 text-sm">
                        {challanDetails?.challan_print_type == '1' ?
                            "नोट  :- चालान में उल्लेखित धारा 602  के अंतर्गत, शास्ति राशि 14 (चौदह) दिनों के अंदर भुगतान करने पर 50% को छूट अनुमन्य होगा। चालान में उल्लेखित दण्ड शुल्क का भुगतान करना अनिवार्य है, अन्यथा दण्ड शुल्क की वसूली हेतु नियमानुसार विधि सम्मत करवाई की जाएगी।"
                            :
                            "नोट:- चालान में उल्लेखित शास्ति राशि 14  (चौदह) दिनों के अंदर भुगतान करना अनिवार्य है। अन्यथा दण्ड शुल्क की वसूली हेतु नियमानुसार विधि सम्मत करवाई की जाएगी।"
                        }
                    </div>

                    {/* 👉 Bottom Contact Details 👈 */}
                    <div className='flex justify-start items-center mt-6 font-normal text-xs'>
                        अधिक जानकारी के लिए संपर्क करे : udhd.jharkhand.gov.in, 1800 890 4115 or 0651-3500700
                    </div>

                    {/* 👉 Bottom Image 👈 */}
                    <div className='flex justify-center items-center mt-4'>
                        <img src={swachhBharat} alt="" className="h-10 opacity-70" />
                    </div>

                    {/* 👉 Bottom Message 👈 */}
                    <div className='flex justify-center items-center mt-4 text-xs font-normal'>
                        यह रसीद कंप्यूटर द्वारा बनाई गई है और इसमें हस्ताक्षर की आवश्यकता नहीं है।
                    </div>

                </div>
            </div>
        </>
    )
}

export default FpChallan2