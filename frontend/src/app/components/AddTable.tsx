import React, { useState } from 'react';
import { mesa_response, createTable } from '../services/tableservice'; // Tipos de resposta, se você tiver um arquivo de tipos

const CriarMesa = () => {
  const [status, setStatus] = useState('');
  const [mesaId, setMesaId] = useState<number | null>(null);
  const [error, setError] = useState('');
  

  const handleCreateTable = async () => {
    try {
      const data: mesa_response = await createTable();

      setMesaId(data.id);
      setStatus('Mesa criada com sucesso!');
    } catch (err) {
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
