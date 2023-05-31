import React from 'react'
import CustomBreadcrumb from "../../components/CustomBreadcrumb";
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

const itemslist=[{ label: 'Location', url: '/location'  }, ];

const Location = () => {

    const {
        stockData,
        page,
        limit,
        loading,
        totalStockCount,
      } = useSelector((state) => state.stockTable);
      const { brandNames } = useSelector((state) => state.productTable);
      

   
    const columns = [
         {field: 'id', header: 'Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},    
         {field: 'productName', header: 'Location',isFilter:false,filterPlaceholder:"Search by catogery"},      
         {field: 'quantity', header: 'User',isFilter:false,filterPlaceholder:"Search by catogery"},     
         {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']}, 
 
       ];

    const loader = () => {
    return <Loader visible={loading} />
    }
    
  return (
    <div className="w-11 pt-3 m-auto">
        <CustomBreadcrumb itemslist={itemslist}/>

        {loading ? loader() : <></>}
         <div className="mt-2">
            <CustomTable 
                 tableName={'locationTable'}
                  data={stockData}
                  columns={columns}
                  globalSearch={true}
                 
                  dispatchFunction={getStocks}
                  //onEditNumberInput={onEditNumberInput}
                  paginator={{page:page,limit:limit,totalRecords:totalStockCount,changePage:changePage}}
                />         
         </div>
      </div>
    
  )
}

export default Location