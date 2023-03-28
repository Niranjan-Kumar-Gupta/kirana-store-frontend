import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { API_GET_CUSTOMER_BY_ID } from '../../api/customer.services'
import { getOrderDetails } from '../../reducers/orderTableSlice'
import style from './style.module.css'
import { Badge } from 'primereact/badge'
import { Text } from '../../components/Text'

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orderDetails } = useSelector((state) => state.orderTable)

  const [customer, setCustomer] = useState()

  useEffect(() => {
    try {
      dispatch(getOrderDetails(id))
    } catch (error) {
      console.log(error)
    }
  }, [id])

  useEffect(() => {
    try {
      if (orderDetails.customerId) {
        API_GET_CUSTOMER_BY_ID(orderDetails.customerId).then((resp) => {
          setCustomer(resp)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }, [orderDetails.customerId])

  const goBack = () => {
    navigate('/orders')
  }

  return (
    <div className='w-11 pt-3 m-auto'>
      <div className='flex justify-content-between align-items-center mb-3'>
        <div className='flex align-items-center'>
          <button className={style.customButton} onClick={goBack}>
            <span
              className={`pi pi-arrow-circle-left mr-3 ${style.font}`}
            ></span>
          </button>
          <div className='m-3'>
            <Text type={'heading'}>Order #{id}</Text>
          </div>
          {orderDetails.paymentStatus && (
            <div>
              <Badge
                value={`Payment ${orderDetails.paymentStatus}`}
                severity={
                  orderDetails.paymentStatus === 'Done' ? 'success' : 'danger'
                }
              ></Badge>
            </div>
          )}
        </div>
        <div className='flex align-items-center'>
          <span className='mr-2'>Customer :</span>
          <Text type={'heading'}>{customer?.name}</Text>
        </div>
      </div>
      <div className='flex flex-wrap'>
        <div className='w-8'></div>
      </div>
    </div>
  )
}

export default OrderDetails
