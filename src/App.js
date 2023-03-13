
import { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import { Home } from "./view/Home";
import { Dashboard } from "./view/Dashboard";
import Orders from "./view/Orders";
import { Stocks } from "./view/Stocks";
import { ProductionCards } from "./view/ProductionCards";
import CustomerList from "./view/CustomerList";
import ProductList from "./view/ProductList";

function App() {

  return (
    <div className="App">
      <Routes>     
        <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="stocks" element={<Stocks />} />
            <Route path="productionCards" element={<ProductionCards />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="products" element={<ProductList />} />
            
          </Route>
      </Routes>
    </div>
  );
}

export default App;
