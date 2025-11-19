import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import App from './App.jsx'
import Home from './pages/Home.jsx'
import Planos from './pages/Planos.jsx'
import Clientes from './pages/Clientes.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: 'home',
    element: <Home />,
    children: [
      {
        path: 'planos', 
        element: <Planos />
      },
      {
        path: 'clientes', 
        element: <Clientes />
      }
    ]
  }
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      retry: 1,
      refetchOnReconnect: true,
      refetchOnMount: "always",
      staleTime: 1000 * 60 * 5
    }
  }
})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
