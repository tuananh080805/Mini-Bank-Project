# 🏦 Mini Bank Project

Một ứng dụng ngân hàng mini được xây dựng bằng **Node.js + Express + PostgreSQL + Prisma**, hỗ trợ các chức năng cơ bản như đăng ký, đăng nhập, xem số dư và thực hiện giao dịch.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Cache | Redis |
| Authentication | JWT (JSON Web Token) |
| Encryption | bcrypt |

---

## 📋 Chức năng

### 🔐 Xác thực (Authentication)
- **Đăng ký** tài khoản với email, password và mã PIN
- **Đăng nhập** bằng email + password, nhận về JWT token
- Bảo vệ các route bằng JWT middleware
- Mã hóa password và PIN bằng bcrypt

### 👤 Thông tin tài khoản
- Xem **số tài khoản** sau khi đăng nhập
- Xem **số dư** hiện tại (có cache Redis)

### 💸 Giao dịch (Transactions)
- **Nạp tiền** (Deposit) vào tài khoản
- **Rút tiền** (Withdrawal) từ tài khoản — yêu cầu xác thực PIN
- **Chuyển tiền** (Transfer) sang tài khoản khác — yêu cầu xác thực PIN

---

## 📡 API Endpoints

### Auth
```
POST /user/create       - Đăng ký tài khoản mới
POST /user/login        - Đăng nhập, trả về JWT token
```

### User Info *(yêu cầu JWT)*
```
GET /user-info/account-number   - Lấy số tài khoản
GET /user-info/balance          - Lấy số dư hiện tại
```

### Transactions *(yêu cầu JWT)*
```
POST /transaction/deposit       - Nạp tiền
POST /transaction/with-draw     - Rút tiền
POST /transaction/transfer      - Chuyển tiền
```

---

## 📦 Cài đặt & Chạy

### 1. Clone project
```bash
git clone https://github.com/your-username/mini-bank-project.git
cd mini-bank-project
```

### 2. Cài dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env`:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/minibank
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

### 4. Chạy migration
```bash
npx prisma migrate dev
```

### 5. Khởi động server
```bash
node src/index.js
```

---

## 🗄️ Database Schema

```
users
├── id (UUID)
├── email (unique)
├── password_hash
├── pin_hash
└── created_at

bank_accounts
├── id (UUID)
├── user_id (FK → users)
├── account_number (bigint, unique)
└── balance (decimal)

transactions
├── id (UUID)
├── reference_number (bigint, unique)
├── from_account_id (FK → bank_accounts)
├── to_account_id (FK → bank_accounts)
├── amount
├── type (DEPOSIT | WITHDRAWAL | TRANSFER)
└── status (PENDING | SUCCESS | FAILED)
```

---

## 🔒 Bảo mật

- Password và PIN được hash bằng **bcrypt** trước khi lưu vào DB
- Các route nhạy cảm được bảo vệ bằng **JWT middleware**
- Giao dịch chuyển tiền / rút tiền yêu cầu xác thực **PIN**
- Sử dụng **Prisma Transaction** để đảm bảo tính toàn vẹn dữ liệu

---

## 👨‍💻 Tác giả

> Built with ❤️ — Mini Bank Project 
=======