import React from 'react'

const TabPanel = (props) => {
  return (
    <div className='pl-6 pt-4'>{props?.active && props?.children}</div>
  )
}

export default TabPanel