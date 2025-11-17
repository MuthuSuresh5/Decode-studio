
import './App.css'
import Footer from './components/footer'
import Header from './components/Header'
import Contact from './components/Contact'
import AboutPage from './components/AboutPage'
import ServicesPage from './components/ServicesPage'
import ReviewsPage from './components/ReviewsPage'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'
import OrderForm from './components/OrderForm'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Toast from './components/Toast'
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom'
import Home from './components/Home'
import { useState, useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}



function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768)
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Header onSidebarToggle={toggleSidebar}/>
          <Toast />    
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<AboutPage/>}/>
          <Route path='/services' element={<ServicesPage/>}/>
          <Route path='/reviews' element={<ReviewsPage/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={
            <ProtectedRoute userOnly={true}>
              <Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            </ProtectedRoute>
          }/>
          <Route path='/admin' element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            </ProtectedRoute>
          }/>
          <Route path='/order' element={
            <ProtectedRoute>
              <OrderForm/>
            </ProtectedRoute>
          }/>
        </Routes>
          <Footer/>
        </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
