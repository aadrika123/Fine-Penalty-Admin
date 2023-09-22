///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : MarriageWorkflowEntry
// 👉 Status      : Close
// 👉 Description : This is the entry screen for workflow
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import PilotWorkflowIndex from '@/Components/Common/WORKFLOW_PILOT/PilotWorkflowIndex'
import BackendUrlAdvt from '@/Components/api/BackendUrl'
import ProjectApiList from '@/Components/api/ProjectApiList'
import { indianDate, nullToNA } from '@/Components/Common/PowerupFunctions'
import useSetTitle from '@/Components/Common/useSetTitle'

function MarriageWorkflowEntry() {

  // 👉 To set title 👈
  useSetTitle("Marriage Workflow")

    // 👉 API constant 👈
    const { fpInbox, marriageDetails, api_workflowInfo, api_postDepartmental, getUploadedDocument, api_getDepartmentalData, appointSet, docVerify, approveReject, api_docUpload, fpDocList, api_marriageNextLevel } = ProjectApiList()

    // 👉 Workflow data 👈
    const workflowRules = {
        api: {
            // 1 - API TO FETCH INBOX LIST
            api_inboxList: { method: 'post', url: fpInbox },
            // 2 - API TO FETCH OUTBOX LIST
            api_outboxList: { method: 'post', url: fpInbox },
            // 3 - API TO FETCH SPECIAL LIST
            api_specialList: { method: 'post', url: fpInbox },
            // 4 - API TO FETCH BACK TO CITIZEN LIST
            apt_btcList: { method: 'post', url: fpInbox },
            // 5 - API TO FETCH FIELD VERIFICATION LIST
            // api_fieldVerificationList: , // ------not done
            api_fieldVerificationList: { method: 'post', url: fpInbox },
            // 6 - API TO FETCH APPLICATION DETAILS BY ID 
            api_details: { method: 'post', url: marriageDetails },
            // 7 - API TO FETCH WORKFLOW RELATED DATA eg: - WORKFLOW CANDIDATED,WORKFLOW PERMISSIONS,PSEUDO USERS
            api_workflowInfo: { method: 'post', url: api_workflowInfo },
            // 8 - API TO SEND INDEPENDENT COMMENT
            api_independentComment: { method: 'post', url: '' },
            // 9 - API TO SEND BACKWARD OR FORWARD
            api_sendLevel: { method: 'post', url: api_marriageNextLevel },
            // 10 - API TO ESACALATE OR DEESCALATE
            api_escalate: { method: 'post', url: '' },
            // 11 - API TO SEND BACK TO CITIZEN
            api_btc: { method: 'post', url: '' },
            // 12 - API TO APPROVE OR REJECT
            api_approveReject: { method: 'post', url: approveReject },
            // 13 - API TO post DEPARTMENTAL COMMUNICATION DATA
            api_postDepartmentalData: { method: 'post', url: api_postDepartmental },
            // 13 - API TO get DEPARTMENTAL COMMUNICATION DATA
            api_getDepartmentalData: { method: 'post', url: api_getDepartmentalData },
            // 14 - API TO SHOW DOCUMENTS WHICH HAS TO BE UPLOADED
            api_uploadDocumentShow: { method: 'post', url: fpDocList },
            // 14 - API TO UPLOAD DOCUMENTS 
            api_uploadDocument: { method: 'post', url: api_docUpload },
            // 15 - API TO VERIFY DOCUMENTS
            api_verifyDocuments: { method: 'post', url: docVerify },
            // 16 - API TO SHOW  DOCUMENTS IN VIEW DOCUMENT AND VERIFY DOCUMENT TABS
            api_documentList: { method: 'post', url: getUploadedDocument },
            // 17 - BASE URL TO VIEW  DOCUMENT
            documentBaseUrl: BackendUrlAdvt,
            // 18 - API TO SET APPOINTMENT DATE
            api_setAppointmentDate : {method: 'post', url: appointSet}

        },
        workflow: {
            workflowName: 'Movable Workflow',
            // workflowId: 248,
            workflowId: 32,
            moduleId: 5,
            fullDetailsUrl: '/advertisement/movableApplicationDetail'
        },

        tableColumns: [
            {
              Header: "Sl.No.",
              Cell: ({ row }) => <div>{row?.index + 1}</div>
            },
            {
              Header: "Application No",
              accessor: "application_no",
              Cell: ({ cell }) => (nullToNA(cell.row.original?.application_no))
            },
            {
              Header: "Bride Name",
              accessor: "bride_name",
              Cell: ({ cell }) => (nullToNA(cell.row.original?.bride_name))
            },
            {
              Header: "Groom Name",
              accessor: "groom_name",
              Cell: ({ cell }) => (nullToNA(cell.row.original?.groom_name))
            },
            {
              Header: "Marriage Date",
              accessor: "marriage_date",
              Cell: ({ cell }) => (indianDate(cell.row.original?.marriage_date))
            },
            {
              Header: "Marriage Place",
              accessor: "marriage_place",
              Cell: ({ cell }) => (nullToNA(cell.row.original?.marriage_place))
            },
            {
              Header: "Appointment Date",
              accessor: "appointment_date",
              Cell: ({ cell }) => (indianDate(cell.row.original?.appointment_date))
            }
          ],
    }

    return (
        < PilotWorkflowIndex workflowData={workflowRules} />
    )
}

export default MarriageWorkflowEntry