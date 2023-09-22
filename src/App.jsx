///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : App.js
// 👉 Status      : Open
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import 'animate.css'
import { useState, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { contextVar } from '@/Components/context/contextVar';
import { getLocalStorageItemJsonParsed } from '@/Components/Common/localstorage';

const Login                   = lazy(() => import('@/Components/Pages/Others/Login'));
const ProtectedRoutes         = lazy(() => import('@/Components/Pages/Others/ProtectedRoutes'));
const ErrorPage               = lazy(() => import('@/Components/Pages/Others/404/ErrorPage'));
const TransferPage            = lazy(() => import('@/Components/Pages/Others/TransferPage'));
const FPDashboard             = lazy(() => import('@/Components/Pages/FPComponents/FPDashboard/FPDashboard'));
const ChangePassword          = lazy(() => import('@/Components/Pages/Others/ChangePassword'));
const RegisteredMarriageList  = lazy(() => import('@/Components/Pages/FPComponents/MarriageWorkflow/RegisteredMarriageList'));
const MarriageDetails         = lazy(() => import('@/Components/Pages/FPComponents/MarriageWorkflow/MarriageDetails'));
const MarriagePayment         = lazy(() => import('@/Components/Pages/FPComponents/MarriagePayment'));
const MarriageReceipt         = lazy(() => import('@/Components/Pages/FPComponents/MarriagePrint/MarriageReceipt'));
const FPTrack                 = lazy(() => import('@/Components/Pages/FPComponents/FPTrack/FPTrack'));
const InfractionForm          = lazy(() => import('@/Components/Pages/FPComponents/FPForm/InfractionForm'));
const ViolationIndex          = lazy(() => import('@/Components/Pages/FPComponents/ViolationMaster/ViolationIndex'));
const FpApplicationList       = lazy(() => import('@/Components/Pages/FPComponents/FpList/FpApplicationList'));
const FpWorkflowEntry         = lazy(() => import('@/Components/Pages/FPComponents/FpWorkflowEntry'));

function App() {

  // 👉 State constants 👈
  const [menuList, setmenuList] = useState(getLocalStorageItemJsonParsed('menuList')); // to store menu list
  const [userDetails, setuserDetails] = useState(getLocalStorageItemJsonParsed('userDetails')); // to store user details
  const [titleText, settitleText] = useState('');
  const [refresh, setrefresh] = useState(0)
  const [titleBarVisibility, settitleBarVisibility] = useState(true);
  const [heartBeatCounter, setheartBeatCounter] = useState(1) // to check authentication
  const [toggleBar, settoggleBar] = useState(window.innerWidth <= 763 ? false : true) // toggle state for Side Bar

  // 👉 Manage sidebar to hide and show for responsiveness 👈
  window.addEventListener('resize', function () {
    window.innerWidth <= 763 && settoggleBar(false)
    window.innerWidth >= 1280 && settoggleBar(true)
  });

  // 👉 Context data (used globally) 👈
  const contextData = {
    notify: (toastData, toastType) => toast[toastType](toastData),
    menuList, setmenuList,
    userDetails, setuserDetails,
    titleText, settitleText,
    titleBarVisibility, settitleBarVisibility,
    heartBeatCounter, setheartBeatCounter,
    toggleBar, settoggleBar,
    refresh, setrefresh
  }

  // 👉 Routes Json 👈
  const allRoutes = [

    { path: '/home',                        element: <FPDashboard />             },
    { path: '/transfer',                    element: <TransferPage />            },
    { path: '/change-password',             element: <ChangePassword />          },
    { path: '/track-fp',                    element: <FPTrack />                 },
    { path: '/fp-form/:id?',                element: <InfractionForm />          },
    { path: '/violation-master',            element: <ViolationIndex />          },
    { path: '/fp-list',                     element: <FpApplicationList />       },
    { path: '/fp-workflow',                 element: <FpWorkflowEntry />         },
    
    { path: '/registered-marriage-list',    element: <RegisteredMarriageList />  },
    { path: '/marriage-details/:id',        element: <MarriageDetails />         },
    { path: '/marriage-pay/:id',            element: <MarriagePayment />         },
    { path: '/marriage-receipt/:tran',      element: <MarriageReceipt />         },

  ]

  return (
    <>

      <Toaster />

      <contextVar.Provider value={contextData}>

        <Routes>

          <Route index element={<Login />} />

          <Route element={<ProtectedRoutes />}>

            {
              allRoutes?.map((elem) =>
                <Route path={elem?.path} element={elem?.element} />
              )
            }

          </Route>

          <Route path='*' element={<ErrorPage />} />

        </Routes>

      </contextVar.Provider>

    </>
  )
}

export default App
