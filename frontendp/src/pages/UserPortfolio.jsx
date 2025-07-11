import { useLocation, useParams } from "react-router";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState } from "react";
import { FiCode,FiAlertTriangle,FiDownload } from "react-icons/fi";
import { Editor } from "@monaco-editor/react";

function UserPortfolio() {

   const {state} = useLocation()
   console.log(state)
   const [code,setCode] = useState(state)
   const [activeTab,setActiveTab] = useState('html')

   const handleZip = () => {
       
       const zip = new JSZip();
   
       zip.file("index.html", `<!DOCTYPE html>
     <html>
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link rel="stylesheet" href="style.css">
       </head>
      <body>
        ${code['index.html']}
        <script src="script.js"></script>
      </body>
    </html>`);
       zip.file("style.css", code['style.css']);
       zip.file("script.js", code['script.js']);
   
       zip.generateAsync({type:"blob"}).then(function(content) {
           // see FileSaver.js
           saveAs(content, "portfolio.zip");
       });
   
     }
    return (
  state ? (
    <div className="card bg-base-100 shadow-xl mt-8 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4 text-white">Your Website Preview</h2>
        <div className="border rounded-lg overflow-hidden">
          <iframe
            title="Portfolio Preview"
            srcDoc={`<!DOCTYPE html>
              <html>
                <head>
                  <style>${code['style.css']}</style>
                </head>
                <body>
                  ${code['index.html']}
                  <script>${code['script.js']}</script>
                </body>
              </html>`}
            className="w-full h-[500px] border-0"
          />
        </div>
        <div className="flex gap-2 mt-4">
        </div>
        <div className="flex gap-2 mt-4 justify-evenly items-center">
              <button 
              className="btn bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white flex items-center gap-2"
              onClick={handleZip}
            >
              <FiDownload /> Download
            </button>
              <div className="flex ml-6 bg-amber-400  text-gray-900 p-4 rounded-2xl gap-2 items-center font-bold text-xl">
                <FiAlertTriangle className="text-gray-900"/> Before Exiting This Page Ensure You have downloaded The zip else you will lose the website
              </div>
            </div>
      </div>
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
                      value={code['index.html'] }
                      onChange={(value) => setCode((prev)=>{
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
                      value={code["style.css"]}
                      onChange={(value) => setCode((prev)=>{
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
                      value={code["script.js"]}
                     onChange={(value) => setCode((prev)=>{
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
    </div>
  ) : (
    <div className="min-h-screen flex justify-center items-center">No Portfolio exists</div>
  )

);


}

export default UserPortfolio