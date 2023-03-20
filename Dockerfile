FROM node:18
COPY . .
RUN npm cache clean --force
RUN npm i
CMD ["node", "main.js"]
EXPOSE 8080