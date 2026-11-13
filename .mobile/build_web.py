"""Build the public site, then copy only that package into the mobile shell."""
import runpy
import shutil
from pathlib import Path

mobile = Path(__file__).resolve().parent
root = mobile.parent
runpy.run_path(str(root / "scripts" / "build_pages.py"))
source = root / "_site"
destination = mobile / "www"
if destination.exists():
    shutil.rmtree(destination)
shutil.copytree(source, destination)
if not (destination / "index.html").is_file():
    raise RuntimeError("Mobile package is missing index.html")

