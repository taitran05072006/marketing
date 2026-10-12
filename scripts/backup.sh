#!/bin/bash
# scripts/backup.sh - Backup MySQL Database
set -e
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_${TIMESTAMP}.sql.gz"

echo "Backing up marketing database..."
docker exec marketing-mysql sh -c 'exec mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" --opt marketing' | gzip > "$BACKUP_FILE"
echo "Backup saved to $BACKUP_FILE"
