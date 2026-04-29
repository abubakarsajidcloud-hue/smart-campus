# 🚀 START HERE - Smart Campus System Setup Guide

Welcome! This document will guide you through setup in **simple steps**.

---

## ⚡ 5-Minute Overview

**What You Have:**
- A complete, production-ready Smart Campus System
- All code (frontend, backend, database)
- Docker configuration for easy deployment
- Comprehensive documentation

**What You Need:**
- Windows/Mac/Linux computer with VSCode
- Docker installed (free)
- AWS EC2 account (free tier available)
- ~2-3 hours for complete setup

**What You'll Get:**
- Working system running locally
- Code on GitHub (backed up)
- System deployed on AWS EC2 (accessible from internet)

---

## 📁 STEP 1: Organize Your Files (5 minutes)

### Create Folder Structure

```
Open VSCode → New Folder → "smart-campus-system"

Inside, create 3 folders:
├── frontend
├── backend
└── database
```

### Copy Backend Files

1. Create **backend/server.js** → Copy the `server.js` file content
2. Create **backend/package.json** → Copy the `package.json` file content
3. Create **backend/.env** → Copy the `.env` file content
4. Create **backend/Dockerfile.backend** → Copy the `Dockerfile.backend` file content

### Copy Frontend Files

1. Create **frontend/index.html** → Copy the `index.html` file content
2. Create **frontend/nginx.conf** → Copy the `nginx.conf` file content
3. Create **frontend/Dockerfile.frontend** → Copy the `Dockerfile.frontend` file content
4. Create **frontend/.env** → Copy the `frontend.env` file content (rename to `.env`)

### Copy Database Files

1. Create **database/init.sql** → Copy the `init.sql` file content

### Copy Root Files

1. Create **docker-compose.yml** → Copy the `docker-compose.yml` file content
2. Create **.env** → Copy the root `.env` file content
3. Create **.gitignore** → Add these lines:
```
node_modules/
.env
.DS_Store
*.log
```

✅ **Your folder should now have 13 files organized in 3 subdirectories**

---

## 🐳 STEP 2: Install Docker (5 minutes)

### Windows/Mac
1. Go to: https://www.docker.com/products/docker-desktop
2. Click "Download"
3. Install and follow setup wizard
4. Restart computer when asked

### Linux (Ubuntu)
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

### Verify Installation
```bash
docker --version        # Should show: Docker version X.X.X
docker-compose --version # Should show: Docker Compose version X.X.X
```

---

## ✅ STEP 3: Test Locally (30 minutes)

### Open Terminal in Your Project Folder

In VSCode: 
- Press Ctrl+` (backtick) to open terminal
- Or: Terminal → New Terminal

Make sure you're in the `smart-campus-system` folder:
```bash
pwd  # Should show: /path/to/smart-campus-system
```

### Build Docker Images

```bash
docker-compose build
```

⏳ **This will take 3-5 minutes first time** (downloads base images)

**Expected Output:**
```
Successfully built XXX
Successfully tagged smart-campus-backend:latest
Successfully built YYY
Successfully tagged smart-campus-frontend:latest
```

### Start the System

```bash
docker-compose up -d
```

### Verify It's Running

```bash
docker ps
```

**You should see 3 containers:**
```
smart-campus-frontend    (Nginx on port 80)
smart-campus-backend     (Node.js on port 5000)
smart-campus-db          (MySQL on port 3306)
```

### Test the Backend API

```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{"status":"Backend API is running","database":"Connected"}
```

### Open Frontend in Browser

Open your browser and go to:
```
http://localhost
```

**You should see: Smart Campus System homepage with forms**

✅ **Congratulations! Your system is running locally!**

---

## 📤 STEP 4: Push to GitHub (15 minutes)

### Create GitHub Account
1. Go to https://github.com
2. Sign up (free)

### Create Repository
1. Click "+" → New repository
2. Name: `smart-campus-system`
3. Description: Smart Campus Management System
4. Click "Create repository"

### Push Your Code

In your terminal:

```bash
# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Smart Campus System"

# Add remote (copy from GitHub)
git remote add origin https://github.com/YOUR_USERNAME/smart-campus-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub and backed up!**

---

## ☁️ STEP 5: Deploy to AWS EC2 (1-2 hours)

### 5.1 Create AWS Account
1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Follow setup (free tier available)

### 5.2 Create EC2 Instance

**In AWS Console:**
1. Go to EC2 Dashboard
2. Click "Launch Instance"
3. Select: **Ubuntu 22.04 LTS** (free tier eligible)
4. Instance type: **t2.micro** (free tier)
5. Storage: **20GB** (default)
6. Create/select **Security Group** with these rules:
   - SSH (22): Your IP only
   - HTTP (80): 0.0.0.0/0 (anyone)
   - HTTPS (443): 0.0.0.0/0 (anyone)
7. Click "Launch"
8. **Download the .pem file** (your SSH key)

### 5.3 Connect to Server

On your computer terminal:

```bash
# Set permissions on your key
chmod 400 your-key-pair.pem

# SSH into server (replace with your IP)
ssh -i your-key-pair.pem ubuntu@your-ec2-public-ip
```

✅ **You're now connected to your server!**

### 5.4 Install Docker on Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

### 5.5 Clone Your Repository

```bash
# Install Git
sudo apt install -y git

# Clone your repository
git clone https://github.com/YOUR_USERNAME/smart-campus-system.git

# Navigate to it
cd smart-campus-system

# List files
ls -la
```

✅ **Your code is now on the server!**

### 5.6 Build and Start

```bash
# Build Docker images
docker-compose build

# Start containers
docker-compose up -d

# Check status
docker ps
```

⏳ **Wait 30-40 seconds for database to initialize**

### 5.7 Test It's Working

```bash
# Test API
curl http://localhost:5000/health

# Test frontend
curl http://localhost
```

### 5.8 Access from Browser

Open your browser:
```
http://your-ec2-public-ip
```

**You should see: Smart Campus System!**

✅ **Your system is now live on the internet!**

---

## 🎯 What to Do Next

### Option 1: Basic Usage (Stop Here)
Your system is working! You can:
- Add students from the UI
- Record exams and attendance
- View reports
- Access from the IP address

### Option 2: Setup Custom Domain (Recommended)

1. Buy a domain (GoDaddy, Namecheap, etc.) - ~$10/year
2. Create **Elastic IP** in AWS (so IP doesn't change)
3. Point domain DNS to your Elastic IP
4. Access via: `http://your-domain.com`

### Option 3: Setup SSL Certificate (Advanced)

```bash
# On your EC2 instance
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
# Update nginx.conf for HTTPS
```

---

## 🆘 Common Issues

### "Docker not found"
→ Restart terminal/computer after Docker installation

### "Cannot connect to database"
→ Wait 60 seconds for database to initialize

### "Port 80 already in use"
→ Change port in docker-compose.yml from `80:80` to `8080:80`

### "Can't access EC2 from browser"
→ Check security group allows port 80 from 0.0.0.0/0

---

## 📚 Next Steps - Read These Documents

**If something breaks:**
- Read: `TROUBLESHOOTING.md`

**Need specific commands:**
- Read: `QUICK_REFERENCE.md`

**Want to understand everything:**
- Read: `DEPLOYMENT_GUIDE.md`

**Need visual overview:**
- Read: `VISUAL_OVERVIEW.md`

**General info:**
- Read: `README.md`

---

## ✅ Final Checklist

After completing all steps, you should have:

```
✅ System running locally on http://localhost
✅ All 3 containers running (docker ps shows them)
✅ Code on GitHub (backed up)
✅ System deployed on AWS EC2
✅ Accessible from http://your-ec2-public-ip
✅ Can add students and view data
✅ No critical errors in logs
```

---

## 🎉 Success!

**Congratulations!** You've successfully:
1. Set up a complete Docker-based system
2. Deployed it locally
3. Backed up on GitHub
4. Deployed to AWS EC2 (live on internet)

---

## 📞 Need Help?

1. **Stuck on setup?** → Follow DEPLOYMENT_GUIDE.md step-by-step
2. **Getting error?** → Search TROUBLESHOOTING.md
3. **Need quick help?** → Check QUICK_REFERENCE.md
4. **Want to understand?** → Read VISUAL_OVERVIEW.md

---

## 🚀 You're Ready!

Your Smart Campus System is now:
- ✅ Running
- ✅ Containerized
- ✅ Backed up on GitHub
- ✅ Live on AWS EC2
- ✅ Production-ready

Enjoy your system! 🎓

---

**Need support?** All documentation is included in your project folder.

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: ✅ Ready to Use