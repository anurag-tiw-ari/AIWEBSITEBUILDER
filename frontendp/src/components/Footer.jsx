import React from 'react';
import { FiExternalLink } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-24 px-16">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">

          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              AI BUILDER PRO
            </h2>
            <p className="text-gray-300 text-lg">Build Any Website in Minutes</p>
          </div>

          <div className="flex flex-col space-y-4">
    
            <div className="text-gray-400 text-sm">
              
              <a 
                href="https://anuragtportfolio.netlify.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center text-xl"
              >
                About Developer <FiExternalLink className="ml-1" size={14} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;