from pathlib import Path
from PIL import Image
from io import BytesIO
import json,base64,math
p=Path('/Users/thomashall/Repositories/sg-ui/docs/developer/final-acceptance/wave-04/05/batch/d15-current-inventory')
def specs(x):
 for s in x.get('suites',[]):yield from specs(s)
 yield from x.get('specs',[])
def attach(run):
 for s in specs(json.loads((p/run/'results.json').read_text())):
  if s['title'].startswith('toggle selected'):
   return s['tests'][0]['results'][0]['attachments']
new=attach('native-05');old=attach('native-02');obs=json.loads(base64.b64decode(next(a['body'] for a in new if a['name']=='observed-state-geometry')));rows=[]
for o in obs:
 name=f"toggle-{o['theme']}-{o['density']}-{o['direction']}-active"
 rect=o['paintedLabel']['scopeRectangle'];box=(math.floor(rect['x']),math.floor(rect['y']),math.floor(rect['x'])+o['paintedLabel']['width'],math.floor(rect['y'])+o['paintedLabel']['height'])
 for run,attachments in [('native-02',old),('native-05',new)]:
  a=next(a for a in attachments if a['name']==name);im=Image.open(BytesIO(base64.b64decode(a['body']))).convert('RGB').crop(box);values=[]
  for y in range(im.height):
   for x in range(im.width):
    if x<im.width*.1 or x>=im.width*.9 or y<im.height*.1 or y>=im.height*.9:continue
    pixel=im.getpixel((x,y))
    v=[c/255 for c in pixel];v=[c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4 for c in v];values.append(sum(c*w for c,w in zip(v,[.2126,.7152,.0722])))
  contrast=(max(values)+.05)/(min(values)+.05);dark=sum(v<.2 for v in values);light=sum(v>.8 for v in values);passed=contrast>=3 and dark>=5 and light>=5
  rows.append({'run':run,'context':name,'rectangle':rect,'contrast':contrast,'darkPixels':dark,'lightPixels':light,'paintAssertionPasses':passed,'expectedPass':run=='native-05'})
  assert passed==(run=='native-05'),rows[-1]
  im.save(p/(name+'-'+run+'-text-range.png'))
(p/'paint-regression.json').write_text(json.dumps({'method':'Retained original and corrected immutable-output screenshots; inner 80% of identical DOM text Range crop excludes backplate edges/border/focus. Same >=3 paint contrast and >=5 dark/light pixel assertion as maintained browser case. No OCR.','rows':rows},indent=2)+'\n')
print(json.dumps(rows,indent=2))
