import { SideNavItem } from "@/types/types";
import { Icon } from "@iconify/react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/user/dashboard",
    icon: <Icon icon="ri:dashboard-fill" width="20" height="20" />,
  },
  // {
  //   title: "Plan",
  //   path: "/user/plan",
  //   icon: <Icon icon="icon-park-solid:plan" width="20" height="20" />,
  // },

  {
    title: "Mitschriften",
    path: "/user/notes",
    icon: <Icon icon="material-symbols:add-notes" width="20" height="20" />,
  },
  {
    title: "Downloads nachkaufen",
    path: "/user/buy-credit",
    icon: <Icon icon="streamline:payment-10-solid" width="20" height="20" />,
  },
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <Icon icon="ri:dashboard-fill" width="20" height="20" />,
  },
  {
    title: "Zahlungshistorie",
    path: "/user/payment-history",
    icon: <Icon icon="mdi:recurring-payment" width="20" height="20" />,
  },
  {
    title: "Aktuelles Abo",
    path: "/user/active-plan",
    icon: <Icon icon="icon-park-solid:plan" width="20" height="20" />,
  },

  // {
  //   title: "Subscribed Plan",
  //   path: "/admin/subscribed-plan-list",
  //   icon: (
  //     <Icon
  //       icon="mdi:subscriber-identification-module"
  //       width="20"
  //       height=024"
  //     />
  //   ),
  // },
  {
    title: "Subscription Plan",
    path: "/admin/subscription-plan/subscription-list",
    icon: (
      <Icon icon="eos-icons:product-subscriptions" width="20" height="20" />
    ),
    // submenu: true,
    // subMenuItems: [
    //   {
    //     title: "Create Subscription",
    //     path: "/admin/subscription-plan/create-subscription",
    //   },
    //   {
    //     title: "Edit Subscription",
    //     path: "/admin/subscription-plan/edit-subscription",
    //   },
    //   {
    //     title: "Subscription List",
    //     path: "/admin/subscription-plan/subscription-list",
    //   },
    // ],
  },
  {
    title: "Users",
    path: "/admin/user-list",
    icon: <Icon icon="fa:users" width="20" height="20" />,
  },

  {
    title: "Settings",
    path: "/admin/settings",
    icon: <Icon icon="ant-design:setting-filled" width="20" height="20" />,
  },
  {
    title: "Zur Plattform",
    path: "/chat",
    icon: <Icon icon="oi:chat" width="20" height="20" />,
  },

  // {
  //   title: "Projects",
  //   path: "/projects",
  //   icon: <Icon icon="lucide:folder" width="20" height="20" />,
  //   submenu: true,
  //   subMenuItems: [{ title: "All", path: "/projects" }],
  // },
  // {
  //   title: "Messages",
  //   path: "/messages",
  //   icon: <Icon icon="lucide:mail" width="20" height="20" />,
  // },
  // {
  //   title: "Settings",
  //   path: "/settings",
  //   icon: <Icon icon="lucide:settings" width="20" height="20" />,
  //   submenu: true,
  //   subMenuItems: [
  //     { title: "Account", path: "/settings/account" },
  //     { title: "Privacy", path: "/settings/privacy" },
  //   ],
  // },
  // {
  //   title: "Help",
  //   path: "/help",
  //   icon: <Icon icon="lucide:help-circle" width="20" height="20" />,
  // },
];
