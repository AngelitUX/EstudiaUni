import os
import json
import re
import pdfplumber

assets_dir = "src/assets"
pdf_dir = "src/pruebasDemre"

def extract_answers_from_pdf(pdf_path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"
                
        # Regex to find: Number(optional *), Space, Letter(A-E)
        # e.g. "1 E", "2* C", "41 D"
        pattern = re.compile(r'\b(\d+)\*?\s+([A-E])\b')
        matches = pattern.findall(text)
        
        # Sort by question number to be safe
        answers = {}
        for match in matches:
            q_num = int(match[0])
            ans = match[1]
            answers[q_num] = ans
            
        return answers
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
        return None

for filename in os.listdir(assets_dir):
    if filename.endswith("-preguntas-db.json"):
        base_name = filename.replace("-preguntas-db.json", "").upper()
        pdf_name = f"{base_name}-SOLUCION.pdf"
        pdf_path = os.path.join(pdf_dir, pdf_name)
        
        if os.path.exists(pdf_path):
            print(f"Processing {filename} with {pdf_name}...")
            answers = extract_answers_from_pdf(pdf_path)
            
            if answers:
                json_path = os.path.join(assets_dir, filename)
                with open(json_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                updated_count = 0
                for item in data:
                    q_order = item.get("order")
                    if q_order in answers:
                        item["correctAnswer"] = answers[q_order]
                        updated_count += 1
                        
                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                    
                print(f"  -> Updated {updated_count} answers in {filename}")
            else:
                print(f"  -> Failed to extract answers from {pdf_name}")
        else:
            # print(f"PDF not found for {filename}")
            pass
