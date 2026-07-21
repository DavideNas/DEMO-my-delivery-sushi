import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCart } from '../useCart'
import type { MenuItem } from '@/types/menu'

// 1. Mock data for testing menu items
const mockItem1: MenuItem = {
  id: '1',
  name: 'Sake Nigiri',
  description: 'Rice ball with salmon',
  price: 4.0,
  image: 'sake.jpg',
  category: 'nigiri',
  available: true
}

const mockItem2: MenuItem = {
  id: '2',
  name: 'Matcha Green Tea',
  description: 'Cold green tea',
  price: 3.5,
  image: 'matcha.jpg',
  category: 'drinks',
  available: true
}

describe('useCart Composable', () => {
  beforeEach(() => {
    // Reset Pinia to ensure a pristine state before every test run
    setActivePinia(createPinia())
  })

  it('should initialize with an empty cart and zero counts/price', () => {
    const { cartItems, totalItemsCount, totalPrice } = useCart()

    expect(cartItems.value).toEqual([])
    expect(totalItemsCount.value).toBe(0)
    expect(totalPrice.value).toBe(0)
  })

  it('should add new items to the cart correctly', () => {
    const { cartItems, totalItemsCount, totalPrice, addToCart } = useCart()

    addToCart(mockItem1)

    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0]).toEqual({ item: mockItem1, quantity: 1 })
    expect(totalItemsCount.value).toBe(1)
    expect(totalPrice.value).toBe(4.0)
  })

  it('should increment quantity when adding an existing item', () => {
    const { cartItems, totalItemsCount, totalPrice, addToCart } = useCart()

    addToCart(mockItem1)
    addToCart(mockItem1)

    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0].quantity).toBe(2)
    expect(totalItemsCount.value).toBe(2)
    expect(totalPrice.value).toBe(8.0)
  })

  it('should correctly calculate total counts and price for multiple different items', () => {
    const { cartItems, totalItemsCount, totalPrice, addToCart } = useCart()

    addToCart(mockItem1) // 4.0 * 1 = 4.0
    addToCart(mockItem1) // 4.0 * 2 = 8.0
    addToCart(mockItem2) // 3.5 * 1 = 3.5

    expect(cartItems.value).toHaveLength(2)
    expect(totalItemsCount.value).toBe(3)
    expect(totalPrice.value).toBe(11.5)
  })

  it('should decrement item quantity when removeFromCart is called and quantity > 1', () => {
    const { cartItems, totalItemsCount, totalPrice, addToCart, removeFromCart } = useCart()

    addToCart(mockItem1)
    addToCart(mockItem1) // quantity is now 2

    removeFromCart(mockItem1.id)

    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0].quantity).toBe(1)
    expect(totalItemsCount.value).toBe(1)
    expect(totalPrice.value).toBe(4.0)
  })

  it('should remove the item completely when removeFromCart is called and quantity is 1', () => {
    const { cartItems, totalItemsCount, totalPrice, addToCart, removeFromCart } = useCart()

    addToCart(mockItem1)
    addToCart(mockItem2)

    removeFromCart(mockItem1.id)

    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0].item.id).toBe(mockItem2.id)
    expect(totalItemsCount.value).toBe(1)
    expect(totalPrice.value).toBe(3.5)
  })

  it('should do nothing when removeFromCart is called with a non-existent item ID', () => {
    const { cartItems, totalItemsCount, totalPrice, addToCart, removeFromCart } = useCart()

    addToCart(mockItem1)

    removeFromCart('non-existent-id')

    expect(cartItems.value).toHaveLength(1)
    expect(totalItemsCount.value).toBe(1)
    expect(totalPrice.value).toBe(4.0)
  })

  it('should clear all items and reset state when clearCart is called', () => {
    const { cartItems, totalItemsCount, totalPrice, addToCart, clearCart } = useCart()

    addToCart(mockItem1)
    addToCart(mockItem2)

    clearCart()

    expect(cartItems.value).toEqual([])
    expect(totalItemsCount.value).toBe(0)
    expect(totalPrice.value).toBe(0)
  })
})
