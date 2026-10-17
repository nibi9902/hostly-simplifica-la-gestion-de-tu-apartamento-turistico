"""Exporta els vídeos de les funcionalitats (kit de la demo animada) a la web de màrqueting.

Per a cada funcionalitat: <slug>.mp4 (1280×720, H.264 + AAC, faststart), <slug>.webp (portada: el títol),
<slug>-mini.webp (miniatura de l'índex: un moment del pas 2) i <slug>.es.vtt (subtítols de la veu, des de la
línia de temps del kit). Es pot tornar a passar sempre que el kit torni a renderitzar algun vídeo.
Imprimeix la durada de cada vídeo (per a `src/lib/data/videosFuncions.ts`).
Ús: python3 -I scripts/exporta-videos-funcions.py (cal ffmpeg i cwebp).
"""
import json
import os
import subprocess
import tempfile

# El kit de vídeos (fora d'aquest repositori) i la carpeta de la web on van
KIT = os.path.expanduser(os.environ.get('KIT_VIDEOS', '~/hostly-videos/demo-animada'))
WEB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'assets', 'funcions')

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
    with open(f'{WEB}/{slug}.es.vtt', 'w') as f:
        f.write('WEBVTT\n\n')
        for i, l in enumerate(tl['lines'], 1):
            f.write(f"{i}\n{ts(l['start'] / 30)} --> {ts((l['start'] + l['frames']) / 30)}\n{l['text']}\n\n")
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
                                f'{WEB}/{slug}.mp4'], capture_output=True, text=True, check=True).stdout)
    print(f"{slug}\t{dur:.2f}\t{os.path.getsize(f'{WEB}/{slug}.mp4') / 1e6:.2f} MB")
