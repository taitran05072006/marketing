#!/bin/bash
# ==============================================================================
# Database Backup and Restore Script for Marketing (MySQL 8.0)
# ==============================================================================
set -e

CONTAINER_NAME="${DB_CONTAINER:-marketing-mysql}"
DB_NAME="${MYSQL_DATABASE:-marketing}"
DB_USER="${MYSQL_USER:-appuser}"
DB_PASS="${MYSQL_PASSWORD:-apppassword}"
BACKUP_DIR="./backups"

mkdir -p "$BACKUP_DIR"

usage() {
    echo "Sử dụng:"
    echo "  $0 backup                  # Tạo bản sao lưu Database"
    echo "  $0 restore <backup_file>   # Khôi phục Database từ tệp sql.gz"
    echo "  $0 verify                  # Kiểm tra cấu trúc bảng hiện tại"
    exit 1
}

backup() {
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql.gz"
    echo "==> Đang tiến hành backup database '$DB_NAME' từ container '$CONTAINER_NAME'..."
    docker exec "$CONTAINER_NAME" mysqldump -u"$DB_USER" -p"$DB_PASS" \
        --single-transaction \
        --quick \
        --routines \
        --triggers \
        "$DB_NAME" | gzip > "$BACKUP_FILE"
    echo "==> Backup hoàn tất thành công: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
}

restore() {
    FILE="$1"
    if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
        echo "Lỗi: Không tìm thấy tệp sao lưu: $FILE"
        exit 1
    fi
    echo "==> CẢNH BÁO: Thao tác này sẽ ghi đè dữ liệu trên database '$DB_NAME'!"
    read -p "Bạn có chắc chắn muốn khôi phục từ '$FILE'? (y/N): " CONFIRM
    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
        echo "Đã hủy thao tác khôi phục."
        exit 0
    fi
    echo "==> Đang tiến hành khôi phục database..."
    gunzip < "$FILE" | docker exec -i "$CONTAINER_NAME" mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME"
    echo "==> Khôi phục hoàn tất thành công!"
}

verify() {
    echo "==> Danh sách bảng trong database '$DB_NAME':"
    docker exec -i "$CONTAINER_NAME" mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES;"
}

case "$1" in
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    verify)
        verify
        ;;
    *)
        usage
        ;;
esac
