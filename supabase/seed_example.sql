-- =====================================================================
--  SEED DE EJEMPLO · 2 temas, 10 preguntas, 5 flashcards, resúmenes
--  Ejecutar DESPUÉS de schema.sql.
--  NOTA: created_by se deja en NULL para no depender de un usuario.
-- =====================================================================

-- ---------- TEMAS ----------
insert into public.topics (id, name, description, color, order_index) values
  ('11111111-1111-1111-1111-111111111111',
   'Seguridad del Paciente',
   'Metas internacionales de seguridad del paciente y prácticas seguras.',
   '#1e3a5f', 1),
  ('22222222-2222-2222-2222-222222222222',
   'Control de Infecciones',
   'Higiene de manos, precauciones estándar y prevención de IAAS.',
   '#2ecc71', 2)
on conflict (id) do nothing;

-- ---------- RESÚMENES ----------
insert into public.content_summaries (topic_id, body_text) values
  ('11111111-1111-1111-1111-111111111111',
'## Metas Internacionales de Seguridad del Paciente

La seguridad del paciente es la prioridad central de toda acreditación hospitalaria.

### Meta 1: Identificación correcta
Use al menos DOS identificadores (nombre completo y fecha de nacimiento). Nunca use el número de habitación.

### Meta 2: Comunicación efectiva
Aplique la técnica de repetir y confirmar (read-back) en órdenes verbales y telefónicas.

### Meta 3: Medicamentos de alto riesgo
Almacene por separado los electrolitos concentrados y rotule claramente los medicamentos LASA (similares en aspecto y sonido).'),
  ('22222222-2222-2222-2222-222222222222',
'## Control y Prevención de Infecciones

La higiene de manos es la medida más eficaz y económica para prevenir las infecciones asociadas a la atención en salud (IAAS).

### Los 5 momentos de la OMS
1. Antes de tocar al paciente
2. Antes de realizar una tarea aséptica
3. Después del riesgo de exposición a fluidos corporales
4. Después de tocar al paciente
5. Después del contacto con el entorno del paciente

### Precauciones estándar
Aplican a TODOS los pacientes independientemente de su diagnóstico.')
on conflict do nothing;

-- ---------- FLASHCARDS ----------
insert into public.flashcards (topic_id, front, back, order_index) values
  ('11111111-1111-1111-1111-111111111111', '¿Cuántos identificadores se usan para verificar a un paciente?', 'Al menos DOS (ej. nombre completo y fecha de nacimiento).', 1),
  ('11111111-1111-1111-1111-111111111111', '¿Qué técnica se usa en órdenes verbales?', 'Read-back: repetir y confirmar la orden recibida.', 2),
  ('11111111-1111-1111-1111-111111111111', '¿Qué significa "LASA"?', 'Look-Alike, Sound-Alike: medicamentos similares en aspecto y sonido.', 3),
  ('22222222-2222-2222-2222-222222222222', '¿Cuántos momentos de higiene de manos define la OMS?', 'Cinco momentos.', 4),
  ('22222222-2222-2222-2222-222222222222', '¿A quién aplican las precauciones estándar?', 'A todos los pacientes, sin importar su diagnóstico.', 5)
on conflict do nothing;

-- ---------- PREGUNTAS ----------
insert into public.questions
  (topic_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation) values
  -- Tema 1 · Seguridad del Paciente
  ('11111111-1111-1111-1111-111111111111',
   '¿Cuál es el número mínimo de identificadores del paciente que deben verificarse?',
   'Uno', 'Dos', 'Tres', 'Cuatro', 'b', 'basic',
   'Se requieren al menos dos identificadores (ej. nombre y fecha de nacimiento); el número de habitación NO es válido.'),
  ('11111111-1111-1111-1111-111111111111',
   '¿Cuál NO es un identificador válido del paciente?',
   'Nombre completo', 'Fecha de nacimiento', 'Número de habitación', 'Número de historia clínica', 'c', 'basic',
   'El número de habitación cambia y puede llevar a errores; nunca se usa como identificador.'),
  ('11111111-1111-1111-1111-111111111111',
   'En una orden telefónica, la técnica de "read-back" consiste en:',
   'Anotar y archivar la orden', 'Repetir y confirmar la orden recibida', 'Pedir la orden por escrito siempre', 'Delegar a otro profesional', 'b', 'intermediate',
   'Read-back significa repetir en voz alta la orden recibida y obtener confirmación, reduciendo errores de comunicación.'),
  ('11111111-1111-1111-1111-111111111111',
   '¿Cómo deben manejarse los electrolitos concentrados?',
   'En el carro de paro', 'Junto a los demás sueros', 'Almacenados por separado y rotulados', 'Sin restricciones', 'c', 'intermediate',
   'Los electrolitos concentrados se almacenan por separado y rotulados para evitar administraciones accidentales fatales.'),
  ('11111111-1111-1111-1111-111111111111',
   'Un evento centinela se caracteriza por:',
   'Ser un error sin consecuencias', 'Causar muerte o daño grave inesperado', 'Ser un near-miss', 'Ocurrir solo en quirófano', 'b', 'advanced',
   'Un evento centinela es un suceso inesperado que produce muerte o daño físico/psicológico grave, y exige análisis de causa raíz.'),

  -- Tema 2 · Control de Infecciones
  ('22222222-2222-2222-2222-222222222222',
   '¿Cuál es la medida más eficaz para prevenir las IAAS?',
   'Uso de antibióticos', 'Higiene de manos', 'Aislamiento de todos los pacientes', 'Uso permanente de guantes', 'b', 'basic',
   'La higiene de manos es la medida individual más eficaz y costo-efectiva para prevenir las infecciones asociadas a la atención.'),
  ('22222222-2222-2222-2222-222222222222',
   '¿Cuántos "momentos" de higiene de manos define la OMS?',
   'Tres', 'Cuatro', 'Cinco', 'Seis', 'c', 'basic',
   'La OMS define cinco momentos para la higiene de manos.'),
  ('22222222-2222-2222-2222-222222222222',
   '¿Cuál es uno de los 5 momentos de la OMS?',
   'Antes de tocar al paciente', 'Al iniciar el turno', 'Al salir del hospital', 'Antes de almorzar', 'a', 'intermediate',
   'Antes de tocar al paciente es el primer momento de la OMS; los otros incluyen tareas asépticas, riesgo de fluidos, después de tocar al paciente y su entorno.'),
  ('22222222-2222-2222-2222-222222222222',
   'Las precauciones estándar aplican a:',
   'Solo pacientes con VIH', 'Solo pacientes en aislamiento', 'Todos los pacientes', 'Solo en UCI', 'c', 'intermediate',
   'Las precauciones estándar aplican a todos los pacientes, independientemente de su diagnóstico o estado infeccioso conocido.'),
  ('22222222-2222-2222-2222-222222222222',
   'El tiempo recomendado de fricción con alcohol gel para higiene de manos es:',
   '5 segundos', '20-30 segundos', '2 minutos', 'No hay tiempo definido', 'b', 'advanced',
   'La fricción con solución alcohólica debe durar entre 20 y 30 segundos cubriendo toda la superficie de las manos.')
on conflict do nothing;
