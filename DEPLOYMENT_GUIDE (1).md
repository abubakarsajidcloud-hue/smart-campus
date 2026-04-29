# Smart Campus System - Complete Deployment Guide

## 📋 Project Structure
```
smart-campus/
├── frontend/
│   ├── index.html
│   ├── nginx.conf
│   ├── Dockerfile.frontend
│   └── .env
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile.backend
│   └── .env
├── database/
│   └── init.sql
├── docker-compose.yml
└── .env (root)
```

---

## 🚀 STEP 1: Setup on Local Machine (VSCode)

### 1.1 Create Project Directory
```bash
# Create project folder
mkdir smart-campus
cd smart-campus

# Create subdirectories
mkdir frontend backend database
```

### 1.2 Setup Frontend Files
```bash
# Navigate to frontend folder
cd frontend

# Copy these files here:
# - index.html (with embedded CSS & JS)
# - nginx.conf
# - Dockerfile.frontend
# - .env (frontend.env renamed)

cd ..
```

### 1.3 Setup Backend Files
```bash
# Navigate to backend folder
cd backend

# Copy these files here:
# - server.js
# - package.json
# - Dockerfile.backend
# - .env (backend.env renamed)

cd ..
```

### 1.4 Setup Database Files
```bash
# Navigate to database folder
cd database

# Copy init.sql here

cd ..
```

### 1.5 Create Root .env File
Create a `.env` file in the root directory:

```env
# Root Environment Configuration for docker-compose.yml
DB_HOST=database
DB_PORT=3306
DB_USER=campusadmin
DB_PASSWORD=SecurePassword@2024
DB_NAME=smart_campus
NODE_ENV=production
```

### 1.6 Create .gitignore
```bash
# In root directory, create .gitignore
cat > .gitignore << EOF
node_modules/
.env
.env.local
.DS_Store
*.log
dist/
build/
EOF
```

---

## 📦 STEP 2: Git Repository Setup

### 2.1 Initialize Git Repository
```bash
# From root directory
git init
git add .
git commit -m "Initial commit: Smart Campus System Docker setup"
```

### 2.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create new repository: `smart-campus-system`
3. Choose Public/Private as per your requirement
4. DO NOT initialize with README (you already have content)

### 2.3 Push to GitHub
```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/smart-campus-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🏗️ STEP 3: AWS EC2 Setup

### 3.1 Launch EC2 Instance
1. **Go to EC2 Dashboard** in AWS Console
2. **Launch Instance** with these specs:
   - **AMI**: Ubuntu 22.04 LTS (Free Tier eligible)
   - **Instance Type**: t2.micro (or t2.small for better performance)
   - **Storage**: 20GB (or more)
   - **Security Group**: Allow inbound on ports 22, 80, 443
   - **Key Pair**: Create and download (.pem file)

### 3.2 Connect to EC2 Instance
```bash
# Set permissions on your key pair
chmod 400 your-key-pair.pem

# SSH into instance
ssh -i your-key-pair.pem ubuntu@your-ec2-public-ip
```

### 3.3 Update System
```bash
# Update package manager
sudo apt update && sudo apt upgrade -y

# Add user to sudoers if needed
sudo usermod -aG sudo ubuntu
```

---

## 🐳 STEP 4: Install Docker & Docker Compose

### 4.1 Install Docker
```bash
# Install Docker
sudo apt install -y docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group (no sudo needed)
sudo usermod -aG docker ubuntu

# Verify Docker
docker --version
```

### 4.2 Install Docker Compose
```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 4.3 Install Git
```bash
sudo apt install -y git
git --version
```

---

## 📥 STEP 5: Clone Repository on EC2

### 5.1 Clone from GitHub
```bash
# Navigate to home directory
cd ~

# Clone repository
git clone https://github.com/YOUR_USERNAME/smart-campus-system.git

# Navigate into project
cd smart-campus-system

# List files to verify
ls -la
```

### 5.2 Verify Directory Structure
```bash
tree -L 2
# Should show:
# .
# ├── .git
# ├── .gitignore
# ├── .env
# ├── docker-compose.yml
# ├── backend/
# ├── frontend/
# └── database/
```

---

## 🔧 STEP 6: Configure Environment Variables for AWS RDS

### 6.1 Create AWS RDS Database (Optional - for Production)
If using AWS RDS instead of local MySQL:

1. **Create RDS Instance**:
   - Engine: MySQL 8.0
   - DB Instance: db.t3.micro
   - Storage: 20GB
   - Username: campusadmin
   - Password: SecurePassword@2024
   - Public accessibility: Yes (or use within VPC)

2. **Update Root .env File** on EC2:
```bash
# SSH into EC2 and edit .env
nano .env

# Update with RDS endpoint:
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_USER=campusadmin
DB_PASSWORD=SecurePassword@2024
DB_NAME=smart_campus
NODE_ENV=production
```

### 6.2 If Using Local MySQL (Recommended for Testing)
```bash
# .env already configured for local MySQL
# No changes needed - docker-compose will create database
cat .env
```

---

## 🎯 STEP 7: Build Docker Images

### 7.1 Verify Docker Compose File
```bash
# From project root
docker-compose config

# Should output valid YAML configuration
```

### 7.2 Build Images
```bash
# Build all images (this may take 5-10 minutes first time)
docker-compose build

# Verify images created
docker images | grep smart-campus
```

---

## ▶️ STEP 8: Run Docker Containers

### 8.1 Start Containers in Detached Mode
```bash
# Start all services
docker-compose up -d

# Verify containers are running
docker ps

# Should show:
# - smart-campus-frontend (Nginx)
# - smart-campus-backend (Node.js)
# - smart-campus-db (MySQL)
```

### 8.2 Check Container Logs
```bash
# View all logs
docker-compose logs -f

# Or individual services:
docker logs smart-campus-backend
docker logs smart-campus-frontend
docker logs smart-campus-db

# Press Ctrl+C to exit logs
```

### 8.3 Verify Health Checks
```bash
# Check if services are healthy
docker-compose ps

# Wait 30-40 seconds for backend health check to pass
```

---

## 📡 STEP 9: Test API Connectivity

### 9.1 Test Backend Health
```bash
# From EC2 or your local machine
curl http://your-ec2-public-ip:5000/health

# Expected response:
# {"status":"Backend API is running","database":"Connected"}
```

### 9.2 Test API Endpoints
```bash
# Get all students (should be empty initially)
curl http://your-ec2-public-ip:5000/api/students

# Expected response:
# []
```

### 9.3 Test Frontend
```bash
# Open browser and navigate to:
http://your-ec2-public-ip

# Should display Smart Campus System homepage
```

---

## 🔐 STEP 10: Security & Domain Configuration

### 10.1 Setup SSL Certificate (Recommended)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get free SSL certificate (requires domain)
sudo certbot certonly --standalone -d your-domain.com

# Update nginx.conf to use SSL
# (Edit frontend/nginx.conf and rebuild)
```

### 10.2 Point Domain to EC2
1. In your domain registrar (GoDaddy, Namecheap, etc.)
2. Update A record to point to EC2's Elastic IP
3. Wait 24 hours for DNS propagation

### 10.3 Setup Elastic IP (Recommended)
```bash
# From AWS Console:
# EC2 → Elastic IPs → Allocate → Associate with your instance
# Now your IP won't change if instance restarts
```

---

## 🐛 STEP 11: Troubleshooting Common Errors

### Error: Database Connection Failed
```bash
# Check database logs
docker logs smart-campus-db

# Verify database is running
docker ps | grep database

# Restart database
docker-compose restart database

# Wait 30 seconds and check backend again
```

### Error: Backend API Not Responding
```bash
# Check backend logs
docker logs smart-campus-backend

# Verify environment variables
docker-compose config | grep DB_

# Restart backend
docker-compose restart backend
```

### Error: Frontend Not Loading
```bash
# Check Nginx logs
docker logs smart-campus-frontend

# Verify port 80 is not in use
sudo netstat -tlnp | grep 80

# Restart frontend
docker-compose restart frontend
```

### Error: Port Already in Use
```bash
# If port 80 or 5000 is already used:
sudo lsof -i :80
sudo lsof -i :5000

# Kill process (optional)
sudo kill -9 <PID>

# Or change ports in docker-compose.yml
```

---

## 📊 STEP 12: Database Management

### 12.1 Access MySQL Database
```bash
# Connect to MySQL container
docker exec -it smart-campus-db mysql -u campusadmin -p smart_campus

# Enter password when prompted
# (Password is in your .env file)

# Inside MySQL:
SHOW TABLES;
SELECT * FROM student;
EXIT;
```

### 12.2 Backup Database
```bash
# Create backup
docker exec smart-campus-db mysqldump -u campusadmin -p smart_campus > backup_$(date +%Y%m%d).sql

# Enter password when prompted
# Backup file will be in current directory
```

### 12.3 Restore Database
```bash
# Restore from backup
docker exec -i smart-campus-db mysql -u campusadmin -p smart_campus < backup_20240101.sql
```

---

## 🔄 STEP 13: Manage Containers

### 13.1 Stop All Containers
```bash
docker-compose down

# Verify containers stopped
docker ps
```

### 13.2 Start Containers Again
```bash
# Navigate to project directory
cd ~/smart-campus-system

# Start containers
docker-compose up -d

# Verify running
docker ps
```

### 13.3 View Container Logs
```bash
# Real-time logs
docker-compose logs -f

# Specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database

# Last 100 lines
docker-compose logs --tail=100
```

### 13.4 Update Code and Rebuild
```bash
# Pull latest changes from GitHub
git pull origin main

# Rebuild images
docker-compose build

# Start containers with new images
docker-compose up -d
```

---

## 📱 STEP 14: Monitor & Maintain

### 14.1 Monitor Resource Usage
```bash
# View real-time stats
docker stats

# Or individual container stats
docker stats smart-campus-backend
```

### 14.2 Setup Auto-Restart on Server Reboot
```bash
# Docker containers will auto-start if using:
# restart: unless-stopped (already in docker-compose.yml)

# Verify auto-start is enabled
docker inspect smart-campus-backend | grep "RestartPolicy" -A 5
```

### 14.3 Regular Maintenance
```bash
# Clean up unused images/volumes (monthly)
docker system prune -a

# Update containers when you push new code
git pull
docker-compose build
docker-compose up -d
```

---

## ✅ Deployment Checklist

- [ ] Created all project files locally
- [ ] Pushed to GitHub repository
- [ ] Cloned repository on EC2
- [ ] Docker and Docker Compose installed
- [ ] Environment variables configured in .env
- [ ] Docker images built successfully
- [ ] Containers running (docker ps shows 3 containers)
- [ ] Backend health check passing (curl /health)
- [ ] Frontend accessible from browser
- [ ] Can add/view students from UI
- [ ] Database connection working
- [ ] SSL certificate configured (if using domain)
- [ ] Backups scheduled (optional)

---

## 🎉 Success!
Your Smart Campus System is now running in Docker on EC2! 

**Access Points:**
- Frontend: http://your-ec2-public-ip
- API: http://your-ec2-public-ip:5000/api
- Database: your-ec2-private-ip:3306

---

## 📚 Additional Resources

- Docker Documentation: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- AWS EC2: https://docs.aws.amazon.com/ec2
- MySQL: https://dev.mysql.com/doc
- Nginx: https://nginx.org/en/docs

---

## 🆘 Need Help?

If you encounter errors:

1. **Check logs**: `docker-compose logs -f`
2. **Verify connectivity**: `curl http://localhost:5000/health`
3. **Restart containers**: `docker-compose restart`
4. **Review .env variables**: `cat .env`
5. **Check open ports**: `sudo netstat -tlnp`

Good luck! 🚀