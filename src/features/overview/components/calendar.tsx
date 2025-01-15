"use client";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// pages/calendar.js
import FullCalendar from "@fullcalendar/react"; // React FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid"; // FullCalendar의 dayGrid 뷰 플러그인
import interactionPlugin from "@fullcalendar/interaction"; // for selectable
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import koLocale from "@fullcalendar/core/locales/ko"; // 한국어 로케일 임포트
import { useRouter } from "next/navigation";
import moment from "moment";
import { useTheme } from "next-themes";

export default function Calendar({ data, totalCount }) {
  const [year, setYear] = useQueryState("year", parseAsInteger.withOptions({ shallow: false }).withDefault(new Date().getFullYear()));
  const [month, setMonth] = useQueryState("month", parseAsInteger.withOptions({ shallow: false }).withDefault(new Date().getMonth()));
  const [events, setEvents] = useState();
  const router = useRouter();
  const { theme } = useTheme();

  const handleDatesSet = (info) => {
    console.log("info", info, info.start);

    // info.start는 보여지는 캘린더 시작 날짜, info.end는 종료 날짜
    const currentYear = info.view.currentStart.getFullYear();
    const currentMonth = info.view.currentStart.getMonth(); // 0부터 시작 (1월이 0)

    console.log("currentYear", currentYear, currentMonth);

    setYear(currentYear);
    setMonth(currentMonth);
  };

  // useEffect(() => {
  //   setYear(new Date().getFullYear());
  //   setMonth(new Date().getMonth());
  // }, []);

  function getColorFromId(userId) {
    // 유저 ID를 숫자로 변환하고, 고유의 색상을 생성
    const colors = ["#A89F8D", "#D27D7D", "#6B93B3", "#BDAF8D", "#9CC2A8", "#F6B352"]; // 원하는 색상 목록
    return colors[userId % colors.length]; // ID를 색상 배열의 길이로 나눈 나머지로 색상 선택
  }

  useEffect(() => {
    if (data) {
      const events = data.map((item) => {
        console.log("ite", item);
        const type = item.type === 1 ? "연차" : item.type === 2 ? (item.type2 === 1 ? "오전 반차" : "오후 반차") : item.type === 3 ? "공가" : item.type === 4 ? "경조 휴가" : "휴가";
        return {
          id: item.id,
          title: `${item.name} (${type})`, // 표시할 제목
          start: item.type2 == 2 ? moment(item.start_date).format("YYYY-MM-DD 13:00") : item.type2 == 1 ? moment(item.start_date).format("YYYY-MM-DD 09:00") : item.start_date, // 시작 날짜
          end: moment(item.end_date).add(1, "day").format("YYYY-MM-DD"), // 종료 날짜
          allDay: item.type === 1 || item.type === 3 || item.type === 4 ? true : false,
          backgroundColor: getColorFromId(item.employee_id),
          borderColor: getColorFromId(item.employee_id),
        };
      });
      setEvents(events);
    }
  }, [data]);

  const handleCustomButtonClick = () => {
    // 여기에 연차 신청 관련 로직 추가
    router.push("/dashboard/annualleave/create");
  };

  return (
    <PageContainer scrollable>
      {/* <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Hi, Welcome back 👋</h2>
          <div className="hidden items-center space-x-2 md:flex">
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4"> */}
      {/* <div style={{ width: "80%", height: "" }}> */}
      <FullCalendar
        // dragScroll
        // selectable
        // dayHeaderContent={(arg) => <div className={`${}`}>{arg.text}</div>}

        dayHeaderClassNames={theme === "dark" ? "dayheader-dark" : "dayheader-light"}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        datesSet={handleDatesSet}
        events={events}
        locale={koLocale}
        // unselectAuto
        // unselect={ }
        height="auto" // 자동으로 화면 크기에 맞추기
        // contentHeight="auto" // 콘텐츠 높이를 자동으로 설정
        windowResizeDelay={0} // 창 크기 조정 시 지연 시간 제거
        // viewHeight={"100%"}
        headerToolbar={{
          left: "",
          center: "title",
          // right: "today 연차신청 prev,next",
        }}
        // customButtons={{
        //   연차신청: {
        //     text: "연차 신청",
        //     click: handleCustomButtonClick,
        //   },
        // }}
        // selectAllow={(e) => {
        //   console.log("eee", e);
        //   return true;
        // }}
      />
      {/* </div> */}
      {/* </TabsContent>
        </Tabs>
      </div> */}
    </PageContainer>
  );
}
