docker buildx build --platform linux/arm64 -t worker:v-1 --load .

docker tag worker:v-1 tgrziminiar/worker:v-1

docker push tgrziminiar/worker:v-1

docker run -d \
  -p 3001:3001 \
  --env-file .env \
  --name fukthis \
  worker:v-1