///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : UserMaster
// 👉 Date        : 21-09-2023
// 👉 Status      : Close
// 👉 Description : CRUD opeartion for department, section and violation master.
// 👉 Functions   :  
//                  1. activateBottomErrorCard -> Activate error card to show in screen.
//                  2. handleModal             -> To handle dialog type.
//                  3. getViolationList        -> To get violation list.
//                  4. inputBox                -> To map input field.
//                  5. submitFun               -> Submit final data
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useEffect, useRef, useState } from "react";
import ListTable from "@/Components/Common/ListTable/ListTable";
import { CgPlayListAdd } from "react-icons/cg";
import ApiHeader from "@/Components/api/ApiHeader";
import useSetTitle from "@/Components/Common/useSetTitle";
import AxiosInterceptors from "@/Components/Common/AxiosInterceptors";
import ProjectApiList from "@/Components/api/ProjectApiList";
import { checkErrorMessage, checkSizeValidation, indianAmount, indianDate, nullToNA } from "@/Components/Common/PowerupFunctions";
import ShimmerEffectInline from "@/Components/Common/Loaders/ShimmerEffectInline";
import BarLoader from "@/Components/Common/Loaders/BarLoader";
import BottomErrorCard from "@/Components/Common/BottomErrorCard";
import { RxCross2 } from "react-icons/rx";
import * as yup from 'yup'
import { useFormik } from "formik";
import { FiAlertCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import ApiHeader2 from "@/Components/api/ApiHeader2";

const UserMaster = () => {

  // 👉 To Set Title 👈
  useSetTitle('Violation Master')

  // 👉 API constants 👈
  const {
    api_addRole,
    api_updateRole,
    api_deletedRole,
    api_listRole,
    api_addUser,
    api_updateUser,
    api_deletedUser,
    api_listUser,
  } = ProjectApiList()


  // 👉 Dialog useRef 👈
  const dialogRef = useRef()

  // 👉 State constants 👈
  const [loader, setLoader] = useState(false)
  const [loader2, setLoader2] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorState, setErrorState] = useState(false)
  const [modalType, setModalType] = useState('')
  const [dId, setdId] = useState(null)
  const [dataList, setDataList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [editData, setEditData] = useState(null)
  const [sLoader, setsLoader] = useState(false)
  const [mType, setMType] = useState('role')
  const [document, setDocument] = useState(null)

  // 👉 CSS constants 👈
  const editButton = "border border-sky-800 text-sky-800 mx-1 px-3 py-1 rounded-sm shadow-lg hover:shadow-xl hover:bg-sky-800 hover:text-white"
  const deleteButton = "border border-red-300 text-red-400 mx-1 px-3 py-1 rounded-sm shadow-lg hover:shadow-xl hover:bg-red-800 hover:text-white"
  const addButton = "float-right bg-[#1A4D8C] px-3 py-1 rounded-sm shadow-lg hover:shadow-xl hover:bg-[#113766] hover:text-white text-white flex items-center"
  const labelStyle = 'text-gray-800 text-sm'
  const inputStyle = 'border focus:outline-none drop-shadow-sm focus:drop-shadow-md px-4 py-1 text-gray-700 shadow-black placeholder:text-sm'
  const fileStyle = 'block w-full border focus:outline-none drop-shadow-sm focus:drop-shadow-md p-1 text-sm text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-sm file:border file:text-xs file:font-semibold file:bg-zinc-100 hover:file:bg-zinc-200'

  const buttonStyle = (color) => {
    return `px-4 py-1 text-sm bg-${color}-500 hover:bg-${color}-600 select-none rounded-sm hover:drop-shadow-md text-white`
  }

  const tabButtonStyle = (status) => {
    return `border border-slate-700 ${status ? 'bg-slate-700 text-white' : 'text-slate-700 shadow-2xl shadow-slate-700'} mx-1 px-3 py-1 rounded-sm hover:bg-slate-700 hover:text-white text-sm`
  }

  // 👉 Function 1 👈
  const activateBottomErrorCard = (state, message) => {
    setErrorState(state)
    setErrorMessage(message)
  }

  // 👉 Function 2 👈
  const handleModal = (type, data = null) => {

    setModalType(type)

    console.log(type, ":::::::::", data)

    switch (type) {
      case 'add': {

      } break;

      case 'edit': {
        setEditData(data)

        if (mType == 'role') {
          formik.setFieldValue('role', data?.role_name)
        }
        if (mType == 'user') {

          formik.setFieldValue('firstName', data?.first_name)
          formik.setFieldValue('middleName', data?.middle_name)
          formik.setFieldValue('lastName', data?.last_name)
          formik.setFieldValue('mobileNo', data?.mobile_no)
          formik.setFieldValue('email', data?.email)
          formik.setFieldValue('designation', data?.designation)
          formik.setFieldValue('employeeCode', data?.employee_code)
          formik.setFieldValue('address', data?.address)
          formik.setFieldValue('signature', data?.signature)

        }

      } break;

      case 'delete': {
        setdId(data)
      } break;
    }

    dialogRef.current.showModal()
  }

  // 👉 Table Columns 👈
  const RCOLUMNS = [
    {
      Header: "#",
      Cell: ({ row }) => <div className="pr-2">{row?.index + 1}</div>,
    },
    {
      Header: "Roles",
      accessor: 'role_name',
      Cell: ({ cell }) => (nullToNA(cell.row.original?.role_name)),
    },
    {
      Header: "Created At",
      accessor: 'date',
      Cell: ({ cell }) => (indianDate(cell.row.original?.date)),
    },
    {
      Header: "Action",
      accessor: "id",
      Cell: ({ cell }) => (
        <div className="flex flex-row flex-wrap gap-2">
          <button
            onClick={() => handleModal('edit', cell?.row?.original)}
            className={editButton}
          >
            Edit
          </button>

          <button
            onClick={() => handleModal('delete', cell?.row?.original?.id)}
            className={deleteButton}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const UCOLUMNS = [
    {
      Header: "#",
      Cell: ({ row }) => <div className="pr-2">{row?.index + 1}</div>,
    },
    {
      Header: "User Name",
      accessor: "user_name",
      Cell: ({ cell }) => (nullToNA(cell.row.original?.user_name)),
    },
    {
      Header: "E-mail",
      accessor: "email",
      Cell: ({ cell }) => (nullToNA(cell.row.original?.email)),
    },
    {
      Header: "Password",
      accessor: "password",
      Cell: ({ cell }) => (nullToNA(cell.row.original?.password)),
    },
    {
      Header: "Created At",
      accessor: "date",
      Cell: ({ cell }) => (indianDate(cell.row.original?.date)),
    },
    {
      Header: "Action",
      accessor: "id",
      Cell: ({ cell }) => (
        <div className="flex flex-row flex-wrap gap-2">
          <button
            onClick={() => handleModal('edit', cell?.row?.original)}
            className={editButton}
          >
            Edit
          </button>

          <button
            onClick={() => handleModal('delete', cell?.row?.original?.id)}
            className={deleteButton}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];


  // 👉 Form Fields JSON 👈
  const basicForm = [
    {
      title: "Role",
      key: "role",
      width: ` w-full ${mType == 'role' ? 'block ' : 'hidden '}`,
      type: (mType == 'role' ? 'text' : 'select'),
      hint: "Enter role",
      required: true,
      options: roleList,
      okey: 'id',
      ovalue: 'role_name',
      required: mType == 'role' && true
    },
    {
      title: "First Name",
      key: "firstName",
      width: `md:w-[31%] w-full ${mType == 'user' ? 'block ' : 'hidden '}`,
      type: 'text',
      hint: "Enter first name",
      required: mType == 'user' && true
    },
    {
      title: "Middle Name",
      key: "middleName",
      width: `md:w-[31%] w-full ${mType == 'user' ? 'block ' : 'hidden '}`,
      type: 'text',
      hint: "Enter middle name",
      required: mType == 'user' && true
    },
    {
      title: "Last Name",
      key: "lastName",
      width: `md:w-[31%] w-full ${mType == 'user' ? 'block ' : 'hidden '}`,
      type: 'text',
      hint: "Enter last name",
      required: mType == 'user' && true
    },
    {
      title: "Mobile No.",
      key: "mobileNo",
      width: `md:w-[31%] w-full ${mType == 'user' ? 'block ' : 'hidden '}`,
      type: 'text',
      hint: "Enter mobile no.",
      required: mType == 'user' && true
    },
    {
      title: "E-Mail",
      key: "email",
      width: `md:w-[31%] w-full ${mType == 'user' ? 'block ' : 'hidden '}`,
      type: 'email',
      hint: "Enter email",
      required: mType == 'user' && true
    },
    {
      title: "Employee Code",
      key: "employeeCode",
      width: `md:w-[31%] w-full ${mType == 'user' ? 'block ' : 'hidden '}`,
      type: 'text',
      hint: "Enter employee code",
      required: mType == 'user' && true
    },
    {
      title: "Designation",
      key: "designation",
      width: `md:w-[48%] w-full ${mType == 'user' ? 'block ' : 'hidden '}`,
      type: 'text',
      hint: "Enter designation",
      required: mType == 'user' && true
    },

    {
      title: "Upload Signature",
      key: "signature",
      width: `md:w-[48%] w-full ${mType == 'user' ? 'block ' : 'hidden '}`,
      type: 'file',
      hint: "Enter employee code",
      required: false
    },
    {
      title: "Address",
      key: "address",
      width: ` w-full ${mType == 'user' ? 'block ' : 'hidden '}`,
      type: 'text',
      hint: "Enter address",
      required: mType == 'user' && true
    },
  ]

  // 👉 Formik validation schema 👈
  const schema = yup.object().shape(
    [...basicForm]?.reduce((acc, elem) => {

      if (elem?.required) {
        acc[elem.key] = yup.string().required(elem?.hint)
      }

      return acc;
    }, {})
  );

  // 👉 Formik initial values 👈
  const initialValues = {
    role: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    designation: "",
    employeeCode: "",
    address: "",
    signature: ""
  }

  // 👉 Formik constant 👈
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      submitFun(values)
    }
  })

  // 👉 Function 3 👈
  const getUserList = () => {

    setDataList([])

    setLoader(true)

    let url;

    if (mType == 'role') {
      url = api_listRole
    }
    if (mType == 'user') {
      url = api_listUser
    }

    AxiosInterceptors
      .post(url, {}, ApiHeader())
      .then((res) => {
        if (res?.data?.status) {
          setDataList(res?.data?.data)
        } else {
          activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
        }
        console.log('user role list response => ', res)
      })
      .catch((err) => {
        activateBottomErrorCard(true, 'Server Error! Please try again later.')
        console.log('error user role list => ', err)
      })
      .finally(() => {
        setLoader(false)
      })
  }

  // 👉 Function 4 👈
  const inputBox = (key, title = '', type, width = '', hint = '', required = false, options = [], okey = '', ovalue = '') => {
    return (
      <div className={`flex flex-col ${width} `}>
        {title != '' && <label htmlFor={key} className={labelStyle}>{title} {required && <span className='text-red-500 text-xs font-bold'>*</span>} : </label>}
        {type != 'select' && type != 'file' && <input {...formik.getFieldProps(key)} type={type} className={inputStyle + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`} name={key} id="" placeholder={hint} />}
        {type == 'file' && <input {...formik.getFieldProps(key)} type={type} className={fileStyle + `${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 text-red-400 file:border-red-200 file:text-red-400' : ' focus:border-zinc-300 border-zinc-200 file:border-zinc-300 file:text-gray-600'}`} name={key} id="" placeholder={hint} accept=".jpg, .jpeg, .png" />}
        {type == 'select' && <select {...formik.getFieldProps(key)} className={inputStyle + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 text-red-400' : ' focus:border-zinc-300 border-zinc-200 '}`}>
          {
            sLoader ?
              <option>Loading...</option>
              :
              <>
                <option value={null}>Select</option>
                {
                  (typeof options === 'object') && options?.map((elem) => <option className='' value={elem[okey]}>{elem[ovalue]}</option>)
                }
              </>
          }
        </select>}
      </div>
    );
  }

  // 👉 Function 5 👈
  const submitFun = (values) => {

    setLoader2(true)

    dialogRef.current.close()

    console.log(modalType, values)

    let payload;
    let url;
    let fd = new FormData()

    switch (modalType) {
      case 'add': {

        if (mType == 'role') {
          payload = {
            roleName: values?.role
          }
          url = api_addRole
        }
        if (mType == 'user') {

          fd.append('firstName', values?.firstName)
          fd.append('middleName', values?.middleName)
          fd.append('lastName', values?.lastName)
          fd.append('mobileNo', values?.mobileNo)
          fd.append('email', values?.email)
          fd.append('designation', values?.designation)
          fd.append('employeeCode', values?.employeeCode)
          fd.append('address', values?.address)
          fd.append('signature', document)

          url = api_addUser
        }

      } break;

      case 'edit': {

        if (mType == 'role') {
          payload = {
            roleId: editData?.id,
            roleName: values?.role
          }
          url = api_updateRole
        }
        if (mType == 'user') {

          fd.append('id', editData?.id)
          fd.append('firstName', values?.firstName)
          fd.append('middleName', values?.middleName)
          fd.append('lastName', values?.lastName)
          fd.append('mobileNo', values?.mobileNo)
          fd.append('email', values?.email)
          fd.append('designatioin', values?.designatioin)
          fd.append('employeeCode', values?.employeeCode)
          fd.append('address', values?.address)
          fd.append('signature', document)

          url = api_updateUser
        }

      } break;

      case 'delete': {

        if (mType == 'role') {
          url = api_deletedRole
          payload = {
            roleId: dId
          }
        }
        if (mType == 'user') {
          url = api_deletedUser
          payload = {
            userId: dId
          }
        }

      } break;
    }

    AxiosInterceptors
      .post(url, mType == 'user' ? fd : payload, mType == 'user' ? ApiHeader2() : ApiHeader())
      .then((res) => {
        if (res?.data?.status) {
          toast.success(res?.data?.message)
          getUserList()
        } else {
          activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
        }
        console.log('fp violation response => ', res)
      })
      .catch((err) => {
        activateBottomErrorCard(true, 'Server Error! Please try again later.')
        console.log('error violation list => ', err)
      })
      .finally(() => {
        setLoader2(false)
        formik.resetForm()
      })
  }

  const getRoleList = () => {

    setsLoader(true)

    AxiosInterceptors
      .post(api_listRole, {}, ApiHeader())
      .then((res) => {
        if (res?.data?.status) {
          setRoleList(res?.data?.data)
        } else {
        }
        console.log('fp department list response => ', res)
      })
      .catch((err) => {
        console.log('error fp department list => ', err)
      })
      .finally(() => {
        setsLoader(false)
      })
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name == 'signature') {
      let file = e?.target?.files[0];
      if (!checkSizeValidation(file)) {
        formik.setFieldValue('signature', '')
        return;
      }
      setDocument(file)
    }

  }

  // 👉 To call Function 3 👈
  useEffect(() => {
    mType != 'department' && getRoleList()
    getUserList()
  }, [mType])

  return (
    <>

      {/* 👉 Loader 👈 */}
      {loader2 && <BarLoader />}

      {/* 👉 Error Card 👈 */}
      {errorState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={errorMessage} />}

      <div className="poppins p-4 px-6">

        {/* 👉 Heading 👈 */}
        <div className="uppercase font-semibold text-gray-700 text-2xl py-2 text-center tracking-[0.5rem]">
          User Role Master
        </div>

        <div className="w-full h-[0.15rem] bg-gray-400 mb-6"></div>

        <div className="flex gap-1 w-full flex-wrap my-6">
          <button onClick={() => setMType('role')} className={tabButtonStyle(mType == 'role')}>Role Master</button>
          <button onClick={() => setMType('user')} className={tabButtonStyle(mType == 'user')}>User Master</button>
        </div>


        {/* 👉 Table Loader 👈 */}
        {loader && <ShimmerEffectInline />}

        {/* 👉 Table 👈 */}
        {!loader &&
          <>
            {dataList?.length > 0 ?

              <>
                <button onClick={() => handleModal('add')} className={addButton + 'capitalize flex gap-1 items-center'} >
                  <CgPlayListAdd /> Add <span className="capitalize">{mType}</span>
                </button>

                {
                  mType == 'role' &&
                  <ListTable
                    columns={RCOLUMNS}
                    dataList={dataList}
                  />
                }
                {
                  mType == 'user' &&
                  <ListTable
                    columns={UCOLUMNS}
                    dataList={dataList}
                  />
                }

              </>
              :
              <>
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => handleModal('add')}
                    className={addButton + 'capitalize flex gap-1 items-center'}
                  >
                    <CgPlayListAdd /> Add <span className="capitalize">{mType}</span>
                  </button>
                </div>
                <div className="bg-red-100 text-red-500 py-2 text-lg font-semibold text-center border border-red-500 drop-shadow-sm">Oops! No Data Found.</div>
              </>}

          </>}
      </div>

      {/* 👉 Dialog form 👈 */}
      <dialog ref={dialogRef} className={`relative overflow-clip animate__animated animate__zoomIn animate__faster w-full ${mType != 'user' ? 'md:w-[20rem]' : 'md:w-[50rem]'}`}>

        {/* 👉 Cross button 👈 */}
        {modalType != 'delete' && <span onClick={() => (dialogRef.current.close(), formik.resetForm())} className="block p-1 bg-red-100 hover:bg-red-500 rounded-full hover:text-white cursor-pointer transition-all duration-200 absolute top-2 right-2"><RxCross2 /></span>}

        {/* 👉 Form 👈 */}
        {modalType != 'delete' && <form onChange={(e) => (formik.handleChange(e), handleChange(e))} onSubmit={formik.handleSubmit} className="p-4 px-8 py-6 shadow-lg">
          <section className='flex flex-row justify-between gap-4 flex-wrap'>

            <header className='w-full font-semibold text-xl capitalize text-sky-700 border-b pb-1 text-center'>
              {modalType} {mType}
            </header>

            {modalType == 'edit' && mType == 'user' && <div className="w-full flex gap-2 items-center flex-wrap text-sm">Signature: <img src={editData?.photo} alt="Signature" srcset="" /></div>}

            {
              basicForm?.map((elem) => {
                return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, elem?.options, elem?.okey, elem?.ovalue)
              })
            }

          </section>

          <footer className="mt-4 flex justify-center">
            <button type="submit" className={buttonStyle('green')}>{modalType == 'add' && 'Add'}{modalType == 'edit' && 'Update'}</button>
          </footer>

        </form>}

        {/* 👉 Delete Box 👈 */}
        {
          modalType == 'delete' &&
          <>
            <div className=' z-50 px-6 py-4 flex flex-col gap-4 '>
              <div className='flex items-center gap-6'>
                <span className='text-red-500 bg-red-100 p-2 block rounded-full drop-shadow-md shadow-red-300'><FiAlertCircle size={25} /></span>
                <div className='flex flex-col gap-2'>
                  <span className='text-xl font-semibold border-b pb-1'>Confirmation Box</span>
                  <span className='text-base'>Are you sure want to delete ?</span>
                </div>
              </div>
              <div className='flex justify-end gap-2'>
                <button className='text-white bg-slate-400 hover:bg-slate-500 px-4 py-1 text-sm ' onClick={() => dialogRef.current.close()}>No</button>
                <button className='text-white bg-red-500 hover:bg-red-600 px-4 py-1 text-sm ' onClick={() => submitFun()}>Yes</button>
              </div>
            </div>
          </>
        }

      </dialog>

    </>
  );
}
export default UserMaster;