import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import Loader from '../../components/Loader'

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
          {field: 'url', header: 'image',isFilter:false,isImageBody:true,imageBodyType:'carousel'},   
     
          { field: 'productName',header: 'Product Name',isBody:true,body:productBodyTemp,isFilter:false,filterPlaceholder:"Search by code"},     
          { field: 'SKUCode',header: 'SKU Code',isFilter:false,filterPlaceholder:"Search by code"},
           
          {field: 'desc', header: 'Description',isFilter:false,filterPlaceholder:"Search by catogery"},     
          
          {field: 'updatedAt', header: 'Date',isDate:true,isFilter:false,filterPlaceholder:"Search by catogery"},     
          
          {field: 'quantity', header: 'Available Quantity',isFilter:false,filterPlaceholder:"Search by catogery"},     
       
         ];
    
  function productBodyTemp(rowData) {
      console.log(rowData)
      return (
        <div className='flex flex-column'>
          <div className='mb-1'>
            <Text type={'heading'}>{rowData.productName}</Text>
          </div>        
            <Text type={'sub-heading'}>
              {rowData.option1 ? rowData.option1 : ''}
              {rowData.option2 ? ` / ${rowData.option2}` : ''}
              {rowData.option3 ? ` / ${rowData.option3}` : ''}
            </Text>
        </div>
      )
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

  const loader = () => {
    return <Loader visible={loading} />
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
         {loading ? loader() : <></>}
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