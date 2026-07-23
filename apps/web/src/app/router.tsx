import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/common/app-shell'
import { StatusPage } from '../pages/admin/status-page'
import { NotFoundPage } from '../pages/not-found-page'
import { HomePage } from '../pages/store/home-page'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    element: <AppShell />,
    children: [
      { path: 'estado', element: <StatusPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
