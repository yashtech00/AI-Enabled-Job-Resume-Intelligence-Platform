import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Icons
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-orange-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const Hero = () => {
    return (
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-gray-50/50">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-3xl -z-10" />

            <div className="mx-auto w-full max-w-7xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100">
                        🚀 AI-Powered Recruitment Intelligence
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
                        Find Your <span className="text-orange-500">Top 10 Candidates</span> <br className="hidden md:block" />
                        in Seconds with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI Chat</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Create jobs, upload resumes in bulk, and let our AI rank the top matches based on skills. Chat directly with resumes to screen candidates effortlessly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/jobs">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gray-900 text-white text-lg font-bold rounded-full shadow-xl hover:bg-black transition-all flex items-center gap-2"
                            >
                                Post a Job <ArrowRightIcon />
                            </motion.button>
                        </Link>
                        <Link to="/resumes/upload">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-gray-900 text-lg font-bold rounded-full border border-gray-200 shadow-sm hover:border-gray-300 transition-all"
                            >
                                Upload Resumes
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Dashboard Preview Image */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="mt-20 relative mx-auto max-w-5xl rounded-2xl bg-white p-2 shadow-2xl border border-gray-200/60"
                >
                    <div className="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center relative group">
                        <img
                            src="/image.png"
                            alt="AI-Resume Dashboard Preview"
                            className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const TrustedBy = () => (
    <section className="py-10 border-b border-gray-100">
        <div className="mx-auto w-full max-w-7xl px-6 text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Trusted by hiring managers at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale transition-all hover:grayscale-0">
                {/* Placeholders for logos */}
                <span className="text-xl font-bold font-serif text-gray-800">Acme Corp</span>
                <span className="text-xl font-bold font-sans text-gray-800">Globex</span>
                <span className="text-xl font-bold font-mono text-gray-800">Soylent</span>
                <span className="text-xl font-bold font-serif italic text-gray-800">Initech</span>
                <span className="text-xl font-bold font-sans text-gray-800">Umbrella</span>
            </div>
        </div>
    </section>
);

const FeatureCard = ({ title, description, icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay }}
        className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow flex flex-col gap-4 group"
    >
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{description}</p>
        </div>
    </motion.div>
);

const Features = () => {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="mx-auto w-full max-w-7xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose <span className="text-blue-600">AI-Resume</span>?</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">We combine cutting-edge AI with professional design principles to help you succeed.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Top 10 Candidate Matching"
                        description="Automatically scan all resumes and get a ranked list of the top 10 candidates based on matched vs. missing skills for the specific job."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>}
                        delay={0.1}
                    />
                    <FeatureCard
                        title="Bulk Resume Processing"
                        description="Upload hundreds of resumes at once. Our system processes them in parallel to give you instant results without the manual waiting."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>}
                        delay={0.2}
                    />
                    <FeatureCard
                        title="AI Resume Chat"
                        description="Have a conversation with any resume. Ask the AI chatbot specific questions about a candidate's experience to screen them instantly."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>}
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => (
    <section className="py-24 bg-gray-50">
        <div className="mx-auto w-full max-w-7xl px-6">
            <div className="text-center mb-16">
                <span className="text-orange-500 font-semibold tracking-wider text-sm">PROCESS</span>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2">How it works</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

                <div className="text-center bg-white md:bg-transparent p-6 rounded-2xl shadow-sm md:shadow-none">
                    <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-blue-50 flex items-center justify-center text-3xl font-bold text-blue-600 mb-6 relative z-10">1</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Create Job & Upload</h3>
                    <p className="text-gray-600">Input your job description and bulk upload potential candidate resumes.</p>
                </div>
                <div className="text-center bg-white md:bg-transparent p-6 rounded-2xl shadow-sm md:shadow-none">
                    <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-orange-50 flex items-center justify-center text-3xl font-bold text-orange-500 mb-6 relative z-10">2</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Get Top 10 Ranked Needs</h3>
                    <p className="text-gray-600">AI automatically ranks the top 10 candidates and highlights matched vs missing skills.</p>
                </div>
                <div className="text-center bg-white md:bg-transparent p-6 rounded-2xl shadow-sm md:shadow-none">
                    <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-blue-50 flex items-center justify-center text-3xl font-bold text-blue-600 mb-6 relative z-10">3</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Chat with Candidates</h3>
                    <p className="text-gray-600">Use the AI Chatbot to ask deeper questions and screen specific resumes.</p>
                </div>
            </div>
        </div>
    </section>
);

const Stats = () => (
    <section className="py-20 bg-gray-900 text-white">
        <div className="mx-auto w-full max-w-7xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                    <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">10</div>
                    <div className="text-gray-400">Top Candidates Ranked</div>
                </div>
                <div>
                    <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">Bulk</div>
                    <div className="text-gray-400">Multi-Upload Support</div>
                </div>
                <div>
                    <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">AI</div>
                    <div className="text-gray-400">Chat Assistant</div>
                </div>
                <div>
                    <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">24/7</div>
                    <div className="text-gray-400">Automated Screening</div>
                </div>
            </div>
        </div>
    </section>
);

const Testimonials = () => (
    <section id="testimonials" className="py-24 bg-white">
        <div className="mx-auto w-full max-w-7xl px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Recruiter Success Stories</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Hear from HR professionals who streamlined their process.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        name: "Sarah Jenkins",
                        role: "HR Lead",
                        text: "I used to spend days reading resumes. Now I just find the top 10 matches instantly and chat with the AI to verify details.",
                        bg: "bg-blue-50"
                    },
                    {
                        name: "Michael Chen",
                        role: "Tech Recruiter",
                        text: "The skills gap analysis is brilliant. Seeing exactly what skills are missing helps me make decisions in seconds.",
                        bg: "bg-orange-50"
                    },
                    {
                        name: "Emily Davis",
                        role: "Talent Acquisition",
                        text: "Bulk uploading works perfectly. I uploaded 50 resumes and had my ranked list in under a minute.",
                        bg: "bg-blue-50"
                    }
                ].map((t, i) => (
                    <div key={i} className={`p-8 rounded-2xl ${t.bg} border border-transparent hover:border-gray-200 transition-all`}>
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} />)}
                        </div>
                        <p className="text-gray-700 mb-6 italic">"{t.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-500">{t.name[0]}</div>
                            <div>
                                <div className="font-bold text-gray-900">{t.name}</div>
                                <div className="text-xs text-gray-500">{t.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Cta = () => (
    <section className="py-24 bg-white">
        <div className="mx-auto w-full max-w-5xl px-6">
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Start Smart Hiring Today</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">Create your first job, upload your candidate pool, and find your top 10 matches instantly.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                    <Link to="/jobs">
                        <button className="px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all">
                            Post a Job
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="mx-auto w-full max-w-7xl px-6 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="font-bold text-2xl mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">AI</div>
                    <span>Resume<span className="text-orange-500">Intelli</span></span>
                </div>
                <p className="text-gray-400 max-w-sm">
                    Empowering recruiters with AI-driven screening, skills matching, and automated candidate conversations.
                </p>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                    <li><Link to="/jobs" className="hover:text-white transition-colors">Jobs</Link></li>
                    <li><Link to="/resumes" className="hover:text-white transition-colors">Resumes</Link></li>
                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
            </div>
        </div>
        <div className="mx-auto w-full max-w-7xl px-6 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} AI-Resume Intelli. All rights reserved.
        </div>
    </footer>
);

export const Dashboard = () => {
    return (
        <div>
            <main>
                <Hero />
                <TrustedBy />
                <Features />
                <HowItWorks />
                <Stats />
                <Testimonials />
                <Cta />
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;