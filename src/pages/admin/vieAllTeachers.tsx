import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, ArrowLeft, Mail, Phone, GraduationCap, School } from 'lucide-react';
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

export default function ViewTeachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const schoolNames: { [key: number]: string } = {
    1: 'School of Engineering',
    2: 'School of Management',
    3: 'School of Law',
    4: 'School of Science',
    5: 'School of Humanities',
    6: 'USICT',
    7: 'School of Biotechnology',
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [searchTerm, teachers]);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
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
        teacher.phone_number.includes(searchTerm) ||
        teacher.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeachers(filtered);
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
        <h1 className="text-3xl font-bold text-foreground mb-2">View All Teachers</h1>
        <p className="text-muted-foreground">Complete list of registered teachers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Directory</CardTitle>
          <CardDescription>Total: {filteredTeachers.length} teachers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, or department..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeachers.map((teacher) => (
                <Card key={teacher.teacher_id} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-lg">{teacher.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        ID: {teacher.teacher_id}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{teacher.phone_number}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <School className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs">{schoolNames[teacher.school_id]}</span>
                      </div>
                      
                      {teacher.department && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <GraduationCap className="h-4 w-4 flex-shrink-0" />
                          <span>{teacher.department}</span>
                        </div>
                      )}
                      
                      {teacher.subject_specialisation && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            <strong>Specialization:</strong>
                          </p>
                          <p className="text-xs mt-1">{teacher.subject_specialisation}</p>
                        </div>
                      )}
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
