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


const StockHistoryEdit = () => {
    const {
        stockHistoryData,
        selectedStockHistory,
        page,
        limit,
        loading,
        totalStockHistoryCount,
      } = useSelector((state) => state.stocksHistoryTable);

    const navigate = useNavigate()
    const goBack = () => {
        navigate('/stocks')
      }
    
      const [orderId, setOrderId] = useState([])

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
     ]);
     
    useEffect(()=>{
        console.log(orderId)
        let _reason = [...reasons]
        _reason[0].children = orderId
        setReasons(_reason)
    },[orderId])



    const defaultValues = {
        SKUCode:'',
        product:'',
        quantity: '',
        category:'',
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

      const onSubmit =  (data) => {
        console.log(data)
        
      }
    
  useEffect(() => {
    console.log(selectedStockHistory)
    if (selectedStockHistory) {
     setValue('SKUCode', selectedStockHistory.SKUCode || '')
        
      setValue('reason', selectedStockHistory.reason || '')
      setValue('comment', selectedStockHistory.comment || '')
      setValue('product', selectedStockHistory.product || '')
      setValue('quantity', selectedStockHistory.quantity || '') 
      setValue('stockType', selectedStockHistory.stockType || '') 
      setValue( 'category', selectedStockHistory.category || '') 
         
    }
  }, [])

    
  return (
        <div className='w-8 pt-3 m-auto'>
             <button className={style.customButton} onClick={goBack}>
                <span
                className={`pi pi-arrow-circle-left mr-3 ${style.font}`}
                ></span>
               </button>
               <div className={`card`}>
                    <form onSubmit={handleSubmit(onSubmit)} className='p-fluid'>
                    <div className='field'>
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
                    
                    <div className='field'>
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
                    <div className='field'>
                        <label htmlFor='category'>category</label>
                        <Controller
                        name='category'
                        control={control}
                       
                        render={({ field, fieldState }) => (
                            <InputText
                            id={field.category}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            disabled={true}
                            className={classNames({ 'p-invalid': fieldState.invalid })}
                            {...field}
                            />
                        )}
                        />
                        {getFormErrorMessage('category')}
                    </div>

                    <div className='field'>
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

                    <div className='field'>
                        <label htmlFor='quantity'>Quantity</label>
                        <Controller
                        name='quantity'
                        control={control}
                       
                        render={({ field, fieldState }) => (
                            <InputText
                            id={field.quantity}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            placeholder='Enter your email here'
                            className={classNames({ 'p-invalid': fieldState.invalid })}
                            {...field}
                            />
                        )}
                        />
                        {getFormErrorMessage('quantity')}
                    </div>

                    <div className='field'>
                        <label htmlFor='reason'>Reason</label>
                        <Controller
                        name='reason'
                        control={control}
                       
                        render={({ field, fieldState }) => (
                            // <InputText
                            // id={field.reason}
                            // value={field.value}
                            // onChange={(e) => field.onChange(e.value)}
                            // placeholder='Enter your email here'
                            // className={classNames({ 'p-invalid': fieldState.invalid })}
                            // {...field}
                            // />
                            <>
                                <div className="card w-full flex justify-content-center">
                                <TreeSelect value={field.value} onChange={(e) => field.onChange(e.value)} options={reasons} 
                                    className=" w-full" placeholder="Select Reason"></TreeSelect>
                                </div>
                            </>
                        )}
                        />
                        {getFormErrorMessage('reason')}
                    </div>
                   
                    <div className='field'>
                        <label htmlFor=' comment'>comment</label>
                        <Controller
                        name='comment'
                        control={control}
                       
                        render={({ field, fieldState }) => (
                            <InputText
                            id={field.comment}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            placeholder='Enter your email here'
                            className={classNames({ 'p-invalid': fieldState.invalid })}
                            {...field}
                            />
                        )}
                        />
                        {getFormErrorMessage('email')}
                    </div>

                    <div className='flex justify-content-end gap-2 mt-3 '>
                        <div className='flex  '>
                            <CustomButton varient='filled' type='submit' label={'Edit'} />
                        
                        </div>
                    </div>
                    </form>
                </div>
        </div>
  )
}

export default StockHistoryEdit