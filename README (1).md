# 🎓 Smart Campus System - Docker Ready

A complete **cloud-native** student management system built with **Node.js**, **Express**, **MySQL**, and **Docker** for seamless deployment on AWS EC2.

## ✨ Features

### 📚 Core Modules
- **Student Management**: Create, read, update, delete students with detailed profiles
- **Exam Management**: Track exam scores for 6 subjects with automatic grade calculation
- **Attendance Tracking**: Monitor attendance per subject with dropout detection
- **Fine System**: Automatic fine calculation based on attendance
- **Dashboard Analytics**: Real-time statistics and comprehensive reports
- **Advanced Filtering**: Search and filter by semester, performance metrics

### 🔧 Technical Stack
| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | HTML5 + Vanilla JS + CSS3 | Latest |
| Backend API | Node.js + Express.js | 18.x |
| Database | MySQL | 8.0 |
| Web Server | Nginx | Alpine |
| Containerization | Docker & Docker Compose | Latest |
| Infrastructure | AWS EC2 + RDS | - |

### 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AWS EC2 Instance                      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Nginx       │  │  Node.js     │  │  MySQL       │   │
│  │  (Port 80)   │  │  (Port 5000) │  │  (Port 3306) │   │
│  │              │  │              │  │              │   │
│  │  Frontend    │  │  Backend API │  │  Database    │   │
│  │  Static      │  │  RESTful     │  │  Persistent  │   │
│  │  Files       │  │  Endpoints   │  │  Storage     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│         │                 │                 │             │
│         └─────────────────┴─────────────────┘             │
│            Docker Network (Bridge Mode)                   │
├─────────────────────────────────────────────────────────┤
│  Docker Daemon / Container Runtime                       │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- AWS EC2 instance (Ubuntu 22.04 LTS)
- Git installed
- ~50MB disk space

### Local Testing (Before EC2)
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/smart-campus-system.git
cd smart-campus-system

# Create environment file
cp .env.example .env

# Build and start containers
docker-compose build
docker-compose up -d

# Access application
# Frontend: http://localhost
# API: http://localhost:5000/api
```

### EC2 Deployment
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@ec2-public-ip

# Clone repository
git clone https://github.com/YOUR_USERNAME/smart-campus-system.git
cd smart-campus-system

# Start application
docker-compose up -d

# Access from browser
# http://your-ec2-public-ip
```

## 📖 Project Structure

```
smart-campus-system/
├── frontend/
│   ├── index.html              # Complete frontend with embedded CSS/JS
│   ├── nginx.conf              # Nginx proxy configuration
│   ├── Dockerfile.frontend     # Frontend container definition
│   └── .env                    # Frontend environment variables
├── backend/
│   ├── server.js               # Express.js API server
│   ├── package.json            # Node.js dependencies
│   ├── Dockerfile.backend      # Backend container definition
│   └── .env                    # Backend environment variables
├── database/
│   └── init.sql                # MySQL schema initialization
├── docker-compose.yml          # Orchestration file
├── .env                        # Root environment variables
├── DEPLOYMENT_GUIDE.md         # Step-by-step deployment guide
└── README.md                   # This file
```

## 📊 API Endpoints

### Students
```
GET    /api/students             - Get all students
GET    /api/students/:roll_no    - Get student by roll number
POST   /api/students             - Create new student
PUT    /api/students/:id         - Update student
DELETE /api/students/:id         - Delete student
```

### Exams
```
GET    /api/exams                - Get all exams
GET    /api/exams/:student_id    - Get exam by student
POST   /api/exams                - Create exam record
PUT    /api/exams/:id            - Update exam record
```

### Attendance
```
GET    /api/attendance           - Get all attendance records
GET    /api/attendance/:student_id - Get attendance by student
POST   /api/attendance           - Create attendance record
```

### Dashboard
```
GET    /api/dashboard/stats      - Get dashboard statistics
GET    /api/dashboard/report     - Get comprehensive report
GET    /health                   - Health check endpoint
```

## 🗄️ Database Schema

### Student Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| roll_no | VARCHAR(50) | Unique roll number |
| fullname | VARCHAR(100) | Student full name |
| semester | INT | Current semester (1-8) |
| phone_no | VARCHAR(20) | Contact number |
| email | VARCHAR(100) | Email address |
| subject1-6 | VARCHAR(100) | Subject names |

### Exam Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| student_id | INT | Foreign key to student |
| subject1-6 | INT | Marks (0-100) |
| total | INT | **Computed**: Sum of all marks |
| percentage | DECIMAL(5,2) | **Computed**: (total/600)*100 |
| grade | VARCHAR(2) | **Computed**: A/B/C/F based on percentage |

### Attendance Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| student_id | INT | Foreign key to student |
| subject1-6 | INT | Attendance percentage (0-100) |
| total_fine | INT | **Computed**: Subjects < 75% × 500 |
| dropout_subjects | VARCHAR(500) | **Computed**: List of subjects < 75% |

## 🛠️ Configuration

### Environment Variables

**Root .env** (for docker-compose):
```env
DB_HOST=database                    # or RDS endpoint
DB_PORT=3306
DB_USER=campusadmin
DB_PASSWORD=SecurePassword@2024
DB_NAME=smart_campus
NODE_ENV=production
```

**Backend .env** (in backend/):
```env
PORT=5000
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=campusadmin
DB_PASSWORD=your-password
DB_NAME=smart_campus
```

**Frontend .env** (in frontend/):
```env
REACT_APP_API_URL=http://backend:5000/api
```

## 📦 Docker Operations

```bash
# Build images
docker-compose build

# Start containers (background)
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Execute command in container
docker-compose exec backend node server.js

# Remove all data (WARNING!)
docker-compose down -v
```

## 🔍 Monitoring & Troubleshooting

### Check Container Status
```bash
docker-compose ps

# Should show 3 containers: frontend, backend, database
```

### View Logs
```bash
# All containers
docker-compose logs -f

# Specific service
docker-compose logs backend

# Last 100 lines
docker-compose logs --tail=100 frontend
```

### Test API Health
```bash
curl http://localhost:5000/health
# Response: {"status":"Backend API is running","database":"Connected"}
```

### Access MySQL
```bash
docker-compose exec database mysql -u campusadmin -p smart_campus
# Enter password: SecurePassword@2024
```

## 🔐 Security Features

✅ **Implemented**
- Environment variables for sensitive data (not hardcoded)
- Nginx security headers (X-Frame-Options, X-Content-Type-Options)
- CORS configuration
- Input validation in API
- MySQL connection pooling
- Health checks on all services
- Logging for audit trail

⚠️ **Recommended for Production**
- [ ] SSL/TLS certificates (Let's Encrypt)
- [ ] API rate limiting
- [ ] Authentication/JWT tokens
- [ ] Database encryption at rest
- [ ] Secrets management (AWS Secrets Manager)
- [ ] Web Application Firewall (AWS WAF)
- [ ] DDoS protection (AWS Shield)

## 📈 Performance Optimization

- **Frontend**: Static file caching, gzip compression, minimized CSS/JS
- **Backend**: Connection pooling, query optimization, health checks
- **Database**: Computed columns for auto-calculations, indexed queries
- **Nginx**: Reverse proxy caching, load balancing ready
- **Docker**: Multi-stage builds, Alpine Linux base images

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Database connection failed | Check .env variables, verify MySQL is running |
| Frontend not loading | Verify Nginx container is running, check port 80 |
| API returning 500 errors | Check backend logs: `docker-compose logs backend` |
| Port already in use | Change ports in docker-compose.yml or kill process |
| Slow performance | Increase EC2 instance type, check database indexes |

## 📚 Documentation

- **DEPLOYMENT_GUIDE.md**: Complete step-by-step deployment instructions
- **API Documentation**: See API Endpoints section above
- **Database Schema**: See Database Schema section above

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Docker for containerization
- Express.js for the backend framework
- MySQL for reliable database
- AWS for cloud infrastructure
- Nginx for efficient web serving

## 📞 Support

For issues and questions:
1. Check DEPLOYMENT_GUIDE.md
2. Review container logs: `docker-compose logs -f`
3. Create GitHub Issue
4. Contact project maintainer

---

**Made with ❤️ for streamlined campus management**

Last Updated: January 2024
Version: 1.0.0