import React from 'react'

const Box = (props) => {
  return (
    <div className='px-4'>{props?.children}</div>
  )
}

export default Box