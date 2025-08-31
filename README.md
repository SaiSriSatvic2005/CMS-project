# Product CMS Project

A simple CMS for managing products, built for a class project. It uses a Next.js frontend, an Express.js backend, and a MySQL database. You can add, edit, and soft-delete products.

## How to Run It

**1. Prerequisites**
You'll need Node.js and a MySQL server (XAMPP is easiest).

**2. Clone the Project**
```sh
git clone [https://github.com/your-username/CMS-project.git](https://github.com/your-username/CMS-project.git)
cd CMS-project
```

**3. Set up the Database**
Connect to your MySQL server and run this code:
```sql
CREATE DATABASE IF NOT EXISTS cms_products;
USE cms_products;
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_desc TEXT,
    status ENUM('Draft', 'Published', 'Archived') DEFAULT 'Draft',
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);
```

**4. Start the Backend**
```sh
cd backend
```
Create a `.env` file with your database password:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=cms_products
```
Then, install packages and start the server:
```sh
npm install
node index.js
```
Leave this terminal running.

**5. Start the Frontend**
Open a **new terminal**.
```sh
cd frontend
npm install
npm run dev
```

**6. View the App**
Go to `http://localhost:3000` in your browser.
