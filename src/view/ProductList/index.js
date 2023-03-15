import React, { useState, useEffect, useRef } from "react";
import CustomTable from "../../components/CustomTable";
import "./index.css";
import { DeleteAlert } from "../../components/Alert/DeleteAlert";
import { Toast } from "primereact/toast";



const ProductList = () => {

  const [displayAlertDelete, setDisplayAlertDelete] = useState(false);

  const toast = useRef(null);

  const [products, setProducts] = useState([
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
       {
        field: 'code',
        header: 'Code',
        isFilter:true,
        filterType:'dropdown',
        dropdownItems:items,
        filterPlaceholder:"Search by code"
      },
    {field: 'name', header: 'Name',isFilter:true,filterType:'input',filterPlaceholder:"Search by Name"},
    {field: 'category', header: 'Category',isFilter:true,filterType:'dropdown',dropdownItems:items,filterPlaceholder:"Search by catogery"},
    {field: 'quantity', header: 'Quantity',isFilter:true,filterType:'input',filterPlaceholder:"Search by Quantity"},
    {field: 'rating', header: 'Rating',isFilter:true,filterType:'input',filterPlaceholder:"Search by Name"},
  ];


  const deleteModule = () => {
    return (
      <DeleteAlert
        item="product"
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    );
  };

  const handleEdit = (product) => {
    console.log(product)
    // dispatch(changeMode("update"));
    // dispatch(changeSelectedProduct(product));
    // setDisplayAddProductModule(true);
  };
  const handleDelete = (product) => {
    console.log(product)
    //setMessage(product)
    // dispatch(changeMode("delete"));
    // dispatch(changeSelectedProduct(product));
     setDisplayAlertDelete(true);
  };

  return (
    <div className="w-11 pt-3 m-auto">
        <h4>Product List</h4>
        <div className="card my-3">
            {displayAlertDelete && deleteModule()}
           <CustomTable data={products} columns={columns} handleEdit={handleEdit} handleDelete={handleDelete}/>       
        </div>
    </div>
  );
};

export default ProductList;
