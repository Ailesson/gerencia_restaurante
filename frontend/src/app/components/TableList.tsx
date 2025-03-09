"use client";

import React, { useEffect, useState } from "react";
import { getTables, pedido4mesa_response, closeTable } from "../services/tableservice";

const OrderList: React.FC = () => {
    const [tables, setTables] = useState<pedido4mesa_response[]>([]);
    const [loading, setLoading] = useState<boolean>(true);  // Estado para controlar o carregamento
    const [error, setError] = useState<string | null>(null); // Estado para erros

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const data = await getTables();
                setTables(data);
            } catch (err) {
                setError("Erro ao carregar pedidos.");
            } finally {
                setLoading(false);  // Finaliza o estado de carregamento, independentemente do sucesso ou erro
            }
        };
        fetchTables();
    }, []);

    const handleDelete = async (mesaId: number) => {
            if (!window.confirm("Tem certeza que deseja fechar essa mesa?")) return;
    
            try {
                await closeTable(mesaId);
            } catch (err) {
                alert("Erro ao fechar mesa.");
            }
        };

    if (loading) {
        return <div className="text-center">Carregando mesas...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Lista de Mesas</h2>
            <ul className="space-y-2">
                {tables.map((table) => (
                    <li key={table.mesa_id} className="p-3 bg-gray-100 rounded-md">
                        <strong>Mesa {table.mesa_id}</strong> - Status: {table.status}
                        <br />
                        {table.pedidos && (
                            <div className="mt-2">
                            <h4 className="font-semibold">Itens:</h4>
                            <ul className="space-y-1">
                            {table.pedidos.map((item, index) => (
                                <li key={index} className="text-sm">
                                Item ID: {item.menu_item_id} - Quantidade: {item.quantity}
                                </li>
                            ))}
                            Total: <span className="text-green-600 font-bold">R${(table.total / 100).toFixed(2)}</span>
                            </ul>
                        </div>
                        )}

                        {/* Botão de exclusão */}
                        {table.status === 'Fechada' && (
                            <button 
                                onClick={() => handleDelete(table.mesa_id)}
                                className="mt-3 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                            >
                                Fechar Mesa
                            </button>
                        )}
                    </li>

                    
                ))
                }
            </ul>
        </div>
    );
};

export default OrderList;
