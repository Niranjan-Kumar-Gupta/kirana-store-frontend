import React,{useState,useEffect} from 'react'
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
import { API_GET_OUTLET, API_GET_USERINOUTLET } from '../../api/user.service';
import { usersInOutlet,changePageOutlet } from '../../reducers/userSlice';


const itemslist=[{ label: 'User', url: '/user'  }, ];
const User = () => {

  const {
    stockData,
    page,
    limit,
    loading,
    totalStockCount,
  } = useSelector((state) => state.stockTable);

  
  const {
    usersInOutletData,
    pageOutlet,
    limitOutlet,
    totalUserOutletCount,
  } = useSelector((state) => state.user);


  const [selectedLocation, setSelectedLocation] = useState('New York');
  const [allLocation, setAllLocation] = useState([]);

  useEffect(()=>{
    const getOutlet = async()=>{
      const __outletData = await API_GET_OUTLET({page:0,limit:100000})
      setAllLocation(__outletData.rows)
      console.log(__outletData,allLocation)
      setSelectedLocation(__outletData.rows[0])
    }
    getOutlet()

    console.log(pageOutlet,limitOutlet,usersInOutlet)
  },[])

  useEffect(()=>{
    // const getOutletById = async()=>{
    //   const __outletData = await API_GET_USERINOUTLET(2) 
    //   console.log(__outletData)
    // }
    // getOutletById()
    console.log(usersInOutletData)
  },[usersInOutletData])

  useEffect(()=>{ 
      //console.log(allLocation,selectedLocation)
      const getOutletById = async()=>{
        const __outletData = await API_GET_USERINOUTLET(selectedLocation.id) 
        console.log(__outletData)
      }
      getOutletById()
  },[selectedLocation])


const columns = [
     {field: 'id', header: 'Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},    
     {field: 'userName', header: 'User Name',isFilter:false,filterPlaceholder:"Search by catogery"},      
     {field: 'email', header: 'Email',isFilter:false,filterPlaceholder:"Search by catogery"},     
     {field: 'phone', header: 'Phone',isFilter:false,filterPlaceholder:"Search by catogery"},     
    
     // {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']}, 

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
                  options={allLocation}
                  optionLabel="location"                
                  placeholder='Choose Location'
                  className='w-2'
                />
         
      </div>
      
    {loading ? loader() : <></>}
         <div className="mt-2">
            <CustomTable 
                 tableName={'locationTable'}
                  data={usersInOutletData}
                  columns={columns}
                  globalSearch={false}
                  selectedData={selectedLocation.id}
                  dispatchFunction={usersInOutlet}
                  //onEditNumberInput={onEditNumberInput}
                  paginator={{page:pageOutlet,limit:limitOutlet,totalRecords:totalUserOutletCount,changePage:changePageOutlet}}
                />         
         </div>
  </div>

  )
}

export default User