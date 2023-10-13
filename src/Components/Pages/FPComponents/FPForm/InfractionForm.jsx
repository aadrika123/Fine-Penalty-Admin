///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : InfractionForm
// 👉 Date        : 20-09-2023
// 👉 Status      : Close
// 👉 Description : Infraction recording form (Apply and edit) for fines & penalty.
// 👉 Functions   :  
//                  1. buttonStyle             -> To style button by passing color name.
//                  2. inputBox                -> Function to map input field.
//                  3. activateBottonErrorCard -> To activate error card with status and message.
//                  4. getViolationList        -> To fetch violation type list.
//                  5. getViolationById        -> To fetch violation section and penalty amount by id.
//                  6. getLocationFromImage    -> To fetch geo location from image.
//                  7. handleChange            -> To handle dependent list on change.
//                  8. feedFormData            -> To feed form when comes to edit.
//                  9. fetchData               -> To fetch form data by id.
//                 10. editFun                 -> To send payload to PilotWorkflowFullDetailsTab.jsx .
//                 11. submitFun               -> To final submit data.
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import useSetTitle from '@/Components/Common/useSetTitle'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import fp from '@/Components/assets/fp.jpg'
import { useFormik } from 'formik'
import * as yup from 'yup'
import BarLoader from '@/Components/Common/Loaders/BarLoader'
import exifr from 'exifr';
import { allowCharacterInput, allowCharacterNumberInput, allowMailInput, allowNumberInput, checkErrorMessage, checkSizeValidation, indianAmount, nullToNA } from '@/Components/Common/PowerupFunctions'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'
import ApiHeader2 from '@/Components/api/ApiHeader2'
import ApiHeader from '@/Components/api/ApiHeader'
import ProjectApiList from '@/Components/api/ProjectApiList'
import BottomErrorCard from '@/Components/Common/BottomErrorCard'
import { toast } from 'react-hot-toast'
import ApplicationSubmitScreen from '@/Components/Common/ApplicationSubmitScreen'
import { FiAlertCircle } from 'react-icons/fi'

const InfractionForm = (props) => {

    // 👉 To set title 👈
    useSetTitle("Fine & Penalty Form")

    // 👉 PROPS constants 👈
    const { type, id } = props

    const dialogRef = useRef()

    // 👉 Navigate constants 👈
    const navigate = useNavigate()

    // 👉 API constants 👈
    const { api_submitInfractionForm, api_getViolationByDept, api_getViolationById, api_listDepartment, api_getInfractionById, api_updateInfractionForm, api_getWardList } = ProjectApiList()

    // 👉 State constants 👈
    const [sloader, setSloader] = useState(false)
    const [loader, setLoader] = useState(false)
    const [violationData, setViolationData] = useState(null)
    const [location, setLocation] = useState(null)
    const [geoTaggedImage, setGeoTaggedImage] = useState(null)
    const [videoAudioFile, setVideoAudioFile] = useState(null)
    const [pdfDocument, setPdfDocument] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [errorState, setErrorState] = useState(false)
    const [submissionData, setSubmissionData] = useState(null)
    const [isSubmit, setIsSubmit] = useState(false)
    const [formDetails, setFormDetails] = useState(null)
    const [canEdit, setcanEdit] = useState(true)
    const [violationList, setViolationList] = useState([])
    const [violationSectionList, setViolationSectionList] = useState([])
    const [departmentList, setDepartmentList] = useState([])
    const [sLoader, setsLoader] = useState(false)
    const [wardList, setwardList] = useState([])

    // 👉 CSS Constants 👈
    const labelStyle = 'text-gray-800 text-sm'
    const inputStyle = 'border focus:outline-none drop-shadow-sm focus:drop-shadow-md px-4 py-1 text-gray-700 shadow-black placeholder:text-sm'
    const fileStyle = 'block w-full border focus:outline-none drop-shadow-sm focus:drop-shadow-md p-1 text-sm text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-sm file:border file:text-xs file:font-semibold file:bg-zinc-100 hover:file:bg-zinc-200'

    // 👉 Basic Details Fields JSON👈
    const basicForm = [
        { title: "Name of Violator", key: "name", type: 'text', hint: type == 'edit' ? 'NA' : "Enter your name" },
        { title: "Mobile No.", key: "mobileNo", type: 'text', hint: type == 'edit' ? 'NA' : "Enter mobile no." },
        { title: "Email", key: "email", type: 'email', hint: type == 'edit' ? 'NA' : "Enter email" },
        { title: "Guardian Name", key: "guardianName", type: 'text', hint: type == 'edit' ? 'NA' : "Enter guradian name" },
        { title: "Holding No", key: "holdingNo", type: 'text', hint: type == 'edit' ? 'NA' : "Enter holding no." },
        { title: "Trade License No.", key: "tradeLicenseNo", width: 'md:w-[20%] w-full', type: 'text', hint: "Enter trade license no." },
        { title: "Ward", key: "wardId", width: 'md:w-[20%] w-full', type: 'select', hint: "Select ward", options: wardList, okey: 'id', ovalue: 'ward_name' },
    ]

    // 👉 Address Details Fields JSON👈
    const addressForm = [
        { title: "", key: "streetAddress1", type: 'text', width: 'md:w-[45%] w-full', hint: type == 'edit' ? 'NA' : "Enter Street Address 1" },
        // { title: "", key: "streetAddress2", type: 'text', width: 'md:w-[45%] w-full', hint: type == 'edit' ? 'NA' : "Enter Street Address 2" },
        { title: "", key: "city", type: 'text', width: 'auto', hint: type == 'edit' ? 'NA' : "Enter City" },
        { title: "", key: "region", type: 'text', width: 'auto', hint: type == 'edit' ? 'NA' : "Enter Region" },
        { title: "", key: "pincode", type: 'text', width: 'auto', hint: type == 'edit' ? 'NA' : "Enter Postal/Zip Code" },
    ]

    // 👉 Violation Details Fields JSON👈
    const violationForm = [

        { key: 'violationPlace', title: "Violation Place", width: 'md:w-[20%] w-full', type: 'text', required: type == 'edit' ? false : true, hint: type == 'edit' ? 'NA' : "Enter violation place" },
        // { title: "Violation Made (Name of the subject)", key: "violationMade", width: 'md:w-[20%] w-full', type: 'select', hint: type == 'edit' ? 'NA' : "Select violation type", required: true, options: violationList, ovalue: 'id', otitle: 'violation_name' },

        { title: "Department", key: "department", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name", options: departmentList, okey: 'id', ovalue: 'department_name' },
        // { title: "Violation Section", key: "violationSection", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name", options: violationSectionList, okey: 'id', ovalue: 'violation_section' },
        { title: "Violation Made", key: "violationMade", width: 'md:w-[20%] w-full', type: 'select', hint: "Enter your name", options: violationList, okey: 'id', ovalue: 'violation_name' },
        { title: "Violation Section", key: "violationSection", width: 'md:w-[20%] w-full', type: 'disabled', hint: type == 'edit' ? 'NA' : "Select violation type", value: violationData?.violation_section },
        { title: "Penalty Amount", key: "penaltyAmount", width: 'md:w-[20%] w-full', type: 'disabled', hint: type == 'edit' ? 'NA' : "Select violation type", value: indianAmount(violationData?.penalty_amount) },


    ]

    // 👉 Witness Details Fields JSON👈
    // const witnessForm = [
    //     { title: "Witness", key: 'isWitness', type: 'select', required: true, width: 'md:w-[7%] w-full', hint: 'Select violation made', options: [{ title: 'Yes', value: '1' }, { title: "No", value: '0' }], ovalue: 'value', otitle: 'title' },
    //     { title: "Name", key: 'witnessName', type: 'option', width: "", hint: type == 'edit' ? 'NA' : "Enter witness name", check: "isWitness", checkValue: '1' },
    //     { title: "Mobile No.", key: 'witnessMobile', type: 'option', width: "", hint: type == 'edit' ? 'NA' : "Enter witness mobile no.", check: "isWitness", checkValue: '1' },
    // ]

    // 👉 Evidence Details Fields JSON👈
    const docForm = [
        { title: "Video", key: "videoAudio", type: 'file', hint: type == 'edit' ? 'NA' : "Select video or audio", required: false, accept: '.mp4, .webm, .mkv, .mpeg' },
        { title: "Pdf", key: "pdf", type: 'file', hint: type == 'edit' ? 'NA' : "Select pdf", required: false, accept: '.pdf' },
    ]

    // 👉 Formik initial values 👈
    const initialValues = {
        name: '',
        mobileNo: '',
        email: '',
        holdingNo: '',
        guardianName: '',
        tradeLicenseNo: '',
        wardId: '',

        streetAddress1: '',
        streetAddress2: '',
        city: '',
        region: '',
        pincode: '',

        department: "",
        violationSection: "",
        violationMade: '',
        violationPlace: '',

        isWitness: '0',
        witnessName: '',
        witnessMobile: '',

        geoTaggedPhoto: '',
        videoAudio: '',
        pdf: '',

        remarks: ''
    }

    // 👉 Formik validation schema 👈
    const schema = yup.object().shape(
        [...basicForm, ...addressForm, ...docForm, ...violationForm, ...[
            { title: "Geo Tagged Photo", key: "geoTaggedPhoto", type: 'file', hint: type == 'edit' ? 'NA' : "Select geo tagged photo", accept: '.png, .jpg, .jpeg', required: type == 'edit' ? false : true },
            { key: 'remarks', title: "Remarks", type: 'text', width: 'md:w-[40%] w-full', required: type == 'edit' ? true : false, hint: type == 'edit' ? 'NA' : "Enter remarks" },
        ]]?.reduce((acc, elem) => {
            if ((elem?.type != 'select' && elem?.type != 'option') && elem.required) {
                acc[elem.key] = yup.string().required(elem.hint);
            }
            if (elem?.type == 'select' || elem?.type == 'option') {
                if (elem?.check) {
                    acc[elem.key] = yup.string().when(elem?.check, {
                        is: (value) => value == '1',
                        then: () => yup.string().required(elem?.hint)
                    });
                } else {
                    acc[elem.key] = yup.string().required(elem.hint);
                }
            }
            return acc;
        }, {})
    );

    // 👉 Formik constant 👈
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: schema,
        onSubmit: (values) => {
            console.log('enterd')

            type == 'edit' ? dialogRef.current.showModal() : submitFun(values)
        }
    })


    // 👉 Function 1 👈
    const buttonStyle = (color) => {
        return `px-4 py-1 text-sm bg-${color}-500 hover:bg-${color}-600 select-none rounded-sm hover:drop-shadow-md text-white cursor-pointer`
    }

    // 👉 Function 2 👈
    const inputBox = (key, title = '', type, width = '', hint = '', required = false, accept, value = '', options = [], okey = '', ovalue = '') => {
        return (
            <div className={`flex flex-col ${width} `}>
                {title != '' && <label htmlFor={key} className={labelStyle}>{title} {required && <span className='text-red-500 text-xs font-bold'>*</span>} : </label>}
                {type != 'disabled' && type != 'select' && type != 'file' && <input disabled={!canEdit} {...formik.getFieldProps(key)} type={type} className={(canEdit ? inputStyle : 'font-semibold px-4 py-1') + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`} name={key} id="" placeholder={hint} />}
                {type != 'disabled' && type == 'file' && <input disabled={!canEdit} {...formik.getFieldProps(key)} type={type} className={(canEdit ? fileStyle : 'font-semibold px-4 py-1 ') + `${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 text-red-400 file:border-red-200 file:text-red-400' : ' focus:border-zinc-300 border-zinc-200 file:border-zinc-300 file:text-gray-600'}`} name={key} id="" placeholder={hint} accept={accept} />}
                {type != 'disabled' && type == 'select' && <select disabled={!canEdit} {...formik.getFieldProps(key)} className={inputStyle + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`}>
                    {
                        sLoader ?
                            <option>Loading...</option>
                            :
                            <>
                                <option value="">Select</option>
                                {
                                    options?.map((elem) => <option className='' value={elem[okey]}>{elem[ovalue]}</option>)
                                }
                            </>
                    }
                </select>}
                {type == 'disabled' &&
                    <input disabled className={(canEdit ? inputStyle : 'font-semibold px-4 py-1 ') + ' focus:border-zinc-300 border-zinc-200'} value={sloader ? 'Loading...' : value} />
                }
            </div>
        );
    }

    // 👉 Function 3 👈
    const activateBottomErrorCard = (state, message) => {
        setErrorState(state)
        setErrorMessage(message)
    }

    // 👉 Function 4 👈
    // const getViolationListId = () => {

    //     setLoader(true)

    //     AxiosInterceptors
    //         .post(api_getViolationById, {}, ApiHeader())
    //         .then((res) => {
    //             if (res?.data?.status) {
    //                 setViolationData(res?.data?.data)
    //             } else {
    //                 activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
    //             }
    //             console.log('fp violation list response => ', res)
    //         })
    //         .catch((err) => {
    //             activateBottomErrorCard(true, 'Server Error! Please try again later.')
    //             console.log('error fp violation list => ', err)
    //         })
    //         .finally(() => {
    //             setLoader(false)
    //         })
    // }

    // 👉 Function 5 👈
    const getViolationById = (vId) => {

        setSloader(true)

        AxiosInterceptors
            .post(api_getViolationById, { id: vId }, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setViolationData(res?.data?.data)
                } else {
                    // activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
                console.log('fp violation list response => ', res)
            })
            .catch((err) => {
                activateBottomErrorCard(true, 'Server Error! Please try again later.')
                console.log('error fp violation list => ', err)
            })
            .finally(() => {
                setSloader(false)
            })
    }

    // 👉 Function 6 👈
    async function getLocationFromImage(imageFile, val) {
        const exifData = await exifr.parse(imageFile);
        const { latitude, longitude } = exifData?.latitude && exifData?.longitude
            ? { latitude: exifData.latitude, longitude: exifData.longitude }
            : alert('Image does not have location. Turn on location first and then take a picture to upload...');

        return { latitude, longitude };
    }

    // 👉 Function 3 👈
    const getDepartmentList = () => {

        setsLoader(true)

        AxiosInterceptors
            .post(api_listDepartment, {}, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setDepartmentList(res?.data?.data)
                } else {
                }
                console.log('fp department list response => ', res)
            })
            .catch((err) => {
                console.log('error fp department list => ', err)
            })
            .finally(() => {
                setsLoader(false)
            })
    }

    // 👉 Function 4 👈
    // const getViolationSectionList = (value) => {

    //     console.log(value)

    //     setsLoader(true)

    //     AxiosInterceptors
    //         .post(api_getSectionList, { departmentId: value }, ApiHeader())
    //         .then((res) => {
    //             if (res?.data?.status) {
    //                 setViolationSectionList(res?.data?.data)
    //             } else {
    //             }
    //             console.log('fp violation section list response => ', res)
    //         })
    //         .catch((err) => {
    //             console.log('error fp violation section list => ', err)
    //         })
    //         .finally(() => {
    //             setsLoader(false)
    //         })
    // }

    // 👉 Function 5 👈
    const getViolationList = (value, state) => {

        console.log(state, value)

        setsLoader(true)

        let payload = {
            departmentId: state == '0' ? value?.department_id : formik.values.department
        }

        AxiosInterceptors
            .post(api_getViolationByDept, payload, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setViolationList(res?.data?.data)
                } else {
                }
                console.log('fp violation list response => ', res)
            })
            .catch((err) => {
                console.log('error fp violation list => ', err)
            })
            .finally(() => {
                setsLoader(false)
            })
    }

    const getWardList = () => {

        setsLoader(true)

        let payload = {}

        AxiosInterceptors
            .post(api_getWardList, payload, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setwardList(res?.data?.data)
                } else {
                }
                console.log('fp ward list response => ', res)
            })
            .catch((err) => {
                console.log('error fp ward list => ', err)
            })
            .finally(() => {
                setsLoader(false)
            })
    }


    // 👉 Function 7 👈
    const handleChange = async (e) => {

        const name = e.target.name;
        const value = e.target.value;

        { name == "name" && formik.setFieldValue("name", allowCharacterInput(value, formik.values?.name, 50)) }
        { name == "mobileNo" && formik.setFieldValue("mobileNo", allowNumberInput(value, formik.values?.mobileNo, 10)) }
        { name == "email" && formik.setFieldValue("email", allowMailInput(value, formik.values?.email, 50)) }
        { name == "holdingNo" && formik.setFieldValue("holdingNo", allowCharacterNumberInput(value, formik.values?.holdingNo, 20)) }
        { name == "pincode" && formik.setFieldValue("pincode", allowNumberInput(value, formik.values?.pincode, 6)) }
        { name == 'city' && formik.setFieldValue("city", allowCharacterInput(value, formik.values.city, 100)) }
        { name == 'region' && formik.setFieldValue("region", allowCharacterInput(value, formik.values.region, 100)) }
        { name == "witnessName" && formik.setFieldValue("witnessName", allowCharacterInput(value, formik.values?.witnessName, 50)) }
        { name == "witnessMobile" && formik.setFieldValue("witnessMobile", allowNumberInput(value, formik.values?.witnessMobile, 10)) }


        switch (name) {
            case 'geoTaggedPhoto': {

                let file = e?.target?.files[0];

                setLocation(null)

                if (!checkSizeValidation(file)) {
                    formik.setFieldValue('geoTaggedPhoto', '')
                    return;
                }
                const geoLocation = await getLocationFromImage(file);
                console.log(geoLocation)
                if (geoLocation?.latitude && geoLocation?.longitude) {
                    console.log("Image geo location:", geoLocation);
                    setLocation(geoLocation)
                    setGeoTaggedImage(file);
                } else {
                    formik.setFieldValue('geoTaggedPhoto', '')
                    return;
                }

            } break;

            case 'videoAudio': {

                let file = e?.target?.files[0];

                setVideoAudioFile(file)

            } break;

            case 'pdf': {

                let file = e?.target?.files[0];

                if (!checkSizeValidation(file)) {
                    formik.setFieldValue('pdf', '')
                    return;
                } else {
                    setPdfDocument(file)
                }

            } break;

            case "department": {
                getViolationList(value)
            } break;

            case 'violationMade': {
                getViolationById(value)
            } break;
        }
    }

    // 👉 Function 8 👈
    const feedFormData = (data) => {
        formik.setFieldValue('name', data?.full_name)
        formik.setFieldValue('mobileNo', data?.mobile)
        formik.setFieldValue('email', data?.email)
        formik.setFieldValue('guardianName', data?.guardian_name)
        formik.setFieldValue('holdingNo', data?.holding_no)
        formik.setFieldValue('streetAddress1', data?.street_address)
        formik.setFieldValue('wardId', data?.ward_id)
        formik.setFieldValue('tradeLicenseNo', data?.trade_license_no)
        formik.setFieldValue('city', data?.city)
        formik.setFieldValue('region', data?.region)
        formik.setFieldValue('pincode', data?.postal_code)
        formik.setFieldValue('department', data?.department_id)
        formik.setFieldValue('violationSection', data?.section_id)
        formik.setFieldValue('violationMade', data?.violation_id)
        formik.setFieldValue('violationPlace', data?.violation_place)
        formik.setFieldValue('isWitness:', data?.witness)
        formik.setFieldValue('witnessName', data?.witness_name)
        formik.setFieldValue('witnessMobile', data?.witness_mobile)

        getViolationList(data, '0')
        getViolationById(data?.violation_id)

    }

    // 👉 Function 9 👈
    const fetchData = () => {

        setLoader(true)

        AxiosInterceptors
            .post(api_getInfractionById, { id: id }, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    feedFormData(res?.data?.data)
                    setFormDetails(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
                console.log('fp form data response => ', res)
            })
            .catch((err) => {
                activateBottomErrorCard(true, 'Server Error! Please try again later.')
                console.log('error fp form data list => ', err)
            })
            .finally(() => {
                setLoader(false)
            })
    }

    // 👉 Function 10 👈
    const editFun = () => {

        let payload = {
            id: formDetails?.id,
            fullName: formik.values?.name,
            mobile: formik.values?.mobileNo,
            email: formik.values?.email,
            guardianName: formik.values?.guardianName,
            holdingNo: formik.values?.holdingNo,
            tradeLicenseNo: formik.values?.tradeLicenseNo,
            wardId: formik.values?.wardId,
            streetAddress: formik.values?.streetAddress1,
            city: formik.values?.city,
            region: formik.values?.region,
            postalCode: formik.values?.pincode,
            violationId: formik.values?.violationMade,
            violationPlace: formik.values?.violationPlace,
            isWitness: formik.values?.isWitness,
            witnessName: formik.values?.witnessName,
            witnessMobile: formik.values?.witnessMobile,
            remarks: formik.values?.remarks,
        }

        console.log(payload)
        props?.approve(payload)
        dialogRef.current.close()
    }

    // 👉 Function 11 👈
    const submitFun = (values) => {

        console.log(":::::::Submitting values::::::", values, violationData)

        let url;

        let fd = new FormData()

        if (id) {

            url = api_updateInfractionForm;

            fd.append('id', formDetails?.id)

        } else {

            url = api_submitInfractionForm;

            fd.append('photo', geoTaggedImage || '');
            fd.append('longitude', location?.longitude || '');
            fd.append('latitude', location?.latitude || '');
            fd.append('audioVideo', videoAudioFile || '');
            fd.append('pdf', pdfDocument || '');

        }

        fd.append('fullName', values?.name);
        fd.append('mobile', values?.mobileNo);
        fd.append('email', values?.email);
        fd.append('guardianName', values?.guardianName);
        fd.append('holdingNo', values?.holdingNo);

        fd.append('streetAddress1', values?.streetAddress1);
        // fd.append('streetAddress2', values?.streetAddress2);
        fd.append('city', values?.city);
        fd.append('region', values?.region);
        fd.append('postalCode', values?.pincode);

        fd.append('violationId', values?.violationMade);
        fd.append('violationSectionId', violationData?.violation_id);
        fd.append('violationPlace', values?.violationPlace);
        fd.append('penaltyAmount', violationData?.penalty_amount);

        fd.append('isWitness:', values?.isWitness);
        fd.append('witnessName', values?.witnessName);
        fd.append('witnessMobile', values?.witnessMobile);


        setLoader(true)

        AxiosInterceptors
            .post(url, fd, ApiHeader2())
            .then((res) => {
                setIsSubmit(res?.data?.status)
                if (res?.data?.status) {
                    toast.success("Submitted Successfully !!!")
                    setSubmissionData(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
                console.log('submission fp response => ', res)
            })
            .catch((err) => {
                activateBottomErrorCard(true, 'Server Error! Please try again later.')
                console.log('error submission fp => ', err)
            })
            .finally(() => {
                setLoader(false)
            })
    }

    // 👉 To call function 4 and function 9 👈
    useEffect(() => {
        getWardList()
        getDepartmentList()
        id && type == 'edit' && fetchData()
        type == 'edit' && setcanEdit(false)
    }, [id])

    return (
        <>

            {/* 👉 Loader 👈 */}
            {loader && <BarLoader />}

            {/* 👉 Error Card 👈 */}
            {errorState && <BottomErrorCard activateBottomErrorCard={activateBottomErrorCard} errorTitle={errorMessage} />}

            {/* 👉 Application Submission Screen 👈 */}
            <ApplicationSubmitScreen heading={"Fine & Penalty Form"} appNo={submissionData?.application_no} openSubmit={isSubmit} refresh={() => navigate(`/home`)} button={'Home'} />

            {/* 👉 Header 👈 */}
            {(!type || type != 'edit') && <header className='flex gap-2 bg-zinc-50 p-4 drop-shadow-sm justify-center items-center'>

                {/* 👉 Image 👈 */}
                <aside className='w-[9vh] drop-shadow-md'>
                    <img src={fp} alt="" srcset="" />
                </aside>

                {/* 👉 Title 👈 */}
                <main>
                    <article>
                        <figure className='text-base md:text-2xl font-semibold'>
                            Infraction Recording Form
                        </figure>
                        <p className='text-sm'>
                            Fine & Penalty
                        </p>
                    </article>
                </main>

            </header>}

            {/* 👉 Main 👈 */}
            <form onChange={(e) => (formik.handleChange(e), handleChange(e))} onSubmit={formik.handleSubmit} className='w-full h-full pb-4 px-4 my-6 border border-zinc-200 bg-zinc-50'>

                {
                    type == 'edit' &&
                    <header className='w-full flex justify-end gap-2 pt-2'>
                        <span className={buttonStyle('indigo')} onClick={() => setcanEdit(true)}>Edit</span>
                        <button type="submit" className={buttonStyle('green')} >Approve & Generate Challan</button>
                    </header>
                }

                {/* Remarks */}
                {type == 'edit' &&
                    <section className='flex gap-4 flex-wrap mb-6'>

                        <header className='w-full text-gray-700 -mb-3 font-semibold font-serif'>Remarks</header>

                        <div className={`flex flex-col md:w-[40%] w-full `}>
                            <input {...formik.getFieldProps('remarks')} type='text' className={inputStyle + ` ${(formik.touched.remarks && formik.errors.remarks) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`} name='remarks' id="" placeholder='Enter remarks' />
                        </div>

                    </section>
                }
                {/* 👉 Basic Details 👈 */}
                <section className='flex gap-4 flex-wrap '>

                    {
                        basicForm?.map((elem) => {
                            return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, "", '', elem?.options, elem?.okey, elem?.ovalue)
                        })
                    }

                </section>

                {/* 👉 Address Details 👈 */}
                <section className='flex gap-4 flex-wrap my-6'>

                    <header className='w-full text-gray-700 -mb-3 font-semibold font-serif'>Address</header>

                    {
                        addressForm?.map((elem) => {
                            return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required)
                        })
                    }

                </section>

                {/* 👉 Penalty Details 👈 */}
                <section className='flex gap-4 flex-wrap my-6'>

                    <header className='w-full text-gray-700 -mb-3 font-semibold font-serif border-t'></header>

                    {
                        violationForm?.map((elem, index) =>

                            <>
                                {inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, "", elem?.value, elem?.options, elem?.okey, elem?.ovalue)}
                                {/* {index == 0 && <><div>Data will be shown.</div></>} */}
                            </>
                        )
                    }

                    {formik.values?.violationMade != '' && <div className='flex flex-wrap gap-2 text-sm w-full'>

                        <span className='block w-full md:w-[10%]'>Violation Made :</span>
                        {
                            Array.isArray(violationList) && violationList?.map((elem) => <>
                                {formik.values.violationMade == elem?.id && <span className='block w-full md:w-[85%] font-semibold'>{elem?.violation_name}</span>}
                            </>)
                        }
                    </div>}

                </section>

                {/* 👉 Witness Details 👈 */}
                {/* <section className='flex gap-4 flex-wrap my-6'>

                    <header className='w-full text-gray-700 -mb-3 font-semibold font-serif'>Witness Details</header>

                    {
                        witnessForm?.slice(0, (formik.values?.isWitness == '0' ? 1 : 3))?.map((elem) => {
                            return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, "", '', elem?.options, elem?.ovalue, elem?.otitle)
                        })
                    }

                </section> */}

                {/* 👉 Evidence Documents 👈 */}
                {type != 'edit' &&
                    <section className='flex gap-4 flex-wrap my-6'>

                        <header className='w-full text-gray-700 -mb-3 font-semibold font-serif'>Evidence</header>

                        <div className={`flex flex-col `}>
                            <label htmlFor={'geoTaggedPhoto'} className={labelStyle}>Geo Tagged Photo <span className='text-red-500 text-xs font-bold'>*</span> : </label>
                            <input type='file' accept='.png, .jpg, .jpeg' {...formik.getFieldProps('geoTaggedPhoto')} className={fileStyle + `${(formik.touched.geoTaggedPhoto && formik.errors.geoTaggedPhoto) ? ' border-red-200 placeholder:text-red-400 text-red-400 file:border-red-200 file:text-red-400' : ' focus:border-zinc-300 border-zinc-200 file:border-zinc-300 file:text-gray-600'}`} />
                            {location != null && <>
                                <div className='grid grid-cols-12 items-center mt-1'><span className={`col-span-6 ${labelStyle}`}>Longitude :</span><span className={`col-span-6 font-semibold ${labelStyle}`}>{location?.longitude}</span></div>
                                <div className='grid grid-cols-12 items-center'><span className={`col-span-6 ${labelStyle}`}>Latitude :</span><span className={`col-span-6 font-semibold ${labelStyle}`}>{location?.latitude}</span></div>
                            </>}
                        </div>

                        {
                            docForm?.map((elem) => {
                                return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, elem?.accept)
                            })
                        }

                    </section>}

                {type != 'edit' &&
                    <footer>
                        <button type="submit" className={buttonStyle('green')}>Submit</button>
                    </footer>}

            </form >

            {/* 👉 Dialog form 👈 */}
            <dialog ref={dialogRef} className="relative overflow-clip animate__animated animate__zoomIn animate__faster">
                <div className=' z-50 px-6 py-4 flex flex-col gap-4 '>
                    <div className='flex items-center gap-6'>
                        <span className='text-green-500 p-2 block rounded-full drop-shadow-md shadow-green-300'><FiAlertCircle size={25} /></span>
                        <div className='flex flex-col gap-2'>
                            <span className='text-xl font-semibold border-b pb-1'>Confirmation</span>
                            <span className='text-base'>Are you sure want to approve ?</span>
                        </div>
                    </div>
                    <div className='flex justify-end gap-2'>
                        <button className='text-white bg-slate-400 hover:bg-slate-500 px-4 py-1 text-sm ' onClick={() => dialogRef.current.close()}>No</button>
                        <button className='text-white bg-green-500 hover:bg-green-600 px-4 py-1 text-sm ' onClick={() => editFun()}>Yes</button>
                    </div>
                </div>
            </dialog>

        </>
    )
}

export default InfractionForm