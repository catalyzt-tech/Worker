docker buildx build --platform linux/aarch64 -t worker:v-39 --load .

docker tag worker:v-39 tgrziminiar/worker:v-39

docker push tgrziminiar/worker:v-39

docker run -d \
  -p 3002:3002 \
  --env-file .env \
  --name fukthis \
  worker:v-36

docker run -d \
  -p 3001:3001 \
  -v /etc/timezone:/etc/timezone:ro \
  --env-file .env \
  --name kuay \
  worker:v-8