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
import { usersInOutlet,changePage,changeMode,changeUserLocation } from '../../reducers/userSlice';
import { useNavigate } from 'react-router-dom'

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
  // const [selectedLocation, setSelectedLocation] = useState('New York');
  // const [allLocation, setAllLocation] = useState([]);

  // useEffect(()=>{
  //   const getOutlet = async()=>{
  //     const __outletData = await API_GET_OUTLET({page:0,limit:100000})
  //     setAllLocation(__outletData.rows)
  //     console.log(__outletData,allLocation)
  //     setSelectedLocation(__outletData.rows[0])
  //     dispatch(changeUserLocation(__outletData.rows[0]))
  //     console.log(selectedUserLocation)
  //   }
  //   getOutlet()

  // },[])

  useEffect(()=>{
    console.log(usersInOutletData)
  },[usersInOutletData])

  // useEffect(()=>{ 
  //     //console.log(allLocation,selectedLocation)
  //     const getOutletById = async()=>{
  //       const __outletData = await API_GET_USERINOUTLET(selectedLocation.id) 
  //       console.log(__outletData)
  //     }
  //     getOutletById()
  // },[selectedLocation])


const columns = [
     {field: 'id', header: 'Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},    
     {field: 'userName', header: 'User Name',isFilter:false,filterPlaceholder:"Search by catogery"},      
     {field: 'email', header: 'Email',isFilter:false,filterPlaceholder:"Search by catogery"},     
     {field: 'phone', header: 'Phone',isFilter:false,filterPlaceholder:"Search by catogery"},     
    
     // {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']}, 

   ];

   const onAddNewClick = () => {
    dispatch(changeMode("add"));
    navigate(`/user/new`)
  }

const loader = () => {
return <Loader visible={loading} />
}
  return (
    <div className="w-11 pt-3 m-auto">
     <div className={'flex justify-content-between align-items-center'}>
          <CustomBreadcrumb className='pl-0' itemslist={itemslist}/>
          {/* <div className='flex justify-content-between w-3'> */}
            {/* <Dropdown
                    id={''}
                    value={selectedLocation}
                    onChange={(e) =>  dispatch(changeUserLocation(e.value))} 
                    options={allLocation}
                    optionLabel="location"                
                    placeholder='Choose Location'
                    className='w-7'
                  /> */}

              <CustomButton
                varient='filled'
                label={'Add User'}
                icon={'pi pi-plus'}
                onClick={onAddNewClick}
              />
          {/* </div> */}
         
      </div>
    {loading ? loader() : <></>}
         <div className="mt-2">
            <CustomTable 
                  tableName={'userOutletTable'}
                  data={usersInOutletData}
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