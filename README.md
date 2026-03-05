# 🏦 Mini Bank Project

Một ứng dụng ngân hàng mini được xây dựng bằng **Node.js + Express + PostgreSQL + Prisma**, hỗ trợ các chức năng cơ bản như đăng ký, đăng nhập, xem số dư và thực hiện giao dịch.

### 🌐 Live Demo
**👉 Trải nghiệm trực tiếp ứng dụng tại đây: [Mini Bank Live Demo]([LINK_LIVE_DEMO_CỦA_BẠN_VÀO_ĐÂY])**

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
| Containerization | Docker + Docker Compose |
| Email | Nodemailer (Gmail SMTP) |

---

## 📋 Chức năng

### 🔐 Xác thực (Authentication)
- **Đăng ký** tài khoản với email, password và mã PIN
- Sau khi đăng ký, hệ thống gửi **email kích hoạt** qua Gmail SMTP
- Tài khoản cần **xác nhận email** trước khi đăng nhập
- **Đăng nhập** bằng email + password, nhận về JWT token + Refresh token
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
`POST /user/create`       - Đăng ký tài khoản mới
`POST /user/login`        - Đăng nhập, trả về JWT token

### User Info *(yêu cầu JWT)*
`GET /user-info/account-number`   - Lấy số tài khoản
`GET /user-info/balance`          - Lấy số dư hiện tại

### Transactions *(yêu cầu JWT)*
`POST /transaction/deposit`       - Nạp tiền
`POST /transaction/with-draw`     - Rút tiền
`POST /transaction/transfer`      - Chuyển tiền

---

## 📦 Cài đặt & Chạy

### 🐳 Chạy với Docker (Recommended)

#### 1. Clone project
```bash
git clone [https://github.com/your-username/mini-bank-project.git](https://github.com/your-username/mini-bank-project.git)
cd mini-bank-project