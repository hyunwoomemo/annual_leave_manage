import executeQuery from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") !== "null" ? (searchParams.get("year") ? parseInt(searchParams.get("year")) : new Date().getFullYear()) : new Date().getFullYear();

    const month = searchParams.get("month") !== "null" ? (searchParams.get("month") ? parseInt(searchParams.get("month")) + 1 : new Date().getMonth() + 1) : new Date().getMonth() + 1;

    console.log(";year", year, searchParams.get("year"), month, searchParams.get("month"));

    // 이전, 현재, 다음 달 및 연도 계산
    const prevMonth = month === 1 ? 12 : month - 1;
    const nextMonth = month === 12 ? 1 : month + 1;

    const prevYear = month === 1 ? year - 1 : year;
    const nextYear = month === 12 ? year + 1 : year;

    const currentYear = year;

    // 3개월 조건 배열 생성
    const monthsAndYears = [
      { year: prevYear, month: prevMonth },
      { year: currentYear, month: month },
      { year: nextYear, month: nextMonth },
    ];

    console.log("monthsAndYears", monthsAndYears);

    // 총 갯수 쿼리
    let countSql = `SELECT COUNT(*) AS totalCount FROM annual_leave al`;
    let dataSql = `SELECT al.*, e.name, e.department FROM annual_leave al JOIN employees e ON al.employee_id = e.id`;

    // 조건 추가
    let conditions = [];
    let values = [];

    monthsAndYears.forEach(({ year, month }) => {
      conditions.push(`(YEAR(al.start_date) = ? AND MONTH(al.start_date) = ?)`);
      values.push(year, month);
    });

    // status > -1 조건 추가
    const statusCondition = `al.status = 1`;

    // 조건 연결
    if (conditions.length > 0) {
      const combinedConditions = `(${conditions.join(" OR ")})`;
      countSql += ` WHERE ` + combinedConditions + ` AND ` + statusCondition;
      dataSql += ` WHERE ` + combinedConditions + ` AND ` + statusCondition;
    } else {
      countSql += ` WHERE ` + statusCondition;
      dataSql += ` WHERE ` + statusCondition;
    }

    const countResult = await executeQuery(countSql, values);
    const result = await executeQuery(dataSql, values);

    console.log("countResult", countResult, result);

    return NextResponse.json({ totalCount: countResult?.[0]?.totalCount, data: result }, { status: 200 });
  } catch (err) {
    console.error("Error fetching annual_leave list:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
