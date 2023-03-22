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
import OrderDetails from './view/OrderDetails'
import Categories from './view/Categories'
import PaymentHistory from './view/PaymentHistory'
import UserProfile from './view/UserProfile'
import { Login } from './view/Login'
import parseJwt from './utils/authUtils'
import { setUser } from './reducers/authSlice'

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
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='orders' element={<Orders />} />
          <Route path='orders/orderDetails/:id' element={<OrderDetails />} />
          <Route path='stocks' element={<Stocks />} />
          <Route path='productionCards' element={<ProductionCards />} />
          <Route path='customers' element={<CustomerList />} />
          <Route path='products' element={<ProductList />} />
          <Route
            path='products/productDetails/:id'
            element={<ProductDetails />}
          />
          <Route path='categories' element={<Categories />} />
          <Route path='userProfile' element={<UserProfile />} />
          <Route path='paymentHistory' element={<PaymentHistory />} />
          <Route path='*' element={<p>There's nothing here... </p>} />
        </Route>
        <Route index path='login' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
