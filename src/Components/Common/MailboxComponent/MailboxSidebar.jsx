//////////////////////////////////////////////////////////////////////////////////////
//    Author - Talib Hussain
//    Version - 1.0
//    Date - 24 june 2022
//    Revision - 1
//    Project - JUIDCO
//    Component  - MailboxSidebar
//    DESCRIPTION - MailboxSidebar Component
//////////////////////////////////////////////////////////////////////////////////////
import { useState } from 'react'
import MailboxLink from '@/Components/Common/MailboxComponent/MailboxLink'
import WorkFlowCandidate from '@/Components/Common/MailboxComponent/WorkFlowCandidate'

function MailboxSidebar(props) {
    const [tabIndex, setTabIndex] = useState(0)

    console.log('can transferd from index', props.workflowCandidates)

    const tabSwitch = (index) => {
        // props?.settabButtonClickState(true)
        setTabIndex(index)
        props.fun(index)
    }

    // useEffect(() => {
    //     // 2 CHECK IF TAB INDEX IS BETWEEN 0 TO 5 THEN UPDATE TAB INDEX -> NEXT IS PILOTWORKFLOWLISTBOX COMPONENT
    //     if (props?.autoTabIndex == 0 || props?.autoTabIndex == 1 || props?.autoTabIndex == 2 || props?.autoTabIndex == 3 || props?.autoTabIndex == 4) {
    //         tabSwitch(props?.autoTabIndex)
    //     }

    // }, [props?.autoTabIndex])




    return (
        <>

            <aside className="w-full overflow-auto" >
                <div className=" rounded flex flex-row sm:flex-row space-x-4 py-2 pl-10 px-2 items-center">
                    {
                        props.tabs.map((data) => (
                            <div onClick={() => tabSwitch(data.tabIndex)}><MailboxLink activeStatus={tabIndex == data.tabIndex ? true : false} title={data.title} /></div>
                        ))
                    }
                </div>

                {
                    props?.candidateListStatus && <div className="shadow-xl bg-sky-100 pt-4  h-40 sm:h-96 overflow-y-scroll hidden">

                        {props?.workflowCandidates?.data.map((data) => {
                            return (
                                <>
                                    {/* <WorkFlowCandidate designation={data.user_id} name={data.user_name} activeCandidateStatus={data.activeCandidateStatus} /> */}
                                    {/* <WorkFlowCandidate designation={data.user_id} name={data.user_name}  /> */}
                                    <WorkFlowCandidate designation={data.user_id} name={data.role_name} />
                                    <hr />
                                </>
                            )
                        })}



                    </div>
                }

            </aside>

        </>
    )
}

export default MailboxSidebar
/**
 * Exported to :
 * 1. Mailbox Component
 * 
 */