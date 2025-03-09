import api from './api'

export interface order_item_response{
    id: number;
    order_id: number;
    menu_item_id: number;
    quantity: number;
}

export interface pedido_response{
    id: number;
    table_id: number;
    total_price: number;
    created_at: Date;
    order_item: order_item_response[];
}

export interface pedido_request{
    table_id: number;
    order_item: number[];
    quantity_item: number[];
}



export const getOrders = async (): Promise<pedido_response[]> => {
    const response = await api.get("/orders");
    return response.data;
};

// Criar pedido com o tipo correto
export const createOrder = async (orderData: pedido_request): Promise<pedido_response> => {
    const response = await api.post("/orders", orderData);
    return response.data;
};

export const findOrder = async (orderId: number): Promise<pedido_response> => {
    const response = await api.get(`/orders/${orderId}`, {
        params: {
            pedido_id: orderId
        }
    });
    console.log(response.data)
    return response.data;
};


export const updateOrder = async (orderId: number, orderData: pedido_request): Promise<pedido_response> =>{
    const response = await api.put(`/orders/${orderId}`, orderData, {
        params:{
            pedido_id: orderId
        }});
    return response.data;
}

export const deleteOrder = async (orderId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/orders/${orderId}`, {
        params: { pedido_id: Number(orderId) }, // Converte para número
    });
    return response.data;
};



