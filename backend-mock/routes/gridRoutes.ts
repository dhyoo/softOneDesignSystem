/**
 * SoftOne Design System - Grid Routes
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – Store Isolation 및 백엔드 Mock 연동을 통한 실제 운영 패턴 검증:
 *   Express Router로 그리드 데이터 API를 제공합니다.
 */

import { Router, Request, Response } from "express";
import { findUsers, findOrders, findSales } from "../repositories/UserGridRepository";

const router = Router();

// ========================================
// Helper: Parse Query Params
// ========================================

function parseGridParams(query: Request["query"]) {
  return {
    page: parseInt(query.page as string, 10) || 1,
    pageSize: parseInt(query.pageSize as string, 10) || 20,
    keyword: query.keyword as string | undefined,
    status: query.status as string | undefined,
    category: query.category as string | undefined,
    sortField: query.sortField as string | undefined,
    sortDir: (query.sortDir as "asc" | "desc") || undefined,
  };
}

// ========================================
// Routes
// ========================================

/**
 * GET /api/grid/users
 * 사용자 목록 조회
 */
router.get("/users", (req: Request, res: Response) => {
  try {
    const params = parseGridParams(req.query);
    const result = findUsers(params);

    // 응답 형식 변환 (camelCase)
    const data = result.data.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      department: row.department,
      position: row.position,
      status: row.status,
      createdAt: row.created_at,
    }));

    res.json({
      data,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error("[/api/grid/users] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/grid/orders
 * 주문 목록 조회
 */
router.get("/orders", (req: Request, res: Response) => {
  try {
    const params = parseGridParams(req.query);
    const result = findOrders(params);

    const data = result.data.map((row) => ({
      id: row.id,
      orderNo: row.order_no,
      customerName: row.customer_name,
      productName: row.product_name,
      quantity: row.quantity,
      totalAmount: row.total_amount,
      status: row.status,
      orderDate: row.order_date,
    }));

    res.json({
      data,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error("[/api/grid/orders] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/grid/sales
 * 매출 목록 조회
 */
router.get("/sales", (req: Request, res: Response) => {
  try {
    const params = parseGridParams(req.query);
    const result = findSales(params);

    const data = result.data.map((row) => ({
      id: row.id,
      productName: row.product_name,
      category: row.category,
      region: row.region,
      quantity: row.quantity,
      unitPrice: row.unit_price,
      totalAmount: row.total_amount,
      cost: row.cost,
      margin: row.margin,
      marginRate: row.margin_rate,
      status: row.status,
      salesDate: row.sales_date,
    }));

    res.json({
      data,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error("[/api/grid/sales] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

