import json

# This script merges all the career data provided so far.

# Existing base data (first 10)
existing_data = [
  {"id": "uch-ing-civil", "universidad": "Universidad de Chile", "abreviatura": "UCH", "nombre": "Ingeniería Civil - Plan Común", "area": "Ingeniería y Tecnología", "ubicacion": "Santiago (Beauchef)", "descripcion": "Forma ingenieros con sólida base científica y tecnológica para liderar proyectos complejos.", "intereses": ["matemáticas", "tecnología", "ciencias", "resolución de problemas", "innovación"], "puntajes": {"nem": 10, "ranking": 25, "lectora": 10, "matematica1": 25, "matematica2": 20, "electiva": 10}, "puntajeCorte2024": 845.6},
  {"id": "puc-medicina", "universidad": "Pontificia Universidad Católica de Chile", "abreviatura": "PUC", "nombre": "Medicina", "area": "Salud", "ubicacion": "Santiago (Casa Central)", "descripcion": "Carrera líder en salud con enfoque en excelencia clínica e investigación humana.", "intereses": ["biología", "ayuda social", "ciencias", "salud", "investigación"], "puntajes": {"nem": 20, "ranking": 20, "lectora": 15, "matematica1": 20, "matematica2": 0, "electiva": 25}, "puntajeCorte2024": 942.3},
  {"id": "usach-derecho", "universidad": "Universidad de Santiago de Chile", "abreviatura": "USACH", "nombre": "Derecho", "area": "Ciencias Sociales", "ubicacion": "Santiago (Estación Central)", "descripcion": "Enfoque en justicia social, derecho público y compromiso con el país.", "intereses": ["lectura", "debates", "justicia", "historia", "política"], "puntajes": {"nem": 10, "ranking": 40, "lectora": 20, "matematica1": 10, "matematica2": 0, "electiva": 20}, "puntajeCorte2024": 812.5},
  {"id": "udec-psicologia", "universidad": "Universidad de Concepción", "abreviatura": "UdeC", "nombre": "Psicología", "area": "Ciencias Sociales", "ubicacion": "Concepción", "descripcion": "Formación integral en procesos mentales y comportamiento humano con fuerte base científica.", "intereses": ["empatía", "escucha activa", "salud mental", "comportamiento", "social"], "puntajes": {"nem": 15, "ranking": 25, "lectora": 25, "matematica1": 15, "matematica2": 0, "electiva": 20}, "puntajeCorte2024": 789.4},
  {"id": "uai-comercial", "universidad": "Universidad Adolfo Ibáñez", "abreviatura": "UAI", "nombre": "Ingeniería Comercial", "area": "Administración y Negocios", "ubicacion": "Viña del Mar / Santiago", "descripcion": "Liderazgo empresarial con visión global y enfoque en innovación y artes liberales.", "intereses": ["negocios", "emprendimiento", "liderazgo", "economía", "estrategia"], "puntajes": {"nem": 10, "ranking": 20, "lectora": 15, "matematica1": 45, "matematica2": 0, "electiva": 10}, "puntajeCorte2024": 756.2},
  {"id": "utfsm-informatica", "universidad": "Universidad Técnica Federico Santa María", "abreviatura": "UTFSM", "nombre": "Ingeniería Civil Informática", "area": "Ingeniería y Tecnología", "ubicacion": "Valparaíso / Santiago", "descripcion": "Referente nacional en formación técnica y desarrollo de software de alta complejidad.", "intereses": ["programación", "lógica", "software", "sistemas", "innovación"], "puntajes": {"nem": 10, "ranking": 25, "lectora": 10, "matematica1": 35, "matematica2": 10, "electiva": 10}, "puntajeCorte2024": 820.1},
  {"id": "udp-periodismo", "universidad": "Universidad Diego Portales", "abreviatura": "UDP", "nombre": "Periodismo", "area": "Ciencias Sociales", "ubicacion": "Santiago", "descripcion": "Excelencia en formación periodística con énfasis en investigación y ética.", "intereses": ["escritura", "actualidad", "comunicación", "investigación", "medios"], "puntajes": {"nem": 10, "ranking": 30, "lectora": 35, "matematica1": 15, "matematica2": 0, "electiva": 10}, "puntajeCorte2024": 695.8},
  {"id": "umce-pedagogia-mat", "universidad": "Universidad Metropolitana de Ciencias de la Educación", "abreviatura": "UMCE", "nombre": "Pedagogía en Matemáticas", "area": "Educación", "ubicacion": "Santiago (Ñuñoa)", "descripcion": "Tradición pedagógica enfocada en la enseñanza de las matemáticas con sentido social.", "intereses": ["enseñanza", "matemáticas", "educación", "vocación", "niñez"], "puntajes": {"nem": 20, "ranking": 30, "lectora": 15, "matematica1": 25, "matematica2": 0, "electiva": 10}, "puntajeCorte2024": 610.2},
  {"id": "uc-arquitectura", "universidad": "Pontificia Universidad Católica de Chile", "abreviatura": "PUC", "nombre": "Arquitectura", "area": "Arte y Diseño", "ubicacion": "Santiago (Lo Contador)", "descripcion": "Taller de diseño y teoría arquitectónica con reconocimiento internacional.", "intereses": ["diseño", "dibujo", "espacio", "arte", "construcción"], "puntajes": {"nem": 10, "ranking": 30, "lectora": 20, "matematica1": 30, "matematica2": 0, "electiva": 10}, "puntajeCorte2024": 834.1},
  {"id": "uautonoma-enfermeria", "universidad": "Universidad Autónoma de Chile", "abreviatura": "UA", "nombre": "Enfermería", "area": "Salud", "ubicacion": "Santiago / Talca / Temuco", "descripcion": "Formación práctica orientada al cuidado integral del paciente y gestión en salud.", "intereses": ["cuidado", "biología", "salud", "servicio", "ayuda"], "puntajes": {"nem": 15, "ranking": 25, "lectora": 20, "matematica1": 25, "matematica2": 0, "electiva": 15}, "puntajeCorte2024": 645.7}
]

# All career chunks provided by the user
chunks = [
    # Chunk 1 (20)
    {"id_carrera": "IC-UCH-01", "nombre": "Ingeniería Civil (Plan Común)", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 855.2, "tags": ["Matemáticas", "Tecnología", "Ciencias", "Innovación"]},
    {"id_carrera": "IC-PUC-02", "nombre": "Ingeniería Civil", "universidad": "Pontificia Universidad Católica de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 890.4, "tags": ["Matemáticas", "Tecnología", "Ciencias", "Investigación"]},
    {"id_carrera": "MED-UDEC-03", "nombre": "Medicina", "universidad": "Universidad de Concepción", "ubicacion": "Región del Biobío", "puntaje_corte": 962.1, "tags": ["Salud", "Ciencias", "Investigación", "Ayuda Social"]},
    {"id_carrera": "ICI-USM-04", "nombre": "Ingeniería Civil Informática", "universidad": "Univ. Técnica Federico Santa María (Casa Central)", "ubicacion": "Región de Valparaíso", "puntaje_corte": 872.5, "tags": ["Programación", "Tecnología", "Matemáticas", "Innovación"]},
    {"id_carrera": "ICI-USM-05", "nombre": "Ingeniería Civil Informática", "universidad": "Univ. Técnica Federico Santa María (San Joaquín)", "ubicacion": "Región Metropolitana", "puntaje_corte": 868.9, "tags": ["Programación", "Tecnología", "Matemáticas", "Innovación"]},
    {"id_carrera": "PSI-UV-06", "nombre": "Psicología", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 795.3, "tags": ["Ayuda Social", "Lectura", "Salud"]},
    {"id_carrera": "DER-PUCV-07", "nombre": "Derecho", "universidad": "Pontificia Universidad Católica de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 835.0, "tags": ["Justicia", "Lectura", "Investigación"]},
    {"id_carrera": "ARQ-UCH-08", "nombre": "Arquitectura", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 780.2, "tags": ["Diseño", "Innovación", "Matemáticas"]},
    {"id_carrera": "ODO-UV-09", "nombre": "Odontología", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 845.6, "tags": ["Salud", "Ciencias", "Tecnología"]},
    {"id_carrera": "ICO-PUC-10", "nombre": "Ingeniería Comercial", "universidad": "Pontificia Universidad Católica de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 882.1, "tags": ["Negocios", "Matemáticas", "Liderazgo"]},
    {"id_carrera": "ENF-USACH-11", "nombre": "Enfermería", "universidad": "Universidad de Santiago de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 810.4, "tags": ["Salud", "Ayuda Social", "Ciencias"]},
    {"id_carrera": "KINE-UV-12", "nombre": "Kinesiología", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 750.8, "tags": ["Salud", "Ciencias", "Ayuda Social"]},
    {"id_carrera": "PED-PUCV-13", "nombre": "Pedagogía en Inglés", "universidad": "Pontificia Universidad Católica de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 690.5, "tags": ["Enseñanza", "Lectura", "Ayuda Social"]},
    {"id_carrera": "ICE-UCH-14", "nombre": "Ingeniería Civil Eléctrica", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 840.3, "tags": ["Tecnología", "Matemáticas", "Ciencias", "Innovación"]},
    {"id_carrera": "VET-UDEC-15", "nombre": "Medicina Veterinaria", "universidad": "Universidad de Concepción", "ubicacion": "Región del Biobío", "puntaje_corte": 815.7, "tags": ["Ciencias", "Salud", "Investigación"]},
    {"id_carrera": "BIO-UV-16", "nombre": "Biología Marina", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 675.4, "tags": ["Ciencias", "Investigación", "Tecnología"]},
    {"id_carrera": "CPA-UCH-17", "nombre": "Contador Auditor", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 720.9, "tags": ["Negocios", "Matemáticas", "Justicia"]},
    {"id_carrera": "TMO-UV-18", "nombre": "Tecnología Médica", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 820.1, "tags": ["Salud", "Ciencias", "Tecnología"]},
    {"id_carrera": "AQ-USACH-19", "nombre": "Analista Químico", "universidad": "Universidad de Santiago de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 695.2, "tags": ["Ciencias", "Investigación", "Tecnología"]},
    {"id_carrera": "DIBU-UV-20", "nombre": "Diseño", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 710.3, "tags": ["Diseño", "Innovación", "Tecnología"]},
    
    # Chunk 2 (20)
    {"id_carrera": "ODO-UCH-21", "nombre": "Odontología", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 880.5, "tags": ["Salud", "Ciencias", "Ayuda Social"]},
    {"id_carrera": "AGRO-PUC-22", "nombre": "Agronomía y Sistemas Naturales", "universidad": "Pontificia Universidad Católica de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 745.2, "tags": ["Ciencias", "Investigación", "Innovación"]},
    {"id_carrera": "PER-UDP-23", "nombre": "Periodismo", "universidad": "Universidad Diego Portales", "ubicacion": "Región Metropolitana", "puntaje_corte": 760.8, "tags": ["Lectura", "Justicia", "Investigación"]},
    {"id_carrera": "NUT-UV-24", "nombre": "Nutrición y Dietética", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 710.5, "tags": ["Salud", "Ciencias", "Ayuda Social"]},
    {"id_carrera": "FON-UDEC-25", "nombre": "Fonoaudiología", "universidad": "Universidad de Concepción", "ubicacion": "Región del Biobío", "puntaje_corte": 735.6, "tags": ["Salud", "Enseñanza", "Ayuda Social"]},
    {"id_carrera": "OBS-USACH-26", "nombre": "Obstetricia y Puericultura", "universidad": "Universidad de Santiago de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 805.1, "tags": ["Salud", "Ayuda Social", "Ciencias"]},
    {"id_carrera": "ICM-UCH-27", "nombre": "Ingeniería Civil de Minas", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 820.4, "tags": ["Tecnología", "Matemáticas", "Ciencias"]},
    {"id_carrera": "DIS-PUCV-28", "nombre": "Diseño", "universidad": "Pontificia Universidad Católica de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 740.0, "tags": ["Diseño", "Tecnología", "Innovación"]},
    {"id_carrera": "KIN-PUC-29", "nombre": "Kinesiología", "universidad": "Pontificia Universidad Católica de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 830.2, "tags": ["Salud", "Ciencias", "Ayuda Social"]},
    {"id_carrera": "GEO-UDEC-30", "nombre": "Geología", "universidad": "Universidad de Concepción", "ubicacion": "Región del Biobío", "puntaje_corte": 775.3, "tags": ["Ciencias", "Investigación", "Matemáticas"]},
    {"id_carrera": "ARQ-USM-31", "nombre": "Arquitectura", "universidad": "Univ. Técnica Federico Santa María (Casa Central)", "ubicacion": "Región de Valparaíso", "puntaje_corte": 795.5, "tags": ["Diseño", "Matemáticas", "Innovación"]},
    {"id_carrera": "PEF-UMCE-32", "nombre": "Pedagogía en Educación Física", "universidad": "UMCE", "ubicacion": "Región Metropolitana", "puntaje_corte": 680.9, "tags": ["Enseñanza", "Salud", "Ayuda Social"]},
    {"id_carrera": "ADP-UV-33", "nombre": "Administración Pública", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 690.1, "tags": ["Justicia", "Negocios", "Ayuda Social"]},
    {"id_carrera": "IND-UAI-34", "nombre": "Ingeniería Civil Industrial", "universidad": "Universidad Adolfo Ibáñez", "ubicacion": "Región de Valparaíso", "puntaje_corte": 825.6, "tags": ["Negocios", "Matemáticas", "Innovación"]},
    {"id_carrera": "QYF-UCH-35", "nombre": "Química y Farmacia", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 865.3, "tags": ["Salud", "Ciencias", "Investigación"]},
    {"id_carrera": "TRA-UNAB-36", "nombre": "Traducción e Interpretación en Inglés", "universidad": "Universidad Andrés Bello", "ubicacion": "Región Metropolitana", "puntaje_corte": 650.0, "tags": ["Lectura", "Enseñanza", "Ayuda Social"]},
    {"id_carrera": "CIN-UCH-37", "nombre": "Cine y Televisión", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 790.2, "tags": ["Diseño", "Tecnología", "Innovación"]},
    {"id_carrera": "BIOT-USACH-38", "nombre": "Ingeniería en Biotecnología", "universidad": "Universidad de Santiago de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 770.8, "tags": ["Ciencias", "Tecnología", "Investigación"]},
    {"id_carrera": "TOC-UV-39", "nombre": "Terapia Ocupacional", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 720.4, "tags": ["Salud", "Ayuda Social", "Enseñanza"]},
    {"id_carrera": "AST-PUC-40", "nombre": "Astronomía", "universidad": "Pontificia Universidad Católica de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 910.5, "tags": ["Ciencias", "Matemáticas", "Investigación"]},

    # Chunk 3 (20)
    {"id_carrera": "VET-UCH-41", "nombre": "Medicina Veterinaria", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 832.1, "tags": ["Salud", "Ciencias", "Investigación"]},
    {"id_carrera": "ICM-USM-42", "nombre": "Ingeniería Civil Mecánica", "universidad": "Univ. Técnica Federico Santa María (Casa Central)", "ubicacion": "Región de Valparaíso", "puntaje_corte": 815.4, "tags": ["Matemáticas", "Tecnología", "Innovación"]},
    {"id_carrera": "DG-UDP-43", "nombre": "Diseño Gráfico", "universidad": "Universidad Diego Portales", "ubicacion": "Región Metropolitana", "puntaje_corte": 725.0, "tags": ["Diseño", "Tecnología", "Innovación"]},
    {"id_carrera": "ICO-UANDES-44", "nombre": "Ingeniería Comercial", "universidad": "Universidad de los Andes", "ubicacion": "Región Metropolitana", "puntaje_corte": 795.8, "tags": ["Negocios", "Matemáticas", "Innovación"]},
    {"id_carrera": "PSI-PUC-45", "nombre": "Psicología", "universidad": "Pontificia Universidad Católica de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 875.2, "tags": ["Ayuda Social", "Salud", "Lectura"]},
    {"id_carrera": "MED-USACH-46", "nombre": "Medicina", "universidad": "Universidad de Santiago de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 948.7, "tags": ["Salud", "Ciencias", "Ayuda Social"]},
    {"id_carrera": "ICA-UDEC-47", "nombre": "Ingeniería Civil Aeroespacial", "universidad": "Universidad de Concepción", "ubicacion": "Región del Biobío", "puntaje_corte": 802.3, "tags": ["Tecnología", "Matemáticas", "Investigación"]},
    {"id_carrera": "SOC-UCH-48", "nombre": "Sociología", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 788.6, "tags": ["Lectura", "Investigación", "Ayuda Social"]},
    {"id_carrera": "SOC-UV-49", "nombre": "Sociología", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 695.1, "tags": ["Lectura", "Investigación", "Ayuda Social"]},
    {"id_carrera": "PEP-PUCV-50", "nombre": "Pedagogía en Educación Parvularia", "universidad": "Pontificia Universidad Católica de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 640.5, "tags": ["Enseñanza", "Ayuda Social", "Lectura"]},
    {"id_carrera": "GEO-PUC-51", "nombre": "Geografía", "universidad": "Pontificia Universidad Católica de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 730.4, "tags": ["Ciencias", "Investigación", "Lectura"]},
    {"id_carrera": "IAM-UV-52", "nombre": "Ingeniería Ambiental", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 705.9, "tags": ["Ciencias", "Tecnología", "Innovación"]},
    {"id_carrera": "OBS-UV-53", "nombre": "Obstetricia y Puericultura", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 775.2, "tags": ["Salud", "Ayuda Social", "Ciencias"]},
    {"id_carrera": "ENF-PUC-54", "nombre": "Enfermería", "universidad": "Pontificia Universidad Católica de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 825.8, "tags": ["Salud", "Ayuda Social", "Ciencias"]},
    {"id_carrera": "TMO-UCH-55", "nombre": "Tecnología Médica", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 855.0, "tags": ["Salud", "Ciencias", "Tecnología"]},
    {"id_carrera": "IOC-USACH-56", "nombre": "Ingeniería Civil en Obras Civiles", "universidad": "Universidad de Santiago de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 760.3, "tags": ["Matemáticas", "Tecnología", "Diseño"]},
    {"id_carrera": "ART-PUCV-57", "nombre": "Licenciatura en Arte", "universidad": "Pontificia Universidad Católica de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 685.7, "tags": ["Diseño", "Innovación", "Lectura"]},
    {"id_carrera": "CPO-UCH-58", "nombre": "Ciencia Política", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 810.2, "tags": ["Justicia", "Lectura", "Investigación"]},
    {"id_carrera": "FON-UV-59", "nombre": "Fonoaudiología", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 715.6, "tags": ["Salud", "Enseñanza", "Ayuda Social"]},
    {"id_carrera": "ANT-UCH-60", "nombre": "Antropología", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 770.8, "tags": ["Investigación", "Lectura", "Ciencias"]},

    # Chunk 4 (20)
    {"id_carrera": "ICQ-UV-61", "nombre": "Ingeniería Civil Química", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 730.5, "tags": ["Ciencias", "Tecnología", "Matemáticas"]},
    {"id_carrera": "PEH-UCH-62", "nombre": "Pedagogía en Historia y Geografía", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 745.2, "tags": ["Enseñanza", "Lectura", "Ayuda Social"]},
    {"id_carrera": "AST-UV-63", "nombre": "Licenciatura en Física mención Astronomía", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 810.8, "tags": ["Ciencias", "Matemáticas", "Investigación"]},
    {"id_carrera": "BQM-PUC-64", "nombre": "Bioquímica", "universidad": "Pontificia Universidad Católica de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 860.3, "tags": ["Ciencias", "Investigación", "Salud"]},
    {"id_carrera": "ICT-USM-65", "nombre": "Ingeniería Civil Telemática", "universidad": "Univ. Técnica Federico Santa María (Casa Central)", "ubicacion": "Región de Valparaíso", "puntaje_corte": 805.1, "tags": ["Programación", "Tecnología", "Innovación"]},
    {"id_carrera": "TOC-UCH-66", "nombre": "Terapia Ocupacional", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 780.9, "tags": ["Salud", "Ayuda Social", "Enseñanza"]},
    {"id_carrera": "ICO-USACH-67", "nombre": "Ingeniería Comercial", "universidad": "Universidad de Santiago de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 820.6, "tags": ["Negocios", "Matemáticas", "Innovación"]},
    {"id_carrera": "DER-UDP-68", "nombre": "Derecho", "universidad": "Universidad Diego Portales", "ubicacion": "Región Metropolitana", "puntaje_corte": 790.0, "tags": ["Justicia", "Lectura", "Investigación"]},
    {"id_carrera": "DIN-UCH-69", "nombre": "Diseño Industrial", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 755.4, "tags": ["Diseño", "Innovación", "Tecnología"]},
    {"id_carrera": "AGR-PUCV-70", "nombre": "Agronomía", "universidad": "Pontificia Universidad Católica de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 680.2, "tags": ["Ciencias", "Investigación", "Innovación"]},
    {"id_carrera": "PEB-UMCE-71", "nombre": "Pedagogía en Biología", "universidad": "UMCE", "ubicacion": "Región Metropolitana", "puntaje_corte": 630.8, "tags": ["Enseñanza", "Ciencias", "Ayuda Social"]},
    {"id_carrera": "ADP-UCH-72", "nombre": "Administración Pública", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 765.1, "tags": ["Justicia", "Negocios", "Ayuda Social"]},
    {"id_carrera": "KIN-USACH-73", "nombre": "Kinesiología", "universidad": "Universidad de Santiago de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 775.5, "tags": ["Salud", "Ciencias", "Ayuda Social"]},
    {"id_carrera": "IES-UV-74", "nombre": "Ingeniería en Estadística y Ciencia de Datos", "universidad": "Universidad de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 715.0, "tags": ["Matemáticas", "Programación", "Investigación"]},
    {"id_carrera": "FIS-PUC-75", "nombre": "Licenciatura en Física", "universidad": "Pontificia Universidad Católica de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 840.7, "tags": ["Ciencias", "Matemáticas", "Investigación"]},
    {"id_carrera": "TSO-PUCV-76", "nombre": "Trabajo Social", "universidad": "Pontificia Universidad Católica de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 725.3, "tags": ["Ayuda Social", "Justicia", "Lectura"]},
    {"id_carrera": "ODO-UDEC-77", "nombre": "Odontología", "universidad": "Universidad de Concepción", "ubicacion": "Región del Biobío", "puntaje_corte": 825.9, "tags": ["Salud", "Ciencias", "Tecnología"]},
    {"id_carrera": "IAC-USM-78", "nombre": "Ingeniería en Aviación Comercial", "universidad": "Univ. Técnica Federico Santa María (Casa Central)", "ubicacion": "Región de Valparaíso", "puntaje_corte": 785.4, "tags": ["Negocios", "Tecnología", "Matemáticas"]},
    {"id_carrera": "PER-PUCV-79", "nombre": "Periodismo", "universidad": "Pontificia Universidad Católica de Valparaíso", "ubicacion": "Región de Valparaíso", "puntaje_corte": 710.2, "tags": ["Lectura", "Investigación", "Justicia"]},
    {"id_carrera": "NUT-UCH-80", "nombre": "Nutrición y Dietética", "universidad": "Universidad de Chile", "ubicacion": "Región Metropolitana", "puntaje_corte": 795.6, "tags": ["Salud", "Ciencias", "Ayuda Social"]}
]

def get_abreviatura(uni):
    uni = uni.lower()
    if "chile" in uni and "pontificia" not in uni and "santiago" not in uni and "metropolitana" not in uni: return "UCH"
    if "pontificia" in uni and "católica" in uni and "valparaíso" not in uni and "andes" not in uni: return "PUC"
    if "concepción" in uni: return "UdeC"
    if "federico santa maría" in uni or "usm" in uni: return "USM"
    if "valparaíso" in uni and "católica" not in uni: return "UV"
    if "pontificia" in uni and "valparaíso" in uni: return "PUCV"
    if "santiago" in uni: return "USACH"
    if "umce" in uni: return "UMCE"
    if "adolfo ibáñez" in uni: return "UAI"
    if "diego portales" in uni or "udp" in uni: return "UDP"
    if "andrés bello" in uni: return "UNAB"
    if "andes" in uni: return "UANDES"
    return "UNI"

def get_area(nombre, tags):
    n = nombre.lower()
    t = [x.lower() for x in tags]
    if "ingeniería" in n or "tecnología" in n: return "Ingeniería y Tecnología"
    if "medicina" in n or "salud" in n or "enfermería" in n or "odontología" in n or "kinesiología" in n or "obstetricia" in n or "terapia" in n or "nutrición" in n or "veterinaria" in n or "fonoaudiología" in n: return "Salud"
    if "derecho" in n or "psicología" in n or "periodismo" in n or "administración pública" in n or "sociología" in n or "antropología" in n or "ciencia política" in n or "trabajo social" in n: return "Ciencias Sociales"
    if "arquitectura" in n or "diseño" in n or "cine" in n or "arte" in n: return "Arte y Diseño"
    if "comercial" in n or "negocios" in n or "contador" in n: return "Administración y Negocios"
    if "pedagogía" in n or "enseñanza" in n: return "Educación"
    if "biología" in n or "química" in n or "astronomía" in n or "geología" in n or "biotecnología" in n or "física" in n or "geografía" in n or "bioquímica" in n or "agronomía" in n: return "Ciencias Naturales"
    return "Otras"

def get_weights(area):
    if area == "Ingeniería y Tecnología": return {"nem": 10, "ranking": 25, "lectora": 10, "matematica1": 25, "matematica2": 20, "electiva": 10}
    if area == "Salud": return {"nem": 20, "ranking": 20, "lectora": 15, "matematica1": 20, "matematica2": 0, "electiva": 25}
    if area == "Ciencias Sociales": return {"nem": 10, "ranking": 40, "lectora": 20, "matematica1": 10, "matematica2": 0, "electiva": 20}
    if area == "Arte y Diseño": return {"nem": 10, "ranking": 30, "lectora": 20, "matematica1": 30, "matematica2": 0, "electiva": 10}
    if area == "Administración y Negocios": return {"nem": 10, "ranking": 20, "lectora": 15, "matematica1": 45, "matematica2": 0, "electiva": 10}
    if area == "Educación": return {"nem": 20, "ranking": 30, "lectora": 15, "matematica1": 25, "matematica2": 0, "electiva": 10}
    if area == "Ciencias Naturales": return {"nem": 15, "ranking": 25, "lectora": 15, "matematica1": 20, "matematica2": 10, "electiva": 15}
    return {"nem": 15, "ranking": 25, "lectora": 20, "matematica1": 25, "matematica2": 0, "electiva": 15}

final_list = existing_data[:]
seen_keys = set()
for item in final_list:
    seen_keys.add((item['nombre'].lower(), item['universidad'].lower()))

for c in chunks:
    key = (c['nombre'].lower(), c['universidad'].lower())
    if key in seen_keys:
        continue
    
    area = get_area(c['nombre'], c['tags'])
    final_list.append({
        "id": c['id_carrera'].lower(),
        "universidad": c['universidad'],
        "abreviatura": get_abreviatura(c['universidad']),
        "nombre": c['nombre'],
        "area": area,
        "ubicacion": c['ubicacion'],
        "descripcion": f"Estudia {c['nombre']} en la {c['universidad']}, una excelente oportunidad para tu desarrollo profesional.",
        "intereses": [t.lower() for t in c['tags']],
        "puntajes": get_weights(area),
        "puntajeCorte2024": c['puntaje_corte']
    })
    seen_keys.add(key)

print(json.dumps(final_list, indent=2, ensure_ascii=False))
