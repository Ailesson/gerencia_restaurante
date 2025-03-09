"use client";

import React, { useEffect, useState } from "react";
import { getMenu, MenuResponse } from "../services/menuservices";

const Menu: React.FC = () => {
    const [menu, setMenu] = useState<MenuResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const data = await getMenu();
                setMenu(data);
            } catch (err) {
                setError("Erro ao carregar o menu.");
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    return (
        <div className="mt-10 p-4 bg-white shadow-md rounded-lg max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4">Menu</h2>
            {loading && <p className="text-center">Carregando...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!loading && !error && (
                <ul className="space-y-2">
                    {menu.map((item) => (
                        <li key={item.id} className="p-3 bg-gray-100 rounded-md">
                             <span className="text-green-600 font-bold">{item.id}</span> - <strong>{item.name}</strong> - R${(item.price / 100).toFixed(2)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Menu;
