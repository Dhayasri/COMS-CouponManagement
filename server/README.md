# COMS API — Backend Server

Express + Mongoose REST API for the Coupon & Offer Management System.

---

## Folder Structure

```
server/
├── index.js          ← Entry point (Express app + MongoDB connect)
├── .env              ← MONGO_URI and PORT (edit this when connecting)
├── package.json
├── seed.js           ← Inserts 15 test coupons into MongoDB
├── models/
│   └── Coupon.js     ← Mongoose schema with auto-expire hook
└── routes/
    └── coupons.js    ← All coupon route handlers
```

---

## Setup

```powershell
cd d:\Projects\coupon-management\server
npm install
```

---

## Configuration (.env)

Edit `server/.env` before starting:

```env
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/coms_db

# Remote MongoDB (another computer on same network)
MONGO_URI=mongodb://192.168.X.X:27017/coms_db

# MongoDB Atlas (cloud)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/coms_db

PORT=5001
```

---

## Running the Server

```powershell
# Development (auto-restarts on file change)
npm run dev

# Production
npm start

# Seed database with 15 test coupons
npm run seed
```

---

## API Endpoints

| Method   | URL                    | Description                  |
|----------|------------------------|------------------------------|
| `GET`    | `/api/health`          | Server + DB status check     |
| `GET`    | `/api/coupons`         | Get all coupons              |
| `GET`    | `/api/coupons?status=Active` | Filter by status       |
| `GET`    | `/api/coupons/:id`     | Get single coupon by ID      |
| `POST`   | `/api/coupon`          | Create new coupon            |
| `PUT`    | `/api/coupons/:id`     | Update a coupon              |
| `DELETE` | `/api/coupon/:id`      | Delete a coupon              |

---

## Example Requests (using curl)

```bash
# Health check
curl http://localhost:5001/api/health

# Get all coupons
curl http://localhost:5001/api/coupons

# Get only active coupons
curl "http://localhost:5001/api/coupons?status=Active"

# Get only expired coupons
curl "http://localhost:5001/api/coupons?status=Expired"

# Create a coupon
curl -X POST http://localhost:5001/api/coupon \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER40",
    "type": "Percent",
    "discountValue": 40,
    "minOrder": 999,
    "maxUses": 200,
    "category": "Fashion",
    "startDate": "2026-04-12",
    "expiryDate": "2026-06-30",
    "status": "Active"
  }'

# Delete a coupon by ID
curl -X DELETE http://localhost:5001/api/coupon/665f1a2b3c4d5e6f7a8b9c0d
```

---

## Connecting from Another Computer

1. Find this computer's IP address:
   ```powershell
   ipconfig
   # Look for IPv4 Address e.g. 192.168.1.100
   ```

2. Make sure MongoDB allows remote connections.
   Edit `mongod.cfg` (usually `C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg`):
   ```yaml
   net:
     bindIp: 0.0.0.0   # Allow connections from any IP
     port: 27017
   ```
   Restart MongoDB service after editing.

3. On the other computer, update `server/.env`:
   ```
   MONGO_URI=mongodb://192.168.1.100:27017/coms_db
   ```

4. Make sure Windows Firewall allows port `27017` inbound.
