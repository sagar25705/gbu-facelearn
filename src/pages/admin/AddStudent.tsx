// AddStudent.tsx (corrected)
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Upload } from "lucide-react";
import { toast } from "sonner";
import apiClient, { faceRecognitionAPI } from "@/services/api"; // faceRecognitionAPI must be exported

const schoolCourseMap: Record<string, string[]> = {
  "School of Engineering": ["B.Tech", "M.Tech", "PhD"],
  "School of Management": ["BBA", "MBA", "PhD"],
  "School of Law": ["BA LLB", "LLM", "PhD"],
  "School of Science": ["B.Sc", "M.Sc", "PhD"],
  "School of Humanities": ["BA", "MA", "PhD"],
  "School of Medicine": ["MBBS", "MD", "MS"],
  "School of Education": ["B.Ed", "M.Ed", "PhD"],
};

const courseDepartmentMap: Record<string, string[]> = {
  "B.Tech": [
    "Computer Science",
    "Information Technology",
    "Machine Learning",
    "Electronics",
    "Mechanical",
    "Civil",
  ],
  "M.Tech": ["Computer Science", "Information Technology", "Electronics"],
  BBA: ["Finance", "Marketing", "Human Resources", "Operations"],
  MBA: [
    "Finance",
    "Marketing",
    "Human Resources",
    "Operations",
    "International Business",
  ],
  "BA LLB": ["Corporate Law", "Criminal Law", "Constitutional Law"],
  LLM: ["Corporate Law", "Criminal Law", "International Law"],
  "B.Sc": ["Physics", "Chemistry", "Mathematics", "Biology"],
  "M.Sc": [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Environmental Science",
  ],
  BA: ["English", "History", "Political Science", "Psychology"],
  MA: ["English", "History", "Political Science", "Psychology", "Sociology"],
  MBBS: ["General Medicine"],
  MD: ["Internal Medicine", "Pediatrics", "Radiology"],
  MS: ["General Surgery", "Orthopedics", "ENT"],
  "B.Ed": ["Elementary Education", "Secondary Education"],
  "M.Ed": ["Educational Leadership", "Curriculum Development"],
  PhD: ["Research"],
};

export default function AddStudent() {
  const [formData, setFormData] = useState({
    fullName: "",
    rollNo: "",
    phone: "",
    email: "",
    fatherName: "",
    school: "",
    course: "",
    department: "",
  });

  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSchoolChange = (value: string) => {
    setFormData({ ...formData, school: value, course: "", department: "" });
    setAvailableCourses(schoolCourseMap[value] || []);
    setAvailableDepartments([]);
  };

  const handleCourseChange = (value: string) => {
    setFormData({ ...formData, course: value, department: "" });
    setAvailableDepartments(courseDepartmentMap[value] || []);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 9) return toast.error("Maximum 9 photos allowed");
      setSelectedPhotos(files);
      toast.success(`${files.length} photos selected`);
    }
  };

  const showError = (err: any, fallback = "Error creating student") => {
    const detail = err?.response?.data?.detail ?? err?.message ?? err;
    if (Array.isArray(detail) && detail.length > 0) {
      // Pydantic validation error
      toast.error(typeof detail[0].msg === "string" ? detail[0].msg : JSON.stringify(detail[0]));
      return;
    }
    if (typeof detail === "string") {
      toast.error(detail);
      return;
    }
    // fallback
    toast.error(fallback);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (Object.values(formData).some((v) => !v)) {
      toast.error("Fill all fields");
      return;
    }

    if (selectedPhotos.length < 8) {
      toast.error("Upload at least 8 photos");
      return;
    }

    setLoading(true);

    try {
      // STEP 1 — Create Student in DB
      const payload = {
        roll_no: formData.rollNo,
        name: formData.fullName,
        phone_number: formData.phone,
        email: formData.email,
        semester: 1,
        year: new Date().getFullYear(),
        school_id: 1,
        department_id: 1,
      };

      const studentRes = await apiClient.post("/add-student", payload);
      // ensure expected shape
      const realPassword = studentRes?.data?.temporary_password;
      console.log("Add-student response:", studentRes?.data);

      if (!realPassword) {
        // Defensive: if backend didn't return temp password, abort email step
        toast.error("Student created but temporary password missing from server response.");
        // still proceed to enroll face images (student exists) — but do not attempt to email
      }

      // STEP 2 — Upload Photos for Face Recognition (use exported helper)
      try {
        // faceRecognitionAPI.enrollStudent expects (rollNo, files[])
        await faceRecognitionAPI.enrollStudent(formData.rollNo, selectedPhotos);
      } catch (faceErr) {
        // Face enrollment failed — we should surface and continue (student already created)
        console.error("Face enrollment error:", faceErr);
        showError(faceErr, "Face enrollment failed — student created but photos not uploaded");
        // decide: do not throw; continue to email if we have password
      }

      // STEP 3 — Send Email to Student (only if we have password)
      if (realPassword) {
        try {
          console.log("Email payload:", {
            email: formData.email,
            roll_no: formData.rollNo,
            password: realPassword,
          });

          await apiClient.post("/send-student-credentials", {
            email: formData.email,
            roll_no: formData.rollNo,
            password: realPassword,
          });
        } catch (emailErr) {
          console.error("Email send error:", emailErr);
          showError(emailErr, "Student created but failed to send email");
          // keep going — student exists and face enrollment may have succeeded
        }
      }

      toast.success("Student created (check logs for email/enrollment status)");

      // Reset form
      setFormData({
        fullName: "",
        rollNo: "",
        phone: "",
        email: "",
        fatherName: "",
        school: "",
        course: "",
        department: "",
      });

      setSelectedPhotos([]);
      setAvailableCourses([]);
      setAvailableDepartments([]);
    } catch (err: any) {
      console.error("Add student error:", err);
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Student</h1>
        <p className="text-muted-foreground">
          Create a student profile with face recognition data
        </p>
      </div>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Student Registration Form
          </CardTitle>
          <CardDescription>Fill all details properly</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />

              <InputField
                label="Roll Number"
                value={formData.rollNo}
                name="rollNo"
                onChange={handleInputChange}
              />

              <InputField
                label="Phone Number"
                value={formData.phone}
                name="phone"
                onChange={handleInputChange}
              />

              <InputField
                label="Email"
                value={formData.email}
                name="email"
                type="email"
                onChange={handleInputChange}
              />

              <InputField
                label="Father's Name"
                value={formData.fatherName}
                name="fatherName"
                onChange={handleInputChange}
              />

              {/* SCHOOL */}
              <SelectField
                label="School"
                value={formData.school}
                options={Object.keys(schoolCourseMap)}
                onChange={handleSchoolChange}
              />

              {/* COURSE */}
              <SelectField
                label="Course"
                value={formData.course}
                options={availableCourses}
                onChange={handleCourseChange}
                disabled={!formData.school}
              />

              {/* DEPARTMENT */}
              <SelectField
                label="Department"
                value={formData.department}
                options={availableDepartments}
                onChange={(v) => setFormData({ ...formData, department: v })}
                disabled={!formData.course}
              />
            </div>

            {/* PHOTOS */}
            <div className="space-y-2">
              <Label>Student Photos (8-9 required)</Label>

              <div className="flex items-center gap-4">
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("photos")?.click()}
                >
                  <Upload className="h-4 w-4" /> Choose Files
                </Button>

                {selectedPhotos.length > 0 && (
                  <span className="text-sm">{selectedPhotos.length} selected</span>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Create Student Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* REUSABLE INPUT FIELD  */
function InputField({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input name={name} value={value} type={type} onChange={onChange} required />
    </div>
  );
}

/* REUSABLE SELECT FIELD */
function SelectField({ label, value, options, onChange, disabled = false }: any) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt: string) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
