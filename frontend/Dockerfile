# ---------- Build Stage ----------
FROM node:20.11.1-alpine as build-stage

# Set the working directory inside the container
WORKDIR /app

# Definiujemy argument do przyjęcia zmiennej podczas builda
ARG VITE_API_URL

# Ustawiamy jako ENV, żeby był dostępny dla aplikacji
ENV VITE_API_URL=${VITE_API_URL}

# Copy package.json and pnpm-lock.yaml to install production dependencies
COPY package.json pnpm-lock.yaml ./

RUN npm install
RUN ls
COPY . .
RUN npm run build

# Użyj serwera "serve" do uruchamiania aplikacji
RUN npm install -g serve

# Expose dynamiczny port
EXPOSE ${VITE_PORT}

# Uruchom aplikację z dynamicznym portem
CMD ["sh", "-c", "serve -s dist -l 7050"]

# # ---------- Production Stage ----------
# FROM nginx:stable-alpine as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]