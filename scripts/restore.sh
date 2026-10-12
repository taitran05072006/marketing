#!/bin/bash
# scripts/restore.sh - Restore MySQL Database
set -e
if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file.sql.gz>"
  exit 1
fi

echo "Restoring from $1..."
gunzip -c "$1" | docker exec -i marketing-mysql sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" marketing'
echo "Restore complete."
