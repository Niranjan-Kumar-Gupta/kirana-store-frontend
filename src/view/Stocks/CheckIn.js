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
import { InputTextarea } from 'primereact/inputtextarea';
        
const CheckIn = () => {
  const [tableData, setTableData] = useState()
  const toast = useRef(null)
  const [selectedProdId, setSelectedProdId] = useState([])
  const [reasons, setReasons] = useState( [
    {
        key: '0',
        label: 'Order Delivery',
        data: 'Order Delivery',
       
        children: [
            {
                key: '0-0',
                label: 'order 1',
                data: 'order 1 Folder',
               
               
            },
            {
                key: '0-1',
                label: 'order 2',
                data: 'order 2 ',
                
           }
        ]
    },
    {
        key: '1',
        label: 'Damaged',
        data: 'Damaged ',
       
    },
    {
        key: '2',
        label: 'Correction',
        data: 'Correction ',
       
    
    }
]);
  const [selectedReasons, setSelectedReasons] = useState(null);
  


  useEffect(() => {
    const filteredData = getDataByIds(products, selectedProdId)
    setTableData(filteredData)
  }, [selectedProdId])

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
    const navigate = useNavigate()
    const goBack = () => {
        navigate('/stocks')
      }

      const defaultValues = {
        products: [],
        comment: '',
        reason: undefined,
      }
    
      const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
      } = useForm({ defaultValues })


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
          skuId:'',
          checkInQuantity:''
        }
      }
      return []
    })
  }

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className='p-error'>{errors[name].message}</small>
    )
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
        style={{ width: '8rem' }}
        min={0}
        incrementButtonIcon='pi pi-plus'
        decrementButtonIcon='pi pi-minus'
        onValueChange={(e) => onCellEditComplete(e, colData.rowIndex)}
      />
    )
  }
  const onCellEditCompleteCheckIn = (e, rowIndex) => {
    let _products = [...tableData];
    _products[rowIndex].checkInQuantity = e.value; 
    setTableData(_products);
  }
 
  const checkInQuantityEditor = (rowData, colData) => {
    
    return (
      <InputNumber
        value={rowData.checkInQuantity}
        placeholder="Enter Check out Quantity"
        id={rowData.key}
        name={rowData.label}
        showButtons
        style={{ width: '8rem' }}
        min={0}
        incrementButtonIcon='pi pi-plus'
        decrementButtonIcon='pi pi-minus'
        onValueChange={(e) => onCellEditCompleteCheckIn(e, colData.rowIndex)}
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
        className='w-full'
      >
        <Column header='Products' field='label'></Column>
        <Column header='SKU Id' field='SkuId'></Column>
       
        <Column
          className='qtyCells'
          header='Available Quantity'
          field='quantity'
          //body={qtyEditor}
        ></Column>
        <Column
          className='qtyCells'
          header='Check In Quantity'
          field='quantity'
          body={checkInQuantityEditor}
        ></Column>
      </DataTable>
    )
  }
  const onSubmit = (data) => {
    console.log(data)
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
  
  return (
    <div className='w-11 pt-3 m-auto'>
   
      <div className={'w-9 m-auto flex justify-content-start align-items-center'}>
      <button className={style.customButton} onClick={goBack}>
          <span
          className={`pi pi-arrow-circle-left mr-3 ${style.font}`}
          ></span>
      </button>
          <div>             
              <Text type={'heading'}> Check In</Text>
          </div>         
       </div>

       <div className={`card w-9 m-auto mt-4`}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='p-fluid'
            encType='multipart/form-data'
          >
            <div className='w-full flex flex-row justify-content-between'>
                <div className='w-8'>
                  <div className='field w-full mb-3'>
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
                </div>
                <div className='w-3'>
                  <div>
                     <div className='field w-full mb-3'>
                      <label htmlFor='Reason'>Reason *</label>
                      <Controller
                        name='reason'
                        control={control}
                        rules={{ required: 'Please select a reason.' }}
                        render={({ field, fieldState }) => (
                          <>
                            <div className="card w-full flex justify-content-center">
                              <TreeSelect value={field.value} onChange={(e) => field.onChange(e.value)} options={reasons} 
                                className="md:w-15rem w-full" placeholder="Select Reason"></TreeSelect>
                            </div>
                          </>
                        )}
                      />
                     </div>
                  </div>
                  <div className='mt-5'>
                      <div className='field'>
                         <label htmlFor='comment'>Comment *</label>
                          <Controller
                            name='comment'
                            control={control}
                            render={({ field, fieldState }) => (
                              <InputTextarea
                                id={field.name}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
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
            </div>

            <div className='flex justify-content-end gap-2 mt-3 '>
              <div className='flex  '>
                <CustomButton varient='filled' type='submit' label={'Check In'} />
            
              </div>
             </div>
          </form>
        </div>
   
</div>
  )
}

export default CheckIn