FROM node:18

WORKDIR /app
COPY . .
# Dùng file .env.docker thay cho .env mặc định
COPY .env.docker .env

RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]
