# 🚀 Smart Campus System - Quick Reference Cheatsheet

## 📁 File Structure to Create

```
smart-campus/
├── .env                          ← Root environment file
├── .gitignore                    ← Git ignore file
├── docker-compose.yml            ← Container orchestration
├── README.md                     ← Project overview
├── DEPLOYMENT_GUIDE.md           ← Deployment steps
│
├── backend/
│   ├── server.js                 ← Express API server
│   ├── package.json              ← Node dependencies
│   ├── .env                      ← Backend config
│   └── Dockerfile.backend        ← Backend container
│
├── frontend/
│   ├── index.html                ← Complete UI (CSS+JS)
│   ├── nginx.conf                ← Nginx proxy config
│   ├── .env                      ← Frontend config
│   └── Dockerfile.frontend       ← Frontend container
│
└── database/
    └── init.sql                  ← MySQL schema
```

---

## ⚡ Quick Commands

### Local Development
```bash
# Build all images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Restart one service
docker-compose restart backend
```

### On EC2 Server
```bash
# SSH into server
ssh -i key.pem ubuntu@ec2-ip

# Clone and deploy
git clone https://github.com/username/smart-campus-system.git
cd smart-campus-system
docker-compose up -d

# Check status
docker ps
docker-compose logs backend
```

### Database Operations
```bash
# Access MySQL
docker-compose exec database mysql -u campusadmin -p smart_campus

# Backup database
docker exec smart-campus-db mysqldump -u campusadmin -p smart_campus > backup.sql

# Restore database
docker exec -i smart-campus-db mysql -u campusadmin -p smart_campus < backup.sql
```

### Troubleshooting
```bash
# Check API health
curl http://localhost:5000/health

# View specific logs
docker logs smart-campus-backend
docker logs smart-campus-frontend
docker logs smart-campus-db

# Check port usage
sudo netstat -tlnp | grep 80
sudo netstat -tlnp | grep 5000
sudo netstat -tlnp | grep 3306
```

---

## 🔑 Environment Variables

### Root .env
```env
DB_HOST=database
DB_PORT=3306
DB_USER=campusadmin
DB_PASSWORD=SecurePassword@2024
DB_NAME=smart_campus
NODE_ENV=production
```

### For AWS RDS
```env
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_USER=campusadmin
DB_PASSWORD=your-password
DB_NAME=smart_campus
```

---

## 🌐 Access Points

| Component | URL | Port |
|-----------|-----|------|
| Frontend | http://localhost | 80 |
| Backend API | http://localhost:5000 | 5000 |
| MySQL | localhost:3306 | 3306 |
| API Health | http://localhost:5000/health | 5000 |

---

## 📊 Key API Routes

```bash
# Students
GET    /api/students              # All students
POST   /api/students              # Create student
PUT    /api/students/:id          # Update student
DELETE /api/students/:id          # Delete student

# Exams
GET    /api/exams                 # All exams
POST   /api/exams                 # Create exam

# Attendance
GET    /api/attendance            # All attendance
POST   /api/attendance            # Create record

# Reports
GET    /api/dashboard/stats       # Statistics
GET    /api/dashboard/report      # Full report
GET    /health                    # Health check
```

---

## 🐳 Docker Concepts

### Container Lifecycle
```
docker-compose up        → Start containers
docker-compose pause     → Pause containers
docker-compose unpause   → Resume containers
docker-compose restart   → Restart containers
docker-compose down      → Stop & remove containers
docker-compose down -v   → Stop & remove data too
```

### Monitoring
```
docker ps                 → List running containers
docker ps -a             → All containers (running + stopped)
docker logs <container>  → View container logs
docker stats             → Real-time resource usage
docker exec -it <container> bash → Enter container shell
```

---

## ✅ Deployment Checklist

### Before First Deploy
- [ ] Clone repository from GitHub
- [ ] Update .env with correct credentials
- [ ] Test docker-compose build locally
- [ ] Push final version to GitHub

### On EC2
- [ ] SSH into instance
- [ ] Clone repository
- [ ] Verify .env file exists
- [ ] Run `docker-compose build`
- [ ] Run `docker-compose up -d`
- [ ] Check `docker ps` (3 containers running)
- [ ] Test `curl http://localhost:5000/health`
- [ ] Access frontend from browser

### Post-Deploy
- [ ] Add security group rules (if needed)
- [ ] Setup Elastic IP
- [ ] Configure domain DNS
- [ ] Setup SSL certificate
- [ ] Monitor logs for errors
- [ ] Create database backup

---

## 🆘 Emergency Commands

### Restart Everything
```bash
docker-compose down
docker-compose build
docker-compose up -d
docker ps
```

### Reset Database (WARNING!)
```bash
docker-compose down -v
docker volume ls  # Verify volume deleted
docker-compose up -d
# Database will reinitialize from init.sql
```

### Free Up Space
```bash
docker system prune -a   # Remove unused images
docker volume prune      # Remove unused volumes
docker container prune   # Remove stopped containers
```

### View All Details
```bash
docker-compose config   # Full config
docker-compose ps       # Container status
docker images          # List images
docker volume ls       # List volumes
docker network ls      # List networks
```

---

## 🔗 GitHub Commands

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main

# Updates
git add .
git commit -m "Description of changes"
git push origin main

# Clone on EC2
git clone https://github.com/username/repo.git

# Update from GitHub
git pull origin main
docker-compose build
docker-compose up -d
```

---

## 📈 Performance Tips

### Optimize Docker
- Use lightweight base images (Alpine Linux)
- Multi-stage builds
- Minimize layer count
- Cache dependencies

### Optimize Database
- Add indexes to frequently searched columns
- Use connection pooling (already done)
- Archive old data periodically
- Regular backups

### Optimize Frontend
- Enable gzip compression (done in nginx.conf)
- Browser caching headers (done)
- Minimize CSS/JS
- Lazy load large content

### Optimize Backend
- Connection pooling (done)
- Avoid N+1 queries
- Use pagination for large datasets
- Implement rate limiting

---

## 🔒 Security Reminders

⚠️ **NEVER**
- Commit .env file with real passwords
- Use default passwords in production
- Expose database to public internet
- Skip SSL/TLS on production
- Run containers as root
- Ignore security updates

✅ **ALWAYS**
- Use strong passwords
- Keep Docker updated
- Monitor access logs
- Use environment variables for secrets
- Regular backups
- Test disaster recovery
- Use security headers (done in nginx.conf)

---

## 📞 Help & Support

### Error: "Cannot connect to Docker daemon"
```bash
sudo systemctl start docker
sudo usermod -aG docker ubuntu
newgrp docker
```

### Error: "Port 80 already in use"
```bash
sudo lsof -i :80
sudo kill -9 <PID>
# Or change port in docker-compose.yml
```

### Error: "Database connection timeout"
```bash
# Wait for database to start (takes ~30 seconds)
sleep 30
docker-compose logs database
# Check if database is healthy
docker ps | grep database
```

### Error: "Backend returning 500 errors"
```bash
docker logs smart-campus-backend
# Check error message and fix
# Most common: DB connection, wrong .env vars
```

---

## 🎯 Success Indicators

✅ Application is working correctly if:
- `docker ps` shows 3 containers
- `curl http://localhost:5000/health` returns 200 OK
- Frontend loads without errors
- Can add/view students from UI
- Database shows data in tables
- No errors in logs (docker-compose logs)

---

## 📚 Additional Resources

- **Docker Docs**: https://docs.docker.com
- **Express.js**: https://expressjs.com
- **MySQL**: https://dev.mysql.com
- **Nginx**: https://nginx.org
- **AWS EC2**: https://aws.amazon.com/ec2

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Author**: Merlin Assistant