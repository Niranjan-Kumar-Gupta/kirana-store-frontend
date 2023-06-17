import styles from "./style.module.css";
import { ReactComponent as SkaleworkLogo } from "../../assets/svgIcons/Skalework.svg";
import { SbNavbar } from "../SbNavbar";
import { ReactComponent as HumburgerMenu } from "../../assets/navbarIcons/menu.svg";
import { ReactComponent as Cancel } from "../../assets/svgIcons/cancel.svg";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SlideBar } from "../SlideBar";
import { changeSidebarOpenStatus } from "../../reducers/appSlice";
import { useSelector, useDispatch } from "react-redux";
import { API_GET_OUTLET, API_GET_USERINOUTLET } from '../../api/user.service';
import { changeUserLocation, getUserProfile } from '../../reducers/userSlice';
import { Dropdown } from 'primereact/dropdown'

function Header() {
  const { slidebarOpen } = useSelector((state) => state.application);
  const {
    selectedUserLocation,
    userProfile,
  } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.authenticate);
 
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getUserProfile(user.id))
    .unwrap()
      .then((res) => {
       
      })
      .catch((err) => {
        
      });
  },[])

  const handleSlide = () => {
    dispatch(changeSidebarOpenStatus());
  };

  const [allLocation, setAllLocation] = useState([]);
  useEffect(()=>{

    const getOutlet = async()=>{
      const __outletData = await API_GET_OUTLET({page:0,limit:100000})
      setAllLocation(__outletData.rows)
     // console.log(__outletData,allLocation)
      __outletData.rows.forEach(ele => {
         if (ele.id == user.outletId) {
          dispatch(changeUserLocation(ele))
         }
      });
    }
    getOutlet()

  },[])

  return (
    <div className="relative" style={{ backgroundColor: "#1C738E" }}>
      <div className={`${styles["header"]} w-11 py-2 m-auto`}>
        <div className="flex justify-content-between align-items-center w-full h-full">
            <div className="min-w-min flex justify-content-start align-items-center">
              <SkaleworkLogo className={`${styles["logo-css"]}`} />
            </div>

            <div className="w-full ml-4">
            <Dropdown
                    id={''}
                    disabled={userProfile?.role=='admin'?false:true}
                    value={selectedUserLocation}
                    onChange={(e) =>  dispatch(changeUserLocation(e.value))} 
                    options={allLocation}
                    optionLabel="location"                
                    placeholder='Choose Location'
                    className='w-7'
                  />
            </div>

            <div className="w-10 flex align-items-center  gap-4">
              <div className={`${styles["desktop-nav"]}`}>
                <SbNavbar />
              </div>

              {slidebarOpen ? (
              <Cancel className="cursor-pointer w-2rem min-w-min" onClick={handleSlide} />
            ) : (
              <HumburgerMenu
                className="cursor-pointer w-2rem min-w-min"
                onClick={handleSlide}
              />
            )}
            </div>  


        </div>
      </div>
      <SlideBar />
    </div>
  );
}

export default Header;
