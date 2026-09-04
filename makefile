run:
	$(MAKE) -j 2 run-backend run-frontend

run-backend:
	docker compose start && cd backend && ../venv/bin/python manage.py runserver

run-frontend:
	cd frontend && npm run dev

# Build the production backend image (Gunicorn entrypoint)
docker-backend:
	docker build -t rosetta-backend ./backend

# Production stack (Droplet): web + Postgres — requires .env.prod
prod-up:
	docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build

prod-down:
	docker compose --env-file .env.prod -f docker-compose.prod.yml down

# For host cron on the Droplet (no Celery)
prod-fetch-prices:
	docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T web python manage.py fetch_prices

stop:
	docker compose stop
	pkill -f "manage.py runserver" || true
	pkill -f "vite" || true