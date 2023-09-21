///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : MarriageForm
// 👉 Status      : Close
// 👉 Description : This component is to apply marriage registration
// 👉 Functions   :  
//                  1. getUserDetails           -> To get user details when form is open using edit param.
//                  2. handleOnChange           -> Handle change to event to restrict useless input.
//                  3. activateBottomErrorCard  -> Activate error card to show in screen.
//                  4. submitData               -> Submit final data.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'
import ProjectApiList from '@/Components/api/ProjectApiList'
import BarLoader from '@/Components/Common/Loaders/BarLoader'
import ApplicationSubmitScreen from '@/Components/Common/ApplicationSubmitScreen'
import BottomErrorCard from '@/Components/Common/BottomErrorCard'
import { allowCharacterInput, allowCharacterNumberInput, allowMailInput, allowNumberInput, checkErrorMessage, getCurrentDate } from '@/Components/Common/PowerupFunctions'
import moment from 'moment'
import ApiHeader3 from '@/Components/api/ApiHeader2'
import useSetTitle from '@/Components/Common/useSetTitle'

function MarriageForm() {

    // 👉 Setting Title 👈
    useSetTitle("Marriage Application Form")

    // 👉 URL constants 👈
    const { id, type } = useParams()

    // 👉 API constants 👈
    const { api_postMarriageSubmission, api_getDetails, api_editMarriageApplication } = ProjectApiList()

    // 👉 Navigate constant 👈
    const navigate = useNavigate()

    // 👉 Constant states 👈
    const [isLoading, setisLoading] = useState(false)
    const [submission, setsubmission] = useState(false)
    const [errorState, seterrorState] = useState(false)
    const [errorMessage, seterrorMessage] = useState('')
    const [appNo, setappNo] = useState(null)
    const [details, setdetails] = useState(null)

    // 👉 Validation schema 👈
    const schema = yup.object({

        marriageDate: yup.date().required("Field Required").max(getCurrentDate(), 'not valid').test(
            "dobg",
            "check bride or groom age",
            function (value) {
                const dob = this.resolve(yup.ref('dobg'));
                if (dob == undefined) {
                    return true;
                } else {
                    const ageAtMarriage = moment(value).diff(moment(dob), 'years');
                    const isMinimumAgeMet = ageAtMarriage >= 21;
                    return isMinimumAgeMet;
                }
            }
        ),
        marriagePlace: yup.string().required("Field Required"),
        bpl: yup.string().required("Field Required"),

        applicantNameb: yup.string().required("Field Required"),
        aadharb: yup.string().required("Field Required"),
        fatherNameb: yup.string().required("Field Required"),
        fatherAadharb: yup.string(),
        motherNameb: yup.string().required("Field Required"),
        motherAadharb: yup.string(),
        nationalityb: yup.string().required("Field Required"),
        passportNob: yup.string().when('nationalityb', {
            is: 'NRI',
            then: yup.string().required("Field Required")
        }),
        religionb: yup.string().required("Field Required"),
        addressb: yup.string().required("Field Required"),
        mobileNob: yup.string().required("Field Required"),
        emailb: yup.string(),
        dobb: yup.date().required("Field Required").max(getCurrentDate(), 'Please select valid date').test(
            "dobb",
            "atleast 18 years old",
            value => {
                return moment().diff(moment(value), 'years') >= 18;
            }
        ),
        marriageAgeb: yup.number().typeError('Field Required').min(18, 'atleast 18 years old').required("Field Required").test(
            "marriageAgeb",
            "check marriage date",
            function (value) {
                const dob = this.resolve(yup.ref('dobb'));
                const maxAge = moment().diff(moment(dob), 'years');
                const isMaximumAgeMet = value <= maxAge;
                return isMaximumAgeMet;
            }
        ),
        maritalStatusAtMarriageb: yup.string().required("Field Required"),
        guardianNameb: yup.string().required("Field Required"),
        guardianAadharb: yup.string(),

        applicantNameg: yup.string().required("Field Required"),
        aadharg: yup.string().required("Field Required"),
        fatherNameg: yup.string().required("Field Required"),
        fatherAadharg: yup.string(),
        motherNameg: yup.string().required("Field Required"),
        motherAadharg: yup.string(),
        nationalityg: yup.string().required("Field Required"),
        passportNog: yup.string().when('nationalityg', {
            is: 'NRI',
            then: yup.string().required("Field Required")
        }),
        religiong: yup.string().required("Field Required"),
        addressg: yup.string().required("Field Required"),
        mobileNog: yup.string().required("Field Required"),
        emailg: yup.string(),
        dobg: yup.date().required("Field Required").max(getCurrentDate(), 'Please select valid date').test(
            "dobg",
            "atleast 21 years old",
            value => {
                return moment().diff(moment(value), 'years') >= 21;
            }
        ),
        marriageAgeg: yup.number().typeError('Field Required').min(21, 'atleast 21 years old').required("Field Required").test(
            "marriageAgeg",
            "check marriage date",
            function (value) {
                const dob = this.resolve(yup.ref('dobg'));
                const maxAge = moment().diff(moment(dob), 'years');
                const isMaximumAgeMet = value <= maxAge;
                return isMaximumAgeMet;
            }
        ),
        maritalStatusAtMarriageg: yup.string().required("Field Required"),
        guardianNameg: yup.string().required("Field Required"),
        guardianAadharg: yup.string(),

        witness1name: yup.string().required("Field Required"),
        witness1address: yup.string().required("Field Required"),
        witness2name: yup.string().required("Field Required"),
        witness2address: yup.string().required("Field Required"),
        witness3name: yup.string().required("Field Required"),
        witness3address: yup.string().required("Field Required"),
    })

    // 👉 Formik initial values 👈
    const initialValues = {

        marriageDate: details?.marriage_date,
        marriagePlace: details?.marriage_place,
        bpl: details?.is_bpl ?? 0,

        applicantNameb: details?.bride_name,
        aadharb: details?.bride_aadhar_no,
        fatherNameb: details?.bride_father_name,
        fatherAadharb: details?.bride_father_aadhar_no,
        motherNameb: details?.bride_mother_name,
        motherAadharb: details?.bride_mother_aadhar_no,
        nationalityb: details?.bride_nationality,
        passportNob: details?.bride_passport_no,
        religionb: details?.bride_religion,
        addressb: details?.bride_residential_address,
        mobileNob: details?.bride_mobile,
        emailb: details?.bride_email,
        dobb: details?.bride_dob,
        marriageAgeb: details?.bride_age,
        maritalStatusAtMarriageb: details?.bride_martial_status,
        guardianNameb: details?.bride_guardian_name,
        guardianAadharb: details?.bride_guardian_aadhar_no,

        applicantNameg: details?.groom_name,
        aadharg: details?.groom_aadhar_no,
        fatherNameg: details?.groom_father_name,
        fatherAadharg: details?.groom_father_aadhar_no,
        motherNameg: details?.groom_mother_name,
        motherAadharg: details?.groom_mother_aadhar_no,
        nationalityg: details?.groom_nationality,
        passportNog: details?.groom_passport_no,
        religiong: details?.groom_religion,
        addressg: details?.groom_residential_address,
        mobileNog: details?.groom_mobile,
        emailg: details?.groom_email,
        dobg: details?.groom_dob,
        marriageAgeg: details?.groom_age,
        maritalStatusAtMarriageg: details?.groom_martial_status,
        guardianNameg: details?.groom_guardian_name,
        guardianAadharg: details?.groom_guardian_aadhar_no,

        witness1name: details?.witness1_name,
        witness1address: details?.witness1_residential_address,
        witness2name: details?.witness2_name,
        witness2address: details?.witness2_residential_address,
        witness3name: details?.witness3_name,
        witness3address: details?.witness3_residential_address,
    };

    // 👉 Formik constant 👈
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: schema,
        onSubmit: (values) => {
            console.log(values)
            submitData(values)
        }
    })

    // 👉 Function 1 👈
    const getUserDetails = () => {
        setisLoading(true)
        AxiosInterceptors.post(api_getDetails, { applicationId: id }, ApiHeader3())
            .then((res) => {
                console.log("getting response of user data => ", res)
                if (res?.data?.status) {
                    console.log("user data => ", res?.data?.data)
                    setdetails(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, res?.data?.message)
                }
            })
            .catch((err) => {
                console.log("getting error doc list for marriage => ", err)
                activateBottomErrorCard(true, "Error getting document list, please try again later !")
            })
            .finally(() => {
                setisLoading(false)
            })
    }

    // 👉 Function 2 👈
    const handleOnChange = (event) => {

        let name = event.target.name
        let value = event.target.value

        { name == "applicantNameb" && formik.setFieldValue("applicantNameb", allowCharacterInput(value, formik.values?.applicantNameb, 50)) }
        { name == "aadharb" && formik.setFieldValue("aadharb", allowNumberInput(value, formik.values?.aadharb, 12)) }
        { name == "fatherNameb" && formik.setFieldValue("fatherNameb", allowCharacterInput(value, formik.values?.fatherNameb, 50)) }
        { name == "fatherAadharb" && formik.setFieldValue("fatherAadharb", allowNumberInput(value, formik.values?.fatherAadharb, 12)) }
        { name == "motherNameb" && formik.setFieldValue("motherNameb", allowCharacterInput(value, formik.values?.motherNameb, 50)) }
        { name == "motherAadharb" && formik.setFieldValue("motherAadharb", allowNumberInput(value, formik.values?.motherAadharb, 12)) }
        { name == "passportNob" && formik.setFieldValue("passportNob", allowCharacterNumberInput(value, formik.values?.passportNob, 20)) }
        { name == "religionb" && formik.setFieldValue("religionb", allowCharacterInput(value, formik.values?.religionb, 15)) }
        { name == "mobileNob" && formik.setFieldValue("mobileNob", allowNumberInput(value, formik.values?.mobileNob, 10)) }
        { name == "emailb" && formik.setFieldValue("emailb", allowMailInput(value, formik.values?.emailb, 50)) }
        { name == "guardianNameb" && formik.setFieldValue("guardianNameb", allowCharacterInput(value, formik.values?.guardianNameb, 50)) }
        { name == "guardianAadharb" && formik.setFieldValue("guardianAadharb", allowNumberInput(value, formik.values?.guardianAadharb, 12)) }

        { name == "applicantNameg" && formik.setFieldValue("applicantNameg", allowCharacterInput(value, formik.values?.applicantNameg, 50)) }
        { name == "aadharg" && formik.setFieldValue("aadharg", allowNumberInput(value, formik.values?.aadharg, 12)) }
        { name == "fatherNameg" && formik.setFieldValue("fatherNameg", allowCharacterInput(value, formik.values?.fatherNameg, 50)) }
        { name == "fatherAadharg" && formik.setFieldValue("fatherAadharg", allowNumberInput(value, formik.values?.fatherAadharg, 12)) }
        { name == "motherNameg" && formik.setFieldValue("motherNameg", allowCharacterInput(value, formik.values?.motherNameg, 50)) }
        { name == "motherAadharg" && formik.setFieldValue("motherAadharg", allowNumberInput(value, formik.values?.motherAadharg, 12)) }
        { name == "passportNog" && formik.setFieldValue("passportNog", allowCharacterNumberInput(value, formik.values?.passportNog, 20)) }
        { name == "religiong" && formik.setFieldValue("religiong", allowCharacterInput(value, formik.values?.religiong, 15)) }
        { name == "mobileNog" && formik.setFieldValue("mobileNog", allowNumberInput(value, formik.values?.mobileNog, 10)) }
        { name == "emailg" && formik.setFieldValue("emailg", allowMailInput(value, formik.values?.emailg, 50)) }
        { name == "guardianNameg" && formik.setFieldValue("guardianNameg", allowCharacterInput(value, formik.values?.guardianNameg, 50)) }
        { name == "guardianAadharg" && formik.setFieldValue("guardianAadharg", allowNumberInput(value, formik.values?.guardianAadharg, 12)) }

        { name == "witness1name" && formik.setFieldValue("witness1name", allowCharacterInput(value, formik.values?.witness1name, 50)) }
        { name == "witness2name" && formik.setFieldValue("witness2name", allowCharacterInput(value, formik.values?.witness2name, 50)) }
        { name == "witness3name" && formik.setFieldValue("witness3name", allowCharacterInput(value, formik.values?.witness3name, 50)) }

    };

    // 👉 Function 3 👈
    const activateBottomErrorCard = (state, msg) => {
        seterrorMessage(msg)
        seterrorState(state)
    }

    // 👉 Function 4 👈
    const submitData = (values) => {
        setisLoading(true)

        let body = {

            ulbId: values?.ulb,

            brideName: values?.applicantNameb,
            brideDob: values?.dobb,
            brideAge: values?.marriageAgeb,
            brideNationality: values?.nationalityb,
            brideReligion: values?.religionb,
            brideMobile: values?.mobileNob,
            brideAadharNo: values?.aadharb,
            brideEmail: values?.emailb,
            bridePassportNo: values?.passportNob,
            brideResidentialAddress: values?.addressb,
            brideMartialStatus: values?.maritalStatusAtMarriageb,
            brideFatherName: values?.fatherNameb,
            brideFatherAadharNo: values?.fatherAadharb,
            brideMotherName: values?.motherNameb,
            brideMotherAadharNo: values?.motherNameb,
            brideGuardianName: values?.guardianNameb,
            brideGuardianAadharNo: values?.guardianAadharb,

            groomName: values?.applicantNameg,
            groomDob: values?.dobg,
            groomAge: values?.marriageAgeg,
            groomNationality: values?.nationalityg,
            groomReligion: values?.religiong,
            groomMobile: values?.mobileNog,
            groomAadharNo: values?.aadharg,
            groomEmail: values?.emailg,
            groomPassportNo: values?.passportNog,
            groomResidentialAddress: values?.addressg,
            groomMartialStatus: values?.maritalStatusAtMarriageg,
            groomFatherName: values?.fatherNameg,
            groomFatherAadharNo: values?.fatherAadharg,
            groomMotherName: values?.motherNameg,
            groomMotherAadharNo: values?.motherNameg,
            groomGuardianName: values?.guardianNameg,
            groomGuardianAadharNo: values?.guardianAadharg,

            marriageDate: values?.marriageDate,
            marriagePlace: values?.marriagePlace,
            bpl: values?.bpl,

            witness1Name: values?.witness1name,
            witness1ResidentialAddress: values?.witness1address,

            witness2Name: values?.witness2name,
            witness2ResidentialAddress: values?.witness2address,

            witness3Name: values?.witness3name,
            witness3ResidentialAddress: values?.witness3address,
        }

        console.log('body before hit => ', body)

        let url

        if (type == 'edit') {
            url = api_editMarriageApplication
        } else {
            url = api_postMarriageSubmission
        }

        AxiosInterceptors.post(url, body, ApiHeader3())
            .then(function (response) {
                console.log('marriage form submission -> ', response)
                if (response?.data?.status) {
                    setsubmission(true)
                    setappNo(response?.data?.data)
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(response?.data?.message))
                }
                setisLoading(false)
            })
            .catch(function (error) {
                console.log('==2 error list...', error)
                setisLoading(false)
                activateBottomErrorCard(true, "Something went wrong, Please try after sometime !!!")
            })
    }

    // 👉 Render to check param and call getUserDetails() Function 👈
    useEffect(() => {
        if (type == 'edit' && id != undefined) {
            getUserDetails()
        }
    }, [type, id])

    // 👉 Render at formik values to calculate bride and groom age at the time of marriage 👈
    useEffect(() => {
        if (formik.values?.marriageDate !== '' && formik.values?.dobb !== '') {
            const age = moment(formik.values.marriageDate, 'YYYY-MM-DD').diff(moment(formik.values.dobb, 'YYYY-MM-DD'), 'years');
            formik.setFieldValue('marriageAgeb', allowNumberInput(age, age));
        }
        if (formik.values?.marriageDate !== '' && formik.values?.dobg !== '') {
            const age = moment(formik.values.marriageDate, 'YYYY-MM-DD').diff(moment(formik.values.dobg, 'YYYY-MM-DD'), 'years');
            formik.setFieldValue('marriageAgeg', allowNumberInput(age, age));
        }
    }, [formik.values?.marriageDate, formik.values?.dobb, formik.values?.dobg])

    return (
        <>

            {/* 👉 Main Section 👈 */}
            <div className=" animate__animated animate__fadeIn animate__faster overflow-x-hidden overflow-y-scroll w-[99%] mx-auto rounded-md gap-6 h-full p-4">

                {/* 👉 Loader 👈 */}
                {isLoading && <BarLoader />}

                {/* 👉 Application Submission Screen 👈 */}
                <ApplicationSubmitScreen heading={"Marriage Registration"} appNo={appNo?.applicationNo} openSubmit={submission} refresh={() => navigate(`/marriage-pay/${appNo?.id}`)} />

                {/* 👉 Error card 👈 */}
                {errorState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={errorMessage} />}

                {/* 👉 Heading 👈 */}
                <div className='flex justify-center mb-6'>
                    <h1 className='bg-white shadow-lg shadow-indigo-300 text-indigo-500 border-[0.17vw] border-indigo-500 px-[4vw] py-[1.5vh] w-max font-semibold text-[2.8vh]'>{type == 'edit' ? "Update Marriage Registration Form" : "Apply Marriage Registration"}</h1>
                </div>

                {/* 👉 Form section 👈 */}
                <form onChange={handleOnChange} onSubmit={formik.handleSubmit}>

                    <div className="grid grid-cols-12 h-full ">

                        {/* 👉 Marriage place details 👈 */}
                        <h1 className='font-semibold text-lg text-gray-700 mt-4 flex w-[100%] col-span-12 items-center gap-2 px-[1.5vw]'>
                            <span className='w-[40%] h-[0.3vh] bg-gray-700'></span>
                            <span className="w-[20%] text-center">Marriage Details</span>
                            <span className='w-[40%] h-[0.3vh] bg-gray-700'></span>
                        </h1>

                        <div className='bg-white col-span-12 grid grid-cols-12 m-[1vw] px-[1.5vw] gap-[1vw] py-[1vw] rounded-md shadow-md items-center'>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh] ">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Marriage Date<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('marriageDate')} type="date" max={getCurrentDate()} className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.marriageDate && formik.errors.marriageDate ? formik.errors.marriageDate : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-5 mb-[1vh]">
                                <label className={'form-label inline-block mb-1 text-gray-600 text-sm font-semibold'}>Either of the Bride or Groom belongs to BPL category ?</label>
                                <select {...formik.getFieldProps('bpl')} disabled={type == 'edit' ? true : false} className={'form-control block px-3 w-full md:w-[60%] 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer'}
                                >
                                    <option value={0} >No</option>
                                    <option value={1} >Yes</option>
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.bpl && formik.errors.bpl ? formik.errors.bpl : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-9 mb-[1vh] ">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Marriage Place<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('marriagePlace')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.marriagePlace && formik.errors.marriagePlace ? formik.errors.marriagePlace : null}</span>
                            </div>


                        </div>

                        {/* 👉 Bride Details 👈 */}
                        <h1 className='font-semibold text-lg text-gray-700 mt-4 flex w-[100%] col-span-12 items-center gap-2 px-[1.5vw]'>
                            <span className='w-[40%] h-[0.3vh] bg-gray-700'></span>
                            <span className="w-[20%] text-center">Bride Details</span>
                            <span className='w-[40%] h-[0.3vh] bg-gray-700'></span>
                        </h1>

                        <div className='bg-white col-span-12 grid grid-cols-12 m-[1vw] px-[1.5vw] gap-[1vw] py-[1vw] rounded-md shadow-md items-center'>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Name<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('applicantNameb')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.applicantNameb && formik.errors.applicantNameb ? formik.errors.applicantNameb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Aadhar No.<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('aadharb')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.aadharb && formik.errors.aadharb ? formik.errors.aadharb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Father's Name<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('fatherNameb')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.fatherNameb && formik.errors.fatherNameb ? formik.errors.fatherNameb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Father's Aadhar No.</label>
                                <input {...formik.getFieldProps('fatherAadharb')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.fatherAadharb && formik.errors.fatherAadharb ? formik.errors.fatherAadharb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Mother's Name<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('motherNameb')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.motherNameb && formik.errors.motherNameb ? formik.errors.motherNameb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Mother's Aadhar No.</label>
                                <input {...formik.getFieldProps('motherAadharb')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.motherAadharb && formik.errors.motherAadharb ? formik.errors.motherAadharb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Guardian Name<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('guardianNameb')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.guardianNameb && formik.errors.guardianNameb ? formik.errors.guardianNameb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Guardian Aadhar No.</label>
                                <input {...formik.getFieldProps('guardianAadharb')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.guardianAadharb && formik.errors.guardianAadharb ? formik.errors.guardianAadharb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className={'form-label inline-block mb-1 text-gray-600 text-sm font-semibold'}>Nationality<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <select {...formik.getFieldProps('nationalityb')} className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer'}
                                >
                                    <option value="">Select</option>
                                    <option value="Indian" >Indian</option>
                                    <option value="NRI" >NRI</option>
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.nationalityb && formik.errors.nationalityb ? formik.errors.nationalityb : null}</span>
                            </div>

                            {formik.values?.nationalityb == 'NRI' && <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Passport No.<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('passportNob')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.passportNob && formik.errors.passportNob ? formik.errors.passportNob : null}</span>
                            </div>}

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Religion<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('religionb')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.religionb && formik.errors.religionb ? formik.errors.religionb : null}</span>
                            </div>


                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Mobile No.<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('mobileNob')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.mobileNob && formik.errors.mobileNob ? formik.errors.mobileNob : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Email Id</label>
                                <input {...formik.getFieldProps('emailb')} type="email" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.emailb && formik.errors.emailb ? formik.errors.emailb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Date of Birth<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('dobb')} type="date" max={getCurrentDate()} className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.dobb && formik.errors.dobb ? formik.errors.dobb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Age at the time of marriage<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input disabled={true} {...formik.getFieldProps('marriageAgeb')} type="number" className={'bg-gray-100 form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.marriageAgeb && formik.errors.marriageAgeb ? formik.errors.marriageAgeb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-6 mb-[1vh]">
                                <label className={'form-label inline-block mb-1 text-gray-600 text-sm font-semibold'}>Civil condition at the time of marriage<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <select {...formik.getFieldProps('maritalStatusAtMarriageb')} className={'form-control block w-full md:w-1/2 px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer'}
                                >
                                    <option value="">Select</option>
                                    <option value="Married" >Married</option>
                                    <option value="Unmarried" >Unmarried</option>
                                    <option value="Widow" >Widow</option>
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.maritalStatusAtMarriageb && formik.errors.maritalStatusAtMarriageb ? formik.errors.maritalStatusAtMarriageb : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-9 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Full Address<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('addressb')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.addressb && formik.errors.addressb ? formik.errors.addressb : null}</span>
                            </div>

                        </div>

                        {/* 👉 Groom Details 👈 */}
                        <h1 className='font-semibold text-lg text-gray-700 mt-4 flex w-[100%] col-span-12 items-center gap-2 px-[1.5vw]'>
                            <span className='w-[40%] h-[0.3vh] bg-gray-700'></span>
                            <span className="w-[20%] text-center">Groom Details</span>
                            <span className='w-[40%] h-[0.3vh] bg-gray-700'></span>
                        </h1>

                        <div className='bg-white col-span-12 grid grid-cols-12 m-[1vw] px-[1.5vw] gap-[1vw] py-[1vw] rounded-md shadow-md items-center'>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Name<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('applicantNameg')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.applicantNameg && formik.errors.applicantNameg ? formik.errors.applicantNameg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Aadhar No.<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('aadharg')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.aadharg && formik.errors.aadharg ? formik.errors.aadharg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Father's Name<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('fatherNameg')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.fatherNameg && formik.errors.fatherNameg ? formik.errors.fatherNameg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Father's Aadhar No.</label>
                                <input {...formik.getFieldProps('fatherAadharg')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.fatherAadharg && formik.errors.fatherAadharg ? formik.errors.fatherAadharg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Mother's Name<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('motherNameg')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.motherNameg && formik.errors.motherNameg ? formik.errors.motherNameg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Mother's Aadhar No.</label>
                                <input {...formik.getFieldProps('motherAadharg')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.motherAadharg && formik.errors.motherAadharg ? formik.errors.motherAadharg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Guardian Name<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('guardianNameg')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.guardianNameg && formik.errors.guardianNameg ? formik.errors.guardianNameg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Guardian Aadhar No.</label>
                                <input {...formik.getFieldProps('guardianAadharg')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.guardianAadharg && formik.errors.guardianAadharg ? formik.errors.guardianAadharg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className={'form-label inline-block mb-1 text-gray-600 text-sm font-semibold'}>Nationality<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <select {...formik.getFieldProps('nationalityg')} className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer'}
                                >
                                    <option value="">Select</option>
                                    <option value="Indian" >Indian</option>
                                    <option value="NRI" >NRI</option>
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.nationalityg && formik.errors.nationalityg ? formik.errors.nationalityg : null}</span>
                            </div>

                            {formik.values?.nationalityg == "NRI" && <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Passport No.<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('passportNog')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.passportNog && formik.errors.passportNog ? formik.errors.passportNog : null}</span>
                            </div>}

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Religion<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('religiong')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.religiong && formik.errors.religiong ? formik.errors.religiong : null}</span>
                            </div>


                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Mobile No.<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('mobileNog')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.mobileNog && formik.errors.mobileNog ? formik.errors.mobileNog : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Email Id</label>
                                <input {...formik.getFieldProps('emailg')} type="email" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.emailg && formik.errors.emailg ? formik.errors.emailg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Date of Birth<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('dobg')} type="date" max={getCurrentDate()} className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.dobg && formik.errors.dobg ? formik.errors.dobg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold ">Age at the time of marriage<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('marriageAgeg')} disabled={true} type="number" className={'bg-gray-100 form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.marriageAgeg && formik.errors.marriageAgeg ? formik.errors.marriageAgeg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-6 mb-[1vh]">
                                <label className={'form-label inline-block mb-1 text-gray-600 text-sm font-semibold'}>Civil condition at the time of marriage<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <select {...formik.getFieldProps('maritalStatusAtMarriageg')} className={'form-control block w-full md:w-1/2 px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md cursor-pointer'}
                                >
                                    <option value="">Select</option>
                                    <option value="Married" >Married</option>
                                    <option value="Unmarried" >Unmarried</option>
                                    <option value="Widower" >Widower</option>
                                </select>
                                <span className="text-red-600 text-xs">{formik.touched.maritalStatusAtMarriageg && formik.errors.maritalStatusAtMarriageg ? formik.errors.maritalStatusAtMarriageg : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-9 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Full Address<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('addressg')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.addressg && formik.errors.addressg ? formik.errors.addressg : null}</span>
                            </div>

                        </div>

                        {/* 👉 Witness Details 👈 */}
                        <h1 className='font-semibold text-lg text-gray-700 mt-4 flex w-[100%] col-span-12 items-center gap-2 px-[1.5vw]'>
                            <span className='w-[40%] h-[0.3vh] bg-gray-700'></span>
                            <span className="w-[20%] text-center">Witness Details</span>
                            <span className='w-[40%] h-[0.3vh] bg-gray-700'></span>
                        </h1>

                        <div className='bg-white col-span-12 grid grid-cols-12 m-[1vw] px-[1.5vw] gap-[1vw] py-[1vw] rounded-md shadow-md items-center'>

                            <div className="form-group col-span-1 mb-[1vh] text-gray-700 text-sm font-semibold">
                                1.
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Witness Name<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('witness1name')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.witness1name && formik.errors.witness1name ? formik.errors.witness1name : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-8 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Witness Address<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('witness1address')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.witness1address && formik.errors.witness1address ? formik.errors.witness1address : null}</span>
                            </div>

                            <div className="form-group col-span-1 mb-[1vh] text-gray-700 text-sm font-semibold">
                                2.
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Witness Name<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('witness2name')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.witness2name && formik.errors.witness2name ? formik.errors.witness2name : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-8 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Witness Address<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('witness2address')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.witness2address && formik.errors.witness2address ? formik.errors.witness2address : null}</span>
                            </div>

                            <div className="form-group col-span-1 mb-[1vh] text-gray-700 text-sm font-semibold">
                                3.
                            </div>

                            <div className="form-group col-span-12 md:col-span-3 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Witness Name<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('witness3name')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.witness3name && formik.errors.witness3name ? formik.errors.witness3name : null}</span>
                            </div>

                            <div className="form-group col-span-12 md:col-span-8 mb-[1vh]">
                                <label className="form-label inline-block mb-1 text-gray-600 text-sm font-semibold">Witness Address<small className="mt-1 text-sm font-semibold text-red-600 inline ">*</small></label>
                                <input {...formik.getFieldProps('witness3address')} type="text" className={'form-control block w-full px-3 2xl:py-1.5 py-1 2xl:text-base text-sm font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none placeholder-gray-300 shadow-md'}
                                />
                                <span className="text-red-600 text-xs">{formik.touched.witness3address && formik.errors.witness3address ? formik.errors.witness3address : null}</span>
                            </div>

                        </div>

                        {/* 👉 Submit Button 👈 */}
                        <div className=' text-right col-span-12 my-10'>
                            <button type="submit" className="px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight  rounded  hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out">{type == 'edit' ? "Update" : "Submit"}</button>
                        </div>

                    </div>

                </form>
            </div>

            {/* <div className="h-[15vh]"></div> */}
        </>
    )
}

export default MarriageForm