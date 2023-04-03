import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'
import { Badge } from 'primereact/badge'
import { InputNumber } from 'primereact/inputnumber'
import { TreeSelect } from 'primereact/treeselect'
import { useDispatch, useSelector } from 'react-redux'
import { API_GET_CUSTOMERS } from '../../api/customer.services'
import { sortAlphabeticalObjectArr } from '../../utils/tableUtils'
import { CustomButton } from '../../components/CustomButton'
import { Text } from '../../components/Text'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import style from './style.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addOrder,
  getOrderDetails,
  resetMode,
  updateMode,
  updateOrder,
} from '../../reducers/orderTableSlice'
import { API_GET_PRRODUCTS_WITH_VARIANTS } from '../../api/product.services'
import Loader from '../../components/Loader'

const NewOrder = () => {
  const [customers, setCustomers] = useState([])
  const [prodVar, setprodVar] = useState([])
  const [selectedProdId, setSelectedProdId] = useState([])
  const [tableData, setTableData] = useState()
  const dispatch = useDispatch()

  const { id } = useParams()
  const { mode, orderDet, orderDetails, loading } = useSelector(
    (state) => state.orderTable
  )

  const paymentStatus = [
    { key: 'Fully Paid', value: 'Fully Paid' },
    { key: 'Partially Paid', value: 'Partially Paid' },
    { key: 'Not Paid', value: 'Not Paid' },
  ]

  const status = [
    { key: 'New', value: 'New' },
    { key: 'Delivered', value: 'Delivered' },
    { key: 'Cancelled', value: 'Cancelled' },
    { key: 'In Progress', value: 'In Progress' },
    { key: 'Completed', value: 'Completed' },
  ]

  const toast = useRef(null)
  const navigate = useNavigate()

  const defaultValues = {
    customerId: '',
    products: [],
    paymentStatus: '',
    status: '',
    totalAmount: undefined,
    paidAmount: undefined,
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm({ defaultValues })

  let amtEntered = watch('totalAmount')
  let amtPaid = watch('paidAmount')

  const getAllCustomer = async () => {
    try {
      const allCutomers = await API_GET_CUSTOMERS(0, 100000)
      let sortedCustomer = sortAlphabeticalObjectArr(allCutomers.rows, 'name')
      setCustomers(sortedCustomer)
    } catch (error) {
      console.log(error)
    }
  }

  const getProdVariants = async () => {
    try {
      const prodVariants = await API_GET_PRRODUCTS_WITH_VARIANTS(0, 100000)
      setprodVar(prodVariants.rows)
    } catch (error) {
      console.log(error)
    }
  }

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className='p-error'>{errors[name].message}</small>
    )
  }

  useEffect(() => {
    if (mode === 'update') {
      try {
        dispatch(getOrderDetails(id))
      } catch (error) {
        console.log(error)
      }
    }
    if (mode !== 'update') {
      getProdVariants()
    }
    getAllCustomer()
  }, [])

  useEffect(() => {
    const filteredData = getDataByIds(prodVar, selectedProdId)
    setTableData(filteredData)
  }, [selectedProdId, prodVar])

  useEffect(() => {
    if (id) {
      try {
        dispatch(updateMode('update'))
        dispatch(getOrderDetails(id))
      } catch (error) {
        console.log(error)
      }
    } else {
      dispatch(updateMode('create'))
    }
  }, [id])

  useEffect(() => {
    if (mode === 'update' && orderDetails) {
      setValue('customerId', orderDetails.customerId)
      setValue('paymentStatus', orderDetails.paymentStatus)
      setValue('status', orderDetails.status)
      setValue('totalAmount', orderDetails.totalAmount)
      setValue('paidAmount', orderDetails.paidAmount)
    }
  }, [mode, orderDetails])

  const flatten = (arr) =>
    arr.reduce((acc, curr) => {
      const { children, ...rest } = curr
      acc.push(rest)
      if (children) {
        acc.push(...flatten(children))
      }
      return acc
    }, [])

  const getDataByIds = (data, ids) => {
    const flattenedData = flatten(data)
    return ids.flatMap((id) => {
      const foundItem = flattenedData.find(
        (item) => item.key == id && ('option1' in item || item.defaultProduct)
      )
      if (foundItem) {
        return {
          id: foundItem.id,
          key: foundItem.key,
          label: foundItem.label,
          productName: foundItem.productName,
          productId: foundItem.productId ? foundItem.productId : foundItem.id,
          categoryId: foundItem.categoryId,
          productVariantId: foundItem.productId ? foundItem.id : null,
          SKUCode: foundItem.SKUCode,
          orderedQuantity: '',
        }
      }
      return []
    })
  }

  const loader = () => {
    return <Loader visible={loading} />
  }

  const onSubmit = (data) => {
    if (mode === 'update') {
      let updatedData = {
        orderDetails: {},
      }
      updatedData.orderDetails = data
      delete updatedData.orderDetails.products
      const orderId = id
      dispatch(updateOrder({ orderId, updatedData }))
        .unwrap()
        .then((res) => {
          toast.current.show({
            severity: 'success',
            detail: 'Order Updated Successfully',
          })
        })
        .catch((err) => {
          toast.current.show({ severity: 'error', detail: err.message })
        })
    } else {
      let isQtyEmpty = false
      tableData.forEach((prod) => {
        if (!prod.orderedQuantity || prod.orderedQuantity === '') {
          toast.current.show({
            severity: 'error',
            detail: `${prod.label} orderedQuantity is empty`,
          })
          isQtyEmpty = true
        }
      })
      if (!isQtyEmpty) {
        let _data = {
          orderDetails: {},
          productvariants: {},
        }
        delete data.products
        _data.orderDetails = data

        _data.productvariants = tableData
        dispatch(addOrder(_data))
          .unwrap()
          .then((res) => {
            toast.current.show({
              severity: 'success',
              detail: 'Order Created Successfully',
            })
            setTableData([])
            reset()
          })
          .catch((err) => {
            toast.current.show({ severity: 'error', detail: err.message })
          })
      }
    }
  }

  const onCellEditComplete = (e, rowIndex) => {
    let _products = [...tableData]
    _products[rowIndex].orderedQuantity = e.value
    setTableData(_products)
  }

  const qtyEditor = (rowData, colData) => {
    return (
      <InputNumber
        value={rowData.orderedQuantity}
        placeholder='Enter Quantity'
        id={rowData.key}
        name={rowData.label}
        showButtons
        style={{ width: '12rem' }}
        min={0}
        incrementButtonIcon='pi pi-plus'
        decrementButtonIcon='pi pi-minus'
        onValueChange={(e) => onCellEditComplete(e, colData.rowIndex)}
      />
    )
  }

  const productImgBody = (rowData) => {
    return (
      <div className='' style={{ width: '90px', height: '55px' }}>
        <img
          src={`${rowData.url}`}
          onError={(e) => (e.target.src = './../../images/ImgPlaceholder.svg')}
          style={{ maxWidth: '100%', height: '100%' }}
        />
      </div>
    )
  }

  const productNameBody = (rowData) => {
    return (
      <div className='flex flex-column'>
        <div className='mb-1'>
          <Text type={'heading'}>{rowData.productName}</Text>
        </div>
        {mode === 'update' ? (
          <Text type={'sub-heading'}>
            {rowData.option1 ? rowData.option1 : ''}
            {rowData.option2 ? ` / ${rowData.option2}` : ''}
            {rowData.option3 ? ` / ${rowData.option3}` : ''}
          </Text>
        ) : (
          <Text type={'sub-heading'}> {rowData.label} </Text>
        )}
        <Text type={'sub-heading'}>{`SKU: ${rowData.SKUCode}`}</Text>
      </div>
    )
  }

  const selectedProdTable = () => {
    return (mode === 'create' && tableData && tableData.length > 0) ||
      mode === 'update' ? (
      <DataTable
        value={mode === 'create' ? tableData : orderDet.productvariants}
        dataKey='id'
        responsiveLayout='scroll'
        resizableColumns
        columnResizeMode='expand'
        className='mb-3'
        scrollable
        scrollHeight='500px'
      >
        <Column header='Image' body={productImgBody}></Column>
        <Column
          header='Products'
          field='productName'
          body={productNameBody}
        ></Column>
        <Column
          className='qtyCells'
          header='Quantity'
          field='orderedQuantity'
          body={mode === 'create' ? qtyEditor : ''}
        ></Column>
        {mode === 'update' ? (
          <Column
            header='Delivered Quantity'
            field='deliveredQuantity'
          ></Column>
        ) : (
          ''
        )}
      </DataTable>
    ) : (
      <></>
    )
  }

  const goBack = () => {
    dispatch(resetMode())
    navigate('/orders')
  }

  return (
    <>
      <div className='w-11 m-auto mb-6'>
        <Toast ref={toast} />
        {loader ? loader() : <></>}
        <div
          className={`md:flex md:justify-content-center pt-3 ${style.stickySubNav}`}
        >
          <div className='flex md:w-8 align-items-center justify-content-between mb-3 gap-2'>
            <div className='lg:w-5 flex align-items-center'>
              <button className={style.customButton} onClick={goBack}>
                <span
                  className={`pi pi-arrow-circle-left mr-3 ${style.font}`}
                ></span>
              </button>
              <div className='mr-3'>
                <Text type={'heading'}>
                  {mode !== 'update'
                    ? 'New Order'
                    : `Order #${orderDetails.id}`}
                </Text>
              </div>
              {mode === 'update' && orderDetails.paymentStatus && (
                <div className='hidden sm:block'>
                  <Badge
                    value={`Payment ${orderDetails.paymentStatus}`}
                    severity={
                      orderDetails.paymentStatus === 'Fully Paid'
                        ? 'success'
                        : 'danger'
                    }
                  ></Badge>
                </div>
              )}
            </div>
            <div className='lg:w-3'>
              <div className='flex justify-content-end'>
                <CustomButton
                  varient='filled'
                  type='submit'
                  onClick={handleSubmit(onSubmit)}
                  label={mode === 'create' ? 'Create' : 'Update'}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`card`}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='p-fluid'
            encType='multipart/form-data'
          >
            <div className='lg:flex lg:flex-row lg:align-items-start lg:justify-content-center lg:gap-2 md:flex md:flex-column md:align-items-center'>
              <div className='lg:w-5 md:w-8 sm:w-full'>
                <div className='field bg-white p-2 border-round border-50 mb-2'>
                  <label htmlFor='customerId'>Cusotmer *</label>
                  <Controller
                    name='customerId'
                    control={control}
                    rules={{ required: 'Customer is required.' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        filter
                        disabled={mode === 'update'}
                        id={field.name}
                        options={customers}
                        optionLabel='name'
                        optionValue='id'
                        placeholder='Select Customer'
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('customerId')}
                </div>
                <div className='field bg-white p-2 border-round border-50 mb-2'>
                  {mode === 'create' ? (
                    <div className='field'>
                      <label htmlFor='categories'>Products *</label>
                      <Controller
                        name='products'
                        control={control}
                        rules={{ required: 'Please select products.' }}
                        render={({ field, fieldState }) => (
                          <>
                            <TreeSelect
                              filter
                              id={field.name}
                              value={field.value}
                              onChange={(e) => {
                                let prodId = Object.keys(e.value).filter(
                                  (key) =>
                                    e.value[key].checked &&
                                    !e.value[key].partiallyChecked
                                )
                                setSelectedProdId(prodId)
                                field.onChange(e.value)
                              }}
                              selectionMode='checkbox'
                              display='chip'
                              inputRef={field.ref}
                              options={prodVar}
                              metaKeySelection={false}
                              placeholder='Select Products'
                              className={classNames('w-full', {
                                'p-invalid': fieldState.error,
                              })}
                            />
                            {getFormErrorMessage(field.name)}
                          </>
                        )}
                      />
                      {getFormErrorMessage('products')}
                    </div>
                  ) : (
                    <></>
                  )}
                  {selectedProdTable()}
                </div>

                <div className='field bg-white p-2 border-round border-50 mb-2'>
                  <div className=''>
                    <div className='field sm:w-full md:w-12 flex align-items-center'>
                      <label className='w-6' htmlFor='totalAmount'>
                        Amount *
                      </label>
                      <Controller
                        name='totalAmount'
                        control={control}
                        rules={{ required: 'Please provide amount' }}
                        render={({ field, fieldState }) => (
                          <InputNumber
                            id={field.name}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            useGrouping={false}
                            mode='currency'
                            currency='INR'
                            currencyDisplay='code'
                            locale='en-IN'
                            placeholder='Enter Amount'
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('totalAmount')}
                    </div>
                    <div className='field sm:w-full md:w-12 flex align-items-center'>
                      <label className='w-6' htmlFor='paidAmount'>
                        Amount Paid (optional)
                      </label>
                      <Controller
                        name='paidAmount'
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputNumber
                            id={field.name}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            useGrouping={false}
                            mode='currency'
                            currency='INR'
                            currencyDisplay='code'
                            locale='en-IN'
                            placeholder='Enter Amount Paid'
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('paidAmount')}
                    </div>
                  </div>
                  <div className='flex align-items-center my-4'>
                    <div className='mr-3 w-4'>Balance: </div>
                    <Text type={'heading'}>
                      INR{' '}
                      {amtEntered && amtPaid
                        ? amtEntered - amtPaid
                        : amtEntered && !amtPaid
                        ? amtEntered
                        : 0}
                    </Text>
                  </div>
                </div>
              </div>

              <div className='lg:w-3 md:w-8 sm:w-full bg-white p-2 border-round border-50 mb-2'>
                <div className='field'>
                  <label htmlFor='paymentStatus'>Payment Type *</label>
                  <Controller
                    name='paymentStatus'
                    control={control}
                    rules={{ required: 'Status is required.' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        options={paymentStatus}
                        optionLabel='key'
                        optionValue='value'
                        placeholder='Choose payment status'
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('paymentStatus')}
                </div>
                <div className='field'>
                  <label htmlFor='status'>Order Status *</label>
                  <Controller
                    name='status'
                    control={control}
                    rules={{ required: 'Status is required.' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        options={status}
                        optionLabel='key'
                        optionValue='value'
                        placeholder='Choose order status'
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('status')}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default NewOrder
