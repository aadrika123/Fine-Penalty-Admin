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

  return (
    <>

      {/* Tab view which contains two tabs, which are List and Details */}
      <Box style={{ width: '100%', paddingLeft: '20px' }}>
        <Box style={{ borderBottom: 1, borderColor: 'divider' }}>
          <div value={value} onChange={handleChange} className='flex gap-2'>
            <Tab label="List" action={() => setIndex(0)} active={index == 0} />
            <Tab label="Details" action={() => setIndex(1)} active={index == 1} />
          </div>
        </Box>
        <TabPanel active={index == 0}>

          {(boxType == 'inbox') &&
            <CustomErrorBoundary errorMsg="Bug in PilotWorkflowInboxList" >
              <PilotWorkflowInboxList
                api={props?.api?.api_inboxList}
                COLUMNS={props?.COLUMNS}
                boxType={() => setBoxType('inbox')}
                fun={viewDetails}
              />
            </CustomErrorBoundary>}


          {/**PropertySafApplicationList to show list of application in table */}
        </TabPanel>
        <TabPanel active={index == 1}>
          <CustomErrorBoundary errorMsg="Bug in PilotWorkflowTabs" >
            <PilotWorkflowTabs
              tabIndex={props?.tabIndex}
              api={props?.api}
              fun={handleChange}
              id={listId}
              boxType={boxType}
              boxTypeFun={boxType == 'outbox'}
            />
          </CustomErrorBoundary>
          {/**PilotWorkflowTabs to show details of selected application */}
        </TabPanel>

      </Box>
      {/* <div className='w-full h-20'></div> */}
    </>
  );
}
