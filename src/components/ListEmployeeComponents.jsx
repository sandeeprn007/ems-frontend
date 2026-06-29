import {useCallback, useEffect, useState} from 'react'
import { deleteEmployee, listEmployees, searchEmployees } from '../services/EmployeeService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PAGE_SIZE = 5;

const getEmployeeList = (data) => Array.isArray(data) ? data : data.content || [];

const ListEmployeeComponents = () => {

    const [employees, setEmployees] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const { hasRole } = useAuth();
    const adminUser = hasRole('ADMIN');

    const navigator = useNavigate();
    const isSearching = searchKeyword.trim().length > 0;

    const loadEmployees = useCallback((pageNumber, keyword, isCancelled = () => false) => {
        const trimmedKeyword = (keyword || '').trim();

        setLoading(true);
        setErrorMessage('');

        const request = trimmedKeyword
            ? searchEmployees(trimmedKeyword)
            : listEmployees(pageNumber, PAGE_SIZE);

        return request.then((response) => {
            if (isCancelled()) {
                return;
            }

            const responseData = response.data;
            const employeeList = getEmployeeList(responseData);
            setEmployees(employeeList);

            if (trimmedKeyword) {
                setTotalPages(employeeList.length > 0 ? 1 : 0);
                setTotalElements(employeeList.length);
            } else {
                setTotalPages(Array.isArray(responseData) ? (employeeList.length > 0 ? 1 : 0) : responseData.totalPages || 0);
                setTotalElements(Array.isArray(responseData) ? employeeList.length : responseData.totalElements || 0);
            }
        }).catch(error => {
            if (isCancelled()) {
                return;
            }

            console.error(error);
            setEmployees([]);
            setTotalPages(0);
            setTotalElements(0);
            setErrorMessage(error.response?.data?.message || 'Unable to load employees.');
        }).finally(() => {
            if (!isCancelled()) {
                setLoading(false);
            }
        })
    }, [])

    useEffect(() => {
        let cancelled = false;
        const debounceDelay = searchKeyword.trim() ? 300 : 0;

        const timeoutId = setTimeout(() => {
            loadEmployees(currentPage, searchKeyword, () => cancelled);
        }, debounceDelay);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        }
    }, [currentPage, loadEmployees, searchKeyword])

    function handleSearchChange(event) {
        setSearchKeyword(event.target.value)

        if (currentPage !== 0) {
            setCurrentPage(0)
        }
    }

    function addNewEmployee() {
        navigator('/add-employee')
    }

    function updateEmployee(id) {
        navigator(`/edit-employee/${id}`)
    }

    function removeEmployee(id) {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            deleteEmployee(id).then(() => {
                const pageToLoad = !isSearching && employees.length === 1 && currentPage > 0 ? currentPage - 1 : currentPage;

                if (pageToLoad !== currentPage) {
                    setCurrentPage(pageToLoad);
                } else {
                    loadEmployees(pageToLoad, searchKeyword);
                }
            }).catch(error => {
                console.error(error);
            })
        }
    }

    const firstEmployeeNumber = totalElements === 0 ? 0 : currentPage * PAGE_SIZE + 1;
    const lastEmployeeNumber = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);
    const matchingEmployeeLabel = totalElements === 1 ? 'matching employee' : 'matching employees';

  return (
    <div className='container'>
        <h2 className='text-center'>List of employees</h2>
        <div className='d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3'>
            {adminUser && <button className='btn btn-primary' onClick={addNewEmployee}>Add Employee</button>}
            <div className='input-group ms-md-auto' style={{maxWidth: '430px'}}>
                <span className='input-group-text'>Search</span>
                <input
                    type='search'
                    className='form-control'
                    placeholder='Search by name or email'
                    value={searchKeyword}
                    onChange={handleSearchChange}
                />
            </div>
        </div>
        {errorMessage && <div className='alert alert-danger py-2'>{errorMessage}</div>}
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
                    loading ? (
                        <tr>
                            <td colSpan={adminUser ? 5 : 4} className='text-center'>
                                {isSearching ? 'Searching employees...' : 'Loading employees...'}
                            </td>
                        </tr>
                    ) : employees.length > 0 ? employees.map(employee => 
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
                        </tr>) : (
                        <tr>
                            <td colSpan={adminUser ? 5 : 4} className='text-center'>No employees found</td>
                        </tr>
                    )
                }

            </tbody>
        </table>
        {isSearching ? (
            <div className='text-muted'>
                Showing {totalElements} {matchingEmployeeLabel}
            </div>
        ) : (
            <div className='d-flex justify-content-between align-items-center'>
                <span className='text-muted'>
                    Showing {firstEmployeeNumber} to {lastEmployeeNumber} of {totalElements} employees
                </span>
                <div className='btn-group'>
                    <button
                        className='btn btn-outline-secondary'
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(currentPage - 1)}>
                        Previous
                    </button>
                    <button className='btn btn-outline-secondary' disabled>
                        Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
                    </button>
                    <button
                        className='btn btn-outline-secondary'
                        disabled={currentPage + 1 >= totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}>
                        Next
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}

export default ListEmployeeComponents
