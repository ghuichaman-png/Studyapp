-- =====================================================================
--  SEED CATEGORÍA CALIDAD · Hospital Puerto Montt (HPM)
--  Ejecutar en: Supabase Dashboard > SQL Editor > New query
--  Carga 4 temas, resúmenes, flashcards y 26 preguntas basadas en afiches oficiales.
-- =====================================================================

-- ---------- 1. TEMAS ----------
insert into public.topics (id, name, category, description, color, order_index) values
  ('33333333-3333-3333-3333-333333333333',
   'Accidentes con Antineoplásicos',
   'Acreditación HPM',
   'Manejo ante exposición accidental con antineoplásicos y derrames.',
   '#e74c3c', 3),
  ('44444444-4444-4444-4444-444444444444',
   'Clave Roja HPM (#121)',
   'Acreditación HPM',
   'Protocolo de respuesta inmediata y activación de Clave Roja ante emergencias vitales.',
   '#c0392b', 4),
  ('55555555-5555-5555-5555-555555555555',
   'Comités de Ética (CEA y CEC)',
   'Acreditación HPM',
   'Estructura, funciones y canales de consulta al CEA y al CEC del HPM.',
   '#2980b9', 5),
  ('66666666-6666-6666-6666-666666666661',
   'Historia Clínica',
   'Acreditación HPM',
   'Normas de confidencialidad, estructura, acceso y copias de la historia clínica.',
   '#16a085', 6),
  ('66666666-6666-6666-6666-666666666662',
   'Uso de la Credencial',
   'Acreditación HPM',
   'Uso obligatorio de la identificación del personal según la Ley 20.584.',
   '#2c3e50', 7),
  ('66666666-6666-6666-6666-666666666663',
   'Accidente Cortopunzante (Exposición a Fluidos)',
   'Acreditación HPM',
   'Primeros auxilios y flujo de atención ante exposición de fluidos o material cortopunzante.',
   '#e67e22', 8),
  ('66666666-6666-6666-6666-666666666664',
   'OIRS (Informaciones, Reclamos y Sugerencias)',
   'Acreditación HPM',
   'Canales de participación ciudadana y cómo canalizar felicitaciones o reclamos.',
   '#8e44ad', 9),
  ('66666666-6666-6666-6666-666666666665',
   'Evacuación A.L.E. (Código Verde)',
   'Acreditación HPM',
   'Protocolo de evacuación organizada de pacientes y funcionarios en el HPM.',
   '#27ae60', 10)
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

  ('66666666-6666-6666-6666-666666666661',
   '# 📁 Historia Clínica
La Historia Clínica es un documento fundamental, único, individual y confidencial.
* **Estructura:** Debe conservar su estructura ordenada y cronológica (de la atención más antigua a la más reciente).
* **Acceso:** 
  1. *Papel:* Solicitar a la Unidad de Archivo con el RUT del paciente.
  2. *Digital:* Ingresar al sistema con clave digital y RUT del paciente.
  Ambos formatos se vinculan por el RUT del paciente.
* **Copia para el paciente:** Se debe solicitar formalmente en la oficina de **OIRS**.'),

  ('66666666-6666-6666-6666-666666666662',
   '# 🪪 Uso de la Credencial
El uso de la credencial es **obligatorio** para todo el personal, en conformidad con la **Ley 20.584** de Derechos y Deberes de los Pacientes.'),

  ('66666666-6666-6666-6666-666666666663',
   '# 🩸 Accidente Cortopunzante (Exposición a Fluidos)
En caso de accidentes con material cortopunzante o fluidos corporales, siga estos pasos:
1. **Lavar inmediatamente** la zona afectada con abundante agua o suero fisiológico por **10 a 15 minutos** y dejar secar al aire libre.
2. Informar de inmediato a su **jefe directo** o reemplazo.
3. Identificar al **paciente fuente** para definir el tratamiento profiláctico a seguir.
4. **Flujo de atención médica:**
   * **Horario hábil:** Acudir al **Policlínico del Personal** para atención médica y generar la DIAT (Anexo interno: **652207**).
   * **Horario inhábil:** Acudir a la **UTI Médica** para la atención de urgencia (Anexo interno: **652429**). Asistir al Policlínico del Personal al día hábil siguiente para finalizar el proceso.'),

  ('66666666-6666-6666-6666-666666666664',
   '# 💬 OIRS (Informaciones, Reclamos y Sugerencias)
Para sugerencias, reclamos o felicitaciones:
* Buzones físicos en **Urgencia** y **Hall del Hospital Amigo**.
* Portal web oficial: **oirs.minsal.cl**.'),

  ('66666666-6666-6666-6666-666666666665',
   '# 🟢 Evacuación A.L.E. (Código Verde)
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
  -- Historia Clínica
  ('66666666-6666-6666-6666-666666666661', '¿De qué formas se vincula y puede acceder el personal a la Historia Clínica?', 'Se vincula por el RUT; acceso papel en Archivo o digital con clave y RUT del paciente.', 8),
  ('66666666-6666-6666-6666-666666666661', '¿Dónde solicita formalmente el paciente una copia de su Historia Clínica?', 'En la oficina de OIRS.', 9),
  -- Uso de la Credencial
  ('66666666-6666-6666-6666-666666666662', '¿Qué ley hace obligatorio el uso de la credencial en personal de salud?', 'La Ley 20.584 (Derechos y Deberes de los Pacientes).', 10),
  -- Accidente Cortopunzante
  ('66666666-6666-6666-6666-666666666663', '¿Dónde acudir ante un accidente cortopunzante en horario inhábil?', 'A la UTI Médica (Anexo 652429) y al día hábil siguiente al Policlínico del Personal.', 11),
  ('66666666-6666-6666-6666-666666666663', '¿Cuánto tiempo se debe lavar la herida ante un accidente cortopunzante?', 'Con abundante agua o suero fisiológico por 10 a 15 minutos.', 12),
  -- OIRS
  ('66666666-6666-6666-6666-666666666664', '¿Qué canales oficiales tiene la OIRS para sugerencias o reclamos?', 'Buzones físicos en Urgencia y Hall de Hospital Amigo, y el portal oirs.minsal.cl.', 13),
  -- Evacuación A.L.E.
  ('66666666-6666-6666-6666-666666666665', '¿Qué significan las siglas A.L.E. en evacuación?', 'Autoconvocarse al punto de reunión, Líder (seguir instrucciones), Evacuación del recinto.', 14)
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

  -- TEMA 6 · Historia Clínica
  ('66666666-6666-6666-6666-666666666661',
   '¿De qué formas se vincula y puede acceder el personal a la Historia Clínica de un paciente?',
   'Se vincula por el RUT; acceso papel en Archivo o digital con clave y RUT del paciente',
   'Únicamente en carpetas físicas solicitadas al médico tratante',
   'Accediendo de forma libre desde cualquier terminal con el nombre del paciente',
   'Solicitando una clave general al director del establecimiento',
   'a', 'intermediate',
   'La Historia Clínica se vincula por el RUT y se accede físicamente (papel) en la Unidad de Archivo o digitalmente con clave autorizada y RUT del paciente.'),

  ('66666666-6666-6666-6666-666666666661',
   '¿Qué característica de confidencialidad y ordenamiento posee la Historia Clínica?',
   'Es un documento público y de libre acceso, ordenado por fecha de egreso',
   'Es única, individual y confidencial; ordenada cronológicamente de la atención más antigua a la más reciente',
   'Es de carácter grupal por familia y ordenada por orden alfabético del apellido paterno',
   'Es confidencial pero sin un orden cronológico obligatorio',
   'b', 'advanced',
   'La Historia Clínica es única, individual y confidencial. Debe conservar una estructura estrictamente ordenada y cronológica (desde lo más antiguo a lo más reciente).'),

  -- TEMA 7 · Uso de la Credencial
  ('66666666-6666-6666-6666-666666666662',
   '¿Qué ley de la República de Chile regula el uso obligatorio de la credencial en el personal de salud?',
   'Ley 16.744 sobre accidentes del trabajo',
   'Ley 20.584 sobre Derechos y Deberes de los Pacientes',
   'Ley 19.628 sobre protección de la vida privada',
   'Ley 21.030 sobre causales de interrupción del embarazo',
   'b', 'basic',
   'La Ley 20.584 de Derechos y Deberes de los Pacientes exige que todo funcionario de salud se identifique obligatoriamente portando su credencial.'),

  -- TEMA 8 · Accidente Cortopunzante (Exposición a Fluidos)
  ('66666666-6666-6666-6666-666666666663',
   '¿Cuál es la primera acción de primeros auxilios ante un accidente cortopunzante o exposición a fluidos?',
   'Aplicar alcohol al 70% o povidona yodada en la herida',
   'Lavar con abundante agua o suero fisiológico por 10 a 15 minutos y dejar secar al aire',
   'Exprimir la zona para forzar el sangrado y desinfectar',
   'Acudir de inmediato al servicio de Urgencia sin lavar la zona',
   'b', 'intermediate',
   'El primer paso es lavar profusamente con agua limpia o suero fisiológico durante 10 a 15 minutos, dejando secar la zona al aire libre.'),

  ('66666666-6666-6666-6666-666666666663',
   '¿Dónde debe acudir un funcionario que sufre una exposición accidental a fluidos corporales en horario INHÁBIL?',
   'Al Policlínico del Personal de inmediato',
   'A la UTI Médica (Anexo 652429)',
   'A la Urgencia general del Hospital',
   'A su consultorio correspondiente a su domicilio',
   'b', 'intermediate',
   'En horario inhábil, el funcionario debe acudir a la UTI Médica (Anexo 652429) para su atención y profilaxis inicial.'),

  -- TEMA 9 · OIRS
  ('66666666-6666-6666-6666-666666666664',
   '¿A través de qué oficina del hospital puede el paciente solicitar formalmente una copia de su Historia Clínica?',
   'Urgencia', 'OIRS', 'UTI Médica', 'Policlínico del Personal',
   'b', 'basic',
   'Las solicitudes de copia de la Historia Clínica (que es confidencial y con datos sensibles) deben canalizarse formalmente a través de la OIRS.'),

  -- TEMA 10 · Evacuación A.L.E. (Código Verde)
  ('66666666-6666-6666-6666-666666666665',
   'En el protocolo de evacuación organizada "Código Verde", ¿qué significan las siglas A.L.E.?',
   'Alarma general, Llamar emergencia, Evacuación inmediata',
   'Autoconvocarse al punto de reunión, Líder (seguir instrucciones), Evacuación del recinto',
   'Avisar a jefaturas, Limpieza de accesos, Enviar pacientes',
   'Asistencia básica, Libre tránsito, Extintores listos',
   'b', 'basic',
   'Las siglas A.L.E. significan: Autoconvocarse al punto de reunión, Líder (seguir instrucciones del líder) y Evacuación del recinto hacia una zona segura.'),

  ('66666666-6666-6666-6666-666666666665',
   'En el protocolo de evacuación organizada "Código Verde", ¿quién asume la función de "Líder"?',
   'El primer funcionario que detecte la emergencia',
   'El médico especialista con mayor antigüedad en el turno',
   'El jefe de servicio, supervisor o quien esté a cargo del área en ese momento',
   'El prevencionista de riesgos de turno',
   'c', 'advanced',
   'El Líder de evacuación es el jefe de servicio, la enfermera supervisora o la persona que se encuentre a cargo de la unidad en ese instante.')
on conflict do nothing;

-- ---------- NUEVAS PREGUNTAS IMPORTADAS (26-06-2026) ----------
insert into public.questions
  (topic_id, text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation) values
  ('66666666-6666-6666-6666-666666666661',
   '¿Qué unidad del hospital es responsable de la apertura, conservación, custodia y distribución de las Historias Clínicas?',
   'La Unidad de Gestión Clínica',
   'La Unidad de Archivo de Historias Clínicas',
   'El Servicio de Urgencia',
   'La Subdirección Médica',
   'b', 'basic',
   'Según los protocolos del HPM, la Unidad de Archivo de Historias Clínicas es la responsable institucional de la apertura, conservación, custodia y distribución de las fichas clínicas.'),

  ('66666666-6666-6666-6666-666666666661',
   '¿Está permitido que la Historia Clínica salga físicamente del establecimiento hospitalario?',
   'Sí, si lo autoriza el médico tratante',
   'Sí, si el paciente lo solicita en OIRS',
   'No, bajo ningún punto de vista debe salir del establecimiento',
   'Sí, si el paciente firma un formulario de responsabilidad',
   'c', 'basic',
   'La normativa institucional es clara y taxativa: bajo ningún punto de vista la Historia Clínica debe salir del establecimiento. Las copias se solicitan a través de OIRS.'),

  ('66666666-6666-6666-6666-666666666662',
   '¿Qué información debe contener visiblemente la credencial de un funcionario del HPM?',
   'Solo el nombre completo y la fotografía',
   'Nombre, RUT, cargo y unidad de gestión clínica a la que pertenece',
   'Solo el nombre y el cargo del funcionario',
   'El RUT, la especialidad médica y el número de matrícula profesional',
   'b', 'basic',
   'La credencial del HPM incluye: nombre completo, RUT, cargo (ej: Ingeniero Comercial Quirúrgico) y la Unidad de Gestión Clínica a la que pertenece el funcionario.'),

  ('44444444-4444-4444-4444-444444444444',
   '¿Cuál es el segundo paso del protocolo de Clave Roja después de prestar asistencia al afectado?',
   'Trasladar al paciente a la Urgencia de inmediato',
   'Pedir a otro funcionario que llame al #121 para activar la Clave Roja',
   'Llamar al médico jefe del servicio',
   'Buscar el desfibrilador del servicio',
   'b', 'basic',
   'El paso 2 del protocolo es pedir a otro funcionario que active la Clave Roja llamando al #121, especificando si el afectado es Adulto, Niño o Embarazada.'),

  ('33333333-3333-3333-3333-333333333333',
   '¿Cómo se debe tratar una inyección accidental con medicamentos antineoplásicos?',
   'Aplicar torniquete en la zona proximal',
   'Tratarla como extravasación',
   'Lavar con agua oxigenada y cubrir con gasa',
   'Aspirar el medicamento con jeringa y luego lavar',
   'b', 'basic',
   'El protocolo del HPM establece que una inyección accidental con antineoplásicos debe tratarse como extravasación, siguiendo el protocolo específico para esa situación.'),

  ('55555555-5555-5555-5555-555555555555',
   '¿Cuál es el objetivo principal del Comité de Ética Asistencial (CEA) del HPM?',
   'Sancionar a los funcionarios que cometan errores clínicos',
   'Analizar y asesorar sobre dilemas éticos relacionados con la atención clínica de los pacientes',
   'Aprobar los protocolos de investigación científica del hospital',
   'Supervisar el cumplimiento de los derechos laborales del personal de salud',
   'b', 'basic',
   'El objetivo del CEA es analizar y asesorar sobre dilemas éticos relacionados con la atención clínica de los pacientes, no sancionar ni aprobar investigaciones.'),

  ('66666666-6666-6666-6666-666666666664',
   '¿En qué lugares físicos dentro del hospital puede un usuario ingresar un reclamo o sugerencia a través de buzón?',
   'En el hall de Urgencia y en la sala de espera de Policlínico',
   'En el Servicio de Urgencia y en el hall del Hospital Amigo',
   'Solo en la Oficina OIRS del acceso principal',
   'En la Dirección del Hospital y en la UTI Médica',
   'b', 'basic',
   'Existen dos buzones físicos: uno en el Servicio de Urgencia (buzón A) y otro en el hall del Hospital Amigo (buzón B). Además está la Oficina OIRS en el acceso principal y la página web oirs.minsal.cl.'),

  ('66666666-6666-6666-6666-666666666665',
   '¿Qué significa el término ''Zona de Derivación'' en el contexto del protocolo de Evacuación Organizada (Código Verde)?',
   'El lugar donde se concentran los funcionarios para recibir instrucciones',
   'El área predefinida de cada servicio como punto de reunión inicial',
   'El lugar al que se deben dirigir los pacientes para ser trasladados en ambulancia a otros centros',
   'La vía de escape principal del edificio',
   'c', 'basic',
   'La Zona de Derivación es el lugar al que se deben dirigir los pacientes para su posterior traslado en ambulancia a otros centros asistenciales, distinto del Punto de Reunión de funcionarios.'),

  ('66666666-6666-6666-6666-666666666661',
   'Un Servicio Clínico va a dar el alta a un paciente. ¿Qué obligación tiene respecto de la Historia Clínica al entregarla?',
   'Entregarla en el orden en que se fueron agregando los documentos, sin importar la fecha',
   'Entregarla ordenada cronológicamente y con todos los documentos relativos al episodio',
   'Entregarla solo con las evoluciones médicas y la epicrisis',
   'Entregarla directamente al paciente para que la lleve a su próxima consulta',
   'b', 'intermediate',
   'Cada Servicio Clínico tiene la obligatoriedad de entregar la Historia Clínica ordenada cronológicamente y con TODOS los documentos relativos al episodio: ingreso, evoluciones, consentimientos, protocolos operatorios, biopsias y epicrisis.'),

  ('66666666-6666-6666-6666-666666666661',
   '¿Cuál es el propósito del Sistema Informático de Trazabilidad en relación con la Historia Clínica?',
   'Registrar los diagnósticos del paciente para estadísticas ministeriales',
   'Registrar los movimientos de la Historia Clínica para ubicarla oportunamente para la atención',
   'Controlar el acceso del personal no autorizado a los datos del paciente',
   'Generar automáticamente la epicrisis al momento del alta',
   'b', 'intermediate',
   'El Sistema Informático de Trazabilidad permite registrar los movimientos de la Historia Clínica dentro del establecimiento para poder ubicarla oportunamente cuando se necesite para la atención del paciente.'),

  ('66666666-6666-6666-6666-666666666664',
   'Además del buzón físico y la oficina OIRS, ¿por qué otro canal puede un usuario ingresar un reclamo o felicitación?',
   'Por llamado telefónico al número de centralita del hospital',
   'Por la página web oirs.minsal.cl',
   'Por correo electrónico directo a la Dirección del Hospital',
   'A través de la aplicación móvil del Ministerio de Salud',
   'b', 'intermediate',
   'Los tres canales disponibles son: los buzones físicos (Urgencia y Hospital Amigo), la Oficina OIRS en el acceso principal y la página web oirs.minsal.cl.'),

  ('33333333-3333-3333-3333-333333333333',
   '¿Cuál es la diferencia en el primer auxilio entre un ''Contacto Piel'' y un ''Corte con Material Contaminado'' con antineoplásicos?',
   'No hay diferencia; ambos se tratan exactamente igual',
   'El contacto piel requiere aplicar crema antibiótica; el corte requiere solo lavado',
   'Ambos se lavan 10-15 minutos, pero el corte con material contaminado además debe dejarse secar al aire libre',
   'El contacto piel se lava con agua caliente; el corte se lava con suero frío',
   'c', 'intermediate',
   'Ambos tipos de accidente se lavan con agua o suero fisiológico por 10 a 15 minutos. La diferencia es que el corte con material contaminado tiene el paso adicional de dejar secar la zona al aire libre.'),

  ('33333333-3333-3333-3333-333333333333',
   'Tras sufrir un accidente con antineoplásicos, ¿cuál es el segundo paso del protocolo después de realizar los primeros auxilios?',
   'Notificar oficialmente como accidente de trabajo generando la DIAT',
   'Acudir inmediatamente a Urgencia sin avisar a nadie',
   'Informar inmediatamente al jefe directo o quien lo reemplace',
   'Completar un formulario de registro interno del servicio',
   'c', 'intermediate',
   'El protocolo de accidentes con antineoplásicos establece 3 pasos: 1) Primeros auxilios según el tipo de accidente, 2) Informar inmediatamente al jefe directo o quien lo reemplace, 3) Notificar oficialmente como accidente de trabajo.'),

  ('55555555-5555-5555-5555-555555555555',
   '¿A qué correo y con qué información se accede al Comité de Ética Científico (CEC) para presentar un proyecto de investigación?',
   'A eticaclinica@ssdr.gob.cl con el resumen de la Historia Clínica',
   'A comiteeticocientifico@ssdr.gob.cl, dirigiendo el proyecto al presidente del CEC',
   'A investigacion@hospitalpuertomontt.cl con el protocolo de investigación',
   'Al mismo correo del CEA, quienes derivan al CEC si corresponde',
   'b', 'intermediate',
   'Los proyectos de investigación deben dirigirse al presidente del CEC al correo comiteeticocientifico@ssdr.gob.cl. El correo eticaclinica@ssdr.gob.cl corresponde al CEA, que tiene una función distinta.'),

  ('44444444-4444-4444-4444-444444444444',
   'En el protocolo de activación de Clave Roja, ¿quién debe realizar físicamente la llamada al #121?',
   'El propio funcionario que detecta la emergencia, interrumpiendo la asistencia',
   'Otro funcionario diferente al que está prestando asistencia al afectado',
   'Exclusivamente el jefe del servicio o quien esté a cargo',
   'El personal de seguridad o portería del hospital',
   'b', 'intermediate',
   'El protocolo indica que el funcionario que detecta la emergencia debe prestar asistencia y pedir a OTRO funcionario que realice la llamada al #121, para no interrumpir la atención del afectado.'),

  ('66666666-6666-6666-6666-666666666663',
   'En el protocolo de Exposición a Fluidos Corporales, ¿cuál es la importancia de identificar al paciente fuente?',
   'Para determinar quién paga los costos del tratamiento del funcionario',
   'Para definir el tratamiento médico a seguir para el funcionario accidentado',
   'Para notificar a sus familiares del incidente ocurrido',
   'Para evaluar si el paciente fuente debe ser trasladado a aislamiento',
   'b', 'intermediate',
   'Identificar al paciente fuente es el paso 3 del protocolo de exposición a fluidos, y su objetivo es definir el tratamiento médico a seguir para el funcionario accidentado, ya que la profilaxis depende del estado serológico del paciente fuente.'),

  ('66666666-6666-6666-6666-666666666661',
   'CASO CLÍNICO: Una enfermera del Servicio de Medicina ingresa al sistema digital con su clave personal y, sin usar el RUT del paciente, navega por varios registros clínicos para buscar a un familiar suyo hospitalizado. ¿Cuál es la falla más grave que está cometiendo?',
   'Está consultando la Historia Clínica fuera del horario habitual de trabajo',
   'Está accediendo a información confidencial y datos sensibles sin el RUT del paciente, vulnerando la confidencialidad de la Historia Clínica',
   'Está usando el sistema digital en vez del formato papel, lo que no está permitido para personal de enfermería',
   'No está cometiendo ninguna falta, ya que tiene clave de acceso al sistema',
   'b', 'advanced',
   'El acceso digital a la Historia Clínica requiere dos elementos: la clave personal del funcionario Y el RUT específico del paciente. La Historia Clínica es dato sensible y confidencial. Acceder libremente sin el RUT del paciente vulnera la confidencialidad, independientemente de tener clave de sistema.'),

  ('44444444-4444-4444-4444-444444444444',
   'CASO CLÍNICO: En la sala de espera de Policlínico, una auxiliar de servicio encuentra a un hombre adulto caído en el suelo, inconsciente y con respiración agónica. En ese momento está sola en el pasillo. ¿Cuál es la secuencia de acciones correctas?',
   'Ir a buscar primero al médico de guardia, luego volver y prestar asistencia',
   'Llamar al #121 desde el citófono más cercano y luego acercarse al paciente',
   'Prestar asistencia inmediata al afectado y pedir a la primera persona que aparezca que llame al #121',
   'Esperar a que llegue otro funcionario para activar el protocolo de forma conjunta',
   'c', 'advanced',
   'El paso 1 siempre es prestar asistencia al afectado. El paso 2 es pedir a OTRO funcionario que llame al #121. Si está sola, debe comenzar la asistencia inmediatamente y solicitar ayuda al primer transeúnte o funcionario que aparezca. Nunca se debe abandonar al paciente para ir a llamar.'),

  ('33333333-3333-3333-3333-333333333333',
   'CASO CLÍNICO: Una técnica paramédica del Servicio de Oncología accidentalmente derrama una bolsa de quimioterapia sobre su antebrazo y parte de la solución salpica al paciente en tratamiento. ¿Cuál es el orden correcto de las acciones inmediatas?',
   'Primero lavar su propio brazo, luego cortar la bomba de infusión del paciente',
   'Primero cortar la bomba de infusión del paciente, luego lavar su propio brazo con agua abundante por 10-15 minutos',
   'Llamar al médico tratante antes de realizar cualquier acción',
   'Activar el kit de derrame primero, luego atender al paciente y finalmente lavarse el brazo',
   'b', 'advanced',
   'Cuando el derrame involucra al paciente, la PRIMERA acción es cortar la bomba de infusión. Luego se realizan los primeros auxilios para la funcionaria (lavar con agua o suero 10-15 min). Posteriormente se informa al jefe directo y se notifica como accidente de trabajo.'),

  ('55555555-5555-5555-5555-555555555555',
   'CASO CLÍNICO: El equipo médico de UCI plantea limitar el esfuerzo terapéutico en un paciente con encefalopatía severa e irreversible, pero la familia se opone y exige mantener todas las medidas. El médico jefe tiene dudas éticas sobre cómo proceder. ¿Qué herramienta institucional corresponde activar?',
   'Presentar el caso al Comité Ético Científico (CEC) en Esmeralda 269',
   'Solicitar una reunión de arbitraje con la Dirección del Hospital',
   'Consultar al Comité de Ética Asistencial (CEA) enviando un correo a eticaclinica@ssdr.gob.cl con el resumen clínico',
   'Derivar el conflicto a la OIRS para mediación entre el equipo y la familia',
   'c', 'advanced',
   'Este caso involucra dificultad para conciliar derechos del paciente con la posición del equipo de salud, y dudas sobre adecuación del esfuerzo terapéutico: dos situaciones explícitas para consultar al CEA. Se accede enviando un correo a eticaclinica@ssdr.gob.cl con el resumen de Historia Clínica y el motivo de la solicitud.'),

  ('66666666-6666-6666-6666-666666666663',
   'CASO CLÍNICO: Durante un turno de noche, un técnico paramédico del Servicio de Cirugía sufre un pinchazo accidental con una aguja usada en un paciente con hepatitis B conocida. Hace la primera atención correcta (lavado 10-15 min). ¿Cuál es la ruta de atención correcta a seguir?',
   'Esperar al día siguiente hábil para ir al Policlínico del Personal y generar la DIAT',
   'Acudir al Policlínico del Personal de inmediato, ya que atiende las 24 horas',
   'Acudir a la UTI Médica (Anexo 652429) para atención y al día hábil siguiente ir al Policlínico del Personal para completar el proceso',
   'Informar solo al jefe de turno y esperar indicaciones sin acudir a ningún servicio esa noche',
   'c', 'advanced',
   'En horario inhábil (turno de noche), el funcionario debe acudir a la UTI Médica (Anexo 652429) para recibir atención médica inicial y profilaxis según el paciente fuente. Al día hábil siguiente, debe ir al Policlínico del Personal (Anexo 652207) para completar el proceso y generar la DIAT.'),

  ('66666666-6666-6666-6666-666666666665',
   'CASO CLÍNICO: Se activa el Código Verde en el Servicio de Medicina durante el horario de tarde. La enfermera supervisora está realizando un procedimiento de urgencia en un box. El técnico paramédico más antiguo del turno duda si puede asumir el rol de Líder. ¿Cuál es la respuesta correcta?',
   'No puede; debe esperar a que llegue un médico para asumir el liderazgo',
   'Sí puede; el Líder es el jefe, supervisor o quien esté a cargo del área en ese momento',
   'No puede; el liderazgo siempre recae en el profesional con más años de servicio en el hospital',
   'Debe llamar a la Dirección del Hospital para que designen a un Líder',
   'b', 'advanced',
   'El Líder de evacuación es quien esté a cargo del área en ese momento: el jefe de servicio, la supervisora o quien los reemplace. Si la supervisora está imposibilitada por un procedimiento de urgencia, quien deba quedar a cargo asume ese rol. El liderazgo no es exclusivo de médicos ni depende de antigüedad en el hospital.'),

  ('66666666-6666-6666-6666-666666666661',
   'CASO CLÍNICO: La hija de un paciente hospitalizado se acerca al Servicio de Medicina y pide al técnico paramédico de turno que le muestre la ficha clínica de su padre para saber cómo va su evolución. El técnico no la conoce personalmente. ¿Cuál es la respuesta institucional correcta?',
   'Mostrarle la Historia Clínica si ella acredita ser familiar directo con su cédula de identidad',
   'No mostrarle la Historia Clínica; orientarla a que el médico tratante le informe verbalmente sobre la evolución',
   'No mostrarle la Historia Clínica directamente; si requiere una copia, debe solicitarla a través de OIRS',
   'Mostrarle solo las evoluciones de enfermería, ya que las notas médicas son reservadas',
   'c', 'advanced',
   'La Historia Clínica es confidencial y contiene datos sensibles. Ningún funcionario puede entregarla o mostrarla directamente a familiares. Para obtener una copia, el paciente (o su representante legal) debe solicitarla formalmente a través de OIRS. La información verbal sobre evolución es función del médico tratante.'),

  ('55555555-5555-5555-5555-555555555555',
   'CASO CLÍNICO: Un investigador externo se presenta en el hospital con un protocolo de investigación clínica que involucra a pacientes de la UCI y solicita autorización para iniciar el estudio. ¿Qué instancia debe dar la aprobación obligatoria antes de que el estudio pueda comenzar?',
   'El Comité de Ética Asistencial (CEA), que sesiona los martes en el hospital',
   'La Dirección del Hospital Puerto Montt mediante resolución formal',
   'El Comité Ético Científico (CEC) del Servicio de Salud del Reloncaví',
   'Basta con la autorización del Jefe del Servicio de UCI donde se realizará el estudio',
   'c', 'advanced',
   'Toda investigación en seres humanos debe contar obligatoriamente con la aprobación del Comité Ético Científico (CEC). El CEC del Servicio de Salud del Reloncaví sesiona en Esmeralda 269, piso 2, oficina 202, Puerto Montt. El CEA tiene funciones distintas (dilemas éticos asistenciales) y no aprueba protocolos de investigación.')
on conflict do nothing;
