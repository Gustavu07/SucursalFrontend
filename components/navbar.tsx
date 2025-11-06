"use client";

import React from "react";
import {  Navbar,  NavbarBrand,  NavbarContent,  NavbarItem,  NavbarMenu,  NavbarMenuItem,  NavbarMenuToggle,
  Link,  Divider,} from "@heroui/react";
import { cn } from "@heroui/react";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid"; 

const menuItems = [
  { name: "Inicio", href: "/" },
  { name: "Sucursales", href: "/sucursal" },
  { name: "Personal", href: "/personal" },
  { name: "Horarios", href: "/horarios" },
  { name: "Reportes", href: "/reportes" },
];

export default function SucursalNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar
      classNames={{
        base: cn("border-default-100", {
          "bg-default-200/50 dark:bg-default-100/50": isMenuOpen,
        }),
        wrapper: "w-full justify-between",
        item: "hidden md:flex",
      }}
      height="60px"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarBrand>
        <BuildingStorefrontIcon className="h-6 w-6 text-primary" />
        <span className="ml-2 font-semibold text-base">Sistema Sucursales</span>
      </NavbarBrand>

      <NavbarContent justify="center" className="hidden md:flex gap-6">
        {menuItems.map((item) => (
          <NavbarItem key={item.name}>
            <Link
              href={item.href}
              className="text-default-600 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarMenuToggle className="text-default-500 md:hidden" />

      <NavbarMenu className="bg-default-200/50 shadow-medium dark:bg-default-100/50 pt-6 pb-6 backdrop-blur-md backdrop-saturate-150">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={item.name}>
            <Link
              className="text-default-600 mb-2 w-full"
              href={item.href}
              size="md"
            >
              {item.name}
            </Link>
            {index < menuItems.length - 1 && <Divider className="opacity-50" />}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
