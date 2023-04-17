import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import CustomSwitch from "../../components/CustomSwitch";
import StocksTable from './StocksTable';
import StockHistoryTable from './StockHistoryTable';
import { CustomButton } from "../../components/CustomButton";
import { useNavigate } from 'react-router-dom'

export const Stocks = () => {

  const switchButtons = [
    { name: "Current Stock", value: "stock" },
    { name: "Stock History", value: "stockHistory" },
  ];
  const navigate = useNavigate()
 


const [table, setTable] = useState('stock')
  
  const handleSwitch = (item) => {
  //  console.log(item);
    setTable(item)
  };

  


  const renderTable = (table) => {
    switch (table) {
      case "stock":
        return <StocksTable />;
      case "stockHistory":
        return <StockHistoryTable />;
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


  

    return (
      <div className="w-11 pt-3 m-auto"> 
         <div className="flex mt-4 justify-content-between align-items-center gap-2">
          <CustomSwitch
                options={switchButtons}
                value={table}
                handleSwitch={handleSwitch}
              />
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
          {renderTable(table)}

      </div>
    );
  };
  