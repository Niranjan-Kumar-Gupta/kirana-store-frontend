import React, { useEffect, useState, useRef } from "react";
import CustomTable from "../../components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import * as Messag from "../../config/ToastMessage";
import Loader from "../../components/Loader";
import { Text } from "../../components/Text";
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
import { Toast } from "primereact/toast";
import "./style.css";
import { API_GET_ORDERS } from "../../api/order.services";
import { underlineStyle } from "../../utils/commonStyles";
import { getCompany, setCompany } from '../../reducers/companySlice'

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

  const toast = useRef(null);
  const modalLoad = () => {
    return <Loader visible={loading} />;
  };

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
      <h4>Order List</h4>
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
        paginator={{page:page,limit:limit,totalRecords:30,changePage:changePage}}
      />  
    
    </div>
  );
};

export default Orders;
