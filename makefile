run:
	$(MAKE) -j 2 run-backend run-frontend

run-backend:
	docker compose start && cd backend && ../venv/bin/python manage.py runserver

run-frontend:
	cd frontend && npm run dev

stop:
	docker compose stop
	pkill -f "manage.py runserver" || true
	pkill -f "vite" || true