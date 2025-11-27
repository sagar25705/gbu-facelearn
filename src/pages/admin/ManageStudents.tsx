import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Search, Edit, Trash2, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { adminAPI } from '@/services/api';

interface StudentUI {
  rollNo: string;
  name: string;
  email: string | null;
  phone_number: string | null;
  school: string;
  department: string;
  course: string;
  semester: number | null;
}

export default function ManageStudents() {
  const [students, setStudents] = useState<StudentUI[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentUI | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<StudentUI>>({});

  // FETCH STUDENTS FROM BACKEND
  useEffect(() => {
    adminAPI.getStudents().then((data) => {
      const mapped = data.map((s: any) => ({
        rollNo: s.roll_no,
        name: s.name,
        email: s.email,
        phone_number: s.phone_number,
        school: s.school?.school_name ?? "Unknown",
        department: s.department?.department_name ?? "Unknown",
        course: s.department?.school?.school_name ?? "Unknown",
        semester: s.semester
      }));

      setStudents(mapped);
    }).catch(() => toast.error("Failed to load students"));
  }, []);

  // FILTER STUDENTS
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // OPEN EDIT
  const handleEdit = (student: StudentUI) => {
    setSelectedStudent(student);
    setEditFormData(student);
    setIsEditDialogOpen(true);
  };

  // OPEN DELETE CONFIRM
  const handleDelete = (student: StudentUI) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  // DELETE STUDENT (BACKEND)
  const confirmDelete = async () => {
    if (!selectedStudent) return;

    try {
      await adminAPI.deleteStudent(selectedStudent.rollNo);
      setStudents(students.filter((s) => s.rollNo !== selectedStudent.rollNo));
      toast.success(`Deleted ${selectedStudent.name}`);
    } catch {
      toast.error("Failed to delete student");
    }

    setIsDeleteDialogOpen(false);
    setSelectedStudent(null);
  };

  // UPDATE STUDENT (BACKEND)
  const handleUpdate = async () => {
    if (!selectedStudent) return;

    try {
      const payload = {
        name: editFormData.name,
        email: editFormData.email,
        phone_number: editFormData.phone_number,
        semester: selectedStudent.semester,
        year: 1,
        school_id: 1,
        department_id: 1
      };

      await adminAPI.updateStudent(selectedStudent.rollNo, payload);

      setStudents(
        students.map((s) =>
          s.rollNo === selectedStudent.rollNo ? { ...s, ...editFormData } : s
        )
      );

      toast.success("Student updated");
    } catch {
      toast.error("Failed to update student");
    }

    setIsEditDialogOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Manage Students</h1>
        <p className="text-muted-foreground">Update or delete existing student records</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCog className="h-5 w-5" />
            <span>Student Management</span>
          </CardTitle>
          <CardDescription>Search and manage student profiles</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.rollNo}>
                      <TableCell className="font-medium">{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(student)}
                          >
                            <Edit className="h-3 w-3 mr-1" /> Update
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(student)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Student</DialogTitle>
            <DialogDescription>Edit student details below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editFormData.name || ''}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={editFormData.email || ''}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                value={editFormData.phone_number || ''}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone_number: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Delete student <strong>{selectedStudent?.name}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
