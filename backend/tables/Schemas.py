from pydantic import BaseModel
from orders.Schemas import order_item_response


class mesa_response(BaseModel):
    id: int
    status: str

class pedido4mesa_response(BaseModel):
    mesa_id: int
    status: str
    total: int
    pedidos: list[order_item_response]