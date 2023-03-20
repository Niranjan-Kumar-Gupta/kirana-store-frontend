import React from 'react'
import { useNavigate, useParams } from "react-router-dom";


const OrderDetails = () => {
  const { id } = useParams()
  return (
    <div className='w-11 pt-3 m-auto'>
      <div className='m-3'>OrderDetails for id: {id}</div>
    </div>
  )
}

export default OrderDetails