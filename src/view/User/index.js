import React,{useState} from 'react'
import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import Loader from '../../components/Loader'
import { Dropdown } from 'primereact/dropdown'
import {
    getStocks,
    changeMode,
    resetMode,
    changeSelectedStock,
    resetSelectedStock,
    changePage,
  } from "../../reducers/stocksTableSlice";
  import { useDispatch, useSelector } from "react-redux";  


const itemslist=[{ label: 'User', url: '/user'  }, ];
const User = () => {

  const {
    stockData,
    page,
    limit,
    loading,
    totalStockCount,
  } = useSelector((state) => state.stockTable);
  const { brandNames } = useSelector((state) => state.productTable);
  
  const [selectedLocation, setSelectedLocation] = useState('New York');

  const location = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
];

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
     <div className={'flex justify-content-between align-items-center'}>
          <CustomBreadcrumb className='pl-0' itemslist={itemslist}/>
           <Dropdown
                  id={''}
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.value)} 
                  options={location}
                  optionLabel="name"                
                  placeholder='Choose Location'
                  className='w-2'
                />
         
      </div>
      
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

export default User