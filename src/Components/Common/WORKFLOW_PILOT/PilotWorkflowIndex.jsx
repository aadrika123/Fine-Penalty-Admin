//////////////////////////////////////////////////////////////////////////////////////
//    Author - R U Bharti
//    Version - 1.0
//    Date - 13 july 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - PilotWorkflowIndex (closed)
//    DESCRIPTION - PilotWorkflowIndex Component
//////////////////////////////////////////////////////////////////////////////////////
import { useEffect, useState } from "react";
import MailboxSidebar from "@/Components/Common/MailboxComponent/MailboxSidebar";
import axios from "axios";
import PilotWorkflowListBox from "./PilotWorkflowListBox";
import ApiHeader from "@/Components/api/ApiHeader";
import { useParams } from "react-router-dom";


function PilotWorkflowIndex(props) {

  const [tabButtonClickState, settabButtonClickState] = useState(false)

  const [tabIndex, settabIndex] = useState(0); //state to store current tab index
  const [tabs, setTabs] = useState([
    { title: "Inbox", tabIndex: 0 },
  ]);
  // tabSwitch function receive tabIndex to switch between tabs called from Sidebar menu
  const tabSwitch = (index) => {
    // updating the tab index to recent value
    settabIndex(index);
  };


  return (
    <>
      <div className="grid grid-cols-12 rounded-lg mt-0 shadow-md bg-white ">
        <div className="col-span-12 sm:col-span-12 ">
            <MailboxSidebar
              settabButtonClickState={settabButtonClickState}
              candidateListStatus={true}
              tabs={tabs}
              fun={tabSwitch}
            />
        </div>
        {tabIndex == 0 && (
          <div
            className="col-span-12 sm:col-span-12 shadow-lg "
          >
            <PilotWorkflowListBox
              tabIndex={tabIndex}
              tabButtonClickState={tabButtonClickState}
              settabButtonClickState={settabButtonClickState}
              api={props?.workflowData?.api}
              COLUMNS={props?.workflowData?.tableColumns}
              boxType="inbox"
            />
          </div>
        )}

      </div>
    </>
  );
}

export default PilotWorkflowIndex;