import React, { useState, useEffect, useRef } from 'react'
import './style.css'
import { CustomerForm } from '../../components/Forms/CustomerForm'
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
import CustomTable from "../../components/CustomTable";
import { DeleteAlert } from "../../components/Alert/DeleteAlert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { Text } from '../../components/Text'

import {
  changeMode,
  changeSelectedCustomer,
  changeShowCustomersType,
  changePage,
  getCustomers,
  resetMode,
  resetSelectedCustomer,
} from "../../reducers/customerTableSlice";
import CustomBreadcrumb from '../../components/CustomBreadcrumb'

const CustomerList = () => {
  
  const toast = useRef(null)
  const [displayBasic, setDisplayBasic] = useState(false);
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()
 

  const {
    customerData,
    page,
    limit,
    loading,
    totalCustomerCount,
    showCustomersType,
  } = useSelector((state) => state.customerTable);

  useEffect(()=>{
    dispatch(getCustomers({page:page,limit:limit}))
    .unwrap()
    .catch(()=>{ 
      console.log(customerData)

    }) 
  },[page,limit])



  // customer list table------------------------



 const columns = [
   // {field: 'id',header: 'S.No.',isFilter:false,filterType:'input'},
     {field: 'customerCode', header: 'Customer Code',isFilter:false,filterType:'input',filterPlaceholder:"Search by Customer Code"},
    
    {field: 'name', header: 'Customer Name',isFilter:true,filterType:'input',filterPlaceholder:"Search by Customer Name"},
    {field: 'phone', header: 'Phone Number',isFilter:false,filterType:'input',filterPlaceholder:"Search by Phone Number"},
   
    {field: 'email', header: 'Email',isFilter:false},  
    //{field: 'gstNumber', header: 'GST Number',isFilter:false,filterType:'input',filterPlaceholder:"Search by Phone Number"},
    //{field: 'panNumber', header: 'PAN Number',isFilter:false,filterType:'input',filterPlaceholder:"Search by Phone Number"},  
    {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']}, 
  ];

  const deleteModule = () => {
    return (
      <DeleteAlert
        item="customer"
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    );
  };


  
  const handleEdit = (customer) => {
     console.log('customer edit',customer)
     dispatch(changeSelectedCustomer(customer));
     dispatch(changeMode("update"));
    navigate(`create`)
   
  };
  const handleDelete = (customer) => {
    console.log('customer del',customer)
    dispatch(changeMode("delete"));
    dispatch(changeSelectedCustomer(customer));
     setDisplayAlertDelete(true);
  };
  const onApplyFilter = (data)=>{
    console.log(data)
  }
  const onApplySearch = (data)=>{
    console.log('apply',data)
  }
  const onClearFilter = (data)=>{
    console.log(data)
  }
  const onClearSearch = (data)=>{
  console.log(data)
  }
  //--------------------------------------------

  const [showCustomerForm, setShowCustomerForm] = useState(false)

  const onAddNewClick = () => {
    
    navigate(`create`)
    dispatch(changeMode("add"))
  }

  const onHide = () => {
    setShowCustomerForm(false)
  }

  const loader = () => {
    return <Loader visible={loading} />
  }

  const customerModal = () => {
    return (
      <CustomerForm
        onHide={onHide}
        showCustomerForm={showCustomerForm}
        toast={toast}
      />
    )
  }
  const itemslist=[{ label: 'Customers',url: '/customers' }];
  return (
    <div className='w-11 pt-3 m-auto'>
      <Toast ref={toast} />
   
      {loading ? loader() : <></>}
      <div className={'flex justify-content-between align-items-center'}>
        <CustomBreadcrumb className='pl-0' itemslist={itemslist}/>
        
        <CustomButton
          varient='filled'
          label={'Add New Customer'}
          icon={'pi pi-plus'}
          onClick={onAddNewClick}
        />
      </div>
      
      <div className="card my-3">
            {displayAlertDelete && deleteModule()}
            <div className="">
               <CustomTable 
                  tableName={'customerList'}
                  data={customerData}
                  columns={columns}
                  globalSearch={true}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  onApplyFilter={onApplyFilter}
                  onApplySearch={onApplySearch}
                  onClearFilter={onClearFilter}
                  onClearSearch={onClearSearch}
                  dispatchFunction={getCustomers}
                  tableType={'dataTable'}
                  paginator={{page:page,limit:limit,totalRecords:totalCustomerCount,changePage:changePage}}
                />       
            </div>
        </div>

    </div>
  )
}

export default CustomerList
