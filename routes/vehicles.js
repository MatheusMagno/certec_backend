import express from 'express';
import {supabase} from '../supabaseConnection.js';

const router = express.Router();

export default (pool) => {
  // Listar veículos
  router.get('/', async (req, res) => {
    const { placa } = req.query;

    try {
      if (placa) {
        const {data, error} = await supabase
          .from('vehicles')
          .select('*')
          .ilike('placa', `%${placa.trim().toLowerCase()}%`);

        if (error) {
          console.error('Erro ao buscar veículo:', error);
          return res.status(500).json({ error: 'Erro ao buscar veículo', details: error.message });
        }

        if (!data || data.length === 0) {
          return res.status(404).json({ error: 'Nenhum veículo encontrado' });
        }

        return res.status(200).json(data);
      }
      
      const { data, error } = await supabase
      .from('vehicles')
      .select('*');

    if (error) {
      console.error('Erro ao buscar veículo:', error);
      return res.status(500).json({ error: 'Erro ao buscar veículo', details: error.message });
    }

    res.status(200).json(data);
    } catch (err) {
      console.error('Erro ao buscar veículos:', err);
      res.status(500).json({ error: 'Erro ao buscar veículos', details: err.message });
    }
    try {
      const {data, error} = await supabase
      .from('vehicles')
      .select('*');
      
      if (error) {
        console.error('Erro ao buscar veículos:', error);
        return res.status(500).json({ error: 'Erro ao buscar veículos', details: error.message });
      }
      res.status(200).json(data);
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
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{ placa, modelo, tipo_do_combustivel, km_atual }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao cadastrar veículo:', error);
        return res.status(500).json({ error: 'Erro ao cadastrar veículo', details: error.message });
      }

      res.status(201).json(data);
    } catch (err) {
      console.error('Erro ao cadastrar veículo:', err);
      res.status(500).json({ error: 'Erro ao cadastrar veículo', details: err.message });
    }
  });

  // Deletar veiculo
  router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const {data, error} = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Erro ao deletar veículo:', error);
        return res.status(500).json({ error: 'Erro ao deletar veículo', details: error.message });
      }
      if (!data) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }
      res.status(200).json({ message: 'Veículo deletado com sucesso', data });
    } catch (err) {
      console.error('Erro ao deletar veículo:', err);
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
      const { data, error } = await supabase
        .from('vehicles')
        .update({ placa, modelo, tipo_do_combustivel, km_atual })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao editar veículo:', error);
        return res.status(500).json({ error: 'Erro ao editar veículo', details: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      res.status(200).json(data);
    } catch (err) {
      console.error('Erro ao editar veículo:', err);
      res.status(500).json({ error: 'Erro ao editar veículo', details: err.message });
    }
  });

  return router;
};