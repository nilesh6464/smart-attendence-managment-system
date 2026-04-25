import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../features/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.title}>📊 Attendance System</h2>
      {user && (
        <div style={styles.menu}>
          <span style={styles.user}>{user.name} ({user.role})</span>
          <Link to="/" style={styles.link}>Dashboard</Link>
          {(user.role === 'manager' || user.role === 'admin') && (
            <Link to="/reports" style={styles.link}>Reports</Link>
          )}
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#2c3e50', color: 'white' },
  title: { margin: 0 },
  menu: { display: 'flex', gap: '1rem', alignItems: 'center' },
  user: { fontWeight: 'bold' },
  link: { color: 'white', textDecoration: 'none' },
  button: { padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Navbar;
