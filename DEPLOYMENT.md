# ☁️ AWS Deployment Guide

Step-by-step guide to deploy the Expense Tracker application on AWS Free Tier.

## 🎯 Architecture Overview

```
                    ┌─────────────────────┐
                    │   AWS Route 53      │
                    │   (DNS)             │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   AWS CloudFront    │
                    │   (CDN)             │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┴──────────────────┐
            │                                     │
    ┌───────▼────────┐              ┌────────────▼────────┐
    │   AWS S3       │              │   AWS EC2          │
    │  (Frontend)    │              │  (Backend API)     │
    └────────────────┘              └────────────┬────────┘
                                                 │
                                     ┌───────────▼──────────┐
                                     │  MongoDB Atlas      │
                                     │  (Database)         │
                                     └────────────────────┘
```

## Prerequisites

1. **AWS Account** (free tier eligible)
2. **MongoDB Atlas Account** (free tier)
3. **Domain Name** (optional, can use AWS-provided domain)
4. **Git** for version control

---

## Part 1: MongoDB Atlas Setup

### 1. Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or login
3. Create a new organization and project
4. Click "Create Database"
5. Select **M0 (Free Tier)**
6. Choose region (select closest to your users)
7. Click "Create Cluster"

### 2. Create Database User

1. In left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Enter username and password
4. Select "Built-in Role": Database User
5. Click "Add User"

**Save these credentials!** You'll need them later.

### 3. Configure IP Access

1. In left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development: Add your IP
4. For production: Add EC2 security group CIDR

### 4. Get Connection String

1. Click "Databases" in left sidebar
2. Click "Connect" button
3. Select "Drivers"
4. Copy connection string
5. Replace `<username>`, `<password>`, `<dbname>`

**Example**:
```
mongodb+srv://username:password@cluster.mongodb.net/expense_tracker?retryWrites=true&w=majority
```

---

## Part 2: Build Frontend for Production

### 1. Create Build

```bash
cd client
npm run build
```

This creates optimized files in `client/build/` directory.

### 2. Contents of Build Folder

- `index.html` - Main HTML file
- `static/` - JavaScript and CSS bundles
- `favicon.ico` - Website icon

---

## Part 3: Deploy Frontend to AWS S3

### 1. Create S3 Bucket

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. **Bucket name**: `expense-tracker-frontend` (must be globally unique)
4. **Region**: Select your region
5. Uncheck "Block all public access"
6. Check "I acknowledge..." checkbox
7. Click "Create bucket"

### 2. Configure S3 for Static Website

1. Click on your bucket
2. Go to "Properties" tab
3. Scroll to "Static website hosting"
4. Click "Edit"
5. Select "Enable"
6. **Index document**: `index.html`
7. **Error document**: `index.html` (for routing)
8. Click "Save changes"

### 3. Set Bucket Policy

1. Go to "Permissions" tab
2. Click "Edit" under "Bucket policy"
3. Add this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::expense-tracker-frontend/*"
    }
  ]
}
```

Replace `expense-tracker-frontend` with your bucket name.

4. Click "Save changes"

### 4. Upload Frontend Files

1. Go to "Objects" tab
2. Click "Upload"
3. Click "Add files"
4. Navigate to `client/build/` folder
5. Select **all files** (including folders)
6. Click "Upload"
7. Wait for upload to complete

### 5. Get S3 Website URL

1. Go to "Properties" tab
2. Scroll to "Static website hosting"
3. Copy "Bucket website endpoint"

**Example**: `http://expense-tracker-frontend.s3-website-us-east-1.amazonaws.com`

---

## Part 4: Deploy Backend to AWS EC2

### 1. Create EC2 Instance

1. Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click "Instances" → "Launch Instances"

**Configure Instance:**
- **Name**: `expense-tracker-backend`
- **AMI**: Amazon Linux 2 (free tier eligible)
- **Instance Type**: t2.micro (free tier)
- **Key Pair**: Create new → `expense-tracker-key.pem` (save this!)
- **VPC**: Default
- **Storage**: 30GB (free tier)

3. Click "Launch Instance"

### 2. Configure Security Group

1. In EC2 dashboard, click your instance
2. Go to "Security" tab
3. Click on security group
4. Go to "Inbound rules"
5. Click "Edit inbound rules"

**Add these rules**:

| Type | Protocol | Port | Source |
|------|----------|------|--------|
| SSH | TCP | 22 | Your IP |
| HTTP | TCP | 80 | 0.0.0.0/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0 |
| Custom TCP | TCP | 5000 | 0.0.0.0/0 |

6. Click "Save rules"

### 3. Connect to EC2 Instance

**On macOS/Linux:**
```bash
# Give key file correct permissions
chmod 400 expense-tracker-key.pem

# Connect to instance (replace PUBLIC_IP)
ssh -i expense-tracker-key.pem ec2-user@PUBLIC_IP
```

**On Windows:**
1. Use PuTTY or Windows Subsystem for Linux (WSL)
2. Or use EC2 Instance Connect in AWS Console

### 4. Install Required Software

```bash
# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Git
sudo yum install -y git

# Install PM2 (process manager)
sudo npm install -g pm2

# Verify installations
node --version
npm --version
git --version
```

### 5. Clone and Deploy Backend

```bash
# Create app directory
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

# Clone repository
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker/server

# Install dependencies
npm install
```

### 6. Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add this content (update values):

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_NOW
PORT=5000
NODE_ENV=production
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### 7. Start Backend with PM2

```bash
# Start server
pm2 start server.js --name "expense-tracker-api"

# Make PM2 start on reboot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
pm2 save

# Check status
pm2 status
pm2 logs
```

### 8. Get EC2 Public IP

1. Go to EC2 console
2. Find your instance
3. Copy "Public IPv4 address"

**Example**: `54.123.45.67`

---

## Part 5: Connect Frontend to Backend

### 1. Update Frontend Configuration

Before rebuilding frontend, update the backend URL:

**Edit `client/src/index.js`:**

```javascript
// Add this at the top:
axios.defaults.baseURL = 'http://YOUR_EC2_PUBLIC_IP:5000';
```

Or better, use environment variable:

**Create `client/.env`:**
```
REACT_APP_API_URL=http://54.123.45.67:5000
```

**Update `client/src/index.js`:**
```javascript
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
```

### 2. Rebuild Frontend

```bash
cd client
npm run build
```

### 3. Upload Updated Build to S3

```bash
# Using AWS CLI (if installed)
aws s3 sync ./build s3://expense-tracker-frontend/ --delete

# Or manually upload through AWS console
```

---

## Part 6: Set Up Custom Domain (Optional)

### 1. Route 53 Setup

1. Go to [AWS Route 53 Console](https://console.aws.amazon.com/route53/)
2. Click "Hosted zones"
3. Click "Create hosted zone"
4. Enter your domain name
5. Click "Create hosted zone"

### 2. Update Domain Registrar

Update your domain registrar's nameservers to Route 53 nameservers provided.

### 3. Create CloudFront Distribution

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click "Create distribution"
3. **Origin domain**: Select your S3 bucket
4. **Viewer protocol policy**: Redirect HTTP to HTTPS
5. **Allowed HTTP methods**: GET, HEAD
6. **Default root object**: `index.html`
7. Create distribution

### 4. Add DNS Records in Route 53

1. Select your hosted zone
2. Click "Create record"
3. **Name**: @ (for root domain)
4. **Type**: A
5. **Alias**: CloudFront distribution
6. Create record

---

## Part 7: SSL Certificate (HTTPS)

### 1. Request Certificate in ACM

1. Go to [AWS ACM Console](https://console.aws.amazon.com/acm/)
2. Click "Request certificate"
3. Enter domain name
4. Choose DNS validation
5. Create records in Route 53
6. Wait for validation

### 2. Attach to CloudFront

1. Go to CloudFront distribution
2. Go to "General" settings
3. Edit distribution
4. **Custom SSL certificate**: Select your certificate
5. Update distribution

---

## Part 8: Monitoring and Maintenance

### 1. Monitor Backend

```bash
# SSH into EC2
ssh -i expense-tracker-key.pem ec2-user@YOUR_EC2_IP

# Check PM2 status
pm2 status
pm2 logs

# Monitor system resources
top
df -h
```

### 2. View CloudWatch Logs

1. Go to [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/)
2. Select your EC2 instance
3. View metrics and logs

### 3. Update Application

To deploy updates:

```bash
# SSH into EC2
ssh -i expense-tracker-key.pem ec2-user@YOUR_EC2_IP

# Update code
cd /home/ec2-user/app/expense-tracker/server
git pull origin main

# Restart server
pm2 restart expense-tracker-api
```

---

## Cost Estimation (Free Tier)

**Within AWS Free Tier Limits:**
- EC2: 750 hours/month (1 t2.micro instance)
- S3: 5GB storage, 20,000 GET requests
- Data Transfer: 100GB/month (free to internet)
- CloudFront: 1TB/month data transfer

**Your estimated cost**: $0/month (within free tier)

---

## Troubleshooting

### Cannot connect to EC2
- Check security group allows SSH on port 22
- Verify key pair is correct
- Check instance is running

### Backend API not responding
```bash
# SSH into EC2
ssh -i expense-tracker-key.pem ec2-user@YOUR_EC2_IP

# Check PM2
pm2 logs

# Restart
pm2 restart expense-tracker-api
```

### Frontend not loading
- Check S3 bucket policy is correct
- Verify index.html uploaded
- Check CloudFront distribution is enabled
- Clear browser cache

### MongoDB connection fails
- Check IP whitelist in MongoDB Atlas
- Verify connection string in .env
- Check network connectivity

---

## Security Best Practices

1. **Rotate JWT Secret**: Change before production
2. **Use HTTPS**: Always encrypt connections
3. **Limit API Access**: Use CORS carefully
4. **Update Dependencies**: Run `npm audit fix`
5. **Monitor Logs**: Check CloudWatch regularly
6. **Backup Database**: Enable MongoDB backups
7. **Use IAM Roles**: Don't hardcode AWS credentials

---

## Scaling Considerations

For production beyond free tier:

1. **Load Balancer**: Distribute traffic
2. **Auto-scaling**: Handle spikes
3. **RDS**: Use managed database
4. **ElastiCache**: Cache frequently accessed data
5. **CDN**: Improve frontend performance

---

## Resource Cleanup

To avoid unexpected charges:

```bash
# Stop EC2 instance (not running costs)
# Delete S3 objects
# Delete CloudFront distribution
# Delete unused security groups
# Delete unused VPCs
```

---

## Testing Deployed Application

1. Visit your S3 website URL
2. Register new account
3. Add transaction
4. Check analytics
5. Monitor backend logs

---

## Support

For AWS-specific issues:
- [AWS Support](https://aws.amazon.com/contact-us/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [AWS Forums](https://forums.aws.amazon.com/)

---

**Happy deploying! 🚀**
