import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Read .env file manually from project root
const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('Error: No se encuentra el archivo .env en la raíz del proyecto.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/(^"|"$|^'|'$)/g, '');
    env[key] = value;
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Faltan credenciales en el archivo .env.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log('=== VERIFICACIÓN DE BASE DE DATOS (CATEGORÍA CALIDAD) ===');
  console.log('Conectando a:', supabaseUrl);

  const testCases = [
    { table: 'topics', label: 'Temas de estudio' },
    { table: 'content_summaries', label: 'Resúmenes educativos' },
    { table: 'flashcards', label: 'Flashcards de repaso' },
    { table: 'questions', label: 'Preguntas de trivia' },
    { table: 'badges', label: 'Insignias configuradas' }
  ];

  for (const { table, label } of testCases) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`❌ Tabla "${table}": Error ->`, error.message);
      } else {
        console.log(`✅ Tabla "${table}" (${label}): ${count} registros encontrados.`);
      }
    } catch (e) {
      console.log(`❌ Tabla "${table}": Excepción ->`, e.message);
    }
  }

  console.log('\nSi ves números mayores a 0, ¡los datos están listos para usarse!');
}

verify();
