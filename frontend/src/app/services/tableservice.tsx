import api from "./api"
import { order_item_response } from "./orderservices";


export interface pedido4mesa_response{ 
    mesa_id: number;
    status: string;
    total: number;
    pedidos: order_item_response[];
}

export interface mesa_response{ 
    id: number;
    status: string;
}

export const getTables = async (): Promise<pedido4mesa_response[]> => {
    const response = await api.get("/tables");
    return response.data;
};

// Criar pedido com o tipo correto
export const createTable = async (): Promise<mesa_response> => {
    const response = await api.post("/tables");
    return response.data;
};

export const closeTable = async (mesaId: Number): Promise<{ message: string }> => {
    console.log('request chegou');
    
    // Fazendo a requisição POST com o mesaId como query parameter
    const response = await api.post(`/tables/${mesaId}/close`, null, {
        params: { mesa_id: mesaId },  // Query parameter
    });
    
    console.log(response.data);
    return response.data;
};
