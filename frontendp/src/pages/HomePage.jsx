import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FiUser, FiLayers, FiCode, FiGlobe, FiFileText, FiArrowRight } from 'react-icons/fi';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router';
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('portfolio');

  const navigate = useNavigate();

  const handleGenerateClick = () => {
    
    navigate("/user/website")

  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white overflow-hidden">

      <div className="container mx-auto px-4 h-screen flex flex-col">

        <header className="py-6 flex justify-between">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            AI Builder Pro
          </h1>
            <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${activeTab === 'portfolio' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
          >
            <FiUser size={18} />
            Portfolio Builder
          </button>
          <button 
            onClick={() => setActiveTab('website')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${activeTab === 'website' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
          >
            <FiGlobe size={18} />
            Website Creator
          </button>
        </div>
        </header>


        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pb-12">
          
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-3xl -rotate-6"></div>
            
            {activeTab === 'portfolio' ? (
              <div className="relative bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-cyan-500/20 text-cyan-400">
                      <FiUser size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Portfolio Builder</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 text-xs mt-1 flex-shrink-0">1</div>
                      <p>Enter your personal details</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-500/20 text-purple-400 text-xs mt-1 flex-shrink-0">2</div>
                      <p>Add your skills & projects</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-pink-500/20 text-pink-400 text-xs mt-1 flex-shrink-0">3</div>
                      <p>Generate & customize design</p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/form" 
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-400/20 transition-all"
                  >
                    Start Building <FiArrowRight />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-cyan-500/20 text-cyan-400">
                      <FiGlobe size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Website Creator</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <p>Describe what website you need:</p>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value="e.g. 'A modern restaurant website with menu'"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-400/50 cursor-pointer"
                        onClick={handleGenerateClick}
                        title="Click the generate button to start"
                      />
                  
                    </div>
                  </div>

                  <Link to="/user/website">
                  <button className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-400/20 transition-all">
                  Start Generating <FiArrowRight />
                  
                  </button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              {activeTab === 'portfolio' 
                ? 'Build Your Professional Identity' 
                : 'Create Any Website With AI'}
            </h2>
            
            <p className="text-lg text-gray-300 max-w-lg">
              {activeTab === 'portfolio' 
                ? 'Stand out with a stunning portfolio generated by our AI in minutes.' 
                : 'Describe your vision and get a complete website instantly.'}
            </p>
            
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'portfolio' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 hover:bg-white/10'}`}
              >
                <FiFileText className="inline mr-2" />
                Build Portfolio Website
              </button>
              <button 
                onClick={() => setActiveTab('website')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'website' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 hover:bg-white/10'}`}
              >
                <FiLayers className="inline mr-2" />
                Build Any Website
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Features />
      <Footer />
    </div>
    </>
  );
};

export default HomePage;
