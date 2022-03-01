#!/usr/bin/env bash

echo "Buliding the env..."
cp ./app/.env.example ./app/.env
docker-compose --env-file=./app/.env up --build -d
