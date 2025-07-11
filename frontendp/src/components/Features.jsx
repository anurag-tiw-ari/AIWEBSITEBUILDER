import React from 'react';
import { motion } from 'framer-motion';
import { FiLayers, FiCode, FiGlobe, FiFileText, FiDownload, FiEdit } from 'react-icons/fi';
import { GrDeploy } from 'react-icons/gr';

const Features = () => {
  const features = [
    {
      icon: <FiFileText size={24} />,
      title: "Portfolio in 3 Steps",
      description: "Generate a stunning portfolio website by just completing three simple steps - enter details, add projects, and customize design.",
      gradient: "from-cyan-400 to-blue-500"
    },
    {
      icon: <FiGlobe size={24} />,
      title: "Prompt to Website",
      description: "Describe what you need and get a complete website instantly. Our AI handles the design and development for you.",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: <FiCode size={24} />,
      title: "Real-time Code Editor",
      description: "Edit your website code and see changes instantly with our built-in IDE-like interface with live preview.",
      gradient: "from-amber-400 to-orange-500"
    },
    {
      icon: <FiEdit size={24} />,
      title: "Update with Prompts",
      description: "For a Generated website, Just tell us what changes you want and we'll update it for you automatically.",
      gradient: "from-emerald-400 to-teal-500"
    },
    {
      icon: <FiDownload size={24} />,
      title: "Download as ZIP",
      description: "Get all your website files packaged neatly for easy deployment anywhere. Full ownership of your code.",
      gradient: "from-violet-400 to-indigo-500"
    },
    {
      icon: <GrDeploy size={24} />,
      title: "Deply in minutes",
      description: "Get all your website Live With just One Click. Full ownership of your website.",
      gradient: "from-emerald-400 to-teal-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white overflow-hidden py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Creators</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to build, customize, and deploy professional websites with AI assistance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all"
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${feature.gradient} mb-4`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default Features;