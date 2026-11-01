"""Actual navigation, validation, reduced-motion globe and touch regression checks."""
from playwright.sync_api import sync_playwright, expect
from pathlib import Path
import argparse, hashlib, json

parser=argparse.ArgumentParser()
parser.add_argument('--output',type=Path,required=True)
args=parser.parse_args()
args.output.mkdir(parents=True,exist_ok=True)
base='http://127.0.0.1:4322/onhost-navrh'
checks=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--enable-unsafe-swiftshader'])
 for width in [1440,390]:
  context=browser.new_context(viewport={'width':width,'height':900},has_touch=width==390,is_mobile=width==390,reduced_motion='reduce')
  page=context.new_page()
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base+'/');page.wait_for_load_state('networkidle')
  switch=page.locator('button[data-power]')
  expect(switch).to_have_attribute('aria-pressed','true')
  switch.click();expect(switch).to_have_attribute('aria-pressed','false')
  switch.focus();page.keyboard.press('Space');expect(switch).to_have_attribute('aria-pressed','true')
  checks.append(f'{width}: power switch responds to pointer and keyboard')
  if width==390:
   page.locator('[data-menu-toggle]').click()
   for summary in page.locator('.mobile-nav summary').all():summary.click()
   page.locator('.mobile-nav__login').focus();page.keyboard.press('Tab')
   expect(page.locator('.mobile-nav')).to_be_hidden()
   assert switch.evaluate('e=>e===document.activeElement')
   assert switch.evaluate('e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return e===hit||e.contains(hit)}')
   checks.append('390: Tab exits mobile menu into visible content')
  field=page.locator('#domain-q')
  page.get_by_role('button',name='Pokračovat s doménou').click()
  assert page.url.rstrip('/')==base
  assert not field.evaluate('e=>e.checkValidity()')
  field.fill('   ')
  page.get_by_role('button',name='Pokračovat s doménou').click()
  assert page.url.rstrip('/')==base
  assert not field.evaluate('e=>e.checkValidity()')
  field.fill('qa-example.cz')
  page.get_by_role('button',name='Pokračovat s doménou').click()
  page.wait_for_url('**/domeny?q=qa-example.cz')
  expect(page.locator('[data-domain-name]')).to_have_text('qa-example.cz')
  expect(page.locator('[data-domain-request]')).to_be_visible()
  page.screenshot(path=str(args.output/f'domain-result-{width}.png'))
  checks.append(f'{width}: empty-domain validation + submitted query visible + honest availability message')
  with page.expect_navigation(wait_until='domcontentloaded') as navigation:
   page.locator('[data-domain-request] a').click()
  assert page.url.startswith('https://admin.onhost.cz/panel')
  checks.append(f'{width}: domain CTA opens official external client panel, HTTP {navigation.value.status}')
  page.goto(base+'/domeny?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E')
  expect(page.locator('[data-domain-name]')).to_have_text('<img src=x onerror=alert(1)>')
  assert page.locator('[data-domain-name] img').count()==0
  checks.append(f'{width}: query rendered as text, no HTML injection')
  page.goto(base+'/blog')
  page.locator('.prose a').filter(has_text='Kontakt').click()
  page.wait_for_url('**/onhost-navrh/kontakt')
  expect(page.get_by_role('heading',level=1)).to_have_attribute('aria-label','Jsme tu pro vás.')
  if width==1440:
   page.get_by_role('button',name='Hosting',exact=True).click()
   page.locator('.site-nav__panel a').filter(has_text='Webhosting').click()
  else:
   page.locator('[data-menu-toggle]').click()
   page.locator('.mobile-nav summary').filter(has_text='Hosting').click()
   page.locator('.mobile-nav a').filter(has_text='Webhosting').click()
  page.wait_for_url('**/onhost-navrh/webhosting')
  page.get_by_role('link',name='Vybrat tarif',exact=True).first.click()
  expect(page).to_have_url(base+'/webhosting#tarify')
  assert page.locator('#tarify').bounding_box()['y']>=76
  checks.append(f'{width}: Markdown link + client navigation + menu link + tariff anchor')
  page.goto(base+'/datacenter');page.wait_for_load_state('networkidle')
  canvas=page.locator('.network-globe canvas');canvas.scroll_into_view_if_needed()
  expect(canvas).to_have_css('opacity','1')
  page.wait_for_timeout(500)
  before=canvas.screenshot()
  page.wait_for_timeout(150)
  assert before==canvas.screenshot(), 'Reduced-motion globe is still rotating'
  canvas.focus();page.keyboard.press('ArrowRight');page.wait_for_timeout(100)
  after=canvas.screenshot()
  assert before!=after,'Keyboard did not rotate globe'
  box=canvas.bounding_box();x=box['x']+box['width']*.5;y=box['y']+box['height']*.5
  if width==390:
   cdp=context.new_cdp_session(page)
   cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
   for step in range(1,11): cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+step*7,'y':y}]})
   cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
  else:
   page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+80,y,steps=10);page.mouse.up()
  page.wait_for_timeout(100)
  dragged=canvas.screenshot()
  assert after!=dragged,'Drag did not rotate globe'
  canvas.screenshot(path=str(args.output/f'globe-reduced-drag-{width}.png'))
  checks.append(f'{width}: reduced-motion stable poster, keyboard rotation, '+('touch swipe' if width==390 else 'mouse drag'))
  response=page.goto(base+'/qa-neexistujici-stranka')
  assert response.status==404
  expect(page.get_by_role('heading',level=1)).to_have_text('Ztraceno ve vesmíru.')
  page.get_by_role('link',name='Zpět na úvod').click();page.wait_for_url(base)
  checks.append(f'{width}: real 404 + return to home')
  assert not errors,errors
  context.close()
 browser.close()
(args.output/'flows.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2))
print(json.dumps(checks,ensure_ascii=False,indent=2))
