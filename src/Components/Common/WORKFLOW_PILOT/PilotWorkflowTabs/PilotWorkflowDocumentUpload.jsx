///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : PilotWorkflowDocumentUpload
// 👉 Status      : Open
// 👉 Description : This component is for document upload.
// 👉 Functions   :  
//                  1. openModal2              -> 
//                  2. openModal               -> 
//                  2. closeModal              -> 
//                  2. fetchDocumentsToUpload  -> 
//                  2. handleChange            -> 
//                  2. submitData              -> 
//                  2. modalFun                -> 
//                  2. handleChange2           -> 
//                  2. filterModalDocumentData -> 
//                  2. checkImage              -> 
///////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import folder from "@/Components/assets/folders.png";
import photo from "@/Components/assets/photo.png";
import Modal from "react-modal";
import { useEffect } from "react";
import axios from "axios";
import ApiHeader2 from "@/Components/api/ApiHeader2";
import { toast } from "react-hot-toast";
import ApiHeader from "@/Components/api/ApiHeader";
import { FcDocument } from 'react-icons/fc'
import BarLoader from "@/Components/Common/Loaders/BarLoader";
import { checkSizeValidation, nullToNA } from "@/Components/Common/PowerupFunctions";
import { buttonActionTableBorder } from "@/Components/Common/Styles";
import { RxCross2 } from "react-icons/rx";

const customStyles = {
  content: {
    top: "50%",
    left: "52%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "none",
  },
};

Modal.setAppElement("#root");

function PilotWorkflowDocumentUpload(props) {

  const [loader, setloader] = useState(false);
  const [docUpload, setdocUpload] = useState(null);
  const [refresh, setrefresh] = useState(0);
  const [modal, setmodal] = useState(false);
  const [docUrl, setdocUrl] = useState('')
  const [preview, setpreview] = useState(1)
  const [valRefresh, setvalRefresh] = useState(0)
  const [imageUrl, setimageUrl] = useState()
  const [fileName, setfileName] = useState('')
  const [tempDoc, settempDoc] = useState(false)
  const [documentListToUpload, setdocumentListToUpload] = useState()
  const [currentOwnerUploadModalData, setcurrentOwnerUploadModalData] = useState()

  const [currentOwnerId, setcurrentOwnerId] = useState(null)
  const [currentDocCategory, setcurrentDocCategory] = useState(null)
  const [docType, setdocType] = useState('')
  const [errorImage, seterrorImage] = useState([])

  // TO MANAGE DOCUMENT
  const ownerDocTypeRef = useRef([])
  const propertyDocTypeRef = useRef([])
  const ownerDocRef = useRef([])
  const propertyDocRef = useRef([])

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpen2, setIsOpen2] = useState(false);

  const openModal2 = () => setIsOpen2(true)

  // THIS MODAL FIRST FILTER OUT THE CLICKED OWNER DOC LIST AND OWNER ID WITH filterModalDocumentData 
  const openModal = (ownerId, rowIndex) => {
    filterModalDocumentData(rowIndex)
    setcurrentOwnerId(ownerId)
    setvalRefresh(valRefresh + 1)
    setmodal(true)
    setIsOpen(true);
  }

  const closeModal = (type) => {
    setcurrentOwnerId(null)
    settempDoc(false)
    type != 'view' && setIsOpen(false);
    type == 'view' && setIsOpen2(false)
    setmodal(false)
    setpreview(preview + 1)
    ownerDocTypeRef.current = []
    ownerDocRef.current = []
    propertyDocTypeRef.current = []
    propertyDocRef.current = []
    console.log('modal m end => ', modal, tempDoc)
  }

  useEffect(() => {
    fetchDocumentsToUpload()
  }, [])

  const fetchDocumentsToUpload = () => {
    console.log('before fetch upload doc')
    setloader(true)
    axios
    [props?.api?.api_uploadDocumentShow?.method](props?.api?.api_uploadDocumentShow?.url, { applicationId: props?.id }, ApiHeader())
      .then((res) => {
        console.log("list of doc to upload at pilotworkflowdocumentupload => ", res?.data);
        if (res?.data?.status) {
          setdocumentListToUpload(res?.data?.data)
          // ALL DOCUMENT UPLOAD STATUS TO SEND LEVEL RESTRICT
          props?.setallDocumentUploadStatus(res?.data?.data?.docUploadStatus)
        } else {
          props?.activateBottomErrorCard(true, res?.data?.message)

        }
        setloader(false)

      })
      .catch((err) => {
        console.log("data submission error bo doc upload => ", err);
        props?.activateBottomErrorCard(true, 'Some error occured while fetching document list. Please try again later')

        setmodal(false);
        setloader(false)
      })
  }

  const validationSchema = yup.object({
    docId: yup.number().required("Select document type"),
    docUpload: yup.string().required("Select document")
  })
  const formik = useFormik({
    initialValues: {
      docId: '',
      docUpload: '',
      docName: ''
    },

    onSubmit: async (values) => {
      submitData()
    }
    , validationSchema
  })

  const handleChange = (e, type, index) => {
    let file = e.target.files[0];
    setfileName(e.target.name)
    setimageUrl(URL.createObjectURL(e.target.files[0]))
    setdocUpload(e.target.files[0]);
    if (type == 'owner') {
      ownerDocRef.current[index] = e.target.files[0]?.name
    } else {
      propertyDocRef.current[index] = e.target.files[0]?.name
    }
    formik.setFieldValue('docUpload', URL.createObjectURL(e.target.files[0]))
    console.log("use effect change ", formik.values.docId, formik.values.docUpload)
    console.log(
      "file on change bo doc upload => ",
      file,
      "and doc upload => ",
      docUpload, "and url => ", imageUrl, "and name => ", file?.name, "file name => ", fileName
    );

  };

  const submitData = (docRefName, index, module) => {
    console.log("use effect 3 => ", ownerDocRef.current[index], "\n index => ", index, "\n module => ", module, docRefName)
    let docTypeInputs
    if (module === 'property') {
      docTypeInputs = propertyDocTypeRef.current;
    } else {
      docTypeInputs = ownerDocTypeRef.current;
    }
    // Retrieve the values of all inputs within the clicked row
    const docTypeValues = docTypeInputs.map((input, rowIndex) => {
      if (rowIndex === index) {
        return input.value;
      }
      return '';
    });

    console.log('current select document is....', docTypeValues[index])

    // return

    if ((docTypeValues[index] === null || docTypeValues[index] === "Select" || docTypeValues[index] === "")) {
      props?.activateBottomErrorCard(true, `Select document type for ${docRefName}`)
      setcurrentOwnerId(null)
      return
    }

    if ((docTypeValues[index] === null || docTypeValues[index] === "Select" || docTypeValues[index] === "")) {
      props?.activateBottomErrorCard(true, `Select document type for ${docRefName}`)
      setcurrentOwnerId(null)
      return
    }

    if (module == 'owner' && (ownerDocRef.current[index] == null || ownerDocRef.current[index] == "" || ownerDocRef.current[index] == undefined)) {
      props?.activateBottomErrorCard(true, `Select document to upload for ${docRefName}`)
      ownerDocRef.current[index] = null;
      return
    }
    if (module == 'property' && (propertyDocRef.current[index] == null || propertyDocRef.current[index] == "" || propertyDocRef.current[index] == undefined)) {
      props?.activateBottomErrorCard(true, `Select document to upload for ${docRefName}`)
      propertyDocRef.current[index] = null;
      return
    }




    if (docUpload == null) {
      props?.activateBottomErrorCard(true, `Select document to upload for ${docRefName}`)
      return
    }

    if (!checkSizeValidation(docUpload)) {
      props?.activateBottomErrorCard(true, `File is too large for ${docRefName}`)
      setdocUpload(null)
      return
    }


    console.log("doc ref name...", docRefName)
    let fd = new FormData();
    console.log("document  => ", docUpload);

    fd.append("applicationId", props?.id);
    if (currentOwnerId != null) {
      fd.append("ownerId", currentOwnerId);
    }
    fd.append(`docCode`, docTypeValues[index]);
    fd.append(`document`, docUpload);
    fd.append(`docName`, docRefName);
    fd.append(`docCategory`, currentDocCategory);

    if (docUpload != null) {
      closeModal()
      setloader(true)


      console.log('before fetch doc to upload...', fd)
      axios
      [props?.api?.api_uploadDocument?.method](props?.api?.api_uploadDocument?.url, fd, ApiHeader2())
        .then((res) => {
          console.log("data submitted bo doc upload => ", res.data);

          if (res?.data?.status) {
            toast.success("Document Uploaded Successfully !!");
            setmodal(false);
            setdocUpload('')
            setloader(false)
            setrefresh(refresh + 1)
            setfileName('')
            formik.setFieldValue("docUpload", "")
            props.refresh()
            // RESETTING DATA FOR REUPLOAD
            setcurrentOwnerId(null)
            setcurrentDocCategory(null)
            // TO REFETCH UPLOAD DOCUMENT LIST TO UPDATE
            fetchDocumentsToUpload()
          }
          else {
            console.log('something went')
            props?.activateBottomErrorCard(true, res?.data?.message)

          }
          setloader(false)

        })
        .catch((err) => {
          console.log("data submission error bo doc upload => ", err);
          props?.activateBottomErrorCard(true, 'Some error occured while uploading document. Please try again later')
          setmodal(false);
          setloader(false)
        })
    } else {
      props?.activateBottomErrorCard(true, 'Please select file')
    }

  };


  const modalFun = (dn, type) => {
    console.log("getting doc name => ", dn)
    if (dn == '') {
      toast.error("File not uploaded !!!")
    }
    if (dn != '') {
      setdocUrl(dn)
      setdocType(type)
      openModal2()
      setpreview(preview + 1)
    }
  }

  const handleChange2 = (e, docName) => {
    setcurrentDocCategory(docName)
  }

  const filterModalDocumentData = (rowIndex) => {
    let modalDocData = documentListToUpload?.ownerDocs[rowIndex]
    console.log('select row....', modalDocData)
    setcurrentOwnerUploadModalData(modalDocData)
  }

  const checkImage = (id) => {
    return errorImage?.some(docId => docId == id)
  }

  return (
    <>

      {loader && (
        <div className="inline">
          <BarLoader />
        </div>
      )}

      <div className="overflow-x-auto ">

        <div className="px-4 font-semibold font-serif w-full">
          <span><img src={folder} alt="pin" className="w-8 inline" /> Bo Doc Upload</span>
        </div>

        <div className="bg-white">
          {/* ===================Owner documents ======================*/}
          {
            documentListToUpload?.ownerDocs &&
            <div className=" flex md:pl-4 bg-white font-sans overflow-x-auto mt-10">
              <div className="w-full lg:w-4/6">

                <h1 className="text-md font-semibold">Owner Documents</h1>

                <div className="bg-white shadow-md rounded my-2">

                  <table className="min-w-max w-full table-auto">

                    <thead>
                      <tr className="bg-sky-100 text-gray-600 capitalize text-sm leading-normal">
                        <th className="py-3 px-6 text-left cursor-pointer">
                          Applicant Image
                        </th>
                        <th className="py-3 px-6 text-left cursor-pointer">
                          Applicant Name
                        </th>
                        <th className="py-3 px-6 text-left cursor-pointer">
                          Guardian Name
                        </th>
                        <th className="py-3 px-6 text-left cursor-pointer">
                          Mobile
                        </th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-left">Action</th>
                      </tr>
                    </thead>

                    <tbody className="text-gray-600 text-sm font-light bg-white">

                      {documentListToUpload?.ownerDocs?.map((owner, index) => (

                        <tr className="border-b border-gray-200 ">

                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            <div className="flex items-center justify-center">

                              {owner?.ownerDetails?.uploadedDoc != '' &&
                                <div className="text-center cursor-pointer " onClick={() => modalFun(`${owner?.ownerDetails?.uploadedDoc}`, 'jpg', owner?.ownerDetails?.docId)}>
                                  <img src={checkImage(owner?.ownerDetails?.docId) ? photo : `${owner?.ownerDetails?.uploadedDoc}`} alt="" className="md:w-[3vw] w-[5vw]" srcset="" />
                                </div>
                              }
                              {
                                owner?.ownerDetails?.uploadedDoc == '' && <span className="text-red-500 font-semibold">Not Uploaded</span>
                              }

                            </div>
                          </td>

                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="font-medium">
                                {nullToNA(owner?.ownerDetails?.name)}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="font-medium">
                                {nullToNA(owner?.ownerDetails?.guardian)}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="font-medium">
                                {nullToNA(owner?.ownerDetails?.mobile)}
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`font-medium ${owner?.ownerDetails?.reqDocCount === owner?.ownerDetails?.uploadedDocCount ? 'text-green-400' : 'text-red-400'}`}>Uploaded {nullToNA(owner?.ownerDetails?.uploadedDocCount)} of {nullToNA(owner?.ownerDetails?.reqDocCount)}</span>
                            </div>
                          </td>

                          <td className="py-3 px-6">
                            <div className="font-semibold text-sm">
                              <div className="">
                                {!loader && <button
                                  onClick={() => openModal(owner?.ownerDetails?.ownerId, index)}
                                  type="button"
                                  className={`px-4 py-1 ${buttonActionTableBorder}`}
                                >
                                  View
                                </button>}
                              </div>
                            </div>
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>
            </div>
          }

          {/*  ========================= Property type =========================  */}
          <div className=" flex md:pl-4 bg-white font-sans overflow-x-auto mt-6">
            <div className="w-full lg:w-4/6">

              <h1 className="text-md font-semibold">Property Documents</h1>

              <div className="bg-white shadow-md rounded my-2">

                <table className="min-w-max w-full table-auto">

                  <thead>

                    <tr className="bg-sky-100 text-gray-600 capitalize text-sm leading-normal">

                      <th className="py-3 px-6 text-center">#</th>
                      <th className="py-3 px-6 text-left cursor-pointer">
                        Document Name
                      </th>
                      <th className="py-3 px-6 text-left">Type</th>
                      <th className="py-3 px-6 text-center">Document type</th>
                      <th className="py-3 px-6 text-center">Document</th>
                      <th className="py-3 px-6 text-center">Remarks</th>
                      <th className="py-3 px-6 text-center">Status</th>
                      <th className="py-3 px-6 text-center">Upload</th>

                    </tr>

                  </thead>

                  <tbody className="text-gray-600 text-sm font-light bg-white">

                    {documentListToUpload?.listDocs?.map((doc, index) => (

                      <tr className="border-b border-gray-200 " onSubmit={formik.handleSubmit} onChange={formik.handleChange}>

                        <td className="py-3 px-6 font-semibold">{index + 1}</td>

                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="mr-2 bg-white shadow-lg rounded-full p-2">
                              <img src={folder} alt="rain" className="w-4" />
                            </div>
                            <span className="font-medium" value={doc?.docName}>
                              {nullToNA(doc?.docName)}{(doc?.docType == 'OR' || doc?.docType == 'R') && <small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small>}
                            </span>

                          </div>
                        </td>

                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          {(doc?.docType == 'OR' || doc?.docType == 'R') ? <span className="font-semibold text-red-400">Required</span> : <span>Optional</span>}
                        </td>

                        <td className="py-3 px-6">
                          <div className="font-semibold text-sm">
                            <div className="">
                              <select
                                ref={el => (propertyDocTypeRef.current[index] = el)}
                                className="form-control block w-full px-3 py-1 text-base md:text-xs font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer shadow-md w-36"
                                name="docId"
                                disabled={((props?.isBtc && doc?.btcStatus) || (!props?.isBtc && !doc?.btcStatus && doc?.uploadedDoc == '') || (!props?.isBtc && props?.canUpload) || (documentListToUpload?.isCitizen != true && documentListToUpload?.isCitizen != 'true')) ? false : true}
                                onChange={(e) => handleChange2(e, doc?.docName)}
                              >
                                <option value={null} selected>
                                  Select
                                </option>
                                {doc?.masters?.map((data, selectIndex) => (
                                  <option value={data?.documentCode}>
                                    {data?.docVal}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-6 text-center relative">
                          {(doc?.uploadedDoc == '') ? <i className="font-semibold not-italic">NA</i> :

                            <div className="flex items-center justify-center font-semibold text-[26px] cursor-pointer" onClick={() => modalFun(`${doc?.uploadedDoc?.docPath}`, doc?.uploadedDoc?.docPath?.split('.')[doc?.uploadedDoc?.docPath?.split('.')?.length - 1], doc?.uploadedDoc?.uploadedDocId)}>
                              <div className="flex items-center">
                                {doc?.uploadedDoc?.docPath?.split('.')[doc?.uploadedDoc?.docPath?.split('.')?.length - 1] == 'pdf' &&
                                  <div className="flex-shrink-0 text-[28px] ">
                                    <FcDocument />
                                  </div>
                                }
                                {doc?.uploadedDoc?.docPath?.split('.')[doc?.uploadedDoc?.docPath?.split('.')?.length - 1] == 'jpg' &&
                                  <div className="flex-shrink-0 ">
                                    <img onError={() => seterrorImage(prev => [...prev, doc?.uploadedDoc?.uploadedDocId])} src={checkImage(doc?.uploadedDoc?.uploadedDocId) ? photo : `${doc?.uploadedDoc?.docPath}`} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                                  </div>
                                }
                                {doc?.uploadedDoc?.docPath?.split('.')[doc?.uploadedDoc?.docPath?.split('.')?.length - 1] == 'jpeg' &&
                                  <div className="flex-shrink-0 ">
                                    <img onError={() => seterrorImage(prev => [...prev, doc?.uploadedDoc?.uploadedDocId])} src={checkImage(doc?.uploadedDoc?.uploadedDocId) ? photo : `${doc?.uploadedDoc?.docPath}`} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                                  </div>
                                }
                                {doc?.uploadedDoc?.docPath?.split('.')[doc?.uploadedDoc?.docPath?.split('.')?.length - 1] == 'png' &&
                                  <div className="flex-shrink-0 ">
                                    <img onError={() => seterrorImage(prev => [...prev, doc?.uploadedDoc?.uploadedDocId])} src={checkImage(doc?.uploadedDoc?.uploadedDocId) ? photo : `${doc?.uploadedDoc?.docPath}`} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                                  </div>
                                }

                              </div>
                            </div>

                          }

                        </td>

                        <td className="py-3 px-6 text-center font-semibold">
                          {doc?.uploadedDoc == '' ? <i className="font-semibold not-italic">NA</i> : <>
                            <p className="whitespace-no-wrap">
                              {doc?.uploadedDoc?.verifyStatus == 0 && <>Pending</>}</p>
                            <p className="text-green-500 whitespace-no-wrap">
                              {doc?.uploadedDoc?.verifyStatus == 1 && <>Verified</>}</p>
                            <p className="text-red-500 whitespace-no-wrap">
                              {doc?.btcStatus === true && <>Rejected</>}
                            </p>
                          </>}
                        </td>

                        <td className="py-3 px-6 text-center">
                          {(doc?.uploadedDoc?.remarks == "" || doc?.uploadedDoc?.remarks == null) ? <i className="font-semibold not-italic">NA</i> : doc?.uploadedDoc?.remarks}
                        </td>

                        <td className="py-3 px-6 flex flex-wrap gap-2">

                          {(documentListToUpload?.isCitizen != true && documentListToUpload?.isCitizen != 'true') ? <>
                            {((props?.isBtc && doc?.btcStatus) || (!props?.isBtc && !doc?.btcStatus && doc?.uploadedDoc == '') || (!props?.isBtc && props?.canUpload)) ? <div className="font-semibold text-sm">
                              <div className="">
                                <input
                                  accept=".pdf,.jpg,.jpeg"
                                  type="file"
                                  name={doc?.docName}
                                  onChange={(event) => handleChange(event, 'property', index)}
                                  className="form-control block w-full px-3 py-1 text-base md:text-xs font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 foc}us:outline-none cursor-pointer shadow-md w-36"
                                />

                              </div>
                              {(doc?.uploadedDoc?.verify_status != 1 || doc?.uploadedDoc == '') && <div className="mt-2">
                                {!loader && <button
                                  onClick={() => submitData(doc?.docName, index, 'property')}
                                  className=" px-4 py-1.5 bg-blue-400 text-white text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                                >
                                  Upload
                                </button>}
                              </div>}

                            </div> :
                              <div className="font-semibold text-green-500 text-center text-sm">
                                Uploaded
                              </div>}
                          </>
                            :
                            <>
                              <div className="font-semibold text-red-500 text-center text-sm">
                                By Citizen
                              </div>
                            </>}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>
          </div>

        </div>
      </div>


      {/* ======================Modal for owner documents to upload======================= */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div class="relative overflow-x-auto bg-white rounded-lg shadow-xl border-2 border-gray-50 animate__animated animate__zoomIn animate__faster">

          <div className="absolute top-5 right-5 bg-red-200 hover:bg-red-300 rounded-full p-2 cursor-pointer" onClick={() => closeModal('upload')}>
            <RxCross2 />
          </div>

          <div className="flex md:pl-4 bg-white font-sans overflow-x-auto mt-6">
            <div className="w-full lg:w-4/6">
              <div className="font-semibold w-full flex">
                <div className="flex-1">
                </div>

                {/* HEADER */}
                <div className="flex-1 text-center">
                  <span className="float-none">Upload Owner Documents</span>
                </div>

              </div>

              <div className="bg-white shadow-md rounded my-2">

                <table className="min-w-max w-full table-auto">

                  {/* TABLE HEADER */}
                  <thead>

                    <tr className="bg-sky-100 text-gray-600 capitalize text-sm leading-normal">
                      <th className="py-3 px-6 text-left">#</th>
                      <th className="py-3 px-6 text-left cursor-pointer">
                        Document Name
                      </th>
                      <th className="py-3 px-6 text-left">Type</th>
                      <th className="py-3 px-6 text-center">Document</th>
                      <th className="py-3 px-6 text-center">Status</th>
                      <th className="py-3 px-6 text-center">Remarks</th>
                      <th className="py-3 px-6 text-center">Action</th>
                    </tr>

                  </thead>

                  {/* TABLE BODY */}
                  <tbody className="text-gray-600 text-sm font-light bg-white">

                    {currentOwnerUploadModalData?.documents?.map((doc, index) =>

                      <>

                        <tr className="border-b border-gray-200 ">

                          <td className="py-3 px-6 text-center font-semibold">{index + 1}</td>

                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="mr-2 bg-white shadow-lg rounded-full p-2 ">
                                <img src={folder} alt="rain" className="w-4" />
                              </div>
                              <span className="font-medium">
                                {nullToNA(doc?.docName)}{(doc?.docType == 'OR' || doc?.docType == 'R') && <small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small>}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="font-semibold text-sm">
                              <div className="font-semibold text-sm">
                                <div className="">
                                  <select
                                    ref={el => (ownerDocTypeRef.current[index] = el)}
                                    className="form-control block w-full px-3 py-1 text-base md:text-xs font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer shadow-md w-36"
                                    name="docId"
                                    disabled={((props?.isBtc && doc?.btcStatus) || (!props?.isBtc && !doc?.btcStatus && doc?.uploadedDoc == '') || (!props?.isBtc && props?.canUpload) || (documentListToUpload?.isCitizen != true && documentListToUpload?.isCitizen != 'true')) ? false : true}
                                    onChange={(e) => handleChange2(e, doc?.docName)}
                                  >
                                    <option value={null}>
                                      Select
                                    </option>
                                    {doc?.masters?.map((data, selectIndex) => (
                                      <option value={data?.documentCode}>
                                        {data?.docVal}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-6 text-center">
                            {doc?.uploadedDoc == '' ? <i className="font-semibold not-italic">NA</i> :
                              <div className="flex items-center justify-center font-semibold text-[26px] cursor-pointer" onClick={() => modalFun(`${doc?.uploadedDoc?.docPath}`, doc?.uploadedDoc?.docPath?.split('.')[doc?.uploadedDoc?.docPath?.split('.')?.length - 1], doc?.uploadedDoc?.uploadedDocId)}>

                                <div className="flex items-center">
                                  {doc?.uploadedDoc?.docPath?.split('.')[doc?.uploadedDoc?.docPath?.split('.')?.length - 1] == 'pdf' &&
                                    <div className="flex-shrink-0 text-[28px] ">
                                      <FcDocument />
                                    </div>
                                  }
                                  {doc?.uploadedDoc?.docPath?.split('.')[doc?.uploadedDoc?.docPath?.split('.')?.length - 1] == 'jpg' &&
                                    <div className="flex-shrink-0 ">
                                      <img onError={() => seterrorImage(prev => [...prev, doc?.uploadedDoc?.uploadedDocId])} src={checkImage(doc?.uploadedDoc?.uploadedDocId) ? photo : `${doc?.uploadedDoc?.docPath}`} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                                    </div>
                                  }
                                  {doc?.uploadedDoc?.docPath?.split('.')[doc?.uploadedDoc?.docPath?.split('.')?.length - 1] == 'jpeg' &&
                                    <div className="flex-shrink-0 ">
                                      <img onError={() => seterrorImage(prev => [...prev, doc?.uploadedDoc?.uploadedDocId])} src={checkImage(doc?.uploadedDoc?.uploadedDocId) ? photo : `${doc?.uploadedDoc?.docPath}`} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                                    </div>
                                  }
                                  {doc?.uploadedDoc?.docPath?.split('.')[doc?.uploadedDoc?.docPath?.split('.')?.length - 1] == 'png' &&
                                    <div className="flex-shrink-0 ">
                                      <img onError={() => seterrorImage(prev => [...prev, doc?.uploadedDoc?.uploadedDocId])} src={checkImage(doc?.uploadedDoc?.uploadedDocId) ? photo : `${doc?.uploadedDoc?.docPath}`} className="md:w-[2vw] w-[5vw]" alt="" srcset="" />
                                    </div>
                                  }

                                </div>
                              </div>
                            }
                          </td>

                          <td className="py-3 px-6 text-center font-semibold">
                            {doc?.uploadedDoc == '' ? <span className="text-red-500 font-semibold">Not Uploaded</span> : <>
                              {
                                doc?.docName == 'Photograph' &&
                                <p className="whitespace-no-wrap">
                                </p>
                              }
                              {
                                doc?.docName != 'Photograph' &&
                                <>
                                  <p className="whitespace-no-wrap">
                                    {doc?.uploadedDoc?.verifyStatus == 0 && <>Pending</>}</p>
                                  <p className="text-green-500 whitespace-no-wrap">
                                    {doc?.uploadedDoc?.verifyStatus == 1 && <>Verified</>}</p>
                                  <p className="text-red-500 whitespace-no-wrap">
                                    {doc?.btcStatus === true && <>Rejected</>}
                                  </p>
                                </>
                              }


                            </>}
                          </td>

                          <td className="py-3 px-6">
                            {doc?.uploadedDoc?.remarks == "" ? <i className="font-semibold not-italic">NA</i> : doc?.uploadedDoc?.remarks}
                            {doc?.uploadedDoc == '' && <i className="font-semibold not-italic">NA</i>}
                          </td>


                          <td className="py-3 px-6">

                            {(documentListToUpload?.isCitizen != true && documentListToUpload?.isCitizen != 'true') ?
                              <>
                                {((props?.isBtc && doc?.btcStatus) || (!props?.isBtc && !doc?.btcStatus && doc?.uploadedDoc == '') || (!props?.isBtc && props?.canUpload)) ?
                                  <div className="font-semibold text-sm">
                                    <div className="">
                                      <input
                                        accept={index == 0 ? '.png,.jpg,.jpeg' : '.pdf,.png,.jpg,.jpeg'}
                                        type="file"
                                        onChange={(event) => handleChange(event, 'owner', index)}
                                        className="form-control block w-full px-3 py-1 text-base md:text-xs font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer shadow-md w-36 cursor-pointer"
                                      />
                                    </div>
                                    <div className="mt-2">
                                      {!loader && <button
                                        onClick={() => submitData(doc?.docName, index, 'owner')}
                                        type="button"
                                        className=" px-6 py-1.5 bg-blue-400 text-white font-medium text-xs leading-tight capitalize rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                                      >
                                        Upload
                                      </button>}
                                    </div>
                                  </div> :
                                  <div className="font-semibold text-green-500 text-center text-sm">
                                    Uploaded
                                  </div>}
                              </>
                              :
                              <>
                                <div className="font-semibold text-red-500 text-center text-sm">
                                  By Citizen
                                </div>
                              </>}

                          </td>

                        </tr>

                      </>

                    )}

                  </tbody>

                </table>

              </div>

            </div>
          </div>
        </div>
      </Modal>


      {/* ===================== Modal to view document ===================== */}
      <Modal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal}
        className='w-screen h-screen flex justify-center items-center'
        contentLabel="Example Modal"
      >

        <div class=" rounded-lg shadow-xl border-2 border-gray-200 bg-white md:ml-32 p-4 animate__animated animate__zoomIn animate__faster w-full md:w-[60vw] h-[80vh]" >
          <div className="absolute top-2 font-normal bg-red-200 hover:bg-red-300 right-2 rounded-full p-2 cursor-pointer" onClick={() => closeModal('view')}>
            <RxCross2 />
          </div>
          {
            errorImage == true ? <>
              <div className='w-full h-full bg-gray-700 flex items-center justify-center text-gray-200'>
                <div className='border-r-2 border-gray-200 pr-4'>Error</div>
                <div className='pl-4'>Document not visible</div>
              </div>
            </>
              :
              <>
                {
                  docType == 'pdf' && <>
                    <iframe className='w-full h-full' src={docUrl} frameborder="0"></iframe>
                  </>
                }
                {
                  docType != 'pdf' && <>
                    <div className='w-full h-[77vh] overflow-auto flex flex-wrap items-center justify-center'>
                      <img src={docUrl} alt="" srcset="" className='' />
                    </div>
                  </>
                }
              </>
          }
        </div>

      </Modal>


      <h1 className="w-full mt-20"></h1>

    </>
  );
}

export default PilotWorkflowDocumentUpload;
