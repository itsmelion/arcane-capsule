FROM node:alpine

RUN mkdir -p /opt/app

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# install dependencies first, in a different location for easier app bind mounting for local development
WORKDIR /opt
COPY package.json yarn.lock* package-lock.json* ./

RUN rm -rf node_modules && \
  npm install -g pm2 npm@latest && \
  npm cache verify && \
  npm install && \
  npm audit fix && \
  npm dedupe && \
  npm cache verify

ENV PATH /opt/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
WORKDIR /opt/app
COPY . /opt/app

CMD ["pm2-docker", "start", "--json", "pm2.json"]
