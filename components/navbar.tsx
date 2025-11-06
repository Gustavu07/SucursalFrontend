"use client";

import React from "react";
import {  Navbar,  NavbarBrand,  NavbarContent,  NavbarItem,  NavbarMenu,  NavbarMenuItem,  NavbarMenuToggle,
  Link,  Divider,} from "@heroui/react";

const menuItems = [
  { name: "Inicio", href: "/" },
  { name: "Sucursales", href: "/sucursales" },
  { name: "Personal", href: "/personal" },
  { name: "Horarios", href: "/horarios" },
  { name: "Reportes", href: "/reportes" },
];

export default function SucursalNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar
      maxWidth="xl"
      className="bg-white shadow-md border-b border-gray-100"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarBrand className="flex items-center gap-2">
        <span className="font-semibold text-gray-800 text-lg">
          Sistema Sucursales
        </span>
      </NavbarBrand>

      <NavbarContent justify="center" className="hidden md:flex gap-6">
        {menuItems.map((item) => (
          <NavbarItem key={item.name}>
            <Link
              href={item.href}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        className="md:hidden text-gray-600"
      />

      {/* Menú móvil */}
      <NavbarMenu className="bg-white shadow-lg mt-2 rounded-lg border border-gray-100 py-4">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={item.name} className="px-4">
            <Link
              className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
              href={item.href}
              size="md"
            >
              {item.name}
            </Link>
            {index < menuItems.length - 1 && (
              <Divider className="opacity-50 my-2" />
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
