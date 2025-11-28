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

  // -------------------------------
  // 1️⃣ Validate Code → Start Camera
  // -------------------------------
  const handleProceed = async () => {
    if (!classCode || classCode.length !== 6) {
      toast.error('Please enter a valid 6-digit class code');
      return;
    }

    try {
      setIsProcessing(true);

      // Validate classCode with backend
      const result = await studentAPI.verifyClassCode(classCode);

      // Attach details for confirmation popup
      setAttendanceData({
        subject: result.subject,
        subjectCode: result.subject_code,
        time: new Date().toLocaleString(),
      });

      // Open camera dialog
      setShowCamera(true);
      await startCamera();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.detail || 'Invalid or expired class code');
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------
  // 2️⃣ Start Camera
  // -------------------------------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      // Fake face detection after 1 second
      setTimeout(() => {
        setIsDetecting(true);
        simulateFaceDetection();
      }, 1000);
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Cannot access camera. Please allow permissions.');
      setShowCamera(false);
    }
  };

  // -------------------------------
  // 3️⃣ Simulate Face Detection
  // -------------------------------
  const simulateFaceDetection = () => {
    setTimeout(() => {
      stopCamera();
      setIsDetecting(false);
      setShowCamera(false);
      setShowConfirmation(true);
    }, 2000);
  };

  // -------------------------------
  // Stop Camera
  // -------------------------------
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // -------------------------------
  // 4️⃣ Confirm → Mark Attendance (REAL BACKEND CALL)
  // -------------------------------
  const confirmAttendance = async () => {
    try {
      setShowConfirmation(false);
      setIsProcessing(true);

      const payload = {
        unique_code: classCode,
        roll_no: user?.roll_no || "",

        is_manual: false,
      };

      await studentAPI.markAttendance(payload);

      toast.success('Attendance marked successfully!');

      // reset UI
      setClassCode('');
      setAttendanceData({ subject: '', subjectCode: '', time: '' });
    } catch (err: any) {
      console.error('Attendance error:', err);
      toast.error(err?.response?.data?.detail || 'Failed to mark attendance');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
            <UserCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Mark Your Attendance</CardTitle>
          <CardDescription>Enter the class code provided by your teacher</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Class Code Input */}
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter 6-digit class code"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.slice(0, 6))}
                className="pl-10 text-center text-lg font-semibold tracking-wider"
                maxLength={6}
              />
            </div>

            {/* Proceed Button */}
            <Button
              onClick={handleProceed}
              disabled={isProcessing || classCode.length !== 6}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                'Proceed'
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Welcome,{' '}
                <span className="font-semibold text-foreground">{user?.name}</span>
              </p>
              <p>Roll No: {user?.roll_no}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera Dialog */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Face Detection</span>
            </DialogTitle>
            <DialogDescription>
              Position your face clearly in the camera frame.
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {isDetecting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold">Detecting face...</p>
                  <p className="text-sm opacity-80">Please hold still</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Confirm Attendance</span>
            </DialogTitle>
            <DialogDescription>Confirm your attendance details below.</DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2 my-4">
            <div className="flex justify-between"><span>Name:</span><span>{user?.name}</span></div>
            <div className="flex justify-between"><span>Roll No:</span><span>{user?.roll_no}</span></div>
            <div className="flex justify-between"><span>Subject:</span><span>{attendanceData.subject} ({attendanceData.subjectCode})</span></div>
            <div className="flex justify-between"><span>Time:</span><span>{attendanceData.time}</span></div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
              Cancel
            </Button>

            <Button onClick={confirmAttendance} className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Confirm & Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
