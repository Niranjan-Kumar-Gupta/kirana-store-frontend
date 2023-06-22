import React,{useState,useEffect,useRef} from 'react'
import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import Loader from '../../components/Loader'
import { Dropdown } from 'primereact/dropdown'
import { CustomButton } from '../../components/CustomButton'
import { Toast } from 'primereact/toast'
import { useDispatch, useSelector } from "react-redux";  
import { API_GET_OUTLET, API_GET_USERINOUTLET } from '../../api/user.service';
import { usersInOutlet,changePage,changeMode,changeUserLocation,changeSelectedUser } from '../../reducers/userSlice';
import { useNavigate } from 'react-router-dom'
import { DeleteAlert } from "../../components/Alert/DeleteAlert";

const itemslist=[{ label: 'User', url: '/user'  }, ];
const User = () => {
  const {
    usersInOutletData,
    loading,
    page,
    limit,
    totalUserOutletCount,
    selectedUserLocation,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch()
  const toast = useRef(null)

  const navigate = useNavigate()
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false);
  
  useEffect(()=>{
    console.log(usersInOutletData)
  },[usersInOutletData])

  
const columns = [
     {field: 'id', header: 'Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},    
     {field: 'userName', header: 'User Name',isFilter:false,filterPlaceholder:"Search by catogery"},      
     //{field: 'email', header: 'Email',isFilter:false,filterPlaceholder:"Search by catogery"},     
     {field: 'phone', header: 'Phone',isFilter:false,filterPlaceholder:"Search by catogery"},      
     {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']}, 

   ];

   const onAddNewClick = () => {
    dispatch(changeMode("add"));
    navigate(`/user/new`)
  }

  const deleteModule = () => {
    return (
      <DeleteAlert
        item="user"
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    );
  };

  const handleEdit = (data) => {
    //dispatch(changeSelectedUser(data))
    dispatch(changeMode('update')) 
    navigate(`/user/${data.id}`)
 };

 const handleDelete = (data) => {
   console.log(data)
   dispatch(changeSelectedUser(data))
   setDisplayAlertDelete(true);
 };
  

const loader = () => {
return <Loader visible={loading} />
}
  return (
    <div className="w-11 pt-3 m-auto">
     <div className={'flex justify-content-between align-items-center'}>
          <CustomBreadcrumb className='pl-0' itemslist={itemslist}/>
              <CustomButton
                varient='filled'
                label={'Add User'}
                icon={'pi pi-plus'}
                onClick={onAddNewClick}
              />      
      </div>
    {loading ? loader() : <></>}
    {displayAlertDelete && deleteModule()}
         <div className="mt-2">
            <CustomTable 
                  tableName={'userOutletTable'}
                  data={usersInOutletData}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  columns={columns}
                  globalSearch={false}
                  selectedData={selectedUserLocation?.id}
                  dispatchFunction={usersInOutlet}                
                  paginator={{page:page,limit:limit,totalRecords:totalUserOutletCount,changePage:changePage}}
                />         
         </div>
  </div>

  )
}

export default User