import React from 'react'
import { useNavigate, useParams } from "react-router-dom";


const ProductDetails = () => {
  const { id } = useParams()
  return (
    <div className='w-11 pt-3 m-auto'>
      <div className='m-3'>ProductDetails for id: {id}</div>
    </div>
  )
}

export default ProductDetails