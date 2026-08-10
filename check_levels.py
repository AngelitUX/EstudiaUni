import re
with open('frontend-app/src/app/features/learning-path/data/seed-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for match in re.finditer(r"id:\s*'([^']+)',.*?level:\s*(\d+).*?order:\s*(\d+)", text, re.DOTALL):
    if "sec-1-" in match.group(1):
        if match.group(0).count("id:") == 1:
            print(f"{match.group(1)}: level={match.group(2)}, order={match.group(3)}")
