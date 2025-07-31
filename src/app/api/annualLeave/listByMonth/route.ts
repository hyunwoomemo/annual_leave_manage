import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";

// Add timeout for database queries
const queryWithTimeout = async (sql: string, values: any[], timeoutMs: number = 8000) => {
  return Promise.race([
    executeQuery(sql, values),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), timeoutMs)
    )
  ]);
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");
    
    const year = yearParam && yearParam !== "null" ? 
      parseInt(yearParam) : 
      new Date().getFullYear();

    const month = monthParam && monthParam !== "null" ? 
      parseInt(monthParam) + 1 : 
      new Date().getMonth() + 1;

    console.log("Fetching data for:", { year, month });

    // Simplified query - only get current month data to reduce complexity
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

    // Single optimized query with JOIN
    const dataSql = `
      SELECT al.*, e.name, e.department 
      FROM annual_leave al 
      JOIN employees e ON al.employee_id = e.id 
      WHERE al.start_date >= ? 
        AND al.start_date <= ? 
        AND al.status = 1 
        AND al.type < 11
      ORDER BY al.start_date ASC
    `;

    const countSql = `
      SELECT COUNT(*) AS totalCount 
      FROM annual_leave al 
      WHERE al.start_date >= ? 
        AND al.start_date <= ? 
        AND al.status = 1 
        AND al.type < 11
    `;

    const values = [startDate, endDate];

    // Execute queries with timeout
    const [countResult, dataResult] = await Promise.all([
      queryWithTimeout(countSql, values),
      queryWithTimeout(dataSql, values)
    ]);

    console.log("Query completed successfully");

    return NextResponse.json({ 
      totalCount: (countResult as any)?.[0]?.totalCount || 0, 
      data: dataResult || [] 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      }
    });
  } catch (err) {
    console.error("Error fetching annual_leave list:", err);
    
    if (err instanceof Error && err.message === 'Database query timeout') {
      return NextResponse.json({ 
        error: "요청 시간이 초과되었습니다. 다시 시도해주세요." 
      }, { status: 504 });
    }
    
    return NextResponse.json({ 
      error: "데이터를 불러오는 중 오류가 발생했습니다." 
    }, { status: 500 });
  }
}
