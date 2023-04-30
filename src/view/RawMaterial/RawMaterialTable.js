import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import Loader from '../../components/Loader'
import { useDispatch, useSelector } from "react-redux";
import {
  getRawMaterial,
  changeMode,
  resetMode,
  changeSelectedRawMaterial,
  resetSelectedRawMaterial,
  changePage,
  deleteRawMaterial
} from "../../reducers/rawMaterialSlice";
import { DeleteAlert } from '../../components/Alert/DeleteAlert';

const RawMaterialTable = ({setShowRawMaterialForm, toast}) => {
  
  const {
    rawMaterialData,
    page,
    limit,
    loading,
    totalRawMaterialCount,
    selectedRawMaterial
  } = useSelector((state) => state.rawMaterialTable);
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false)

  const dispatch = useDispatch();

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

  const columns = [
   {field: 'id', header: 'Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},    
    //{field: 'url', header: 'image',isFilter:false,isImageBody:true,imageBodyType:'carousel'},   

    
    {field: 'materialName', header: 'Raw Material',isFilter:false,filterPlaceholder:"Search by catogery"},     
    
     
    {field: 'quantity', header: 'Available Quantity',isBody:true,body:quntBody, isFilter:false,filterPlaceholder:"Search by catogery"},     
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

  const deleteModule = () => {
    return (
      <DeleteAlert
        item='rawMaterial'
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    )
  }

  const handleEdit = (data) => {
    dispatch(changeSelectedRawMaterial(data))
    dispatch(changeMode('update'))
    setShowRawMaterialForm(true) 
 };

 const handleDelete = (data) => {
   dispatch(changeSelectedRawMaterial(data))
   setDisplayAlertDelete(true);
 };


  const loader = () => {
    return <Loader visible={loading} />
  }

  
  return (
    <div className='w-full pt-3 m-auto'>
    {loading ? loader() : <></>}
    {displayAlertDelete && deleteModule()}
    <div className="mt-2">
          <CustomTable 
             tableName={'rawMatTable'}
             data={rawMaterialData}
             columns={columns}
             globalSearch={true}
             onApplyFilter={onApplyFilter}
             onApplySearch={onApplySearch}
             onClearFilter={onClearFilter}
             onClearSearch={onClearSearch}
             handleEdit={handleEdit}
             handleDelete={handleDelete}
             dispatchFunction={getRawMaterial}
             //onEditNumberInput={onEditNumberInput}
             paginator={{page:page,limit:limit,totalRecords:totalRawMaterialCount,changePage:changePage}}
           />       
       </div>
 
    </div>
  )
}

export default RawMaterialTable