const ORDER_STATUSES = ['pending' | 'preparing' | 'delivered' | 'cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export interface OrderItem {
    menuItemId: string
    name: string
    quantity: number
    price: number
}


export interface Order {
    id: string
    customerName: string
    items: OrderItem[]
    totalAmount: number
    status: OrderStatus
    createdAt: string // ISO String
    notes?: string
}
