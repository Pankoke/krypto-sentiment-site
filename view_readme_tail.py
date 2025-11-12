from pathlib import Path
lines = Path('README.md').read_text(encoding='utf-8').splitlines()
for i,line in enumerate(lines, start=1):
    if i>120:
        print(f"{i:03}: {line}")
