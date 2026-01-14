#!/bin/sh

set -e 

python manage.py collectstatic --no-input
python manage.py migrate 
python load_data.py

exec "$@"

