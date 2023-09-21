///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : FPDashboard
// 👉 Status      : Close
// 👉 Description : This component is for marriage home page.
// 👉 Functions   :  
//                  1. fetchApprovedList    -> To fetch approve marriage list.
//                  2. fetchPendingList     -> To fetch pending marriage list.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useEffect, useState } from 'react'
import './home.css'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'
import ApiHeader from '@/Components/api/ApiHeader'
import ProjectApiList from '@/Components/api/ProjectApiList'
import useSetTitle from '@/Components/Common/useSetTitle'
import { getLocalStorageItemJsonParsed } from '@/Components/Common/localstorage'
import Heading from './Heading'
import ApplicationCard from './ApplicationCard'
import ShortcutCard from './ShortcutCard'
import Table from './Table'

function FPDashboard() {

    // 👉 Setting Title 👈
    useSetTitle("Home")

    // 👉 API constants 👈
    const { approvedList, marriageApplicationList } = ProjectApiList()

    // 👉 Roles constant 👈
    const allRole = getLocalStorageItemJsonParsed('userDetails')?.roles

    // 👉 State constants 👈
    const [pendingData, setpendingData] = useState(null)
    const [approvedData, setapprovedData] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [isLoading2, setisLoading2] = useState(false)

    // 👉 Function 1 👈
    const fetchApprovedList = () => {
        setisLoading(true)
        AxiosInterceptors.post(approvedList, {}, ApiHeader())
            .then(function (response) {
                console.log('approved list data', response.data.data)
                setapprovedData(response.data.data)
            })
            .catch(function (error) {
                console.log('errorrr.... ', error);
            })
            .finally(() => setisLoading(false))
    }

    // 👉 Function 2 👈
    const fetchPendingList = () => {
        setisLoading2(true)
        AxiosInterceptors.post(marriageApplicationList, {}, ApiHeader())
            .then(function (response) {
                console.log('pending list data', response.data.data)
                setpendingData(response.data.data)
                setisLoading(false)
            })
            .catch(function (error) {
                console.log('errorrr.... ', error);
            })
            .finally(() => setisLoading2(false))
    }

    // 👉 Render to call functions 👈
    useEffect(() => {
        fetchApprovedList()
        fetchPendingList()
    }, [])

    return (
        <>

            {/* 👉 Heading Card 👈 */}
            <Heading
                matchForApply={['JSK']}
                matchForSafWf={['REGISTRAR', 'BACK OFFICE']}
                allRole={allRole}
                heading={"Fines & Penalties Home Page"}
                subHeading={"Verified Account"}
                changePasswordLink={'/change-password'}
                mainWorkflowLink={'/fp-workflow'}
                applyLink={'/fp-apply'}
            />

            {/* 👉 Middle Cards 👈 */}
            <div class="grid grid-cols-12 items-center mx-10 ">

                {/* 👉 Application Card 👈 */}
                <div class="flex flex-row flex-wrap gap-4 items-start col-span-12 md:col-span-6">
                    <div className="w-full md:w-[40%]">
                        <ApplicationCard
                            heading={"Pending Application"}
                            total={pendingData?.total}
                            loading={isLoading}
                        />
                    </div>

                    <div className="w-full md:w-[40%]">
                        <ApplicationCard
                            heading={"Approved Application"}
                            total={approvedData?.total}
                            loading={isLoading2}
                        />
                    </div>

                </div>

                {/* 👉 Shortcuts Card 👈 */}
                <div class="flex flex-col flex-wrap gap-4 justify-center col-span-12 md:col-span-6 md:mt-0 mt-10">
                    <div className="w-full md:w-[50%]">

                        <ShortcutCard
                            heading={"Marriage Application List"}
                            path={'/application-marriage-list'}
                        />
                    </div>
                    <div className="w-full md:w-[50%]">

                        <ShortcutCard
                            heading={"Registered Marriage List"}
                            path={'/registered-marriage-list'}
                        />
                    </div>

                </div>

            </div>

            {/* 👉 Recent Application Table 👈 */}
            <div className='mx-10 mt-10 md:w-auto w-[80vw] overflow-auto'>
                <div className="font-bold text-md mb-2 flex-1 text-gray-600"># Recent Applications</div>
                <Table
                    loading={isLoading2}
                    heading={['Application No.', 'Bride Name', 'Groom Name', 'Marriage Date', 'Marriage Place', 'Is BPL', 'Appointment Date']}
                    dataKey={['application_no', 'bride_name', 'groom_name', 'marriage_date', 'marriage_place', 'is_bpl', 'appointment_date']}
                    data={pendingData?.data ?? []}
                    viewLink={'/marriage-details/'}
                />
            </div>

        </>
    )
}

export default FPDashboard