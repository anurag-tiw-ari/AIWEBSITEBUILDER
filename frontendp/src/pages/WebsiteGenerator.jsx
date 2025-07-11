import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';
import { FiCode, FiGlobe, FiMessageSquare, FiPlus, FiX, FiMenu,FiAlertTriangle,FiRefreshCw,FiDownload,FiExternalLink} from 'react-icons/fi';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Link } from 'react-router';

const WebsiteGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  const iframeRef = useRef(null);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isGenerated,setIsGenerated] = useState(false)
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);


  useEffect(() => {
    if (generatedCode) {
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Generated Website</title>
          <style>${generatedCode['style.css']}</style>
        </head>
        <body>
          ${generatedCode['index.html']}
          <script>${generatedCode['script.js']}</script>
        </body>
        </html>
      `;
      if (iframeRef.current) {
        iframeRef.current.srcdoc = fullHtml;
      }
    }
  }, [generatedCode]);

  const handleZip = () => {
      if (!portfolio) return;
      
      const zip = new JSZip();
          zip.file("index.html", `<!DOCTYPE html>
       <html>
        <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <link rel="stylesheet" href="style.css">
         </head>
        <body>
          ${generatedCode['index.html']}
          <script src="script.js"></script>
        </body>
      </html>` );
      zip.file("style.css", generatedCode['style.css']);
      zip.file("script.js", generatedCode['script.js']);
  
      zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, "website.zip");
      });
    };

  const handleNewChat = () => {
    if (prompt || generatedCode) {
      const confirmReset = window.confirm('Starting a new chat will clear your current website. Are you sure?');
      if (confirmReset) {
        setPrompt('');
        setGeneratedCode(null);
        setMessages([]);
      }
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    console.log("prompt:", prompt)
    
    setLoading(true);
    try {
      const newUserMessage = {
        role: 'user',
        parts: [{text: prompt}]
      };
      
      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);

      const response = await axiosClient.post('/user/site/prompt', updatedMessages);
      
      let codeData = response.data.replace(/^```json/, '').replace(/```$/, '').trim();
      console.log("codeData:", codeData)
      codeData = JSON.parse(codeData);

      const aiResponse = {
        role: 'model',
        parts: [{text: JSON.stringify(codeData)}]
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      setGeneratedCode(codeData);
      setIsGenerated(true)
      setHtmlCode(codeData['index.html']);
      setCssCode(codeData['style.css']);
      setJsCode(codeData['script.js']);
      setActiveTab('preview');
    } catch (error) {
      console.error('Error generating website:', error);
      alert('Failed to generate website. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`${showSidebar ? 'translate-x-0 w-64' : '-translate-x-full absolute md:relative md:translate-x-0'} 
            bg-gray-800/50 backdrop-blur-md transition-all duration-300 flex flex-col z-20 h-full
            ${!showSidebar ? 'hidden' : 'block'}`}
        >
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <button 
              onClick={handleNewChat}
              className="flex items-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
            >
              <FiPlus /> New Chat
            </button>
            {/* {isMobile && (
              <button onClick={toggleSidebar} className="ml-2 p-2 rounded-lg hover:bg-gray-700/50">
                <FiX />
              </button>
            )} */}
          </div>
        </div>


        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="p-4 border-b border-gray-700 flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 mr-4 rounded-lg hover:bg-gray-700/50"
            >
              {showSidebar ? <FiX /> : <FiMenu />}
            </button>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              AI Website Generator
            </h1>
          </header>

          <div className="flex-1 overflow-hidden flex flex-col">

            {generatedCode ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-gray-800/20">
                <div className="border-b border-gray-700 overflow-x-auto">
                  <div className="flex min-w-max">
                    <button
                      className={`px-4 md:px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'preview' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => setActiveTab('preview')}
                    >
                      <FiGlobe /> Preview
                    </button>
                    <button
                      className={`px-4 md:px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'html' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => setActiveTab('html')}
                    >
                      <FiCode /> HTML
                    </button>
                    <button
                      className={`px-4 md:px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'css' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => setActiveTab('css')}
                    >
                      <FiCode /> CSS
                    </button>
                    <button
                      className={`px-4 md:px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'js' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => setActiveTab('js')}
                    >
                      <FiCode /> JavaScript
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className={`h-full ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
                    <iframe
                      ref={iframeRef}
                      title="Generated Website Preview"
                      className="w-full h-full border-0 bg-white"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>

                  <div className={`h-full ${activeTab === 'html' ? 'block' : 'hidden'}`}>
                    <Editor
                      height="100%"
                      defaultLanguage="html"
                      value={htmlCode}
                      onChange={(value) => setGeneratedCode((prev)=>{
                        return {...prev,"index.html":value}
                      })}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on'
                      }}
                    />
                  </div>

                  <div className={`h-full ${activeTab === 'css' ? 'block' : 'hidden'}`}>
                    <Editor
                      height="100%"
                      defaultLanguage="css"
                      value={cssCode}
                      onChange={(value) => setGeneratedCode((prev)=>{
                        return {...prev,"style.css":value}
                      })}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on'
                      }}
                    />
                  </div>

                  <div className={`h-full ${activeTab === 'js' ? 'block' : 'hidden'}`}>
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      value={jsCode}
                     onChange={(value) => setGeneratedCode((prev)=>{
                        return {...prev,"script.js":value}
                      })}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on'
                      }}
                    />
                  </div>
                </div>
                 <div className='flex items-center justify-between'>
                 <div className="flex flex-wrap gap-2 mt-4">
                  <button 
                    className="btn bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white flex items-center gap-2"
                    onClick={handleZip}
                  >
                    <FiDownload /> Download
                  </button>
                  <Link 
                    to="/user/portfolio" 
                    state={generatedCode}
                    className="btn btn-outline border-gray-600 text-white flex items-center gap-2"
                  >
                    <FiExternalLink /> Fullscreen
                  </Link>
                </div>
              <div className='flex justify-center'>
  <div className="bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl p-2 shadow-2xl mx-4 mt-2">
    <div className="flex items-center gap-3 justify-center">
      <div className="flex-shrink-0 p-2 rounded-lg bg-rose-500/20 text-rose-400">
        <FiAlertTriangle size={20} />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-white">Not satisfied with the result?</h3>
        <p className="text-sm text-gray-300 mt-1">You can edit code in real time like an IDE or give a new prompt to update the website.</p>
      </div>
    </div>
   
  </div>
</div>
</div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 md:p-6">
                <div className="text-center max-w-lg">
                  <FiGlobe size={48} className="mx-auto mb-4 text-cyan-400" />
                  <h2 className="text-2xl font-bold mb-2">Generate Your Website</h2>
                  <p className="text-gray-400 mb-6">
                    Describe the website you want to create in the prompt above. 
                    Our AI will generate the complete code including HTML, CSS, and JavaScript.
                  </p>
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 text-left">
                    <h3 className="font-medium mb-2">Example prompts:</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>"Build a Tic Tac Toe Game"</li>
                      <li>"Build an e-commerce product page with add to cart button"</li>
                      <li>"Build Sudoku Game"</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
    
            <div className="p-4 md:p-6 flex items-center justify-center">
              <div className="w-full max-w-3xl">
                <div className="relative">
                  <textarea
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl py-4 px-6 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none"
                    placeholder="Describe the website you want to generate (e.g., 'Create a portfolio website for a photographer with dark mode')"
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <button
                    className={`absolute right-4 bottom-4 p-2 rounded-lg ${loading ? 'bg-gray-600' : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:shadow-lg hover:shadow-cyan-400/20'} transition-all ${isGenerated ? 'hidden' : 'block'}`}
                    onClick={handleGenerate}
                    disabled={loading}
                    
                  >
                    {loading ? 'Generating...' : 'Generate'}
                  </button>
                  <button
                    className={`absolute right-4 bottom-4 p-2 rounded-lg ${loading ? 'bg-gray-600' : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:shadow-lg hover:shadow-cyan-400/20'} transition-all ${isGenerated ? 'block' : 'hidden'}`}
                    onClick={handleGenerate}
                    disabled={loading}
                    
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteGenerator;