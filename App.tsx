import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { User, Course, Page } from './types';
import { dummyUser, dummyCourses } from './data/dummy';
import Logo from './components/Logo';
import { HomeIcon, CoursesIcon, MentorIcon, ProfileIcon, PlayIcon, CheckCircleIcon, BackIcon, SealIcon, NotificationIcon, MoonIcon, LanguageIcon, CameraIcon, ChevronRightIcon, CloseIcon } from './components/Icons';
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
    const mainPages: Page[] = ['home', 'my-courses', 'mentor', 'profile'];
    
    // Determine the active tab. For sub-pages, we default to no active tab, 
    // but you could enhance this to keep the parent tab active.
    const activePage = mainPages.includes(page) ? page : null;


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
                    className={`flex flex-col items-center justify-center text-xs transition-colors duration-200 w-full h-full ${activePage === item.name ? 'text-[#4FA66D]' : 'text-gray-500'}`}
                >
                    <item.icon className="w-6 h-6 mb-1" />
                    {item.label}
                </button>
            ))}
        </div>
    );
};

const VideoPlayerModal = ({ video, onClose }: { video: { title: string; url: string; }; onClose: () => void; }) => {
    const getYouTubeEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
        }
        return null;
    };

    const embedUrl = getYouTubeEmbedUrl(video.url);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg overflow-hidden w-11/12 max-w-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b">
                    <h3 className="font-bold font-poppins text-lg truncate">{video.title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <CloseIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                <div className="aspect-video bg-black">
                    {embedUrl ? (
                        <iframe
                            className="w-full h-full"
                            src={embedUrl}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <video src={video.url} className="w-full h-full" controls autoPlay>
                            Browser Anda tidak mendukung tag video.
                        </video>
                    )}
                </div>
            </div>
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
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories: string[] = ['All', 'SEO', 'Ads', 'Copywriting', 'Branding'];
    
    const filteredCourses = selectedCategory === 'All'
        ? courses
        : courses.filter(course => course.category === selectedCategory);

    return (
        <div className="w-full bg-white pb-20">
            <header className="p-4 flex items-center space-x-3 bg-white sticky top-0 z-10 border-b border-gray-100 h-16">
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
                            <button 
                                key={cat} 
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200 ${selectedCategory === cat ? 'bg-[#4FA66D] text-white' : 'bg-gray-100 text-gray-700'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-xl font-bold font-poppins mb-4">Kursus Populer</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {filteredCourses.map(course => (
                            <div key={course.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer" onClick={() => navigate('course', { id: course.id })}>
                                <img src={course.thumbnail} alt={course.title} className="w-full h-24 object-cover"/>
                                <div className="p-3">
                                    <h3 className="font-bold text-sm leading-tight text-[#2E2E2E] line-clamp-2">{course.title}</h3>
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
    const [playingVideo, setPlayingVideo] = useState<{ title: string; url: string; } | null>(null);


    if (!course) {
        return (
            <div className="w-full h-full flex flex-col">
                <Header title="Error" showBackButton />
                <div className="p-4">Kursus tidak ditemukan.</div>
            </div>
        );
    }

    return (
        <>
            {playingVideo && <VideoPlayerModal video={playingVideo} onClose={() => setPlayingVideo(null)} />}
            <div className="w-full bg-white flex flex-col h-full">
                <Header title="Detail Kursus" showBackButton />
                <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover"/>
                    <div className="p-4 space-y-4">
                        <h1 className="text-2xl font-bold font-poppins">{course.title}</h1>
                        <p className="text-gray-600">{course.description}</p>
                        <button className="w-full bg-[#4FA66D] text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2" onClick={() => setPlayingVideo({ title: course.videos[0].title, url: course.videos[0].videoUrl })}>
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
                                <button key={index} onClick={() => setPlayingVideo({ title: video.title, url: video.videoUrl })} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                   <div className="flex items-center space-x-3 text-left">
                                     <div className="w-8 h-8 bg-green-100 text-[#4FA66D] rounded-full flex items-center justify-center font-bold flex-shrink-0">{index + 1}</div>
                                     <div>
                                       <h3 className="font-semibold text-sm">{video.title}</h3>
                                       <p className="text-xs text-gray-500">{video.duration}</p>
                                     </div>
                                   </div>
                                   <div className="w-6 h-6 text-gray-400">
                                     <PlayIcon />
                                   </div>
                                </button>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
        </>
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
                <button type="submit" className="ml-3 p-3 bg-[#4FA66D] text-white rounded-full disabled:opacity-50" disabled={isLoading || !input.trim()}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </form>
        </div>
    );
};

const SubscriptionPage = () => {
    const plans = [
        { name: 'freemium', price: '0', features: ['Akses 2 kursus gratis', 'Tanya AI Mentor terbatas'] },
        { name: 'sinaw-pro', price: '49K', features: ['Akses 10 kursus', 'Tanya AI Mentor', 'Sertifikat digital'] },
        { name: 'sinaw-proficient', price: '99K', features: ['Akses semua kursus', 'Tanya AI Mentor tanpa batas', 'Sertifikat digital', 'Grup Komunitas'], highlight: true },
    ];

    return (
        <div className="flex flex-col h-full">
            <Header title="Langganan" showBackButton />
            <div className="p-4 bg-gray-50 flex-1">
                <h1 className="text-2xl font-bold font-poppins text-center mb-6">Pilih Paket Belajar Kamu</h1>
                <div className="space-y-4">
                    {plans.map(plan => (
                        <div key={plan.name} className={`p-6 rounded-lg border-2 ${plan.highlight ? 'border-[#4FA66D] bg-green-50' : 'border-gray-200 bg-white'}`}>
                            <h2 className="text-xl font-bold font-poppins text-[#4FA66D] capitalize">{plan.name.replace('-', ' ')}</h2>
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
        </div>
    );
};

const ProfilePage = () => {
    const { user, logout, navigate } = useAppContext();
    const menuItems = [
        { name: 'Sertifikat', action: () => navigate('certificate') },
        { name: 'Paket Langganan', action: () => navigate('subscription') },
        { name: 'Pengaturan', action: () => navigate('settings') },
        { name: 'Keluar', action: logout },
    ];

    return (
        <div className="w-full h-full bg-gray-50 pb-20">
            <div className="p-6 bg-white flex flex-col items-center border-b">
                <img src={user?.avatar} alt="Avatar" className="w-24 h-24 rounded-full mb-4"/>
                <h1 className="text-xl font-bold font-poppins">{user?.name}</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="mt-2 bg-green-100 text-[#4FA66D] text-xs font-bold px-3 py-1 rounded-full capitalize">{user?.subscriptionStatus?.replace('-', ' ')} Member</div>
                <button onClick={() => navigate('edit-profile')} className="mt-4 bg-[#4FA66D] text-white px-6 py-2 rounded-lg font-semibold">Edit Profil</button>
            </div>
            <div className="p-4">
                <div className="bg-white rounded-lg overflow-hidden">
                    {menuItems.map((item, index) => (
                        <button key={item.name} onClick={item.action} className={`w-full text-left p-4 flex justify-between items-center transition-colors hover:bg-gray-50 ${index < menuItems.length - 1 ? 'border-b' : ''} ${item.name === 'Keluar' ? 'text-red-500 font-semibold' : ''}`}>
                            <span>{item.name}</span>
                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CertificatePage = () => {
    const { user } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-gray-100">
            <Header title="Sertifikat" showBackButton />
            <div className="flex-1 p-4 flex items-center justify-center">
                <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg border-2 border-[#4FA66D] relative">
                    <div className="absolute top-4 right-4">
                        <Logo className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500 font-semibold">Sertifikat Kelulusan</p>
                        <h2 className="text-2xl font-bold font-poppins text-[#2E2E2E] my-3">Dasar Facebook Ads</h2>
                        <p className="text-sm text-gray-600 mb-6">diberikan kepada:</p>
                        <p className="text-xl font-bold font-poppins text-[#4FA66D]">{user?.name}</p>
                        <p className="text-xs text-gray-500 mt-1">telah berhasil menyelesaikan kursus dengan baik.</p>
                    </div>
                     <div className="mt-8 flex justify-between items-center">
                        <div className="text-center">
                            <p className="font-bold text-sm">Budi Darmawan</p>
                            <p className="text-xs text-gray-500 border-t mt-1 pt-1">CEO SINAW</p>
                        </div>
                        <SealIcon className="w-16 h-16 text-green-200" />
                     </div>
                </div>
            </div>
        </div>
    );
};

const SettingsPage = () => {
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <Header title="Pengaturan" showBackButton />
            <div className="p-4 space-y-4">
                <div className="bg-white rounded-lg overflow-hidden">
                    <div className="p-4 flex items-center justify-between border-b">
                        <div className="flex items-center space-x-3">
                            <NotificationIcon className="w-6 h-6 text-gray-500" />
                            <span className="font-semibold">Notifikasi Push</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between border-b">
                        <div className="flex items-center space-x-3">
                            <MoonIcon className="w-6 h-6 text-gray-500" />
                            <span className="font-semibold">Mode Gelap</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle2" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>
                     <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <LanguageIcon className="w-6 h-6 text-gray-500" />
                            <span className="font-semibold">Bahasa</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <span className="text-gray-500">Indonesia</span>
                           <ChevronRightIcon className="w-5 h-5 text-gray-400"/>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.toggle-checkbox:checked { right: 0; border-color: #4FA66D; } .toggle-checkbox:checked + .toggle-label { background-color: #4FA66D; }`}</style>
        </div>
    );
};

const EditProfilePage = () => {
    const { user, goBack } = useAppContext();
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <Header title="Edit Profil" showBackButton />
            <div className="flex-1 p-6 space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                    <img src={user?.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    <button className="absolute bottom-0 right-0 bg-[#4FA66D] text-white p-2 rounded-full border-2 border-white">
                        <CameraIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Nama Lengkap</label>
                        <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FA66D]" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Email</label>
                        <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500" />
                    </div>
                </div>
                <button onClick={goBack} className="w-full bg-[#4FA66D] text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Simpan Perubahan
                </button>
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
    
    // If navigating to a main tab page from another main tab, clear history.
    if (bottomNavPages.includes(newPage) && bottomNavPages.includes(page)) {
        setHistory([]);
    } else {
        // Otherwise, it's a drill-down, so add the current page to history.
        setHistory(prev => [...prev, { page, params: pageParams }]);
    }
    setPage(newPage);
    setPageParams(newParams);
  }, [page, pageParams]);

  const goBack = useCallback(() => {
    const lastState = history.pop(); // Use pop to modify and get the last state
    if (lastState) {
        setHistory([...history]); // Update state with the modified history
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
      case 'certificate': return <CertificatePage />;
      case 'settings': return <SettingsPage />;
      case 'edit-profile': return <EditProfilePage />;
      default: return <HomePage />;
    }
  };
  
  const showBottomNav = user && ['home', 'my-courses', 'mentor', 'profile'].includes(page);


  return (
    <AppContext.Provider value={contextValue}>
      <div className="w-full min-h-screen bg-gray-200 flex justify-center">
        <div className="w-full max-w-md h-screen bg-white shadow-2xl relative overflow-hidden">
          <main className={`h-full w-full overflow-y-auto smooth-scroll ${showBottomNav ? 'pb-16' : ''}`}>
            {renderPage()}
          </main>
          {showBottomNav && (
            <div className="absolute bottom-0 w-full">
              <BottomNav />
            </div>
          )}
        </div>
      </div>
    </AppContext.Provider>
  );
}