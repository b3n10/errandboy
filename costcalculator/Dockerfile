FROM node:10

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
RUN npm i --global gulp-cli
RUN gulp --version

COPY . .

EXPOSE 8080

# CMD ["gulp", "brs"]
# docker run --name brs -p 4444:8080 -p 4445:8081 -v $PWD:/usr/src/app -d noder gulp mywatch

