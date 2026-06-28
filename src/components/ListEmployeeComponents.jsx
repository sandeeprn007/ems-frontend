import {useEffect, useState} from 'react'
import { deleteEmployee, listEmployees } from '../services/EmployeeService'
import { useNavigate } from 'react-router-dom'
import { isAdminUser } from '../services/AuthService'

const ListEmployeeComponents = () => {

    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const adminUser = isAdminUser();

    function getAllEmployees() {
    listEmployees(page, size)
        .then((response) => {

            console.log("Full Response:", response);
            console.log("Response Data:", response.data);

            // setEmployees(response.data.content);
            console.log("API Response:", response.data);
            console.log("Content:", response.data.content);

            setEmployees(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalPages(response.data.totalPages);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
    getAllEmployees();
    }, [page]);

    const navigator = useNavigate();

    function addNewEmployee() {
        navigator('/add-employee')
    }

    function updateEmployee(id) {
        navigator(`/edit-employee/${id}`)
    }

    function removeEmployee(id) {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            deleteEmployee(id).then(() => {
                getAllEmployees();
            }).catch(error => {
                console.error(error);
            })
        }
    }

  return (
    <div className='container'>
        <h2 className='text-center'>List of employees</h2>
        {adminUser && <button className='btn btn-primary mb-2' onClick={addNewEmployee}>Add Employee</button>}
        <table className='table table-bordered table-striped'>
            <thead>
                <tr>
                    <th>Employee Id</th>
                    <th>Employee First Name</th>
                    <th>Employee Last Name</th>
                    <th>Employee Email</th>
                    {adminUser && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {
                    employees.map(employee => 
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.firstName}</td>
                            <td>{employee.lastName}</td>
                            <td>{employee.email}</td>
                            {adminUser && (
                                <td>
                                    <button className='btn btn-info' onClick={() => updateEmployee(employee.id)}>Update</button>
                                    <button className='btn btn-danger' onClick={() => removeEmployee(employee.id)} style={{marginLeft: '10px'}}>Delete</button>
                                </td>
                            )}
                        </tr>)
                }

            </tbody>
        </table>

        <div className="d-flex justify-content-center align-items-center mt-3">
            <button
                className="btn btn-secondary me-2"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
            >
                Previous
            </button>

            <span>
                Page {page + 1} of {totalPages}
            </span>

            <button
                className="btn btn-secondary ms-2"
                disabled={page + 1 === totalPages}
                onClick={() => setPage(page + 1)}
            >
                Next
            </button>
        </div>
    </div>
  )
}

export default ListEmployeeComponents
