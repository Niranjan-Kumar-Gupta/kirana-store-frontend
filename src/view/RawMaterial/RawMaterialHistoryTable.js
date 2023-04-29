import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import Loader from '../../components/Loader'
import { useDispatch, useSelector } from "react-redux";
import {
  getRawMaterialHistory,
  changeMode,
  resetMode,
  changeSelectedRawMaterial,
  resetSelectedRawMaterial,
  changePage,
} from "../../reducers/rawMaterialHistoryTableSlice";


const RawMaterialHistoryTable = () => {

  
  const {
    rawMaterialHistoryData,
    page,
    limit,
    loading,
    totalRawMaterialHistoryCount,
  } = useSelector((state) => state.rawMaterialHistoryTable);
  const {
    brandNames, 
  } = useSelector((state) => state.productTable);
 



  const quntBody = (rowData)=>{
    // console.log(rowData.quantity)
     return (
       <div className='flex flex-row'>        
           <Text type={'sub-heading'}>
             {rowData.quantity }
             {rowData.materialType ? ` ${rowData.materialType}` : ''}
 
           </Text>
       </div>
     )
   }
   const rawTypeItems = ['CHECK IN','CHECK OUT']
     
  const columns = [

    {field: 'updatedAt', header: 'Date',isDate:true,isFilter:true,filterPlaceholder:"Search by date",filterType :'date'},     
  
    {field: 'materialName', header: 'Raw Material',isFilter:false,filterPlaceholder:""},     
    
    //{ field: 'productName',header: 'Product',isFilter:false,filterPlaceholder:""},     
     
    //{field: 'vendorName', header: 'Vender Name',isFilter:false,filterPlaceholder:""},     
    {field: 'flag', header: 'stockType',isFilter:true,filterType:'dropdown',dropdownItems:rawTypeItems,filterPlaceholder:"Search by Stock Type"},     
    
    {field: 'brandName', header: 'Brand Name',isFilter:true,filterType:'dropdown',dropdownItems:brandNames,filterPlaceholder:"Search by Brand Name"},     
      
    {field: 'quantity', header: 'Quantity',isFilter:false,isBody:true,body:quntBody,filterPlaceholder:""},     
 
    {field: 'reason', header: 'Comment',isFilter:false,filterPlaceholder:""},     
    
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
             data={rawMaterialHistoryData}
             columns={columns}
             globalSearch={true}
             onApplyFilter={onApplyFilter}
             onApplySearch={onApplySearch}
             onClearFilter={onClearFilter}
             onClearSearch={onClearSearch}
             dispatchFunction={getRawMaterialHistory}
             //onEditNumberInput={onEditNumberInput}
             paginator={{page:page,limit:limit,totalRecords:totalRawMaterialHistoryCount,changePage:changePage}}
           />       
       </div>
 
</div>
  )
}

export default RawMaterialHistoryTable