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
                        🚀 AI-Powered Career Growth
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
                        Craft Your Perfect <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Resume</span> with <span className="text-orange-500">Intelligence</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stand out from the crowd with our advanced AI algorithms. Build, analyze, and optimize your resume to land your dream job 10x faster.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/resumes/upload">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gray-900 text-white text-lg font-bold rounded-full shadow-xl hover:bg-black transition-all flex items-center gap-2"
                            >
                                Build My Resume <ArrowRightIcon />
                            </motion.button>
                        </Link>
                        <Link to="/jobs">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-gray-900 text-lg font-bold rounded-full border border-gray-200 shadow-sm hover:border-gray-300 transition-all"
                            >
                                Find Jobs
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
                    <div className="rounded-xl overflow-hidden bg-gray-100 aspect-video flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-200 opacity-50"></div>
                        <div className="flex flex-col gap-4 w-3/4 opacity-60">
                            <div className="h-8 bg-white rounded-lg w-full shadow-sm"></div>
                            <div className="flex gap-4">
                                <div className="h-40 bg-white rounded-lg w-1/3 shadow-sm"></div>
                                <div className="h-40 bg-white rounded-lg w-2/3 shadow-sm"></div>
                            </div>
                            <div className="h-20 bg-white rounded-lg w-full shadow-sm"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="px-6 py-3 bg-white/90 backdrop-blur rounded-lg shadow-lg font-semibold text-gray-500">AI-Resume Preview</span>
                        </div>
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
                        title="AI-Powered Writing"
                        description="Let our AI assist you in writing compelling bullet points that highlight your achievements effectively."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>}
                        delay={0.1}
                    />
                    <FeatureCard
                        title="ATS Optimization"
                        description="Ensure your resume passes through Applicant Tracking Systems with our intelligent formatting and keyword optimization."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>}
                        delay={0.2}
                    />
                    <FeatureCard
                        title="Real-time Analytics"
                        description="Track how typically recruiters might view your resume and get actionable insights to improve it."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>}
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
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Resume</h3>
                    <p className="text-gray-600">Drag and drop your existing resume or start from scratch using our builder.</p>
                </div>
                <div className="text-center bg-white md:bg-transparent p-6 rounded-2xl shadow-sm md:shadow-none">
                    <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-orange-50 flex items-center justify-center text-3xl font-bold text-orange-500 mb-6 relative z-10">2</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analysis</h3>
                    <p className="text-gray-600">Our advanced algorithms analyze your profile against job descriptions.</p>
                </div>
                <div className="text-center bg-white md:bg-transparent p-6 rounded-2xl shadow-sm md:shadow-none">
                    <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-blue-50 flex items-center justify-center text-3xl font-bold text-blue-600 mb-6 relative z-10">3</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Get Matched</h3>
                    <p className="text-gray-600">Receive accurate match scores and tips to land the interview.</p>
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
                    <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">10k+</div>
                    <div className="text-gray-400">Resumes Optimized</div>
                </div>
                <div>
                    <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">95%</div>
                    <div className="text-gray-400">Success Rate</div>
                </div>
                <div>
                    <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">50+</div>
                    <div className="text-gray-400">Partner Companies</div>
                </div>
                <div>
                    <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">24/7</div>
                    <div className="text-gray-400">AI Availability</div>
                </div>
            </div>
        </div>
    </section>
);

const Testimonials = () => (
    <section id="testimonials" className="py-24 bg-white">
        <div className="mx-auto w-full max-w-7xl px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Success Stories</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Hear from people who transformed their careers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        name: "Sarah Jenkins",
                        role: "Frontend Developer",
                        text: "I was getting no callbacks until I used AI-Resume. The optimization tips were a game changer.",
                        bg: "bg-blue-50"
                    },
                    {
                        name: "Michael Chen",
                        role: "Product Manager",
                        text: "The job matching score helped me tailor my resume for each application perfectly.",
                        bg: "bg-orange-50"
                    },
                    {
                        name: "Emily Davis",
                        role: "UX Designer",
                        text: "So easy to use and the design templates are beautiful. Highly recommended!",
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

                <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to boost your career?</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">Join thousands of professionals who have successfully landed their dream jobs using our platform.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                    <Link to="/resumes/upload">
                        <button className="px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all">
                            Get Started Now
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
                    Empowering job seekers with the best tools to build professional resumes and land their dream jobs.
                </p>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
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