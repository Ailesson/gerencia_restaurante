from datetime import date
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from Shared.funcoes import calc_total_price, delete_order_intem, order_item_db4resposnse, reset_auto_increment, teste
from .Schemas import order_item_response, pedido_request, pedido_response, busca_request
from Shared.models import Menu_Item, Order, Table, Order_Item

from Shared.database import get_db

router =  APIRouter(prefix='/orders')
    

@router.get('', response_model= List[pedido_response])
def listar_pedidos(db: Session = Depends(get_db)):
    lista_pedidos = db.query(Order).all()
    lista_pedidos_response=[]
    for pedido in lista_pedidos:
        lista_pedidos_response.append(
            pedido_response(id = pedido.id,
            table_id = pedido.table_id,
            total_price = pedido.total_price,
            created_at = pedido.created_at,
            order_item = order_item_db4resposnse(pedido.id,db))
            )
    return lista_pedidos_response

@router.post('', response_model=pedido_response, status_code=201)
def criar_pedido(pedido: pedido_request, db: Session = Depends(get_db)) -> pedido_response:
    mesa=db.query(Table).filter(Table.id==pedido.table_id).first()

    if not mesa or not mesa.status:
        raise HTTPException(status_code=404, detail="Mesa ocupada")
    
    mesa.status=False
    total_price_item=calc_total_price(pedido, db)

    novo_pedido=Order(table_id=pedido.table_id, total_price=total_price_item)

    db.add(novo_pedido)
    db.commit()
    db.refresh(novo_pedido)
    
    order_item_list=teste(pedido, novo_pedido.id, db)


    return pedido_response(id = novo_pedido.id,
    table_id = novo_pedido.table_id,
    total_price = novo_pedido.total_price,
    created_at = novo_pedido.created_at,
    order_item=order_item_list
    )

@router.get('/{id}', response_model=pedido_response)
def buscar_pedido_id(pedido_id: int,  db: Session = Depends(get_db)):

    pedido= db.query(Order).filter(Order.id==pedido_id).first()
    if pedido is None:
        raise HTTPException(status_code=404, detail="Pedido não encontrado") 

    return pedido_response(id = pedido.id,
        table_id = pedido.table_id,
        total_price = pedido.total_price,
        created_at = pedido.created_at,
        order_item = order_item_db4resposnse(pedido.id,db))

@router.put('/{id}', response_model=pedido_response)
def update_pedido(pedido_id: int,update: pedido_request, db: Session = Depends(get_db)):
   
    pedido= db.query(Order).filter(Order.id==pedido_id).first()
    if pedido is None:
        raise HTTPException(status_code=404, detail="Pedido não encontrado") 
    
    db.query(Order_Item).filter(Order_Item.order_id == pedido_id).delete()
  
    if pedido.table_id != update.table_id:
        nova_mesa = db.query(Table).filter(Table.id == update.table_id).first()
        if nova_mesa:
            nova_mesa.status = False

        mesa_anterior = db.query(Table).filter(Table.id == pedido.table_id).first()
        if mesa_anterior:
            mesa_anterior.status = True 

    pedido.table_id=update.table_id
    pedido.total_price=calc_total_price(update,db)

    db.commit()
    db.refresh(pedido)

    return pedido_response(id = pedido.id,
        table_id = pedido.table_id,
        total_price = pedido.total_price,
        created_at = pedido.created_at,
        order_item=teste(update, pedido.id, db))

@router.delete('/{id}')
def delete_pedido(pedido_id: int, db: Session = Depends(get_db)):

    pedido = db.query(Order).filter(Order.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    try:
        status = delete_order_intem(pedido_id, db)
        reset_auto_increment('order_item', db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao deletar itens do pedido: {str(e)}")

    mesa = db.query(Table).filter(Table.id == pedido.table_id).first()
    if mesa:
        mesa.status = True

    try:
        db.delete(pedido)
        db.commit()
        reset_auto_increment('order', db)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao deletar o pedido: {str(e)}")

    return {"message": "Pedido deletado com sucesso"}

# @router.get('/summary')
# def calc_agregado()