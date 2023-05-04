import React, { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { InputText } from 'primereact/inputtext'
import { CustomButton } from '../../components/CustomButton'
import { classNames } from 'primereact/utils'
import style from './style.module.css'
import { TreeSelect } from 'primereact/treeselect'
import { API_GET_ORDERS } from '../../api/order.services'
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import { Button } from 'primereact/button'
import { DeleteAlert } from '../../components/Alert/DeleteAlert'
import { Toast } from 'primereact/toast'
import { Tag } from 'primereact/tag'

import {
  getStockHistoryById,
  updateStockHistoryById,
  updateStocksHistory,
} from '../../reducers/stocksHistoryTableSlice'
import Loader from '../../components/Loader'
import { Dropdown } from 'primereact/dropdown'

const StockHistoryEdit = () => {
  const {
    stockHistoryData,
    selectedStockHistory,
    page,
    limit,
    loading,
    totalStockHistoryCount,
  } = useSelector((state) => state.stocksHistoryTable)
  const [edit, setEdit] = useState(false)
  const [orderId, setOrderId] = useState([])
  const [reasons, setReasons] = useState([])
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false)
  const [showOrderDropdown, setShowOrderDropDown] = useState(false)

  const checkOutReason = [
    {
      key: 'orderDelivery',
      label: 'Order Delivery',
      data: 'Order Delivery',
    },
    {
      key: 'damaged',
      label: 'Damaged',
      data: 'Damaged ',
    },
    {
      key: 'correction',
      label: 'Correction',
      data: 'Correction ',
    },
  ]
  const checkInReason = [
    {
      key: 'production',
      label: 'Production',
      data: 'Production ',
    },
    {
      key: 'correction',
      label: 'Correction',
      data: 'Correction ',
    },
  ]

  const { id } = useParams()

  const toast = useRef(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const goBack = () => {
    navigate('/stocks')
  }

  const deleteModule = () => {
    return (
      <DeleteAlert
        item='stockHistory'
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    )
  }

  const getOrderData = async () => {
    const order = await API_GET_ORDERS(0, 100000)
    let orderIds = []
    order.rows.forEach((ele) => {
      let data = {
        key: ele.id,
        label: `OrderId ${ele.id} `,
        data: `OrderId ${ele.id} `,
      }
      orderIds.push(data)
    })
    setOrderId(orderIds)
  }

  useEffect(() => {
    if (id) {
      try {
        dispatch(getStockHistoryById(id))
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  // useEffect(() => {
  //   let _reason = [...reasons]
  //   _reason[0].children = orderId
  //   setReasons(_reason)
  // }, [orderId])

  const defaultValues = {
    SKUCode: '',
    product: '',
    quantity: '',
    order: '',
    stockType: '',
    reason: '',
    comment: '',
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ defaultValues })

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className='p-error'>{errors[name].message}</small>
    )
  }

  const loader = () => {
    return <Loader visible={loading} />
  }

  const onSubmit = (data) => {
    if (selectedStockHistory.flag === 'CHECK OUT') {
      data.quantity = -data.quantity
      if (data.reason === 'orderDelivery') data.reason = `order ${data.order}`
    }
    delete data.order

    dispatch(updateStockHistoryById({ id, data }))
      .unwrap()
      .then((res) => {
        goBack()
      })
      .catch((err) => {
        toast.current.show({ severity: 'error', detail: err.message })
      })
  }

  useEffect(() => {
    if (id && selectedStockHistory) {
      setValue('SKUCode', selectedStockHistory.productvariants?.SKUCode)
      setValue(
        'reason',
        selectedStockHistory.reason?.length > 0 && selectedStockHistory.reason.split(' ')[0] === 'order'
          ? 'orderDelivery'
          : selectedStockHistory.reason
      )
      setValue('comment', selectedStockHistory.comment || '')
      setValue('product', selectedStockHistory.productvariants?.productName)
      setValue('quantity', Math.abs(selectedStockHistory.quantity))
      setValue('stockType', selectedStockHistory.flag)

      if (selectedStockHistory && selectedStockHistory.flag === 'CHECK OUT') {
        if (selectedStockHistory.reason?.length > 0 && selectedStockHistory.reason.split(' ')[0] === 'order') {
          setShowOrderDropDown(true)
          setValue('order', parseInt(selectedStockHistory.reason.split(' ')[1]))
        }
        getOrderData()
        setReasons(checkOutReason)
      } else {
        setReasons(checkInReason)
      }
    }
  }, [selectedStockHistory])

  const itemslist = [
    { label: 'Stock History', url: '/stocks' },
    {
      label:
        id && selectedStockHistory
          ? selectedStockHistory.productvariants?.productName
          : '',
    },
  ]

  return (
    <div className='w-11 m-auto mb-6'>
      <Toast ref={toast} />
      {loader()}
      {displayAlertDelete && deleteModule()}
      <div
        className={`block md:flex md:justify-content-center pt-3 ${style.stickySubNav}`}
      >
        <div className='flex lg:w-10 md:w-8 sm:justify-content-between align-items-center pb-3'>
          <div className='flex align-items-center'>
            <CustomBreadcrumb itemslist={itemslist} />
            {id && selectedStockHistory ? (
              <div className='hidden sm:block'>
                <Tag
                  value={`${selectedStockHistory.flag}`}
                  severity={
                    selectedStockHistory.flag === 'CHECK IN'
                      ? 'success'
                      : 'warning'
                  }
                />
              </div>
            ) : (
              ''
            )}
          </div>
          <div className='w-12 sm:w-5 lg:w-4 hidden sm:block'>
            <div className='flex justify-content-end gap-2'>
              <CustomButton
                varient='cancel'
                onClick={
                  edit
                    ? () => setEdit(false)
                    : () => setDisplayAlertDelete(true)
                }
                label={edit ? 'Cancel' : 'Delete'}
              />
              <CustomButton
                varient='filled w-6rem pl-3'
                type='submit'
                onClick={edit ? handleSubmit(onSubmit) : () => setEdit(true)}
                label={edit ? 'Update' : 'Edit'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={`card m-auto w-full`}>
        <form onSubmit={handleSubmit(onSubmit)} className='p-fluid'>
          <div className='lg:flex lg:flex-row lg:align-items-start lg:justify-content-center lg:gap-3 md:flex md:flex-column md:align-items-center'>
            <div className='lg:w-7 md:w-8 sm:w-full'>
              <div className='field  bg-white p-3 border-round border-50 mb-3'>
                <label htmlFor='SKUCode'>SKU Code</label>
                <Controller
                  name='SKUCode'
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.SKUCode}
                      disabled={true}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      {...field}
                    />
                  )}
                />
                {getFormErrorMessage('SKUCode')}
              </div>

              <div className='field  bg-white p-3 border-round border-50 mb-3'>
                <label htmlFor='product'>Product </label>
                <Controller
                  name='product'
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.product}
                      disabled={true}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      {...field}
                    />
                  )}
                />
                {getFormErrorMessage('product')}
              </div>

              <div className='field  bg-white p-3 border-round border-50 mb-3'>
                <label htmlFor='stockType'>Stock Type</label>
                <Controller
                  name='stockType'
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.stockType}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      disabled={true}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      {...field}
                    />
                  )}
                />
                {getFormErrorMessage('stockType')}
              </div>
            </div>
            <div className='lg:w-3 md:w-8 sm:w-full'>
              <div className='field  bg-white p-2 border-round border-50 mb-3'>
                <label htmlFor='quantity'>Quantity</label>
                <Controller
                  name='quantity'
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.quantity}
                      value={field.value}
                      disabled={!edit}
                      onChange={(e) => field.onChange(e.value)}
                      placeholder='Enter your email here'
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      {...field}
                    />
                  )}
                />
                {getFormErrorMessage('quantity')}
              </div>

              <div className='bg-white p-2 border-round border-50 mb-3'>
                <div className='field'>
                  <label htmlFor='reason'>Reason</label>
                  <Controller
                    name='reason'
                    control={control}
                    rules={{ required: 'Reason is required.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <div className='card w-full flex justify-content-center'>
                          <Dropdown
                            filter
                            disabled={!edit}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.value)
                              if (e.value === 'orderDelivery')
                                setShowOrderDropDown(true)
                              else setShowOrderDropDown(false)
                            }}
                            options={reasons}
                            optionValue='key'
                            optionLabel='label'
                            className=' w-full'
                            placeholder='Select Reason'
                          ></Dropdown>
                        </div>
                      </>
                    )}
                  />
                  {getFormErrorMessage('reason')}
                </div>
                {showOrderDropdown && (
                  <div className='field w-full mb-3'>
                    <label htmlFor='Reason'>Order *</label>
                    <Controller
                      name='order'
                      control={control}
                      rules={{ required: 'Order is required.' }}
                      render={({ field, fieldState }) => (
                        <>
                          <div className='card w-full flex justify-content-center'>
                            <Dropdown
                              value={field.value}
                              disabled={!edit}
                              onChange={(e) => field.onChange(e.value)}
                              options={orderId}
                              optionValue='key'
                              optionLabel='label'
                              className='w-full'
                              placeholder='Select Order'
                            ></Dropdown>
                          </div>
                          {getFormErrorMessage(field.name)}
                        </>
                      )}
                    />
                  </div>
                )}
              </div>

              <div className='field bg-white p-2 border-round border-50 mb-3'>
                <label htmlFor='comment'>Comment</label>
                <Controller
                  name='comment'
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.comment}
                      value={field.value}
                      disabled={!edit}
                      onChange={(e) => field.onChange(e.value)}
                      placeholder='Enter comment'
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      {...field}
                    />
                  )}
                />
                {getFormErrorMessage('comment')}
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className='sm:w-12 md:w-5 lg:w-4 sm:hidden'>
        <div className='flex justify-content-center gap-2'>
          <CustomButton
            varient='cancel'
            onClick={
              edit ? () => setEdit(false) : () => setDisplayAlertDelete(true)
            }
            label={edit ? 'Cancel' : 'Delete'}
          />
          <CustomButton
            varient='filled w-6rem pl-3'
            type='submit'
            onClick={edit ? handleSubmit(onSubmit) : () => setEdit(true)}
            label={edit ? 'Update' : 'Edit'}
          />
        </div>
      </div>
    </div>
  )
}

export default StockHistoryEdit
