from datetime import date, datetime
from fastapi import Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from Shared.models import Menu_Item, Order, Order_Item, Table
from orders.Schemas import order_item_response, pedido_request, pedido_response
from Shared.database import SessionLocal


def real2centavos(real):
    return real*100

def centavo2real(centavo):
    return centavo/100

def order_item_db4resposnse(pedido_id: int,db: Session):
    order_item_list=db.query(Order_Item).filter(Order_Item.order_id==pedido_id).all()
    order_item_list_response=[]
    for order_item in order_item_list:
       order_item_response_=order_item_response(id=order_item.id,order_id=order_item.order_id,menu_item_id=order_item.menu_item_id,quantity=order_item.quantity)
       order_item_list_response.append(order_item_response_) 

    return order_item_list_response

def calc_total_price(pedido: pedido_request, db: Session):
    total_price_item=0
    for i in range(len(pedido.order_item)):
        item=db.query(Menu_Item).filter(Menu_Item.id==pedido.order_item[i]).first()
        valor_item=item.price*pedido.quantity_item[i]
        total_price_item+=valor_item
    return total_price_item

def teste(pedido: pedido_request, novo_pedido_id: int, db: Session):
    order_item_list=[]
    for i in range(len(pedido.order_item)):
        novo_order_item=Order_Item(order_id=novo_pedido_id, menu_item_id=pedido.order_item[i], quantity=pedido.quantity_item[i])
        db.add(novo_order_item)
        db.commit()
        db.refresh(novo_order_item)

        order_item_list.append(order_item_response(id=novo_order_item.id,
                                                   order_id=novo_order_item.order_id,
                                                   menu_item_id=novo_order_item.menu_item_id,
                                                   quantity=novo_order_item.quantity))
    return order_item_list

def pedido4mesa(table_id: int, db: Session) -> list:
    pedido = db.query(Order).filter(Order.table_id == table_id).first()
    lista_pedidos_response=[]
    if pedido is not None:
        lista_pedidos_response = order_item_db4resposnse(pedido.id,db)
       
    return lista_pedidos_response

def delete_order_intem(pedido_id: int, db: Session):
    status=False
    order_item_list=db.query(Order_Item).filter(Order_Item.order_id==pedido_id).all()
    for order_item in order_item_list:
        db.delete(order_item)
        db.commit()
    status=True


# Função para reiniciar o auto-increment de uma tabela
def reset_auto_increment(tabela: str, db: Session):
    try:
        # Executa o comando SQL para reiniciar o auto-increment
        query = text(f"ALTER TABLE {tabela} AUTO_INCREMENT = 1;")
        db.execute(query)  # Executa o comando SQL
        db.commit()  # Commit após a execução
        print(f"Auto-increment da tabela {tabela} reiniciado.")
    except Exception as e:
        print(f"Erro ao reiniciar auto-increment: {e}")
        raise Exception("Erro ao reiniciar auto-increment")

def comparaDateTime_Date(d: date, dt: datetime):
    if dt.date() == d:
        return True
    else:
        return False
    

def seed_data():
    db = SessionLocal()  

    try:
        if not db.query(Menu_Item).first():
            itens = [
                Menu_Item(name="Peixe assado", price=3000),
                Menu_Item(name="Frango frito", price=1500),
                Menu_Item(name="Suco", price=500)
            ]
            db.add_all(itens)

        if not db.query(Table).first():
            mesas = [Table(), Table(), Table(), Table(), Table()]
            db.add_all(mesas)

        db.commit()
        print("✅ Dados iniciais inseridos!")
    except Exception as e:
        print(f"❌ Erro ao inserir os dados: {e}")
        db.rollback()
    finally:
        db.close()
