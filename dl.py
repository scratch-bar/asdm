# Import
import requests
import os

# Create 'output'
if not os.path.exists('output'):
    os.mkdir('output')

# Download 'Scratch Setup.exe' for Windows
r = requests.get('https://downloads.scratch.mit.edu/desktop/Scratch%20Setup.exe', stream=True)

with open(r'./output/scratch-win.exe', "wb") as f:
    for chunk in r.iter_content(chunk_size=512):
        f.write(chunk)

# Download 'Scratch.dmg' for Mac

r = requests.get('https://downloads.scratch.mit.edu/desktop/Scratch.dmg', stream=True)

with open(r'./output/scratch-mac.dmg', "wb") as f:
    for chunk in r.iter_content(chunk_size=512):
        f.write(chunk)
