import styles from "./style.module.css";
import { useEffect} from "react";
import { NavIcon } from "../NavIcon";
import { useNavigate , useLocation} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeSelectedTab, changeSidebarOpenStatus } from "../../reducers/appSlice";

const navbarItems = [
  // { label: "Dashboard", icon: "dashboard", route: "/dashboard" },
  { label: "Products", icon: "product", route: "/products" },
  { label: "Orders", icon: "order", route: "/orders" },
  { label: "Categories", icon: "category", route: "/categories" },
  { label: "Inventory", icon: "inventory", route: "/stocks" },
  // { label: "Production Cards", icon: "category", route: "/productionCards" },
  { label: "Customers", icon: "customer", route: "/customers" },
];
Object.freeze(navbarItems);

export const SbNavbar = () => {

  const {selectedTab, slidebarOpen }  =  useSelector(state => state.application);

  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const location = useLocation()

  const handleNav = (tabIndex) => {
    dispatch(changeSelectedTab(navbarItems[tabIndex].route))
    if(slidebarOpen) dispatch(changeSidebarOpenStatus())
    navigate(navbarItems[tabIndex].route)
  };

  useEffect(()=>{
    const currentPath = location.pathname;
    dispatch(changeSelectedTab(currentPath))
  })

  return (
      <div className={`flex ${styles["sb-navbar"]}`}>
        <ul className="list-none flex gap-3">
          {navbarItems.map((navItem, index) => (
              <li
              key={index}
                className={`flex justify-content-start align-items-center gap-2 cursor-pointer py-2 ${
                  styles["tab"]
                } ${navItem.route === selectedTab || navItem.route.substring(1) === selectedTab.split('/')[1] ? styles["selected"] : ""}`}
                onClick={() => handleNav(index)}
              >
                <NavIcon icon={navItem.icon} />
                <span>{navItem.label}</span>
              </li>
          ))}
        </ul>
      </div>
  );
};
