import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import CustomSwitch from "../../components/CustomSwitch";
import StocksTable from './StocksTable';
import StockHistoryTable from './StockHistoryTable';
import { CustomButton } from "../../components/CustomButton";
import { useNavigate } from 'react-router-dom'

export const Stocks = () => {

  const switchButtons = [
    { name: "Current Stock", value: "stock" },
    { name: "Stock History", value: "stockHistory" },
  ];
  const navigate = useNavigate()
 


const [table, setTable] = useState('stock')
  
  const handleSwitch = (item) => {
  //  console.log(item);
    setTable(item)
  };

  
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

  const renderTable = (table) => {
    switch (table) {
      case "stock":
        return <StocksTable />;
      case "stockHistory":
        return <StockHistoryTable />;
    }
  };

  const onClickCheckInAndOut = (page) => {
   
    switch (page) {
      case "checkIn":   
        navigate("checkIn");
        break
      case "checkOut":
        navigate("checkOut");
        break
    }
  };


  

    return (
      <div className="w-11 pt-3 m-auto"> 
         <div className="flex mt-4 justify-content-between align-items-center gap-2">
          <CustomSwitch
                options={switchButtons}
                value={table}
                handleSwitch={handleSwitch}
              />
           <div className="flex  justify-content-center align-items-center gap-3" >
              <CustomButton
                varient="filled"
                label={"Check In"}          
                onClick={()=>{onClickCheckInAndOut('checkIn')}}
              />
              <CustomButton
                varient="filled"
                label={"Check Out"}
                onClick={()=>{onClickCheckInAndOut('checkOut')}}   
              />
           </div>  
         
         </div>
          {renderTable(table)}

      </div>
    );
  };
  