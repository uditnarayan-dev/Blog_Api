#!/bin/bash
exec > /home/ubuntu/deploy.log 2>&1
set -e

# Update & install git
sudo apt update && sudo apt install -y git

# Clone repo
cd /home/ubuntu/projects
git clone https://github.com/uditnarayan-dev/Blog_Api.git


# Run setup
cd blogapi/deploy/scripts
bash setup.sh
