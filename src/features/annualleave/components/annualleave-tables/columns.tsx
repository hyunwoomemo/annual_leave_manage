"use client";
import { Product } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";
import moment from "moment";
import "moment/locale/ko";
import { Button } from "@/components/ui/button";
import { Check, Edit, Router, Trash, XIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import UpdateAction from "./update-action";

export const columns: ColumnDef<Product>[] = [
  // {
  //   accessorKey: 'photo_url',
  //   header: 'IMAGE',
  //   cell: ({ row }) => {
  //     return (
  //       <div className='relative aspect-square'>
  //         <Image
  //           src={row.getValue('photo_url')}
  //           alt={row.getValue('name')}
  //           fill
  //           className='rounded-lg'
  //         />
  //       </div>
  //     );
  //   }
  // },
  {
    accessorKey: "name",
    header: "이름",
  },
  {
    accessorKey: "department",
    header: "부서",
  },
  {
    accessorKey: "start_date",
    header: "시작일",
    cell: ({ row }) => {
      const start = row.getValue("start_date");
      const end = row.getValue("end_date");
      // const startTime = row.getValue("start_time");
      // const endTime = row.getValue("end_time");

      const daysDifference = moment(end).diff(moment(start), "days");

      // if ()

      // if (daysDifference === 0) {
      //   return `${moment(start).format("YYYY-MM-DD")} (${daysDifference + 1}일)`;
      // } else {

      // }

      return row.getValue("start_date") ? moment(row.getValue("start_date")).format("YYYY-MM-DD (dd)") : "";
    },
  },
  {
    accessorKey: "end_date",
    header: "종료일",
    cell: ({ row }) => {
      return row.getValue("end_date") ? moment(row.getValue("end_date")).format("YYYY-MM-DD (dd)") : "";
    },
  },
  {
    accessorKey: "use",
    header: "사용",
    cell: ({ row }) => {
      switch (row.getValue("type")) {
        case 2:
          return "0.5일";
        case 3:
          return "0.25일";
        default:
          const start = moment(row.getValue("start_date"));
          const end = moment(row.original.end_date);

          // 전체 일수 계산
          let totalDays = end.diff(start, "days") + 1;

          // 주말 개수 계산
          let weekendCount = 0;
          for (let m = moment(start); m.isSameOrBefore(end); m.add(1, "days")) {
            if (m.day() === 0 || m.day() === 6) {
              weekendCount++;
            }
          }

          // 주말 제외하고 연차 개수 계산
          const leaveCount = totalDays - weekendCount;

          return <span>{leaveCount + "일"}</span>;
      }
    },
  },
  {
    accessorKey: "start_time",
    header: "시간",
    cell: ({ row }) => {
      return row.getValue("start_time") ? moment(row.getValue("end_date")).format("YYYY-MM-DD (dd)") : "";
    },
  },
  // {
  //   accessorKey: "created_at",
  //   header: "생성일",
  //   cell: ({ row }) => {
  //     return row.getValue("created_at") ? moment(row.getValue("created_at")).format("YYYY-MM-DD HH:mm:ss") : "";
  //   },
  // },
  {
    accessorKey: "type",
    header: "타입",
    cell: ({ row }) => {
      switch (row.getValue("type")) {
        case 1:
          return "연차";
        case 2:
          return "반차";
        case 3:
          return "반반차";
        case 4:
          return "경조 휴가";
        case 5:
          return "공가";
      }
    },
  },
  // {
  //   id: "status",
  //   cell: ({ row }) => (
  //     <div style={{ gap: 5, display: "flex" }}>
  //       {/* <Button> */}
  //       <div style={{ cursor: "pointer", padding: 3, backgroundColor: "rgb(67,156,128)", borderRadius: 10 }}>
  //         <Check color="white" />
  //       </div>
  //       {/* </Button> */}
  //       {/* <Button> */}
  //       {/* <div style={{ cursor: "pointer", padding: 3, backgroundColor: "tomato", borderRadius: 10 }}>
  //         <XIcon color="white" />
  //       </div> */}
  //       {/* </Button> */}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "description",
    header: "사유",
    cell: ({ row }) => (
      <p title={row.getValue("description")} style={{ maxWidth: 100 }} className="">
        {row.getValue("description")}
      </p>
    ),
    // cell: ({ row }) => <UpdateAction row={row} />,
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => <UpdateAction row={row} />,
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
