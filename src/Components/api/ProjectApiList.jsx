import BackendUrl from "./BackendUrl"

export default function ProjectApiList() {
    let baseUrl = BackendUrl
    let apiList = {

        api_moduleList: `${baseUrl}/api/user-managment/v2/crud/module/list`,
        
        //heartBeatApi
        api_checkHeartBeat: `${baseUrl}/api/heartbeat`,
        // 1 API TO MENU LIST
        api_getFreeMenuList: `${baseUrl}/api/menu/by-module`,

        api_login: `${baseUrl}/api/login`,
    
       
        // 19 API TO GET WORKFLOW BASIC INFO LIKE PERMISSIONS/WORKFLOW-CANDIDATES
        api_workflowInfo: `${baseUrl}/api/workflow/role-map/workflow-info`,


        // 21 API TO POST DEPARTMENTAL COMMUNICATION DATA
        api_postDepartmental: `${baseUrl}/api/post-custom-data`,

        // 22 API TO TO GET SAF DEPARTMENTAL COMMUNICATION LIST
        api_getDepartmentalData: `${baseUrl}/api/get-all-custom-tab-data`,

        
        //application demand detail in demand screen
        api_verifyDocuments: `${baseUrl}/api/workflows/document/verify-reject`,
        //application demand detail in demand screen
        api_changePassword: `${baseUrl}/api/change-password`,

        // API TO EDIT ADMIN PROFILE
        api_editAdminProfile: `${baseUrl}/api/edit-my-profile`,
        // API TO FETCH JSK DASHBOARD RECENT APPLICATIONS AND RECENT PAYMENTS

        // API TO FETCH NOTIFICATION DATA
        api_getNotification: `${baseUrl}/api/get-user-notifications`,
        // API TO CREATE NOTIFICATION DATA
        api_createNotification: `${baseUrl}/api/dashboard/jsk/prop-dashboard`,
        // API TO DELETE NOTIFICATION DATA
        api_deleteNotification: `${baseUrl}/api/dashboard/jsk/prop-dashboard`,

        // ════════════════════════║🔰 Marriage Api List 🔰║═══════════════════════════ 
        marriageInbox : baseUrl + '/api/marriage/inbox',
        marriageDetails : baseUrl + '/api/marriage/details',
        workflowInfo : baseUrl + "/api/workflow/role-map/workflow-info",
        appointSet : baseUrl + "/api/marriage/set-appiontment-date",
        getUploadedDocument : baseUrl + "/api/marriage/get-uploaded-document",
        docVerify : baseUrl + "/api/marriage/doc-verify-reject",
        approveReject : baseUrl + "/api/marriage/final-approval-rejection",
        approvedList : baseUrl + "/api/marriage/approved-application",
        marriageApplicationList : baseUrl + "/api/marriage/search-application",
        marriageOrderId : baseUrl + "/api/marriage/generate-order-id",
        api_postMarriageOfflinePayment: baseUrl + '/api/marriage/offline-payment',
        api_MarriageReceipt: baseUrl + '/api/marriage/payment-receipt',
        api_marriageNextLevel: baseUrl + '/api/marriage/post-next-level',
        
        api_postMarriageSubmission: `${baseUrl}/api/marriage/apply`,
        api_getDocList: `${baseUrl}/api/marriage/get-doc-list`,
        api_docUpload: `${baseUrl}/api/marriage/upload-document`,
        api_getDetails: `${baseUrl}/api/marriage/static-details`,
        api_getList: `${baseUrl}/api/marriage/applied-application`,
        api_deleteApplication: `${baseUrl}/api/marriage/`,
        api_editMarriageApplication: `${baseUrl}/api/marriage/edit-application`,

        // 👉 ================ Fines & Penalties API List =================== 👈
        api_submitInfractionForm : `${baseUrl}/api/infrac-recod-form/crud/save`,
        api_updateInfractionForm : `${baseUrl}/api/infrac-recod-form/crud/edit`,
        api_getInfractionById    : `${baseUrl}/api/infrac-recod-form/crud/show`,
        api_getViolationList     : `${baseUrl}/api/violation-section/crud/list`,        
        api_getInfractionList     : `${baseUrl}/api/infrac-recod-form/crud/retrieve-all`,        
        
        api_violationMasterList : `${baseUrl}/api/violation/crud/list`,  
        api_getViolationById     : `${baseUrl}/api/violation-section/crud/get`,
        api_updateViolation     : `${baseUrl}/api/violation/crud/edit`,
        api_addViolation        : `${baseUrl}/api/violation/crud/save`,
        api_deleteViolation     : `${baseUrl}/api/violation/crud/delete`,

        fpInbox : baseUrl + '/api/infrac-recod-form/inbox',
        fpDocList : baseUrl + '/api/infrac-recod-form/crud/show-document',
    }


    return apiList
}


