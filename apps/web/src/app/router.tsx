import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/common/app-shell'
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
  {
    element: <AppShell />,
    children: [
      { path: 'estado', element: <StatusPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
