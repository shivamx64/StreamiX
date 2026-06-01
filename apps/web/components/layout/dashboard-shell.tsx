import { Sidebar } from './sidebar'
import { Navbar } from './navbar'

interface DashboardShellProps { children: React.ReactNode; navTitle?: string }

export function DashboardShell({ children, navTitle }: DashboardShellProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
      <Sidebar />
      <Navbar title={navTitle} />
      <main
        className="flex flex-col"
        style={{ paddingLeft: 'var(--sidebar-width)', paddingTop: 'var(--navbar-height)', minHeight: '100vh' }}
      >
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  )
}