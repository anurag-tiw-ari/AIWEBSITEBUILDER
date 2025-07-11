import { useState, useRef, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { Link, useNavigate } from 'react-router';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GrDeploy } from "react-icons/gr";
import { FiUser, FiBook, FiCode, FiBriefcase, FiDownload, FiExternalLink, FiArrowLeft, FiArrowRight,FiAlertTriangle } from 'react-icons/fi';

const FormPrompt = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    photo: null,
    email: '',
    overview: '',
    education: '',
    skills: '',
    projects: '',
    experience: '',
    socialLinks: '',
    footer: ''
  });
  const [userPrompt, setUserPrompt] = useState('');
  const [portfolio, setPortfolio] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const resultsRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (portfolio && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [portfolio]);

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
        ${portfolio['index.html']}
        <script src="script.js"></script>
      </body>
    </html>` );
    zip.file("style.css", portfolio['style.css']);
    zip.file("script.js", portfolio['script.js']);

    zip.generateAsync({type:"blob"}).then(function(content) {
      saveAs(content, "portfolio.zip");
    });
  };

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const { data } = await axiosClient.get('/photo/signature');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', data.api_key);
      formData.append('timestamp', data.timestamp);
      formData.append('public_id', data.public_id);
      formData.append('signature', data.signature);
      
      const uploadRes = await axios.post(data.upload_url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData(prev => ({
        ...prev,
        photo: uploadRes.data.secure_url
      }));
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeploy = async () => {
    try{
      setIsDeploying(true)
  const res = await axiosClient.post("/deploy/netlify", {
    
      html: `<!DOCTYPE html>
     <html>
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link rel="stylesheet" href="style.css">
       </head>
      <body>
        ${portfolio['index.html']}
        <script src="script.js"></script>
      </body>
    </html>`,
      css: portfolio['style.css'],
      js: portfolio['script.js'],
  });


  alert("Site Deployed at: " + res.data.url);
}
catch(err)
{
  alert("Error:",err)
  setIsDeploying(false)
}
finally{
    setIsDeploying(false)
}
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userPrompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    
    setIsGenerating(true);
    
    try {
       const newUserMessage = {
        role: 'user',
        parts: [{text:userPrompt}]
      }
      
      setMessages(prev => [...prev, newUserMessage]);
      
      const response = await axiosClient.post('/user/prompt', {
        messages: [...messages, newUserMessage],
        formData
      });
      
      let cleanedData = response.data.replace(/^```json/, '').replace(/```$/, '').trim();
      cleanedData = JSON.parse(cleanedData);
      
        const aiResponse = {
        role: 'model',
        parts: [{text:JSON.stringify(cleanedData)}]
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setPortfolio(cleanedData);
      setUserPrompt(''); 
      
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate portfolio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (step === 3) return;
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step === 1) {
      const confirmExit = window.confirm("Are you sure you want to exit? All your progress will be lost.");
      if (confirmExit) navigate('/');
    } else {
      setStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <FiUser className="text-cyan-400" /> Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white/80">Your Name*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white/80">Email*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white/80">Profile Photo</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                  accept="image/*"
                  disabled={uploading}
                  className="file-input file-input-bordered w-full max-w-xs bg-gray-800 border-gray-700 text-white"
                />
                {uploading && <span className="loading loading-spinner text-white"></span>}
              </div>
              {formData.photo && (
                <div className="mt-4">
                  <div className="avatar">
                    <div className="w-24 rounded-xl ring-2 ring-cyan-500">
                      <img src={formData.photo} alt="Preview" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <FiBook className="text-cyan-400" /> Professional Details
            </h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white/80">Professional Overview</span>
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                className="textarea textarea-bordered h-24 bg-gray-800 border-gray-700 text-white"
                placeholder="Brief description about yourself and your skills"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white/80">Education</span>
                </label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-32 bg-gray-800 border-gray-700 text-white"
                  placeholder="Your educational background"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white/80">Skills (comma separated)</span>
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800 border-gray-700 text-white"
                  placeholder="HTML, CSS, JavaScript, etc."
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <FiBriefcase className="text-cyan-400" /> Experience & Projects
            </h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white/80">Work Experience</span>
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="textarea textarea-bordered h-32 bg-gray-800 border-gray-700 text-white"
                placeholder="Your work history and responsibilities"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white/80">Projects</span>
              </label>
              <textarea
                name="projects"
                value={formData.projects}
                onChange={handleChange}
                className="textarea textarea-bordered h-24 bg-gray-800 border-gray-700 text-white"
                placeholder="Projects you've worked on"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white/80">Social Links (comma separated)</span>
                </label>
                <input
                  type="text"
                  name="socialLinks"
                  value={formData.socialLinks}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800 border-gray-700 text-white"
                  placeholder="LinkedIn, GitHub, etc."
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-white/80">Footer Information</span>
                </label>
                <input
                  type="text"
                  name="footer"
                  value={formData.footer}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-800 border-gray-700 text-white"
                  placeholder="Contact info or copyright text"
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white/80">Your Prompt*</span>
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="textarea textarea-bordered h-24 bg-gray-800 border-gray-700 text-white"
                placeholder="Describe what you want in your portfolio..."
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCodeTab = () => {
    if (!portfolio) return null;

//     const codeContent = {
//       html: `<!DOCTYPE html>
// <html>
//   <head>
//   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
//     <link rel="stylesheet" href="style.css">
//   </head>
//   <body>
//     ${portfolio['index.html']}
//     <script src="script.js"></script>
//   </body>
// </html>` || '',
//       css: portfolio['style.css'] || '',
//       javascript: portfolio['script.js'] || ''
//     };

    return (
      <div className="mt-6">
        <div className="tabs tabs-boxed bg-gray-800">
          <button 
            className={`tab flex items-center gap-2 text-white ${activeTab === 'html' ? 'tab-active bg-cyan-600 text-white' : 'text-white'}`}
            onClick={() => setActiveTab('html')}
          >
            <FiCode /> index.html
          </button>
          <button 
            className={`tab flex items-center gap-2 text-white ${activeTab === 'css' ? 'tab-active bg-cyan-600 text-white' : 'text-white'}`}
            onClick={() => setActiveTab('css')}
          >
            <FiCode /> style.css
          </button>
          <button 
            className={`tab flex items-center gap-2 text-white ${activeTab === 'javascript' ? 'tab-active bg-cyan-600 text-white' : 'text-white'}`}
            onClick={() => setActiveTab('javascript')}
          >
            <FiCode /> script.js
          </button>
        </div>
        
        <div className="border border-gray-700 rounded-b-lg overflow-hidden">
                 <div className={`${activeTab === 'html' ? 'block' : 'hidden'}`}>
                    <Editor
                      height="500px"
                      defaultLanguage="html"
                      value={portfolio['index.html'] }
                      onChange={(value) => setPortfolio((prev)=>{
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

                  <div className={` ${activeTab === 'css' ? 'block' : 'hidden'}`}>
                    <Editor
                      height="500px"
                      defaultLanguage="css"
                      value={portfolio["style.css"]}
                      onChange={(value) => setPortfolio((prev)=>{
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

                  <div className={`${activeTab === 'javascript' ? 'block' : 'hidden'}`}>
                    <Editor
                      height="500px"
                      defaultLanguage="javascript"
                      value={portfolio["script.js"]}
                     onChange={(value) => setPortfolio((prev)=>{
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      <div className="container mx-auto p-4 lg:p-8 max-w-6xl">

        <div className="steps steps-horizontal w-full mb-8">
          <div className={`step ${step >= 1 ? 'step-primary' : ''}`}>
            <div className="step-circle text-white">
              {step > 1 ? '✓' : '1'}
            </div>
            <div className="step-title text-white/80">Basic Info</div>
          </div>
          <div className={`step ${step >= 2 ? 'step-primary' : ''}`}>
            <div className="step-circle text-white">
              {step > 2 ? '✓' : '2'}
            </div>
            <div className="step-title text-white/80">Details</div>
          </div>
          <div className={`step ${step >= 3 ? 'step-primary' : ''}`}>
            <div className="step-circle text-white">3</div>
            <div className="step-title text-white/80">Generate</div>
          </div>
        </div>

 
        <div className="card bg-gray-800/50 backdrop-blur-md border border-gray-700 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-6 text-white">Create Your Portfolio</h1>
            
            <form onSubmit={handleSubmit}>
              {renderStep()}
              
              <div className="flex justify-between mt-8">
                <button 
                  type="button" 
                  onClick={prevStep} 
                  className="btn btn-outline border-gray-600 hover:border-cyan-400 hover:bg-gray-700/50 text-white flex items-center gap-2"
                >
                  <FiArrowLeft /> {step === 1 ? 'Cancel' : 'Back'}
                </button>
                
                {step < 3 ? (
                  <button 
                    type="button" 
                    onClick={nextStep} 
                    className="btn bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white ml-auto flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    Next <FiArrowRight />
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="btn bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white ml-auto flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Portfolio <FiArrowRight />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {portfolio && (
          <div 
            ref={resultsRef}
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in"
          >
            {/* Preview Panel */}
            <div className="card bg-gray-800/50 backdrop-blur-md border border-gray-700 shadow-xl h-fit">
              <div className="card-body">
                <h2 className="card-title text-xl text-white mb-4">Live Preview</h2>
                <div className="border-2 border-gray-700 rounded-lg overflow-hidden bg-white h-[400px]">
                  <iframe
                    title="Portfolio Preview"
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>${portfolio['style.css']}</style>
                          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                        </head>
                        <body>
                          ${portfolio['index.html']}
                          <script>${portfolio['script.js']}</script>
                        </body>
                      </html>
                    `}
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button 
                    className="btn bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white flex items-center gap-2"
                    onClick={handleZip}
                  >
                    <FiDownload /> Download
                  </button>
                   <button 
                    className="btn bg-gradient-to-r from-indigo-500 to-indigo-600 border-none text-white flex items-center gap-2"
                    onClick={handleDeploy}
                  >
                   {isDeploying ? "Deploying..." : (<><GrDeploy /> Deploy</>)}

                  </button>
                  <Link 
                    to="/user/portfolio" 
                    state={portfolio}
                    className="btn btn-outline border-gray-600 text-white flex items-center gap-2"
                  >
                    <FiExternalLink /> Fullscreen
                  </Link>
                </div>
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

            <div className="card bg-gray-800/50 backdrop-blur-md border border-gray-700 shadow-xl h-fit">
              <div className="card-body">
                <h3 className="card-title text-xl text-white mb-4">Generated Code</h3>
                {renderCodeTab()}
              </div>
            </div>
              
          </div>
          
        )}
      </div>
    </div>
  );
};

export default FormPrompt;