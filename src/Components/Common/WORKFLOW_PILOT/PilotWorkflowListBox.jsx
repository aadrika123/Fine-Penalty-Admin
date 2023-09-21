import { useState } from 'react';
import PilotWorkflowInboxList from './PilotWorkflowLists/PilotWorkflowInboxList';
import PilotWorkflowTabs from './PilotWorkflowTabs';
import { AiFillStar } from 'react-icons/ai'
import CustomErrorBoundary from '@/Components/Common/CustomErrorBoundary';
import { useParams } from 'react-router-dom';
import Tab from './Tab'
import TabPanel from './TabPanel';
import Box from './Box';

export default function PilotWorkflowListBox(props) {

  const [index, setIndex] = useState(0)
  const [boxType, setBoxType] = useState('inbox')

  console.log('workflowInfo at pilotworkflowlistbox....', props?.workflowInfo)
  console.log('api at listbox...', props?.api)
  console.log("workflow candidate sp...", props.workflowCandidates)
  const { passedTabIndex, passedApplicationId } = useParams()


  // console.log('............props type............ ',props.boxType)
  const [value, setValue] = useState(0);
  const [listId, setlistId] = useState('')    //state to store application primary key
  const [assessmentType, setassessmentType] = useState('')
  const handleChange = (event, newValue) => {   //handChange to switch between tabs
    setValue(newValue);
    setIndex(newValue)
  };

  const viewDetails = (id, type) => {   //viewDetails to go to Details tab and show data of selected holding application
    setlistId(id)   //updating state with application primary key
    handleChange(id, 1)
    setIndex(1)
    setassessmentType(type)  //Reassessment
  }

  // useEffect(() => {
  //   // 3 IF GET ANY PASSED APPLICATION ID THEN SET APPLICATION ID TO VIEW DETAIL
  //   if (passedApplicationId != 'direct') {
  //     viewDetails(parseInt(passedApplicationId))
  //   }
  // }, [props?.autoTabIndex])

 




  return (
    <>

      {/* Tab view which contains two tabs, which are List and Details */}
      <Box style={{ width: '100%',paddingLeft:'20px' }}>
        <Box style={{ borderBottom: 1, borderColor: 'divider' }}>
          <div value={value} onChange={handleChange} className='flex gap-2 pl-4'>
            <Tab label="List" action={() => setIndex(0)} active={index == 0}/>
            <Tab label="Details" action={() => setIndex(1)} active={index == 1} />
            <div className="text-right float-right absolute right-4 top-4 text-white justify-center flex gap-4">
              {props?.isSpecial && <div className=' items-center'>
                <span className='bg-yellow-600 px-4 shadow-lg font-mono font-semibold italic rounded-l-xl'> <AiFillStar className="inline text-red-100 animate-bounce" /> special</span>
              </div>}
              <div>
                {/* <span className='bg-sky-100 border-l border-b border-white text-black col-span-12 sm:col-span-2 sm:col-start-11 pl-3 rounded-l shadow-lg font-semibold  pr-3'> <TbWebhook className='inline' /> {props?.workflow?.workflowName}</span> */}
              </div>
            </div>

          </div>
        </Box>
        <TabPanel active={index==0}>

          {(boxType == 'inbox') &&
            <CustomErrorBoundary errorMsg="Bug in PilotWorkflowInboxList" >
              <PilotWorkflowInboxList fetchWorkflowPermission={props?.fetchWorkflowPermission} api={props?.api?.api_inboxList} COLUMNS={props?.COLUMNS} boxType={() => setBoxType('inbox')} fun={viewDetails} />
            </CustomErrorBoundary>}

          {(boxType == 'outbox') &&
            <CustomErrorBoundary errorMsg="Bug in PilotWorkflowOutboxList" >
              <PilotWorkflowInboxList fetchWorkflowPermission={props?.fetchWorkflowPermission} api={props?.api?.api_outboxList} COLUMNS={props?.COLUMNS} boxType={() => setBoxType('inbox')} fun={viewDetails} />
            </CustomErrorBoundary>}

          {(boxType == 'specialbox') &&
            <CustomErrorBoundary errorMsg="Bug in PilotWorkflowSpecialList" ><PilotWorkflowInboxList fetchWorkflowPermission={props?.fetchWorkflowPermission} api={props?.api?.api_specialList} COLUMNS={props?.COLUMNS} boxType={() => setBoxType('inbox')} fun={viewDetails} />
            </CustomErrorBoundary>}

          {(boxType == 'btcbox') &&
            <CustomErrorBoundary errorMsg="Bug in PilotWorkflowBtcList" ><PilotWorkflowInboxList fetchWorkflowPermission={props?.fetchWorkflowPermission} api={props?.api?.apt_btcList} boxType={() => setBoxType('inbox')} COLUMNS={props?.COLUMNS} fun={viewDetails} />
            </CustomErrorBoundary>}

          {(boxType == 'fieldbox') &&
            <CustomErrorBoundary errorMsg="Bug in PilotWorkflowFieldVerificationList" ><PilotWorkflowInboxList fetchWorkflowPermission={props?.fetchWorkflowPermission} api={props?.api?.api_fieldVerificationList} boxType={() => setBoxType('inbox')} COLUMNS={props?.COLUMNS} fun={viewDetails} />
            </CustomErrorBoundary>}

          {/* <PilotWorkflowInboxList boxType={() => setBoxType('inbox')}  fun={viewDetails} />   */}
          {/**PropertySafApplicationList to show list of application in table */}
        </TabPanel>
        <TabPanel  active={index==1}>
          <CustomErrorBoundary errorMsg="Bug in PilotWorkflowTabs" >
            <PilotWorkflowTabs assessmentType={assessmentType} canUpload={props?.workflowInfo?.permissions?.can_upload_document} tabIndex={props?.tabIndex} workflow={props?.workflow} workflowInfo={props?.workflowInfo} api={props?.api} fun={handleChange} id={listId} members={props.workflowCandidates} customTabs={props?.customTabs} boxType={boxType} boxTypeFun={boxType == 'outbox'} />
          </CustomErrorBoundary>
          {/**PilotWorkflowTabs to show details of selected application */}
        </TabPanel>

      </Box>
      {/* <div className='w-full h-20'></div> */}
    </>
  );
}
