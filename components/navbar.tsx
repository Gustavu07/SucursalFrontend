"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Divider,
} from "@heroui/react";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";

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
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white text-gray-800 shadow-sm backdrop-blur-md"
      maxWidth="xl"
    >
      {/* Marca */}
      <NavbarBrand className="flex items-center gap-2">
        <BuildingStorefrontIcon className="w-6 h-6 text-blue-600" />
        <p className="font-semibold text-lg text-gray-800">
          Sistema Sucursales
        </p>
      </NavbarBrand>

      {/* Menú Desktop */}
      <NavbarContent justify="center" className="hidden md:flex gap-6">
        {menuItems.map((item) => (
          <NavbarItem key={item.name}>
            <Link
              href={item.href}
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Toggle para móviles */}
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        className="md:hidden text-gray-700"
      />

      {/* Menú móvil */}
      <NavbarMenu className="bg-white shadow-lg border-t border-gray-100 mt-2 rounded-lg py-4">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={item.name} className="px-4">
            <Link
              href={item.href}
              className="block text-gray-700 font-medium hover:text-blue-600 py-2 transition-colors duration-200"
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
