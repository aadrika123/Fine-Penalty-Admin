import React, { useContext } from 'react'
import SideBar from './SideBar'
import { contextVar } from '@/Components/context/contextVar'

const DashboardSidebarIndex = () => {

  const {menuList} = useContext(contextVar)

  return (
    <>
      <SideBar menu={menuList} />
    </>
  )
}

export default DashboardSidebarIndex