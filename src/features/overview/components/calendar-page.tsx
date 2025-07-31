"use client";

import { searchParamsCache } from "@/lib/searchparams";
import React, { useEffect, useState } from "react";
import Calendar from "./calendar";

interface CalendarData {
  totalCount: number;
  data: any[];
}

export default function CalendarPage() {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const year = searchParamsCache.get("year");
  const month = searchParamsCache.get("month");

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/annualLeave/listByMonth?year=${year}&month=${month}`,
          {
            signal: controller.signal,
            headers: {
              'Cache-Control': 'no-cache',
            },
          }
        );

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        setCalendarData(result);

        console.log("Calendar data loaded:", result);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            setError('요청 시간이 초과되었습니다. 다시 시도해주세요.');
          } else {
            setError(`데이터 로딩 중 오류가 발생했습니다: ${err.message}`);
          }
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
        console.error("Calendar data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (year && month) {
      fetchCalendarData();
    } else {
      setLoading(false);
      setError('년도와 월 정보가 필요합니다.');
    }
  }, [year, month]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>캘린더 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!calendarData) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>데이터를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return <Calendar totalCount={calendarData.totalCount} data={calendarData.data} />;
}
