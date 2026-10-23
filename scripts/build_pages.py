"""Package tracked public website files, keeping source/review tools out of Pages."""
import shutil
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]
destination = root / '_site'
if destination.exists():
    shutil.rmtree(destination)
destination.mkdir()
public_config = {'config/analytics-config.js', 'config/firebase-config.js', 'config/billing-config.js'}
excluded = {'scripts', 'config', 'reports', 'work', 'outputs', 'node_modules', 'functions', 'docs', 'admin'}
private_data = {'data/review-queue.json', 'data/nightly-report.json', 'firebase.billing.json', 'firebase.admin.json'}
for relative in subprocess.check_output(['git', 'ls-files', '-z'], cwd=root).decode().split('\0'):
    if not relative:
        continue
    parts = Path(relative).parts
    if parts[0].startswith('.') or (parts[0] in excluded and relative not in public_config) or relative in private_data:
        continue
    if relative.lower().endswith(('.md', '.py', '.yml', '.yaml', '.csv', '.zip', '.pdf')):
        continue
    source = root / relative
    if source.is_file():
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
(destination / '.nojekyll').touch()

for relative in public_config:
    if not (destination / relative).is_file():
        raise ValueError('Public browser configuration missing from site package: ' + relative)
