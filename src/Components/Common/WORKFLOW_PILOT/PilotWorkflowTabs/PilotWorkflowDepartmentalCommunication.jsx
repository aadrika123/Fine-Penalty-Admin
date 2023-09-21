//////////////////////////////////////////////////////////////////////////////////////
//    Author - R U Bharti
//    Version - 1.0
//    Date - 14 july 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - PropertySafWorkflowTimeline (closed)
//    DESCRIPTION - PropertySafWorkflowTimeline Component
//      
//////////////////////////////////////////////////////////////////////////////////////

import { useState } from "react";
import Modal from "react-modal";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import "animate.css";
import { useEffect } from "react";
import axios from "axios";
import ApiHeader from "@/Components/api/ApiHeader";
import ApiHeader2 from "@/Components/api/ApiHeader2";
import { FcDocument } from "react-icons/fc";
import "./Timeline.css";
import moment from "moment/moment";
import { ImCross } from 'react-icons/im'
import BarLoader from "@/Components/Common/Loaders/BarLoader";
import { nullToNA } from "@/Components/Common/PowerupFunctions";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    border: "none",
  },
};
Modal.setAppElement("#root");

function PilotWorkflowDepartmentalCommunication(props) {

  const [loader, setloader] = useState(false);
  const [documentUpload, setdocumentUpload] = useState([]);
  const [view, setview] = useState(true);
  const [tempFile, settempFile] = useState();
  const [tempData, settempData] = useState();
  const [refresh, setrefresh] = useState(0);
  const [role, setrole] = useState('')


  console.log('app data...', props?.applicationData)
  console.log('dynamic custom form....', props?.applicationData?.data?.timelineData?.customFor)

  const formik = useFormik({
    initialValues: {
      remarks: "",
      document: "",
    },

    onSubmit: (values) => {
      console.log(
        "saf custom Getting custom tab values in formik function => ",
        values,
        "and id is => ",
        props?.id
      );
      if (values.remarks == '') {
        toast.error('Please write some comment')
        return
      }
      submitFun(values);
    },
  });
  console.log("custorm for  => ", props?.applicationData)

  const submitFun = (values) => {

    let fd = new FormData();

    fd.append("applicationId", props?.id);
    fd.append("customFor", props?.applicationData?.data?.timelineData?.customFor);
    fd.append("remarks", values.remarks);
    fd.append("document", documentUpload);

    console.log("before send => ", fd);

    if (values.remarks == "" && tempFile == null) {
      toast.error("Please fill any field..");
    } else {
      setloader(true);
      axios
      [props?.api?.api_postDepartmentalData?.method](props?.api?.api_postDepartmentalData?.url, fd, ApiHeader2())
        .then((res) => {
          console.log("submitted => ", res);
          if (res?.data?.status) {
            setrefresh(refresh + 1);
            setview(true);
            toast.success("Message Submitted Successfully...");
            formik.resetForm()
          } else {
            props?.activateBottomErrorCard(true, res?.data?.message)
          }
          setloader(false);
        })
        .catch((err) => {
          console.log("ERror submission => ", err);
          props?.activateBottomErrorCard(true, 'Some error occured while saving message. Please try again later.')
          setloader(false);
        });
    }
  };

  const handleChange = (e) => {
    if (e.target.name == "document") {
      let file = e.target.files[0];
      settempFile(e.target.files[0]);
      setdocumentUpload(e.target.files[0]);
      console.log("document file on change..", file);
    }
  };

  useEffect(() => {
    setrefresh(refresh + 1);
  }, []);

  useEffect(() => {


    console.log("role id => ", props?.roleId)

    props?.roleId == 11 && setrole("Back Office")
    props?.roleId == 6 && setrole("Dealing Assistant")

    setloader(true);
    axios
    [props?.api?.api_getDepartmentalData?.method](props?.api?.api_getDepartmentalData?.url, { applicationId: props?.id, customFor: props?.applicationData?.data?.timelineData?.customFor }, ApiHeader())
      .then((res) => {
        if(res?.data?.status){
          settempData(res?.data?.data);
        } else {
          props?.activateBottomErrorCard(true, res?.data?.message)
        }
        setloader(false);
        console.log("get remark data => ", res);
      })
      .catch((err) => {
        setloader(false);
        console.log("error get remark data => ", err);
        props?.activateBottomErrorCard(true, 'Some error occured while saving message. Please try again later.')
      });
  }, [refresh]);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [docUrl, setDocUrl] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const afterOpenModal = () => { };

  const modalAction = (incomingDocUrl) => {
    console.log('incoming doc url modal => ', incomingDocUrl)
    setDocUrl(incomingDocUrl);
    openModal();
  };

  console.log('doc url modal => ', docUrl)

  const applicationData = {};

  const funDate = (dt) => {

    let temp = moment(dt)
    console.log("date => ", temp.format('lll'))

    return temp.format('lll')
  }


  return (
    <>

      <div className="container mx-auto ml-0  px-1 py-1 shadow-lg rounded-lg w-full">
        {loader && (
          <div className="inline">
            <BarLoader />
          </div>
        )}



        {

          view ?

            // Comment list view
            <div
              className={
                `pb-4 visible text-xs text-gray-600 px-4 pt-2 w-full flex flex-col space-y-2 poppins`

              }
            >
              <div className="flex md:flex-row flex-col w-full md:justify-end items-between mt-2 mb-4 ">
                <div
                  onClick={() => setview(false)}
                  className="cursor-pointer px-4 py-1.5 mx-6 rounded-sm bg-sky-400 text-white hover:bg-sky-500 shadow-lg text-xs"
                >
                  Comment
                </div>

              </div>

              {/* if no comment found screen */}
              {
                tempData < 1 &&
                <div className="flex justify-center items-center w-full">
                  <span className="bg-red-100 px-4 py-1.5 rounded-sm shadow-sm">👉Click comment to add comment on this application.👈</span>
                </div>
              }

              {/* if comment found screen */}
              <div className="w-full flex flex-wrap justify-evenly timeline-container text-xs text-gray-800 poppins">

                {tempData?.map((elem) => (
                  <>

                    {/* for text type only comment */}
                    {elem?.type == "text" && elem?.customFor == props?.applicationData?.data?.timelineData?.customFor && (
                      <div className="timeline-item">
                        <div className="timeline-item-content bg-sky-100 mb-2 mr-2  px-4 py-1 pt-1.5 rounded-md shadow-lg w-[70%]   justify-center">
                          <span className="tag"></span>
                          <div className="capitalize text-[14px] mb-1 font-semibold">{role}</div>
                          <time>Date : <span className="font-semibold"> {funDate(elem?.date)}</span></time>
                          <div>Remarks : <span className="font-semibold">{nullToNA(elem?.remarks)}</span> </div>
                          <span className="circle" />
                        </div>
                      </div>
                    )}

                    {/* for flle type comment only */}
                    {elem?.type == "file" && elem?.customFor == props?.applicationData?.data?.timelineData?.customFor && (
                      <div className="timeline-item">
                        <div className="timeline-item-content bg-sky-100 mb-2 mr-2  px-4 py-1 pt-1.5 rounded-md shadow-lg w-[70%]   justify-center">
                          <span className="tag"></span>
                          <div className="capitalize text-[14px] mb-1 font-semibold">{role}</div>
                          <time>Date : <span className="font-semibold"> {nullToNA(elem?.date)}</span></time>
                          <div className="flex flex-row flex-wrap gap-2">
                            <span className="text-xs">Document :{" "}</span>
                            <div className="font-semibold cursor-pointer text-2xl" onClick={() => modalAction(elem?.docUrl)}>
                              <FcDocument className="bg-white rounded-lg shadow-xl" />
                            </div>{" "}
                          </div>
                          <span className="circle" />
                        </div>
                      </div>
                    )}

                    {/* for both text and file type comment  */}
                    {elem?.type == "both" && elem?.customFor == props?.applicationData?.data?.timelineData?.customFor && (
                      <div className="timeline-item">
                        <div className="timeline-item-content bg-sky-100 mb-2 mr-2  px-4 py-1 pt-1.5 rounded-md shadow-lg w-[70%]   justify-center">
                          <span className="tag"></span>
                          <div className="capitalize text-[14px] mb-1 font-semibold">{role}</div>
                          <time>Date : <span className="font-semibold"> {nullToNA(elem?.date)}</span></time>
                          <p>Remarks : <span className="font-semibold">{nullToNA(elem?.remarks)}</span></p>
                          <div className="flex flex-row flex-wrap gap-2">
                            <span className="text-xs">Document :{" "}</span>
                            <div className="font-semibold cursor-pointer text-2xl" onClick={() => modalAction(elem?.docUrl)}>
                              <FcDocument className="bg-white rounded-lg p-1 shadow-xl" />
                            </div>{" "}
                          </div>
                          <span className="circle" />
                        </div>
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
            :

            // Form for comment
            <form
              className={`pb-4 visible poppins`}
              onSubmit={formik.handleSubmit}
            >
              <div
                onClick={() => setview(true)}
                className="cursor-pointer px-4 py-1.5 mx-6 mt-4 rounded-sm bg-gray-400 text-white hover:bg-gray-500 shadow-lg text-xs w-max mb-4"
              >
                Comment List
              </div>

              <div className="flex flex-wrap md:flex-row flex-col md:justify-evenly items-evenly space-y-2 ">
                {/* Remarks */}
                <div className="flex flex-col  w-[40%] space-y-2 mb-2">
                  <label
                    htmlFor="remarks"
                    className="text-zinc-500 capitalize text-xs font-semibold"
                  >
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    onChange={formik.handleChange}
                    className="bg-gray-100 text-xs border-2 border-gray-400 rounded-md px-4 py-2 shadow-md"
                    placeholder="Write your remarks here..."
                  />
                </div>

                {/* Documents */}
                <div className="flex flex-col w-[40%] space-y-2">
                  <label
                    className="text-zinc-500 capitalize text-xs font-semibold"
                    htmlFor="document"
                  >
                    Document :{" "}
                  </label>
                  <input accept=".pdf,.jpg,.jpeg"
                    type="file"
                    name="document"
                    id="document"
                    onChange={handleChange}
                    className="form-control block w-full px-3 py-1.5 text-base md:text-xs font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer shadow-md "
                  />
                </div>
              </div>

              <div className="flex md:flex-row flex-col md:justify-between items-between">
                <div
                >
                </div>

                <button
                  type="submit"
                  className="px-4 py-1.5 mx-6 mt-4 rounded-lg bg-sky-400 hover:bg-sky-500 text-white shadow-lg text-xs"
                >
                  Submit
                </button>
              </div>
            </form>

        }
      </div>

      {/* Modal to view documnent */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div
          class=" rounded-lg shadow-xl border-2 border-gray-50 ml-32 px-0"
          style={{ 'width': '60vw', 'height': '80vh' }}
        >

          <div className="absolute top-10 bg-red-200 hover:bg-red-300 right-10 rounded-full p-2 cursor-pointer" onClick={closeModal}>
            <ImCross />
          </div>

          <iframe
            className="w-full h-full"
            src={docUrl}
            frameborder="0"
          ></iframe>
        </div>
      </Modal>

      <div className="w-full mt-20"></div>
    </>
  );
}

export default PilotWorkflowDepartmentalCommunication;
