//////////////////////////////////////////////////////////////////////////////////////
//    Author - R U Bharti
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
        setTabIndex(index)
        props.fun(index)
    }


    return (
        <>

            <aside className="w-full overflow-auto" >
                <div className=" rounded flex flex-row sm:flex-row space-x-4 py-2 pt-4 md:px-6 px-2 items-center">
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