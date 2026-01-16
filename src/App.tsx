import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'
import BackDrop from './components/BackDrop/BackDrop'
import useAuth from './hooks/useAuth'

const App = () => {
  const { handleCheckAuth } = useAuth()

  useEffect(() => {
    handleCheckAuth()
  }, [handleCheckAuth])

  return (
    <>
      <Toaster
        containerStyle={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          pointerEvents: "none",
        }}
        toastOptions={{
          style: {
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            pointerEvents: "auto",
          },
        }}
      />
      <Outlet />
      <BackDrop />
    </>
  )
}

export default App
