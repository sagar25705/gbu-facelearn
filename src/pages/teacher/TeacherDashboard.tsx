import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Users, Hash, BookOpen, UserPlus, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AttendanceRecord } from '@/types/auth';
import { teacherAPI } from '@/services/api';

const schoolSubjectMap = {
  'School of Engineering': {
    'B.Tech': {
      'Computer Science': {
        '1': ['CS101 - Programming Fundamentals', 'CS102 - Digital Logic', 'MA101 - Engineering Mathematics'],
        '2': ['CS201 - Data Structures', 'CS202 - Computer Organization', 'MA201 - Discrete Mathematics'],
        '3': ['CS301 - Algorithms', 'CS302 - Operating Systems', 'CS303 - Database Systems'],
        '4': ['CS401 - Computer Networks', 'CS402 - Software Engineering', 'CS403 - Compiler Design'],
      },
      'Information Technology': {
        '1': ['IT101 - Web Technologies', 'IT102 - Programming in C', 'MA101 - Engineering Mathematics'],
        '2': ['IT201 - Object Oriented Programming', 'IT202 - Data Structures', 'IT203 - DBMS'],
        '3': ['IT301 - Computer Networks', 'IT302 - Software Engineering', 'IT303 - Operating Systems'],
      },
    },
  },
  'School of Management': {
    'MBA': {
      'Finance': {
        '1': ['FIN101 - Financial Accounting', 'FIN102 - Corporate Finance', 'MGT101 - Management Principles'],
        '2': ['FIN201 - Investment Analysis', 'FIN202 - Financial Markets', 'FIN203 - Risk Management'],
      },
    },
  },
};

export default function TeacherDashboard() {
  const [selection, setSelection] = useState({
    school: '',
    course: '',
    department: '',
    semester: '',
    subject: '',
  });

  const [classCode, setClassCode] = useState('');
  const [codeExpiry, setCodeExpiry] = useState(0);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);
  const [manualStudent, setManualStudent] = useState({ name: '', rollNo: '' });

  // Get available options based on selections
  const schools = Object.keys(schoolSubjectMap);
  const courses = selection.school ? Object.keys(schoolSubjectMap[selection.school as keyof typeof schoolSubjectMap] || {}) : [];
  const departments = selection.school && selection.course 
    ? Object.keys(schoolSubjectMap[selection.school as keyof typeof schoolSubjectMap]?.[selection.course as keyof typeof schoolSubjectMap['School of Engineering']] || {})
    : [];
  const semesters = selection.department ? ['1', '2', '3', '4'] : [];
  const subjects = selection.school && selection.course && selection.department && selection.semester
    ? schoolSubjectMap[selection.school as keyof typeof schoolSubjectMap]?.[selection.course as keyof typeof schoolSubjectMap['School of Engineering']]?.[selection.department as keyof typeof schoolSubjectMap['School of Engineering']['B.Tech']]?.[selection.semester as keyof typeof schoolSubjectMap['School of Engineering']['B.Tech']['Computer Science']] || []
    : [];

  const isFormComplete = Object.values(selection).every(val => val !== '');

  // Timer countdown effect
  useEffect(() => {
    if (codeExpiry > 0) {
      const timer = setInterval(() => {
        setCodeExpiry(prev => {
          if (prev <= 1) {
            setClassCode('');
            setAttendanceRecords([]);
            toast.error('Class code has expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [codeExpiry]);

  const generateClassCode = async () => {
  try {
    if (!isFormComplete) {
      toast.error("Please select all fields");
      return;
    }

    const res = await teacherAPI.generateClassCode({
      course_code: selection.subject.split(" - ")[0],
      class_id: 1,
    });

    setClassCode(res.unique_code);
    setCodeExpiry(res.expires_in);
    setAttendanceRecords([]);

  } catch (err) {
    console.error(err);
    toast.error("Failed to generate class code");
  }
};


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const removeAttendance = (id: string) => {
    setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
    toast.success('Attendance removed');
  };

  const addManualAttendance = () => {
    if (!manualStudent.name || !manualStudent.rollNo) {
      toast.error('Please fill all fields');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      studentName: manualStudent.name,
      rollNo: manualStudent.rollNo,
      timestamp: new Date(),
      subjectCode: selection.subject.split(' - ')[0],
      subjectName: selection.subject.split(' - ')[1],
      teacherId: 'TEACH001',
    };

    setAttendanceRecords([...attendanceRecords, newRecord]);
    setIsManualAddOpen(false);
    setManualStudent({ name: '', rollNo: '' });
    toast.success('Student added manually');
  };

  const submitFinalAttendance = () => {
    if (attendanceRecords.length === 0) {
      toast.error('No attendance records to submit');
      return;
    }

    toast.success(`Attendance submitted for ${attendanceRecords.length} students`);
    setClassCode('');
    setCodeExpiry(0);
    setAttendanceRecords([]);
    setSelection({
      school: '',
      course: '',
      department: '',
      semester: '',
      subject: '',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Generate class codes and track live attendance</p>
      </div>

      {/* Attendance Generation Section */}
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Generate Class Code</span>
          </CardTitle>
          <CardDescription>Select class details to generate an attendance code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Select value={selection.school} onValueChange={(value) => setSelection({...selection, school: value, course: '', department: '', semester: '', subject: ''})}>
              <SelectTrigger>
                <SelectValue placeholder="Select School" />
              </SelectTrigger>
              <SelectContent>
                {schools.map(school => (
                  <SelectItem key={school} value={school}>{school}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selection.course} onValueChange={(value) => setSelection({...selection, course: value, department: '', semester: '', subject: ''})} disabled={!selection.school}>
              <SelectTrigger>
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selection.department} onValueChange={(value) => setSelection({...selection, department: value, semester: '', subject: ''})} disabled={!selection.course}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selection.semester} onValueChange={(value) => setSelection({...selection, semester: value, subject: ''})} disabled={!selection.department}>
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map(sem => (
                  <SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selection.subject} onValueChange={(value) => setSelection({...selection, subject: value})} disabled={!selection.semester}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={generateClassCode} 
              disabled={!isFormComplete || classCode !== ''}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Generate Class Code
            </Button>
          </div>

          {classCode && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Hash className="h-8 w-8 text-primary" />
                <span className="text-5xl font-bold text-primary">{classCode}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Code expires in: <span className="font-semibold text-foreground">{formatTime(codeExpiry)}</span></span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Attendance Tracking */}
      {classCode && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Today's Attendance - {selection.subject.split(' - ')[1]}</span>
                </CardTitle>
                <CardDescription>Live attendance tracking for current session</CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{attendanceRecords.length}</p>
                  <p className="text-xs text-muted-foreground">Total Present</p>
                </div>
                <Button
                  onClick={() => setIsManualAddOpen(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Manually</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">S.No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record, index) => (
                      <TableRow key={record.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{record.studentName}</TableCell>
                        <TableCell>{record.rollNo}</TableCell>
                        <TableCell>{new Date(record.timestamp).toLocaleTimeString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeAttendance(record.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Waiting for students to mark attendance...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {attendanceRecords.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={submitFinalAttendance}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Final Attendance
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual Add Dialog */}
      <Dialog open={isManualAddOpen} onOpenChange={setIsManualAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Student Manually</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input
                id="rollNo"
                value={manualStudent.rollNo}
                onChange={(e) => setManualStudent({...manualStudent, rollNo: e.target.value})}
                placeholder="Enter roll number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                value={manualStudent.name}
                onChange={(e) => setManualStudent({...manualStudent, name: e.target.value})}
                placeholder="Enter student name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManualAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addManualAttendance}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}