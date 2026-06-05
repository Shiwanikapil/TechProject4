const express = require('express');
const cors = require('cors');
const authRoutes = require('./routers/authRouters');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Auth server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server started on http://localhost:${PORT}`);
});
