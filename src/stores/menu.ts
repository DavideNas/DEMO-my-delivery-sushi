import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MenuItem } from '@/types/menu'

export const useMenuStore = defineStore('menu', () => {
  // The centralized application database
  const items = ref<MenuItem[]>([
    {
      id: '1',
      name: 'Sake Nigiri',
      description: 'Rice ball with a slice of seared salmon.',
      price: 4.00,
      image: 'https://images.unsplash.com/photo-1562158074-d49fbeffcc91?w=500',
      category: 'nigiri',
      available: true
    },
    {
      id: '8',
      name: 'Nigiri Sushi Maguro',
      description: 'Rice ball with a slice of seared tuna.',
      price: 5.00,
      image: 'https://plus.unsplash.com/premium_photo-1723809849978-31e019ac29fc?w=500',
      category: 'nigiri',
      available: true
    },
    {
      id: '2',
      name: 'Ebiten Uramaki',
      description: 'Internal roll with tempura shrimp, mayonnaise and kabayaki sauces.',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500',
      category: 'uramaki',
      available: true
    },
    {
      id: '10',
      name: 'Tuna Uramaki',
      description: 'Internal roll with tuna, mayo and kabayaki sauces.',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1761315414321-e17329d0f74b?w=500',
      category: 'uramaki',
      available: true
    }, 
    {
      id: '3',
      name: 'Octopus temaki',
      description: 'Nori seaweed cone filled with rice, octopus and sesame seeds.',
      price: 6.00,
      image: 'https://plus.unsplash.com/premium_photo-1738099524863-0b90dbb6c13c?w=500',
      category: 'temaki',
      available: false
    },
    {
      id: '9',
      name: 'Salmon temaki',
      description: 'Nori seaweed cone filled with rice, salmon and avocado.',
      price: 5.00,
      image: 'https://plus.unsplash.com/premium_photo-1738099524886-5697dd327725?w=500',
      category: 'temaki',
      available: true
    },
    {
      id: '4',
      name: 'Matcha Green Tea',
      description: 'Typical Japanese cold green tea, refreshing and antioxidant.',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500',
      category: 'drinks',
      available: true
    },
    {
      id: '5',
      name: 'Poke Bowl Salmon',
      description: 'Poke bowl with rice, fresh salmon, avocado, edamame and seasonal vegetables.',
      price: 15.00,
      image: 'https://plus.unsplash.com/premium_photo-1701113208681-7ff82c25e039?w=500',    
      category: 'poke',
      available: true
    },
    {
      id: '6',
      name: 'Poke Bowl Vegan',
      description: 'Poke bowl with rice, tofu, avocado, edamame and seasonal vegetables.',
      price: 13.00,
      image: 'https://plus.unsplash.com/premium_photo-1698867577020-38ae235fd612?w=500',    
      category: 'poke',
      available: false
    },
    {
      id: '7',
      name: 'Sake Asahi Shuzo Dassai',
      description: '300ml bottle of Premium quality Sake.',
      price: 26.90,
      image: 'https://images.unsplash.com/photo-1691432633040-c31b6086742c?w=500&h=600&fit=crop&crop=focalpoint&fp-y=0.22',
      category: 'drinks',
      available: true
    }  
  ])

  // CRUD actions that modify the global state in memory
  const addItem = (item: Omit<MenuItem, 'id'>) => {
    const nextId = items.value.length 
      ? String(Math.max(...items.value.map(i => Number(i.id))) + 1) 
      : '1'
    items.value.push({ id: nextId, ...item })
  }

  const deleteItem = (id: string) => {
    items.value = items.value.filter(item => item.id !== id)
  }

  return { items, addItem, deleteItem }
})