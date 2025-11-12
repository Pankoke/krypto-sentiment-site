import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')
lines = Path('README.md').read_text(encoding='utf-8').splitlines()
for i,line in enumerate(lines, start=1):
    if i >= 100:
        print(f"{i:03}: {line}")
