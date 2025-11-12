from pathlib import Path
text = Path('lib/news/aggregator.ts').read_text().splitlines()
for i,line in enumerate(text, start=1):
    if 90<=i<=140:
        print(f"{i:04}: {line}")


