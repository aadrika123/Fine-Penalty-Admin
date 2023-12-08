import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Branding from '../FPComponents/Citizen/CitizenHome/Branding'
import BrandingRmc from './BrandingRmc'

const CitizenRoutes = () => {

  const location = useLocation()

  return (
    <>
    {location?.pathname != '/' && <BrandingRmc />}
      <Outlet />
    </>
  )
}

export default CitizenRoutes