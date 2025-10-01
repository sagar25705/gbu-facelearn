import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Upload } from 'lucide-react';
import { toast } from 'sonner';

const schoolCourseMap: Record<string, string[]> = {
  'School of Engineering': ['B.Tech', 'M.Tech', 'PhD'],
  'School of Management': ['BBA', 'MBA', 'PhD'],
  'School of Law': ['BA LLB', 'LLM', 'PhD'],
  'School of Science': ['B.Sc', 'M.Sc', 'PhD'],
  'School of Humanities': ['BA', 'MA', 'PhD'],
  'School of Medicine': ['MBBS', 'MD', 'MS'],
  'School of Education': ['B.Ed', 'M.Ed', 'PhD'],
};

const courseDepartmentMap: Record<string, string[]> = {
  'B.Tech': ['Computer Science', 'Information Technology', 'Machine Learning', 'Electronics', 'Mechanical', 'Civil'],
  'M.Tech': ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical'],
  'BBA': ['Finance', 'Marketing', 'Human Resources', 'Operations'],
  'MBA': ['Finance', 'Marketing', 'Human Resources', 'Operations', 'International Business'],
  'BA LLB': ['Corporate Law', 'Criminal Law', 'Constitutional Law'],
  'LLM': ['Corporate Law', 'Criminal Law', 'International Law'],
  'B.Sc': ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
  'M.Sc': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Environmental Science'],
  'BA': ['English', 'History', 'Political Science', 'Psychology'],
  'MA': ['English', 'History', 'Political Science', 'Psychology', 'Sociology'],
  'MBBS': ['General Medicine'],
  'MD': ['Internal Medicine', 'Pediatrics', 'Radiology'],
  'MS': ['General Surgery', 'Orthopedics', 'ENT'],
  'B.Ed': ['Elementary Education', 'Secondary Education'],
  'M.Ed': ['Educational Leadership', 'Curriculum Development'],
  'PhD': ['Research'],
};

export default function AddStudent() {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    phone: '',
    email: '',
    fatherName: '',
    school: '',
    course: '',
    department: '',
  });
  
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSchoolChange = (value: string) => {
    setFormData({
      ...formData,
      school: value,
      course: '',
      department: '',
    });
    setAvailableCourses(schoolCourseMap[value] || []);
    setAvailableDepartments([]);
  };

  const handleCourseChange = (value: string) => {
    setFormData({
      ...formData,
      course: value,
      department: '',
    });
    setAvailableDepartments(courseDepartmentMap[value] || []);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 9) {
        toast.error('Maximum 9 photos allowed');
        return;
      }
      setSelectedPhotos(files);
      toast.success(`${files.length} photos selected`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (Object.values(formData).some(value => !value)) {
      toast.error('Please fill all required fields');
      return;
    }

    if (selectedPhotos.length < 8) {
      toast.error('Please upload at least 8 photos for face recognition');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success(
        <div>
          <p className="font-semibold">Student profile created successfully!</p>
          <p className="text-sm">User ID and Password have been sent to the student's email.</p>
        </div>
      );
      
      // Reset form
      setFormData({
        fullName: '',
        rollNo: '',
        phone: '',
        email: '',
        fatherName: '',
        school: '',
        course: '',
        department: '',
      });
      setSelectedPhotos([]);
      setAvailableCourses([]);
      setAvailableDepartments([]);
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Add New Student</h1>
        <p className="text-muted-foreground">Create a new student profile with face recognition data</p>
      </div>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Student Registration Form</span>
          </CardTitle>
          <CardDescription>Fill in all the details to create a student profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter student's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number *</Label>
                <Input
                  id="rollNo"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  placeholder="e.g., 2024CS001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXXXXXXX"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="student@gbu.ac.in"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder="Enter father's name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School *</Label>
                <Select value={formData.school} onValueChange={handleSchoolChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(schoolCourseMap).map((school) => (
                      <SelectItem key={school} value={school}>
                        {school}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select 
                  value={formData.course} 
                  onValueChange={handleCourseChange}
                  disabled={!formData.school}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                  disabled={!formData.course}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photos">Student Photos (8-9 photos required) *</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('photos')?.click()}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Choose Files</span>
                </Button>
                {selectedPhotos.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {selectedPhotos.length} photos selected
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload multiple clear photos of the student for accurate face recognition
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Create Student Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}