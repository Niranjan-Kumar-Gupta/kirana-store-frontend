import React, { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { InputText } from 'primereact/inputtext'
import { CustomButton } from '../../components/CustomButton'
import { classNames } from 'primereact/utils'
import style from './style.module.css'
import { TreeSelect } from 'primereact/treeselect'
import { API_GET_ORDERS } from '../../api/order.services';
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import { Button } from 'primereact/button'

import {
   
    updateStocksHistory,
    
  } from "../../reducers/stocksHistoryTableSlice";
  import Loader from '../../components/Loader';


const StockHistoryEdit = () => {
    const {
        stockHistoryData,
        selectedStockHistory,
        
        page,
        limit,
        loading,
        totalStockHistoryCount,
      } = useSelector((state) => state.stocksHistoryTable);
      const [edit, setEdit] = useState(false)


    const navigate = useNavigate()
    const goBack = () => {
        navigate('/stocks')
      }
      const dispatch = useDispatch();
     
    
      const [orderId, setOrderId] = useState([])

      useEffect(()=>{

        if ( selectedStockHistory.stockType == "Check Out") {
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
        }

      
       
      },[])

      const [reasons, setReasons] = useState(
       
        selectedStockHistory.stockType == "Check Out" ?  [
        {
           // key: 'orderDelivery',
            label: 'Order Delivery',
            //data: 'Order Delivery',
           
            children: []
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
           
        
        }
     ] : [{
        key: 'damaged',
        label: 'Damaged',
        data: 'Damaged ',    
        },
        {
            key: 'correction',
            label: 'Correction',
            data: 'Correction ',
        
        
        }]);
     
    useEffect(()=>{
        // console.log("id",orderId)
        let _reason = [...reasons]
        _reason[0].children = orderId
        setReasons(_reason)
    },[orderId])



    const defaultValues = {
        SKUCode:'',
        product:'',
        quantity: '',
       
        stockType:'',
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

      const onSubmit =  (data) => {
        const __data = {
            id:selectedStockHistory.id,
            data
        }
        console.log(__data)
        dispatch(updateStocksHistory(__data))
        .unwrap()
        .then((res) => {
         goBack()
          
        })
        .catch((err) => {
            
                 })
        
      }
    
  useEffect(() => {
    // console.log(selectedStockHistory)
    if (selectedStockHistory) {
     setValue('SKUCode', selectedStockHistory.SKUCode || '')
      setValue('reason', selectedStockHistory.reason || '')
      setValue('comment', selectedStockHistory.comment || '')
      setValue('product', selectedStockHistory.product || '')
      setValue('quantity', selectedStockHistory.quantity || '') 
      setValue('stockType', selectedStockHistory.stockType || '') 
      //setValue( 'category', selectedStockHistory.category || '') 
         
    }
  }, [])

  const itemslist=[{ label: 'Stock History',url: '/stocks' },{ label: 'Edit'  }];


    
  return (
        <div className='w-11 m-auto mb-6'>
             {loading ? loader() : <></>}
                <div
                  className={`block md:flex md:justify-content-center pt-3 ${style.stickySubNav}`}
                >
              <div className='flex lg:w-10 md:w-8 sm:justify-content-between align-items-center pb-3'>
            <div className='flex align-items-center'>
              <CustomBreadcrumb itemslist={itemslist} />
            </div>
            <div className='w-12 sm:w-5 lg:w-4 hidden sm:block'>
              <div className='flex justify-content-end gap-2'>
                <Button
                  className={`skalebot-button ${style.colored} w-6rem`}
                  onClick={() => navigate('/stocks')}
                >
                  Cancel
                </Button>
                <CustomButton
                  varient='filled w-6rem pl-3'
                  type='submit'
                  onClick={edit? handleSubmit(onSubmit):() => setEdit(true)}
                  label={'Edit'}
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
                            className={classNames({ 'p-invalid': fieldState.invalid })}
                        
                            {...field}
                            />
                        )}
                        />
                        {getFormErrorMessage('SKUCode')}
                              </div>
                    
                             <div className='field  bg-white p-3 border-round border-50 mb-3'>
                        <label htmlFor='product'>product </label>
                        <Controller
                        name='product'
                        control={control}
                        
                        render={({ field, fieldState }) => (
                            <InputText
                            id={field.product}
                            disabled={true}
                            className={classNames({ 'p-invalid': fieldState.invalid })}
                        
                            {...field}
                            />
                        )}
                        />
                        {getFormErrorMessage('product')}
                             </div>
           

                              <div className='field  bg-white p-3 border-round border-50 mb-3'>
                        <label htmlFor='stockType'>stockType</label>
                        <Controller
                        name='stockType'
                        control={control}
                       
                        render={({ field, fieldState }) => (
                            <InputText
                            id={field.stockType}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            disabled={true}
                            className={classNames({ 'p-invalid': fieldState.invalid })}
                            {...field}
                            />
                        )}
                        />
                        {getFormErrorMessage('stockType')}
                             </div>
                          </div>
                         <div className='lg:w-3 md:w-8 sm:w-full bg-white p-3 border-round border-50 mb-3'>
                       
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
                            className={classNames({ 'p-invalid': fieldState.invalid })}
                            {...field}
                            />
                        )}
                        />
                        {getFormErrorMessage('quantity')}
                    </div>

                    <div className='field  bg-white p-2 border-round border-50 mb-3'>
                        <label htmlFor='reason'>Reason</label>
                        <Controller
                        name='reason'
                        control={control}
                       
                        render={({ field, fieldState }) => (
                            <>
                                <div className="card w-full flex justify-content-center">
                                <TreeSelect disabled={!edit} value={field.value} onChange={(e) => field.onChange(e.value)} options={reasons} 
                                    className=" w-full" placeholder="Select Reason"></TreeSelect>
                                </div>
                            </>
                        )}
                        />
                        {getFormErrorMessage('reason')}
                    </div>
                   
                    <div className='field  bg-white p-2 border-round border-50 mb-3'>
                        <label htmlFor=' comment'>comment</label>
                        <Controller
                        name='comment'
                        control={control}
                       
                        render={({ field, fieldState }) => (
                            <InputText
                            id={field.comment}
                            value={field.value}
                            disabled={!edit}
                            onChange={(e) => field.onChange(e.value)}
                            placeholder='Enter your email here'
                            className={classNames({ 'p-invalid': fieldState.invalid })}
                            {...field}
                            />
                        )}
                        />
                        {getFormErrorMessage('email')}
                    </div>
                         </div>
                    </div>             
                  </form>
                </div>

                <div className='sm:w-12 md:w-5 lg:w-4 sm:hidden'>
                      <div className='flex justify-content-center gap-2'>
                        <Button
                        className={`skalebot-button ${style.colored} w-6rem`}
                        onClick={() => navigate('/stocks')}
                        >
                        Cancel
                        </Button>
                        <CustomButton
                        varient='filled w-6rem pl-3'
                        type='submit'
                        onClick={ edit? handleSubmit(onSubmit):() => setEdit(true)}
                        label={'Edit'}
                        />
                    </div>
                
                
                </div>
        </div>
  )
}

export default StockHistoryEdit