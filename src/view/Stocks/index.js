import React, { useState, useEffect, useRef } from 'react'
import CustomTable from "../../components/CustomTable";
import { Text } from '../../components/Text';
import CustomSwitch from "../../components/CustomSwitch";
import StocksTable from './StocksTable';
import StockHistoryTable from './StockHistoryTable';
import { CustomButton } from "../../components/CustomButton";
import { useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { changeTab } from '../../reducers/stocksTableSlice';
import { resetToastActionStock } from '../../reducers/stocksHistoryTableSlice';

export const Stocks = () => {

  const { tab } = useSelector(state => state.stockTable)
  const { toastAction, loading} = useSelector((state) => state.stocksHistoryTable)

  const switchButtons = [
    { name: "Current Stock", value: "stock" },
    { name: "Stock History", value: "stockHistory" },
  ];
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useRef(null)

  const handleSwitch = (item) => {
    dispatch(changeTab(item));
  };

  const loader = () => {
    return <Loader visible={loading} />
  }


  const renderTable = (tab) => {
    switch (tab) {
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

  useEffect(() => {
    if (toastAction === 'checkIn') {
      toast.current.show({
        severity: 'success',
        detail: 'Check In Successfully',
      })
    } else if (toastAction === 'checkOut') {
      toast.current.show({
        severity: 'success',
        detail: 'Check Out Successfully',
      })
    } else if (toastAction === 'update') {
      toast.current.show({
        severity: 'success',
        detail: 'Stock History Successfully Updated',
      })
    } else if (toastAction === 'delete') {
      toast.current.show({
        severity: 'success',
        detail: 'Stock History Successfully Deleted',
      })
    }
    dispatch(resetToastActionStock())
  },[])


  

    return (
      <div className="w-11 pt-3 m-auto"> 
      <Toast ref={toast} />
      {loader()}
         <div className="flex mt-4 justify-content-between align-items-center gap-2">
          <CustomSwitch
                options={switchButtons}
                value={tab}
                handleSwitch={handleSwitch}
              />
           <div className="flex  justify-content-center align-items-center gap-2" >  
             
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
          {renderTable(tab)}

      </div>
    );
  };
  