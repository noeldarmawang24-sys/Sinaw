
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { User, Course, Page } from './types';
import { dummyUser, dummyCourses } from './data/dummy';
import Logo from './components/Logo';
import { HomeIcon, CoursesIcon, MentorIcon, ProfileIcon, PlayIcon, CheckCircleIcon, BackIcon } from './components/Icons';
import { getMentorResponse } from './services/geminiService';
import type { ChatMessage } from './types';

// --- App Context ---
interface AppContextType {
  user: User | null;
  courses: Course[];
  page: Page;
  login: (name: string) => void;
  logout: () => void;
  navigate: (page: Page, params?: any) => void;
  goBack: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// --- Helper Components ---
const Header = ({ title, showBackButton = false }: { title: string; showBackButton?: boolean }) => {
    const { goBack } = useAppContext();
    return (
        <header className="bg-white p-4 flex items-center sticky top-0 z-20 border-b border-gray-100 h-16 flex-shrink-0">
            {showBackButton && (
                <button onClick={goBack} className="mr-2 -ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Kembali">
                    <BackIcon className="w-6 h-6 text-gray-800" />
                </button>
            )}
            <h1 className="font-bold font-poppins text-lg text-[#2E2E2E] truncate">{title}</h1>
        </header>
    );
};


const BottomNav = () => {
    const { navigate, page } = useAppContext();

    const handleNavigate = (pageName: Page) => {
        navigate(pageName);
    };

    const navItems = [
        { name: 'home', icon: HomeIcon, label: 'Home' },
        { name: 'my-courses', icon: CoursesIcon, label: 'Kursus Saya' },
        { name: 'mentor', icon: MentorIcon, label: 'Mentor' },
        { name: 'profile', icon: ProfileIcon, label: 'Profil' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50 max-w-md mx-auto">
            {navItems.map((item) => (
                <button
                    key={item.name}
                    onClick={() => handleNavigate(item.name as Page)}
                    className={`flex flex-col items-center justify-center text-xs transition-colors duration-200 ${page === item.name ? 'text-[#4FA66D]' : 'text-gray-500'}`}
                >
                    <item.icon className="w-6 h-6 mb-1" />
                    {item.label}
                </button>
            ))}
        </div>
    );
};


// --- Page Components ---

const SplashScreen = () => (
  <div className="w-full h-full flex items-center justify-center bg-white animate-fade-in">
    <Logo className="w-32 h-32" />
  </div>
);

const LoginPage = () => {
  const { login } = useAppContext();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && name.trim()) {
        login(name);
    } else if (!isRegister) {
        login(dummyUser.name);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-6">
        <Logo className="w-24 h-24 mb-8"/>
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 font-poppins text-[#2E2E2E]">
                {isRegister ? 'Daftar Akun Baru' : 'Masuk ke Sinaw'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                    <input type="text" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FA66D]" required/>
                )}
                <input type="email" placeholder="Email" defaultValue={isRegister ? "" : "budi.darmawan@example.com"} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FA66D]" required/>
                <input type="password" placeholder="Password" defaultValue={isRegister ? "" : "password"} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FA66D]" required/>
                <button type="submit" className="w-full bg-[#4FA66D] text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    {isRegister ? 'Daftar Sekarang' : 'Masuk ke Sinaw'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
                {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
                <button onClick={() => setIsRegister(!isRegister)} className="font-semibold text-[#4FA66D] hover:underline">
                    {isRegister ? 'Masuk' : 'Daftar'}
                </button>
            </p>
        </div>
    </div>
  );
};

const HomePage = () => {
    const { user, courses, navigate } = useAppContext();
    const categories: string[] = ['SEO', 'Ads', 'Copywriting', 'Branding'];

    return (
        <div className="w-full bg-white pb-20">
            <header className="p-4 flex items-center space-x-3 bg-white sticky top-0 z-10 border-b border-gray-100">
                <Logo className="w-8 h-8"/>
                <div>
                    <h1 className="text-lg font-bold font-poppins text-[#2E2E2E]">Hai, {user?.name.split(' ')[0]}!</h1>
                    <p className="text-sm text-gray-500">Siap Belajar Hari Ini?</p>
                </div>
            </header>
            <main className="p-4 space-y-6">
                <section>
                    <h2 className="text-xl font-bold font-poppins mb-4">Kategori Kursus</h2>
                    <div className="flex space-x-3 overflow-x-auto pb-3 no-scrollbar">
                        {categories.map(cat => (
                            <button key={cat} className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-semibold text-sm">
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-xl font-bold font-poppins mb-4">Kursus Populer</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {courses.map(course => (
                            <div key={course.id} className="bg-white rounded-lg overflow-hidden border border-gray-200" onClick={() => navigate('course', { id: course.id })}>
                                <img src={course.thumbnail} alt={course.title} className="w-full h-24 object-cover"/>
                                <div className="p-3">
                                    <h3 className="font-bold text-sm leading-tight text-[#2E2E2E]">{course.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

const CourseDetailPage = ({ courseId }: { courseId: number }) => {
    const { courses, navigate } = useAppContext();
    const course = courses.find(c => c.id === courseId);

    if (!course) {
        return (
            <div className="w-full h-full flex flex-col">
                <Header title="Error" showBackButton />
                <div className="p-4">Kursus tidak ditemukan.</div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white flex flex-col h-full">
            <Header title="Detail Kursus" showBackButton />
            <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
                <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover"/>
                <div className="p-4 space-y-4">
                    <h1 className="text-2xl font-bold font-poppins">{course.title}</h1>
                    <p className="text-gray-600">{course.description}</p>
                    <button className="w-full bg-[#4FA66D] text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
                        <PlayIcon className="w-6 h-6"/>
                        <span>Tonton Sekarang</span>
                    </button>
                    <button onClick={() => navigate('mentor')} className="w-full bg-green-100 text-[#4FA66D] py-3 rounded-lg font-semibold border border-green-200">
                        Tanyakan ke AI Mentor
                    </button>
                </div>
                <div className="bg-white p-4">
                     <h2 className="text-xl font-bold font-poppins mb-4">Materi Pembelajaran</h2>
                     <div className="space-y-3">
                        {course.videos.map((video, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                               <div className="flex items-center space-x-3">
                                 <div className="w-8 h-8 bg-green-100 text-[#4FA66D] rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                                 <div>
                                   <h3 className="font-semibold text-sm">{video.title}</h3>
                                   <p className="text-xs text-gray-500">{video.duration}</p>
                                 </div>
                               </div>
                               <div className="w-5 h-5 text-gray-400">
                                 <PlayIcon />
                               </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

const AiMentorPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, text: "Halo! Saya AI Mentor. Ada yang bisa saya bantu seputar digital marketing hari ini?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        const responseText = await getMentorResponse(input);

        const newAiMessage: ChatMessage = { id: Date.now() + 1, text: responseText, sender: 'ai' };
        setMessages(prev => [...prev, newAiMessage]);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <Header title="AI Mentor" showBackButton />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-gray-200 text-black rounded-br-lg' : 'bg-[#4FA66D] text-white rounded-bl-lg'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-[#4FA66D] text-white p-3 rounded-2xl rounded-bl-lg">
                            <span className="animate-pulse">Mengetik...</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSend} className="bg-white p-3 border-t flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanyakan strategi digital marketing..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none"
                />
                <button type="submit" className="ml-3 p-2 bg-[#4FA66D] text-white rounded-full disabled:opacity-50" disabled={isLoading || !input.trim()}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </button>
            </form>
        </div>
    );
};

const SubscriptionPage = () => {
    const plans = [
        { name: 'Free', price: '0', features: ['Akses 2 kursus gratis', 'Tanya AI Mentor terbatas'] },
        { name: 'Basic', price: '49K', features: ['Akses 10 kursus', 'Tanya AI Mentor', 'Sertifikat digital'] },
        { name: 'Pro', price: '99K', features: ['Akses semua kursus', 'Tanya AI Mentor tanpa batas', 'Sertifikat digital', 'Grup Komunitas'], highlight: true },
    ];

    return (
        <div className="p-4 bg-gray-50 h-full">
            <h1 className="text-2xl font-bold font-poppins text-center mb-6">Pilih Paket Belajar Kamu</h1>
            <div className="space-y-4">
                {plans.map(plan => (
                    <div key={plan.name} className={`p-6 rounded-lg border-2 ${plan.highlight ? 'border-[#4FA66D] bg-green-50' : 'border-gray-200 bg-white'}`}>
                        <h2 className="text-xl font-bold font-poppins text-[#4FA66D]">{plan.name}</h2>
                        <p className="text-3xl font-bold my-2">Rp {plan.price}<span className="text-base font-normal text-gray-500">/bulan</span></p>
                        <ul className="space-y-2 my-4">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center space-x-2 text-sm text-gray-700">
                                    <CheckCircleIcon className="w-5 h-5 text-[#4FA66D] flex-shrink-0"/>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-3 rounded-lg font-semibold ${plan.highlight ? 'bg-[#4FA66D] text-white' : 'bg-gray-200 text-gray-800'}`}>
                            Langganan Sekarang
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const { user, logout, navigate } = useAppContext();
    const menuItems = [
        { name: 'Sertifikat', action: () => {} },
        { name: 'Paket Langganan', action: () => navigate('subscription') },
        { name: 'Pengaturan', action: () => {} },
        { name: 'Keluar', action: logout },
    ];

    return (
        <div className="w-full h-full bg-gray-50">
            <div className="p-6 bg-white flex flex-col items-center border-b">
                <img src={user?.avatar} alt="Avatar" className="w-24 h-24 rounded-full mb-4"/>
                <h1 className="text-xl font-bold font-poppins">{user?.name}</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="mt-2 bg-green-100 text-[#4FA66D] text-xs font-bold px-3 py-1 rounded-full">{user?.subscriptionStatus} Member</div>
                <button className="mt-4 bg-[#4FA66D] text-white px-6 py-2 rounded-lg font-semibold">Edit Profil</button>
            </div>
            <div className="p-4">
                <div className="bg-white rounded-lg">
                    {menuItems.map((item, index) => (
                        <button key={item.name} onClick={item.action} className={`w-full text-left p-4 flex justify-between items-center ${index < menuItems.length - 1 ? 'border-b' : ''} ${item.name === 'Keluar' ? 'text-red-500' : ''}`}>
                            <span>{item.name}</span>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- App Component ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('splash');
  const [pageParams, setPageParams] = useState<any>({});
  const [history, setHistory] = useState<{ page: Page; params: any }[]>([]);
  
  useEffect(() => {
    if (page === 'splash') {
      const timer = setTimeout(() => {
        setPage('login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [page]);

  const login = useCallback((name: string) => {
    setUser({ ...dummyUser, name });
    setHistory([]);
    setPage('home');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setHistory([]);
    setPage('login');
  }, []);

  const navigate = useCallback((newPage: Page, newParams: any = {}) => {
    const bottomNavPages: Page[] = ['home', 'my-courses', 'mentor', 'profile'];
    // If navigating to a main tab page, clear history.
    if (bottomNavPages.includes(newPage)) {
        setHistory([]);
    } else {
        // Otherwise, it's a drill-down, so add the current page to history.
        setHistory(prev => [...prev, { page, params: pageParams }]);
    }
    setPage(newPage);
    setPageParams(newParams);
  }, [page, pageParams]);

  const goBack = useCallback(() => {
    const lastState = history[history.length - 1];
    if (lastState) {
        setHistory(prev => prev.slice(0, -1));
        setPage(lastState.page);
        setPageParams(lastState.params);
    } else {
        // Fallback to home if no history
        setPage('home');
        setPageParams({});
    }
  }, [history]);
  
  const contextValue: AppContextType = {
    user,
    courses: dummyCourses,
    page,
    login,
    logout,
    navigate,
    goBack,
  };

  const renderPage = () => {
    switch (page) {
      case 'splash': return <SplashScreen />;
      case 'login': return <LoginPage />;
      case 'home': return <HomePage />;
      case 'my-courses': return <div className="p-4 text-center">Halaman Kursus Saya</div>;
      case 'course': return <CourseDetailPage courseId={pageParams.id} />;
      case 'mentor': return <AiMentorPage />;
      case 'profile': return <ProfilePage />;
      case 'subscription': return <SubscriptionPage />;
      default: return <HomePage />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="w-full min-h-screen bg-gray-200 flex justify-center">
        <div className="w-full max-w-md h-screen bg-white shadow-2xl relative overflow-hidden">
          <main className="h-full w-full overflow-y-auto smooth-scroll">
            {renderPage()}
          </main>
          {user && page !== 'mentor' && (
            <div className="absolute bottom-0 w-full">
              <BottomNav />
            </div>
          )}
        </div>
      </div>
    </AppContext.Provider>
  );
}
