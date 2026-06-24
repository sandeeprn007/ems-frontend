import { Link, useNavigate } from 'react-router-dom'
import { isAdminUser, isUserLoggedIn, logout } from '../services/AuthService'

const HeaderComponent = () => {
  const navigator = useNavigate();
  const authenticated = isUserLoggedIn();
  const adminUser = isAdminUser();

  function handleLogout() {
    logout();
    navigator('/login');
  }

  return (
    <div>
        <header>
            <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
                <Link className='navbar-brand ms-3' to={authenticated ? '/employees' : '/login'}>
                    Employee Management System
                </Link>
                <div className='ms-auto me-3 d-flex gap-2'>
                    {authenticated && adminUser && (
                        <>
                            <Link className='btn btn-outline-light btn-sm' to='/register-admin'>Register Admin</Link>
                            <Link className='btn btn-outline-light btn-sm' to='/change-password'>Change Password</Link>
                        </>
                    )}
                    {authenticated ? (
                        <button className='btn btn-outline-light btn-sm' onClick={handleLogout}>Logout</button>
                    ) : (
                        <Link className='btn btn-outline-light btn-sm' to='/login'>Login</Link>
                    )}
                </div>
            </nav>
        </header>
    </div>
  )
}

export default HeaderComponent
