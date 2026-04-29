# 🔧 Smart Campus System - Troubleshooting & Common Errors

## 🚨 Critical Errors & Solutions

### ERROR 1: "Cannot connect to Docker daemon"

**Symptom:**
```
Cannot connect to Docker daemon at unix:///var/run/docker.sock
```

**Causes:**
- Docker service not running
- User doesn't have Docker permissions

**Solution:**
```bash
# Start Docker service
sudo systemctl start docker

# Add user to docker group
sudo usermod -aG docker ubuntu

# Apply group changes (logout/login or use)
newgrp docker

# Verify
docker ps
```

---

### ERROR 2: "Address already in use"

**Symptom:**
```
Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use
```

**Causes:**
- Port 80/5000/3306 already in use
- Previous container still running

**Solution:**
```bash
# Check what's using the port
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :5000
sudo netstat -tlnp | grep :3306

# Kill the process (if safe)
sudo kill -9 <PID>

# Or change ports in docker-compose.yml
# Change:
# ports:
#   - "8080:80"  # Use 8080 instead of 80
```

---

### ERROR 3: "Database connection refused"

**Symptom:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
Backend API: Database connection failed
```

**Causes:**
- MySQL container not started
- Wrong database credentials
- Wrong DB_HOST (should be "database" not "localhost" in docker)

**Solution:**
```bash
# Check if database container is running
docker ps | grep database

# If not running, start containers
docker-compose up -d

# Wait 30 seconds for database to initialize
sleep 30

# Check database logs
docker logs smart-campus-db

# Verify credentials in .env
cat .env

# Test connection
docker-compose exec database mysql -u campusadmin -p smart_campus
# Enter password: SecurePassword@2024
```

---

### ERROR 4: "Backend API not responding"

**Symptom:**
```
curl: (7) Failed to connect to localhost port 5000: Connection refused
Error: ECONNREFUSED 127.0.0.1:5000
```

**Causes:**
- Backend container crashed
- Port 5000 not exposed
- Backend service not starting

**Solution:**
```bash
# Check if backend container is running
docker ps | grep backend

# View backend logs
docker logs smart-campus-backend

# If container not running, check why it crashed
docker-compose logs backend --tail=50

# Restart backend
docker-compose restart backend

# Wait 10 seconds and test
sleep 10
curl http://localhost:5000/health

# If still failing, rebuild
docker-compose build backend
docker-compose up -d backend
```

---

### ERROR 5: "Frontend not loading / Blank page"

**Symptom:**
- Browser shows blank page or 404 error
- index.html not found

**Causes:**
- Nginx not running
- index.html not in correct location
- Port 80 not accessible

**Solution:**
```bash
# Check Nginx container
docker ps | grep frontend

# View Nginx logs
docker logs smart-campus-frontend

# Verify Nginx config
docker-compose exec frontend cat /etc/nginx/nginx.conf

# Restart Nginx
docker-compose restart frontend

# Test port 80 is open
curl http://localhost
# Should return HTML content

# If permissions issue
docker-compose exec frontend ls -la /usr/share/nginx/html/
```

---

### ERROR 6: "502 Bad Gateway"

**Symptom:**
```
502 Bad Gateway
Error connecting to backend
```

**Causes:**
- Backend server crashed
- Nginx can't reach backend
- Network issue between containers

**Solution:**
```bash
# Check if both frontend and backend are running
docker ps

# Test backend directly
curl http://localhost:5000/health

# Check Nginx proxy config
docker-compose exec frontend grep -A 10 "upstream backend" /etc/nginx/nginx.conf

# Verify containers can communicate
docker-compose exec frontend ping backend
docker-compose exec backend ping frontend

# Restart both services
docker-compose restart frontend backend

# Check logs
docker-compose logs --tail=20
```

---

### ERROR 7: "CORS errors in browser console"

**Symptom:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/students' 
from origin 'http://localhost' has been blocked by CORS policy
```

**Causes:**
- CORS not configured in backend
- Wrong API URL in frontend

**Solution:**
```bash
# Check backend CORS configuration
docker exec smart-campus-backend grep -n "cors" server.js

# Should include: app.use(cors());

# Verify frontend API URL
curl -s http://localhost/index.html | grep "API_BASE_URL"
# Should show correct API endpoint

# For production, update nginx.conf
docker-compose exec frontend cat /etc/nginx/nginx.conf | grep -A 5 "add_header.*Access-Control"
```

---

### ERROR 8: "Timeout waiting for database"

**Symptom:**
```
TIMEOUT Error: Database connection timeout after 10000ms
```

**Causes:**
- MySQL still initializing (first run takes time)
- RDS security group blocking connection
- Database username/password wrong

**Solution:**
```bash
# Wait longer for database to initialize (first run: 1-2 minutes)
sleep 60
docker-compose logs database

# If using RDS:
# - Check security group allows inbound on 3306
# - Verify credentials in .env
# - Test from EC2: mysql -h rds-endpoint.rds.amazonaws.com -u admin -p

# Check database initialization log
docker logs smart-campus-db | grep -i "ready"

# Force reinitialize database
docker-compose down -v
docker-compose up -d database
sleep 30
docker logs smart-campus-db
```

---

### ERROR 9: "File permission denied / Cannot write logs"

**Symptom:**
```
Permission denied: /var/log/nginx/access.log
EACCES: permission denied, open '/app/logs/error.log'
```

**Causes:**
- Wrong file permissions inside container
- Container running as wrong user

**Solution:**
```bash
# Check container user
docker exec smart-campus-backend whoami
docker exec smart-campus-frontend whoami

# Fix permissions (inside container)
docker-compose exec backend chmod -R 755 /app
docker-compose exec frontend chmod -R 755 /usr/share/nginx/html

# Or fix in Dockerfile by adding:
# RUN chown -R node:node /app
# USER node

# Rebuild and restart
docker-compose build
docker-compose up -d
```

---

### ERROR 10: "Out of memory / Container killed"

**Symptom:**
```
Container exited with code 137
Killed (SIGKILL)
Cannot allocate memory
```

**Causes:**
- Server running out of RAM
- Memory leaks in application
- Large data operations

**Solution:**
```bash
# Check memory usage
docker stats

# Check EC2 instance memory
free -h

# Set memory limits in docker-compose.yml
# Add under service:
# deploy:
#   resources:
#     limits:
#       memory: 512M

# Upgrade EC2 instance to higher tier
# (t2.small, t2.medium, etc.)

# Optimize application
# - Pagination in database queries
# - Connection pooling (already done)
# - Close unused connections
```

---

## ⚠️ Common Issues (Non-Critical)

### Issue: Slow Performance

**Diagnosis:**
```bash
# Check resource usage
docker stats

# Check database query performance
docker-compose exec database mysql -u campusadmin -p -e "SELECT * FROM student;"

# Check Nginx response time
tail -f docker logs smart-campus-frontend | grep "upstream_response_time"
```

**Solutions:**
- Add database indexes
- Enable query caching
- Increase EC2 instance size
- Enable gzip compression (already done in nginx.conf)

---

### Issue: Database grows too large

**Solution:**
```bash
# Check size
docker exec smart-campus-db du -sh /var/lib/mysql

# Archive old data
docker-compose exec database mysql -u campusadmin -p smart_campus \
  -e "DELETE FROM attendance WHERE YEAR(created_at) < 2024;"

# Regular backups
docker exec smart-campus-db mysqldump -u campusadmin -p smart_campus \
  | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

---

### Issue: Lost data after container restart

**Cause:**
- Using non-persistent storage
- Running without volumes

**Solution:**
```bash
# Verify volumes are used
docker-compose config | grep -A 5 "volumes:"

# Create backup before operations
docker exec smart-campus-db mysqldump -u campusadmin -p smart_campus > backup.sql

# Restore if data lost
docker exec -i smart-campus-db mysql -u campusadmin -p smart_campus < backup.sql
```

---

### Issue: Can't access from remote machine

**Cause:**
- Security group blocking traffic
- Firewall blocking port

**Solution (AWS):**
```bash
# Open EC2 security group for port 80
# In AWS Console:
# EC2 → Security Groups → Your Security Group
# Inbound Rules → Add Rule
# Type: HTTP, Port: 80, Source: 0.0.0.0/0 (or your IP)

# Test from local machine
curl http://your-ec2-public-ip
```

---

## 🔍 Debugging Techniques

### Enable Verbose Logging

```bash
# Backend with debug logs
docker-compose exec backend node server.js 2>&1 | grep -i error

# MySQL query logging
docker-compose exec database mysql -u campusadmin -p -e \
  "SET GLOBAL general_log = 'ON';"

# View Nginx access logs
docker logs smart-campus-frontend -f
```

### Monitor in Real-Time

```bash
# All containers
docker-compose logs -f

# Specific service with colors
docker-compose logs --follow backend

# Last N lines
docker-compose logs --tail=100

# Timestamps
docker-compose logs --timestamps
```

### Test Connectivity

```bash
# Between containers
docker-compose exec backend ping frontend
docker-compose exec frontend ping database
docker-compose exec database ping backend

# External connectivity
docker-compose exec backend curl https://www.google.com

# DNS resolution
docker-compose exec backend nslookup database
```

---

## 📋 Health Check Procedures

### Daily Checks

```bash
# 1. Container status
docker ps
# All 3 containers should be running/healthy

# 2. Backend health
curl http://localhost:5000/health

# 3. Frontend accessibility
curl -I http://localhost

# 4. Database connectivity
docker-compose exec backend mysql -u campusadmin -p -e "SELECT 1;"

# 5. Check logs for errors
docker-compose logs --since 1h | grep -i error
```

### Weekly Checks

```bash
# Check disk space
df -h
du -sh /var/lib/docker

# Check memory usage
free -h

# Review security logs
docker logs smart-campus-backend | grep -i "error\|denied"

# Backup database
docker exec smart-campus-db mysqldump -u campusadmin -p smart_campus > backup.sql
```

### Monthly Maintenance

```bash
# Update containers
git pull origin main
docker-compose build
docker-compose up -d

# Clean up unused images
docker system prune -a

# Optimize database
docker-compose exec database mysql -u campusadmin -p -e "OPTIMIZE TABLE student, exam, attendance;"

# Rotate logs
docker-compose logs --tail=1000 > /tmp/logs_backup.txt
```

---

## 🆘 Emergency Recovery

### Complete System Reset

```bash
# WARNING: This deletes all data!
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
docker-compose up -d

# Restore from backup if available
docker-compose exec -i database mysql -u campusadmin -p smart_campus < backup.sql
```

### Restore from Backup

```bash
# If you have a backup file
docker-compose exec -i database mysql -u campusadmin -p smart_campus < backup_20240101.sql

# Verify data
docker-compose exec database mysql -u campusadmin -p -e "SELECT COUNT(*) FROM student;"
```

---

## 📞 When Nothing Works

### Last Resort Checklist

1. **Restart Docker Daemon**
   ```bash
   sudo systemctl restart docker
   ```

2. **Clear Docker Cache**
   ```bash
   docker system prune -a --volumes
   ```

3. **Rebuild Everything**
   ```bash
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up -d
   ```

4. **Check System Resources**
   ```bash
   df -h              # Disk space
   free -h            # Memory
   top -b -n 1        # CPU usage
   ```

5. **Review EC2 Instance**
   - SSH connection working?
   - Instance status: running?
   - CPU/Memory adequate?
   - Security groups correct?

6. **Contact Support**
   - Share `docker-compose logs` output
   - Include .env file (without passwords)
   - Describe what was working before
   - List recent changes made

---

## 📚 Useful Debugging Commands

```bash
# Complete system info
docker-compose config
docker-compose ps --all
docker-compose logs --tail=200

# Network diagnostics
docker network ls
docker network inspect smart-campus-network

# Volume diagnostics
docker volume ls
docker volume inspect smart-campus_mysql-data

# Image info
docker images
docker inspect smart-campus-backend:latest

# Container shell access
docker exec -it smart-campus-backend /bin/bash
docker exec -it smart-campus-frontend /bin/bash
docker exec -it smart-campus-db /bin/bash

# Run one-off commands
docker-compose run backend npm list
docker-compose run database mysql -h database -u campusadmin -p -e "SHOW STATUS;"
```

---

**Last Updated**: January 2024  
**Status**: Comprehensive guide v1.0  
**Questions?** Check DEPLOYMENT_GUIDE.md or README.md