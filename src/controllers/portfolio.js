import main from "./generatePortfolio.js";

const promptToPortfolio = async (req, res) => {
    try {

       // let portfolio = null

        console.log(req.body);

        const userPrompt = req.body;

         console.log("userPrompt:", userPrompt);

      const portfolio = await main(userPrompt);

        res.status(200).send(portfolio);
    } catch (error) {
        console.error("Error in promptToPortfolio:", error);
        res.status(500).send("Something went wrong while building the portfolio.");
    }
};


export {promptToPortfolio};

// profilePic,name,email,location,linkedin,github,skills,projects,overview