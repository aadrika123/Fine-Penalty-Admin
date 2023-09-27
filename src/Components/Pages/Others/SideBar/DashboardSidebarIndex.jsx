import React, { useContext } from 'react'
import SideBar from './SideBar'
import { contextVar } from '@/Components/context/contextVar'

const DashboardSidebarIndex = () => {

  const { menuList } = useContext(contextVar)

  const staticMenu = [
    { name: 'Home',                 path: '/home',              children: [] },
    { name: 'Apply Fine & Penalty', path: '/fp-form',           children: [] },
    { name: 'Application List',     path: '/fp-list',           children: [] },
    { name: 'Search Challan',       path: '/search-challan',    children: [] },
    { name: 'Violation Master',     path: '/violation-master',  children: [] },
    { name: 'Workflow',             path: '/fp-workflow',       children: [] },
    {
      name: 'Reports',              path: '',                   children: [
        // { name: 'Fines & Penalties Apply',   path: '/fp-apply-report'           },
        { name: 'Challan Generated Report', path: '/challan-generated-report' },
        { name: 'Violation Wise Report',     path: '/violation-wise-report'     },
        { name: 'Collection Report',         path: '/collection-report'         }
      ]
    },
  ]

  return (
    <>
      <SideBar menu={staticMenu} />
    </>
  )
}

export default DashboardSidebarIndex