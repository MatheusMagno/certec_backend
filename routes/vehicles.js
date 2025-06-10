import express from 'express';
import { supabase } from '../supabaseConnection';

const router = express.Router();

export default (pool) => {
  // Listar veículos
  router.get('/', async (req, res) => {
    try {
      const {data, error} = await supabase
      .from('vehicles')
      .select('*');
      
      if (error) {
        console.error('Erro ao buscar veículos:', error);
        return res.status(500).json({ error: 'Erro ao buscar veículos', details: error.message });
      }
      res.json(data);
    } catch (err) {
      console.error('Erro ao buscar Veículo:', err);
      res.status(500).json({ error: 'Erro ao buscar veículos', details: err.message });
    }
  });

  // Cadastrar veiculo
  router.post('/', async (req, res) => {
    const { placa, modelo, tipo_do_combustivel, km_atual } = req.body;
    if (!placa || !modelo || !tipo_do_combustivel || !km_atual) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    try {
      const result = await pool.query(
        'INSERT INTO vehicles (placa, modelo, tipo_do_combustivel, km_atual) VALUES ($1, $2, $3, $4) RETURNING *',
        [placa, modelo, tipo_do_combustivel, km_atual]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao cadastrar veículo', details: err.message });
    }
  });

  // Deletar veiculo
  router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const result = await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'veículo não encontrado' });
      }
      res.status(200).json({ message: 'veículo deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar veículo', details: err.message });
    }
  });

  // Editar veiculo
  router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { placa, modelo, tipo_do_combustivel, km_atual } = req.body;
    if (!placa || !modelo || !tipo_do_combustivel || !km_atual) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    try {
      const result = await pool.query(
        'UPDATE vehicles SET placa = $1, modelo = $2, tipo_do_combustivel = $3, km_atual = $4 WHERE id = $5 RETURNING *',
        [placa, modelo, tipo_do_combustivel, km_atual, id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'veículo não encontrado' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao editar veículo', details: err.message });
    }
  });

  return router;
};