import BackendUrl from "./BackendUrl"

export default function ProjectApiList() {
    let baseUrl = BackendUrl
    let apiList = {

        api_moduleList: `${baseUrl}/user-managment/v2/crud/module/list`,
        
        //heartBeatApi
        api_checkHeartBeat: `${baseUrl}/heartbeat`,
        // 1 API TO MENU LIST
        api_getFreeMenuList: `${baseUrl}/menu/by-module`,

        api_login: `${baseUrl}/login`,
        api_logout: `${baseUrl}/logout`,
        api_setPassword: `${baseUrl}/user/set-password`,
    
       
        // 19 API TO GET WORKFLOW BASIC INFO LIKE PERMISSIONS/WORKFLOW-CANDIDATES
        api_workflowInfo: `${baseUrl}/workflow/role-map/workflow-info`,


        // 21 API TO POST DEPARTMENTAL COMMUNICATION DATA
        api_postDepartmental: `${baseUrl}/post-custom-data`,

        // 22 API TO TO GET SAF DEPARTMENTAL COMMUNICATION LIST
        api_getDepartmentalData: `${baseUrl}/get-all-custom-tab-data`,

        
        //application demand detail in demand screen
        api_verifyDocuments: `${baseUrl}/workflows/document/verify-reject`,
        //application demand detail in demand screen
        api_changePassword: `${baseUrl}/change-password`,

        // API TO EDIT ADMIN PROFILE
        api_editAdminProfile: `${baseUrl}/edit-my-profile`,
        // API TO FETCH JSK DASHBOARD RECENT APPLICATIONS AND RECENT PAYMENTS

        // API TO FETCH NOTIFICATION DATA
        api_getNotification: `${baseUrl}/get-user-notifications`,
        // API TO CREATE NOTIFICATION DATA
        api_createNotification: `${baseUrl}/dashboard/jsk/prop-dashboard`,
        // API TO DELETE NOTIFICATION DATA
        api_deleteNotification: `${baseUrl}/dashboard/jsk/prop-dashboard`,

        // ════════════════════════║🔰 Marriage Api List 🔰║═══════════════════════════ 
        marriageInbox : baseUrl + '/marriage/inbox',
        marriageDetails : baseUrl + '/marriage/details',
        workflowInfo : baseUrl + "/workflow/role-map/workflow-info",
        appointSet : baseUrl + "/marriage/set-appiontment-date",
        getUploadedDocument : baseUrl + "/marriage/get-uploaded-document",
        docVerify : baseUrl + "/marriage/doc-verify-reject",
        approveReject : baseUrl + "/marriage/final-approval-rejection",
        approvedList : baseUrl + "/marriage/approved-application",
        marriageApplicationList : baseUrl + "/marriage/search-application",
        marriageOrderId : baseUrl + "/marriage/generate-order-id",
        api_postMarriageOfflinePayment: baseUrl + '/marriage/offline-payment',
        api_MarriageReceipt: baseUrl + '/marriage/payment-receipt',
        api_marriageNextLevel: baseUrl + '/marriage/post-next-level',
        
        api_postMarriageSubmission: `${baseUrl}/marriage/apply`,
        api_getDocList: `${baseUrl}/marriage/get-doc-list`,
        api_docUpload: `${baseUrl}/marriage/upload-document`,
        api_getDetails: `${baseUrl}/marriage/static-details`,
        api_getList: `${baseUrl}/marriage/applied-application`,
        api_deleteApplication: `${baseUrl}/marriage/`,
        api_editMarriageApplication: `${baseUrl}/marriage/edit-application`,

        // 👉 ================ Fines & Penalties API List =================== 👈
        api_submitInfractionForm : `${baseUrl}/penalty-record/crud/save`,
        api_updateInfractionForm : `${baseUrl}/penalty-record/crud/edit`,
        api_getInfractionById    : `${baseUrl}/v2/penalty-record/crud/show`,
        api_getInfractionList     : `${baseUrl}/penalty-record/crud/active-all`,        
        
        api_getViolationList     : `${baseUrl}/violation/crud/list`,        
        api_getWardList          : `${baseUrl}/ward-list`,        
        
        api_violationMasterList : `${baseUrl}/violation/crud/list`,  
        api_getViolationById     : `${baseUrl}/violation/crud/get`,
        api_updateViolation     : `${baseUrl}/violation/crud/edit`,
        api_addViolation        : `${baseUrl}/violation/crud/save`,
        api_deleteViolation     : `${baseUrl}/violation/crud/delete`,

        fpInbox : baseUrl + '/penalty-record/inbox',
        fpDetails : baseUrl + '/penalty-record/detail',
        fpDocList : baseUrl + '/penalty-record/crud/show-document',
        fpApprove : baseUrl + '/penalty-record/approve',
        api_fpChallan2 : baseUrl + '/penalty-record/get-challan',
        getFpUploadedDocument : baseUrl + "/penalty-record/get-uploaded-document",

        api_FPTrack: `${baseUrl}/penalty-record/challan-search`,

        api_FpApplyReport:           `${baseUrl}/penalty-record/challan-search`,
        api_ChallanGeneratingReport: `${baseUrl}/report/challan-wise`,
        api_ViolationWiseReport:     `${baseUrl}/report/violation-wise`,
        api_CollectionReport:        `${baseUrl}/report/collection-wise`,

        api_getChallanById:        `${baseUrl}/penalty-record/get-challan`,
        api_challanOfflinePayment: `${baseUrl}/penalty-record/offline-challan-payment`,

        api_FpReceipt : baseUrl + '/penalty-record/payment-receipt',

        api_getViolationList:    `${baseUrl}/violation/list`,
        api_getSectionList:      `${baseUrl}/section/list`,
        api_assignViolation:     `${baseUrl}/violation/onspot`,
        api_getDepartmentList:   `${baseUrl}/department/list`,
        api_getUserList:         `${baseUrl}/user-list`,
        
        api_getViolationByDept:  `${baseUrl}/violation/by-department`,

        api_listDepartment: `${baseUrl}/department/crud/list`,
        api_addDepartment: `${baseUrl}/department/crud/save`,
        api_updateDepartment: `${baseUrl}/`,
        api_deleteDepartment: `${baseUrl}/department/crud/delete`,

        api_listSection: `${baseUrl}/section/crud/list`,
        api_addSection: `${baseUrl}/section/crud/save`,
        api_updateSection: `${baseUrl}/`,
        api_deleteSection: `${baseUrl}/section/crud/delete`,
        
        api_compData: `${baseUrl}/report/comparison`,

        api_addRole:        `${baseUrl}/wfrole/crud/save`,
        api_updateRole:     `${baseUrl}/wfrole/crud/edit`,
        api_deletedRole:    `${baseUrl}/wfrole/crud/delete`,
        api_listRole:       `${baseUrl}/wfrole/crud/list`,

        api_addUser:        `${baseUrl}/user/crud/create`,
        api_updateUser:     `${baseUrl}/user/crud/edit`,
        api_deletedUser:    `${baseUrl}/user/crud/delete`,
        api_listUser:       `${baseUrl}/user/crud/list`,

        api_assignRole:     `${baseUrl}/user/role-assign`,

        // Cash Verification
        api_cashVerificaionList : `${baseUrl}/fines/cash-verification-list`,
        api_cashVerificaionById : `${baseUrl}/fines/cash-verification-dtl`,
        api_verifyCash : `${baseUrl}/fines/verify-cash`,

        // ════════════════════║ ONLINE PAYMENT APIS  ║═════════════════════════
        // api_generateOrderId : `${baseUrl}/fines/razorpay/initiate-payment`,
        api_generateOrderId : `${baseUrl}/fines/citizen-online-payment`,
        api_verifyPaymentStatus: `${baseUrl}/`, 

        // ════════════════════║ API TO SEARCH CHALLAN DIRECT  ║═════════════════════════
        api_searchChallanDirect : `${baseUrl}/penalty-record/citizen-challan-search`,

        // ════════════════════║ API TO GET TRANSACTION NUMBER FROM ORDER ID  ║═════════════════════════
        api_getTransactionNo : `${baseUrl}/penalty-record/get-tran-no`,

        // ═════════════║ API TO GET SEND ONLINE PAYMENT RESPONSE ║══════════════════ 
        api_sendOnlineResponse: `${baseUrl}/fines/razorpay/save-response`,

    //    -==================Citizen API List=========================
    api_enf_officer: `${baseUrl}/user/enf-officer`,
    api_enf_cell: `${baseUrl}/user/enf-officer`,
    api_violation_list: `${baseUrl}/v2/violation/crud/list`,

    }


    return apiList
}


