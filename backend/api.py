from fastapi import FastAPI
import uvicorn
from orders import orders
from tables import tables
from menu import menu
from fastapi.middleware.cors import CORSMiddleware
from Shared.funcoes import seed_data


app = FastAPI()

seed_data()


# Configuração do middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir qualquer origem. Ajuste conforme necessário.
    allow_credentials=True,
    allow_methods=["*"],  # Permitir qualquer método HTTP.
    allow_headers=["*"],  # Permitir qualquer cabeçalho.
)

app.include_router(orders.router)
app.include_router(tables.router)
app.include_router(menu.router)

if __name__ == "__main__":
    uvicorn.run(app, port=8002)

