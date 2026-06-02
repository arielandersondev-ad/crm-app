'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Orbit,
  LifeBuoy,
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
} from 'lucide-react'
import { cn } from '@/shared/utils/utils'


export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <Orbit className="size-5 text-primary" />
        </div>

        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-foreground">
            Nebula Vet
          </p>
          <p className="text-xs text-muted-foreground">
            Clínica Norte
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href="/dashboard"
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive('/dashboard')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <LayoutDashboard
                className={cn(
                  'size-4.5',
                  isActive('/dashboard')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              />
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              href="/clientes"
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive('/clientes')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <Users
                className={cn(
                  'size-4.5',
                  isActive('/clientes')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              />
              Clientes
            </Link>
          </li>

          <li>
            <Link
              href="/citas"
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive('/citas')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <Calendar
                className={cn(
                  'size-4.5',
                  isActive('/citas')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              />
              Citas
            </Link>
          </li>

          <li>
            <Link
              href="/configuracion"
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive('/configuracion')
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <Settings
                className={cn(
                  'size-4.5',
                  isActive('/configuracion')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              />
              Configuración
            </Link>
          </li>
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/ayuda"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <LifeBuoy className="size-4.5" />
          Centro de ayuda
        </Link>
      </div>
    </aside>
  )
}