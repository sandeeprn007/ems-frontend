
import './App.css'
import ListEmployeeComponents from './components/ListEmployeeComponents'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import EmployeeComponent from './components/EmployeeComponent'
import LoginComponent from './components/LoginComponent'
import ProtectedRoute from './components/ProtectedRoute'
import RegisterAdminComponent from './components/RegisterAdminComponent'
import ChangePasswordComponent from './components/ChangePasswordComponent'
import RegisterComponent from './components/RegisterComponent'
import OAuth2RedirectComponent from './components/OAuth2RedirectComponent'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
        <HeaderComponent/>
          <Routes>
            <Route path = "/login" element = {<LoginComponent/>}></Route>
            <Route path = "/register" element = {<RegisterComponent/>}></Route>
            <Route path = "/oauth2/redirect" element = {<OAuth2RedirectComponent/>}></Route>
            {/* // http://localhost:3000/ */}
            <Route path = "/" element = {<Navigate to="/employees" replace />}></Route>
            {/* // http://localhost:3000/employees */}
            <Route path = "/employees" element = {<ProtectedRoute><ListEmployeeComponents/></ProtectedRoute>}></Route>
            <Route path = "/dashboard" element = {<ProtectedRoute><ListEmployeeComponents/></ProtectedRoute>}></Route>
            {/* // http://localhost:3000/add-employee */}
            <Route path = "/add-employee" element = {<ProtectedRoute requiredRole="ADMIN"><EmployeeComponent/></ProtectedRoute>}></Route>
            {/* // http://localhost:3000/edit-employee/1 */}
            <Route path = "/edit-employee/:id" element = {<ProtectedRoute requiredRole="ADMIN"><EmployeeComponent/></ProtectedRoute>}></Route>
            <Route path = "/update-employee/:id" element = {<ProtectedRoute requiredRole="ADMIN"><EmployeeComponent/></ProtectedRoute>}></Route>
            <Route path = "/admin" element = {<ProtectedRoute requiredRole="ADMIN"><RegisterAdminComponent/></ProtectedRoute>}></Route>
            <Route path = "/register-admin" element = {<ProtectedRoute requiredRole="ADMIN"><RegisterAdminComponent/></ProtectedRoute>}></Route>
            <Route path = "/change-password" element = {<ProtectedRoute requiredRole="ADMIN"><ChangePasswordComponent/></ProtectedRoute>}></Route>
            <Route path = "*" element = {<Navigate to="/employees" replace />}></Route>

          </Routes>    
        <FooterComponent/>
        </AuthProvider>
      </BrowserRouter>

    </>
  )
}

export default App
