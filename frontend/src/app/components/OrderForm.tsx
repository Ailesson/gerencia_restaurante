import React, { useState } from 'react';
import { createOrder } from '../services/orderservices';

const OrderForm: React.FC = () => {
    const [tableId, setTableId] = useState<number | "">("");  // Inicialize com uma string vazia
    const [orderItems, setOrderItems] = useState<{ itemId: number, quantity: number }[]>([]); // Lista de itens com quantidade
    const [loading, setLoading] = useState(false); // Estado de carregamento

    const handleAddItem = () => {
        const itemId = Number(prompt("Digite o ID do item:"));
        const quantity = Number(prompt("Digite a quantidade do item:"));
        
        if (!isNaN(itemId) && !isNaN(quantity) && quantity > 0) {
            setOrderItems((prevItems) => [...prevItems, { itemId, quantity }]);
        } else {
            alert("ID do item ou quantidade inválida!");
        }
    };

    const handleRemoveItem = (index: number) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (tableId === "" || orderItems.length === 0) return;  // Verifique se a mesa está preenchida corretamente
    
        setLoading(true);
    
        const orderData = {
            table_id: Number(tableId),
            order_item: orderItems.map(item => item.itemId),
            quantity_item: orderItems.map(item => item.quantity)
        };
    
        try {
            await createOrder(orderData); // Certifique-se de que createOrder está funcionando corretamente
            alert("Pedido criado com sucesso!");
        } catch (error) {
            alert("Erro ao criar pedido.");
        } finally {
            setTableId("");  // Resetando após a criação
            setOrderItems([]);
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-xl font-semibold mb-4">Novo Pedido</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo para o ID da mesa */}
                <div>
                    <label className="block font-medium">Mesa</label>
                    <input
                        type="number"
                        value={tableId}
                        onChange={(e) => setTableId(Number(e.target.value))}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                {/* Seção para adicionar itens ao pedido */}
                <div>
                    <h3 className="font-medium">Itens do Pedido</h3>
                    <ul className="space-y-2">
                        {orderItems.map((item, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span>Item ID: {item.itemId} - Quantidade: {item.quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="bg-red-500 text-white p-1 rounded-md"
                                >
                                    Remover
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="w-full bg-green-500 text-white p-2 rounded-md mt-2"
                    >
                        Adicionar Item
                    </button>
                </div>

                {/* Botão para submeter o pedido */}
                <button
                    type="submit"
                    className={`w-full ${loading ? "bg-gray-500" : "bg-blue-600"} text-white p-2 rounded-md`}
                    disabled={loading}
                >
                    {loading ? "Criando Pedido..." : "Criar Pedido"}
                </button>
            </form>
        </div>
    );
};

export default OrderForm;

