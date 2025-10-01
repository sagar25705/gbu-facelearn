import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, School, GraduationCap, BookOpen } from 'lucide-react';

const stats = [
  {
    title: 'Total Schools',
    value: '7',
    icon: School,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Total Students',
    value: '3,245',
    icon: Users,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Total Teachers',
    value: '128',
    icon: GraduationCap,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Active Courses',
    value: '42',
    icon: BookOpen,
    gradient: 'from-orange-500 to-red-500',
  },
];

export default function AdminDashboard() {
  const location = useLocation();
  const isRootPath = location.pathname === '/admin';

  return (
    <div className="flex h-[calc(100vh-73px)]">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        {isRootPath ? (
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage students, teachers, and attendance records</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <Card key={stat.title} className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} bg-opacity-10`}>
                        <stat.icon className="h-6 w-6 text-white" 
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))',
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'New student added', name: 'Priya Sharma', time: '2 hours ago' },
                      { action: 'Student updated', name: 'Rahul Singh', time: '5 hours ago' },
                      { action: 'Attendance submitted', name: 'Prof. Kumar', time: '1 day ago' },
                      { action: 'New teacher registered', name: 'Dr. Patel', time: '2 days ago' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.name}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>School Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { school: 'School of Engineering', students: 1245, color: 'bg-blue-500' },
                      { school: 'School of Management', students: 756, color: 'bg-green-500' },
                      { school: 'School of Law', students: 432, color: 'bg-purple-500' },
                      { school: 'School of Science', students: 812, color: 'bg-orange-500' },
                    ].map((school) => (
                      <div key={school.school} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{school.school}</span>
                          <span className="text-muted-foreground">{school.students} students</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`${school.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${(school.students / 1245) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}