import { useState } from "react";
import { findOrder, pedido_response } from "../services/orderservices";


const GetOrder: React.FC = () => {
 
  const [id, setId] = useState("");
  const [order, setOrder] = useState<pedido_response | null>(null);
  const [error, setError] = useState("");

  const handleFindOrder = async () => {
    const parsedId = Number(id);
    if (!isNaN(parsedId) && parsedId > 0) {
        try {
            const foundOrder = await findOrder(parsedId);
            setOrder(foundOrder);
            setError("");
        } catch (error) {
            console.error("Erro na requisição:");
            setError("Pedido não encontrado.");
            setOrder(null);
        }
    } else {
      setError("Por favor, insira um ID válido.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Buscar Pedido</h2>
      <input
        type="number"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="border p-2 rounded-md w-full mb-2"
        placeholder="Digite o ID do pedido"
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        onClick={handleFindOrder}
        className="bg-blue-600 text-white p-2 rounded-md w-full hover:bg-blue-700"
      >
        Buscar Pedido
      </button>
      {order && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <h3 className="font-semibold">Detalhes do Pedido</h3>
          <p><strong>ID:</strong> {order.id || "Não disponível"}</p>
          <p><strong>Mesa:</strong> {order.table_id || "Não disponível"}</p>
          <p><strong>Total:</strong> R${(order.total_price / 100).toFixed(2) || "Não disponível"}</p>
          <p><strong>Criado em:</strong> {new Date(order.created_at).toLocaleString() || "Não disponível"}</p>

          <h4 className="font-semibold mt-2">Itens:</h4>
          {order?.order_item?.length > 0 ? (          
          <ul className="space-y-1">
            {order.order_item.map((item, index) => (
              <li key={index} className="text-sm">
                Item ID: {item.menu_item_id} - Quantidade: {item.quantity}
              </li>
            ))}
          </ul>
          ) : (
          <p>Nenhum item encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GetOrder;