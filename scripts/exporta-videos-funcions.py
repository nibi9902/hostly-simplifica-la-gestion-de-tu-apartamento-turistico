"""Exporta els vídeos del kit de la demo animada a la web de màrqueting.

Per a cada funcionalitat: <slug>.mp4 (1280×720, H.264 + AAC, faststart), <slug>.webp (portada: el títol),
<slug>-mini.webp (miniatura de l'índex: un moment del pas 2) i <slug>.es.vtt (subtítols de la veu, des de la
línia de temps del kit). I la demo general de /demo (la v6): public/assets/demo/lo-que-hace-hostly.*.
Es pot tornar a passar sempre que el kit torni a renderitzar algun vídeo.
Imprimeix la durada de cada vídeo i on comença cada frase de la veu (per a `src/lib/data/videosFuncions.ts`,
on hi ha els capítols de cada funcionalitat).
Ús: python3 -I scripts/exporta-videos-funcions.py (cal ffmpeg i cwebp).
"""
import json
import os
import subprocess
import tempfile

# El kit de vídeos (fora d'aquest repositori) i la carpeta de la web on van
KIT = os.path.expanduser(os.environ.get('KIT_VIDEOS', '~/hostly-videos/demo-animada'))
PUBLIC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'assets')
WEB = os.path.join(PUBLIC, 'funcions')

MAPA = {
    'web': 'web-de-reservas-directas',
    'burocracia': 'burocracia',
    'checkin': 'check-in-online',
    'limpiezas': 'gestion-de-limpiezas',
    'precios': 'precios-dinamicos',
    'canales': 'channel-manager',
    'ia': 'ia-whatsapp',
    'mensajes': 'mensajeria-programada',
    'roles': 'multi-rol',
    'conecta': 'conecta-todo',
    'finanzas': 'finanzas',
}

ENC = ['-vf', 'scale=1280:720:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27',
       '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart']


def run(args):
    subprocess.run(args, check=True)


def ts(s):
    h = int(s // 3600)
    m = int((s % 3600) // 60)
    return f"{h:02d}:{m:02d}:{s - h * 3600 - m * 60:06.3f}"


def trossos(text, max_lletres=84):
    """Una frase llarga, en trossos que es llegeixin d'una ullada (talla on hi ha puntuació)."""
    if len(text) <= max_lletres:
        return [text]
    import re
    peces = [p for p in re.split(r'(?<=[.:;,])\s+', text) if p]
    sortida, actual = [], ''
    for p in peces:
        if actual and len(actual) + 1 + len(p) > max_lletres:
            sortida.append(actual)
            actual = p
        else:
            actual = f'{actual} {p}'.strip()
    if actual:
        sortida.append(actual)
    return sortida


def subtitols(frases, desti):
    """frases: [(inici_s, fi_s, text)]. Les llargues es reparteixen el temps segons les lletres de cada tros."""
    n = 0
    with open(desti, 'w') as f:
        f.write('WEBVTT\n\n')
        for a, b, text in frases:
            parts = trossos(text)
            total = sum(len(p) for p in parts)
            t = a
            for p in parts:
                d = (b - a) * len(p) / total
                n += 1
                f.write(f"{n}\n{ts(t)} --> {ts(t + d)}\n{p}\n\n")
                t += d


def fotograma(src, t, amplada, desti, qualitat):
    with tempfile.TemporaryDirectory() as tmp:
        png = os.path.join(tmp, 'f.png')
        run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', src, '-frames:v', '1',
             '-vf', f'scale={amplada}:-2:flags=lanczos', png])
        run(['cwebp', '-quiet', '-q', str(qualitat), png, '-o', desti])


os.makedirs(WEB, exist_ok=True)
for kit, slug in MAPA.items():
    src = f'{KIT}/renders/funcions/{kit}-landing.mp4'
    tl = json.load(open(f'{KIT}/remotion/src/videos/tl/{kit}-landing.json'))
    run(['ffmpeg', '-v', 'error', '-y', '-i', src, *ENC, f'{WEB}/{slug}.mp4'])
    fotograma(src, 0.8, 1280, f'{WEB}/{slug}.webp', 82)
    pas2 = tl['lines'][1]
    fotograma(src, round(pas2['start'] / 30 + 2.6, 2), 960, f'{WEB}/{slug}-mini.webp', 80)
    subtitols([(l['start'] / 30, (l['start'] + l['frames']) / 30, l['text']) for l in tl['lines']], f'{WEB}/{slug}.es.vtt')
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
                                f'{WEB}/{slug}.mp4'], capture_output=True, text=True, check=True).stdout)
    inicis = ', '.join(f"{l['start'] / 30:.2f}" for l in tl['lines'])
    print(f"{slug}\t{dur:.2f} s\t{os.path.getsize(f'{WEB}/{slug}.mp4') / 1e6:.2f} MB\tfrases: {inicis}")

# La demo general de /demo: la v6 (aprovada pel Biel el 17-10). Les frases surten de la seva veu
# (audio/veu/veu-es.json) i dels fotogrames on comença cadascuna (VEU, a DemoV6.tsx).
import re
DEMO = f'{KIT}/renders/demo-v6.mp4'
DEST = os.path.join(PUBLIC, 'demo')
os.makedirs(DEST, exist_ok=True)
veu = json.load(open(f'{KIT}/audio/veu/veu-es.json'))
VEU = [int(x) for x in re.search(r'export const VEU = \[([^\]]+)\]', open(f'{KIT}/remotion/src/demo/DemoV6.tsx').read()).group(1).split(',')]
run(['ffmpeg', '-v', 'error', '-y', '-i', DEMO, *[x if x != '27' else '25' for x in ENC], f'{DEST}/lo-que-hace-hostly.mp4'])
fotograma(DEMO, 1.2, 1280, f'{DEST}/lo-que-hace-hostly.webp', 82)
subtitols([(VEU[int(k)] / 30, (VEU[int(k)] + v['fotogrames']) / 30, v['text']) for k, v in sorted(veu.items(), key=lambda kv: int(kv[0]))],
          f'{DEST}/lo-que-hace-hostly.es.vtt')
print(f"demo\t{os.path.getsize(f'{DEST}/lo-que-hace-hostly.mp4') / 1e6:.2f} MB")

# La mateixa demo en català («El que fa Hostly per tu», DemoLargaCa, veu de l'Anna, 17-10): les frases
# surten de la seva línia de temps. Va a /ca/demo.
DEMO_CA = f'{KIT}/renders/demo-larga-ca.mp4'
if os.path.exists(DEMO_CA):
    tl_ca = json.load(open(f'{KIT}/remotion/src/videos/tl/demo-larga-ca.json'))
    run(['ffmpeg', '-v', 'error', '-y', '-i', DEMO_CA, *[x if x != '27' else '25' for x in ENC], f'{DEST}/el-que-fa-hostly.mp4'])
    fotograma(DEMO_CA, 1.2, 1280, f'{DEST}/el-que-fa-hostly.webp', 82)
    subtitols([(l['start'] / 30, (l['start'] + l['frames']) / 30, l['text']) for l in tl_ca['lines']], f'{DEST}/el-que-fa-hostly.ca.vtt')
    print(f"demo ca\t{os.path.getsize(f'{DEST}/el-que-fa-hostly.mp4') / 1e6:.2f} MB")
