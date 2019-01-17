FROM node:alpine
RUN echo '🐳 => Arcane Capsule API'
WORKDIR /usr/src/app

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json yarn.lock* /usr/src/app

RUN npm cache verify && \
npm install -g pm2 && \
npm install
# If you are building your code for production
# RUN npm install --only=production

ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Bundle app source
COPY . /usr/src/app

ARG PORT=1666
ENV PORT $PORT
EXPOSE $PORT

CMD ["pm2-docker", "start", "--json", "pm2.json"]
RUN echo '🐳 => Arcane Capsule API built! ✅'
