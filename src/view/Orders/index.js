import React, { useEffect, useState, useRef } from "react";
import CustomTable from "../../components/CustomTable";

const Orders = () => {

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
];

const handleEdit = (product) => {
  console.log(product)
 
};
const handleDelete = (product) => {
  console.log(product)
 
};

  return (
    <div className="w-11 pt-3 m-auto">
      <h4>Order List</h4>
      <CustomTable data={orders} columns={columns}  handleEdit={handleEdit} handleDelete={handleDelete}/>
    </div>
  );
};

export default Orders;
