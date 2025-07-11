import axios from "axios";
import crypto from "crypto";

const deployWithNetlify = async (req, res) => {
  const { html, css, js } = req.body;

  try {
    const files = {
      "index.html": html,
      "style.css": css,
      "script.js": js,
    };

    const preparedFiles = {};
    const fileContentMap = {};


    for (const [filename, content] of Object.entries(files)) {
      const buffer = Buffer.from(content, "utf-8");
      const sha = crypto.createHash("sha1").update(buffer).digest("hex");

      preparedFiles[`/${filename}`] = sha;
      fileContentMap[sha] = buffer;
    }

    const siteRes = await axios.post(
      "https://api.netlify.com/api/v1/sites",
      {},
      {
        headers: {
          Authorization: `Bearer nfp_6FGyLfpT3FQf76vft2qxK5PWJt9iKWNd789c`,
        },
      }
    );

    const siteId = siteRes.data.id;

    const deployRes = await axios.post(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
      { files: preparedFiles },
      {
        headers: {
          Authorization: `Bearer nfp_6FGyLfpT3FQf76vft2qxK5PWJt9iKWNd789c`,
        },
      }
    );

    const deployId = deployRes.data.id;

  //  console.log("Hello")

    const requiredFiles = deployRes.data.required;
    for (const sha of requiredFiles) {
      const content = fileContentMap[sha];
      await axios.put(
        `https://api.netlify.com/api/v1/deploys/${deployId}/files/${sha}`,
        content,
        {
          headers: {
            "Authorization": `Bearer nfp_6FGyLfpT3FQf76vft2qxK5PWJt9iKWNd789c`,
            "Content-Type": "application/octet-stream",
          },
        }
      );
    }

    res.json({
      url: deployRes.data.deploy_ssl_url || deployRes.data.deploy_url,
    });

  } 
  catch (err) {
    console.error("Deploy error:", err.response?.data || err.message);
    res.status(500).json({ error: "Deployment failed" });
  }
};

export default deployWithNetlify;

