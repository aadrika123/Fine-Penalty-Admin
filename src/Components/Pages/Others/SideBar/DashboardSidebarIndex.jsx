import React, { useContext } from 'react'
import SideBar from './SideBar'
import { contextVar } from '@/Components/context/contextVar'
import { getLocalStorageItemJsonParsed } from '@/Components/Common/localstorage'

const DashboardSidebarIndex = () => {

  const { menuList } = useContext(contextVar)

  let menus = getLocalStorageItemJsonParsed('menuList')

  return (
    <>
      <SideBar menu={menus} />
    </>
  )
}

export default DashboardSidebarIndex