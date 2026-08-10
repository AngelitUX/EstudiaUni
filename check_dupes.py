import re
from collections import Counter
with open("frontend-app/src/app/features/learning-path/data/seed-data.ts", "r", encoding="utf-8") as f:
    content = f.read()
ids = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", content)
counts = Counter(ids)
dupes = {k: v for k, v in counts.items() if v > 1}
print("Duplicate IDs:", dupes)
