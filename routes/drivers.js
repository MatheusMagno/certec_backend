import express from 'express';
import { supabase } from '../supabaseConnection.js';

const router = express.Router();

export default (pool) => {
  // Listar motoristas
  router.get('/', async (req, res) => {
  const { name } = req.query;

  try {
    if (name) {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .ilike('name', `%${name.trim().toLowerCase()}%`);

      if (error) {
        console.error('Erro ao buscar motorista:', error);
        return res.status(500).json({ error: 'Erro ao buscar motorista', details: error.message });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Nenhum motorista encontrado' });
      }

      return res.status(200).json(data);
    }
    
    // Busca geral
    const { data, error } = await supabase
      .from('drivers')
      .select('*');

    if (error) {
      console.error('Erro ao buscar motoristas:', error);
      return res.status(500).json({ error: 'Erro ao buscar motoristas', details: error.message });
    }

    res.status(200).json(data);
  }
  catch (err) {
    console.error('Erro ao buscar motoristas:', err);
    res.status(500).json({ error: 'Erro ao buscar motoristas', details: err.message });
  }
});

  // Cadastrar motorista
  router.post('/', async (req, res) => {
    const { name, cnh, validade_cnh, enterprise } = req.body;
    if (!name || !cnh || !validade_cnh || !enterprise) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert([{ name, cnh, validade_cnh, enterprise }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao cadastrar motorista:', error);
        return res.status(500).json({ error: 'Erro ao cadastrar motorista', details: error.message });
      }

      res.status(201).json(data);
    }catch (err) {
    console.error('Erro ao cadastrar motorista:', err);
    res.status(500).json({ error: 'Erro ao cadastrar motorista', details: err.message });
  }
  });

  // Deletar motorista
 router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const { data, error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao deletar motorista:', error);
      return res.status(500).json({ error: 'Erro ao deletar motorista', details: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    res.status(200).json({ message: 'Motorista deletado com sucesso', deleted: data[0] });
  } catch (err) {
    console.error('Erro ao deletar motorista:', err);
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
    const { data, error } = await supabase
      .from('drivers')
      .update({
        name: name,
        cnh: cnh,
        validade_cnh: validade_cnh,
        enterprise: enterprise
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao editar motorista:', error);
      return res.status(500).json({ error: 'Erro ao editar motorista', details: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao editar motorista:', err);
    res.status(500).json({ error: 'Erro ao editar motorista', details: err.message });
  }
});

  return router;
};