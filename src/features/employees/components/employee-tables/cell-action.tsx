"use client";
import { deleteEmployee } from "@/actions/employee/delete";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Product } from "@/constants/data";
import { selectedEmployee } from "@/store/employee/atom";
import { useAtom } from "jotai";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CellActionProps {
  data: Product;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [employee, setEmployee] = useAtom(selectedEmployee);

  const handleUpdateClick = () => {
    setEmployee(data);
    router.push(`/dashboard/employee/update/${data.id}`);
  };

  const onConfirm = async () => {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/update`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json", // Content-Type 추가
    //   },
    //   body: JSON.stringify({ status: -1, id: data.id }),
    // });
    // const json = await res.json();
    const res = await deleteEmployee(data.id);

    if (res) {
      toast.success("직원이 삭제되었습니다.");
      setOpen(false);
    } else {
      toast.success("직원이 삭제 실패했습니다.");
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal title="정말 삭제하시겠습니까?" description="삭제는 되돌릴 수 없습니다." isOpen={open} onClose={() => setOpen(false)} onConfirm={onConfirm} loading={loading} />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={handleUpdateClick}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
