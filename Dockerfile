From node:8.11.4-alpine as builder

RUN apk update && \
    apk add git

ADD . /workspace
WORKDIR /workspace

#ARG BUILD_TOKEN
# RUN sed -i -E "s/git\+ssh:\/\/git/git\+https:\/\/oauth2:"$BUILD_TOKEN"/g" ./package.json
RUN npm install
# RUN sed -i -E "s/"$BUILD_TOKEN"/test/g" ./package.json


#Stage 2
From node:8.11.4-alpine
EXPOSE 8000

COPY --from=builder /workspace /workspace
WORKDIR /workspace

RUN npm install -g pm2

# Starting the server
CMD [ "pm2-docker", "process.json"]

# docker build --build-arg BUILD_TOKEN=<your access token> .
# docker run --name yolo --env-file=env -p 8080:8080 630248392506.dkr.ecr.ap-south-1.amazonaws.com/app/paybooks:latest