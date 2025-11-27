import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Edit, Trash2, ArrowLeft, Mail, Phone, GraduationCap } from 'lucide-react';
import { adminAPI } from '@/services/api';

interface Teacher {
  teacher_id: number;
  user_id: number;
  name: string;
  email: string;
  phone_number: string;
  school_id: number;
  department?: string;
  subject_specialisation?: string;
}

export default function ManageTeachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [searchTerm, teachers]);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      // This is a placeholder - replace with actual API call when backend endpoint is ready
      const response = await adminAPI.getTeachers();
      setTeachers(response);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
      // Mock data for demo
      setTeachers([
        {
          teacher_id: 1,
          user_id: 101,
          name: 'Dr. Rajesh Kumar',
          email: 'rajesh.kumar@gbu.ac.in',
          phone_number: '9876543210',
          school_id: 1,
          department: 'Computer Science',
          subject_specialisation: 'Data Structures, Algorithms',
        },
        {
          teacher_id: 2,
          user_id: 102,
          name: 'Prof. Priya Sharma',
          email: 'priya.sharma@gbu.ac.in',
          phone_number: '9876543211',
          school_id: 2,
          department: 'Management',
          subject_specialisation: 'Marketing, Strategy',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTeachers = () => {
    if (!searchTerm) {
      setFilteredTeachers(teachers);
      return;
    }

    const filtered = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.phone_number.includes(searchTerm)
    );
    setFilteredTeachers(filtered);
  };

  const handleDelete = async (teacherId: number, teacherName: string) => {
    if (!confirm(`Are you sure you want to delete ${teacherName}?`)) {
      return;
    }

    try {
      await adminAPI.deleteTeacher(teacherId);
      toast.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
    }
  };

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/admin')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Manage Teachers</h1>
        <p className="text-muted-foreground">Edit or remove teacher records</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Teacher List</CardTitle>
              <CardDescription>Total: {filteredTeachers.length} teachers</CardDescription>
            </div>
            <Button onClick={() => navigate('/admin/add-teacher')}>
              <GraduationCap className="h-4 w-4 mr-2" />
              Add New Teacher
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading teachers...</p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No teachers found matching your search' : 'No teachers registered yet'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTeachers.map((teacher) => (
                <Card key={teacher.teacher_id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{teacher.name}</h3>
                          <Badge variant="secondary">ID: {teacher.teacher_id}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {teacher.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {teacher.phone_number}
                          </div>
                          {teacher.department && (
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              {teacher.department}
                            </div>
                          )}
                          {teacher.subject_specialisation && (
                            <div className="col-span-2 text-xs">
                              <strong>Specialization:</strong> {teacher.subject_specialisation}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/edit-teacher/${teacher.teacher_id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(teacher.teacher_id, teacher.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
