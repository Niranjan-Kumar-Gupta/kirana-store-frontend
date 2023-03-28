import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";

export const Stocks = () => {


  const [products, setProducts] = useState([
    {
        id: '1000',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        avilable: 24,
        inventoryStatus: 'INSTOCK',
        onHold: 5,
        date: '2015-09-13',
        url:['https://picsum.photos/320/180','https://picsum.photos/330/190','https://picsum.photos/300/170']
    },
    {
        id: '1001',
        code: 'nvklal433',
        name: 'Black Watch',
        description: 'Product Description',
        image: 'black-watch.jpg',
        price: 72,
        category: 'Accessories',
        avilable: 61,
        inventoryStatus: 'INSTOCK',
        onHold: 4,
        date: '2015-09-07',
        url:'https://picsum.photos/300/180'
    },
    {
        id: '1002',
        code: 'zz21cz3c1',
        name: 'Blue Band',
        description: 'Product Description',
        image: 'blue-band.jpg',
        price: 79,
        category: 'Fitness',
        avilable: 2,
        inventoryStatus: 'LOWSTOCK',
        onHold: 3,
        date: '2015-09-01',
        url:['https://picsum.photos/300/180','https://picsum.photos/300/190','https://picsum.photos/300/170']
    },
    {
        id: '1003',
        code: '244wgerg2',
        name: 'Blue T-Shirt',
        description: 'Product Description',
        image: 'blue-t-shirt.jpg',
        price: 29,
        category: 'Clothing',
        avilable: 25,
        inventoryStatus: 'INSTOCK',
        onHold: 5,
        date: '2015-09-13',
    },
]
 );

 let items = ['New','In Progress','Done']
 const columns = [
      {field: 'url', header: 'Product',isFilter:false,isImageBody:true,imageBodyType:'carousel'},  
   
       {
        field: 'code',
        header: 'SKU Code',
       // isFilter:true,
        filterPlaceholder:"Search by code"
      },
    {field: 'name', header: 'Name',isFilter:true,filterType:'input',filterPlaceholder:"Search by Name"},
    {field: 'price', header: 'Size',},  
    {field: 'category', header: 'Category',isFilter:true,filterType:'dropdown',dropdownItems:items,filterPlaceholder:"Search by catogery"},
   
    {field: 'avilable', header: 'Avilable',isFilter:false,filterType:'input',filterPlaceholder:"Search by avilable"},
    {field: 'onHold', header: 'On Hand',bodyType:'numberInput'},
   
  ];

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
         <h1>Stocks</h1>
         <div className="">
               <CustomTable 
                  tableName={'productTable'}
                  data={products}
                  columns={columns}
                  globalSearch={true}
                  onApplyFilter={onApplyFilter}
                  onApplySearch={onApplySearch}
                  onClearFilter={onClearFilter}
                  onClearSearch={onClearSearch}
                  paginator={{page:0,limit:5,totalRecords:10,changePage:()=>{}}}
                />       
            </div>
      
      </div>
    );
  };
  