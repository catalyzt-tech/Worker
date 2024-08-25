docker buildx build --platform linux/aarch64 --no-cache -t worker:v-25 --load .

docker tag worker:v-25 tgrziminiar/worker:v-25

docker push tgrziminiar/worker:v-25

docker run -d \
  -p 3001:3001 \
  --env-file .env \
  --name fukthis \
  worker:v-2

docker run -d \
  -p 3001:3001 \
  -v /etc/timezone:/etc/timezone:ro \
  --env-file .env \
  --name kuay \
  worker:v-8