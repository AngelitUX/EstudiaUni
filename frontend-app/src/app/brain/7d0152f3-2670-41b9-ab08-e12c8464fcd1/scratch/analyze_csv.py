import pandas as pd
import json

# Try reading the CSV with proper encoding
try:
    df = pd.read_csv(r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\public\Matricula_2025_WEB_15_07_2025.csv', sep=';', encoding='latin-1')
except Exception as e:
    print(f"Error reading CSV: {e}")
    exit()

# Filter for Universities and Regular Undergraduate plans
# Looking at the sample:
# CLASIFICACIÓN INSTITUCIÓN NIV 1: 'Universidades'
# NIVEL GLOBAL: 'Pregrado'
# TIPO DE PLAN DE LA CARRERA: 'Plan Regular'

# Note: Column names might have special chars due to encoding
# We'll use index-based access or clean them
df.columns = [c.strip() for c in df.columns]

# Filter
universities_df = df[
    (df['CLASIFICACIN INSTITUCIN NIV'].str.contains('Universidades', na=False)) &
    (df['NIVEL GLOBAL'] == 'Pregrado') &
    (df['TIPO DE PLAN DE LA CARRERA'] == 'Plan Regular')
]

# Select columns
# NOMBRE INSTITUCI, NOMBRE CARRERA, REGI, COMUNA, REA DEL CONOCIMIENTO, CDIGO CARRE
careers = universities_df[['NOMBRE INSTITUCI', 'NOMBRE CARRERA', 'REGI', 'COMUNA', 'REA DEL CONOCIMIENTO', 'CDIGO CARRE']].drop_duplicates()

print(f"Total unique university careers found: {len(careers)}")
print(careers.head(10).to_string())
