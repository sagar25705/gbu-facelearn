import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import AdminSidebar from "@/components/admin/AdminSidebar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, GraduationCap, BookOpen } from "lucide-react";

import { adminAPI } from "@/services/api"; // <-- Make sure api.ts exports adminAPI

// =======================
//  🟦 REUSABLE STAT CARD
// =======================
function StatCard({ title, value, icon: Icon, gradient }) {
  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-foreground">{value}</div>

          <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-10`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const location = useLocation();
  const isRootPath = location.pathname === "/admin";

  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [schoolDistribution, setSchoolDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  // =======================
  //  FETCH REAL DASHBOARD DATA
  // =======================
  useEffect(() => {
    if (location.pathname === "/admin") {
        loadDashboard();
    }
}, [location.pathname]);


  const loadDashboard = async () => {
    try {
      const res = await adminAPI.getData(); // From backend GET /admin/stats

      setStats(res.stats);
      setRecentActivities(res.recentActivities);
      setSchoolDistribution(res.schoolDistribution);
    } catch (err) {
      console.error("❌ Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        {isRootPath ? (
          <div className="p-6">
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage students, teachers, schools and attendance
              </p>
            </div>

            {/* ======================= */}
            {/*     TOP STAT CARDS       */}
            {/* ======================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Schools"
                value={stats.totalSchools}
                icon={School}
                gradient="from-blue-500 to-cyan-500"
              />

              <StatCard
                title="Total Students"
                value={stats.totalStudents}
                icon={Users}
                gradient="from-purple-500 to-pink-500"
              />

              <StatCard
                title="Total Teachers"
                value={stats.totalTeachers}
                icon={GraduationCap}
                gradient="from-green-500 to-emerald-500"
              />

              <StatCard
                title="Active Courses"
                value={stats.activeCourses}
                icon={BookOpen}
                gradient="from-orange-500 to-red-500"
              />
            </div>

            {/* ======================= */}
            {/*  RECENT ACTIVITIES + DISTRIBUTION */}
            {/* ======================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* ===== Recent Activities ===== */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((a, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground capitalize">
                            {a.action.replace("_", " ")}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            User: {a.by}
                          </p>
                        </div>

                        <span className="text-xs text-muted-foreground">{a.timeAgo}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ===== School Distribution ===== */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>School Distribution</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {schoolDistribution.map((s, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{s.school}</span>
                          <span className="text-muted-foreground">{s.students} students</span>
                        </div>

                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${(s.students / stats.totalStudents) * 100}%`,
                            }}
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
