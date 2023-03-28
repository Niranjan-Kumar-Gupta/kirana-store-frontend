import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { TreeSelect } from 'primereact/treeselect'
import { useDispatch, useSelector } from 'react-redux'
import { API_GET_CUSTOMERS } from '../../api/customer.services'
import { formatText, sortAlphabeticalObjectArr } from '../../utils/tableUtils'
import { CustomButton } from '../../components/CustomButton'
import { Text } from '../../components/Text'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import style from './style.module.css'
import { useNavigate } from 'react-router-dom'

const NewOrder = () => {
  const [customers, setCustomers] = useState([])
  const [selectedProdId, setSelectedProdId] = useState([])
  const [tableData, setTableData] = useState()

  const paymentTypeOptions = [
    { key: 'Full Payment', value: 'Full Payment' },
    { key: 'Half Payment', value: 'Half Payment' },
    { key: 'Credit', value: 'Credit' },
  ]

  const products = [
    {
      key: '0',
      label: 'Documents',
      data: 'Documents Folder',
      icon: 'pi pi-fw pi-inbox',
      children: [
        {
          key: '0-0',
          label: 'Work',
          data: 'Work Folder',
          icon: 'pi pi-fw pi-cog',
        },
        {
          key: '0-1',
          label: 'Home',
          data: 'Home Folder',
          icon: 'pi pi-fw pi-home',
        },
      ],
    },
    {
      key: '1',
      label: 'Events',
      data: 'Events Folder',
      icon: 'pi pi-fw pi-calendar',
      children: [
        {
          key: '1-0',
          label: 'Meeting',
          icon: 'pi pi-fw pi-calendar-plus',
          data: 'Meeting',
        },
        {
          key: '1-1',
          label: 'Product Launch',
          icon: 'pi pi-fw pi-calendar-plus',
          data: 'Product Launch',
        },
        {
          key: '1-2',
          label: 'Report Review',
          icon: 'pi pi-fw pi-calendar-plus',
          data: 'Report Review',
        },
      ],
    },
    {
      key: '2',
      label: 'Movies',
      data: 'Movies Folder',
      icon: 'pi pi-fw pi-star-fill',
      children: [
        {
          key: '2-0',
          icon: 'pi pi-fw pi-star-fill',
          label: 'Al Pacino',
          data: 'Pacino Movies',
        },
        {
          key: '2-1',
          label: 'Robert De Niro',
          icon: 'pi pi-fw pi-star-fill',
          data: 'De Niro Movies',
        },
      ],
    },
  ]

  const toast = useRef(null)
  const navigate = useNavigate();

  const defaultValues = {
    customerId: '',
    products: [],
    paymentType: '',
    amount: undefined,
    amountPaid: undefined,
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ defaultValues })

  const getAllCustomer = async () => {
    try {
      const allCutomers = await API_GET_CUSTOMERS(0, 100000)
      let sortedCustomer = sortAlphabeticalObjectArr(allCutomers.rows, 'name')
      setCustomers(sortedCustomer)
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
    getAllCustomer()
  }, [])

  useEffect(() => {
    const filteredData = getDataByIds(products, selectedProdId)
    setTableData(filteredData)
  }, [selectedProdId])

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
      const foundItem = flattenedData.find((item) => item.key === id)
      if (foundItem) {
        return {
          key: foundItem.key,
          label: foundItem.label,
          data: foundItem.data,
          quantity: '',
        }
      }
      return []
    })
  }

  const onSubmit = (data) => {
    let isQtyEmpty = false;
    tableData.forEach((prod) => {
      if (!prod.quantity || prod.quantity === "") {
        toast.current.show({ severity: 'error', detail: `${prod.label} quantity is empty` }) 
        isQtyEmpty = true
      }
    })
    if (!isQtyEmpty) {
      data.productOrdered = tableData;
      setTableData([])
      reset()
      console.log(data)
    }
  }
  
  const onCellEditComplete = (e, rowIndex) => {
    let _products = [...tableData];
    _products[rowIndex].quantity = e.value; 
    setTableData(_products);
  }
 
  const qtyEditor = (rowData, colData) => {
    return (
      <InputNumber
        value={rowData.quantity}
        placeholder="Enter Quantity"
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

  const selectedProdTable = () => {
    return (
      <DataTable
        value={tableData}
        dataKey='key'
        responsiveLayout='scroll'
        resizableColumns
        columnResizeMode='expand'
      >
        <Column header='Products' field='label'></Column>
        <Column
          className='qtyCells'
          header='Quantity'
          field='quantity'
          body={qtyEditor}
        ></Column>
      </DataTable>
    )
  }

  const goBack = () => {
    navigate('/orders')
  }

  return (
    <>
      <div className='w-11 pt-3 m-auto'>
        <Toast ref={toast} />
        <div className='flex align-items-center mb-3'>
          <button className={style.customButton} onClick={goBack}>
            <span className={`pi pi-arrow-circle-left mr-3 ${style.font}`} ></span>
          </button>
          <Text type={'heading'}>New Order</Text>
        </div>
        <div className={`card`}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='p-fluid'
            encType='multipart/form-data'
          >
            <div className='field'>
              <label htmlFor='customerId'>Cusotmer *</label>
              <Controller
                name='customerId'
                control={control}
                rules={{ required: 'Customer is required.' }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    filter
                    id={field.name}
                    options={customers}
                    optionLabel='name'
                    optionValue='id'
                    placeholder='Select Customer'
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    className={classNames({ 'p-invalid': fieldState.invalid })}
                  />
                )}
              />
              {getFormErrorMessage('customerId')}
            </div>

            <div className='field mb-3'>
              <label htmlFor='categories'>Products *</label>
              <Controller
                name='products'
                control={control}
                rules={{ required: 'Please select a category.' }}
                render={({ field, fieldState }) => (
                  <>
                    <TreeSelect
                      filter
                      id={field.name}
                      value={field.value}
                      onChange={(e) => {
                        let prodId = Object.keys(e.value).filter(
                          (key) => e.value[key].checked
                        )
                        setSelectedProdId(prodId)
                        field.onChange(e.value)
                      }}
                      selectionMode='checkbox'
                      display='chip'
                      inputRef={field.ref}
                      options={products}
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
            {tableData && tableData.length !== 0 ? selectedProdTable() : ''}
            <div className='mt-8'>
              <div className='field'>
                <label htmlFor='paymentType'>Payment Type *</label>
                <Controller
                  name='paymentType'
                  control={control}
                  rules={{ required: 'Status is required.' }}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      options={paymentTypeOptions}
                      optionLabel='key'
                      optionValue='value'
                      placeholder='Choose a payment type'
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage('paymentType')}
              </div>
              <div className='field'>
                <label htmlFor='amount'>Amount (Optional)</label>
                <Controller
                  name='amount'
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
                      placeholder='Enter Amount'
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage('amount')}
              </div>
              <div className='field'>
                <label htmlFor='amountPaid'>Amount Paid (optional)</label>
                <Controller
                  name='amountPaid'
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
                {getFormErrorMessage('amountPaid')}
              </div>
            </div>

            <div className='flex gap-2'>
              <CustomButton varient='filled' type='submit' label={'Create'} />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default NewOrder
