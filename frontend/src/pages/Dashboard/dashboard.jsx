import React from "react";
import { motion } from "framer-motion";

// Icons
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
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
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gray-900 text-white text-lg font-bold rounded-full shadow-xl hover:bg-black transition-all flex items-center gap-2"
                        >
                            Build My Resume <ArrowRightIcon />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white text-gray-900 text-lg font-bold rounded-full border border-gray-200 shadow-sm hover:border-gray-300 transition-all"
                        >
                            View Examples
                        </motion.button>
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
                        {/* Abstract UI Representation */}
                        <div className="flex flex-col gap-4 w-3/4 opacity-60">
                            <div className="h-8 bg-white rounded-lg w-full shadow-sm"></div>
                            <div className="flex gap-4">
                                <div className="h-40 bg-white rounded-lg w-1/3 shadow-sm"></div>
                                <div className="h-40 bg-white rounded-lg w-2/3 shadow-sm"></div>
                            </div>
                            <div className="h-20 bg-white rounded-lg w-full shadow-sm"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="px-6 py-3 bg-white/90 backdrop-blur rounded-lg shadow-lg font-semibold text-gray-500">Deep Dashboard Preview</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const FeatureCard = ({ title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay }}
        className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow flex flex-col gap-4 group"
    >
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
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
                        delay={0.1}
                    />
                    <FeatureCard
                        title="ATS Optimization"
                        description="Ensure your resume passes through Applicant Tracking Systems with our intelligent formatting and keyword optimization."
                        delay={0.2}
                    />
                    <FeatureCard
                        title="Real-time Analytics"
                        description="Track how typically recruiters might view your resume and get actionable insights to improve it."
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
};

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
                <Features />
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;