import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './lib/auth'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Companies } from './pages/Companies'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { SignIn } from './pages/SignIn'
import { Network } from './pages/Network'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Shell() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/network/*" element={<Network />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  )
}
