import { useLocation, useParams } from "react-router";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState } from "react";
import { FiCode, FiAlertTriangle, FiDownload } from "react-icons/fi";
import { Editor } from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";
import { GrDeploy } from "react-icons/gr";

function UserPortfolio() {
  const { state } = useLocation();
  console.log(state);
  const [code, setCode] = useState(state);
  const [activeTab, setActiveTab] = useState("html");
  const [isDeploying, setIsDeploying] = useState(false);

  const handleZip = () => {
    const zip = new JSZip();

    zip.file(
      "index.html",
      `<!DOCTYPE html>
     <html>
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link rel="stylesheet" href="style.css">
       </head>
      <body>
        ${code["index.html"]}
        <script src="script.js"></script>
      </body>
    </html>`
    );
    zip.file("style.css", code["style.css"]);
    zip.file("script.js", code["script.js"]);

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "portfolio.zip");
    });
  };

  const handleDeploy = async () => {
    try {
      setIsDeploying(true);
      const res = await axiosClient.post("/deploy/netlify", {
        html: `<!DOCTYPE html>
     <html>
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link rel="stylesheet" href="style.css">
       </head>
      <body>
        ${code["index.html"]}
        <script src="script.js"></script>
      </body>
    </html>`,
        css: code["style.css"],
        js: code["script.js"],
      });

      alert("Site Deployed at: " + res.data.url);
    } catch (err) {
      alert("Error:", err);
      setIsDeploying(false);
    } finally {
      setIsDeploying(false);
    }
  };

  return state ? (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with title and action buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Your Website Preview</h2>
          <div className="flex gap-4">
            <button
              className="btn bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white flex items-center gap-2 hover:scale-105 transition-transform"
              onClick={handleZip}
            >
              <FiDownload /> Download
            </button>
            <button
              className="btn bg-gradient-to-r from-indigo-500 to-indigo-600 border-none text-white flex items-center gap-2 hover:scale-105 transition-transform"
              onClick={handleDeploy}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <GrDeploy /> Deploy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Warning banner */}
        <div className="bg-yellow-500/20 border-l-4 border-yellow-500 text-yellow-100 p-4 rounded-lg mb-6 flex items-center gap-3">
          <FiAlertTriangle className="text-xl flex-shrink-0" />
          <p>
            Before exiting this page, ensure you have downloaded the zip file or
            deployed your site, or you will lose your work.
          </p>
        </div>

        {/* Preview section */}
        <div className="card bg-base-100 shadow-xl mb-6  backdrop-blur-sm border border-gray-700">
          <div className="card-body p-0">
            <div className="border rounded-lg overflow-hidden">
              <iframe
                title="Portfolio Preview"
                srcDoc={`<!DOCTYPE html>
                  <html>
                    <head>
                      <style>${code["style.css"]}</style>
                    </head>
                    <body>
                      ${code["index.html"]}
                      <script>${code["script.js"]}</script>
                    </body>
                  </html>`}
                className="w-full h-[500px] border-0"
              />
            </div>
          </div>
        </div>

        {/* Code editor section */}
        <div className="card bg-base-100 shadow-xl  backdrop-blur-sm border border-gray-700">
          <div className="card-body p-0">
           
<div className="tabs bg-gray-700 rounded-t-lg p-2">
  <button
    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
      activeTab === "html"
        ? "bg-cyan-600 text-white shadow-lg"
        : "text-gray-300 hover:text-white hover:bg-gray-600"
    }`}
    onClick={() => setActiveTab("html")}
  >
    <FiCode /> index.html
  </button>
  <button
    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
      activeTab === "css"
        ? "bg-cyan-600 text-white shadow-lg"
        : "text-gray-300 hover:text-white hover:bg-gray-600"
    }`}
    onClick={() => setActiveTab("css")}
  >
    <FiCode /> style.css
  </button>
  <button
    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
      activeTab === "javascript"
        ? "bg-cyan-600 text-white shadow-lg"
        : "text-gray-300 hover:text-white hover:bg-gray-600"
    }`}
    onClick={() => setActiveTab("javascript")}
  >
    <FiCode /> script.js
  </button>
</div>

            <div className="border-t-0 border-gray-700 rounded-b-lg overflow-hidden">
              <div className={`${activeTab === "html" ? "block" : "hidden"}`}>
                <Editor
                  height="500px"
                  defaultLanguage="html"
                  value={code["index.html"]}
                  onChange={(value) =>
                    setCode((prev) => {
                      return { ...prev, "index.html": value };
                    })
                  }
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                  }}
                />
              </div>

              <div className={` ${activeTab === "css" ? "block" : "hidden"}`}>
                <Editor
                  height="500px"
                  defaultLanguage="css"
                  value={code["style.css"]}
                  onChange={(value) =>
                    setCode((prev) => {
                      return { ...prev, "style.css": value };
                    })
                  }
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                  }}
                />
              </div>

              <div
                className={`${activeTab === "javascript" ? "block" : "hidden"}`}
              >
                <Editor
                  height="500px"
                  defaultLanguage="javascript"
                  value={code["script.js"]}
                  onChange={(value) =>
                    setCode((prev) => {
                      return { ...prev, "script.js": value };
                    })
                  }
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4">No Portfolio Found</h2>
        <p className="text-gray-300">
          It seems there's no portfolio to display. Please create one first.
        </p>
      </div>
    </div>
  );
}

export default UserPortfolio;