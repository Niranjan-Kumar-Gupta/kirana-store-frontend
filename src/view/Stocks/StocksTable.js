import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';

import {
  getStocks,
  changeMode,
  resetMode,
  changeSelectedStock,
  resetSelectedStock,
  changePage,
} from "../../reducers/stocksTableSlice";

import { useDispatch, useSelector } from "react-redux";

const StocksTable = () => {

  const {
    stockData,
    page,
    limit,
    loading,
    totalStockCount,
  } = useSelector((state) => state.stockTable);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getStocks({page:page,limit:limit}))
    .unwrap()
    .catch(()=>{ 
      //console.log(stockData)

    }) 
    console.log(stockData)

  },[page,limit])


     const columns = [
          {field: 'id', header: 'Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},    
          { field: 'productName',header: 'Product Name',isFilter:false,filterPlaceholder:"Search by code"},     
          { field: 'SKUCode',header: 'SKU Code',isFilter:false,filterPlaceholder:"Search by code"},
           
          {field: 'desc', header: 'Description',isFilter:false,filterPlaceholder:"Search by catogery"},     
          
          {field: 'updatedAt', header: 'Date',isFilter:false,filterPlaceholder:"Search by catogery"},     
          
          {field: 'quantity', header: 'Quantity',isFilter:false,filterPlaceholder:"Search by catogery"},     
       
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
  // const onEditNumberInput = (data)=>{
  //   console.log(data)
  //   products.forEach(ele => {
  //      if (data.id===ele.id) {
  //        ele.avilable += data.onHold
  //      }
  //   });
  //   }


  return (
    <div className='w-full pt-3 m-auto'>
         <div className="mt-2">
               <CustomTable 
                  tableName={'stockTable'}
                  data={stockData}
                  columns={columns}
                  globalSearch={true}
                  onApplyFilter={onApplyFilter}
                  onApplySearch={onApplySearch}
                  onClearFilter={onClearFilter}
                  onClearSearch={onClearSearch}
                  dispatchFunction={getStocks}
                  //onEditNumberInput={onEditNumberInput}
                  paginator={{page:page,limit:limit,totalRecords:totalStockCount,changePage:changePage}}
                />       
            </div>
      
    </div>
  )
}

export default StocksTable