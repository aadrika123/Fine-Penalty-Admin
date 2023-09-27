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
import MarriagePayment from './Components/Pages/FPComponents/FpPayment';
import FpPayment from './Components/Pages/FPComponents/FpPayment';
import FpReceipt from './Components/Pages/FPComponents/FpPrint/FpReceipt';

const Login                   = lazy(() => import('@/Components/Pages/Others/Login'));
const ProtectedRoutes         = lazy(() => import('@/Components/Pages/Others/ProtectedRoutes'));
const ErrorPage               = lazy(() => import('@/Components/Pages/Others/404/ErrorPage'));
const TransferPage            = lazy(() => import('@/Components/Pages/Others/TransferPage'));
const FPDashboard             = lazy(() => import('@/Components/Pages/FPComponents/FPDashboard/FPDashboard'));
const ChangePassword          = lazy(() => import('@/Components/Pages/Others/ChangePassword'));
const FPTrack                 = lazy(() => import('@/Components/Pages/FPComponents/FPTrack/FPTrack'));
const InfractionForm          = lazy(() => import('@/Components/Pages/FPComponents/FPForm/InfractionForm'));
const ViolationIndex          = lazy(() => import('@/Components/Pages/FPComponents/ViolationMaster/ViolationIndex'));
const FpApplicationList       = lazy(() => import('@/Components/Pages/FPComponents/FpList/FpApplicationList'));
const FpWorkflowEntry         = lazy(() => import('@/Components/Pages/FPComponents/FpWorkflowEntry'));
const FpChallan2              = lazy(() => import('@/Components/Pages/FPComponents/FpPrint/FpChallan2'));
const FpDetails               = lazy(() => import('@/Components/Pages/FPComponents/FpDetails'));
const FpApplyReport           = lazy(() => import('@/Components/Pages/FPComponents/Reports/FpApplyReport'));
const ChallanGeneratingReport = lazy(() => import('@/Components/Pages/FPComponents/Reports/ChallanGeneratingReport'));
const ViolationWiseReport     = lazy(() => import('@/Components/Pages/FPComponents/Reports/ViolationWiseReport'));
const CollectionReport        = lazy(() => import('@/Components/Pages/FPComponents/Reports/CollectionReport'));

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
    { path: '/search-challan',              element: <FPTrack />                 },
    { path: '/fp-form/:id?',                element: <InfractionForm />          },
    { path: '/fp-details/:id',              element: <FpDetails />               },
    { path: '/violation-master',            element: <ViolationIndex />          },
    { path: '/fp-list',                     element: <FpApplicationList />       },
    { path: '/fp-workflow',                 element: <FpWorkflowEntry />         },
    { path: '/challan/:id',                 element: <FpChallan2 />              },
    { path: '/fp-pay/:id',                  element: <FpPayment />               },
    { path: '/fp-receipt/:tranNo',          element: <FpReceipt />               },
    { path: '/fp-apply-report',             element: <FpApplyReport />           },
    { path: '/challan-generated-report',   element: <ChallanGeneratingReport /> },
    { path: '/violation-wise-report',       element: <ViolationWiseReport />     },
    { path: '/collection-report',           element: <CollectionReport />        },

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
