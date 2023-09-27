///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : PilotWorkflowInboxList
// 👉 Status      : Close
// 👉 Description : This component is to view application list.
// 👉 Functions   :  
//                  1. getAllList  -> To fetch all list.
//                  2. fetchData   -> To fetch with some payload.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import ListTableConnect from "@/Components/Common/ListTableBP/ListTableConnect";
import { useFormik } from "formik";
import { useState } from "react";
import { RiFilter2Line } from "react-icons/ri";
import { RotatingLines } from "react-loader-spinner";
import * as yup from 'yup'

function PilotWorkflowInboxList(props) {

  // 👉 Getting props column 👈
  let columnSchema = [...props?.COLUMNS]

  // 👉 Appending column 👈
  columnSchema = [
    ...columnSchema,
    {
      Header: "Action",
      Cell: ({ cell }) => (
        <button
          onClick={() => {
            props.fun(cell?.row?.original?.id)
          }}
          className="bg-sky-200 px-3 py-1 rounded-lg shadow-lg hover:shadow-xl hover:bg-sky-800 
            hover:text-white text-black"
        >
          View
        </button>
      ),
    }]

  // 👉 State constans 👈
  const [requestBody, setrequestBody] = useState({})
  const [changeData, setchangeData] = useState(0)
  const [loader, setloader] = useState(false);
  const [viewAll, setviewAll] = useState(false)

  // 👉 Formik validation schema 👈
  const validationSchema = yup.object({
    searchBy: yup.string().required("Select filter type"),
    entry: yup.string().required("Enter the parameter"),
  });

  const formik = useFormik({
    initialValues: {
      searchBy: "",
      entry: "",
    },
    onSubmit: (values) => {
      fetchData(values)
    },
    validationSchema,
  });

  // 👉 Function 1 👈
  const getAllList = () => {

    formik.setFieldValue('searchBy', '')
    formik.setFieldValue("entry", '')

    setrequestBody({})

    setviewAll(false)

    setchangeData(prev => prev + 1)

  }

  // 👉 Function 2 👈
  const fetchData = (data) => {
    setviewAll(true)
    setrequestBody({
      [data?.searchBy]: data?.entry
    })

    setchangeData(prev => prev + 1)

  };

  return (
    <>

      {/* 👉 Searching Form 👈 */}
      <form onSubmit={formik.handleSubmit} onChange={formik.handleChange} className="bg-white poppins">

        <div className="flex flex-row flex-wrap gap-x-4 items-center gap-y-2 pb-4 mb-2 border-b">

          <div className='w-full md:w-[25%]'>
            <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">
              Filter By<span className="text-red-500">*</span>
            </label>
            <select
              {...formik.getFieldProps('searchBy')}
              className={`${formik.errors.searchBy ? 'text-red-500 font-semibold border border-solid border-red-600 placeholder-red-300 shadow-red-100 ' : 'text-gray-700 font-normal border border-solid border-gray-400 placeholder-gray-400 '} cursor-pointer w-full px-3 py-1 text-sm  bg-white bg-clip-padding rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none shadow-md`}
            >
              <option value="">Select</option>
              <option value="applicationNo">Application Number</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className='w-full md:w-[25%] '>
            <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">

              Parameter
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...formik.getFieldProps('entry')}
              placeholder='Enter the parameter'
              className=" w-full px-3 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-gray-400 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-400 shadow-md"
            />
          </div>

          {/* 👉 Search Button 👈 */}
          <div className="mt-4 w-full md:w-[30%] flex flex-row flex-wrap items-center gap-x-4 gap-y-2 md:mt-6">
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

            {/* 👉 View All Button 👈 */}
            {viewAll && <div className=' ' onClick={() => getAllList()}>
              {
                !loader &&
                <div
                  className="cursor-pointer text-center w-full border border-indigo-600 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg rounded-sm text-sm font-semibold px-5 py-1"
                >

                  View All Applications
                </div>}
            </div>}

          </div>
        </div>
      </form>

      {/* 👉 Table 👈 */}
      <ListTableConnect
        api={props?.api?.url} // sending api
        columns={columnSchema} // sending column
        requestBody={requestBody}
        changeData={changeData} // sending body
        search={false}
        loader={status => setloader(status)}
      />

    </>
  );
}

export default PilotWorkflowInboxList;

