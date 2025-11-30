/**
 * SoftOne Design System - Grid Repositories
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – Store Isolation 및 백엔드 Mock 연동을 통한 실제 운영 패턴 검증:
 *   페이징/정렬/필터를 SQL로 처리하는 Repository 계층입니다.
 */

import { getDb } from "../db/sqliteClient";

// ========================================
// Types
// ========================================

interface GridQueryParams {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: string;
  sortField?: string;
  sortDir?: "asc" | "desc";
}

interface GridResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: string;
  created_at: string;
}

interface OrderRow {
  id: string;
  order_no: string;
  customer_name: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  status: string;
  order_date: string;
}

interface SalesRow {
  id: string;
  product_name: string;
  category: string;
  region: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  cost: number;
  margin: number;
  margin_rate: number;
  status: string;
  sales_date: string;
}

// ========================================
// User Repository
// ========================================

export function findUsers(params: GridQueryParams): GridResponse<UserRow> {
  const db = getDb();
  const { page, pageSize, keyword, status, sortField, sortDir } = params;

  // WHERE 절 구성
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (keyword) {
    conditions.push("(name LIKE ? OR email LIKE ?)");
    values.push(`%${keyword}%`, `%${keyword}%`);
  }

  if (status) {
    conditions.push("status = ?");
    values.push(status);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // 정렬
  const validSortFields = [
    "id",
    "name",
    "email",
    "department",
    "position",
    "status",
    "created_at",
  ];
  const orderClause =
    sortField && validSortFields.includes(sortField)
      ? `ORDER BY ${sortField} ${sortDir === "desc" ? "DESC" : "ASC"}`
      : "ORDER BY created_at DESC";

  // 전체 개수
  const countQuery = `SELECT COUNT(*) as count FROM users ${whereClause}`;
  const countResult = db.prepare(countQuery).get(...values) as { count: number };
  const total = countResult.count;

  // 데이터 조회
  const offset = (page - 1) * pageSize;
  const dataQuery = `
    SELECT id, name, email, department, position, status, created_at
    FROM users
    ${whereClause}
    ${orderClause}
    LIMIT ? OFFSET ?
  `;
  const data = db.prepare(dataQuery).all(...values, pageSize, offset) as UserRow[];

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ========================================
// Order Repository
// ========================================

export function findOrders(params: GridQueryParams): GridResponse<OrderRow> {
  const db = getDb();
  const { page, pageSize, keyword, status, sortField, sortDir } = params;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (keyword) {
    conditions.push(
      "(order_no LIKE ? OR customer_name LIKE ? OR product_name LIKE ?)"
    );
    values.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }

  if (status) {
    conditions.push("status = ?");
    values.push(status);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const validSortFields = [
    "id",
    "order_no",
    "customer_name",
    "product_name",
    "quantity",
    "total_amount",
    "status",
    "order_date",
  ];
  const orderClause =
    sortField && validSortFields.includes(sortField)
      ? `ORDER BY ${sortField} ${sortDir === "desc" ? "DESC" : "ASC"}`
      : "ORDER BY order_date DESC";

  const countQuery = `SELECT COUNT(*) as count FROM orders ${whereClause}`;
  const countResult = db.prepare(countQuery).get(...values) as { count: number };
  const total = countResult.count;

  const offset = (page - 1) * pageSize;
  const dataQuery = `
    SELECT id, order_no, customer_name, product_name, quantity, total_amount, status, order_date
    FROM orders
    ${whereClause}
    ${orderClause}
    LIMIT ? OFFSET ?
  `;
  const data = db.prepare(dataQuery).all(...values, pageSize, offset) as OrderRow[];

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ========================================
// Sales Repository
// ========================================

export function findSales(
  params: GridQueryParams & { category?: string }
): GridResponse<SalesRow> {
  const db = getDb();
  const { page, pageSize, keyword, status, category, sortField, sortDir } =
    params;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (keyword) {
    conditions.push("(product_name LIKE ? OR id LIKE ?)");
    values.push(`%${keyword}%`, `%${keyword}%`);
  }

  if (status) {
    conditions.push("status = ?");
    values.push(status);
  }

  if (category) {
    conditions.push("category = ?");
    values.push(category);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const validSortFields = [
    "id",
    "product_name",
    "category",
    "region",
    "quantity",
    "unit_price",
    "total_amount",
    "margin_rate",
    "status",
    "sales_date",
  ];
  const orderClause =
    sortField && validSortFields.includes(sortField)
      ? `ORDER BY ${sortField} ${sortDir === "desc" ? "DESC" : "ASC"}`
      : "ORDER BY sales_date DESC";

  const countQuery = `SELECT COUNT(*) as count FROM sales ${whereClause}`;
  const countResult = db.prepare(countQuery).get(...values) as { count: number };
  const total = countResult.count;

  const offset = (page - 1) * pageSize;
  const dataQuery = `
    SELECT id, product_name, category, region, quantity, unit_price, 
           total_amount, cost, margin, margin_rate, status, sales_date
    FROM sales
    ${whereClause}
    ${orderClause}
    LIMIT ? OFFSET ?
  `;
  const data = db.prepare(dataQuery).all(...values, pageSize, offset) as SalesRow[];

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

