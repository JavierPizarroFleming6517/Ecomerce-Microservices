import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../states/auth/auth-context'
import { CartProvider } from '../states/cart/cart-context'
import { router } from './router'

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  )
}
