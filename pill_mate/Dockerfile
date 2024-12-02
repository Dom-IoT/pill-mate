ARG BUILD_FROM
FROM $BUILD_FROM

WORKDIR /app

RUN apk add --no-cache nginx nodejs npm

COPY . /app/

RUN cd backend && npm install && npm run build

RUN cd frontend && npm install && npm run build

CMD [ "./run.sh" ]
