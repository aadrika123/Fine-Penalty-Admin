import ApiHeader from '@/Components/api/ApiHeader';
import ProjectApiList from '@/Components/api/ProjectApiList';
import { useState, useEffect } from 'react'
import Modal from 'react-modal';
import BarLoader from '@/Components/Common/Loaders/BarLoader';
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: 'none'
    },
};

function NotificationComponent(props) {
    const [modalIsOpen, setIsOpen] = useState(true);
    const [isLoading, setisLoading] = useState(false)
    const [notificationData, setnotificationData] = useState(null)

    const { api_getNotification } = ProjectApiList()

    const closeModal = () => {

    }

    const removeNotification = () => {

    }

    const Notifications = [
        { id: 1, timeStamp: '8:30 Pm 20-10-2022', notification: 'Set yourself free.' },
        { id: 2, timeStamp: '8:30 Pm 20-10-2022', notification: 'Set yourself free from everything.' },
        { id: 3, timeStamp: '8:30 Pm 20-10-2022', notification: 'Set yourself free.' },
        { id: 4, timeStamp: '8:30 Pm 20-10-2022', notification: 'Set yourself free.' },
    ]


    // FETCHING TRANSACTION NO TO PASS TO RECEIPT
    const fetchNotification = () => {
        setisLoading(true)

        AxiosInterceptors.post(api_getNotification, {}, ApiHeader())
            .then(function (response) {
                setnotificationData(response?.data?.data)
                console.log('notification list...', response?.data)
                setisLoading(false)
            })
            .catch(function (error) {
                console.log('notification get error...', error)
                setisLoading(false)
            })
    }

    useEffect(() => {
        fetchNotification()
    }, [])


    return (
        <>
            {
                isLoading && <BarLoader />
            }
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div class="relative bg-white p-10 rounded-lg shadow-xl border-2 border-gray-50">
                    <button onClick={() => props?.setnotificationState(false)} type="button" class="absolute top-3 right-2.5 bg-gray-300 text-white hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm p-1.5 ml-auto inline-flex items-center" >
                        <svg class="w-5 h-5" fill="currentColor" ><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>

                    <div className="max-w-2xl mx-auto">
                        <span className='font-semibold relative text-lg'>Notification <span className="flex justify-center absolute -top-1 -right-3 text-center bg-pink-500 px-1 text-white rounded-full text-xs"><span className="align-self-center">{notificationData?.length}</span></span></span>
                        {/* SPACER */}
                        <div className='w-full h-3'></div>

                        {Array.isArray(notificationData) &&
                            notificationData?.map((data) => (
                                <div className="flex items-center w-full px-4 py-3 text-gray-500 bg-indigo-200 rounded-lg shadow-xl mt-2">
                                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-indigo-500 bg-indigo-100 rounded-lg ">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3 ">
                                        <div className='text-md font-normal text-indigo-800'>{data?.notification}</div>
                                        <div className='text-xs font-normal text-indigo-400'>{data?.time} {data?.date}</div>
                                    </div>
                                    <button type="button" onClick={() => removeNotification(data?.id)} className="ml-auto -mx-1.5 -my-1.5 bg-indigo-200 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 darks:text-gray-500 " data-collapse-toggle="toast-default" aria-label="Close">
                                        <span className="sr-only">Close</span>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            ))
                        }
                        {!Array.isArray(notificationData) &&
                           <div>No notification yet !</div>
                        }


                    </div>
                </div>

            </Modal>
        </>
    )
}

export default NotificationComponent