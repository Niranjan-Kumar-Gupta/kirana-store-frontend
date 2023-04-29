import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import style from './style.module.css'
import { Text } from '../../components/Text'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { TreeSelect } from 'primereact/treeselect'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useForm, Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
import { InputTextarea } from 'primereact/inputtextarea'
import {
  API_GET_RAWMATERIAL,
  API_GET_RAW_STOCK_MATERIAL,
} from '../../api/rawMaterial.service'
import Loader from '../../components/Loader'

import { useDispatch, useSelector } from 'react-redux'

import { Button } from 'primereact/button'
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import { ReactComponent as Delete } from '../../svg/delete.svg'
import { MultiSelect } from 'primereact/multiselect'
import {
  changeToastActionRaw,
  updateRawMaterialHistoryCheck,
} from '../../reducers/rawMaterialHistoryTableSlice'
import { API_GET_BRAND } from '../../api/product.services'

const RawMaterialCheckIn = () => {
  const [tableData, setTableData] = useState([])
  const toast = useRef(null)
  const [selectedRawId, setSelectedRawId] = useState([])
  const [rawMaterial, setRawMaterial] = useState([])
  const [brands, setBrands] = useState([])
  const dispatch = useDispatch()

  const paymentStatus = [
    { key: 'Fully Paid', value: 'Fully Paid' },
    { key: 'Partially Paid', value: 'Partially Paid' },
    { key: 'Not Paid', value: 'Not Paid' },
  ]

  const { loading } = useSelector((state) => state.rawMaterialHistoryTable)

  const loader = () => {
    return <Loader visible={loading} />
  }

  useEffect(() => {
    getRawMaterial()
    getBrands()
  }, [])

  useEffect(() => {
    const filteredData = getDataByIds(rawMaterial, selectedRawId)
    setTableData(filteredData)
  }, [selectedRawId, rawMaterial])

  const getBrands = async () => {
    try {
      const brand = await API_GET_BRAND()
      setBrands(brand.rows)
    } catch (error) {
      console.log(error)
    }
  }

  const getRawMaterial = async () => {
    try {
      const rawMaterial = await API_GET_RAW_STOCK_MATERIAL(0, 100000)
      rawMaterial.rows.forEach((ele) => {
        ele['key'] = ele.id
        ele['label'] = ele.materialName
      })
      setRawMaterial(rawMaterial.rows)
    } catch (error) {
      console.log(error)
    }
  }

  const getDataByIds = (data, ids) => {
    return ids.flatMap((id) => {
      const foundItem = data.find((item) => item.key == id)
      if (foundItem) {
        const existingItem = tableData.find(
          (item) => item.key === foundItem.key
        )
        return {
          ...foundItem,
          checkInQuantity: existingItem
            ? existingItem.checkInQuantity
            : undefined,
        }
      }
      return []
    })
  }

  const navigate = useNavigate()
  const goBack = () => {
    navigate('/rawMaterial')
  }

  const defaultValues = {
    brandName: '',
    rawMaterials: null,
    amount: undefined,
    paidAmount: undefined,
    paymentStatus: '',
    comment: '',
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
  let paidAmt = watch('paidAmount')

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className='p-error'>{errors[name].message}</small>
    )
  }

  const onCellEditCompleteCheckIn = (e, rowIndex) => {
    let _rawMaterial = [...tableData]
    _rawMaterial[rowIndex].checkInQuantity = e.value
    if (e.value) {
      setTableData(_rawMaterial)
    }
  }

  const checkInQuantityEditor = (rowData, colData) => {
    return (
      <InputNumber
        value={rowData.checkInQuantity}
        placeholder='Enter Quantity'
        id={rowData.id}
        name={rowData.materialName}
        style={{ width: '8rem' }}
        min={0}
        onChange={(e) => onCellEditCompleteCheckIn(e, colData.rowIndex)}
      />
    )
  }

  const selectedRawMaterialTable = () => {
    return (
      <DataTable
        value={tableData}
        responsiveLayout='scroll'
        resizableColumns
        columnResizeMode='expand'
        className='w-full'
        scrollable
        scrollHeight='500px'
      >
        <Column header='Raw Material Name' field='materialName'></Column>
        <Column
          className='qtyCells'
          header='Available Quantity'
          field='quantity'
        ></Column>
        <Column
          className='qtyCells'
          header='Check In Quantity'
          field='quantity'
          body={checkInQuantityEditor}
        ></Column>
        <Column header='Actions' body={actionBody}></Column>
      </DataTable>
    )
  }
  const onSubmit = (data) => {

    delete data.rawMaterials;
    data.reason = data.comment;
    delete data.comment;
    data.materialArray = [];
    tableData.forEach((ele) => {
      data.materialArray.push({
        materialId: ele.materialId,
        quantity: ele.checkInQuantity,
        vendorName: 'a',
      })
    })

    let isQtyEmpty = false
    tableData.forEach((raw) => {
      if (!raw.checkInQuantity || raw.checkInQuantity === '') {
        toast.current.show({
          severity: 'error',
          detail: `${raw.label} Check In Quantity is empty`,
        })
        isQtyEmpty = true
      }
    })

    if (isQtyEmpty) return

    dispatch(updateRawMaterialHistoryCheck(data))
      .unwrap()
      .then((res) => {
        goBack()
        dispatch(changeToastActionRaw('checkIn'))
      })
      .catch((err) => {
        toast.current.show({ severity: 'error', detail: err.message })
      })
  }

  const treeSelectRef = useRef(null)

  const handleDelete = (e, rowData) => {
    e.preventDefault()
    let newData = selectedRawId.filter((id) => id != rowData.key)
    setSelectedRawId(newData)
    const oldSel = treeSelectRef.current.props.value
    oldSel[rowData.key].checked = false
    if (!oldSel[rowData.key].checked && !oldSel[rowData.key].partiallyChecked)
      delete oldSel[rowData.key]
  }

  const actionBody = (rowData) => {
    return (
      <button
        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        onClick={(e) => handleDelete(e, rowData)}
      >
        <Delete />
      </button>
    )
  }

  const itemslist = [
    { label: 'Raw Material', url: '/rawMaterial' },
    { label: 'Check In' },
  ]

  return (
    <div className='w-11 m-auto mb-6'>
      <Toast ref={toast} />
      {loading ? loader() : <></>}
      <div
        className={`md:flex md:justify-content-center pt-3 ${style.stickySubNav}`}
      >
        <div className='flex flex-column md:flex-row lg:flex-row lg:w-10 md:w-8 md:justify-content-between align-items-center justify-content-center mb-3'>
          <div className='lg:w-7 md:w-6 flex align-items-center'>
            <CustomBreadcrumb className='pl-0' itemslist={itemslist} />
          </div>
          <div className='sm:w-12 md:w-5 lg:w-4'>
            <div className='flex justify-content-end gap-2'>
              <Button
                className={`skalebot-button ${style.colored} w-6rem`}
                onClick={() => navigate('/rawMaterial')}
              >
                Cancel
              </Button>
              <CustomButton
                varient='filled w-7rem pl-3'
                type='submit'
                onClick={handleSubmit(onSubmit)}
                label={'Check In'}
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
              <div className='bg-white p-3 border-round border-50 mb-3'>
                <div className='field w-12 lg:w-5'>
                  <label htmlFor='customerId'>Brand Name *</label>
                  <Controller
                    name='brandName'
                    control={control}
                    rules={{ required: 'Brand Name is required.' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        filter
                        id={field.name}
                        options={brands}
                        optionLabel='brandName'
                        optionValue='id'
                        placeholder='Select Brand Name'
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('brandName')}
                </div>
                <div className='field w-12 lg:w-5'>
                  <label htmlFor='categories'>Raw Material *</label>
                  <Controller
                    name='rawMaterials'
                    control={control}
                    rules={{ required: 'Please select a Raw Material.' }}
                    render={({ field, fieldState }) => (
                      <>
                        <TreeSelect
                          ref={treeSelectRef}
                          filter
                          id={field.name}
                          value={field.value}
                          name='rawMaterials'
                          onChange={(e) => {
                            let prodId = Object.keys(e.value).filter(
                              (key) =>
                                e.value[key].checked &&
                                !e.value[key].partiallyChecked
                            )
                            setSelectedRawId(prodId)
                            field.onChange(e.value)
                          }}
                          selectionMode='checkbox'
                          display='chip'
                          options={rawMaterial}
                          inputRef={field.ref}
                          placeholder='Select Raw Materials'
                          className={classNames('w-full', {
                            'p-invalid': fieldState.error,
                          })}
                        />
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>
                {tableData && tableData.length !== 0
                  ? selectedRawMaterialTable()
                  : ''}
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
                  <label className='w-12 mr-3' htmlFor='paidAmount'>
                    Amount Paid
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
                </div>
                <div className='flex align-items-center my-4'>
                  <div className='mr-3 w-6 lg:w-3'>Balance: </div>
                  <Text type={'heading'}>
                    INR{' '}
                    {amt && !paidAmt ? amt : amt && paidAmt ? amt - paidAmt : 0}
                  </Text>
                </div>
              </div>
            </div>
            <div className='lg:w-3 md:w-8 sm:w-full bg-white p-3 border-round border-50 mb-3'>
              <div className='field'>
                <label htmlFor='paymentStatus'>Payment Status *</label>
                <Controller
                  name='paymentStatus'
                  control={control}
                  rules={{ required: 'Payment Status is required.' }}
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
                <label htmlFor='comment'>Comment</label>
                <Controller
                  name='comment'
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputTextarea
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      rows={5}
                      placeholder='Enter Comment'
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* <div className='flex justify-content-end gap-2 mt-3 '>
              <div className='flex  '>
                <CustomButton varient='filled' type='submit' label={'Check In'} />
            
              </div>
             </div> */}
        </form>
      </div>
    </div>
  )
}

export default RawMaterialCheckIn
