from datetime import date, datetime, timezone
from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, String
from Shared.database import Base

class Table(Base):
    __tablename__= 'mesa'
    
    id = Column('id',Integer, primary_key=True, autoincrement=True)
    status = Column("status", Boolean)

    def __init__(self, status = True):
        self.status=status

class Menu_Item(Base):
    __tablename__= 'menu_item'

    id = Column('id',Integer, primary_key=True, autoincrement=True)
    name = Column("name",String(50))
    price = Column("price",Integer)

    def __init__(self, name, price):
        self.name=name
        self.price=price


class Order(Base):
    __tablename__ = 'order'

    id = Column('id',Integer, primary_key=True, autoincrement=True)
    table_id = Column("table_id",ForeignKey('mesa.id'))
    total_price = Column("total_price", Integer, default=0)
    created_at = Column("created_at", DateTime, default=datetime.now(timezone.utc))

    def __init__(self, table_id, total_price):
        self.table_id=table_id
        self.total_price=total_price

class Order_Item(Base):
    __tablename__ = 'order_item'

    id = Column('id',Integer, primary_key=True, autoincrement=True)
    order_id = Column(ForeignKey('order.id'))
    menu_item_id = Column(ForeignKey('menu_item.id'))
    quantity = Column(Integer)

    def __init__(self, order_id, menu_item_id, quantity):
        self.order_id=order_id
        self.menu_item_id=menu_item_id
        self.quantity=quantity

class OrderDay(Base):
   __tablename__ = 'order_hoje'

   id = Column('id',Integer, primary_key=True, autoincrement=True)
   quantity = Column(Integer) 
   total= Column(Integer)
   day = Column(Date, default=lambda: date.today()) 