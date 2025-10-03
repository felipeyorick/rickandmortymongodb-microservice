const cors = require("cors");
const express = require('express');
const axios = require('axios');
const connectDB = require('./db');
const Character = require('./character');
require('dotenv').config();
const client = require('prom-client');  // 👈 import prom-client
 
const uri_api = "https://rickandmortyapi.com/api/character";
const app = express();
app.use(cors({
  origin: "http://localhost:3000",   // frontend local
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
 
const port = process.env.PORT;
 
// 📊 Registro global de métricas
const register = new client.Registry();
client.collectDefaultMetrics({ register });
 
// ✅ Métricas personalizadas
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Número total de requests HTTP',
  labelNames: ['method', 'route', 'status']
});
register.registerMetric(httpRequestCounter);
 
// Middleware para contar requests
app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

connectDB();
 
app.get('/migrate', async (req, res) => {
  try {
    const response = await axios.get(uri_api);
    const characters = response.data.results;
 
    await Character.deleteMany({});
    await Character.insertMany(characters);
 
    res.send(`✅ Se migraron ${characters.length} personajes a MongoDB`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al migrar los datos");
  }
});
 
app.get('/characters', async (req, res) => {
  try {
    const chars = await Character.find();
    res.json(chars);
  } catch (error) {
    res.status(500).send("Error al obtener personajes");
  }
});
 
// 📊 Endpoint de métricas para Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
 
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
 
 