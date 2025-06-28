require('dotenv').config()
const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 5001

const app = express()

const { authenticateProjectJWT } = require('./services/jwtAuth');

const proxyRoutes = require('./routes/index');
const basketTrainer = require('./routes/basketTrainer');
const easyMail = require('./routes/easyMail');


app.use(cors())

app.use(express.json());

app.use('/api', proxyRoutes);
app.use('/basketTrainer', basketTrainer);
app.use('/easyMail', easyMail);


app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`))