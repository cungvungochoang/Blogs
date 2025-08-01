import React from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ScaleLoader } from 'react-spinners'
import { useSelector } from 'react-redux'

const override = {
    position: "absolute",
    textAlign: "center",
    zIndex: '9999',
    top: '3%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.8,
    borderRadius: '5px',
    color: 'white',
}

const Layout = () => {
    const loadingStatus = useSelector(state => state.globalLoading.status)
  return (
    <div>
        <ScaleLoader cssOverride={override} loading={loadingStatus}/>
        <Outlet />
        <ToastContainer autoClose={1500} closeOnClick={true} hideProgressBar={true}/>     
    </div>
  )
}

export default Layout
