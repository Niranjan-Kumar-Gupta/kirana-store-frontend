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


const RawMaterialTable = () => {
  
  const {
    stockData,
    page,
    limit,
    loading,
    totalStockCount,
  } = useSelector((state) => state.stockTable);
  const columns = [
   {field: 'id', header: 'Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},    
    {field: 'url', header: 'image',isFilter:false,isImageBody:true,imageBodyType:'carousel'},   

    
    {field: 'rawMaterial', header: 'Raw Material',isFilter:false,filterPlaceholder:"Search by catogery"},     
    
     
    {field: 'quantity', header: 'Available Quantity(kg)',isFilter:false,filterPlaceholder:"Search by catogery"},     
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
  const handleEdit = (data) => {
    console.log('raw material  edit',data)
    
 };

 const handleDelete = (data) => {
   console.log('raw material  del',data)
   
 };


  const loader = () => {
    return <Loader visible={loading} />
  }

  
  return (
    <div className='w-full pt-3 m-auto'>
    {loading ? loader() : <></>}
    <div className="mt-2">
          <CustomTable 
             tableName={'rawMatTable'}
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

export default RawMaterialTable