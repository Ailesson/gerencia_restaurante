"use client";
import React from "react"
import OrderList from "./components/OrderList";
import OrderForm from "./components/OrderForm";
import GetOrder from "./components/GetOrder";
import MenuList from "./components/MenuList";
import TableList from "./components/TableList";
import AddTable from "./components/AddTable";

const Home: React.FC = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mb-6">
          Gerenciamento de Pedidos
        </h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full max-w-6xl">
          <div className="flex flex-col gap-4 w-full md:w-1/3">
            <GetOrder />
            <MenuList />
          </div>
          <div className="w-full md:w-2/3">
            <OrderForm />
          </div>
        </div>
        <div className="mt-6 flex flex-col md:flex-row gap-6 w-full max-w-6xl">
          
          <div className="flex flex-col gap-4 w-full md:w-1/4">
            <AddTable />
            <TableList />
          </div>
          <div className="w-full md:w-3/4">
            <OrderList />
          </div>
        </div>
      </div>
    );
  };
  
  export default Home;
