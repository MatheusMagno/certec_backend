import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

import { createClient } from '@supabase/supabase-js'

import driversRoutes from './routes/drivers.js';
import vehiclesRoutes from './routes/vehicles.js';
import suppliesRoutes from './routes/supply.js';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Teste de conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao PostgreSQL:', err.stack);
  }
  console.log('Conectado ao PostgreSQL!');
  release();
});

app.use('/drivers', driversRoutes(pool));
app.use('/vehicles', vehiclesRoutes(pool));
app.use('/supplies', suppliesRoutes(pool));

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));



