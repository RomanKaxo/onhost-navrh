"""Compare computed hover and keyboard-focus states of each control style on every route."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,required=True);args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
root=Path(__file__).resolve().parents[1]
routes=sorted('/'+str(f.parent.relative_to(root/'dist')) for f in (root/'dist').rglob('index.html'))
routes=['/' if x=='/.' else x for x in routes]+['/404.html']
signature='''e=>{const props=['color','backgroundColor','borderColor','opacity','translate','textDecorationColor'];return [getComputedStyle(e),getComputedStyle(e,'::before'),getComputedStyle(e,'::after')].map(s=>props.map(p=>s[p])).flat().join('|')}'''
findings=[];checked=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--enable-unsafe-swiftshader'])
 for width in [1440,390]:
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');page.set_default_timeout(4000)
  for route in routes:
   page.goto('http://127.0.0.1:4322/onhost-navrh'+route);page.wait_for_load_state('networkidle')
   page.add_style_tag(content='*,*::before,*::after {transition:none!important;animation:none!important}')
   # One representative per exact tag/classes (repeated links share CSS).
   controls=page.locator('a,button,summary,input').all();seen=set()
   for e in controls:
    if not e.is_visible() or e.evaluate("e=>!!e.closest('.site-nav__panel,.mobile-nav')"):continue
    key=e.evaluate("e=>e.tagName+' '+e.className+' '+(e.closest('.prose,.crumbs,.site-footer__bottom,.site-footer__col,.site-footer__contact')?.className||'')")
    if key in seen:continue
    seen.add(key)
    if e.evaluate("e=>e.matches('.skip,input')"):continue
    try:
     e.scroll_into_view_if_needed();page.mouse.move(0,0);e.evaluate('e=>e.blur()')
     normal=e.evaluate(signature);e.hover();hover=e.evaluate(signature)
     page.mouse.move(0,0);page.keyboard.press('Shift');e.focus()
     focus=e.evaluate("e=>({outline:getComputedStyle(e).outlineStyle,width:getComputedStyle(e).outlineWidth})")
     if normal==hover:findings.append(dict(route=route,width=width,kind='hover',control=key,text=e.inner_text()[:100]))
     if focus['outline']=='none' or focus['width']=='0px':findings.append(dict(route=route,width=width,kind='focus',control=key,text=e.inner_text()[:100]))
     checked.append(dict(route=route,width=width,control=key,hover=normal!=hover,focus=focus))
    except Exception as error:findings.append(dict(route=route,width=width,kind='test-error',control=key,error=str(error)[:250]))
   print(width,route,len(findings),flush=True)
   (args.output/'styles.json').write_text(json.dumps(dict(checked=checked,findings=findings),ensure_ascii=False,indent=2))
  page.close()
 b.close()
print(json.dumps(findings,ensure_ascii=False,indent=2));raise SystemExit(bool(findings))
