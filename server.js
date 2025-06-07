const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    return res.json({ success: true, message: 'Login successful' });
  } else {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
