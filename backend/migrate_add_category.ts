// Conteúdo LIMPO de backend/migrate_add_category.ts
import pool from "./src/config/db";

const migrate = async () => {
  console.log('Iniciando migração: adicionando a coluna "category"...');
  try {
    await pool.query(`
      ALTER TABLE transactions
      ADD COLUMN IF NOT EXISTS category VARCHAR(50);
    `);
    console.log(
      'Migração concluída com sucesso! Coluna "category" adicionada.'
    );
  } catch (err) {
    console.error("Erro durante a migração:", err);
  } finally {
    pool.end();
  }
};

migrate();
