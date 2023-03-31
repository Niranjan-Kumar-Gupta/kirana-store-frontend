import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Text } from '../../components/Text'
import { OrderForm } from '../../components/Forms/OrderForm'
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
import CustomTable from '../../components/CustomTable'
import { useDispatch, useSelector } from "react-redux";
import * as Messag from "../../config/ToastMessage";
import {
  changeSelectedOrder,
  updateMode,
  getOrders,
  resetMode,
  updateOrder,
  changePage,
  resetSelectedOrder,
  updateSelectedOrdersList,
  resetSelectedOrdersList,
} from "../../reducers/orderTableSlice";
import "./style.css";
// import { API_GET_ORDERS } from "../../api/order.services";
// import { underlineStyle } from "../../utils/commonStyles";
// import { getCompany, setCompany } from '../../reducers/companySlice'

const Orders = () => {

    
  const {
    orderData,
    loading,
    mode,
    page,
    limit,
    selectedOrder,
    totalOrderCount,
    selectedOrderId,
    selectedOrderProducts,
    selectedOrdersList,
  } = useSelector((state) => state.orderTable);

  const dispatch = useDispatch();

  const navigate = useNavigate()
 
  const [showOrderForm, setShowOrderForm] = useState(false)

  useEffect(()=>{
    dispatch(getOrders({page:page,limit:limit}))
    .unwrap()
    .catch(()=>{ 
      //console.log('kl..............',orderData)

    }) 
    //console.log('kl..............',orderData)
  },[page,limit])

  const onAddNewClick = () => {
    setShowOrderForm(true)
  }

  const onHide = () => {
    setShowOrderForm(false)
  }

  const loader = () => {
    return <Loader visible={loading} />
  }

  const toast = useRef(null)

  const orderModal = () => {
    return (
      <OrderForm
        onHide = {onHide}
        showOrderForm={showOrderForm}
        toast={toast}
      />
    )
  }


 let statusItems = ['New','In Progress','Done']
 let paymentItems = ['Done','Due']
 const columns = [
    {field: 'id', header: 'id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Id"},
    {field: 'name', header: 'Name',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},
    {field: 'paymentStatus', header: 'Payment Status',isFilter:true,filterType:'dropdown',dropdownItems:paymentItems,filterPlaceholder:"Search by Payment Status"},
    {field: 'status', header: 'Status',isFilter:true,filterType:'dropdown',dropdownItems:statusItems,filterPlaceholder:"Search by Status"},
    {field: 'totalAmount', header: 'Total amount',isFilter:false,filterPlaceholder:"Search by Rating"},
    {field: 'updatedAt', header: 'Date',isDate:true,isFilter:false,filterType:'date',filterPlaceholder:"Search by type"},

    {field: 'previewUrl', header: 'image',isFilter:false,isImageBody:true,imageBodyType:'carousel'},   
   
    {field: 'viewDetails', header: '',viewDetails:true},
  ];

const handleEdit = (rowData) => {
  console.log(rowData)
 
};
const handleDelete = (rowData) => {
  console.log('order edit',rowData)
 
};
const handleOrderSelect = (rowData)=>{
  navigate(`orderDetails/${rowData.id}`)
  console.log('order view detail',rowData)
}

const onApplyFilter = (data)=>{
  console.log(data)
}
const onApplySearch = (data)=>{
console.log(data)
}
const onClearFilter = (data)=>{
  console.log(data)
}
const onClearSearch = (data)=>{
console.log(data)
}



  return (
    <div className="w-11 pt-3 m-auto">
      <Toast ref={toast} />
      {showOrderForm ? orderModal() : <></>}
      {loader ? loader() : <></>}
      <div className='flex justify-content-between align-items-center'>
        <Text type='heading'>Orders</Text>
        <CustomButton
          varient='filled'
          label={'Create Order'}
          icon={'pi pi-plus'}
          onClick={() => navigate(`./create`)}
        />
      </div>
      {/* <div className='flex flex-wrap gap-2 mt-2'>
        {ids.map((id) => (
          <div
            onClick={() => navigate(`orderDetails/${id}`)}
            className={'products flex justify-content-center align-items-center'}
            key={id}
          >
            <Text type={'heading'}>Order {id}</Text>
          </div>
        ))}
      </div> */}
      <div className='mt-2'>
      <CustomTable 
        tableName={'orderTable'}
        data={orderData}
        columns={columns} 
        globalSearch={true}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleSelect={handleOrderSelect}
        onApplyFilter={onApplyFilter}
        onApplySearch={onApplySearch}
        onClearFilter={onClearFilter}
        onClearSearch={onClearSearch}
        dispatchFunction={getOrders}
        tableType={'dataTable'}
        paginator={{page:page,limit:limit,totalRecords:totalOrderCount,changePage:changePage}}
      />  
      </div>
    
    </div>
  );
};

export default Orders;
