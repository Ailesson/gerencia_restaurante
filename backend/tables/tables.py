from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from Shared.funcoes import delete_order_intem, pedido4mesa, reset_auto_increment
from Shared.models import Order, Table
from Shared.database import get_db
from tables.Schemas import mesa_response, pedido4mesa_response

router =  APIRouter(prefix='/tables')

@router.post('', response_model=mesa_response)
def cria_mesa(db: Session = Depends(get_db)):
    status=True
    nova_mesa = Table(status) 

    db.add(nova_mesa)
    db.commit()
    db.refresh(nova_mesa) 

    return mesa_response(id=nova_mesa.id, status='criada')

@router.get('', response_model=List[pedido4mesa_response])
def listar_mesas(db: Session = Depends(get_db)):
    lista_mesa=db.query(Table).all()
    lista_pedido4mesa_response=[]

    for mesa in lista_mesa:
        total=0
        pedido = db.query(Order).filter(Order.table_id==mesa.id).first()
        if pedido:
            total=pedido.total_price
        pedidos = pedido4mesa(mesa.id, db)
        id=mesa.id
        status ='Aberta' if mesa.status else 'Fechada'
        lista_pedido4mesa_response.append(pedido4mesa_response(mesa_id=id, status=status, total=total, pedidos=pedidos))

    return lista_pedido4mesa_response

@router.post('/{id}/close')
def close_conta(mesa_id: int, db: Session = Depends(get_db)):

    mesa = db.query(Table).filter(Table.id == mesa_id).first()
    if mesa is None:
        raise HTTPException(status_code=404, detail="Mesa não encontrada")
    mesa.status = True
    db.commit()
    pedido= db.query(Order).filter(Order.table_id==mesa_id).first()
    status=delete_order_intem(pedido.id, db)
    reset_auto_increment('order_item', db)
    total=pedido.total_price
    db.delete(pedido)
    db.commit()

    return {"Total": total}


@router.delete('')
def deleteTable(mesaId, db: Session = Depends(get_db)):
    mesa = db.query(Table).filter(Table.id==mesaId).first()
    if not mesa:
        raise HTTPException(status_code=404, detail="Mesa não encontrada")
    db.delete(mesa)
    db.commit()
    reset_auto_increment('mesa', db)

    return {"message": "mesa deletada"}




