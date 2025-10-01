import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Filter } from 'lucide-react';
import { Student } from '@/types/auth';

// Mock data - same structure as ManageStudents
const allStudents: Student[] = [
  {
    id: '1',
    name: 'Rahul Singh',
    rollNo: '2024CS001',
    email: 'rahul.singh@gbu.ac.in',
    phone: '+91 9876543210',
    fatherName: 'Mr. Rajesh Singh',
    school: 'School of Engineering',
    course: 'B.Tech',
    department: 'Computer Science',
    semester: 3,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Priya Sharma',
    rollNo: '2024IT002',
    email: 'priya.sharma@gbu.ac.in',
    phone: '+91 9876543211',
    fatherName: 'Mr. Prakash Sharma',
    school: 'School of Engineering',
    course: 'B.Tech',
    department: 'Information Technology',
    semester: 3,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Amit Kumar',
    rollNo: '2024MBA003',
    email: 'amit.kumar@gbu.ac.in',
    phone: '+91 9876543212',
    fatherName: 'Mr. Arun Kumar',
    school: 'School of Management',
    course: 'MBA',
    department: 'Finance',
    semester: 2,
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Neha Verma',
    rollNo: '2024LAW004',
    email: 'neha.verma@gbu.ac.in',
    phone: '+91 9876543213',
    fatherName: 'Mr. Suresh Verma',
    school: 'School of Law',
    course: 'BA LLB',
    department: 'Corporate Law',
    semester: 4,
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'Karan Mehta',
    rollNo: '2024CS005',
    email: 'karan.mehta@gbu.ac.in',
    phone: '+91 9876543214',
    fatherName: 'Mr. Vinod Mehta',
    school: 'School of Engineering',
    course: 'B.Tech',
    department: 'Computer Science',
    semester: 3,
    createdAt: new Date(),
  },
];

export default function ViewStudents() {
  const [students] = useState<Student[]>(allStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(allStudents);
  const [filters, setFilters] = useState({
    school: 'all',
    course: 'all',
    department: 'all',
  });

  const schools = ['all', ...new Set(students.map((s) => s.school))];
  const courses = ['all', ...new Set(students.map((s) => s.course))];
  const departments = ['all', ...new Set(students.map((s) => s.department))];

  useEffect(() => {
    let filtered = [...students];

    if (filters.school !== 'all') {
      filtered = filtered.filter((s) => s.school === filters.school);
    }
    if (filters.course !== 'all') {
      filtered = filtered.filter((s) => s.course === filters.course);
    }
    if (filters.department !== 'all') {
      filtered = filtered.filter((s) => s.department === filters.department);
    }

    setFilteredStudents(filtered);
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
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Filters</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
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

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{student.email}</TableCell>
                      <TableCell>{student.school}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell className="text-center">{student.semester || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No students found with the selected filters
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