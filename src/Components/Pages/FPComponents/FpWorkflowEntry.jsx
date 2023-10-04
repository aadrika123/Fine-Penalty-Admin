///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : FpWorkflowEntry
// 👉 Status      : Close
// 👉 Description : This is the entry screen for workflow
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import PilotWorkflowIndex from '@/Components/Common/WORKFLOW_PILOT/PilotWorkflowIndex'
import BackendUrl from '@/Components/api/BackendUrl'
import ProjectApiList from '@/Components/api/ProjectApiList'
import { indianAmount, indianDate, nullToNA } from '@/Components/Common/PowerupFunctions'
import useSetTitle from '@/Components/Common/useSetTitle'

function FpWorkflowEntry() {

  // 👉 To set title 👈
  useSetTitle("Fines & Penalties Workflow")

  // 👉 API constant 👈
  const { fpInbox, getFpUploadedDocument, fpDetails } = ProjectApiList()

  // 👉 Workflow data 👈
  const workflowRules = {
    api: {
      // 1 - API TO FETCH INBOX LIST
      api_inboxList: { method: 'post', url: fpInbox },
      // 2 - API TO FETCH DETAILS BY ID
      api_details: { method: 'post', url: fpDetails },
      // 3 - API TO FETCH DOCUMENTS LIST
      api_documentList: { method: 'post', url: getFpUploadedDocument },


    },

    tableColumns: [
      {
        Header: "Sl.No.",
        Cell: ({ row }) => <div>{row?.index + 1}</div>
      },
      {
        Header: "Application No.",
        accessor: "application_no",
        Cell: ({ cell }) => (nullToNA(cell.row.original?.application_no))
      },
      {
        Header: "Name",
        accessor: "full_name",
        Cell: ({ cell }) => (nullToNA(cell.row.original?.full_name))
      },
      {
        Header: "Mobile No.",
        accessor: "mobile",
        Cell: ({ cell }) => (nullToNA(cell.row.original?.mobile))
      },
      {
        Header: "Holding No.",
        accessor: "holding_no",
        Cell: ({ cell }) => (nullToNA(cell.row.original?.holding_no))
      },
      {
        Header: "Violation Name",
        accessor: "violation_name",
        Cell: ({ cell }) => (nullToNA(cell.row.original?.violation_name))
      },
      {
        Header: "Penalty Amount",
        accessor: "amount",
        Cell: ({ cell }) => (indianAmount(cell.row.original?.amount))
      },
      {
        Header: "Apply Date",
        accessor: "date",
        Cell: ({ cell }) => (indianDate(cell.row.original?.date)),
        className: 'w-[7%]'
      }
    ],
  }

  return (
    < PilotWorkflowIndex workflowData={workflowRules} />
  )
}

export default FpWorkflowEntry