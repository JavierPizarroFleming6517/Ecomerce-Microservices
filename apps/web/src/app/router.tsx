import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/app-shell'
import { HomePage } from '../routes/home-page'
import { NotFoundPage } from '../routes/not-found-page'
import { StatusPage } from '../routes/status-page'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'estado', element: <StatusPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
