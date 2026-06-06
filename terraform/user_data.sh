#!/bin/bash
# Exit on any error
set -e

# Update package repository
apt-get update -y
apt-get upgrade -y

# Install prerequisite packages
apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release

# Add Docker's official GPG key
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Ensure docker compose is aliased properly if needed (docker-compose-plugin provides "docker compose")
# Also install standalone docker-compose for convenience
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group so we can run docker commands without sudo
usermod -aG docker ubuntu

# Create deployment directory
mkdir -p /home/ubuntu/app
chown -R ubuntu:ubuntu /home/ubuntu/app

echo "User Data script completed successfully! Docker and Docker Compose are installed."
