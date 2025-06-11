import express from 'express';
import {supabase} from '../supabaseConnection.js';

const router = express.Router();

export default (pool) => {
  // Listar todos os abastecimentos
  router.get('/', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('supplies')
        .select('*');

      if (error) {
        console.error('Erro ao buscar abastecimentos:', error);
        return res.status(500).json({ error: 'Erro ao buscar abastecimentos', details: error.message });
      }
      res.status(200).json(data);
    } catch (err) {
      console.error('Erro ao buscar abastecimentos:', err);
      res.status(500).json({ error: 'Erro ao buscar abastecimentos', details: err.message });
    }
  });

  // Cadastrar novo abastecimento
  router.post('/', async (req, res) => {
    const {
      placa,
      modelo,
      tipo_do_combustivel,
      km_atual,
      data_do_abastecimento,
      medidor_inicial,
      medidor_final,
      quantidade_de_litros,
      motorista,
      empresa_do_abastecimento
    } = req.body;

    if (
      !placa ||
      !modelo ||
      !tipo_do_combustivel ||
      !km_atual ||
      !data_do_abastecimento ||
      !medidor_inicial ||
      !medidor_final ||
      !quantidade_de_litros ||
      !motorista ||
      !empresa_do_abastecimento
    ) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
      const { data, error } = await supabase
        .from('supplies')
        .insert([{
          placa,
          modelo,
          tipo_do_combustivel,
          km_atual,
          data_do_abastecimento,
          medidor_inicial,
          medidor_final,
          quantidade_de_litros,
          motorista,
          empresa_do_abastecimento
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao cadastrar abastecimento:', error);
        return res.status(500).json({ error: 'Erro ao cadastrar abastecimento', details: error.message });
      }

      res.status(201).json(data); 
    } catch (err) {
      console.error('Erro ao cadastrar abastecimento:', err);
      res.status(500).json({ error: 'Erro ao cadastrar abastecimento', details: err.message });
    }
  });

  // Editar abastecimento
  router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const {
      placa,
      modelo,
      tipo_do_combustivel,
      km_atual,
      data_do_abastecimento,
      medidor_inicial,
      medidor_final,
      quantidade_de_litros,
      motorista,
      empresa_do_abastecimento
    } = req.body;

    if (
      !placa ||
      !modelo ||
      !tipo_do_combustivel ||
      !km_atual ||
      !data_do_abastecimento ||
      !medidor_inicial ||
      !medidor_final ||
      !quantidade_de_litros ||
      !motorista ||
      !empresa_do_abastecimento
    ) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
      const { data, error } = await supabase
        .from('supplies')
        .update({
          placa,
          modelo,
          tipo_do_combustivel,
          km_atual,
          data_do_abastecimento,
          medidor_inicial,
          medidor_final,
          quantidade_de_litros,
          motorista,
          empresa_do_abastecimento
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao editar abastecimento:', error);
        return res.status(500).json({ error: 'Erro ao editar abastecimento', details: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: 'Abastecimento não encontrado' });
      }

      res.status(200).json(data);
    } catch (err) {
      console.error('Erro ao editar abastecimento:', err);  
      res.status(500).json({ error: 'Erro ao editar abastecimento', details: err.message });
    }
  });

  // Deletar abastecimento
  router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const { data, error } = await supabase
        .from('supplies')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao deletar abastecimento:', error);
        return res.status(500).json({ error: 'Erro ao deletar abastecimento', details: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: 'Abastecimento não encontrado' });
      }

      res.status(200).json({ message: 'Abastecimento deletado com sucesso', deleted: data });
    } catch (err) {
      console.error('Erro ao deletar abastecimento:', err);
      res.status(500).json({ error: 'Erro ao deletar abastecimento', details: err.message });
    }
  });

  return router;
};