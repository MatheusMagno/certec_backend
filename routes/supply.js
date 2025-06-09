import express from 'express';

const router = express.Router();

export default (pool) => {
  // Listar todos os abastecimentos
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM supplies');
      res.json(result.rows);
    } catch (err) {
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
      const result = await pool.query(
        `INSERT INTO supplies 
        (placa, modelo, tipo_do_combustivel, km_atual, data_do_abastecimento, medidor_inicial, medidor_final, quantidade_de_litros, motorista, empresa_do_abastecimento)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [
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
        ]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
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
      const result = await pool.query(
        `UPDATE supplies SET
          placa = $1,
          modelo = $2,
          tipo_do_combustivel = $3,
          km_atual = $4,
          data_do_abastecimento = $5,
          medidor_inicial = $6,
          medidor_final = $7,
          quantidade_de_litros = $8,
          motorista = $9,
          empresa_do_abastecimento = $10
        WHERE id = $11 RETURNING *`,
        [
          placa,
          modelo,
          tipo_do_combustivel,
          km_atual,
          data_do_abastecimento,
          medidor_inicial,
          medidor_final,
          quantidade_de_litros,
          motorista,
          empresa_do_abastecimento,
          id
        ]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Abastecimento não encontrado' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao editar abastecimento', details: err.message });
    }
  });

  // Deletar abastecimento
  router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const result = await pool.query('DELETE FROM supplies WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Abastecimento não encontrado' });
      }
      res.status(200).json({ message: 'Abastecimento deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao deletar abastecimento', details: err.message });
    }
  });

  return router;
};