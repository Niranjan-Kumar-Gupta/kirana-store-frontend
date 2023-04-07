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

import { updateStocksHistory } from '../../reducers/stocksHistoryTableSlice'
import CustomBreadcrumb from '../../components/CustomBreadcrumb'



const CheckIn = () => {

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
  console.log(tableData)
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
          (item) => item.key == id && 'option1' in item
        )
        if (foundItem) {
          return {
            id: foundItem.id,
            key: foundItem.key,
            label: foundItem.label,
            productName: foundItem.productName,
            productId: foundItem.productId,
            categoryId: foundItem.categoryId,
            productVariantId: foundItem.id,
            SKUCode: foundItem.SKUCode,
            quantity:foundItem.quantity,
            orderedQuantity: '',
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
        <Column header='SKU Code' field='SKUCode'></Column>
       
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
    console.log(data,tableData)
   // let isQtyEmpty = false;
    // tableData.forEach((prod) => {
    //   if (!prod.quantity || prod.quantity === "") {
    //     toast.current.show({ severity: 'error', detail: `${prod.label} quantity is empty` }) 
    //     isQtyEmpty = true
    //   }
    // })
    // if (!isQtyEmpty) {
    //   data.productOrdered = tableData;
    //   setTableData([])
    //   reset()
    //   console.log(data)
    // }


    
   let __prodVar = []
   tableData.forEach(ele => {
     const __data = {
      productVariantId:ele.productVariantId,
      quantity:ele.checkInQuantity
     }
     __prodVar.push(__data)
   });

    
    let finalData = {
      reason:data.reason,  
      comment:data.comment,
      productvariants:__prodVar
     }
     console.log(finalData)
     dispatch( updateStocksHistory (finalData))
     .unwrap()
     .then((res) => {
          
          let Message_Success = 'Check Out Successfully '
          toast.current.show({ severity: 'success', detail: Message_Success })
          goBack()
        })
        .catch((err)=>{
          console.log(err)
          toast.current.show({ severity: 'error', detail: err.message }) 
       
        })
     
   
  }
  const itemslist=[{ label: 'Stocks',url: '/stocks' },{ label: 'Check In'  }];

  return (
    <div className='w-11 pt-3 m-auto'>
     <Toast ref={toast} />
      

       <div className={`card w-9 m-auto mt-4`}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='p-fluid'
            encType='multipart/form-data'
          >
           <div className={'w-full m-auto flex justify-content-between align-items-center'}>    
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
                
           </div>

            <div className='w-full gap-2 mt-3 flex flex-row justify-content-between'>
                <div className='w-8'>
                  <div className='field bg-white p-3 border-solid border-1 border-gray-300 border-round border-50 w-full mb-3'>
                    <label htmlFor='categories'>Products *</label>
                    <Controller
                      name='products'
                      control={control}
                      rules={{ required: 'Please select a product.' }}
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
                 <div className='w-4 bg-white p-3 border-solid border-1 border-gray-300 border-round border-50'>
                    <div>
                      <div className='field mb-3'>
                      <label htmlFor='Reason'>Reason *</label>
                      <Controller
                        name='reason'
                        control={control}
                        rules={{ required: 'Please select a reason.' }}
                        render={({ field, fieldState }) => (
                          <>
                          <div className="card w-full flex justify-content-center">
                            <TreeSelect value={field.value} onChange={(e) => {field.onChange(e.value)
                                                                               
                                                                               }} options={reasons} 
                              className=" w-full __reason" placeholder="Select Reason"></TreeSelect>
                          </div>
                        </>
                        )}
                      />
                      </div>
                    </div>
                    <div className='mt-5'>
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

export default CheckIn