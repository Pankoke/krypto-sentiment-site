from pathlib import Path
for i,line in enumerate(Path('lib/news/aggregator.ts').read_text(encoding='utf-8').splitlines(), start=1):
    if i <= 80:
        print(f"{i:04}: {line}")


