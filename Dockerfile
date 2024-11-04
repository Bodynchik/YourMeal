FROM node:20.10.0-alpine
WORKDIR /YourMeal
COPY . .
RUN npm i
RUN npm install http-server
EXPOSE 3000 8080
CMD ["sh", "-c", "npx json-server db.json -p 3000 & npx http-server . -p 8080"]