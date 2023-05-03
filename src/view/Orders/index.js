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
import { Tag } from 'primereact/tag';
import {
  changeSelectedOrder,
  updateMode,
  getOrders,
  resetMode,
  changePage,
  resetSelectedOrder,
  resetToastActionOrder,
} from "../../reducers/orderTableSlice";
import "./style.css"
import { DeleteAlert } from "../../components/Alert/DeleteAlert";

import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import { getBrand } from '../../reducers/productTableSlice'
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
    toastAction
  } = useSelector((state) => state.orderTable);

  const dispatch = useDispatch();

  const navigate = useNavigate()
 
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false)
  const {
   
    brandNames,
   
  } = useSelector((state) => state.productTable);
 

  useEffect(()=>{
    // dispatch(getOrders({page:page,limit:limit}))
    // .unwrap()
    // .catch((err) => {
    //   toast.current.show({ severity: 'error', detail: err.message })
    // })
  },[page,limit])

  const loader = () => {
    return <Loader visible={loading} />
  }

  const toast = useRef(null)

 let statusItems = ['New', 'In Progress', 'Delivered', 'Cancelled', 'Completed']
 let paymentItems = ['Fully Paid', 'Partially Paid', 'Not Paid']
 const statusBodyTemplate = (data) => {
 // console.log(data)
  return <Tag className='__tag' value={data.paymentStatus} severity={getSeverity(data)}></Tag>;
};

 const columns = [
    {field: 'id', header: 'Order Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Id"},
    {field: 'updatedAt', header: 'Date',isFilter:true, isDate: true,filterPlaceholder:"Search by date",filterType :'date'},
    {field: 'customerName', header: 'Customer Name',isFilter:false,filterType:'input',filterPlaceholder:"Search by Customer Name"},
    {field: 'status', header: 'Status',isFilter:true,filterType:'dropdown',dropdownItems:statusItems,filterPlaceholder:"Search by Status"},
    {field: 'paymentStatus', header: 'Payment Status',isBody:true,body:statusBodyTemplate,isFilter:true,filterType:'dropdown',dropdownItems:paymentItems,filterPlaceholder:"Search by Payment Status"},
    {field: 'brandName', header: 'Brand Name',isFilter:true,filterType:'dropdown',dropdownItems:brandNames,filterPlaceholder:"Search by Brand Name"},
  
    {field: 'itemCount', header: 'Items'},
    {field: 'viewDetails', header: '',viewDetails:true},
    {field: 'actions', header: 'Actions',isActions:true,actionType:['delete']}, 
  ];


const getSeverity = (data) => {
  switch (data.paymentStatus) {
      case 'Fully Paid':
          return 'success';

      case 'Partially Paid':
          return 'warning';

      case 'Not Paid':
          return 'danger';

      default:
          return null;
  }
};

const handleEdit = (rowData) => {
  console.log(rowData)
 
};

useEffect(() => {
  dispatch(getBrand())
  if (toastAction === 'add') {
    toast.current.show({
      severity: 'success',
      detail: 'Order Successfully Created',
    })
  } else if (toastAction === 'update') {
    toast.current.show({
      severity: 'success',
      detail: 'Order Successfully Updated',
    })
  } else if (toastAction === 'delete') {
    toast.current.show({
      severity: 'success',
      detail: 'Order Successfully Deleted',
    })
  }
  dispatch(resetToastActionOrder())
},[])

const deleteModule = () => {
  return (
    <DeleteAlert
      item="order"
      displayAlertDelete={displayAlertDelete}
      setDisplayAlertDelete={setDisplayAlertDelete}
      toast={toast}
    />
  );
};


const handleDelete = (rowData) => {
  setDisplayAlertDelete(true)
  dispatch(changeSelectedOrder(rowData))
  
};
const handleOrderSelect = (rowData)=>{
  dispatch(updateMode('update'))
  navigate(`${rowData.id}`)
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

const hanldeCreate = () => {
  navigate('new')
  dispatch(updateMode('create'))
}

const itemslist=[{ label: 'Orders', url: '/orders'  }, ];

  return (
    <div className="w-11 pt-3 m-auto">
      <Toast ref={toast} />
      {displayAlertDelete && deleteModule()}
      {loader()}
      <div className='flex justify-content-between align-items-center'>
        <CustomBreadcrumb className='pl-0' itemslist={itemslist} />
        <CustomButton
          varient='filled'
          label={'Create Order'}
          icon={'pi pi-plus'}
          onClick={hanldeCreate}
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
