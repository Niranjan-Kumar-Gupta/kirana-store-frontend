import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { API_GET_CUSTOMER_BY_ID } from '../../api/customer.services'
import { getOrderDetails } from '../../reducers/orderTableSlice'
import style from './style.module.css'
import { Badge } from 'primereact/badge'
import { Text } from '../../components/Text'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ReactComponent as ImagePlaceholder } from "../../svg/ImgPlaceholder.svg";


const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orderDetails } = useSelector((state) => state.orderTable)

  const [customer, setCustomer] = useState()

  const expectedOrderDetails = {
    id: 6,
    name: 'First Order Ever',
    status: 'New',
    paymentStatus: 'Done',
    isActive: true,
    companyId: 6,
    customerId: 2,
    outletId: 2,
    completedAt: '2023-04-25T10:27:49.000Z',
    cancelReason: null,
    cancelledAt: null,
    updatedBy: 2,
    addressId: 1,
    totalAmount: 50000,
    createdAt: '2023-03-27T08:57:34.000Z',
    updatedAt: '2023-03-27T08:57:34.000Z',
    productsOrdered: [
      {
        id: 11,
        productName: 'Name of the product',
        productVariant: 'Variant',
        productSrc: 'https://test-skalework-product-catalog.s3.ap-south-1.amazonaws.com/6/products/abc',
        productId: 1,
        categoryId: 10,
        productVariantId: 113,
        isActive: true,
        companyId: 6,
        orderId: 6,
        status: 'New',
        orderedQuantity: 500,
        deliveredQuantity: 0,
        price: 1400,
        outletId: 2,
        createdAt: '2023-03-27T08:57:34.000Z',
        updatedAt: '2023-03-27T08:57:34.000Z',
      },
      {
        id: 12,
        productName: 'Name of the product',
        productVariant: 'Variant',
        productSrc: 'https://test-skalework-product-catalog.s3.ap-south-1.amazonaws.com/6/products/abc',
        productId: 1,
        categoryId: 10,
        productVariantId: 114,
        isActive: true,
        companyId: 6,
        orderId: 6,
        status: 'New',
        orderedQuantity: 1500,
        deliveredQuantity: 0,
        price: 1400,
        outletId: 2,
        createdAt: '2023-03-27T08:57:34.000Z',
        updatedAt: '2023-03-27T08:57:34.000Z',
      },
    ],
  }

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
  }, [orderDetails.customerId, id])

  const goBack = () => {
    navigate('/orders')
  }

  const productNameBody = (rowData) => {
    return (
      <div className='flex flex-column'>
        <div className='mb-1'>
          <Text type={'heading'}>{rowData.productName}</Text>
        </div>
        <Text type={'sub-heading'}>{rowData.productVariant}</Text>
      </div>
    )
  }

  const productImgBody = (rowData) => {
    return (
      <div
        style={{ width: "120px", height: "80px" }}
      >
        <ImagePlaceholder />
        {/* <img
          src={`${rowData.productSrc}?v=${rowData.updatedAt}`}
          onError={(e) => (e.target.src = "./images/ImgPlaceholder.svg")}
          style={{ maxWidth: "100%", height: "100%" }}
        /> */}
      </div>
    )
  }

  const totalBody = (r, colData) => {
    console.log(colData)
    return <div></div>
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
        <DataTable
          value={expectedOrderDetails.productsOrdered}
          className='w-12'
        >
          <Column header='Image' body={productImgBody}></Column>
          <Column header='Product' body={productNameBody}></Column>
          <Column field='price' header='Price'></Column>
          <Column field='orderedQuantity' header='Quantity'></Column>
        </DataTable>
      </div>
    </div>
  )
}

export default OrderDetails
