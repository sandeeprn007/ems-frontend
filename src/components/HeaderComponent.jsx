import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HeaderComponent = () => {
  const navigator = useNavigate();
  const { hasRole, isAuthenticated, logoutUser } = useAuth();
  const adminUser = hasRole('ADMIN');

  function handleLogout() {
    logoutUser();
    navigator('/login');
  }

  return (
    <div>
        <header>
            <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
                <Link className='navbar-brand ms-3' to={isAuthenticated ? '/employees' : '/login'}>
                    Employee Management System
                </Link>
                <div className='ms-auto me-3 d-flex gap-2'>
                    {isAuthenticated && adminUser && (
                        <>
                            <Link className='btn btn-outline-light btn-sm' to='/register-admin'>Register Admin</Link>
                            <Link className='btn btn-outline-light btn-sm' to='/change-password'>Change Password</Link>
                        </>
                    )}
                    {isAuthenticated ? (
                        <button className='btn btn-outline-light btn-sm' onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <Link className='btn btn-outline-light btn-sm' to='/register'>Register</Link>
                            <Link className='btn btn-outline-light btn-sm' to='/login'>Login</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    </div>
  )
}

export default HeaderComponent
