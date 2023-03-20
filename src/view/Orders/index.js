import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Text } from '../../components/Text'
import { OrderForm } from '../../components/Forms/OrderForm'
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
const Orders = () => {

  const navigate = useNavigate()
  const ids = [1, 2, 3, 4, 5, 6, 7, 8];

  const loading = false;
  const [showOrderForm, setShowOrderForm] = useState(false)

  const onAddNewClick = () => {
    setShowOrderForm(true)
  }

  const onHide = () => {
    setShowOrderForm(false)
  }

  const loader = () => {
    return <Loader visible={loading} />
  }

  const toast = useRef(null)

  const orderModal = () => {
    return (
      <OrderForm
        onHide = {onHide}
        showOrderForm={showOrderForm}
        toast={toast}
      />
    )
  }

  
  return (
    <div className="w-11 pt-3 m-auto">
      <Toast ref={toast} />
      {showOrderForm ? orderModal() : <></>}
      {loader ? loader() : <></>}
      <div className='flex justify-content-between align-items-center'>
        <Text type='heading'>Orders</Text>
        <CustomButton
          varient='filled'
          label={'Create Order'}
          icon={'pi pi-plus'}
          onClick={onAddNewClick}
        />
      </div>
      <div className='flex flex-wrap gap-2 mt-2'>
        {ids.map((id) => (
          <div
            onClick={() => navigate(`orderDetails/${id}`)}
            className={'products flex justify-content-center align-items-center'}
            key={id}
          >
            <Text type={'heading'}>Order {id}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
