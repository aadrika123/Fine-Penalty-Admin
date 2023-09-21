///////////////////////////////////////////////////////////////////////////////////////////////////////////
// 👉 Author      : R U Bharti
// 👉 Component   : TransferPage
// 👉 Status      : Close
// 👉 Description : This component is to  
//                  handle token and other details when redirecting from other project.
// 👉 Functions   :  
//                  1. fetchMenuList -> To Fetch Menu List
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// 👉 Importing Packages 👈
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import ApiHeader from '@/Components/api/ApiHeader'
import BarLoader from '@/Components/Common/Loaders/BarLoader'
import ProjectApiList from '@/Components/api/ProjectApiList';
import { contextVar } from '@/Components/context//contextVar'
import { setLocalStorageItemStrigified } from '@/Components/Common/localstorage'
import AxiosInterceptors from '@/Components/Common/AxiosInterceptors'

function TransferPage() {

  // 👉 API constant 👈
  const { api_getFreeMenuList } = ProjectApiList()

  // 👉 Context constants 👈
  const { setmenuList, setuserDetails } = useContext(contextVar)

  // 👉 Navigation constant 👈
  const navigate = useNavigate()

  const [isLoading, setisLoading] = useState(false)

  // 👉 Render to check token is available or not and calling fetchMenuList() function 👈
  useEffect(() => {

    let token = window.localStorage.getItem('token')
    setisLoading(true)

    if (token == null) {
      navigate('/')
      return
    }

    fetchMenuList()

  }, [])

  // 👉 Fetching menu list 👈
  const fetchMenuList = () => {

    let requestBody = {
      moduleId: 10
    }

    AxiosInterceptors.post(api_getFreeMenuList, requestBody, ApiHeader())
      .then(function (response) {
        console.log('fetched menu list.....', response)
        if (response.data.status == true) {

          setLocalStorageItemStrigified('menuList', response?.data?.data?.permission)
          setLocalStorageItemStrigified('userDetails', response?.data?.data?.userDetails)

          setmenuList(response?.data?.data?.permission)
          setuserDetails(response?.data?.data?.userDetails)

          navigate('/home')

        } else {
          console.log('false...')
        }
      })
      .catch(function (error) {
        console.log('--2--login error...', error)
      })
      .finally(() => setisLoading(false))

  }

  // 👉 Loader 👈
  if (isLoading) {
    return (
      <BarLoader />
    )
  }
}

export default TransferPage