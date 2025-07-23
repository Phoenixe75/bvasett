import { ProgressSpinner } from 'primereact/progressspinner'
import React, { ReactNode } from 'react'

interface LoadingPage {
  isLoading?: boolean
  children?: ReactNode
}

export default function LoadingPage({isLoading=true,children}:LoadingPage) {
  if (!isLoading) {
    return children
  }
  return (
    <div style={{
      width:"100%",
      height: '70dvh'
    }} className='flex justify-content-center align-items-center'>
       <ProgressSpinner style={{ width: '50px', height: '50px' }} />
    </div>
  )
}
