import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Filter } from 'lucide-react';
import { adminAPI } from '@/services/api';

type StudentUI = {
  id: string;
  rollNo: string;
  name: string;
  email: string | null;
  phone: string | null;
  school: string;
  department: string;
  course: string;
  semester: number | null;
};

export default function ViewStudents() {
  const [students, setStudents] = useState<StudentUI[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentUI[]>([]);
  const [filters, setFilters] = useState({
    school: 'all',
    course: 'all',
    department: 'all',
  });

  // Fetch from backend
  useEffect(() => {
    adminAPI.getStudents().then((data: any[]) => {
      const mapped = data.map((s) => ({
        id: s.roll_no,
        rollNo: s.roll_no,
        name: s.name,
        email: s.email,
        phone: s.phone_number,
        school: s.school?.school_name ?? "Unknown School",
department: s.department?.department_name ?? "Unknown Department",
course: s.department?.school?.school_name ?? "Unknown Course",

        semester: s.semester,
      }));

      setStudents(mapped);
      setFilteredStudents(mapped);
    });
  }, []);

  // Extract unique filter groups
  const schools = ['all', ...new Set(students.map((s) => s.school))];
  const courses = ['all', ...new Set(students.map((s) => s.course))];
  const departments = ['all', ...new Set(students.map((s) => s.department))];

  // Apply filters
  useEffect(() => {
    let list = [...students];

    if (filters.school !== 'all') {
      list = list.filter((s) => s.school === filters.school);
    }
    if (filters.course !== 'all') {
      list = list.filter((s) => s.course === filters.course);
    }
    if (filters.department !== 'all') {
      list = list.filter((s) => s.department === filters.department);
    }

    setFilteredStudents(list);
  }, [filters, students]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">View All Students</h1>
        <p className="text-muted-foreground">Browse and filter student records</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Student Directory</span>
              </CardTitle>
              <CardDescription>Filter students by school, course, or department</CardDescription>
            </div>
            <div className="bg-primary/10 px-4 py-2 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-primary">{filteredStudents.length}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Filters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* School */}
              <Select value={filters.school} onValueChange={(value) => handleFilterChange('school', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select School" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school === 'all' ? 'All Schools' : school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Course */}
              <Select value={filters.course} onValueChange={(value) => handleFilterChange('course', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course === 'all' ? 'All Courses' : course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Department */}
              <Select
                value={filters.department}
                onValueChange={(value) => handleFilterChange('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>School</TableHead>
                  {/* <TableHead>Course</TableHead> */}
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.rollNo}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.school}</TableCell>
                      {/* <TableCell>{s.course}</TableCell> */}
                      <TableCell>{s.department}</TableCell>
                      <TableCell>{s.semester ?? '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No students found with selected filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
