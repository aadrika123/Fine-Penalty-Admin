import React, { useState } from 'react'
import { MdTag } from 'react-icons/md'
import { nullToNA } from '@/Components/Common/PowerupFunctions'
import InfractionForm from '@/Components/Pages/FPComponents/FPForm/InfractionForm'
import ApiHeader from '@/Components/api/ApiHeader'
import AxiosInterceptors from '../../AxiosInterceptors'
import BarLoader from '../../Loaders/BarLoader'
import { toast } from 'react-hot-toast'
import ApplicationSubmitScreen from '../../ApplicationSubmitScreen'
import ProjectApiList from '@/Components/api/ProjectApiList'
import { useNavigate } from 'react-router-dom'

function PilotWorkflowFullDetailsTab(props) {
    const [editStatus, seteditStatus] = useState(false)
    const [btcStatus, setbtcStatus] = useState(false)
    const [normalState, setnormalState] = useState(true)
    const [selectList, setselectList] = useState([])
    const [selectListToShow, setselectListToShow] = useState([])
    const [loader, setLoader] = useState(false)
    const [response, setResponse] = useState(false)
    const [submissionData, setsubmissionData] = useState(null)

const {fpApprove} = ProjectApiList()

const navigate = useNavigate()

    const selectAction = (status, key, displayString) => {

        console.log('id...', displayString)
        // return
        // ADD TO LIST IF CHECKED 
        // if (status) {
        let tempSelectList = [...selectList, key]
        let tempSelectListToShow = [...selectListToShow, displayString]

        setselectList(tempSelectList)
        setselectListToShow(tempSelectListToShow)
        // }

        // REMOVE FORM LIST IF UNCHECKED

    }

    const approveFun = (data) => {
        console.log(data)

        setLoader(true)

        AxiosInterceptors
            .post(fpApprove, data, ApiHeader())
            .then((res) => {
                setResponse(res?.data?.status)
                if (res?.data?.status) {
                    toast.success("Approved Successfully !!!")
                    setsubmissionData(res?.data?.data)
                } else {
                    props?.activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
                console.log('submission fp response => ', res)
            })
            .catch((err) => {
                props?.activateBottomErrorCard(true, 'Server Error! Please try again later.')
                console.log('error submission fp => ', err)
            })
            .finally(() => {
                setLoader(false)
            })
    }

    console.log('lis....', selectListToShow, props?.applicationData)
    return (
        <>

            {loader && <BarLoader />}
            <ApplicationSubmitScreen heading={"Fine & Penalty Workflow"} appNo={submissionData?.challanNo} openSubmit={response} refresh={() => navigate(`/challan/${submissionData?.id}`)} />
            <InfractionForm type={'edit'} id={props?.id} approve={(data) => approveFun(data)} />
        </>
    )
}

export default PilotWorkflowFullDetailsTab