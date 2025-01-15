"use client";
import { Product } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";
import moment from "moment";
import Link from "next/link";

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
    accessorKey: "id",
    header: "사번",
    cell: ({ row }) => {
      return row.original.employee_num ? row.original.employee_num : row.getValue("id");
    },
  },
  {
    accessorKey: "name",
    header: "이름",
  },
  {
    accessorKey: "department",
    header: "부서",
  },
  {
    accessorKey: "birthdate",
    header: "생년월일",
    cell: ({ row }) => {
      return row.getValue("birthdate") ? moment(row.getValue("birthdate")).format("YYYY-MM-DD") : "";
    },
  },
  {
    accessorKey: "hp",
    header: "휴대폰번호",
    cell: ({ row }) => {
      return row.getValue("hp") ? String(row.getValue("hp")) : "";
    },
  },
  {
    accessorKey: "startdate",
    header: "입사일",
    cell: ({ row }) => {
      return row.getValue("startdate") ? moment(row.getValue("startdate")).format("YYYY-MM-DD") : "";
    },
  },
  {
    accessorKey: "enddate",
    header: "퇴사일",
    cell: ({ row }) => {
      return row.getValue("enddate") ? moment(row.getValue("enddate")).format("YYYY-MM-DD") : "";
    },
  },
  {
    accessorKey: "annual_leave_count",
    header: "연차 갯수",
    cell: ({ row }) => {
      return (
        <Link className="hover:text-orange-400" href={`/dashboard/employee/${row.original.employee_num}/annualleave`}>
          {row.getValue("annual_leave_count") - row.original.use_leave_count}
        </Link>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
