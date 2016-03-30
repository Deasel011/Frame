FROM node:4-onbuild


COPY package.json /src/package.json

RUN cd /src; npm install

COPY src/ /src/

EXPOSE 6004
EXPOSE 3001
EXPOSE 3001/udp
EXPOSE 6002

CMD ["node","/src/framereceivermain.js"]
