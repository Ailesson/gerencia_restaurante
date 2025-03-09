# Acesse o backend

## Com o Diretório já clonado execute os seguintes comandos: 

```bash

cd backend
python -m venv venv
source venv/bin/activate  # Para Linux/macOS
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



