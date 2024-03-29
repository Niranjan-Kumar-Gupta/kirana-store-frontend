import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import Loader from '../../components/Loader'
import { useDispatch, useSelector } from "react-redux";
import { DeleteAlert } from '../../components/Alert/DeleteAlert';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import {
  getRawMaterialHistory,
  changeMode,
  resetMode,
  changeSelectedRawMaterial,
  resetSelectedRawMaterial,
  changePage,
  changeSelectedRawMaterialHistory,
} from "../../reducers/rawMaterialHistoryTableSlice";
import { useNavigate } from 'react-router-dom';
import { getBrand } from '../../reducers/productTableSlice';


const RawMaterialHistoryTable = () => {

  
  const {
    rawMaterialHistoryData,
    page,
    limit,
    loading,
    totalRawMaterialHistoryCount,
    selectedRawMaterialHistory,
  } = useSelector((state) => state.rawMaterialHistoryTable);
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false)
  const { brandNames } = useSelector((state) => state.productTable);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toast = useRef(null);

  const deleteModule = () => {
    return (
      <DeleteAlert
        item="rawMaterialHistory"
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    );
  };

  useEffect(() => {
    dispatch(getBrand());
  },[])

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

   
const getSeverity = (data) => {
  switch (data.paymentStatus) {
      case 'Fully Paid':
          return 'success';

      case 'Partially Paid':
          return 'warning';

      case 'Not Paid':
          return 'danger';

      default:
          return null;
  }
};
   const rawTypeItems = ['CHECK IN','CHECK OUT']
   let paymentItems = ['Fully Paid', 'Partially Paid', 'Not Paid']
   const statusBodyTemplate = (data) => {
    // console.log(data)
     return <Tag className='__tag' value={data.paymentStatus} severity={getSeverity(data)}></Tag>;
   };
     
  const columns = [

    {field: 'updatedAt', header: 'Date',isDate:true,isFilter:true,filterPlaceholder:"Search by date",filterType :'date'},     
  
    {field: 'materialName', header: 'Raw Material',isFilter:false,filterPlaceholder:""},     
    
    //{ field: 'productName',header: 'Product',isFilter:false,filterPlaceholder:""},     
     
    //{field: 'vendorName', header: 'Vender Name',isFilter:false,filterPlaceholder:""},     
    {field: 'flag', header: 'stockType',isFilter:true,filterType:'dropdown',dropdownItems:rawTypeItems,filterPlaceholder:"Search by Stock Type"},     
    
    {field: 'brandName', header: 'Brand Name',isFilter:true,filterType:'dropdown',dropdownItems:brandNames,filterPlaceholder:"Search by Brand Name"},     
   
    {field: 'paymentStatus', header: 'Payment Status',isBody:true,body:statusBodyTemplate,isFilter:true,filterType:'dropdown',dropdownItems:paymentItems,filterPlaceholder:"Search by Payment Status"},
   
    
    {field: 'quantity', header: 'Quantity',isFilter:false,isBody:true,body:quntBody,filterPlaceholder:""},     
 
    {field: 'reason', header: 'Comment',isFilter:false,filterPlaceholder:""},    
    
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

  const loader = () => {
    return <Loader visible={loading} />
  }

  const handleEdit = (rowData) => {
    dispatch(changeMode('update'))
    navigate(`${rowData.id}`)
  }

  const handleDelete = (rowData) => {
    setDisplayAlertDelete(true);
    dispatch(changeSelectedRawMaterialHistory(rowData));
  }

  
  return (
    <div className='w-full pt-3 m-auto'>
      <Toast ref={toast} />
    {loader()}
    {displayAlertDelete && deleteModule()}
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
             handleEdit={handleEdit}
              handleDelete={handleDelete}
             //onEditNumberInput={onEditNumberInput}
             paginator={{page:page,limit:limit,totalRecords:totalRawMaterialHistoryCount,changePage:changePage}}
           />       
       </div>
 
</div>
  )
}

export default RawMaterialHistoryTable