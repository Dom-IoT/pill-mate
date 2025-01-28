ARG BUILD_FROM
FROM $BUILD_FROM

WORKDIR /app

RUN apk add --no-cache nginx nodejs npm

COPY . /app/

RUN bash build.sh

CMD [ "./run.sh" ]
