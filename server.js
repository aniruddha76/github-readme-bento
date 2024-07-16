import express from 'express';
import axios from 'axios';
import createSVG  from './index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Please add /stats/username to the URL to get GitHub stats.');
});

app.get('/stats/:username', async (req, res) => {
    const { username } = req.params;
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`)
      const data = await response.data;
  
      const svg = await createSVG(data);
  
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    } catch (error) {
      console.error('Error fetching data from GitHub:', error.response ? error.response.status : error.message);
      res.status(500).send('Error fetching data from GitHub');
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
