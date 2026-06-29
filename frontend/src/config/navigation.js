export const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "🏠",
    roles: ["ADMIN", "FLEET_MANAGER"],
  },

  {
    label: "Vehicles",
    path: "/vehicles",
    icon: "🚗",
    roles: ["ADMIN", "FLEET_MANAGER"],
  },

  {
    label: "Drivers",
    path: "/drivers",
    icon: "👨‍✈️",
    roles: ["ADMIN", "FLEET_MANAGER"],
  },

  {
    label: "Assignments",
    path: "/assignments",
    icon: "🔁",
    roles: ["ADMIN", "FLEET_MANAGER"],
  },

  {
    label: "Maintenance",
    path: "/maintenance",
    icon: "🔧",
    roles: ["ADMIN", "FLEET_MANAGER", "MECHANIC"],
  },

  {
    label: "Driver Portal",
    path: "/driver-portal",
    icon: "📱",
    roles: ["ADMIN", "DRIVER"],
  },

  {
    label: "Reports",
    path: "/reports",
    icon: "📊",
    roles: ["ADMIN", "FLEET_MANAGER"],
  },

  {
    label: "Settings",
    path: "/settings",
    icon: "⚙️",
    roles: ["ADMIN"],
  },
];