import { useState, useEffect } from "react";
import Box from "./Box";
import StatusTimeline from "@/Components/Common/MailboxComponent/StatusTimeline";
import PilotWorkflowDataCard from "./PilotWorkflowDataCard";
import PilotWorkflowDocumentViewTab from "./PilotWorkflowTabs/PilotWorkflowDocumentViewTab";
import EmptyDetailsIllustration from "@/Components/Common/EmptyDetailsIllustration";
import axios from "axios";
import ApiHeader from "@/Components/api/ApiHeader";
import Modal from "react-modal";
import { FiAlertCircle } from "react-icons/fi";
import PilotWorkflowFullDetailsTab from "./PilotWorkflowTabs/PilotWorkflowFullDetailsTab";
import CustomErrorBoundary from "@/Components/Common/CustomErrorBoundary";
import BarLoader from "@/Components/Common/Loaders/BarLoader";
import BottomErrorCard from "@/Components/Common/BottomErrorCard";

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

export default function PilotWorkflowTabs(props) {

  const [isLoading, setisLoading] = useState(false);
  const [applicationData, setApplicationData] = useState({});
  //setting verification level from 0 as backoffice to show in graphics
  const [activeTab, setactiveTab] = useState(0)
  const [erroState, seterroState] = useState(false);
  const [erroMessage, seterroMessage] = useState(null);

  useEffect(() => {
    fetchDetailsById();
  }, [props.id]);


  const fetchDetailsById = () => {
    setisLoading(true);
    const header = ApiHeader()

    console.log("id before getting dta =>", props?.id)
    axios
    [props?.api?.api_details?.method](props?.api?.api_details?.url, { applicationId: props?.id }, header)
      .then(function (response) {
        console.log("==2 details by id response...", response?.data);
        setApplicationData(response?.data);
        setisLoading(false);
      })
      .catch(function (error) {
        console.log("==2 details by id error...", error);
        setisLoading(false);
      });
  };

  if (props.id == "") {
    return (
      <EmptyDetailsIllustration
        fun={props.fun}
        title="No Application Selected !"
      />
    );
  }

  const funId = (id) => {
    setindex(id)
    console.log("🚀 ~ file: PropertyConcessionDetailsTabs.js:147 ~ funId ~ id", id);
  }

  const changeTabFun = (index) => {
    setactiveTab(index)
  }

  const activateBottomErrorCard = (state, msg) => {
    seterroMessage(msg)
    seterroState(state)

  }
  console.log('permission at workflow tabssss...', props?.workflowInfo)
  return (
    <>

      {erroState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={erroMessage} />}

      {isLoading && (
        <BarLoader />
      )}
      <div className="">
        <div className="flex">
          {/* StatusTimeline to show the progress level of holding application */}
          {/* DYNAMIC WORKFLOW VERIFICATION TIMELINE */}
          {
            props?.workflowInfo?.members?.map((data, index) => (
              <div>
                <StatusTimeline
                  index={index + 1}
                  level={data?.role_name}
                  verificationStatus={index < stepperCurrentIndex ? true : false}
                  last={index == props?.workflowInfo?.members?.length - 1 ? true : false}
                  active={index == stepperCurrentIndex ? true : false}
                  backStatus={false}
                  btc={false}
                />
              </div>
            ))
          }

        </div>
        {/* DetailTable to show basic details of holding application */}
        <CustomErrorBoundary errorMsg="Bug in PilotWorkflowDataCard" >
          <PilotWorkflowDataCard
            boxType={props?.boxType}
            tabIndex={props?.tabIndex}
            id={props?.id}
            applicationData={applicationData}
            index={funId}
          />
        </CustomErrorBoundary>

        {5 > 4 && <div className=" ">

          <div className="flex space-x-4 uppercase text-gray-600 text-sm pl-4 border-b border-gray-200 mb-6 w-full overflow-x-auto whitespace-nowrap">
            <div onClick={() => changeTabFun(0)} className={`pb-3 flex-initial cursor-pointer ${activeTab == 0 ? 'border-b-2 border-blue-500 text-blue-500' : 'no-underline border-none'}`}>
              <span>View Details</span>
            </div>

            {<div onClick={() => changeTabFun(1)} className={`pb-3 flex-initial cursor-pointer ${activeTab == 1 ? 'border-b-2 border-blue-500 text-blue-500' : 'no-underline border-none'}`}><span>View Documents</span></div>}

          </div>
          {/* BO TABS */}
          <Box sx={{ width: "100%" }}>

            {activeTab == 0 && <CustomErrorBoundary errorMsg="Bug in PilotWorkflowFullDetailsTab" >
              <PilotWorkflowFullDetailsTab applicationData={applicationData} id={props?.id} activateBottomErrorCard={activateBottomErrorCard} />
            </CustomErrorBoundary>}
            {activeTab == 1 &&
              <CustomErrorBoundary errorMsg="Bug in PilotWorkflowDocumentViewTab" >
                <PilotWorkflowDocumentViewTab applicationData={applicationData} id={props?.id} api={props?.api} activateBottomErrorCard={activateBottomErrorCard} />
              </CustomErrorBoundary>
            }
          
          </Box>

        </div>}

      </div>

    </>
  );
}

