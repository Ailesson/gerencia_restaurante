# Usa a imagem do Node.js para construir o frontend
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do frontend
COPY . /app

# Instala as dependências
RUN npm install

# Compila o projeto
RUN npm run build

# Usa um servidor Nginx para servir os arquivos estáticos
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
