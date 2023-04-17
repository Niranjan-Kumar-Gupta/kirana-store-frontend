
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
import { API_GET_PRRODUCTS_WITH_VARIANTS } from '../../api/product.services'
import Loader from '../../components/Loader'
import { API_GET_ORDERS } from '../../api/order.services';
import { useDispatch, useSelector } from "react-redux";

import { Button } from 'primereact/button';

import { updateStocksHistory,updateStocksHistoryCheck } from '../../reducers/stocksHistoryTableSlice'
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import { ReactComponent as Delete } from '../../svg/delete.svg'


const RawMaterialCheckOut = () => {

  const [tableData, setTableData] = useState()
  const toast = useRef(null)
  const [selectedProdId, setSelectedProdId] = useState([])

  const [orderId, setOrderId] = useState([])

  const dispatch = useDispatch();

  // const { 
  //  // loading,
  // } = useSelector((state) => state.stockTable);

  const { 
    loading,
  } = useSelector((state) => state.stocksHistoryTable);


  const loader = () => {
    return <Loader visible={loading} />
  }


  useEffect(()=>{
    const getOrderData = async ()=>{
        const order =  await API_GET_ORDERS(0,100000)
        console.log(order)
        let orderIds = []
        order.rows.forEach(ele => {       
            let data = {
                key: ele.id,
                label: `OrderId ${ele.id} `,
                data: `OrderId ${ele.id} `,
            }
            orderIds.push(data)
        });
        setOrderId(orderIds)
    }
    getOrderData()
   
  },[])


  const [reasons, setReasons] = useState( [
 
    {
        key: 'production',
        label: 'Production',
        data: 'production ',
       
    },
    {
        key: 'correction',
        label: 'Correction',
        data: 'Correction ',
       
    
    }
 ]);
    

  const [selectedReasons, setSelectedReasons] = useState(null);
  const [prodVar, setprodVar] = useState([])

  const getProdVariants = async () => {
    
    try {
      const prodVariants = await API_GET_PRRODUCTS_WITH_VARIANTS(0, 100000)
      console.log(prodVariants)
      setprodVar(prodVariants.rows)
    } catch (error) {
      console.log(error)
    }
  }
useEffect(()=>{
   getProdVariants()
},[])


useEffect(() => {
  const filteredData = getDataByIds(prodVar, selectedProdId)
  setTableData(filteredData)
}, [selectedProdId, prodVar])
  
    const navigate = useNavigate()
    const goBack = () => {
        navigate('/stocks')
      }

      const defaultValues = {
        products: [],
        comment: undefined,
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
        const foundItem = flattenedData.find(
          (item) => item.key == id && ('option1' in item || item.defaultProduct)
        )
        if (foundItem) {
          const existingItem = tableData.find(
            (item) => item.key === foundItem.key
          )
          console.log(foundItem)
          return {
            id: foundItem.id,
            key: foundItem.key,
            url: foundItem.url,
            label: foundItem.label,
            productName: foundItem.productName,
            productId: foundItem.productId ? foundItem.productId : foundItem.id,
            categoryId: foundItem.categoryId,
            price: foundItem.price,
            productVariantId: foundItem.productId ? foundItem.id : null,
            SKUCode: foundItem.SKUCode,
            orderedQuantity: foundItem ? foundItem.quantity : '',
            isDefault: foundItem.defaultProduct ? true : false,
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

  
  const productNameBody = (rowData) => {
    console.log(rowData)
    return (
      <div className='flex flex-column'>
        <div className='mb-1'>
          <Text type={'heading'}>{rowData.productName}</Text>
        </div>
        {!rowData.isDefault ? (
          <Text type={'sub-heading'}>
            {rowData.option1 ? rowData.option1 : ''}
            {rowData.option2 ? ` / ${rowData.option2}` : ''}
            {rowData.option3 ? ` / ${rowData.option3}` : ''}
          </Text>
        ) : (
          ''
        )}
        {rowData.isDefault ? (
          ''
        ) : (
          <Text type={'sub-heading'}> {rowData.label} </Text>
        )}
        
      </div>
    )
  }
  
  const onCellEditComplete = (e, rowIndex) => {
    let _products = [...tableData];
    
    _products[rowIndex].quantity = e.value; 
    setTableData(_products);
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
        <Column header='Products' field='label' body={productNameBody}></Column>
        <Column header='SKU Code' field='SKUCode'></Column>
       
        <Column
          className='qtyCells'
          header='Available Quantity'
          field='orderedQuantity'
          //body={qtyEditor}
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

   let __prodVar = []
   tableData.forEach(ele => {
  
    var __data={
      quantity:ele.checkInQuantity
     }

     if (ele.productVariantId) {
        __data['productVariantId']=ele.productVariantId;
     } else {
      __data['productId']=ele.productId;
     }
     __prodVar.push(__data);

   });

    let finalData = {
      reason:data.reason,  
      comment:data.comment,
      productvariants:__prodVar
     }
     console.log(finalData)
    //  dispatch( updateStocksHistoryCheck (finalData))
    //  .unwrap()
    //  .then((res) => {
          
    //       let Message_Success = 'Check In Successfully '
    //       toast.current.show({ severity: 'success', detail: Message_Success })
    //       setTimeout(() => {
    //         {
    //           goBack()
    //         }
    //       }, 500)
         
    //     })
    //     .catch((err)=>{
    //       console.log(err)
    //       toast.current.show({ severity: 'error', detail: err.message }) 
       
    //     })
     
   
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
        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        onClick={(e) => handleDelete(e, rowData)}
      >
        <Delete />
      </button>
    )
  }

  const itemslist=[{ label: 'Raw Material',url: '/rawMaterial' },{ label: 'Check Out'  }];

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
           {/* <div className={'w-full m-auto flex justify-content-between align-items-center'}>    
                  <div>
                  <div className={'w-full m-auto flex justify-content-start align-items-center'}>
                    <CustomBreadcrumb className='pl-0' itemslist={itemslist}/>
                  </div>
                  </div>
                  <div className='flex gap-2'>
                        <div className='flex '>
                          <Button severity="secondary"  label={'Cancel'} onClick={goBack} /> 
                        </div>
                        <div className='flex '>
                          <CustomButton  varient='filled' type='submit' label={'Check In'} /> 
                        </div>
                  </div>
                
           </div> */}

            <div className='lg:flex lg:flex-row lg:align-items-start lg:justify-content-center lg:gap-3 md:flex md:flex-column md:align-items-center'>
              <div className='lg:w-7 md:w-8 sm:w-full'>
                <div className='bg-white p-3 border-round border-50 mb-3'>
                  <div className='field w-12 lg:w-5'>
                    <label htmlFor='categories'>Products *</label>
                    <Controller
                      name='products'
                      
                      control={control}
                      rules={{ required: 'Please select a product.' }}
                      render={({ field, fieldState }) => (
                        <>
                         <TreeSelect
                            ref={treeSelectRef}
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
                   
                  </div>
                  {tableData && tableData.length !== 0 ? selectedProdTable() : ''}
                </div>
                </div>
                <div className='lg:w-3 md:w-8 sm:w-full bg-white p-3 border-round border-50 mb-3'>
                 
                    <div className=''>
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

export default RawMaterialCheckOut