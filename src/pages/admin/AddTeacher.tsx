import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { adminAPI } from '@/services/api';

export default function AddTeacher() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    school_id: '',
    department: '',
    subject_specialization: '',
  });

  const schools = [
    { id: 1, name: 'School of Engineering' },
    { id: 2, name: 'School of Management' },
    { id: 3, name: 'School of Law' },
    { id: 4, name: 'School of Science' },
    { id: 5, name: 'School of Humanities' },
    { id: 6, name: 'USICT' },
    { id: 7, name: 'School of Biotechnology' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('📤 Adding new teacher:', formData);
      
      const response = await adminAPI.addTeacher(formData);
      
      console.log('✅ Teacher added successfully:', response);
      toast.success('Teacher added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        school_id: '',
        department: '',
        subject_specialization: '',
      });
      
      // Navigate to view teachers page
      setTimeout(() => {
        navigate('/admin/view-teachers');
      }, 1500);
      
    } catch (error: any) {
      console.error('❌ Error adding teacher:', error);
      
      if (error.response?.status === 400) {
        toast.error(error.response.data.detail || 'Email already registered');
      } else if (error.response?.status === 404) {
        toast.error('School not found');
      } else {
        toast.error('Failed to add teacher. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Add New Teacher</h1>
        <p className="text-muted-foreground">Register a new teacher in the system</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <CardTitle>Teacher Information</CardTitle>
          </div>
          <CardDescription>Fill in the details to add a new teacher</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Dr. Rajesh Kumar"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="rajesh.kumar@gbu.ac.in"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  placeholder="9876543210"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school_id">School/Department *</Label>
                <Select
                  value={formData.school_id}
                  onValueChange={(value) => setFormData({ ...formData, school_id: value })}
                  disabled={isLoading}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id.toString()}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="Computer Science"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="subject_specialization">Subject Specialization</Label>
                <Input
                  id="subject_specialization"
                  name="subject_specialization"
                  placeholder="Data Structures, Algorithms, Machine Learning"
                  value={formData.subject_specialization}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Adding Teacher...
                  </>
                ) : (
                  'Add Teacher'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
