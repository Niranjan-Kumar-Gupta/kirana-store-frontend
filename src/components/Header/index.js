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

function Header() {
  const { slidebarOpen } = useSelector((state) => state.application);
  const dispatch = useDispatch();

  const handleSlide = () => {
    dispatch(changeSidebarOpenStatus());
  };

  return (
    <div className="relative" style={{ backgroundColor: "#1C738E" }}>
      <div className={`${styles["header"]} w-11 py-2 m-auto`}>
        <div className="flex justify-content-between align-items-center w-full h-full">
            <div className="min-w-min flex justify-content-start align-items-center">
              <SkaleworkLogo className={`${styles["logo-css"]}`} />
            </div>

          
            <div className="w-10 flex align-items-center justify-content-end gap-4">
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
