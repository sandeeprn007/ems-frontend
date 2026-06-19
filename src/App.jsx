
import './App.css'
import ListEmployeeComponents from './components/ListEmployeeComponents'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import EmployeeComponent from './components/EmployeeComponent'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  

  return (
    <>
      <BrowserRouter>
        <HeaderComponent/>
          <Routes>
            {/* // http://localhost:3000/ */}
            <Route path = "/" element = {<ListEmployeeComponents/>}></Route>
            {/* // http://localhost:3000/employees */}
            <Route path = "/employees" element = {<ListEmployeeComponents/>}></Route>
            {/* // http://localhost:3000/add-employee */}
            <Route path = "/add-employee" element = {<EmployeeComponent/>}></Route>
            {/* // http://localhost:3000/edit-employee/1 */}
            <Route path = "/edit-employee/:id" element = {<EmployeeComponent/>}></Route>


          </Routes>    
        <FooterComponent/>    
      </BrowserRouter>

    </>
  )
}

export default App
