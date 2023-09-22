///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : InfractionForm
// 👉 Date        : 20-09-2023
// 👉 Status      : Open
// 👉 Description : Infraction recording form for fines & penalty.
// 👉 Functions   :  
//                  1. buttonStyle             -> To style button by passing color name.
//                  2. inputBox                -> Function to map input field.
//                  3. activateBottonErrorCard -> To activate error card with status and message.
//                  4. getViolationList        -> To fetch violation type list.
//                  5. getViolationById        -> To fetch violation section and penalty amount by id.
//                  6. getLocationFromImage    -> To fetch geo location from image.
//                  7. handleChange            -> To handle dependent list on change.
//                  8. feedFormData            -> To feed form when comes to edit.
//                  8. fetchData               -> To fetch form data by id.
//                  8. getDocListFun           -> To fetch document list by id.
//                  9. submitFun               -> To final submit data.
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
    const { api_submitInfractionForm, api_getViolationList, api_getInfractionById, api_getViolationById, api_updateInfractionForm, fpDocList } = ProjectApiList()

    // 👉 State constants 👈
    const [sloader, setSloader] = useState(false)
    const [loader, setLoader] = useState(false)
    const [violationList, setViolationList] = useState([])
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
    const [canEdit, setcanEdit] = useState(false)

    // 👉 CSS Constants 👈
    const labelStyle = 'text-gray-800 text-sm'
    const inputStyle = 'border focus:outline-none drop-shadow-sm focus:drop-shadow-md px-4 py-1 text-gray-700 shadow-black placeholder:text-sm'
    const fileStyle = 'block w-full border focus:outline-none drop-shadow-sm focus:drop-shadow-md p-1 text-sm text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-sm file:border file:text-xs file:font-semibold file:bg-zinc-100 hover:file:bg-zinc-200'

    // 👉 Basic Details Fields JSON👈
    const basicForm = [
        { title: "Name of Violator", key: "name", type: 'text', hint: "Enter your name" },
        { title: "Mobile No.", key: "mobileNo", type: 'text', hint: "Enter mobile no." },
        { title: "Email", key: "email", type: 'email', hint: "Enter email" },
        { title: "Holding No", key: "holdingNo", type: 'text', hint: "Enter holding no." },
    ]

    // 👉 Address Details Fields JSON👈
    const addressForm = [
        { title: "", key: "streetAddress1", type: 'text', width: 'md:w-[45%] w-full', hint: "Enter Street Address 1" },
        { title: "", key: "streetAddress2", type: 'text', width: 'md:w-[45%] w-full', hint: "Enter Street Address 2" },
        { title: "", key: "city", type: 'text', width: 'auto', hint: "Enter City" },
        { title: "", key: "region", type: 'text', width: 'auto', hint: "Enter Region" },
        { title: "", key: "pincode", type: 'text', width: 'auto', hint: "Enter Postal/Zip Code" },
    ]

    // 👉 Witness Details Fields JSON👈
    const witnessForm = [
        { title: "Witness", key: 'isWitness', type: 'select', width: 'md:w-[7%] w-full', hint: '', options: [{ title: 'Yes', value: '1' }, { title: "No", value: '0' }] },
        { title: "Name", key: 'witnessName', type: 'option', width: "", hint: "Enter witness name", check: "isWitness" },
        { title: "Mobile No.", key: 'witnessMobile', type: 'option', width: "", hint: "Enter witness mobile no.", check: "isWitness" },
    ]

    // 👉 Evidence Details Fields JSON👈
    const docForm = [
        { title: "Video/Audio", key: "videoAudio", type: 'file', hint: "Select video or audio", required: false, accept: '.mp4, .webm, .mkv, .mpeg, .mp3' },
        { title: "Pdf", key: "pdf", type: 'file', hint: "Select pdf", required: false, accept: '.pdf' },
    ]

    // 👉 Formik initial values 👈
    const initialValues = {
        name: '',
        mobileNo: '',
        email: '',
        holdingNo: '',

        streetAddress1: '',
        streetAddress2: '',
        city: '',
        region: '',
        pincode: '',

        violationMade: '',
        violationMadeUnderSection: '',

        isWitness: '0',
        witnessName: '',
        witnessMobile: '',

        geoTaggedPhoto: '',
        videoAudio: '',
        pdf: '',
    }

    // 👉 Formik validation schema 👈
    const schema = yup.object().shape(
        [...basicForm, ...addressForm, ...docForm, ...[
            { title: "Geo Tagged Photo", key: "geoTaggedPhoto", type: 'file', hint: "Select geo tagged photo", accept: '.png, .jpg, .jpeg', required: type == 'edit' ? false : true },
            { key: "violationMade", type: 'text', hint: 'Select violation made', required: true },
        ]]?.reduce((acc, elem) => {
            if ((elem?.type != 'select' && elem?.type != 'option') && elem.required) {
                acc[elem.key] = yup.string().required(elem.hint);
            }
            if (elem?.type == 'select' || elem?.type == 'option') {
                if (elem?.check) {
                    acc[elem.key] = yup.string().when(elem?.check, {
                        is: (value) => value == '1',
                        then: () => elem?.required ? yup.string().required(elem?.hint) : yup.string()
                    });
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
            type != 'edit' && submitFun(values)
            type == 'edit' && dialogRef.current.showModal()
        }
    })

    // 👉 Function 1 👈
    const buttonStyle = (color) => {
        return `px-4 py-1 text-sm bg-${color}-500 hover:bg-${color}-600 select-none rounded-sm hover:drop-shadow-md text-white cursor-pointer`
    }

    // 👉 Function 2 👈
    const inputBox = (key, title = '', type, width = '', hint = '', required = false, accept, options = []) => {
        return (
            <div className={`flex flex-col ${width} `}>
                {title != '' && <label htmlFor={key} className={labelStyle}>{title} {required && <span className='text-red-500 text-xs font-bold'>*</span>} : </label>}
                {type != 'select' && type != 'file' && <input disabled={!canEdit} {...formik.getFieldProps(key)} type={type} className={(canEdit ? inputStyle : 'font-semibold px-4 py-1') + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`} name={key} id="" placeholder={hint} />}
                {type == 'file' && <input disabled={!canEdit} {...formik.getFieldProps(key)} type={type} className={(canEdit ? fileStyle : 'font-semibold px-4 py-1 ') + `${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 text-red-400 file:border-red-200 file:text-red-400' : ' focus:border-zinc-300 border-zinc-200 file:border-zinc-300 file:text-gray-600'}`} name={key} id="" placeholder={hint} accept={accept} />}
                {type == 'select' && <select disabled={!canEdit} {...formik.getFieldProps(key)} className={(canEdit ? inputStyle : 'font-semibold px-4 py-1 appearance-none ') + ` ${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`}>
                    <option value={null}>Select</option>
                    {
                        options?.map((elem) => <option value={elem?.value}>{elem?.title}</option>)
                    }
                </select>}
                {/* {(formik.touched[key] && formik.errors[key]) && <span className='text-xs text-red-500'>{formik.errors[key]}</span>} */}
            </div>
        );
    }

    // 👉 Function 3 👈
    const activateBottomErrorCard = (state, message) => {
        setErrorState(state)
        setErrorMessage(message)
    }

    // 👉 Function 4 👈
    const getViolationList = () => {

        setLoader(true)

        AxiosInterceptors
            .post(api_getViolationList, {}, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setViolationList(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
                console.log('fp violation list response => ', res)
            })
            .catch((err) => {
                activateBottomErrorCard(true, 'Server Error! Please try again later.')
                console.log('error fp violation list => ', err)
            })
            .finally(() => {
                setLoader(false)
            })
    }

    // 👉 Function 5 👈
    const getViolationById = (vId) => {

        setSloader(true)

        AxiosInterceptors
            .post(api_getViolationById, { id: vId }, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setViolationData(res?.data?.data)
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
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

            case "violationMade": {
                getViolationById(value)
            }
        }
    }

    // 👉 Function 8 👈
    const feedFormData = (data) => {
        formik.setFieldValue('name', data?.full_name)
        formik.setFieldValue('mobileNo', data?.mobile)
        formik.setFieldValue('email', data?.email)
        formik.setFieldValue('holdingNo', data?.holding_no)
        formik.setFieldValue('streetAddress1', data?.street_address)
        formik.setFieldValue('streetAddress2', data?.street_address_2)
        formik.setFieldValue('city', data?.city)
        formik.setFieldValue('region', data?.region)
        formik.setFieldValue('pincode', data?.postal_code)
        formik.setFieldValue('violationMade', data?.violation_id)
        formik.setFieldValue('isWitness:', data?.witness)
        formik.setFieldValue('witnessName', data?.witness_name)
        formik.setFieldValue('witnessMobile', data?.witness_mobile)
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
                    getViolationById(res?.data?.data?.violation_id)
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

    const editFun = () => {

        console.log(violationData)
        let payload = {
            id:                 formDetails?.id,
            fullName:           formik.values?.name,
            mobile:             formik.values?.mobileNo,
            email:              formik.values?.email,
            holdingNo:          formik.values?.holdingNo,
            streetAddress:      formik.values?.streetAddress1,
            streetAddress2:     formik.values?.streetAddress2,
            city:               formik.values?.city,
            region:             formik.values?.region,
            postalCode:         formik.values?.pincode,
            violationId:        formik.values?.violationMade,
            // violationSectionId: violationData?.violation_section,
            penaltyAmount:      violationData?.penalty_amount,
            isWitness:          formik.values?.isWitness,
            witnessName:        formik.values?.witnessName,
            witnessMobile:      formik.values?.witnessMobile,
        }

        props?.approve(payload)
        dialogRef.current.close()
    }

    // 👉 Function 10 👈
    const submitFun = (values) => {

        console.log(":::::::Submitting values::::::", values)

        let url;

        let fd = new FormData()

        if (id) {

            url = api_updateInfractionForm;

            fd.append('id', formDetails?.id)

        } else {

            url = api_submitInfractionForm;

            fd.append('photo', geoTaggedImage);
            fd.append('longitude', location?.longitude);
            fd.append('latitude', location?.latitude);
            fd.append('audioVideo', videoAudioFile);
            fd.append('pdf', pdfDocument);

        }

        fd.append('fullName', values?.name);
        fd.append('mobile', values?.mobileNo);
        fd.append('email', values?.email);
        fd.append('holdingNo', values?.holdingNo);

        fd.append('streetAddress1', values?.streetAddress1);
        fd.append('streetAddress2', values?.streetAddress2);
        fd.append('city', values?.city);
        fd.append('region', values?.region);
        fd.append('postalCode', values?.pincode);

        fd.append('violationId', values?.violationMade);
        fd.append('violationSectionId', violationData?.violation_id);
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
        getViolationList()
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
            <ApplicationSubmitScreen heading={"Fine & Penalty Form"} appNo={submissionData?.application_no} openSubmit={isSubmit} refresh={() => navigate(`/home`)} />

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
            <form onChange={(e) => (formik.handleChange(e), handleChange(e))} onSubmit={formik.handleSubmit} className='w-full h-full p-4 my-6 border border-zinc-200 bg-zinc-50'>

                {
                    type == 'edit' &&
                    <header className='w-full flex justify-end gap-2 '>
                        <span className={buttonStyle('indigo')} onClick={() => setcanEdit(true)}>Edit</span>
                        <button type="submit" className={buttonStyle('green')} >Approve & Generate Challan</button>
                    </header>
                }

                {/* 👉 Basic Details 👈 */}
                <section className='flex gap-4 flex-wrap'>

                    {
                        basicForm?.map((elem) => {
                            return inputBox(elem?.key, elem?.title, elem?.type, '', elem?.hint, elem?.required)
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

                    <div className={`flex flex-col `}>
                        <label htmlFor={'violationMade'} className={labelStyle}>Violation Made (Name of the subject) <span className='text-red-500 text-xs font-bold'>*</span> : </label>
                        <select {...formik.getFieldProps('violationMade')} disabled={!canEdit} className={(canEdit ? inputStyle : 'font-semibold px-4 py-1 appearance-none ') + `${(formik.touched.violationMade && formik.errors.violationMade) ? ' border-red-200 placeholder:text-red-400 text-red-400' : ' focus:border-zinc-300 border-zinc-200'}`}>
                            {
                                loader ?
                                    <option>Loading...</option>
                                    :
                                    <>
                                        <option value="">Select</option>
                                        {
                                            violationList?.map((elem) =>
                                                <option value={elem?.id}>{elem?.violation_name}</option>
                                            )
                                        }
                                    </>
                            }
                        </select>
                    </div>

                    <div className={`flex flex-col `}>
                        <label htmlFor={'violationMadeUnderSection'} className={labelStyle}>Violation Made Under Section : </label>
                        <input disabled className={(canEdit ? inputStyle : 'font-semibold px-4 py-1 ') + ' focus:border-zinc-300 border-zinc-200'} value={sloader ? 'Loading...' : nullToNA(violationData?.violation_section)} />
                    </div>

                    <div className={`flex flex-col `}>
                        <label htmlFor={'penaltyAmount'} className={labelStyle}>Penalty Amount : </label>
                        <input disabled className={(canEdit ? inputStyle : 'font-semibold px-4 py-1 ') + ' focus:border-zinc-300 border-zinc-200'} value={sloader ? 'Loading...' : indianAmount(violationData?.penalty_amount)} />
                    </div>

                </section>

                {/* 👉 Witness Details 👈 */}
                <section className='flex gap-4 flex-wrap my-6'>

                    <header className='w-full text-gray-700 -mb-3 font-semibold font-serif'>Witness Details</header>

                    {
                        witnessForm?.slice(0, (formik.values?.isWitness == '0' ? 1 : 3))?.map((elem) => {
                            return inputBox(elem?.key, elem?.title, elem?.type, elem?.width, elem?.hint, elem?.required, "", elem?.options)
                        })
                    }

                </section>

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
                        <span className='text-red-500 bg-red-100 p-2 block rounded-full drop-shadow-md shadow-red-300'><FiAlertCircle size={25} /></span>
                        <div className='flex flex-col gap-2'>
                            <span className='text-xl font-semibold border-b pb-1'>Confirmation Box</span>
                            <span className='text-base'>Are you sure want to approve ?</span>
                        </div>
                    </div>
                    <div className='flex justify-end gap-2'>
                        <button className='text-white bg-slate-400 hover:bg-slate-500 px-4 py-1 text-sm ' onClick={() => dialogRef.current.close()}>No</button>
                        <button className='text-white bg-red-500 hover:bg-red-600 px-4 py-1 text-sm ' onClick={() => editFun()}>Yes</button>
                    </div>
                </div>
            </dialog>

        </>
    )
}

export default InfractionForm