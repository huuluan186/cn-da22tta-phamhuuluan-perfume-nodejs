#!/bin/sh
# Chờ DB container khởi động
DB_HOST_TO_USE=${DOCKER_DB_HOST:-$DB_HOST}
DB_PORT_TO_USE=${DOCKER_DB_PORT:-$DB_PORT}

echo "⏳ Waiting for MySQL at $DB_HOST_TO_USE:$DB_PORT_TO_USE..."
until nc -z $DB_HOST_TO_USE $DB_PORT_TO_USE; do
  sleep 2
done

echo "✅ MySQL is up! Running migrations..."
npx sequelize db:migrate --config ./src/config/config.js --migrations-path ./src/migrations

echo "🌱 Running seeders..."
npx sequelize db:seed:all --config ./src/config/config.js --seeders-path ./src/seeders

echo "🚀 Starting server..."
npm run dev
