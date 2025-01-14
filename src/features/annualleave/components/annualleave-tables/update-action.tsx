import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Edit, Router, Trash, XIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateStatus } from "@/actions/annual_leave/updateStatus";

const UpdateAction = ({ row }) => {
  const router = useRouter();

  const statusText = row.getValue("status") === 1 ? "완료" : row.getValue("status") === 2 ? "반려" : "대기중";
  if (row.getValue("status"))
    return (
      <Button variant="outline" className="cursor-default">
        {/* <span className="sr-only">{statusText}</span> */}
        <span className="">{statusText}</span>
      </Button>
    );

  const handleClick = async (status) => {
    console.log("row.getValue", row.original.id);

    const res = await updateStatus(row, status);
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL/api/annualLeave/updateStatus", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json", // Content-Type 추가
    //   },
    //   body: JSON.stringify({ id: row.original.id, status }),
    // });
    // const json = await res.json();

    if (res.success) {
      toast.success("완료되었습니다.");
      // setTimeout(() => {
      //   router.refresh();
      // }, 300);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="">
          {/* <span className="sr-only">{statusText}</span> */}
          <span className="">{statusText}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}

        <DropdownMenuItem onClick={() => handleClick(1)}>
          {/* <Edit className='mr-2 h-4 w-4' /> Update */}
          결재
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleClick(2)}>반려</DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => setOpen(true)}>
          <Trash className='mr-2 h-4 w-4' /> Delete
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UpdateAction;
