#!/bin/sh
set -e

python manage.py migrate --noinput
python manage.py collectstatic --noinput

# WhiteNoise serves Django admin statics; Cloudflare Pages serves the SPA.
# 2 workers fits a 1 GiB Droplet; override with WEB_CONCURRENCY if needed.
exec gunicorn config.wsgi:application \
  --bind "0.0.0.0:${PORT:-8000}" \
  --workers "${WEB_CONCURRENCY:-2}" \
  --timeout "${GUNICORN_TIMEOUT:-120}"
