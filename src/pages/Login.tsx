import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Lock, Mail, Facebook, Twitter, Youtube, Instagram, Phone, MapPin, ChevronLeft, ChevronRight, GraduationCap, BookOpen, Users, Calendar, Menu, X, Eye, EyeOff } from 'lucide-react'; // ✅ Added Eye, EyeOff
import { toast } from 'sonner';
import React from 'react';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ✅ NEW: Password visibility state
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { login } = useAuth();

  // College images for slider
  const sliderImages = [
    '/college-bg.jpg',
    '/college-image-2.jpg', 
    '/college-image-3.jpg',
    '/college-image-4.jpg'
  ];

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const success = login(userId, password);
      if (!success) {
        setUserId('');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen">
     
      {/* Main Navbar - Purple/Blue Gradient */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-blue-700 shadow-lg border-b fixed top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-2 sm:px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo and Titles */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src="/gbu-logo.png" 
                alt="GBU Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <div>
                <h1 className="text-xs sm:text-base font-bold text-white">गौतम बुद्ध विश्वविद्यालय</h1>
                <h2 className="text-[10px] sm:text-sm font-bold text-white">GAUTAM BUDDHA UNIVERSITY</h2>
                <p className="text-[8px] sm:text-xs text-blue-200 hidden sm:block">Face Detection Attendance System</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex space-x-8 text-white text-sm items-center">
              <a href="/" className="hover:text-blue-300 font-bold">Home</a>
              
              {/* About Dropdown */}
              <div className="relative group">
                <button className="hover:text-blue-300 font-bold focus:outline-none">
                  About
                </button>
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-50">
                  <ul className="py-4 px-3 space-y-2 text-sm">
                    <li><a href="https://www.gbu.ac.in/about/home" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">Home</a></li>
                    <li><a href="https://www.gbu.ac.in/about/vision" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">Vision &amp; Mission</a></li>
                    <li><a href="https://www.gbu.ac.in/Content/gbudata/about/Profile_ShYogiAdityanath_latest.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">Chancellor's Profile</a></li>
                    <li><a href="https://www.gbu.ac.in/GBU_VC/index.html" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">Vice Chancellor's Message</a></li>
                    <li><a href="https://www.gbu.ac.in/about/bodies" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">Governing Bodies</a></li>
                    <li><a href="https://www.gbu.ac.in/about/regulatorybodies" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">Regulatory Bodies</a></li>
                  </ul>
                </div>
              </div>
              
              {/* Academics Dropdown */}
              <div className="relative group">
                <button className="hover:text-blue-300 font-bold focus:outline-none">
                  Academics
                </button>
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[650px] bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto z-50">
                  <div className="grid grid-cols-2 gap-8 p-6">
                    <div>
                      <h3 className="text-xs font-bold text-purple-700 mb-2 uppercase">Faculty & Academic Links</h3>
                      <ul className="space-y-2 text-sm">
                        <li><a href="https://faculty.gbu.ac.in/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">Faculty</a></li>
                        <li><a href="https://www.gbu.ac.in/academics/academic-programmes" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">Academic Programmes (CBCS)</a></li>
                        <li><a href="https://nss.gbu.ac.in/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">National Service Scheme (NSS)</a></li>
                        <li><a href="https://www.gbu.ac.in/academics/DASA" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">Direct Admission of Students Abroad (DASA)</a></li>
                        <li><a href="https://www.gbu.ac.in/public/incubation-about" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">GBU Incubation Centre</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-purple-700 mb-2 uppercase">University Schools</h3>
                      <ul className="space-y-2 text-sm">
                        <li><a href="https://www.gbu.ac.in/school/sob" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">School of Biotechnology</a></li>
                        <li><a href="https://www.gbu.ac.in/school/sobs" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">School of Buddhist Studies and Civilization</a></li>
                        <li><a href="https://www.gbu.ac.in/school/soe" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">School of Engineering</a></li>
                        <li><a href="https://www.gbu.ac.in/school/soh" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">School of Humanities and Social Sciences</a></li>
                        <li><a href="https://www.gbu.ac.in/USICT/index.html" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">University School of Information and Communication Technology (USICT)</a></li>
                        <li><a href="https://www.gbu.ac.in/school/soljg" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">School of Law Justice and Governance</a></li>
                        <li><a href="https://www.gbu.ac.in/school/som" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">School of Management</a></li>
                        <li><a href="https://www.gbu.ac.in/school/sovs" target="_blank" rel="noopener noreferrer" className="hover:text-purple-700">School of Vocational Studies and Applied Sciences</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <a href="https://pravesh.gbu.ac.in/" className="hover:text-blue-300 font-bold">Admissions</a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-3">
              <a href="/" className="block text-white hover:text-blue-300 font-bold py-2">Home</a>
              
              <div className="space-y-2">
                <p className="text-white font-bold">About</p>
                <div className="pl-4 space-y-2 text-sm">
                  <a href="https://www.gbu.ac.in/about/home" target="_blank" rel="noopener noreferrer" className="block text-blue-200 hover:text-white">Home</a>
                  <a href="https://www.gbu.ac.in/about/vision" target="_blank" rel="noopener noreferrer" className="block text-blue-200 hover:text-white">Vision & Mission</a>
                  <a href="https://www.gbu.ac.in/Content/gbudata/about/Profile_ShYogiAdityanath_latest.pdf" target="_blank" rel="noopener noreferrer" className="block text-blue-200 hover:text-white">Chancellor's Profile</a>
                  <a href="https://www.gbu.ac.in/GBU_VC/index.html" target="_blank" rel="noopener noreferrer" className="block text-blue-200 hover:text-white">Vice Chancellor's Message</a>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-white font-bold">Academics</p>
                <div className="pl-4 space-y-2 text-sm">
                  <a href="https://faculty.gbu.ac.in/" target="_blank" rel="noopener noreferrer" className="block text-blue-200 hover:text-white">Faculty</a>
                  <a href="https://www.gbu.ac.in/academics/academic-programmes" target="_blank" rel="noopener noreferrer" className="block text-blue-200 hover:text-white">Academic Programmes</a>
                  <a href="https://www.gbu.ac.in/school/soe" target="_blank" rel="noopener noreferrer" className="block text-blue-200 hover:text-white">School of Engineering</a>
                  <a href="https://www.gbu.ac.in/USICT/index.html" target="_blank" rel="noopener noreferrer" className="block text-blue-200 hover:text-white">USICT</a>
                </div>
              </div>

              <a href="https://pravesh.gbu.ac.in/" className="block text-white hover:text-blue-300 font-bold py-2">Admissions</a>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Image Slider Section */}
      <div className="relative overflow-hidden" style={{ height: '100vh', paddingTop: '64px' }}>
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              top: '64px',
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
        
        <div className="absolute inset-0 flex items-center justify-center text-white z-10 px-4" style={{ top: '64px' }}>
          <div className="text-center max-w-4xl">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Globally Acclaimed University in Delhi-NCR</h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-4">Established by the Uttar Pradesh Gautam Buddha University Act 2002 UP Act No. 9 of 2002</p>
            <p className="text-xs sm:text-base md:text-lg lg:text-xl">Approved by UGC under Section 12-B & NAAC accredited</p>
            <div className="mt-4 sm:mt-8">
              <Button
                className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 sm:px-8 sm:py-3 text-sm sm:text-lg rounded-lg"
                onClick={() => window.open("https://youtu.be/aV-XncxVM-Q?si=Ec0i6j9emHcmjnIs", "_blank")}
              >
                Explore Our Campus
              </Button>
            </div>
          </div>
        </div>

        <button onClick={prevSlide} className="absolute left-2 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 z-20 transition-all">
          <ChevronLeft className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
        </button>
        <button onClick={nextSlide} className="absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 z-20 transition-all">
          <ChevronRight className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-center z-20 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm mb-2">Scroll for Login</span>
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 sm:h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="min-h-screen flex items-center relative overflow-hidden py-8 sm:py-0" style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 25%, #ec4899 50%, #f59e0b 75%, #10b981 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite'
      }}>
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(5deg); }
            66% { transform: translateY(-10px) rotate(-5deg); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
        `}</style>

        <div className="absolute inset-0 hidden md:block">
          <div className="absolute top-20 left-16 text-white/20" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <GraduationCap size={60} />
          </div>
          <div className="absolute top-40 right-20 text-white/15" style={{ animation: 'float 8s ease-in-out infinite 1s' }}>
            <BookOpen size={80} />
          </div>
          <div className="absolute bottom-32 left-1/4 text-white/20" style={{ animation: 'float 7s ease-in-out infinite 2s' }}>
            <Users size={70} />
          </div>
          <div className="absolute bottom-40 right-1/3 text-white/15" style={{ animation: 'float 9s ease-in-out infinite 3s' }}>
            <Calendar size={50} />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-full mb-3 sm:mb-4 shadow-2xl p-2 border border-white/30">
                <img src="/gbu-logo.png" alt="GBU Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">Attendance Portal</h2>
              <p className="text-sm sm:text-base md:text-lg text-white/90 drop-shadow-md">Face Detection System</p>
            </div>

            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
              <CardHeader className="pb-3 sm:pb-4 text-center px-4 sm:px-6">
                <CardTitle className="text-xl sm:text-2xl text-gray-900">Sign In</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600">Enter your credentials to access the portal</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-gray-700 font-medium text-xs sm:text-sm">User ID</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="userId"
                        type="text"
                        placeholder="Enter your User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="pl-10 h-10 sm:h-11 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 text-sm sm:text-base rounded-lg transition-all"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* ✅ UPDATED: Password field with Eye icon */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium text-xs sm:text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"} // ✅ Toggle type
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-10 sm:h-11 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 text-sm sm:text-base rounded-lg transition-all"
                        required
                        disabled={isLoading}
                      />
                      {/* ✅ NEW: Eye toggle button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 sm:top-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                        disabled={isLoading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-11 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold text-sm sm:text-base rounded-lg transition-all transform hover:scale-105 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border">
                  <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 font-medium">Demo Credentials:</p>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold text-purple-800">Admin:</span> 
                      <span className="text-gray-700 text-xs sm:text-sm">ADMIN001 / admin123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-purple-800">Teacher:</span> 
                      <span className="text-gray-700 text-xs sm:text-sm">TEACH001 / teacher123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-purple-800">Student:</span> 
                      <span className="text-gray-700 text-xs sm:text-sm">STU2024001 / student123</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src="/gbu-logo.png" alt="GBU Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Gautam Buddha University</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Face Detection System</p>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
                  <div>
                    <p>Yamuna Expressway</p>
                    <p>Greater NOIDA, Gautam Budh Nagar</p>
                    <p>Uttar Pradesh-201312 (INDIA)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span>Phone No: 0120-2344200</span>
                </div>
                <p className="text-xs">(During office hours 9:30 am-5:30 pm)</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900">Portal Features</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition-colors">Face Recognition</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Attendance Tracking</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Student Dashboard</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Teacher Portal</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Admin Management</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Real-time Reports</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900">Quick Links</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li><a href="https://www.gbu.ac.in/" className="hover:text-purple-600 transition-colors">University Website</a></li>
                <li><a href="https://www.gbu.ac.in/page/academicCalender" className="hover:text-purple-600 transition-colors">Academic Calendar</a></li>
                <li><a href="https://gbu.samarth.edu.in/index.php/site/login" className="hover:text-purple-600 transition-colors">Student Portal</a></li>
                <li><a href="https://faculty.gbu.ac.in/" className="hover:text-purple-600 transition-colors">Faculty Portal</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900">Connect With Us</h4>
              <div className="text-xs sm:text-sm text-gray-600 space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="break-all">attendance@gbu.ac.in</span>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-2">
                <a href="mailto:info@gbu.ac.in" className="text-purple-600 hover:text-purple-700 transition-colors">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
                <a href="https://www.facebook.com/gbugrnoida.dic/" className="text-blue-600 hover:text-blue-700 transition-colors">
                  <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
                <a href="https://x.com/gbugrnoida" className="text-blue-400 hover:text-blue-500 transition-colors">
                  <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
                <a href="https://www.youtube.com/channel/UCOfkhzLuMRTfqSKMFr9LBCA" className="text-red-600 hover:text-red-700 transition-colors">
                  <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
                <a href="https://www.instagram.com/" className="text-pink-600 hover:text-pink-700 transition-colors">
                  <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 space-y-4 md:space-y-0">
            <p className="text-center md:text-left">© 2025 - Gautam Buddha University. All Rights Reserved.</p>
            <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6">
              <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
