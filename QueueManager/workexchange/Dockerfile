FROM node:4-onbuild


COPY package.json /exchange/package.json

RUN cd /exchange; npm install

COPY  *.js /exchange/

EXPOSE 6003

CMD ["node","/exchange/main.js"]
