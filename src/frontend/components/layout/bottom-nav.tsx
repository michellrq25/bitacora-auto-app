'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gauge, Wrench, ShieldAlert, PlusCircle } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Panel',
      href: '/',
      icon: Gauge,
      active: pathname === '/',
    },
    {
      label: 'Servicios',
      href: '/mantenimientos',
      icon: Wrench,
      active: pathname.startsWith('/mantenimientos') && pathname !== '/mantenimientos/nuevo',
    },
    {
      label: 'Nuevo',
      href: '/mantenimientos/nuevo',
      icon: PlusCircle,
      isSpecial: true,
      active: pathname === '/mantenimientos/nuevo',
    },
    {
      label: 'Documentos',
      href: '/documentos',
      icon: ShieldAlert,
      active: pathname.startsWith('/documentos'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shadow-2xl">
      <div className="mx-auto flex max-w-md items-center justify-around px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className="group -mt-5 flex flex-col items-center focus:outline-none"
              >
                <div
                  className={`flex h-13 w-13 items-center justify-center rounded-full p-3 shadow-lg shadow-sky-500/25 transition-transform duration-200 active:scale-95 ${
                    item.active
                      ? 'bg-sky-400 text-slate-950 ring-4 ring-sky-500/30'
                      : 'bg-gradient-to-tr from-sky-500 to-cyan-400 text-slate-950 group-hover:scale-105'
                  }`}
                >
                  <Icon className="h-6 w-6 stroke-[2.5]" />
                </div>
                <span
                  className={`mt-1 text-[11px] font-semibold tracking-tight transition-colors ${
                    item.active ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={`bottom-nav-item flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-all duration-150 active:scale-90 ${
                item.active
                  ? 'bottom-nav-active text-sky-600 dark:text-sky-400 font-bold'
                  : 'bottom-nav-inactive text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform duration-200 ${
                  item.active ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                }`}
              />
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
