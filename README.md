# poc-nestjs-microservices

#how run the code
```
docker compose up -d --build --remove-orphans --force-recreate
```

Open a shell to read the logs of the services:
```
docker compose logs -f
```

Call the trigger endpoint on the front service (service A)
```
curl -X GET http://localhost:3002/trigger
```

Close all
```
docker compose down -v --remove-orphans
```