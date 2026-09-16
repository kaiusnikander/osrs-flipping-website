#!/bin/sh
set -e

npx prisma db push
npm run db:seed
exec node server.js