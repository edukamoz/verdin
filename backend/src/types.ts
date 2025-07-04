export interface Transaction {
  id?: number;
  user_id?: number;
  description: string;
  // Mantemos amount como string aqui, pois é assim que ele chega do formulário
  // e também como a biblioteca 'pg' geralmente o retorna do banco.
  // O PostgreSQL cuidará da conversão para o tipo NUMERIC.
  amount: string;
  type: "receita" | "despesa";
  date: string; // Formato YYYY-MM-DD
  category?: string | null; // A categoria é opcional e pode ser nula (para receitas)
}
