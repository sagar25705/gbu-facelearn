import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Lock, Mail, Facebook, Twitter, Youtube, Instagram, Phone, MapPin, ChevronLeft, ChevronRight, Search, GraduationCap, BookOpen, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
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
    
// Gauri Sagar


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
      {/* Purple Header Bar - GBU Style */}
      <div className="bg-purple-800 text-white py-2 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex space-x-6">
            <span>Tenders</span>
            <span>Recruitments</span>
            <span>Contact</span>
            <span>Directory</span>
            <span>Online Fee</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-10 pr-4 py-1 rounded text-black text-sm w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compact Main Navbar - White */}
      <div className="bg-white shadow-lg border-b fixed top-10 left-0 right-0 z-40">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/gbu-logo.png" 
                alt="GBU Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-base font-bold text-gray-900">गौतम बुद्ध विश्वविद्यालय</h1>
                <h2 className="text-sm font-bold text-gray-900">GAUTAM BUDDHA UNIVERSITY</h2>
                <p className="text-xs text-gray-600">Face Detection Attendance System</p>
              </div>
            </div>
            
            <div className="flex space-x-6 text-gray-700 text-sm">
              <a href="#" className="hover:text-purple-800 font-medium">Home</a>
              <a href="#" className="hover:text-purple-800 font-medium">About ▼</a>
              <a href="#" className="hover:text-purple-800 font-medium">Academics ▼</a>
              <a href="#" className="hover:text-purple-800 font-medium">Admissions</a>
              <a href="#" className="hover:text-purple-800 font-medium">Portal ▼</a>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Slider Section */}
      <div className="relative overflow-hidden" style={{ height: '100vh', paddingTop: '100px' }}>
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
              top: '100px',
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
        
        {/* Overlay Content - Centered */}
        <div className="absolute inset-0 flex items-center justify-center text-white z-10" style={{ top: '100px' }}>
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-6xl font-bold mb-6">Globally Acclaimed University in Delhi-NCR</h1>
            <p className="text-2xl mb-4">Established by the Uttar Pradesh Gautam Buddha University Act 2002 UP Act No. 9 of 2002</p>
            <p className="text-xl">Approved by UGC under Section 12-B & NAAC accredited</p>
            <div className="mt-8">
              <Button className="bg-purple-800 hover:bg-purple-900 text-white px-8 py-3 text-lg rounded-lg">
                Explore Our Campus
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 z-20 transition-all"
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 z-20 transition-all"
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-center z-20 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll for Login</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section with Education-themed Animated Background */}
      <div className="min-h-screen flex items-center relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 25%, #ec4899 50%, #f59e0b 75%, #10b981 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite'
      }}>
        {/* Custom CSS for gradient animation */}
        <style jsx>{`
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

        {/* Education-themed Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Education Icons */}
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

          {/* Floating Academic Elements */}
          <div className="absolute top-60 left-1/3 w-16 h-16 border-4 border-white/20 rounded-full" style={{ animation: 'bounce 4s ease-in-out infinite' }}></div>
          <div className="absolute top-32 right-1/4 w-12 h-12 bg-white/10 rotate-45" style={{ animation: 'float 10s ease-in-out infinite 1.5s' }}></div>
          <div className="absolute bottom-60 left-1/5 w-20 h-20 border-4 border-white/15 rotate-12" style={{ animation: 'float 12s ease-in-out infinite 2.5s' }}></div>

          {/* Geometric Shapes for College Theme */}
          <div className="absolute top-1/4 left-1/6 w-8 h-32 bg-white/10 rounded-full" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
          <div className="absolute top-1/3 right-1/5 w-32 h-8 bg-white/10 rounded-full" style={{ animation: 'float 6s ease-in-out infinite 1s' }}></div>
          
          {/* Abstract College Buildings */}
          <div className="absolute bottom-20 left-10 flex space-x-2">
            <div className="w-4 h-20 bg-white/10 rounded-t-lg" style={{ animation: 'bounce 5s ease-in-out infinite' }}></div>
            <div className="w-4 h-16 bg-white/15 rounded-t-lg" style={{ animation: 'bounce 5s ease-in-out infinite 0.5s' }}></div>
            <div className="w-4 h-24 bg-white/10 rounded-t-lg" style={{ animation: 'bounce 5s ease-in-out infinite 1s' }}></div>
          </div>
          
          <div className="absolute bottom-20 right-10 flex space-x-2">
            <div className="w-4 h-18 bg-white/15 rounded-t-lg" style={{ animation: 'bounce 6s ease-in-out infinite' }}></div>
            <div className="w-4 h-22 bg-white/10 rounded-t-lg" style={{ animation: 'bounce 6s ease-in-out infinite 0.7s' }}></div>
            <div className="w-4 h-20 bg-white/15 rounded-t-lg" style={{ animation: 'bounce 6s ease-in-out infinite 1.3s' }}></div>
          </div>

          {/* Attendance-themed Elements */}
          <div className="absolute top-1/2 left-8 grid grid-cols-3 gap-2 opacity-20">
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse delay-200"></div>
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse delay-400"></div>
            <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse delay-600"></div>
            <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse delay-800"></div>
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse delay-1000"></div>
          </div>

          <div className="absolute top-1/2 right-8 grid grid-cols-3 gap-2 opacity-20">
            <div className="w-3 h-3 bg-indigo-300 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-pink-300 rounded-full animate-pulse delay-300"></div>
            <div className="w-3 h-3 bg-teal-300 rounded-full animate-pulse delay-600"></div>
            <div className="w-3 h-3 bg-orange-300 rounded-full animate-pulse delay-900"></div>
            <div className="w-3 h-3 bg-cyan-300 rounded-full animate-pulse delay-1200"></div>
            <div className="w-3 h-3 bg-lime-300 rounded-full animate-pulse delay-1500"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-4 shadow-2xl p-2 border border-white/30">
                <img 
                  src="/gbu-logo.png" 
                  alt="GBU Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Attendance Portal</h2>
              <p className="text-lg text-white/90 drop-shadow-md">Face Detection System</p>
            </div>

            {/* Compact Login Card */}
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
              <CardHeader className="pb-4 text-center">
                <CardTitle className="text-2xl text-gray-900">Sign In</CardTitle>
                <CardDescription className="text-sm text-gray-600">Enter your credentials to access the portal</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-gray-700 font-medium text-sm">User ID</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="userId"
                        type="text"
                        placeholder="Enter your User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="pl-10 h-11 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 text-base rounded-lg transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 text-base rounded-lg transition-all"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold text-base rounded-lg transition-all transform hover:scale-105 shadow-lg"
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

                {/* Compact Demo Credentials */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border">
                  <p className="text-sm text-gray-700 mb-3 font-medium">Demo Credentials:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold text-purple-800">Admin:</span> 
                      <span className="text-gray-700">ADMIN001 / admin123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-purple-800">Teacher:</span> 
                      <span className="text-gray-700">TEACH001 / teacher123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-purple-800">Student:</span> 
                      <span className="text-gray-700">STU2024001 / student123</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* University Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/gbu-logo.png" 
                  alt="GBU Logo" 
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Gautam Buddha University</h3>
                  <p className="text-sm text-gray-600">Face Detection System</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                  <div>
                    <p>Yamuna Expressway</p>
                    <p>Greater NOIDA, Gautam Budh Nagar</p>
                    <p>Uttar Pradesh-201312 (INDIA)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>Phone No: 0120-2344200</span>
                </div>
                <p className="text-xs">(During office hours 9:30 am-5:30 pm)</p>
              </div>
            </div>

            {/* Portal Features */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Portal Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition-colors">Face Recognition</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Attendance Tracking</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Student Dashboard</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Teacher Portal</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Admin Management</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Real-time Reports</a></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition-colors">University Website</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Academic Calendar</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Student Portal</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Faculty Portal</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Tech Support</a></li>
                <li><a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Connect With Us</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>attendance@gbu.ac.in</span>
                </div>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-500 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-red-600 hover:text-red-700 transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
                <a href="#" className="text-pink-600 hover:text-pink-700 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2025 - Gautam Buddha University. All Rights Reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
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
