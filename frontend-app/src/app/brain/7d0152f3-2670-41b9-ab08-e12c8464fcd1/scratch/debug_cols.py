import pandas as pd
import json

try:
    # Use latin-1 and try to fix encoding issues
    df = pd.read_csv(r'C:\Users\lucas\Desktop\proyecto\estudiauni.cl\frontend-app\public\Matricula_2025_WEB_15_07_2025.csv', sep=';', encoding='latin-1')
except Exception as e:
    print(f"Error reading CSV: {e}")
    exit()

# Print all columns to find the right ones
print("Found columns:")
for i, col in enumerate(df.columns):
    print(f"{i}: {col}")

# Let's try to map them by index if names are tricky
# 9: CLASIFICACIÓN INSTITUCIÓN NIVEL 1 (based on previous head output)
# 13: NOMBRE INSTITUCIÓN
# 15: REGIÓN
# 17: COMUNA
# 19: NOMBRE CARRERA
# 20: ÁREA DEL CONOCIMIENTO
# 34: CÓDIGO CARRERA

# But wait, let's verify with the printed list.
