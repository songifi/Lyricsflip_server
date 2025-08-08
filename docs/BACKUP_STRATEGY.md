PostgreSQL Backup and Recovery Plan
This document outlines the strategy for backing up and recovering the application's PostgreSQL database using standard command-line tools.

1. Automated Backups
Automated backups are essential for data safety. The recommended approach is to use pg_dump in a scheduled script (e.g., a cron job on a Linux server) to create regular backups.

Backup Command:

This command will dump the entire database into a single compressed file. You should run this on your database server or a machine with secure access to it.

# This command connects to the database and outputs a compressed SQL file.
# The file is timestamped for easy identification.
pg_dump -U your_db_user -h localhost your_db_name | gzip > backup_$(date +%Y-%m-%d_%H-%M-%S).sql.gz

You will be prompted for your database password. For automated scripts, use a .pgpass file to store credentials securely.

Recommendation: Schedule this command to run at least once daily during off-peak hours. Store the backup files in a secure, remote location (like Amazon S3, Google Cloud Storage, or another server).

2. Recovery Procedure
Recovery is the process of restoring the database from a backup file. This is performed when you need to recover from data loss.

Recovery Command:

First, you would typically drop the existing database to ensure a clean restore. Then, you recreate it and restore the data from your backup file.

# 1. Connect to psql
psql -U your_db_user -h localhost

# 2. (Inside psql) Drop the old database if it exists
DROP DATABASE your_db_name;

# 3. (Inside psql) Re-create the database
CREATE DATABASE your_db_name WITH OWNER your_db_user;

# 4. Exit psql
\q

# 5. Restore the database from your backup file
gunzip < your_backup_file.sql.gz | psql -U your_db_user -h localhost your_db_name

Important: Always test your recovery procedure periodically in a non-production environment to ensure your backups are valid and the process works as expected.