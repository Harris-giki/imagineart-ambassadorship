"""
remove-person-bg.py
===================================================================
One-off script used to fix the cinematic-intro studio assets.

person1/2/3.png shipped as RGB with a solid ~#F6F6F6 light-gray matte baked in
(no alpha) — they'd render as opaque gray rectangles and hide the backdrop. A
naive color-key can't be used because person1/person3 hold TRANSLUCENT umbrellas
that are as light as the matte (it would punch holes in them). So we use rembg's
U^2-Net subject segmentation, which keeps the person + umbrella as foreground and
removes the gray to true alpha.

person4.png is already a correct transparent RGBA cutout — left untouched.
background.png is the deepest plate — left as RGB (no alpha needed).

Usage (in a venv):
    pip install "rembg[cpu]" pillow numpy
    python scripts/remove-person-bg.py
Downloads the u2net model (~176MB) to ~/.u2net on first run, then overwrites
public/new-background/person1.png, person2.png, person3.png as RGBA.
"""

from rembg import remove, new_session
from PIL import Image

TARGETS = ["person1", "person2", "person3"]
DIR = "public/new-background"

session = new_session("u2net")
for name in TARGETS:
    src = f"{DIR}/{name}.png"
    img = Image.open(src).convert("RGB")
    out = remove(img, session=session)  # -> RGBA with the gray matte removed
    out.save(src)
    print(f"{name}: re-saved as {out.mode} {out.size}")
