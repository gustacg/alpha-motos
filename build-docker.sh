#!/bin/bash

# Script para build e push da imagem Docker
# Uso: ./build-docker.sh [tag]

set -e

# Configurações
IMAGE_NAME="gustacg/alpha-motos-crm"
TAG=${1:-"latest"}
FULL_IMAGE_NAME="$IMAGE_NAME:$TAG"

echo "🔨 Building Docker image: $FULL_IMAGE_NAME"

# Build da imagem
docker build -t $FULL_IMAGE_NAME .

echo "✅ Build completed successfully!"

# Perguntar se deseja fazer push
read -p "Deseja fazer push para o Docker Hub? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Pushing to Docker Hub..."
    docker push $FULL_IMAGE_NAME
    echo "✅ Push completed successfully!"
    echo "📦 Image available at: docker.io/$FULL_IMAGE_NAME"
else
    echo "ℹ️  Image built locally only"
fi

echo "🔍 Testing image locally..."
echo "Run: docker run -p 8080:80 $FULL_IMAGE_NAME"
