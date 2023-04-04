import React, { useState, useEffect, useRef } from 'react'
import { CustomerForm } from '../../components/Forms/CustomerForm'
import { Toast } from 'primereact/toast'
import { Text } from '../../components/Text'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import style from './style.module.css'

const CreateCustomer = () => {
    const toast = useRef(null)
    const { mode, selectedCustomer } = useSelector((state) => state.customerTable)
    const navigate = useNavigate()
    const goBack = () => {
        navigate('/customers')
      }
    
    
  return (
    <div className='w-11 pt-3 m-auto'>
          <Toast ref={toast} />
          <div className='w-8 mt-0 m-auto'>
                <CustomerForm
                    onHide={()=>{}}
                    showCustomerForm={null}
                    toast={toast}
                />
          </div>
    </div>
  )
}

export default CreateCustomer