import React, { useState, useEffect, useRef } from 'react'
import CustomSwitch from "../../components/CustomSwitch";
import { CustomButton } from "../../components/CustomButton";
import { useNavigate } from 'react-router-dom'
import RawMaterialHistoryTable from './RawMaterialHistoryTable';
import RawMaterialTable from './RawMaterialTable';
import style from './style.module.css'
import RawMaterialForm from '../../components/Forms/RawMaterialForm';


const RawMaterial = () => {

  const [showRawMaterialForm, setShowRawMaterialForm] = useState(false);

    const switchButtons = [
        { name: "Raw Material", value: "rawMaterial" },
        { name: "History", value: "rawMaterialHistory" },
      ];
      const navigate = useNavigate()
      const [table, setTable] = useState('rawMaterial')
  
  const handleSwitch = (item) => {
  //  console.log(item);
    setTable(item)
  };

  const renderTable = (table) => {
    switch (table) {
      case "rawMaterial":
        return <RawMaterialTable />;
      case "rawMaterialHistory":
        return <RawMaterialHistoryTable/>;
    }
  };
  const onClickCheckInAndOut = (page) => {
   
    switch (page) {
      case "checkIn":   
        navigate("checkIn");
        break
      case "checkOut":
        navigate("checkOut");
        break
    }
  };

  const onAddNewClick = () => {
    setShowRawMaterialForm(true)
    //console.log('ssss')
    console.log(showRawMaterialForm)
  }

  const onHide = () => {
    setShowRawMaterialForm(false)
  }

  const rawMaterialModal = () => {
    return (
      <RawMaterialForm
        onHide = {onHide}
        showRawMaterialForm={showRawMaterialForm}
       
      />
    )
  }

  return (
    <div className="w-11 pt-3 m-auto"> 
    {showRawMaterialForm ? rawMaterialModal() : <></>}
    <div className="flex mt-4 justify-content-between align-items-center gap-2">
         <CustomSwitch
           options={switchButtons}
           value={table}
           handleSwitch={handleSwitch}
         />
         <div className='flex justify-content-center align-items-center gap-2'>
               
                <div className={`${style.__border} px-4 mx-3`}>
                  <CustomButton
                    varient="filled"
                    label={"Add New Raw Material"}          
                    onClick={onAddNewClick}
                  />
                </div>

              <div className="flex  justify-content-center align-items-center gap-3" >
                <CustomButton
                  varient="filled"
                  label={"Check In"}          
                  onClick={()=>{onClickCheckInAndOut('checkIn')}}
                />
                <CustomButton
                  varient="filled"
                  label={"Check Out"}
                  onClick={()=>{onClickCheckInAndOut('checkOut')}}   
                />
             </div>  
         </div>
 
    </div>
     {renderTable(table)}

 </div>
  )
}

export default RawMaterial