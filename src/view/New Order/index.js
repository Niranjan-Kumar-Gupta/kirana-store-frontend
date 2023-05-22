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
import { ReactComponent as Delete } from '../../svg/delete.svg'
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import { Calendar } from 'primereact/calendar'
import { DeleteAlert } from '../../components/Alert/DeleteAlert'
import { Tag } from 'primereact/tag';

const NewOrder = () => {
  const [customers, setCustomers] = useState([])
  const [prodVar, setprodVar] = useState([])
  const [selectedProdId, setSelectedProdId] = useState([])
  const [tableData, setTableData] = useState()
  const [edit, setEdit] = useState(false)
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false)
  const [finalAmount, setFinalAmount] = useState(0);
  const [temp, setTemp] = useState({}); 

  const { id } = useParams()
  const { mode, orderDet, selectedOrder, loading } = useSelector(
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
  const dispatch = useDispatch()

  const defaultValues = {
    customerId: '',
    products: [],
    paymentStatus: '',
    status: '',
    completedAt: null,
    amount: undefined,
    freightAmount : undefined,
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

  let amt = watch('amount')
  let frAmt = watch('freightAmount')
  let amtEntered = watch('totalAmount')
  let amtPaid = watch('paidAmount')

  const deleteModule = () => {
    return (
      <DeleteAlert
        item='order'
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    )
  }

  const getAllCustomer = async () => {
    try {
      const allCutomers = await API_GET_CUSTOMERS(0, 100000)
      setCustomers(allCutomers.rows)
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
    // if (mode !== 'update') {
    //   getProdVariants()
    // }
    getProdVariants()

    // if (orderDet.productvariants) { 
    //   let __productSVar = [...orderDet?.productvariants] 
    //   const tempdata = {} 
    //   const prodId = []  
    //   __productSVar.forEach(ele => {
    //    tempdata[`${ele.productId}`] = {
    //     "checked":true,
    //     "partiallyChecked":false
    //    }
    //    prodId.push(`${ele.productId}`)
    //   });
    //   setSelectedProdId(prodId)
    //   setTemp(tempdata)
    // } 
    getAllCustomer()
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
  }, [])

  useEffect(()=>{
    if (orderDet.productvariants) { 
      let __productSVar = [...orderDet?.productvariants] 
      const tempdata = {} 
      const prodId = []  
      __productSVar.forEach(ele => {
       tempdata[`${ele.productId}`] = {
        "checked":true,
        "partiallyChecked":false
       }
       prodId.push(`${ele.productId}`)
      });
      setSelectedProdId(prodId)
      setTemp(tempdata)
    } 
  },[orderDet.productvariants])

  useEffect(() => {
  
    const filteredData = getDataByIds(prodVar, selectedProdId)
     if (orderDet?.productvariants) {
      orderDet?.productvariants.forEach(proV => {
        filteredData.forEach((filData,index) => { 
          if (proV.productId==filData.productId) {
             console.log(filData)
            filteredData[index].orderedQuantity = proV.orderedQuantity
          }
      });
     });
    }
    console.log(filteredData,selectedProdId)
    setTableData(filteredData)
    console.log(tableData)
  }, [selectedProdId, prodVar])  

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      let amt = 0;
      tableData.forEach((prod) => {
        amt += prod.price * prod?.orderedQuantity
      })
      setValue('amount', amt);
    }
  },[selectedProdId, tableData])

  useEffect(() => {
    if (amt && !frAmt) {
      setFinalAmount(amt);
    } else if (amt && frAmt) {
      setFinalAmount(amt + frAmt);
    }
  },[amt, frAmt])

  useEffect(() => {
    if (mode === 'update' && selectedOrder) {
      setValue('customerId', selectedOrder.customerId)
      setValue('paymentStatus', selectedOrder.paymentStatus)
      setValue('status', selectedOrder.status)
      setValue('amount', selectedOrder.amount)
      setValue('freightAmount', selectedOrder.freightAmount)
      setValue('paidAmount', selectedOrder.paidAmount)
      setValue(
        'completedAt',
        selectedOrder.completedAt ? new Date(selectedOrder.completedAt) : null
      )
    }
    setValue('products',temp)
  }, [selectedOrder])

  useEffect(()=>{
    setValue('products',temp) 
  },[temp,setTemp]) 

  useEffect(()=>{
      if (orderDet.productvariants) {
        let __productSVar = [...orderDet?.productvariants] 
       // console.log(__productSVar)
       // setTableData(__productSVar)
      }
  },[])
 
  const flatten = (arr) =>
    arr.reduce((acc, curr) => {
      const { children, ...rest } = curr
      acc.push(rest)
      if (children) {
        if (children.length === 0) {
          acc[acc.length - 1].isDefault = true
        }
        acc.push(...flatten(children))
      }
      return acc
    }, [])

  const getDataByIds = (data, ids) => {
    const flattenedData = flatten(data)
    console.log(flattenedData) 
   
    return ids.flatMap((id) => {
      const foundItem = flattenedData.find(
        (item) => item.key == id && ('option1' in item || item.isDefault)
      )
      if (foundItem) {
        const existingItem = tableData.find(
          (item) => item.key === foundItem.key
        )
        return {
          id: foundItem.id,
          key: foundItem.key,
          url: foundItem.url,
          label: foundItem.label,
          productName: foundItem.productName,
          productId: foundItem.productId ? foundItem.productId : foundItem.id,
          categoryId: foundItem.categoryId,
          price: foundItem.price,
          productVariantId: foundItem.productId
            ? foundItem.id
            : foundItem.productVariantId,
          SKUCode: foundItem.SKUCode,
          orderedQuantity: existingItem ? existingItem.orderedQuantity : '',
          isDefault: foundItem.isDefault ? true : false,
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
      updatedData.productvariants = tableData
      console.log(updatedData)
      const orderId = id
      // dispatch(updateOrder({ orderId, updatedData }))
      //   .unwrap()
      //   .then((res) => navigate('/orders'))
      //   .catch((err) => {
      //     toast.current.show({ severity: 'error', detail: err.message })
      //   })
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
            navigate('/orders')
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
    // let clone = { ..._products[rowIndex] };
    _products[rowIndex].orderedQuantity = e.value
    if (e.value) {
      setTableData(_products)
    }
  }

  const qtyEditor = (rowData, colData) => {
    //console.log(rowData,colData); 
    return (
      <InputNumber
        value={rowData.orderedQuantity}
        placeholder='Enter Quantity'
        disabled={!edit && mode === 'update'}
        id={rowData.key}
        name={rowData.label}
        style={{ width: '8rem' }}
        min={0}
        onValueChange={(e) => onCellEditComplete(e, colData.rowIndex)}
      />
    )
  }

  const treeSelectRef = useRef(null)

  const handleDelete = (e, rowData) => {
    e.preventDefault()
    let newData = selectedProdId.filter((id) => id != rowData.key)
    setSelectedProdId(newData)
    const oldSel = treeSelectRef.current.props.value
    oldSel[rowData.key].checked = false
    if (!oldSel[rowData.key].checked && !oldSel[rowData.key].partiallyChecked)
      delete oldSel[rowData.key]
    delete oldSel[rowData?.productId]
  }

  const actionBody = (rowData) => {
    return ( 
      <button
        disabled={!edit && mode === 'update'}
        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        onClick={(e) => handleDelete(e, rowData)}
      >
        <Delete />
      </button>
    )
  }

  const productImgBody = (rowData) => {
    return (
      <div className='' style={{ width: '90px', height: '55px' }}>
        <img
          src={`${rowData.url}?${rowData.updatedAt}`}
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
        {mode === 'update' && !rowData.isDefault ? (
          <Text type={'sub-heading'}>
            {rowData.option1 ? rowData.option1 : ''}
            {rowData.option2 ? ` / ${rowData.option2}` : ''}
            {rowData.option3 ? ` / ${rowData.option3}` : ''}
          </Text>
        ) : (
          ''
        )}
        {mode === 'create' && rowData.isDefault ? (
          ''
        ) : (
          <Text type={'sub-heading'}> {rowData.label} </Text>
        )}
        <Text type={'sub-heading'}>{`SKU: ${rowData.SKUCode}`}</Text>
      </div>
    )
  }

  const slNoBody = (rowData, colData) => {
    return <Text type={'heading'}>{colData.rowIndex + 1}</Text>
  }

  const selectedProdTable = () => {
    return (
      <DataTable
        value={ tableData }
        dataKey='id' 
        responsiveLayout='scroll'
        resizableColumns
        columnResizeMode='expand'
        className='mb-3'
        scrollable
        scrollHeight='500px'
      >
        <Column header='Sl.No' body={slNoBody}></Column>
        {/* <Column header='Image' body={productImgBody}></Column> */}
        <Column
          header='Products'
          field='productName'
          body={productNameBody}
        ></Column>
        <Column header='Price' field='price'></Column>
        <Column
          className='qtyCells'
          header='Ordered Quantity'
          field='orderedQuantity'
          body={qtyEditor}
        ></Column>   
          <Column
            header='Delivered Quantity'
            field='deliveredQuantity'
          ></Column>
          <Column header='Actions' body={actionBody}></Column>
      </DataTable>
    )
  }

  let templabel =
    mode !== 'update' ? 'Create Order' : `Order #${selectedOrder.id}`
  const itemslist = [{ label: 'Orders', url: '/orders' }, { label: templabel }]

  return (
    <>
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
              {mode === 'update' && selectedOrder.paymentStatus && (
                <div className='hidden sm:block'>
                  <Tag className={style.__tag} value={`Payment ${selectedOrder.paymentStatus}`} severity={
                      selectedOrder.paymentStatus === 'Fully Paid'
                        ? 'success'
                        : selectedOrder.paymentStatus === 'Partially Paid'
                        ? 'warning'
                        : 'danger'
                    } />
                </div>
              )}
            </div>
            <div className='w-12 sm:w-5 lg:w-4 hidden sm:block'>
              <div className='flex justify-content-end gap-2'>
                <CustomButton
                  varient={'cancel w-6rem'}
                  type='button'
                  label={
                    mode !== 'update' ? 'Cancel' : edit ? 'Cancel' : 'Delete'
                  }
                  onClick={
                    mode !== 'update'
                      ? () => {
                          navigate('/orders')
                        }
                      : edit
                      ? () => {
                          setEdit(false)
                        }
                      : () => {
                          setDisplayAlertDelete(true)
                        }
                  }
                />
                <CustomButton
                  varient='filled w-6rem'
                  type='submit'
                  label={mode === 'create' ? 'Save' : edit ? 'Update' : 'Edit'}
                  onClick={
                    mode === 'create'
                      ? handleSubmit(onSubmit)
                      : edit
                      ? handleSubmit(onSubmit)
                      : () => setEdit(true)
                  }
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
            <div className='lg:flex lg:flex-row lg:align-items-start lg:justify-content-center lg:gap-3 md:flex md:flex-column md:align-items-center'>
              <div className='lg:w-7 md:w-8 sm:w-full'>
                <div className='bg-white p-3 border-round border-50 mb-3 flex flex-wrap align-items-center'>
                  <div className='field w-12 lg:w-5'>
                    <label htmlFor='customerId'>Customer *</label>
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
                  <div className='lg:ml-3 lg:mt-2'>
                    {mode === 'create' && (
                      <CustomButton
                        varient='filled'
                        icon={'pi pi-plus'}
                        onClick={() => navigate('/customers/new')}
                        label={'Add Customer'}
                      />
                    )}
                  </div>
                </div>
                <div className='field bg-white p-3 border-round border-50 mb-3'>
                  {true ? (
                    <div className='field w-12 lg:w-5'>
                      <label htmlFor='categories'>Products *</label>
                      <Controller
                        name='products'

                        control={control}
                        rules={{ required: 'Please select products.' }}
                        render={({ field, fieldState }) => (
                          <TreeSelect
                            ref={treeSelectRef}
                            filter
                            id={field.name}
                            disabled={!edit && mode === 'update'}
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
                        )}
                      />
                      {getFormErrorMessage('products')}
                    </div>
                  ) : (
                    <></>
                  )}
                  {selectedProdTable()}
                </div>

                <div className='field bg-white p-3 border-round border-50 mb-3'>
                  <div className='field sm:w-full md:w-12 lg:w-6 flex align-items-center'>
                    <label className='w-12 mr-3' htmlFor='amount'>
                      Amount *
                    </label>
                    <div className='w-12'>
                      <Controller
                        name='amount'
                        control={control}
                        rules={{ required: 'Please provide amount' }}
                        render={({ field, fieldState }) => (
                          <InputNumber
                            id={field.name}
                            disabled={!edit && mode === 'update'}
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
                      {getFormErrorMessage('amount')}
                    </div>
                  </div>
                  <div className='field sm:w-full md:w-12 lg:w-6 flex align-items-center'>
                    <label className='w-12 mr-3' htmlFor='freightAmount'>
                      Freight Amount 
                    </label>
                    <div className='w-12'>
                      <Controller
                        name='freightAmount'
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputNumber
                            id={field.name}
                            disabled={!edit && mode === 'update'}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            useGrouping={false}
                            mode='currency'
                            currency='INR'
                            currencyDisplay='code'
                            locale='en-IN'
                            placeholder='Enter Freight Amount'
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('freightAmount')}
                    </div>
                  </div>
                  <div className='flex align-items-center my-4'>
                    <div className='mr-3 w-6 lg:w-3'>Total Amount </div>
                    <Text type={'heading'}>
                      INR{' '}
                      {finalAmount}
                    </Text>
                  </div>
                  <div className='field sm:w-full md:w-12 lg:w-6 flex align-items-center'>
                    <label className='w-12 mr-3' htmlFor='paidAmount'>
                      Paid Amount
                    </label>
                    <Controller
                      name='paidAmount'
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputNumber
                          id={field.name}
                          disabled={!edit && mode === 'update'}
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          useGrouping={false}
                          mode='currency'
                          currency='INR'
                          currencyDisplay='code'
                          locale='en-IN'
                          placeholder='Enter Paid Amount'
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                  </div>
                  <div className='flex align-items-center my-4'>
                    <div className='mr-3 w-6 lg:w-3'>Balance </div>
                    <Text type={'heading'}>
                      INR{' '}
                      {finalAmount && amtPaid
                        ? finalAmount - amtPaid
                        : finalAmount && !amtPaid
                        ? finalAmount
                        : 0}
                    </Text>
                  </div>
                </div>
              </div>

              <div className='lg:w-3 md:w-8 sm:w-full bg-white p-3 border-round border-50 mb-3'>
                <div className='field'>
                  <label htmlFor='status'>Order Status *</label>
                  <Controller
                    name='status'
                    control={control}
                    rules={{ required: 'Status is required.' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        disabled={!edit && mode === 'update'}
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
                <div className='field'>
                  <label htmlFor='paymentStatus'>Payment Status *</label>
                  <Controller
                    name='paymentStatus'
                    control={control}
                    rules={{ required: 'Payment Status is required.' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        disabled={!edit && mode === 'update'}
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
                  <label htmlFor='completedAt'>Reminder Date</label>
                  <Controller
                    name='completedAt'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        inputId={field.name}
                        disabled={!edit && mode === 'update'}
                        value={field.value}
                        onChange={field.onChange}
                        showIcon
                        placeholder='dd/mm/yyyy'
                        dateFormat='dd/mm/yy'
                        className={classNames({
                          'p-invalid': fieldState.error,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('completedAt')}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className='sm:w-12 md:w-5 lg:w-4 sm:hidden'>
          <div className='flex justify-content-end gap-2'>
            <CustomButton
              varient={'cancel w-6rem'}
              type='button'
              label={mode !== 'update' ? 'Cancel' : edit ? 'Cancel' : 'Delete'}
              onClick={
                mode !== 'update'
                  ? () => {
                      navigate('/products')
                    }
                  : edit
                  ? () => {
                      setEdit(false)
                    }
                  : () => {
                      setDisplayAlertDelete(true)
                    }
              }
            />
            <CustomButton
              varient='filled w-6rem'
              type='submit'
              label={mode === 'create' ? 'Save' : edit ? 'Update' : 'Edit'}
              onClick={
                mode === 'create'
                  ? handleSubmit(onSubmit)
                  : edit
                  ? handleSubmit(onSubmit)
                  : () => setEdit(true)
              }
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default NewOrder
