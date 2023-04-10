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
    console.log(page,limit)
    dispatch(getStocksHistory({page:page,limit:limit}))
    .unwrap()
    .then(()=>{ 

    }) 
    console.log(stockHistoryData)
  },[page,limit])

  useEffect(()=>{

  },[])

  useEffect(()=>{

    console.log(stockHistoryData)
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
           comment:ele.comment
       }
       data.push(_data)
    });
    setStockHistoryTable(data)
    console.log(data)
  },[stockHistoryData])

  const dispatch = useDispatch();
     
     const columns = [
      {field: 'updatedAt', header: 'Date',isDate:true,isFilter:false,filterPlaceholder:"Search by catogery"},     
     
      {field: 'id', header: 'Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},    
      {field: 'previewUrl', header: 'image',isFilter:false,isImageBody:true,imageBodyType:'carousel'},   
     
      { field: 'product',header: 'Product',isBody:true,body:productBodyTemp,isFilter:false,filterPlaceholder:"Search by code"},     
       
      {field: 'SKUCode', header: 'SKUCode',isFilter:false,filterPlaceholder:"Search by catogery"},     
      
      
      {field: 'stockType', header: 'stockType',isFilter:false,filterPlaceholder:"Search by catogery"},     
      {field: 'quantity', header: 'Quantity',isFilter:false,filterPlaceholder:"Search by catogery"},     
    
      {field: 'reason', header: 'Reason',isFilter:false,filterPlaceholder:"Search by catogery"},     
      {field: 'comment', header: 'comment',isFilter:false,filterPlaceholder:"Search by catogery"},     
     
      
      {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']}, 
 
     ];

     function productBodyTemp(rowData) {
      console.log(rowData)
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
    console.log('stock history edit',data)
    navigate('edit') 
    dispatch(changeSelectedStockHistory(data))
   
 };

 const handleDelete = (data) => {
   console.log('stock history del',data)
   dispatch(changeSelectedStockHistory(data))
   setDisplayAlertDelete(true);
 };

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