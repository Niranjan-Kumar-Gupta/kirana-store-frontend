import React, { useState, useEffect, useRef } from 'react'
import './style.css'
import { CustomerForm } from '../../components/Forms/CustomerForm'
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
import CustomTable from "../../components/CustomTable";
import { DeleteAlert } from "../../components/Alert/DeleteAlert";
import { useDispatch, useSelector } from "react-redux";

import {
  changeMode,
  changeSelectedCustomer,
  changeShowCustomersType,
  changePage,
  getCustomers,
  resetMode,
  resetSelectedCustomer,
} from "../../reducers/customerTableSlice";

const CustomerList = () => {
  
  const toast = useRef(null)
  const [displayBasic, setDisplayBasic] = useState(false);
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false);
  const dispatch = useDispatch();

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


  const [customer, setCustomer] = useState([
    {
        sNo: '1',
        customerName: 'Niranjan',
        customerCode: 'f230',
        district: 'Baagi Ballia',
        phoneNumber: 2478469547,
        email: 'niru@gmail.com',
    },
    {
      sNo: '2',
      customerName: 'Nir',
      customerCode: 'f230',
      district: 'kanpur',
      phoneNumber: 2478469547,
      email: 'miru@gmail.com',
  },
  {
    sNo: '3',
    customerName: 'Niranjan',
    customerCode: 'f230',
    district: 'amaaa',
    phoneNumber: 2478469547,
    email: 'niranjan@gmail.com',
},
{
  sNo: '4',
  customerName: 'Niranjan kumar',
  customerCode: 'f230',
  district: 'Baagi Ballia',
  phoneNumber: 2478469547,
  email: 'niru@gmail.com',
},

 ]
 );



 const columns = [
   // {field: 'id',header: 'S.No.',isFilter:false,filterType:'input'},
    {field: 'name', header: 'Customer Name',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},
    {field: 'customerCode', header: 'Customer Code',isFilter:false,filterType:'input',filterPlaceholder:"Search by Customer Code"},
    {field: 'email', header: 'Email',isFilter:false},  
    {field: 'phone', header: 'Phone Number',isFilter:false,filterType:'input',filterPlaceholder:"Search by Phone Number"},
    //{field: 'gstNumber', header: 'GST Number',isFilter:false,filterType:'input',filterPlaceholder:"Search by Phone Number"},
    //{field: 'panNumber', header: 'PAN Number',isFilter:false,filterType:'input',filterPlaceholder:"Search by Phone Number"},  
    {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']}, 
  ];

  const deleteModule = () => {
    return (
      <DeleteAlert
        item="Customer List"
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
     setDisplayBasic(true);
  };
  const handleDelete = (customer) => {
    console.log('customer del',customer)
    //setMessage(product)
    dispatch(changeMode("delete"));
   // dispatch(changeSelectedProduct(product));
     setDisplayAlertDelete(true);
  };
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
  //--------------------------------------------

  const [showCustomerForm, setShowCustomerForm] = useState(false)

  const onAddNewClick = () => {
    setShowCustomerForm(true)
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

  return (
    <div className='w-11 pt-3 m-auto'>
      <Toast ref={toast} />
      {displayBasic ? customerModal() : <></>}
      {showCustomerForm ? customerModal() : <></>}
      {loading ? loader() : <></>}
      <div className={'flex justify-content-between align-items-center'}>
        <div></div>
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
                  tableType={'dataTable'}
                  paginator={{page:page,limit:limit,totalRecords:totalCustomerCount,changePage:changePage}}
                />       
            </div>
        </div>

    </div>
  )
}

export default CustomerList
