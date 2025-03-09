from pydantic import BaseModel


class MenuResponse(BaseModel):
   id: int
   name: str
   price: float 

class MenuRequest(BaseModel):
   name: str
   price: float 