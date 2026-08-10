import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/common/app-shell'
import { AccountPage } from '../pages/account/account-page'
import { LoginPage } from '../pages/account/login-page'
import { RegisterPage } from '../pages/account/register-page'
import { StatusPage } from '../pages/admin/status-page'
import { NotFoundPage } from '../pages/not-found-page'
import { CartPage } from '../pages/store/cart-page'
import { HomePage } from '../pages/store/home-page'
import { PaymentResultPage } from '../pages/store/payment-result-page'
import { ProductDetailPage } from '../pages/store/product-detail-page'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/producto/:sku', element: <ProductDetailPage /> },
  { path: '/carrito', element: <CartPage /> },
  { path: '/payments/result', element: <PaymentResultPage /> },
  { path: '/iniciar-sesion', element: <LoginPage /> },
  { path: '/registro', element: <RegisterPage /> },
  { path: '/cuenta', element: <AccountPage /> },
  {
    element: <AppShell />,
    children: [
      { path: 'estado', element: <StatusPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
