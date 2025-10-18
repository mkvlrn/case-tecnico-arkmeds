#!/bin/sh
set -e

echo "running database migrations..."
npx prisma migrate deploy

echo "starting application..."
exec "$@"
