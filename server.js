const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const GOOGLE_API_KEY = "AIzaSyAHxOOUf63Um8bXXDc7XjH7w1lsdc7q7n8";
const SEARCH_ENGINE_ID = "9003f5de8fc0a480f";

app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return res.json(data.items.map(item => ({
        title: item.title,
        description: item.snippet,
        link: item.link
      })));
    } else {
      return res.json([]);
    }
  } catch {
    return res.json([]);
  }
});

app.listen(3000, () => {
  console.log("Inquizo backend running at http://localhost:3000");
});
