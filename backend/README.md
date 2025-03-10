# Acesse o backend

## Com o Diretório já clonado execute os seguintes comandos: 

```bash

cd backend
python3 -m venv venv # Para Linux
python -m venv venv # Para Windows
source venv/bin/activate  # Para Linux
venv\Scripts\activate  # Para Windows
pip install -r requirements.txt

```

# Banco de Dados
Caso não possua um banco de dados em sua máquina, com o MariaDB já instalado, execute os seguintes comando em seu terminal

```bash

mysql -u root -p
CREATE DATABASE gerencia_restaurante;
CREATE USER 'usuario'@'localhost' IDENTIFIED BY '123';
GRANT ALL PRIVILEGES ON gerencia_restaurante.* TO 'usuario'@'localhost';
FLUSH PRIVILEGES;

```

### Conectando ao backend

Com o banco de dados criado adicione os dados necessários no arquivo .env
```bash
DATABASE_USER= usuario
DATABASE_HOST=localhost
DATABASE_PASSWORD=123
DATABASE_NAME=gerencia_restaurante
DATABASE_PORT=3306

```
### No arquivo alembic.ini 

```bash
sqlalchemy.url = mysql+pymysql://usuario:123@localhost:3306/gerencia_restaurante
```

### Migrando as tabelas do projeto para o banco de dados mude a sqlalchemy.url para os seus dados, exemplo:

```bash
alembic upgrade head
```

### Iniciando api
```bash
python3 api.py # Para Linux
python api.py # Para Windows
```

A API estará disponivel em : http://localhost:8002/docs#/

Siga para o README.md do diretório frontend


