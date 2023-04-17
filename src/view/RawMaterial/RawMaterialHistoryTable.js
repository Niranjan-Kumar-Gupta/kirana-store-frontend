import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import Loader from '../../components/Loader'
import { useDispatch, useSelector } from "react-redux";
import {
  getStocks,
  changeMode,
  resetMode,
  changeSelectedStock,
  resetSelectedStock,
  changePage,
} from "../../reducers/stocksTableSlice";


const RawMaterialHistoryTable = () => {

  
  const {
    stockData,
    page,
    limit,
    loading,
    totalStockCount,
  } = useSelector((state) => state.stockTable);
  const columns = [

    {field: 'updatedAt', header: 'Date',isDate:true,isFilter:false,filterPlaceholder:""},     
  
    {field: 'rawMaterial', header: 'Raw Material',isFilter:false,filterPlaceholder:""},     
    
    { field: 'productName',header: 'Product',isFilter:false,filterPlaceholder:""},     
     
    {field: 'venderName', header: 'Vender Name',isFilter:false,filterPlaceholder:""},     
    
     
    {field: 'quantity', header: 'Quantity(kg)',isFilter:false,filterPlaceholder:""},     
 
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

  const loader = () => {
    return <Loader visible={loading} />
  }

  
  return (
    <div className='w-full pt-3 m-auto'>
    {loading ? loader() : <></>}
    <div className="mt-2">
          <CustomTable 
             tableName={'rawMatHISTable'}
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

export default RawMaterialHistoryTable