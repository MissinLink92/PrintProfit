"""Package tracked public website files, keeping source/review tools out of Pages."""
import shutil
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]
destination = root / '_site'
destination.mkdir(exist_ok=True)
excluded = {'scripts', 'config', 'reports', 'work', 'outputs', 'node_modules'}
private_data = {'data/review-queue.json', 'data/nightly-report.json'}
for relative in subprocess.check_output(['git', 'ls-files', '-z'], cwd=root).decode().split('\0'):
    if not relative:
        continue
    parts = Path(relative).parts
    if parts[0].startswith('.') or parts[0] in excluded or relative in private_data:
        continue
    if relative.lower().endswith(('.md', '.py', '.yml', '.yaml', '.csv', '.zip', '.pdf')):
        continue
    source = root / relative
    if source.is_file():
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
(destination / '.nojekyll').touch()
