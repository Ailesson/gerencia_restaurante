from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from Shared.database import get_db
from Shared.funcoes import reset_auto_increment
from Shared.models import Menu_Item
from menu.Schemas import MenuResponse, MenuRequest


router =  APIRouter(prefix='/menu')

@router.get('', response_model= List[MenuResponse])
def lista_menu(db: Session = Depends(get_db)):
    lista_menu = db.query(Menu_Item).all()
    lista_menu_response=[]
    for menu in lista_menu:
        lista_menu_response.append(MenuResponse(id=menu.id, name=menu.name, price=menu.price))
    
    return lista_menu_response
    
@router.post('')
def add_menu_item(item: MenuRequest, db: Session = Depends(get_db)):
    novo_item=Menu_Item(name= item.name, price=item.price) 
    db.add(novo_item)
    db.commit()
    db.refresh(novo_item)
   
    return MenuResponse(id=novo_item.id, name=novo_item.name,price=novo_item.price)

@router.delete('')
def delete_menu_item(menuId: int, db: Session = Depends(get_db)):
    item=db.query(Menu_Item).filter(Menu_Item.id==menuId).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    db.delete(item)
    db.commit()
    reset_auto_increment('menu_item', db)
    return {'message': "item deletado"}
