import { useEffect, useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ProtectedRoute } from './components/ProtectedRoutes'
import { Home } from './view/Home'
import { Dashboard } from './view/Dashboard'
import Orders from './view/Orders'
import { Stocks } from './view/Stocks'
import { ProductionCards } from './view/ProductionCards'
import CustomerList from './view/CustomerList'
import ProductList from './view/ProductList'
import ProductDetails from './view/ProductDetails'
import Categories from './view/Categories'
import PaymentHistory from './view/PaymentHistory'
import UserProfile from './view/UserProfile'
import NewOrder from './view/New Order'
import { Login } from './view/Login'
import { ResetPass } from './view/ResetPass'
import parseJwt from './utils/authUtils'
import { setUser } from './reducers/authSlice'
import CreateCustomer from './view/CreateCustomer'
import CheckIn from './view/Stocks/CheckIn'
import CheckOut from './view/Stocks/CheckOut'
import StockHistoryEdit from './view/Stocks/stockHistoryEdit'


function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const currentPath = location.pathname
    const token = localStorage.getItem('token')
    if (token) {
      const user = parseJwt(token)
      dispatch(setUser(user))
      navigate(currentPath)
    }
  }, [])

  return (
    <div className='App'>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          {/* <Route path='dashboard' element={<Dashboard />} /> */}
          <Route path='orders' element={<Orders />} />
          <Route path='orders/create' element={<NewOrder />} />
          <Route path='orders/orderDetails/:id' element={<NewOrder />} />
          <Route path='stocks' element={<Stocks />} />
          {/* <Route path='productionCards' element={<ProductionCards />} /> */}
          <Route path='stocks/checkIn' element={<CheckIn />} />
          <Route path='stocks/checkOut' element={<CheckOut />} />
          <Route path='stocks/edit' element={<StockHistoryEdit />} />      
          <Route path='productionCards' element={<ProductionCards />} />
          <Route path='customers' element={<CustomerList />} />
          <Route path='customers/create' element={<CreateCustomer />} />
          <Route path='stocks/checkIn' element={<CheckIn />} />
          <Route path='stocks/checkOut' element={<CheckOut />} />

          <Route path='products' element={<ProductList />} />
          <Route
            path='products/productDetails/:id'
            element={<ProductDetails />}
          />
          <Route path='categories' element={<Categories />} />
          <Route path='userProfile' element={<UserProfile />} />
          <Route path='paymentHistory' element={<PaymentHistory />} />
        </Route>
        <Route index path='login' element={<Login />} />
        {/* <Route path="/resetpass" element={<ResetPass />} /> */}
        <Route path='*' element={<p>There's nothing here... </p>} />
      </Routes>
    </div>
  )
}

export default App
