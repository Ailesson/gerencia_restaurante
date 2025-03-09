import React, { useState } from 'react';
import { mesa_response, createTable } from '../services/tableservice'; // Tipos de resposta, se você tiver um arquivo de tipos

const CriarMesa = () => {
  const [status, setStatus] = useState('');
  const [mesaId, setMesaId] = useState<number | null>(null);
  const [error, setError] = useState('');
  

  // Função para criar mesa
  const handleCreateTable = async () => {
    try {
      const data: mesa_response = await createTable();

      // Se a criação da mesa for bem-sucedida, mostra as informações
      setMesaId(data.id);
      setStatus('Mesa criada com sucesso!');
    } catch (err) {
      // Caso ocorra um erro, mostra a mensagem de erro
      setError('Erro ao criar mesa!');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Criar Nova Mesa</h2>
      <button onClick={handleCreateTable}>Criar Mesa</button>

      {status && <p>{status}</p>}
      {mesaId && <p>ID da Mesa: {mesaId}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CriarMesa;
