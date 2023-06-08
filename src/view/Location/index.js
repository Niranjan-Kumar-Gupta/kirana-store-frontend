import React,{useState,useEffect} from 'react'
import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import Loader from '../../components/Loader'

import { useDispatch, useSelector } from "react-redux"; 
import { API_GET_OUTLET } from '../../api/user.service';
import { getOutlet,changePage, } from '../../reducers/userSlice';

 
const itemslist=[{ label: 'Location', url: '/location'  }, ];

const Location = () => {

      const {
        locationData,
        page,
        limit,
        loading,
        totalLocationCount,
      } = useSelector((state) => state.user);

   
    const columns = [
         {field: 'id', header: 'Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},    
         {field: 'updatedAt', header: 'Date',isFilter:false, isDate: true,filterPlaceholder:"Search by date",filterType :'date'},
         {field: 'location', header: 'Location',isFilter:false,filterPlaceholder:"Search by catogery"},      
         {field: 'name', header: 'Name',isFilter:false,filterPlaceholder:"Search by catogery"},     
         {field: 'pincode', header: 'Pincode',isFilter:false,filterPlaceholder:"Search by catogery"},     
        
        // {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']}, 
 
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
                  data={locationData}
                  columns={columns}
                  globalSearch={true}    
                  dispatchFunction={getOutlet}
                  paginator={{page:page,limit:limit,totalRecords:totalLocationCount,changePage:changePage}}
                />         
         </div>
      </div>
    
  )
}

export default Location