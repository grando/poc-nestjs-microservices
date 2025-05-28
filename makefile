up:
	sudo docker compose up -d --build --remove-orphans --force-recreate

rebuild: clean
	sudo docker compose build --no-cache 

clean: 
	sudo docker compose down --volumes
	sudo docker compose rm service-a
	sudo docker compose rm service-b

down:
	sudo docker compose down 

restart: down up ps

ps:
	sudo docker compose ps

logs:
	sudo docker compose logs -f

logs_b:
	sudo docker compose logs -f service-b

logs_a:
	sudo docker compose logs -f service-a

shell_b:
	sudo docker compose exec service-b sh

shell_a:
	sudo docker compose exec service-a sh
