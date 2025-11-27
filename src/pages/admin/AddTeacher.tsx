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
    school_id: 0,
    department: '',
    subject_specialisation: '',
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
      // FIXED PAYLOAD
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone_number: formData.phone_number,
        school_id: Number(formData.school_id),
        department: formData.department.trim() || null,
        subject_specialisation: formData.subject_specialisation.trim() || null,
      };

      console.log("📤 Final Payload Sent:", payload);

      const response = await adminAPI.addTeacher(payload);

      toast.success("Teacher added successfully!");

      // RESET FORM — FIXED
      setFormData({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        school_id: 0,
        department: '',
        subject_specialisation: '',
      });

      setTimeout(() => {
        navigate('/admin/view-teachers');
      }, 1200);

    } catch (error: any) {
      console.error("❌ Error adding teacher:", error);

      if (error.response?.status === 400) {
        toast.error(error.response.data.detail || "Email already registered");
      } else if (error.response?.status === 404) {
        toast.error("School not found");
      } else {
        toast.error("Failed to add teacher. Please try again.");
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
                <Label>Full Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  name="phone_number"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>School *</Label>
                <Select
                  value={String(formData.school_id)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, school_id: Number(value) })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Subject Specialization</Label>
                <Input
                  name="subject_specialisation"
                  value={formData.subject_specialisation}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Teacher"}
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
