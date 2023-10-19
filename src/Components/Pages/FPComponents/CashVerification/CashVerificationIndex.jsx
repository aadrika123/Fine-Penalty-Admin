///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : CollectionReport
// 👉 Status      : Close
// 👉 Description : This component will show collection reports with some parameters.
// 👉 Functions   :  
//                  1. inputBox          -> Function to map input field.
//                  2. fetchData         -> To fetch data by some parameters.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useEffect, useRef } from 'react'
import ListTableConnect from "@/Components/Common/ListTableBP/ListTableConnect";
import { useFormik } from "formik";
import { useState } from "react";
import { RiFilter2Line } from "react-icons/ri";
import { RotatingLines } from "react-loader-spinner";
import * as yup from 'yup'
import ProjectApiList from "@/Components/api/ProjectApiList";
import { useNavigate } from "react-router-dom";
import { checkErrorMessage, getCurrentDate, indianAmount, indianDate, nullToNA } from "@/Components/Common/PowerupFunctions";
import useSetTitle from "@/Components/Common/useSetTitle";
import { FiAlertCircle } from 'react-icons/fi';
import BottomErrorCard from '@/Components/Common/BottomErrorCard';
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';
import ApiHeader from '@/Components/api/ApiHeader';
import { toast } from 'react-hot-toast';
import { RxCross2 } from 'react-icons/rx';
import ShimmerEffectInline from '@/Components/Common/Loaders/ShimmerEffectInline';
import ListTable from '@/Components/Common/ListTable/ListTable';

const CashVerificationIndex = () => {

  // 👉 Setting title 👈
  useSetTitle("Cash Verification")

  // 👉 API constant 👈
  const { api_cashVerificaionList, api_cashVerificaionById, api_verifyCash } = ProjectApiList()

  // 👉 Navigate constant 👈
  const navigate = useNavigate()

  // 👉 useRef Constant for dialog 👈
  const dialogRef = useRef()

  // 👉 Column constant 👈
  const columns = [
    {
      Header: "Sl.No.",
      Cell: ({ row }) => <div>{row?.index + 1}</div>
    },
    {
      Header: "Officer Name",
      accessor: "officer_name",
      Cell: ({ cell }) => (nullToNA(cell.row.original?.officer_name))
    },
    {
      Header: "Mobile No.",
      accessor: "mobile",
      Cell: ({ cell }) => (nullToNA(cell.row.original?.mobile))
    },
    // {
    //   Header: "Role Name",
    //   accessor: "role_name",
    //   Cell: ({ cell }) => (nullToNA(cell.row.original?.role_name))
    // },
    {
      Header: "Total Amount",
      accessor: "penalty_amount",
      Cell: ({ cell }) => (indianAmount(cell.row.original?.penalty_amount))
    },
    {
      Header: "Action",
      accessor: "id",
      Cell: ({ cell }) => (
        <div className="flex items-center flex-wrap flex-row gap-1">
          <button
            onClick={() => getCashDetailById(cell?.row?.original)}
            className={editButton}
          >
            View
          </button>

        </div>
      ),
    },
  ]

  // 👉 State Constants 👈
  const [requestBody, setrequestBody] = useState({})
  const [changeData, setchangeData] = useState(0)
  const [loader, setloader] = useState(false);
  const [cvData, setCvData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorState, setErrorState] = useState(false)
  const [cvIds, setCvIds] = useState([])
  const [dataList, setDataList] = useState([])
  const [allCheck, setAllCheck] = useState(false)
  const [loader2, setloader2] = useState(false)
  const [getData, setGetData] = useState(null)

  // 👉 CSS Constants 👈
  const labelStyle = 'text-gray-800 text-sm'
  const inputStyle = 'border focus:outline-none drop-shadow-sm focus:drop-shadow-md px-4 py-1 text-gray-700 shadow-black placeholder:text-sm focus:outline-none'
  const editButton = "border border-sky-800 text-sky-800 mx-1 px-3 py-1 rounded-sm shadow-lg hover:shadow-xl hover:bg-sky-800 hover:text-white focus:outline-none"

  const formDataList = [
    { title: "Date", key: "date", width: 'md:w-[20%] w-full', type: 'date', hint: "", required: true, options: '', okey: '', ovalue: '' },
  ]

  // 👉 Function 1 👈
  const inputBox = (key, title = '', type, width = '', hint = '', required = false, options = [], okey = '', ovalue = '') => {
    return (
      <div className={`flex flex-col ${width} `}>
        {title != '' && <label htmlFor={key} className={labelStyle}>{title} {required && <span className='text-red-500 text-xs font-bold'>*</span>} : </label>}
        {type != 'select' && type != 'file' && <input {...formik.getFieldProps(key)} type={type} className={inputStyle + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`} name={key} id="" placeholder={hint} />}
        {type == 'select' && <select {...formik.getFieldProps(key)} className={inputStyle + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 text-red-400' : ' focus:border-zinc-300 border-zinc-200 '}`}>

          <option value="">All</option>
          {
            options?.map((elem) => <option className='' value={elem[okey]}>{elem[ovalue]}</option>)
          }

        </select>}
      </div>
    );
  }

  // 👉 Validation Schema 👈
  const schema = yup.object().shape(
    [...formDataList]?.reduce((acc, elem) => {

      if (elem?.required) {
        acc[elem.key] = yup.string().required(elem?.hint)
      }

      return acc;
    }, {})
  );

  // 👉 Formik initial values 👈
  const initialValues = {
    date: getCurrentDate(),
  }

  // 👉 Formik constant 👈
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      fetchData(values)
    },
  });

  const activateBottomErrorCard = (state, message) => {
    setErrorState(state)
    setErrorMessage(message)
  }

  // 👉 Function 2 👈
  const fetchData = (data) => {

    setloader(true)

    let payload = {
      date: data?.date,
    }

    AxiosInterceptors
      .post(api_cashVerificaionList, payload, ApiHeader())
      .then((res) => {
        if (res?.data?.status) {
          setDataList(res?.data?.data)
        } else {
          activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
        }
        console.log('fp cash verification list response => ', res)
      })
      .catch((err) => {
        activateBottomErrorCard(true, 'Server Error! Please try again later.')
        console.log('error fp cash verification list => ', err)
      })
      .finally(() => {
        setloader(false)
      })

  };

  const idStoreFun = (data) => {
    const idArray = data?.map((elem) => elem?.id);
    setCvIds(idArray)
  }

  useEffect(() => {
    fetchData({ date: getCurrentDate() })
  }, [])

  const getCashDetailById = (data) => {

    setGetData(data)

    setloader2(true)

    dialogRef.current.showModal()

    let payload = {
      date: data?.date,
      userId: data?.user_id
    }

    AxiosInterceptors
      .post(api_cashVerificaionById, payload, ApiHeader())
      .then((res) => {
        if (res?.data?.status) {
          setCvData(res?.data?.data)
        } else {
          activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
          dialogRef.current.close()
        }
        console.log('fp cash verification list response => ', res)
      })
      .catch((err) => {
        activateBottomErrorCard(true, 'Server Error! Please try again later.')
        console.log('error fp cash verification list => ', err)
        dialogRef.current.close()
      })
      .finally(() => {
        setloader2(false)
      })

  }

  // 👉 Function 1 👈
  const checkId = (id) => {
    return cvIds.some(item => parseInt(item) == parseInt(id))
  }

  // 👉 Function 2 👈
  const handleCheckBox = (e, id = '') => {

    const name = e.target.name;
    const value = e.target.value;
    const checked = e.target.checked;

    if (name == 'cashAll') {
      setAllCheck(checked)

      if (checked) {
        const idArray = cvData?.tranDtl?.map((elem) => elem?.id);
        setCvIds(idArray);
      } else {
        setCvIds([])
      }
    }

    if (name == 'cashSingle') {
      if (checked) {
        setCvIds(prev => [...prev, value])
      } else if (!checked && allCheck != true) {
        let data = cvIds?.filter(item => item != value)
        setCvIds(data)
      }
    }

  }

  const verifyFun = () => {

    if (cvIds?.length == 0) {
      return;
    }

    setloader2(true)

    let payload = {
      id: cvIds,
      tcId: cvData?.tcId,
      date: cvData?.date,
    }

    AxiosInterceptors.post(api_verifyCash, payload, ApiHeader())
      .then((res) => {
        if (res?.data?.status) {
          toast.success('Cash Verified Successfully !!!')
          fetchData({ date: cvData?.date })
        } else {
          activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
        }
        console.log('fp cash verification response => ', res)
      })
      .catch((err) => {
        activateBottomErrorCard(true, 'Server Error! Please try again later.')
        console.log('error fp cash verification => ', err)
      })
      .finally(() => {
        setloader2(false)
        dialogRef.current.close()
        setAllCheck(false)
        setCvIds([])
      })
  }

  return (
    <>

      {/* 👉 Error Card 👈 */}
      {errorState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={errorMessage} />}

      {/* 👉 Searching Form 👈 */}
      <form onSubmit={formik.handleSubmit} onChange={formik.handleChange} className="bg-white poppins p-4 mb-8">

        <h1 className="text-xl font-semibold uppercase text-center text-gray-700 border-b border-gray-400 mb-4 pb-1">Cash Verification</h1>

        <section className='flex gap-4 flex-wrap my-6'>

          {
            formDataList?.map((elem) => {
              return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, elem?.options, elem?.okey, elem?.ovalue)
            })
          }
          {/* 👉 Submit Button 👈 */}
          <div className="mt-4 w-full md:w-[30%] flex flex-row flex-wrap items-center gap-x-4 gap-y-2 md:mt-4">
            <div className=" ">{
              loader ?
                <>
                  {
                    <div className='flex justify-center'>
                      <RotatingLines
                        strokeColor="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="25"
                        visible={true}
                      />
                    </div>
                  }
                </>
                :

                <button
                  type="submit"
                  className=" flex items-center border border-green-600 bg-green-500 hover:bg-green-600 text-white shadow-md rounded-sm  text-sm px-5 py-1"
                >
                  <span className=""><RiFilter2Line fontSize={''} /></span>
                  <span>Search Record</span>
                </button>

            }
            </div>
          </div>
        </section>

      </form>

      {/* 👉 Dialog form 👈 */}
      <dialog ref={dialogRef} className="relative overflow-clip animate__animated animate__zoomIn animate__faster focus:outline-none backdrop:backdrop-brightness-75">

        {!loader && <span onClick={() => (dialogRef.current.close(), setCvIds([]), setAllCheck(false))} className="block p-1 bg-red-100 hover:bg-red-500 rounded-full hover:text-white cursor-pointer transition-all duration-200 absolute top-2 right-2"><RxCross2 /></span>}
        <div className=' z-50 px-6 py-4 flex flex-col gap-4 '>
          <div className='flex flex-col items-between justify-center'>
            <div className='w-full flex flex-col items-center mb-4 pb-2 border-b'>
              <span className='text-green-500 p-2 block rounded-full drop-shadow-md shadow-green-300'><FiAlertCircle size={25} /></span>
              <span className='font-semibold'>{getData?.officer_name} Cash Collection Details</span>
            </div>

            {/* 👉 Details 👈 */}
            <div className='grid grid-cols-12 items-center gap-x-4 gap-y-2 text-sm'>

              <div className='col-span-12 md:col-span-6 grid grid-cols-12 items-center gap-x-1'>
                <div className='col-span-6 font-semibold'>Officer Name: </div>
                <div className='col-span-6'>{nullToNA(getData?.officer_name)}</div>
              </div>

              <div className='col-span-12 md:col-span-6 grid grid-cols-12 items-center gap-x-1'>
                <div className='col-span-6 font-semibold'>Mobile No.: </div>
                <div className='col-span-6'>{nullToNA(getData?.mobile)}</div>
              </div>

              {/* <div className='col-span-12 md:col-span-6 grid grid-cols-12 items-center gap-x-1'>
                <div className='col-span-6 font-semibold'>Role Name: </div>
                <div className='col-span-6'>{nullToNA(getData?.role_name)}</div>
              </div> */}

              <div className='col-span-12 md:col-span-6 grid grid-cols-12 items-center gap-x-1'>
                <div className='col-span-6 font-semibold'>Total Amount: </div>
                <div className='col-span-6'>{indianAmount(getData?.penalty_amount)}</div>
              </div>

            </div>

            <div className='w-full mt-4 mb-2'>
              <div className='font-semibold '>

                <span>Collection List (Date : {getData?.date})</span>

                {!loader2 && Array.isArray(cvData?.tranDtl) && cvData?.tranDtl?.length > 0 &&
                  <button onClick={() => verifyFun()} className='font-normal text-sm float-right bg-green-500 px-3 py-1 rounded-sm shadow-lg hover:shadow-xl hover:bg-green-600 hover:text-white text-white flex items-center mb-1'>Verify</button>
                }

              </div>

              {/* 👉 List Screen 👈 */}
              <div className='flex flex-col h-[60vh] w-full overflow-y-auto md:overflow-x-hidden'>

                {/* 👉 List Heading 👈 */}
                <div className='w-full grid grid-cols-12 items-center gap-2 bg-slate-500 text-white font-semibold border border-slate-200 px-4 py-2'>
                  <div className="col-span-2 text-sm">Sl.No.</div>
                  <div className="col-span-3 text-sm">Transaction No</div>
                  <div className="col-span-3 text-sm">Transaction Date</div>
                  <div className="col-span-2 text-sm">Amount</div>
                  <div className='col-span-2 text-sm flex'>
                    <span>Action</span>
                    {!loader2 && Array.isArray(cvData?.tranDtl) && cvData?.tranDtl?.length > 0 &&
                      <label class="inline-flex items-center px-4 animate__animated animate__fadeIn animate__faster">
                        <input type="checkbox" name='cashAll' checked={allCheck} onChange={(e) => handleCheckBox(e)} class="cursor-pointer form-checkbox h-5 w-5 text-slate-800" />
                      </label>}
                  </div>
                </div>


                {/* 👉 List Loader 👈 */}
                {
                  loader2 && <ShimmerEffectInline />
                }

                {/* 👉 All List 👈 */}
                {
                  !loader2 && Array.isArray(cvData?.tranDtl) &&
                  cvData?.tranDtl?.map((elem, index) =>
                    <>
                      <div key={index} className='w-full text-sm grid grid-cols-12 items-center gap-2 bg-slate-100 border-b hover:bg-white pb-1 p-4 animate__animated animate__fadeIn animate__faster'>
                        <div className='col-span-2'>{index + 1}</div>
                        <div className="col-span-3">{nullToNA(elem?.tran_no)}</div>
                        <div className="col-span-3">{indianDate(elem?.tran_date)}</div>
                        <div className="col-span-2">{indianAmount(elem?.total_amount)}</div>
                        <div className='col-span-2'>
                          <label class="inline-flex items-center justify-end px-4">
                            <input type="checkbox" name='cashSingle' checked={allCheck || checkId(elem?.id) ? true : null} value={elem?.id} onChange={(e) => handleCheckBox(e, elem?.id)} class="cursor-pointer form-checkbox h-5 w-5 text-slate-800" />
                          </label>
                        </div>
                      </div>
                    </>
                  )
                }

                {/* 👉 Message for list when no data available 👈 */}
                {
                  !loader2 && Array.isArray(dataList) && dataList?.length == 0 &&
                  <div className='w-full text-center text-red-400 font-semibold pb-1 p-4'>
                    No List Available
                  </div>
                }

              </div>
            </div>

          </div>

        </div>
      </dialog>


      {/* 👉 List Loader 👈 */}
      {
        loader && <ShimmerEffectInline />
      }

      {!loader && Array.isArray(dataList) && dataList?.length > 0 &&
        <ListTable dataList={dataList} columns={columns} />
      }


    </>
  );
}


export default CashVerificationIndex