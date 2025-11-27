import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  UserCog,
  School,
  GraduationCap,
  UserCheck,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin',
  },
  {
    title: 'Add New Student',
    icon: UserPlus,
    path: '/admin/add-student',
  },
  {
    title: 'Manage Students',
    icon: UserCog,
    path: '/admin/manage-students',
  },
  {
    title: 'View All Students',
    icon: Users,
    path: '/admin/view-students',
  },
  // ✅ NEW: Teacher Management Options
  {
    title: 'Add New Teacher',
    icon: GraduationCap,
    path: '/admin/add-teacher',
  },
  {
    title: 'Manage Teachers',
    icon: UserCheck,
    path: '/admin/manage-teachers',
  },
  {
    title: 'View All Teachers',
    icon: Eye,
    path: '/admin/view-teachers',
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border h-[calc(100vh-73px)] overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6 px-2">
          <School className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-secondary/50',
                  isActive
                    ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-l-4 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-sm">{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
