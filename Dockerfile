FROM node:lts-bullseye-slim

RUN apt-get -y update
RUN apt-get -y install git

# make the 'app' folder the current working directory
WORKDIR /app

RUN corepack enable

RUN npm i -g corepack

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./ yarn.lock ./

# install project dependencies
RUN yarn install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# EXPOSE 8080
# do yarn build
# CMD [ "yarn", "run" "dev"]
