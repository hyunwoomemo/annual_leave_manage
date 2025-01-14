import { NavItem } from "types";

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: "캘린더",
    url: "/dashboard/calendar",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: [], // Empty array as there are no child items for Dashboard
    // admin: true,
  },
  {
    title: "직원",
    url: "/dashboard/employee",
    icon: "employee",
    shortcut: ["p", "p"],
    isActive: false,
    items: [], // No child items
    admin: true,
  },
  {
    title: "연차",
    url: "/#",
    icon: "post",
    shortcut: ["p", "p"],
    isActive: true,
    admin: true,
    items: [
      {
        title: "목록",
        url: "/dashboard/annualleave",
        icon: "product",
        shortcut: ["m", "m"],
        admin: true,
      },
      // {
      //   title: "달력",
      //   shortcut: ["l", "l"],
      //   url: "/dashboard/calendar",
      //   icon: "check",
      // },
    ], // No child items
  },
  {
    title: "마이페이지",
    url: "/#",
    icon: "user",
    shortcut: ["p", "p"],
    isActive: true,
    items: [
      {
        title: "연차",
        url: "/dashboard/myannualleave",
        icon: "product",
        shortcut: ["m", "m"],
        // admin: true,
      },
    ], // No child items
  },
  // {
  //   title: "Account",
  //   url: "#", // Placeholder as there is no direct link for the parent
  //   icon: "billing",
  //   isActive: true,

  //   items: [
  //     {
  //       title: "Profile",
  //       url: "/dashboard/profile",
  //       icon: "userPen",
  //       shortcut: ["m", "m"],
  //     },
  //     {
  //       title: "Login",
  //       shortcut: ["l", "l"],
  //       url: "/",
  //       icon: "login",
  //     },
  //   ],
  // },
  // {
  //   title: "Kanban",
  //   url: "/dashboard/kanban",
  //   icon: "kanban",
  //   shortcut: ["k", "k"],
  //   isActive: false,
  //   items: [], // No child items
  // },
];
