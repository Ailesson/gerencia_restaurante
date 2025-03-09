from pydantic import BaseModel
from datetime import datetime

class order_item_response(BaseModel):
    id: int
    order_id: int
    menu_item_id: int
    quantity: int

    class Config:
        from_attributes = True


class pedido_response(BaseModel):
    id: int
    table_id: int
    total_price: int
    created_at: datetime
    order_item: list[order_item_response]

    class Config:
        from_attributes = True

class pedido_request(BaseModel):
    table_id: int
    order_item: list[int]
    quantity_item: list[int]

    class Config:
        from_attributes = True

class busca_request(BaseModel):
    id: int

    class Config:
        from_attributes = True