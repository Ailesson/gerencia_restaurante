"use client";

import React, { useEffect, useState } from "react";
import { getOrders, deleteOrder, updateOrder, pedido_response, pedido_request } from "../services/orderservices";

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<pedido_response[]>([]);
    const [orderItems, setOrderItems] = useState<{ itemId: number, quantity: number }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (err) {
                setError("Erro ao carregar pedidos.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);


    const handleDelete = async (orderId: number) => {
        if (!window.confirm("Tem certeza que deseja excluir este pedido?")) return;

        try {
            await deleteOrder(orderId);
            setOrders(orders.filter(order => order.id !== orderId)); // Remove da lista após deletar
        } catch (err) {
            alert("Erro ao excluir pedido.");
        }
    };

    const handleAddItem = () => {
        const itemId = Number(prompt("Digite o ID do item:"));
        const quantity = Number(prompt("Digite a quantidade do item:"));
        
        if (!isNaN(itemId) && !isNaN(quantity) && quantity > 0) {
            setOrderItems((prevItems) => [...prevItems, { itemId, quantity }]);
        } else {
            alert("ID do item ou quantidade inválida!");
        }
    };

    const handleUpdate = async (orderId: number, tableId: number) => {
        let addItem: string = "Sim"; // Agora pode ser reatribuída
        const order_item: number[] = []; // Corrigido o tipo
        const quantity_item: number[] = [];
        
        while (addItem.toLowerCase() === "sim") { // Ignora diferenças de maiúsculas/minúsculas
            const itemId = Number(prompt("Digite o ID do item:"));
            const quantity = Number(prompt("Digite a quantidade do item:"));
        
            if (!isNaN(itemId) && !isNaN(quantity)) { // Garante que o usuário digitou números válidos
                order_item.push(itemId);
                quantity_item.push(quantity);
            } else {
                alert("Entrada inválida. Digite números válidos.");
            }
        
            addItem = prompt("Quer adicionar mais um item? (Sim/Não)") || "Não"; // Se `null`, assume "Não"
        }
        
        
        const updatedOrderData: pedido_request = {
            table_id: tableId,
            order_item: order_item, // Pode ser atualizado conforme necessário
            quantity_item: quantity_item
        };

        try {
            const updatedOrder = await updateOrder(orderId, updatedOrderData);

            setOrders(orders.map(order => 
                order.id === orderId ? updatedOrder : order
            )); // Atualiza o pedido na lista

            alert("Pedido atualizado com sucesso!");
        } catch (err) {
            alert("Erro ao atualizar pedido.");
        }
    };

    if (loading) {
        return <div className="text-center">Carregando pedidos...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Lista de Pedidos</h2>
            <ul className="space-y-2">
                {orders.map((order) => (
                    <li key={order.id} className="p-3 bg-gray-100 rounded-md">
                        <strong>ID {order.id}</strong>
                        <br />
                        <strong>Mesa {order.table_id}</strong> - 
                        Total: <span className="text-green-600 font-bold">R${(order.total_price / 100).toFixed(2)}</span>
                        <br />
                        <span className="text-gray-600">Criado em: {new Date(order.created_at).toLocaleString()}</span>

                        {/* Exibe os itens do pedido */}
                        <div className="mt-2">
                            <h4 className="font-semibold">Itens:</h4>
                            <ul className="space-y-1">
                                {order.order_item.map((item, index) => (
                                    <li key={index} className="text-sm">
                                        Item ID: {item.menu_item_id} - Quantidade: {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Botões de Ações */}
                        <div className="mt-3 flex gap-2">
                            <button 
                                onClick={() => handleDelete(order.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                            >
                                Excluir
                            </button>

                            <button 
                                onClick={() => handleUpdate(order.id, order.table_id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                            >
                                Atualizar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
