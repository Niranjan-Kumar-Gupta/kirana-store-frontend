import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import AppLogout from "../../utils/AppLogout";
import { useLocation } from "react-router-dom";
import { Dashboard } from "../Dashboard";
import ProductList from "../ProductList";


export const Home = () => {

  const location = useLocation();
  const currentPath  = location.pathname

  return (
    <AppLogout>
      <div>
        <header className="header__app">
          <Header />
        </header>
        {
          currentPath =="/" ? <ProductList />:
        <Outlet />
        }
      </div>
    </AppLogout>
  );
};
