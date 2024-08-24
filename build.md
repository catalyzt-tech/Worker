docker buildx build --platform linux/aarch64 -t worker:latest --load .

docker tag worker:latest tgrziminiar/worker:latest

docker push tgrziminiar/worker:latest

docker run -d \
  -p 3001:3001 \
  --env-file .env \
  --name fukthis \
  worker:latest