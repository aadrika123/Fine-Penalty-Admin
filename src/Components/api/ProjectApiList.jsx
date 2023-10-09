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
        api_setPassword: `${baseUrl}/api/user/set-password`,
    
       
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
        api_submitInfractionForm : `${baseUrl}/api/penalty-record/crud/save`,
        api_updateInfractionForm : `${baseUrl}/api/penalty-record/crud/edit`,
        api_getInfractionById    : `${baseUrl}/api/penalty-record/crud/show`,
        api_getInfractionList     : `${baseUrl}/api/penalty-record/crud/active-all`,        
        
        api_getViolationList     : `${baseUrl}/api/violation/crud/list`,        
        
        api_violationMasterList : `${baseUrl}/api/violation/crud/list`,  
        api_getViolationById     : `${baseUrl}/api/violation/crud/get`,
        api_updateViolation     : `${baseUrl}/api/violation/crud/edit`,
        api_addViolation        : `${baseUrl}/api/violation/crud/save`,
        api_deleteViolation     : `${baseUrl}/api/violation/crud/delete`,

        fpInbox : baseUrl + '/api/penalty-record/inbox',
        fpDetails : baseUrl + '/api/penalty-record/detail',
        fpDocList : baseUrl + '/api/penalty-record/crud/show-document',
        fpApprove : baseUrl + '/api/penalty-record/approve',
        api_fpChallan2 : baseUrl + '/api/penalty-record/get-challan',
        getFpUploadedDocument : baseUrl + "/api/penalty-record/get-uploaded-document",

        api_FPTrack: `${baseUrl}/api/penalty-record/challan-search`,

        api_FpApplyReport:           `${baseUrl}/api/penalty-record/challan-search`,
        api_ChallanGeneratingReport: `${baseUrl}/api/report/challan-wise`,
        api_ViolationWiseReport:     `${baseUrl}/api/report/violation-wise`,
        api_CollectionReport:        `${baseUrl}/api/report/collection-wise`,

        api_getChallanById:        `${baseUrl}/api/penalty-record/get-challan`,
        api_challanOfflinePayment: `${baseUrl}/api/penalty-record/offline-challan-payment`,

        api_FpReceipt : baseUrl + '/api/penalty-record/payment-receipt',

        api_getViolationList:    `${baseUrl}/api/violation/list`,
        api_getSectionList:      `${baseUrl}/api/section/list`,
        api_assignViolation:     `${baseUrl}/api/violation/onspot`,
        api_getDepartmentList:   `${baseUrl}/api/department/list`,
        api_getUserList:         `${baseUrl}/api/user-list`,

        api_listDepartment: `${baseUrl}/api/department/crud/list`,
        api_addDepartment: `${baseUrl}/api/department/crud/save`,
        api_updateDepartment: `${baseUrl}/`,
        api_deleteDepartment: `${baseUrl}/api/department/crud/delete`,

        api_listSection: `${baseUrl}/api/section/crud/list`,
        api_addSection: `${baseUrl}/api/section/crud/save`,
        api_updateSection: `${baseUrl}/`,
        api_deleteSection: `${baseUrl}/api/section/crud/delete`,
        
        api_compData: `${baseUrl}/api/report/comparison`,

        api_addRole:        `${baseUrl}/api/wfrole/crud/save`,
        api_updateRole:     `${baseUrl}/api/wfrole/crud/edit`,
        api_deletedRole:    `${baseUrl}/api/wfrole/crud/delete`,
        api_listRole:       `${baseUrl}/api/wfrole/crud/list`,

        api_addUser:        `${baseUrl}/api/user/crud/create`,
        api_updateUser:     `${baseUrl}/api/user/crud/edit`,
        api_deletedUser:    `${baseUrl}/api/user/crud/delete`,
        api_listUser:       `${baseUrl}/api/user/crud/list`,

    }


    return apiList
}


