import { checkErrorMessage, indianAmount } from '@/Components/Common/PowerupFunctions'
import React, { useEffect, useState } from 'react'
import './rangeStyle.css'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'
import ApiHeader from '@/Components/api/ApiHeader'
import { RxCross2 } from 'react-icons/rx'
import { toast } from 'react-hot-toast'
import ProjectApiList from '@/Components/api/ProjectApiList'
import ShimmerEffectInline from '@/Components/Common/Loaders/ShimmerEffectInline'

const AssignViolation = (props) => {

    const { api_assignViolation } = ProjectApiList()

    const [amount, setAmount] = useState(0)
    const [violationIds, setViolationIds] = useState([])
    const [allCheck, setAllCheck] = useState(false)
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        const idArray = props?.dataList?.filter(item => item?.on_spot == true)?.map((elem) => elem?.id);
        setViolationIds(idArray)
    }, [props?.dataList])

    const handleCheckBox = (e, id = '') => {

        const name = e.target.name;
        const value = e.target.value;
        const checked = e.target.checked;

        if (name == 'violationAll') {
            setAllCheck(checked)

            if (checked) {
                const idArray = props?.dataList?.filter(item => parseFloat(item?.penalty_amount) <= parseFloat(amount))?.map((elem) => elem?.id);
                setViolationIds(idArray);
            } else {
                setViolationIds([])
            }
        }

        if (name == 'violationSingle') {
            if (checked) {
                setViolationIds(prev => [...prev, value])
            } else if (!checked && allCheck != true) {
                let data = violationIds?.filter(item => item != value)
                setViolationIds(data)
            }
        }

    }

    const closeFun = () => {
        props?.closeFun()
        setAllCheck(false)
        setAmount(0)
        props?.refresh()
    }

    const assignAllFun = () => {

        setLoader(true)

        let payload = {
            violationId: violationIds
        }

        AxiosInterceptors.post(api_assignViolation, payload, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    toast.success('Violation Assigned Successfully !!!')
                } else {
                    props?.activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
                console.log('fp violation assign response => ', res)
            })
            .catch((err) => {
                props?.activateBottomErrorCard(true, 'Server Error! Please try again later.')
                console.log('error fp violation assign => ', err)
            })
            .finally(() => {
                setLoader(false)
                props?.refresh()
            })

    }

    const checkId = (id) => {
        return violationIds.some(item => parseInt(item) == parseInt(id))
    }

    return (
        <>

            <span onClick={() => closeFun()} className="block p-1 bg-red-100 hover:bg-red-500 rounded-full hover:text-white cursor-pointer transition-all duration-200 absolute top-2 right-2"><RxCross2 /></span>

            <div className='p-4 px-6'>

                <h1 className='font-semibold text-sky-700 border-b pb-1 text-center my-4 text-xl '>Penalty Amount Assignment for On-Spot Challan Generation</h1>

                <div className='bg-sky-50 p-4'>
                    <label for="minmax-range" class="block mb-2 font-medium text-gray-900 text-lg">Select Penalty Range</label>
                    <input id="minmax-range" type="range" min="0" max={props?.maxAmount} onChange={e => setAmount(e.target.value)} value={amount} class="w-full h-2 range-input bg-sky-800 rounded-lg appearance-none cursor-pointer darks:bg-gray-700" />

                    <div className="w-full flex justify-between text-xs font-semibold">
                        <span>{indianAmount(0)}</span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span>{indianAmount(props?.maxAmount)}</span>
                    </div>
                </div>

                <div className='my-4 font-semibold'><span className='text-sm font-normal'>Amount:</span> ₹ <input type="number" className='focus:outline-none border-b border-gray-300 w-28 bg-white' name="" value={amount} onChange={e => setAmount(e.target.value)} max={parseFloat(props?.maxAmount)} placeholder='0.00' id="" /></div>


                {!loader && Array.isArray(props?.dataList) && props?.dataList?.filter(item => parseFloat(item?.penalty_amount) <= parseFloat(amount))?.length > 0 &&
                    <div className='px-2 animate__animated animate__fadeIn animate__faster'>
                        <button onClick={() => assignAllFun()} className='float-right bg-[#1A4D8C] px-3 py-1 rounded-sm shadow-lg hover:shadow-xl hover:bg-[#113766] hover:text-white text-white flex items-center mb-1'>Assign</button>
                    </div>
                }

                <div className='flex flex-col h-[60vh] w-full overflow-y-auto md:overflow-x-hidden'>

                    <div className='w-full grid grid-cols-12 items-center gap-2 bg-slate-500 text-white font-semibold border border-slate-200 px-4 py-2'>
                        <div className='col-span-1'>Section</div>
                        <div className='col-span-10 text-center'>Violation Name</div>
                        <div className='col-span-1 flex'>
                            <span>Action</span>
                            {Array.isArray(props?.dataList) && props?.dataList?.filter(item => parseFloat(item?.penalty_amount) <= parseFloat(amount))?.length > 0 &&
                                <label class="inline-flex items-center px-4 animate__animated animate__fadeIn animate__faster">
                                    <input type="checkbox" name='violationAll' onChange={(e) => handleCheckBox(e)} class="cursor-pointer form-checkbox h-5 w-5 text-slate-800" />
                                </label>}
                        </div>
                    </div>


                    {
                        loader && <ShimmerEffectInline />
                    }

                    {
                        !loader && Array.isArray(props?.dataList) &&
                        props?.dataList?.filter(item => parseFloat(item?.penalty_amount) <= parseFloat(amount))?.map((elem, index) =>
                            <>
                                <div key={index} className='w-full grid grid-cols-12 items-center gap-2 bg-slate-100 border-b hover:bg-white pb-1 p-4 animate__animated animate__fadeIn animate__faster'>
                                    <div className='col-span-1'>{elem?.violation_section}</div>
                                    <div className='col-span-10'>{elem?.violation_name}</div>
                                    <div className='col-span-1'>
                                        <label class="inline-flex items-center px-4">
                                            <input type="checkbox" name='violationSingle' checked={allCheck || checkId(elem?.id) ? true : null} value={elem?.id} onChange={(e) => handleCheckBox(e, elem?.id)} class="cursor-pointer form-checkbox h-5 w-5 text-slate-800" />
                                        </label>
                                    </div>
                                </div>
                            </>
                        )
                    }

                    {
                        !loader && Array.isArray(props?.dataList) && props?.dataList?.filter(item => parseFloat(item?.penalty_amount) <= parseFloat(amount))?.length == 0 &&
                        <div className='w-full text-center text-red-400 font-semibold pb-1 p-4'>
                            No Violation Available
                        </div>
                    }

                </div>

            </div>

        </>
    )
}

export default AssignViolation