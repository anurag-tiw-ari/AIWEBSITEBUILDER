import { useLocation, useParams } from "react-router";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function UserPortfolio() {

   const {state} = useLocation()
   console.log(state)
   const handleZip = () => {
       
       const zip = new JSZip();
   
       zip.file("index.html", state['index.html']);
       zip.file("style.css", state['style.css']);
       zip.file("script.js", state['script.js']);
   
       zip.generateAsync({type:"blob"}).then(function(content) {
           // see FileSaver.js
           saveAs(content, "portfolio.zip");
       });
   
     }
    return (
  state ? (
    <div className="card bg-base-100 shadow-xl mt-8">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Your Portfolio Preview</h2>
        <div className="border rounded-lg overflow-hidden">
          <iframe
            title="Portfolio Preview"
            srcDoc={`<!DOCTYPE html>
              <html>
                <head>
                  <style>${state['style.css']}</style>
                </head>
                <body>
                  ${state['index.html']}
                  <script>${state['script.js']}</script>
                </body>
              </html>`}
            className="w-full h-[500px] border-0"
          />
        </div>
        <div className="flex gap-2 mt-4">
        </div>
        <div className="flex gap-2 mt-4">
              <button className="btn btn-primary" onClick={handleZip}>Download as ZIP</button>
            </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex justify-center items-center">No Portfolio exists</div>
  )

);


}

export default UserPortfolio