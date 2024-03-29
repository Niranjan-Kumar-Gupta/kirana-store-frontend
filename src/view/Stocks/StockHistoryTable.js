import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import { Toast } from 'primereact/toast';
import Loader from '../../components/Loader';

import {
  getStocksHistory,
  deleteStocksHistory,
  changeMode,
  resetMode,
  changeSelectedStockHistory,
  resetSelectedStockHistory,
  changePage,
} from "../../reducers/stocksHistoryTableSlice";
import { useDispatch, useSelector } from "react-redux";
import { DeleteAlert } from "../../components/Alert/DeleteAlert";
import { useNavigate, useParams } from 'react-router-dom'
import { getBrand } from '../../reducers/productTableSlice';


const StockHistoryTable = () => {
  const navigate = useNavigate()
  const toast = useRef(null)
  
  const {
    stockHistoryData,
    selectedStockHistory,
    
    page,
    limit,
    loading,
    totalStockHistoryCount,
  } = useSelector((state) => state.stocksHistoryTable);
  const { brandNames } = useSelector((state) => state.productTable);

  const [displayAlertDelete, setDisplayAlertDelete] = useState(false);

  const deleteModule = () => {
    return (
      <DeleteAlert
        item="stockHistory"
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    );
  };

 


  const [stockHistoryTable,setStockHistoryTable] = useState([])
  
  useEffect(()=>{
    dispatch(getBrand())
  },[]);


  useEffect(()=>{
    let data = []
    stockHistoryData.forEach(ele => {
       let _data = {
           id:ele.id,
           product:ele.productvariants.productName,
           SKUCode:ele.productvariants.SKUCode,
           url:ele.productvariants.url,
           quantity:ele.quantity,
           option1:ele.productvariants.option1,
           option2:ele.productvariants.option2,
           option3:ele.productvariants.option3,
           stockType:ele.stockType,
           updatedAt:ele.updatedAt,
           reason:ele.reason,
           flag:ele.flag,
           brandName:ele.productvariants.brandName,
           comment:ele.comment
       }
       data.push(_data)
    });
    setStockHistoryTable(data)
    
  },[stockHistoryData])

  const dispatch = useDispatch();


   const stockTypeItems = ['Check In','Check Out']
     
     const columns = [
      {field: 'updatedAt', header: 'Date',isDate:true,isFilter:true,filterPlaceholder:"Search by date",filterType :'date'},     
     
      {field: 'id', header: 'Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},    
      //{field: 'previewUrl', header: 'image',isFilter:false,isImageBody:true,imageBodyType:'carousel'},   
     
      { field: 'product',header: 'Product',isBody:true,body:productBodyTemp,isFilter:false,filterPlaceholder:"Search by code"},     
       
      {field: 'SKUCode', header: 'SKUCode',isFilter:false,filterPlaceholder:"Search by catogery"},     
      
      {field: 'brandName', header: 'Brand Name',isFilter:true,filterType:'dropdown',dropdownItems:brandNames,filterPlaceholder:"Search by Brand Name"},     
          
      {field: 'flag', header: 'stockType',isFilter:true,filterType:'dropdown',dropdownItems:stockTypeItems,filterPlaceholder:"Search by Stock Type"},     
      {field: 'quantity', header: 'Quantity',isFilter:false,filterPlaceholder:"Search by catogery"},     
     
      {field: 'reason', header: 'Reason',isFilter:false,filterPlaceholder:"Search by catogery"},     
      {field: 'comment', header: 'comment',isFilter:false,filterPlaceholder:"Search by catogery"},     
     
      
      {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']}, 
 
     ];

     function productBodyTemp(rowData) {
      return (
        <div className='flex flex-column'>
          <div className='mb-1'>
            <Text type={'heading'}>{rowData.product}</Text>
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
    
  }
  const onApplySearch = (data)=>{
    
  }
  
  const onClearFilter = (data)=>{
    
  }

  const onClearSearch = (data)=>{
  
  }

  const handleEdit = (data) => {
    navigate(`${data.id}`) 
    dispatch(changeMode('update'))
 };

 const handleDelete = (data) => {
   dispatch(changeSelectedStockHistory(data))
   setDisplayAlertDelete(true);
 };

 const loader = () => {
  return <Loader visible={loading} />
}


    
  return (
    <div className='w-full pt-3 m-auto'>
      <Toast ref={toast} />
        {displayAlertDelete && deleteModule()}
        {loading ? loader() : <></>}
         <div className="mt-2">
               <CustomTable 
                  tableName={'productTable'}
                  data={stockHistoryTable}
                  columns={columns}
                  globalSearch={true}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  onApplyFilter={onApplyFilter}
                  onApplySearch={onApplySearch}
                  onClearFilter={onClearFilter}
                  onClearSearch={onClearSearch}
                  dispatchFunction={getStocksHistory}
                  //onEditNumberInput={onEditNumberInput}
                  paginator={{page:page,limit:limit,totalRecords:totalStockHistoryCount,changePage:changePage}}
                />       
            </div>
      
    </div>
  )
}

export default StockHistoryTable