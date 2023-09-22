import React from 'react'

const TabPanel = (props) => {
  return (
    <div className='px-2 pr-4 pt-4'>{props?.active && props?.children}</div>
  )
}

export default TabPanel