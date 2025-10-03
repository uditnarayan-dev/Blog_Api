#!/bin/bash
set -e

# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3-pip python3-venv libpq-dev postgresql postgresql-contrib nginx

# Create project dir
cd /home/ubuntu
git clone https://github.com/uditnarayan-dev/Blog_Api.git blogapi
cd blogapi

# Setup virtualenv
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install --upgrade pip
pip install -r requirements.txt gunicorn

# Collect static files
python manage.py collectstatic --noinput

# Apply migrations
python manage.py migrate

# Setup Gunicorn service
sudo cp deploy/gunicorn/blogapi.service /etc/systemd/system/
sudo systemctl start blogapi
sudo systemctl enable blogapi

# Setup Nginx
sudo cp deploy/nginx/blogapi.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/blogapi.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
