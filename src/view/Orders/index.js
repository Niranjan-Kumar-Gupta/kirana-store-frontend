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

  const navigate = useNavigate()
  const ids = [1, 2, 3, 4, 5, 6, 7, 8];

  // const loading = false;
  const [showOrderForm, setShowOrderForm] = useState(false)

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

  

  const [orders, setOrders] = useState([
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
    {
        id: '1001',
        code: 'nvklal433',
        name: 'Black Watch',
        description: 'Product Description',
        image: 'black-watch.jpg',
        price: 72,
        category: 'Accessories',
        quantity: 61,
        inventoryStatus: 'INSTOCK',
        rating: 4
    },
    {
        id: '1002',
        code: 'zz21cz3c1',
        name: 'Blue Band',
        description: 'Product Description',
        image: 'blue-band.jpg',
        price: 79,
        category: 'Fitness',
        quantity: 2,
        inventoryStatus: 'LOWSTOCK',
        rating: 3
    },
    {
        id: '1003',
        code: '244wgerg2',
        name: 'Blue T-Shirt',
        description: 'Product Description',
        image: 'blue-t-shirt.jpg',
        price: 29,
        category: 'Clothing',
        quantity: 25,
        inventoryStatus: 'INSTOCK',
        rating: 5
    },
]
 );

 let items = ['New','In Progress','Done']
 const columns = [
    {field: 'id', header: 'id',isFilter:true,filterType:'input',filterPlaceholder:"Search by Id"},
    {field: 'name', header: 'Name',isFilter:true,filterType:'input',filterPlaceholder:"Search by Name"},
    {field: 'category', header: 'Category',isFilter:true,filterType:'dropdown',dropdownItems:items,filterPlaceholder:"Search by catogery"},
    {field: 'price', header: 'Price',isFilter:false,filterPlaceholder:"Search by Price"},
    {field: 'rating', header: 'Rating',isFilter:false,filterPlaceholder:"Search by Rating"},
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
      <h4>Order List</h4>
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
      <div className='flex flex-wrap gap-2 mt-2'>
        {ids.map((id) => (
          <div
            onClick={() => navigate(`orderDetails/${id}`)}
            className={'products flex justify-content-center align-items-center'}
            key={id}
          >
            <Text type={'heading'}>Order {id}</Text>
          </div>
        ))}
      </div>
      <CustomTable 
        tableName={'orderTable'}
        data={orders}
        columns={columns} 
        globalSearch={false}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleSelect={handleOrderSelect}
        onApplyFilter={onApplyFilter}
        onApplySearch={onApplySearch}
        onClearFilter={onClearFilter}
        onClearSearch={onClearSearch}
        tableType={'dataTable'}
        paginator={{page:page,limit:limit,totalRecords:30,changePage:changePage}}
      />  
    
    </div>
  );
};

export default Orders;
