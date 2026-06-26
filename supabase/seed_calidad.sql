-- =====================================================================
--  SEED CATEGORÍA CALIDAD · Hospital Puerto Montt (HPM)
--  Ejecutar en: Supabase Dashboard > SQL Editor > New query
--  Carga 4 temas, resúmenes, flashcards y 26 preguntas basadas en afiches oficiales.
-- =====================================================================

-- ---------- 1. TEMAS ----------
insert into public.topics (id, name, description, color, order_index) values
  ('33333333-3333-3333-3333-333333333333',
   'Accidentes con Antineoplásicos',
   'Manejo ante exposición accidental con antineoplásicos y derrames.',
   '#e74c3c', 3),
  ('44444444-4444-4444-4444-444444444444',
   'Clave Roja HPM (#121)',
   'Protocolo de respuesta inmediata y activación de Clave Roja ante emergencias vitales.',
   '#c0392b', 4),
  ('55555555-5555-5555-5555-555555555555',
   'Comités de Ética (CEA y CEC)',
   'Estructura, funciones y canales de consulta al CEA y al CEC del HPM.',
   '#2980b9', 5),
  ('66666666-6666-6666-6666-666666666666',
   'Derechos, Deberes y Procedimientos Generales',
   'Acceso a Historia Clínica, credenciales, accidentes cortopunzantes y evacuación A.L.E.',
   '#16a085', 6)
on conflict (id) do nothing;

-- ---------- 2. RESÚMENES (Sección Educativa /study) ----------
insert into public.content_summaries (topic_id, body_text) values
  ('33333333-3333-3333-3333-333333333333',
'# 🧪 Accidentes con Antineoplásicos — HPM
Protocolo institucional para la prevención, primeros auxilios y notificación en accidentes con fármacos antineoplásicos (quimioterapias).

## 1. Primeros Auxilios Inmediatos
Dependiendo de la vía de exposición, actúe de inmediato:
* **Contacto con la Piel:** Lavar la zona afectada con abundante agua o suero fisiológico durante **10 a 15 minutos**.
* **Corte con Material Contaminado:** Lavar la zona con abundante agua o suero fisiológico por **10 a 15 minutos** y dejar secar al aire libre.
* **Contacto con Ojos:** Utilizar ducha ocular o lavar con abundante agua corriente o suero fisiológico durante **10 a 15 minutos**.
* **Inyección Accidental:** Tratar de inmediato como una **extravasación**.
* **Inhalación Aguda de Vapores:** **Abandono inmediato** del lugar contaminado.

## 2. Flujo de Notificación y Reporte
1. Realice los primeros auxilios descritos según el accidente.
2. Informe de inmediato a su **jefe directo** o a quien lo reemplace.
3. Notifique oficialmente como **accidente de trabajo**:
   * **Horario hábil:** Acudir a la oficina de **Prevención de Riesgos** para generar la DIAT (Declaración Individual de Accidentes del Trabajo) y la derivación médica correspondiente.
   * **Horario inhábil:** Acudir directamente al servicio de **Urgencia Clínica Puerto Montt** o **Urgencia del Hospital Puerto Montt**. Posteriormente, notificar a Prevención de Riesgos en el horario hábil más próximo.

## ⚠️ Notas Importantes y Derrames
* **Derrame en Superficie:** Actuar de acuerdo a protocolo utilizando obligatoriamente el **kit de derrame**.
* **Derrame en Paciente:** La primera acción obligatoria a realizar es el **corte de la bomba de infusión**.'),

  ('44444444-4444-4444-4444-444444444444',
'# 🚨 Protocolo Clave Roja HPM
La Clave Roja se activa ante emergencias de riesgo vital inmediato que ocurren dentro del recinto hospitalario.

## ¿Cuándo se activa?
Todo funcionario que se encuentre frente a una persona **inconsciente, con dificultad respiratoria severa, convulsiones activas u otra emergencia vital** debe iniciar el protocolo.

## Protocolo de 3 Pasos
1. **Prestar asistencia al afectado:** Permanecer con el afectado y dar la primera atención básica según corresponda.
2. **Activar Clave Roja (#121):** Pedir a otro funcionario que active la alerta llamando al **#121** desde cualquier citófono del hospital. Se debe decir textualmente:
   > *"Clave Roja"* indicando explícitamente si el afectado es **Adulto, Niño o Embarazada**.
3. **Trasladar al paciente:** Llevar al paciente al servicio de Urgencia utilizando la **camilla de Clave Roja más cercana**.

## 📞 Recordatorio
El número único interno de activación de Clave Roja en el Hospital Puerto Montt es el **#121**.'),

  ('55555555-5555-5555-5555-555555555555',
'# ⚖️ Comités de Ética del Hospital Puerto Montt
El hospital cuenta con dos comités éticos diferenciados según su ámbito de acción clínica o científica.

## 1. Comité de Ética Asistencial (CEA)
Órgano consultivo interdiscipinario que analiza y asesora sobre dilemas éticos que surgen de la práctica clínica diaria con los pacientes.

### ¿Cuándo consultar al CEA?
1. Dificultad para conciliar los derechos y deberes de los pacientes y la posición de los profesionales de la salud.
2. Dudas en cuanto a la **adecuación del esfuerzo terapéutico**, órdenes de no reanimar o indicación de medidas diagnósticas/terapéuticas complejas.
3. Dudas sobre si una medida terapéutica realmente es de ayuda para el paciente.
4. Situaciones donde no es claro el beneficio para el paciente (ej. tratamientos quirúrgicos que no cambian el curso de la enfermedad o estudios diagnósticos dudosos).

### ¿Cómo se accede?
* Se envía un correo electrónico a **eticaclinica@ssdr.gob.cl** adjuntando un resumen de la Historia Clínica y el motivo de la consulta.
* El comité sesiona todos los **martes** en el Hospital. Se indicará el día de reunión para que el solicitante presente el caso.

---

## 2. Comité Ético Científico (CEC)
Entidad encargada de revisar, evaluar y aprobar protocolos de investigación científica en seres humanos.

### Características clave:
* Toda investigación en seres humanos debe contar **obligatoriamente** con la aprobación del CEC.
* El CEC del Servicio de Salud del Reloncaví sesiona en **Esmeralda 269, piso 2, oficina 202, Puerto Montt**.
* Correo de contacto: **comiteeticocientifico@ssdr.gob.cl** (Anexo interno: **658400**).'),

  ('66666666-6666-6666-6666-666666666666',
'# 📁 Derechos, Deberes e Información General
Resumen de protocolos institucionales fundamentales sobre confidencialidad, accidentes de personal y evacuación.

## 1. Historia Clínica
La Historia Clínica es un documento fundamental, único, individual y confidencial.
* **Estructura:** Debe conservar su estructura ordenada y cronológica (de la atención más antigua a la más reciente).
* **Acceso:** 
  1. *Papel:* Solicitar a la Unidad de Archivo con el RUT del paciente.
  2. *Digital:* Ingresar al sistema con clave digital y RUT del paciente.
  Ambos formatos se vinculan por el RUT del paciente.
* **Copia para el paciente:** Se debe solicitar formalmente en la oficina de **OIRS**.

## 2. Uso de la Credencial
El uso de la credencial es **obligatorio** para todo el personal, en conformidad con la **Ley 20.584** de Derechos y Deberes de los Pacientes.

## 3. Exposición con Fluidos (Accidente Cortopunzante)
En caso de accidentes con material cortopunzante o fluidos corporales, siga estos pasos:
1. **Lavar inmediatamente** la zona afectada con abundante agua o suero fisiológico por **10 a 15 minutos** y dejar secar al aire libre.
2. Informar de inmediato a su **jefe directo** o reemplazo.
3. Identificar al **paciente fuente** para definir el tratamiento profiláctico a seguir.
4. **Flujo de atención médica:**
   * **Horario hábil:** Acudir al **Policlínico del Personal** para atención médica y generar la DIAT (Anexo interno: **652207**).
   * **Horario inhábil:** Acudir a la **UTI Médica** para la atención de urgencia (Anexo interno: **652429**). Asistir al Policlínico del Personal al día hábil siguiente para finalizar el proceso.

## 4. OIRS (Oficina de Informaciones, Reclamos y Sugerencias)
Para sugerencias, reclamos o felicitaciones:
* Buzones físicos en **Urgencia** y **Hall del Hospital Amigo**.
* Portal web oficial: **oirs.minsal.cl**.

## 5. Evacuación A.L.E. (Código Verde)
Código Verde se define como la evacuación organizada de pacientes y funcionarios.
* **A (Autoconvocarse):** Dirigirse al punto de reunión establecido del servicio.
* **L (Líder):** Seguir las instrucciones del Líder (jefe de servicio, supervisor o persona a cargo).
* **E (Evacuación):** Desalojo ordenado del recinto en riesgo hacia un sector libre de peligro.')
on conflict do nothing;

-- ---------- 3. FLASHCARDS ----------
insert into public.flashcards (topic_id, front, back, order_index) values
  -- Antineoplásicos
  ('33333333-3333-3333-3333-333333333333', '¿Qué hacer primero en caso de contacto de piel con antineoplásicos?', 'Lavar la zona afectada con abundante agua o suero fisiológico por 10 a 15 minutos.', 1),
  ('33333333-3333-3333-3333-333333333333', '¿Cómo se debe actuar ante un derrame de antineoplásicos en paciente?', 'La primera acción inmediata es cortar la bomba de infusión.', 2),
  ('33333333-3333-3333-3333-333333333333', '¿Dónde acudir por un accidente con antineoplásicos en horario inhábil?', 'Directamente a la Urgencia Clínica Puerto Montt o Urgencia del Hospital Puerto Montt.', 3),
  -- Clave Roja
  ('44444444-4444-4444-4444-444444444444', '¿A qué anexo telefónico se llama para activar Clave Roja en el HPM?', 'Al #121 desde cualquier citófono del hospital.', 4),
  ('44444444-4444-4444-4444-444444444444', '¿Qué datos se deben indicar al activar la Clave Roja?', 'Gritar/Decir "Clave Roja" e indicar si el afectado es Adulto, Niño o Embarazada.', 5),
  -- Comités de Ética
  ('55555555-5555-5555-5555-555555555555', '¿Qué día de la semana sesiona el Comité de Ética Asistencial (CEA)?', 'Todos los martes.', 6),
  ('55555555-5555-5555-5555-555555555555', '¿Qué comité aprueba obligatoriamente las investigaciones científicas en seres humanos?', 'El Comité Ético Científico (CEC).', 7),
  -- Derechos y Protocolos
  ('66666666-6666-6666-6666-666666666666', '¿Qué ley hace obligatorio el uso de la credencial en personal de salud?', 'La Ley 20.584 (Derechos y Deberes de los Pacientes).', 8),
  ('66666666-6666-6666-6666-666666666666', '¿Dónde acudir ante un accidente cortopunzante en horario inhábil?', 'A la UTI Médica (Anexo 652429) y al día hábil siguiente al Policlínico del Personal.', 9),
  ('66666666-6666-6666-6666-666666666666', '¿Qué significan las siglas A.L.E. en evacuación?', 'Autoconvocarse al punto de reunión, Líder (seguir instrucciones), Evacuación del recinto.', 10)
on conflict do nothing;

-- ---------- 4. PREGUNTAS DE TRIVIA ----------
insert into public.questions
  (topic_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation) values
  -- TEMA 1 · Accidentes con Antineoplásicos
  ('33333333-3333-3333-3333-333333333333',
   '¿Cuál es el primer auxilio correcto ante contacto ocular con medicamentos antineoplásicos?',
   'Aplicar gotas oftálmicas calmantes',
   'Lavar con abundante agua corriente o suero fisiológico por 10 a 15 minutos',
   'Ocluir el ojo afectado de inmediato con una gasa',
   'No realizar lavado y acudir directo a oftalmólogo',
   'b', 'basic',
   'El protocolo de primeros auxilios exige lavar el ojo afectado con suero fisiológico o abundante agua corriente durante 10 a 15 minutos en forma continua.'),

  ('33333333-3333-3333-3333-333333333333',
   '¿Qué se debe hacer en caso de inhalación aguda de vapores de antineoplásicos?',
   'Utilizar doble mascarilla y seguir trabajando',
   'Colocarse un escudo facial',
   'Abandonar de inmediato el lugar contaminado',
   'Abrir las ventanas y esperar en la sala',
   'c', 'basic',
   'Ante la inhalación de vapores tóxicos de antineoplásicos, la medida inmediata y obligatoria es el abandono del lugar contaminado por parte del personal.'),

  ('33333333-3333-3333-3333-333333333333',
   'Si ocurre un derrame de antineoplásicos sobre una superficie, ¿cómo se debe proceder?',
   'Limpiar el área rápidamente con toallas de papel comunes',
   'Dejar que se evapore de manera natural',
   'Actuar de acuerdo al protocolo utilizando el kit de derrame',
   'Lavar el suelo con abundante agua caliente y jabón',
   'c', 'intermediate',
   'Para derrames en superficie, se debe activar el protocolo respectivo y utilizar el Kit de Derrame institucional diseñado para contener estos medicamentos de forma segura.'),

  ('33333333-3333-3333-3333-333333333333',
   'Si ocurre un derrame de antineoplásicos que involucra directamente a un paciente, la primera acción debe ser:',
   'Limpiar la piel del paciente con alcohol',
   'Llamar al médico de guardia',
   'Cortar la bomba de infusión',
   'Cambiar las sábanas de la cama del paciente',
   'c', 'intermediate',
   'Ante un derrame que involucre a un paciente, la primera acción obligatoria es detener la administración cortando la bomba de infusión.'),

  ('33333333-3333-3333-3333-333333333333',
   '¿Dónde debe acudir un funcionario que sufre un accidente con antineoplásicos en horario inhábil?',
   'Directamente a la Urgencia Clínica o Urgencia del Hospital Puerto Montt',
   'A la oficina de Prevención de Riesgos de inmediato',
   'A la UTI Médica del Hospital',
   'Debe esperar en su domicilio al siguiente día hábil',
   'a', 'advanced',
   'En horario inhábil se debe acudir a Urgencia Clínica Puerto Montt o Urgencia Hospital Puerto Montt, y posteriormente notificar a Prevención de Riesgos en el horario hábil más próximo.'),

  ('33333333-3333-3333-3333-333333333333',
   '¿Qué trámite debe realizar en horario hábil un funcionario accidentado con antineoplásicos?',
   'Presentar una carta al Director del Hospital',
   'Acudir a Prevención de Riesgos para generar la DIAT y la derivación médica',
   'Ingresar una solicitud en la OIRS del establecimiento',
   'Ir directamente a la UTI Médica a retirar medicamentos',
   'b', 'advanced',
   'En horario hábil, el funcionario debe acudir a la oficina de Prevención de Riesgos para confeccionar la Declaración Individual de Accidentes del Trabajo (DIAT) y obtener la derivación médica.'),

  -- TEMA 2 · Clave Roja
  ('44444444-4444-4444-4444-444444444444',
   '¿Cuál es el anexo interno para activar la Clave Roja en el Hospital Puerto Montt?',
   '#100', '#121', '#131', '#911',
   'b', 'basic',
   'El número único institucional para activar la Clave Roja interna desde cualquier citófono del HPM es el #121.'),

  ('44444444-4444-4444-4444-444444444444',
   '¿Cuál es el primer paso del protocolo ante una emergencia de riesgo vital?',
   'Llamar al médico jefe',
   'Traer la camilla de Clave Roja',
   'Prestar asistencia al afectado',
   'Activar la alerta llamando al #121',
   'c', 'basic',
   'El paso 1 del protocolo establece de manera prioritaria "Prestar asistencia al afectado" para dar soporte básico inicial.'),

  ('44444444-4444-4444-4444-444444444444',
   'Al llamar al #121 para activar la Clave Roja, ¿qué información obligatoria se debe entregar?',
   'Nombre del afectado, edad exacta e historial médico',
   'Indicar "Clave Roja" y detallar si es Adulto, Niño o Embarazada',
   'Nombre del funcionario que llama y el servicio de origen',
   'Solo gritar "Urgencia" sin dar más detalles',
   'b', 'intermediate',
   'El protocolo de activación requiere decir "Clave Roja" y especificar si es Adulto, Niño o Embarazada para movilizar al equipo correcto.'),

  ('44444444-4444-4444-4444-444444444444',
   '¿Cómo debe realizarse el traslado del paciente afectado una vez activada la Clave Roja?',
   'Esperar a la ambulancia del SAMU en el box',
   'En silla de ruedas común hacia la salida principal',
   'A la Urgencia usando la camilla de Clave Roja más cercana',
   'En la misma cama de hospitalización del paciente',
   'c', 'intermediate',
   'El paso 3 del protocolo instruye trasladar al paciente hacia la Urgencia utilizando la camilla de Clave Roja más cercana.'),

  ('44444444-4444-4444-4444-444444444444',
   '¿Qué situaciones clínicas ameritan la activación de la Clave Roja en el HPM?',
   'Persona con dolor estomacal leve y náuseas',
   'Persona inconsciente, con dificultad respiratoria grave o convulsiones',
   'Paciente con sospecha de fractura sin compromiso hemodinámico',
   'Pérdida de un objeto personal de un paciente en su habitación',
   'b', 'advanced',
   'La Clave Roja se reserva para situaciones de inminente riesgo vital, tales como inconsciencia, paro cardiorrespiratorio, dificultad respiratoria grave o convulsiones.'),

  ('44444444-4444-4444-4444-444444444444',
   '¿Quién es responsable de iniciar la asistencia y el protocolo de Clave Roja al presenciar una emergencia vital?',
   'Exclusivamente el personal médico del servicio',
   'Todo funcionario del hospital que se encuentre en el lugar',
   'Únicamente el personal de enfermería o técnicos paramédicos',
   'El personal de guardias y seguridad del hospital',
   'b', 'advanced',
   'El protocolo HPM señala explícitamente que todo funcionario, sin importar su estamento, tiene el deber de prestar primera asistencia y activar la Clave Roja.'),

  -- TEMA 3 · Comités de Ética (CEA y CEC)
  ('55555555-5555-5555-5555-555555555555',
   '¿Qué día de la semana sesiona habitualmente el Comité de Ética Asistencial (CEA)?',
   'Lunes', 'Martes', 'Miércoles', 'Viernes',
   'b', 'basic',
   'El Comité de Ética Asistencial sesiona todos los martes del año en las dependencias del hospital.'),

  ('55555555-5555-5555-5555-555555555555',
   '¿Cuál es el correo electrónico oficial para enviar consultas al CEA?',
   'cea@hospitalpuertomontt.cl',
   'eticaclinica@ssdr.gob.cl',
   'comiteetica@ssdr.gob.cl',
   'oirs@hospitalpuertomontt.cl',
   'b', 'basic',
   'El canal oficial de recepción de solicitudes y consultas al CEA es el correo eticaclinica@ssdr.gob.cl.'),

  ('55555555-5555-5555-5555-555555555555',
   '¿Qué requisitos se deben enviar al consultar un caso ante el Comité de Ética Asistencial?',
   'El consentimiento firmado del director y de la familia',
   'Un correo con el resumen de la Historia Clínica y el motivo de la solicitud',
   'La ficha clínica original en papel del paciente',
   'Una orden judicial que autorice la revisión del caso',
   'b', 'intermediate',
   'Se accede mediante correo electrónico con un resumen de la Historia Clínica y explicando claramente el motivo de la solicitud.'),

  ('55555555-5555-5555-5555-555555555555',
   '¿Qué tipo de casos u objeciones NO se analizan en el Comité de Ética Asistencial (CEA)?',
   'Dudas sobre adecuación del esfuerzo terapéutico o limitación de tratamiento',
   'Conflictos éticos entre los derechos del paciente y la posición del equipo de salud',
   'Aprobación de protocolos de investigación clínica en seres humanos',
   'Dudas sobre si una medida terapéutica beneficia realmente al paciente',
   'c', 'intermediate',
   'La aprobación de protocolos de investigación en seres humanos es competencia exclusiva del Comité Ético Científico (CEC), no del CEA.'),

  ('55555555-5555-5555-5555-555555555555',
   '¿Qué requisito es de carácter obligatorio para realizar cualquier investigación con seres humanos en el HPM?',
   'Contar con la aprobación del Comité Ético Científico (CEC)',
   'Tener la autorización por escrito del jefe de OIRS',
   'Contar con el visto bueno del Comité Paritario del hospital',
   'Tener la firma del Presidente del Comité de Ética Asistencial (CEA)',
   'a', 'advanced',
   'Toda investigación clínica que involucre seres humanos debe contar de forma obligatoria con la aprobación previa del Comité Ético Científico (CEC).'),

  ('55555555-5555-5555-5555-555555555555',
   '¿Dónde sesiona el Comité Ético Científico (CEC) del Servicio de Salud del Reloncaví?',
   'En el Servicio de Urgencia del Hospital Puerto Montt',
   'En la calle Esmeralda 269, piso 2, oficina 202, Puerto Montt',
   'En la sala de reuniones de la Dirección del Hospital',
   'En el Policlínico del Personal del HPM',
   'b', 'advanced',
   'El CEC sesiona fuera del recinto hospitalario principal, específicamente en calle Esmeralda 269, piso 2, oficina 202, en la ciudad de Puerto Montt.'),

  -- TEMA 4 · Derechos, Deberes y Procedimientos Generales
  ('66666666-6666-6666-6666-666666666666',
   '¿Qué ley de la República de Chile regula el uso obligatorio de la credencial en el personal de salud?',
   'Ley 16.744 sobre accidentes del trabajo',
   'Ley 20.584 sobre Derechos y Deberes de los Pacientes',
   'Ley 19.628 sobre protección de la vida privada',
   'Ley 21.030 sobre causales de interrupción del embarazo',
   'b', 'basic',
   'La Ley 20.584 de Derechos y Deberes de los Pacientes exige que todo funcionario de salud se identifique obligatoriamente portando su credencial.'),

  ('66666666-6666-6666-6666-666666666666',
   'En el protocolo de evacuación organizada "Código Verde", ¿qué significan las siglas A.L.E.?',
   'Alarma general, Llamar emergencia, Evacuación inmediata',
   'Autoconvocarse al punto de reunión, Líder (seguir instrucciones), Evacuación del recinto',
   'Avisar a jefaturas, Limpieza de accesos, Enviar pacientes',
   'Asistencia básica, Libre tránsito, Extintores listos',
   'b', 'basic',
   'Las siglas A.L.E. significan: Autoconvocarse al punto de reunión, Líder (seguir instrucciones del líder) y Evacuación del recinto hacia una zona segura.'),

  ('66666666-6666-6666-6666-666666666666',
   '¿A través de qué oficina del hospital puede el paciente solicitar formalmente una copia de su Historia Clínica?',
   'Urgencia', 'OIRS', 'UTI Médica', 'Policlínico del Personal',
   'b', 'basic',
   'Las solicitudes de copia de la Historia Clínica (que es confidencial y con datos sensibles) deben canalizarse formalmente a través de la OIRS.'),

  ('66666666-6666-6666-6666-666666666666',
   '¿Cuál es la primera acción de primeros auxilios ante un accidente cortopunzante o exposición a fluidos?',
   'Aplicar alcohol al 70% o povidona yodada en la herida',
   'Lavar con abundante agua o suero fisiológico por 10 a 15 minutos y dejar secar al aire',
   'Exprimir la zona para forzar el sangrado y desinfectar',
   'Acudir de inmediato al servicio de Urgencia sin lavar la zona',
   'b', 'intermediate',
   'El primer paso es lavar profusamente con agua limpia o suero fisiológico durante 10 a 15 minutos, dejando secar la zona al aire libre.'),

  ('66666666-6666-6666-6666-666666666666',
   '¿Dónde debe acudir un funcionario que sufre una exposición accidental a fluidos corporales en horario INHÁBIL?',
   'Al Policlínico del Personal de inmediato',
   'A la UTI Médica (Anexo 652429)',
   'A la Urgencia general del Hospital',
   'A su consultorio correspondiente a su domicilio',
   'b', 'intermediate',
   'En horario inhábil, el funcionario debe acudir a la UTI Médica (Anexo 652429) para su atención y profilaxis inicial.'),

  ('66666666-6666-6666-6666-666666666666',
   '¿De qué formas se vincula y puede acceder el personal a la Historia Clínica de un paciente?',
   'Se vincula por el RUT; acceso papel en Archivo o digital con clave y RUT del paciente',
   'Únicamente en carpetas físicas solicitadas al médico tratante',
   'Accediendo de forma libre desde cualquier terminal con el nombre del paciente',
   'Solicitando una clave general al director del establecimiento',
   'a', 'intermediate',
   'La Historia Clínica se vincula por el RUT y se accede físicamente (papel) en la Unidad de Archivo o digitalmente con clave autorizada y RUT del paciente.'),

  ('66666666-6666-6666-6666-666666666666',
   '¿Qué característica de confidencialidad y ordenamiento posee la Historia Clínica?',
   'Es un documento público y de libre acceso, ordenado por fecha de egreso',
   'Es única, individual y confidencial; ordenada cronológicamente de la atención más antigua a la más reciente',
   'Es de carácter grupal por familia y ordenada por orden alfabético del apellido paterno',
   'Es confidencial pero sin un orden cronológico obligatorio',
   'b', 'advanced',
   'La Historia Clínica es única, individual y confidencial. Debe conservar una estructura estrictamente ordenada y cronológica (desde lo más antiguo a lo más reciente).'),

  ('66666666-6666-6666-6666-666666666666',
   'En el protocolo de evacuación organizada "Código Verde", ¿quién asume la función de "Líder"?',
   'El primer funcionario que detecte la emergencia',
   'El médico especialista con mayor antigüedad en el turno',
   'El jefe de servicio, supervisor o quien esté a cargo del área en ese momento',
   'El prevencionista de riesgos de turno',
   'c', 'advanced',
   'El Líder de evacuación es el jefe de servicio, la enfermera supervisora o la persona que se encuentre a cargo de la unidad en ese instante.')
on conflict do nothing;
