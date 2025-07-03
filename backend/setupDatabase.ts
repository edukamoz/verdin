import pool from './src/config/db';

const setup = async () => {
  try {
    // Tabela de Usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabela de Transações com Chave Estrangeira
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        type VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `);
    console.log('Tabelas "users" e "transactions" do Verdin criadas com sucesso!');
  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  } finally {
    pool.end();
  }
};

setup();