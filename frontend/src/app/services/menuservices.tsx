import api from './api'

export interface MenuResponse{
   id: number;
   name: string;
   price: number; 
}
interface MenuRequest{
   name: string;
   price: number;
}

export const getMenu = async (): Promise<MenuResponse[]> => {
    const response = await api.get("/menu");
    return response.data;
};