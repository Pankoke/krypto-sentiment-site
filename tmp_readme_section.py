from pathlib import Path
text = Path('README.md').read_text('utf-8')
start = text.index('## Tests')
end = text.index('## Encoding')
print(text[start:end])
