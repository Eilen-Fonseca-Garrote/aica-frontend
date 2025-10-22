FROM node:22-alpine
RUN npm config set proxy http://192.168.205.251:3128
RUN npm config set https-proxy http://192.168.205.251:3128
ENV proxy http://192.168.205.251:3128
ENV https_proxy http://192.168.205.251:3128
WORKDIR /app
COPY ./package.json ./
RUN npm install . --force
COPY . .
RUN npm run build
CMD ["npm", "start"]
