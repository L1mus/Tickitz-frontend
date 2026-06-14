FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
COPY package-lock.json package.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 200

CMD ["nginx", "-g", "daemon off;"]

#port forwading
##netsh interface portproxy add v4tov4 listenport=200 listenaddress=0.0.0.0 connectport=200 connectaddress=172.22.207.203

#Set Firewall
##New-NetFirewallRule -DisplayName "Akses Port 200 E-Wallet Aqil" -Direction Inbound -LocalPort 200 -Protocol TCP -Action Allow