import React from 'react'
import { Outlet } from 'react-router-dom'
import Branding from '../FPComponents/Citizen/CitizenHome/Branding'

const CitizenRoutes = () => {
  return (
    <>
      <Branding />
      <Outlet />
    </>
  )
}

export default CitizenRoutes