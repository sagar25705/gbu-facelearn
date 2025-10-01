import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Hash, Camera, CheckCircle, Loader2, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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

  const handleProceed = async () => {
    if (!classCode || classCode.length !== 6) {
      toast.error('Please enter a valid 6-digit class code');
      return;
    }

    setIsProcessing(true);
    
    // Simulate code validation
    setTimeout(async () => {
      setIsProcessing(false);
      
      // Mock validation - in real app, this would check against active codes
      if (classCode === '123456' || classCode.length === 6) {
        setShowCamera(true);
        await startCamera();
      } else {
        toast.error('Invalid or expired class code');
      }
    }, 500);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      // Start face detection after camera starts
      setTimeout(() => {
        setIsDetecting(true);
        simulateFaceDetection();
      }, 1000);
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error('Unable to access camera. Please check permissions.');
      setShowCamera(false);
    }
  };

  const simulateFaceDetection = () => {
    // Simulate face detection process
    setTimeout(() => {
      stopCamera();
      setIsDetecting(false);
      setShowCamera(false);
      
      // Set mock attendance data
      setAttendanceData({
        subject: 'Data Structures',
        subjectCode: 'CS201',
        time: new Date().toLocaleString(),
      });
      
      setShowConfirmation(true);
    }, 2000);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const confirmAttendance = () => {
    toast.success(
      <div>
        <p className="font-semibold">Attendance marked successfully!</p>
        <p className="text-sm">Subject: {attendanceData.subject}</p>
      </div>
    );
    
    // Reset all states
    setShowConfirmation(false);
    setClassCode('');
    setAttendanceData({ subject: '', subjectCode: '', time: '' });
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
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
              <p>Welcome, <span className="font-semibold text-foreground">{user?.name}</span></p>
              <p>Roll No: {user?.rollNo || '2024CS001'}</p>
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
              Please position your face clearly in the camera frame
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
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
            <DialogDescription>
              Face detected successfully! Please confirm your attendance details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="font-semibold">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Roll No:</span>
                <span className="font-semibold">{user?.rollNo || '2024CS001'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subject:</span>
                <span className="font-semibold">{attendanceData.subject} ({attendanceData.subjectCode})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Time:</span>
                <span className="font-semibold">{attendanceData.time}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAttendance}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Confirm & Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}