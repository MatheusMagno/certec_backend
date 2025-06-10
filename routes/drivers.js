import express from 'express';
import { supabase } from '../supabaseConnection.js';

const router = express.Router();

export default (pool) => {
  // Listar motoristas
  router.get('/', async (req, res) => {
  //const { name } = req.query;

  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*');

    if (error) {
      console.error('Erro ao buscar motoristas:', error);
      return res.status(500).json({ error: 'Erro ao buscar motoristas', details: error.message });
    }

    res.json(data);
  }
  catch (err) {
    console.error('Erro ao buscar motoristas:', err);
    res.status(500).json({ error: 'Erro ao buscar motoristas', details: err.message });
  }
  });
  /*
  try {
    if (name) {
      const result = await pool.query(
        'SELECT * FROM drivers WHERE TRIM(LOWER(name)) = TRIM(LOWER($1))',
        [name]
      );
      return res.json(result.rows);
    }
    const result = await pool.query('SELECT * FROM drivers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar motoristas', details: err.message });
  }
  */
 


  // Cadastrar motorista
  router.post('/', async (req, res) => {
    const { name, cnh, validade_cnh, enterprise } = req.body;
    if (!name || !cnh || !validade_cnh || !enterprise) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    try {
      const result = await pool.query(
        'INSERT INTO drivers (name, cnh, validade_cnh, enterprise) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, cnh, validade_cnh, enterprise]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao cadastrar motorista', details: err.message });
    }
  });

  // Deletar motorista
  router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const result = await pool.query('DELETE FROM drivers WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Motorista não encontrado' });
      }
      res.status(200).json({ message: 'Motorista deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar motorista', details: err.message });
    }
  });

  // Editar motorista
  router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, cnh, validade_cnh, enterprise } = req.body;
    if (!name || !cnh || !validade_cnh || !enterprise) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    try {
      const result = await pool.query(
        'UPDATE drivers SET name = $1, cnh = $2, validade_cnh = $3, enterprise = $4 WHERE id = $5 RETURNING *',
        [name, cnh, validade_cnh, enterprise, id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Motorista não encontrado' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao editar motorista', details: err.message });
    }
  });

  return router;
};