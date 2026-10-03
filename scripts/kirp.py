# Ekran görüntüsünden bölge kırpar: python scripts/kirp.py girdi.jpg y0 y1 [cikti.jpg] [olcek]
import sys
from PIL import Image
g=sys.argv[1]; y0=int(sys.argv[2]); y1=int(sys.argv[3])
c=sys.argv[4] if len(sys.argv)>4 else g.replace('.jpg',f'-{y0}.jpg')
o=float(sys.argv[5]) if len(sys.argv)>5 else 1
im=Image.open(g); im=im.crop((0,y0,im.width,min(y1,im.height)))
if o!=1: im=im.resize((int(im.width*o),int(im.height*o)))
im.save(c,quality=85); print(c)
