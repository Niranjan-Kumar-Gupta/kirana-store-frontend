import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';

const StockHistoryTable = () => {

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
            onHold: 0,
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
            onHold: 0,
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
            onHold: 0,
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
            onHold: 0,
            date: '2015-09-13',
        },
    ]
     );
    
     let items = ['New','In Progress','Done']
     const columns = [
          {field: 'date', header: 'Date',isFilter:false,filterType:'date',filterPlaceholder:"Search by Date"},
   
          {field: 'url', header: 'Image',isFilter:false,isImageBody:true,imageBodyType:'carousel'},  
          {field: 'name', header: 'Product',isFilter:true,filterType:'input',filterPlaceholder:"Search by Name"},
     
           
          {
            field: 'code',
            header: 'SKU Code',
           // isFilter:true,
            filterPlaceholder:"Search by code"
          },
          
        {field: 'category', header: 'Category',isFilter:true,filterType:'dropdown',dropdownItems:items,filterPlaceholder:"Search by catogery"},
        
        {field: 'stockType', header: 'Stock Type',isFilter:true,filterType:'dropdown',dropdownItems:items,filterPlaceholder:"Search by catogery"},
       
        {field: 'avilable', header: 'Quantity',isFilter:false,filterType:'input',filterPlaceholder:"Search by avilable"},
        {field: 'reason', header: 'Reason',isFilter:false,filterType:'input',filterPlaceholder:"Search by avilable"},
        {field: 'comment', header: 'Comment',isFilter:false,filterType:'input',filterPlaceholder:"Search by avilable"},
        {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']}, 
  
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
  const onEditNumberInput = (data)=>{
    console.log(data)
    products.forEach(ele => {
       if (data.id===ele.id) {
         ele.avilable += data.onHold
       }
    });
    }

    
  return (
    <div className='w-full pt-3 m-auto'>
         <div className="mt-2">
               <CustomTable 
                  tableName={'productTable'}
                  data={products}
                  columns={columns}
                  globalSearch={true}
                  onApplyFilter={onApplyFilter}
                  onApplySearch={onApplySearch}
                  onClearFilter={onClearFilter}
                  onClearSearch={onClearSearch}
                  onEditNumberInput={onEditNumberInput}
                  paginator={{page:0,limit:5,totalRecords:10,changePage:()=>{}}}
                />       
            </div>
      
    </div>
  )
}

export default StockHistoryTable