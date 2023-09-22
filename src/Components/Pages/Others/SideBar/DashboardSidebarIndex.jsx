import React, { useContext } from 'react'
import SideBar from './SideBar'
import { contextVar } from '@/Components/context/contextVar'

const DashboardSidebarIndex = () => {

  const {menuList} = useContext(contextVar)

  const staticMenu = [
    {name: 'Home', path:'/home', children: []},
    {name: 'Apply Fine & Penalty', path:'/fp-form', children: []},
    {name: 'Application List', path:'/fp-list', children: []},
    {name: 'Track Fine & Penalty', path:'/track-fp', children: []},
    {name: 'Violation Master', path:'/violation-master', children: []},
    {name: 'Workflow', path:'/fp-workflow', children: []},
  ]

  return (
    <>
      <SideBar menu={staticMenu} />
    </>
  )
}

export default DashboardSidebarIndex