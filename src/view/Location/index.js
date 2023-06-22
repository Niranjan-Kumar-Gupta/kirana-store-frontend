import React,{useState,useEffect,useRef} from 'react'
import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
import { useDispatch, useSelector } from "react-redux"; 
import { getOutlet,changePage,changeMode,changeSelectedLocation } from '../../reducers/outletSlice';
import { useNavigate } from 'react-router-dom'
import { DeleteAlert } from "../../components/Alert/DeleteAlert";
const itemslist=[{ label: 'Location', url: '/location'  }, ];

const Location = () => {

  const dispatch = useDispatch()
  const toast = useRef(null)

  const {
        locationData,
        page,
        limit,
        loading,
        totalLocationCount,
        selectedLocation
      } = useSelector((state) => state.outletTable);

    const navigate = useNavigate()
    const [displayAlertDelete, setDisplayAlertDelete] = useState(false);

    const columns = [
         {field: 'id', header: 'Id',isFilter:false,filterType:'input',filterPlaceholder:"Search by Name"},    
         {field: 'updatedAt', header: 'Date',isFilter:false, isDate: true,filterPlaceholder:"Search by date",filterType :'date'},
         {field: 'location', header: 'Location',isFilter:false,filterPlaceholder:"Search by catogery"},      
         {field: 'name', header: 'Name',isFilter:false,filterPlaceholder:"Search by catogery"},     
         {field: 'pincode', header: 'Pincode',isFilter:false,filterPlaceholder:"Search by catogery"},        
         {field: 'actions', header: 'Actions',isActions:true,actionType:['edit','delete']}, 
       ];

    const loader = () => {
    return <Loader visible={loading} />
    }

    const onAddNewClick = () => {
      dispatch(changeMode("add"));
      navigate(`/location/new`)
    }

    const deleteModule = () => {
      return (
        <DeleteAlert
          item="location"
          displayAlertDelete={displayAlertDelete}
          setDisplayAlertDelete={setDisplayAlertDelete}
          toast={toast}
        />
      );
    };

    const handleEdit = (data) => {
      dispatch(changeMode('update')) 
      navigate(`/location/${data.id}`)
   };
  
   const handleDelete = (data) => {
     console.log(data)
     dispatch(changeSelectedLocation(data))
     setDisplayAlertDelete(true);
   };
    
  return (
    <div className="w-11 pt-3 m-auto">
        <div className={'flex justify-content-between align-items-center'}>
        <div>
          <CustomBreadcrumb className='pl-0' itemslist={itemslist}/>
        </div>
        <CustomButton
          varient='filled'
          label={'Add Location'}
          icon={'pi pi-plus'}
          onClick={onAddNewClick}
        />
      </div>
      {displayAlertDelete && deleteModule()}
        {loading ? loader() : <></>}
        <div className="card my-3">
         <div className="">
            <CustomTable 
                 tableName={'locationTable'}
                  data={locationData}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  columns={columns}
                  globalSearch={true}    
                  dispatchFunction={getOutlet}
                  paginator={{page:page,limit:limit,totalRecords:totalLocationCount,changePage:changePage}}
                />         
         </div>
         </div>
      </div>
    
  )
}

export default Location