import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'Inter, sans-serif' }}>
        {/* Navbar */}
        <nav style={{
          background: '#1e293b', color: '#fff', padding: '0 32px',
          display: 'flex', alignItems: 'center', gap: 32, height: 60,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>
            📦 Inventory
          </div>
          {[
            { to: '/', label: 'Products' },
            { to: '/categories', label: 'Categories' },
          ].map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              style={({ isActive }) => ({
                color: isActive ? '#60a5fa' : '#94a3b8',
                textDecoration: 'none', fontWeight: 600, fontSize: 14,
                borderBottom: isActive ? '2px solid #60a5fa' : '2px solid transparent',
                paddingBottom: 4, transition: 'all 0.15s',
              })}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Page Content */}
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
