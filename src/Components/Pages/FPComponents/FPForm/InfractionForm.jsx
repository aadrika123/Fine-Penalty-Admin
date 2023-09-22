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

const InfractionForm = () => {

    // 👉 To set title 👈
    useSetTitle("Fine & Penalty Form")

    // 👉 URL constants 👈
    const { id } = useParams()

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
    const [docList, setDocList] = useState(null)

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
        [...basicForm, ...addressForm, ...witnessForm, ...docForm, ...[
            { title: "Geo Tagged Photo", key: "geoTaggedPhoto", type: 'file', hint: "Select geo tagged photo", accept: '.png, .jpg, .jpeg', required: id ? false : true },
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
            submitFun(values)
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
                {type != 'select' && type != 'file' && <input {...formik.getFieldProps(key)} type={type} className={inputStyle + `${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`} name={key} id="" placeholder={hint} />}
                {type == 'file' && <input {...formik.getFieldProps(key)} type={type} className={fileStyle + `${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 text-red-400 file:border-red-200 file:text-red-400' : ' focus:border-zinc-300 border-zinc-200 file:border-zinc-300 file:text-gray-600'}`} name={key} id="" placeholder={hint} accept={accept} />}
                {type == 'select' && <select {...formik.getFieldProps(key)} className={inputStyle + `${(formik.touched[key] && formik.errors[key]) ? ' border-red-200 placeholder:text-red-400 ' : ' focus:border-zinc-300 border-zinc-200'}`}>
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
                    feedFormData(res?.data?.data?.basic_details)
                    setFormDetails(res?.data?.data)
                    getViolationById(res?.data?.data?.basic_details?.violation_id)
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
    const getDocListFun = () => {

        setLoader(true)

        AxiosInterceptors
            .post(fpDocList, { id: id }, ApiHeader())
            .then((res) => {
                if (res?.data?.status) {
                    setDocList(res?.data?.data?.uploadDocs)
                } else {
                    activateBottomErrorCard(true, checkErrorMessage(res?.data?.message))
                }
                console.log('fp document response => ', res)
            })
            .catch((err) => {
                activateBottomErrorCard(true, 'Server Error! Please try again later.')
                console.log('error fp document list => ', err)
            })
            .finally(() => {
                setLoader(false)
            })
    }

    // 👉 Function 11 👈
    const submitFun = (values) => {

        console.log(":::::::Submitting values::::::", values)

        let url;

        let fd = new FormData()

        if (id) {

            url = api_updateInfractionForm;

            fd.append('id', formDetails?.basic_details?.id)

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

    const checkType = (path) => {
        const splitPath = path?.split('.')[path?.split('.')?.length - 1]
        const type = splitPath?.split('/')[0]
        return type;
    }

    // 👉 To call function 4, function 9 and function 10 👈
    useEffect(() => {
        getViolationList()
        id && fetchData()
        id && getDocListFun()
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
            <header className='flex gap-2 bg-zinc-50 p-4 drop-shadow-sm justify-center items-center'>

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

            </header>

            {/* 👉 Main 👈 */}
            <form onChange={(e) => (formik.handleChange(e), handleChange(e))} onSubmit={formik.handleSubmit} className='w-full h-full p-4 my-6 border border-zinc-200 bg-zinc-50'>

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
                        <select {...formik.getFieldProps('violationMade')} className={inputStyle + `${(formik.touched.violationMade && formik.errors.violationMade) ? ' border-red-200 placeholder:text-red-400 text-red-400' : ' focus:border-zinc-300 border-zinc-200'}`}>
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
                        <input disabled className={inputStyle + ' focus:border-zinc-300 border-zinc-200'} value={sloader ? 'Loading...' : nullToNA(violationData?.violation_section)} />
                    </div>

                    <div className={`flex flex-col `}>
                        <label htmlFor={'penaltyAmount'} className={labelStyle}>Penalty Amount : </label>
                        <input disabled className={inputStyle + ' focus:border-zinc-300 border-zinc-200'} value={sloader ? 'Loading...' : indianAmount(violationData?.penalty_amount)} />
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
                {id ?
                    <section className='flex gap-4 flex-wrap my-6'>

                        <header className='w-full text-gray-700 -mb-3 font-semibold font-serif'>Evidence</header>

                        {
                            Array.isArray(docList) && docList?.map((elem) =>
                                <>
                                    <div className={`flex flex-col `}>
                                        <label className={labelStyle}>{elem?.doc_name} : <span className={buttonStyle('indigo') + ' text-sm'}>View</span></label>
                                        {
                                            checkType(elem?.document_path) == 'pdf' && <></>
                                        }
                                        {
                                            ['jpg', 'jpeg', 'png'].includes(checkType(elem?.document_path)) && <></>
                                        }
                                        {
                                            checkType(elem?.document_path) == 'pdf' && <></>
                                        }
                                        {elem?.location && <>
                                            <div className='grid grid-cols-12 items-center mt-1'><span className={`col-span-6 ${labelStyle}`}>Longitude :</span><span className={`col-span-6 font-semibold ${labelStyle}`}>{location?.longitude}</span></div>
                                            <div className='grid grid-cols-12 items-center'><span className={`col-span-6 ${labelStyle}`}>Latitude :</span><span className={`col-span-6 font-semibold ${labelStyle}`}>{location?.latitude}</span></div>
                                        </>}
                                    </div>
                                </>
                            )
                        }

                    </section>
                    :
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

                <footer>
                    <button type="submit" className={buttonStyle('green')}>{id ? 'Update' : 'Submit'}</button>
                </footer>

            </form >

        </>
    )
}

export default InfractionForm