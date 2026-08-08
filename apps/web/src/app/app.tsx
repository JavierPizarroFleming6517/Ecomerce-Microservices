import { RouterProvider } from 'react-router-dom'
import { CartProvider } from '../states/cart/cart-context'
import { router } from './router'

export function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  )
}
