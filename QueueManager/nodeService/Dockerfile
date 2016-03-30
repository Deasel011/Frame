FROM node:4-onbuild


COPY package.json /nodeservice/package.json

RUN cd /nodeservice; npm install

COPY  *.js /nodeservice/

EXPOSE 6003
EXPOSE 6002

CMD ["node","/nodeservice/nodeservicemain.js"]
