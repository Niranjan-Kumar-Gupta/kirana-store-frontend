import styles from "./style.module.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../reducers/authSlice";
import Cookies from "js-cookie";
import { SbNavbar } from "../SbNavbar";
import { CustomButton } from "../CustomButton";
import { Text } from "../Text";
import { changeSidebarOpenStatus } from "../../reducers/appSlice";
import { ReactComponent as  SkaleworkLogo } from "../../assets/svgIcons/Skalework.svg";
import { useNavigate } from "react-router-dom";
import VersionTag from "../../config/VersionTag";
import axiosInstance from "../../api/axios.instance";

const slideContentTab = [
  // { label: "User Profile", route: "/userprofile" },
  // { label: "Payment History", route: "/paymenthistory" },
];

export const SlideBar = () => {
  const navigate=useNavigate();
  const { slidebarOpen } = useSelector((state) => state.application);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(changeSidebarOpenStatus());
    dispatch(logout())
      .unwrap()
      .then(() => {
        //Cookies.remove("token");
        localStorage.clear();
        axiosInstance.defaults.headers.common["authorization"] = null;
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        //show toast message from here
      });
  };
  const nav=(path)=>{
    navigate(path);
    if(slidebarOpen) dispatch(changeSidebarOpenStatus())
  }
  return (
    <div
      className={`flex flex-column ${styles["slidebar"]} ${
        slidebarOpen ? styles["open-slide"] : ""
      }`}
    >
      <div className={`${styles['link-container']}`}>
      <div className={`${styles["mob-nav"]}`}>
        <SbNavbar />
      </div>
      <div className={`flex flex-column ${styles["slide-links"]}`}>
        {slideContentTab.map((item, index) => (
          <div key={index} className={`py-4 ${styles["slide-tab"]} cursor-pointer`} onClick={()=>nav(item.route)}>
            <Text type={"sub-heading"}>{item.label}</Text>
          </div>
        ))}
      </div>
      </div>
      <div className={`flex justify-content-center ${styles["sign-out"]}`}>
        <CustomButton
          varient="filled"
          label={"Sign out"}
          onClick={handleLogout}
        />
      </div>
      <div className="flex-grow-1 flex flex-column justify-content-center">
        <div className="w-full flex  justify-content-center">
          <div className="my-auto">
            <SkaleworkLogo />
          </div>
        </div>
        <div className="text-center">
          <VersionTag color={"rgba(255, 255, 255, 0.5)"} />
        </div>
      </div>
    </div>
  );
};
