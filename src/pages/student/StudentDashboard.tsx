import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Hash, Camera, CheckCircle, Loader2, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { studentAPI } from '@/services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [classCode, setClassCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [attendanceData, setAttendanceData] = useState({
    subject: '',
    subjectCode: '',
    time: '',
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // -----------------------------------------------------
  // STEP 1: VERIFY CLASS CODE WITH REAL BACKEND API
  // -----------------------------------------------------
  const handleProceed = async () => {
    if (classCode.length !== 6) {
      toast.error("Enter a valid 6-digit class code");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await studentAPI.verifyClassCode(classCode);

      setAttendanceData({
        subject: res.subject,
        subjectCode: res.subject_code,
        time: new Date().toLocaleString(),
      });

      setShowCamera(true);
      await startCamera();

    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Invalid or expired class code");

    } finally {
      setIsProcessing(false);
    }
  };

  // -----------------------------------------------------
  // CAMERA START & FACE DETECTION SIMULATION
  // -----------------------------------------------------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      setTimeout(() => {
        setIsDetecting(true);
        simulateFaceDetection();
      }, 1000);

    } catch (err) {
      console.error(err);
      toast.error("Cannot access camera. Check permissions.");
      setShowCamera(false);
    }
  };

  const simulateFaceDetection = () => {
    setTimeout(() => {
      stopCamera();
      setShowCamera(false);
      setIsDetecting(false);
      setShowConfirmation(true);
    }, 2000);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // -----------------------------------------------------
  // STEP 3: CONFIRM ATTENDANCE (REAL BACKEND API)
  // -----------------------------------------------------
  const confirmAttendance = async () => {
    try {
      await studentAPI.markAttendance(classCode, user?.rollNo || "");

      toast.success(
        <div>
          <p className="font-semibold">Attendance marked successfully!</p>
          <p className="text-sm">{attendanceData.subject} ({attendanceData.subjectCode})</p>
        </div>
      );

      // Reset UI
      setShowConfirmation(false);
      setClassCode('');
      setAttendanceData({ subject: '', subjectCode: '', time: '' });

    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Error marking attendance");
    }
  };

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
            <UserCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Mark Your Attendance</CardTitle>
          <CardDescription>Enter the code your teacher gave you</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Code Input */}
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Enter 6-digit code"
                value={classCode}
                maxLength={6}
                onChange={(e) => setClassCode(e.target.value.replace(/\D/g, ""))}
                className="pl-10 text-center text-lg font-semibold tracking-widest"
              />
            </div>

            {/* Proceed Button */}
            <Button
              onClick={handleProceed}
              disabled={isProcessing || classCode.length !== 6}
              className="w-full bg-gradient-to-r from-primary to-accent"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Proceed"
              )}
            </Button>

            {/* User Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Welcome, <span className="font-semibold">{user?.name}</span></p>
              <p>Roll No: {user?.rollNo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CAMERA POPUP */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" /> Face Detection
            </DialogTitle>
            <DialogDescription>
              Hold steady while we detect your face.
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-video bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {isDetecting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION POPUP */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Confirm Attendance
            </DialogTitle>
            <DialogDescription>Please verify your details.</DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="font-semibold">{user?.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Roll No</span>
              <span className="font-semibold">{user?.rollNo}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Subject</span>
              <span className="font-semibold">
                {attendanceData.subject} ({attendanceData.subjectCode})
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Time</span>
              <span className="font-semibold">{attendanceData.time}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-primary to-accent" onClick={confirmAttendance}>
              Confirm & Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
