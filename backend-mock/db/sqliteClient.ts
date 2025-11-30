/**
 * SoftOne Design System - SQLite Client
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – Store Isolation 및 백엔드 Mock 연동을 통한 실제 운영 패턴 검증:
 *   better-sqlite3를 사용하여 인메모리 SQLite 데이터베이스를 생성합니다.
 *   서버 시작 시 더미 데이터를 시딩합니다.
 */

import Database from "better-sqlite3";
import path from "path";

// 데이터베이스 인스턴스
let db: Database.Database | null = null;

/**
 * 데이터베이스 인스턴스 반환
 */
export function getDb(): Database.Database {
  if (!db) {
    // 파일 기반 DB (개발 중 데이터 유지) 또는 인메모리 DB 선택
    const dbPath = process.env.DB_PATH || ":memory:";
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");

    // 테이블 생성 및 시딩
    initializeTables(db);
    seedData(db);

    console.log("[SQLite] Database initialized");
  }

  return db;
}

/**
 * 테이블 생성
 */
function initializeTables(db: Database.Database): void {
  // 사용자 테이블
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      department TEXT,
      position TEXT,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // 주문 테이블
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_no TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      total_amount REAL DEFAULT 0,
      status TEXT DEFAULT 'PENDING',
      order_date TEXT DEFAULT (datetime('now'))
    )
  `);

  // 매출 테이블
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      product_name TEXT NOT NULL,
      category TEXT,
      region TEXT,
      quantity INTEGER DEFAULT 1,
      unit_price REAL DEFAULT 0,
      total_amount REAL DEFAULT 0,
      cost REAL DEFAULT 0,
      margin REAL DEFAULT 0,
      margin_rate REAL DEFAULT 0,
      status TEXT DEFAULT 'COMPLETED',
      sales_date TEXT DEFAULT (datetime('now'))
    )
  `);

  console.log("[SQLite] Tables created");
}

/**
 * 더미 데이터 시딩
 */
function seedData(db: Database.Database): void {
  // 기존 데이터 확인
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as {
    count: number;
  };
  if (userCount.count > 0) {
    console.log("[SQLite] Data already seeded, skipping...");
    return;
  }

  const departments = [
    "개발팀",
    "디자인팀",
    "마케팅팀",
    "영업팀",
    "인사팀",
    "재무팀",
  ];
  const positions = ["사원", "대리", "과장", "차장", "부장"];
  const statuses = ["ACTIVE", "INACTIVE", "PENDING"];

  // 사용자 시딩
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, department, position, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 1; i <= 200; i++) {
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const pos = positions[Math.floor(Math.random() * positions.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date(
      Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
    ).toISOString();

    insertUser.run(
      `USER-${String(i).padStart(4, "0")}`,
      `사용자${i}`,
      `user${i}@softone.com`,
      dept,
      pos,
      status,
      date
    );
  }

  // 주문 시딩
  const orderStatuses = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  const products = [
    "노트북",
    "모니터",
    "키보드",
    "마우스",
    "의자",
    "책상",
    "헤드셋",
    "태블릿",
  ];

  const insertOrder = db.prepare(`
    INSERT INTO orders (id, order_no, customer_name, product_name, quantity, total_amount, status, order_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 1; i <= 300; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const amount = Math.floor(Math.random() * 500000) + 50000;
    const status =
      orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const date = new Date(
      Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
    ).toISOString();

    insertOrder.run(
      `ORD-${String(i).padStart(5, "0")}`,
      `ORD-${Date.now()}-${i}`,
      `고객${Math.floor(Math.random() * 50) + 1}`,
      product,
      quantity,
      amount,
      status,
      date
    );
  }

  // 매출 시딩
  const categories = ["전자제품", "의류", "식품", "가구", "화장품"];
  const regions = ["서울", "부산", "대구", "인천", "광주"];
  const salesStatuses = ["COMPLETED", "PENDING", "CANCELLED"];

  const insertSale = db.prepare(`
    INSERT INTO sales (id, product_name, category, region, quantity, unit_price, total_amount, cost, margin, margin_rate, status, sales_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 1; i <= 500; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const quantity = Math.floor(Math.random() * 100) + 1;
    const unitPrice = Math.floor(Math.random() * 100000) + 10000;
    const totalAmount = quantity * unitPrice;
    const cost = Math.floor(totalAmount * (0.5 + Math.random() * 0.3));
    const margin = totalAmount - cost;
    const marginRate = parseFloat(((margin / totalAmount) * 100).toFixed(2));
    const status =
      salesStatuses[Math.floor(Math.random() * salesStatuses.length)];
    const date = new Date(
      Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
    ).toISOString();

    insertSale.run(
      `SALE-${String(i).padStart(6, "0")}`,
      `상품 ${i}`,
      category,
      region,
      quantity,
      unitPrice,
      totalAmount,
      cost,
      margin,
      marginRate,
      status,
      date
    );
  }

  console.log("[SQLite] Data seeded: 200 users, 300 orders, 500 sales");
}

/**
 * 데이터베이스 종료
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
    console.log("[SQLite] Database closed");
  }
}

