"""Browser audit of the built proposal. Requires Python Playwright outside project deps.

uv run --with playwright python scripts/qa-buttons.py --output /path/to/evidence
Navigation is intercepted only for exhaustive click hit-testing; each destination is
also fetched independently. Forms, disclosures, switches and globe use real behavior.
"""
import argparse
import hashlib
import json
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:4322/onhost-navrh')
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--screenshots', action='store_true')
parser.add_argument('--routes', nargs='*')
parser.add_argument('--widths', nargs='*',type=int,default=[1440,390])
parser.add_argument('--shard',default='1/1',help='Index/count, e.g. 1/3')
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
root = Path(__file__).resolve().parents[1]
routes = sorted('/' + str(f.parent.relative_to(root / 'dist')) for f in (root / 'dist').rglob('index.html'))
routes = ['/' if r == '/.' else r for r in routes] + ['/404.html']
if args.routes: routes=args.routes
shard,count=map(int,args.shard.split('/'))
routes=routes[shard-1::count]
results, findings, destinations = [], [], {}

def record(route, width, kind, detail):
    findings.append(dict(route=route, width=width, kind=kind, detail=detail))
    print('FINDING', width, route, kind, detail, flush=True)
    (args.output/'findings.json').write_text(json.dumps(findings,ensure_ascii=False,indent=2))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=['--enable-unsafe-swiftshader'])
    for width in args.widths:
        context = browser.new_context(viewport=dict(width=width, height=900), device_scale_factor=1)
        page = context.new_page()
        page.set_default_timeout(4000)
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        for route in routes:
            print('START',width,route,flush=True)
            errors.clear()
            url = args.base_url + route
            response = page.goto(url)
            page.wait_for_load_state('networkidle')
            # Freeze CSS transitions for repeatable hit boxes. Dedicated flow
            # checks retain the site's normal interaction behavior.
            page.add_style_tag(content='a,button,summary,[data-reveal],.hero__copy,.phero__copy>* {transition:none!important;animation:none!important}')
            if response.status != 200:
                record(route, width, 'status', response.status)
            slug = route.strip('/').replace('/', '__') or 'home'
            inventory = page.locator('a,button,summary,input,select,textarea,canvas[tabindex]').evaluate_all('''els => els.map((e,i)=>({index:i,tag:e.tagName,text:(e.getAttribute('aria-label')||e.textContent||e.getAttribute('placeholder')||'').trim(),href:e.getAttribute('href'),class:e.className}))''')
            for item in inventory:
                if item['href']:
                    destination = urljoin(url, item['href'])
                    destinations.setdefault(destination, []).append(dict(route=route, width=width, text=item['text']))
            result = dict(route=route, width=width, inventory=inventory, links=[], disclosures=0, switches=0)
            # Native clicks are observed before Astro's navigation handler, with
            # navigation suppressed so every element on this page can be checked.
            page.evaluate('''() => { window.__qaClicks=[]; window.addEventListener('click',e=>{const a=e.target.closest?.('a'); if(a){window.__qaClicks.push(a.getAttribute('href')); e.preventDefault(); e.stopImmediatePropagation();}},true); }''')

            def link_click(link):
                href = link.get_attribute('href')
                label = (link.get_attribute('aria-label') or link.inner_text()).strip()
                try:
                    page.keyboard.press('Shift')
                    link.focus()
                    focus = link.evaluate("e=>({outline:getComputedStyle(e).outlineStyle,width:getComputedStyle(e).outlineWidth,visible:e.matches(':focus-visible')})")
                    if focus['visible'] and (focus['outline'] == 'none' or focus['width'] == '0px'):
                        record(route, width, 'focus', label)
                    before = page.evaluate('window.__qaClicks.length')
                    link.scroll_into_view_if_needed()
                    # Inline links can wrap. Their union bounding box may have
                    # its center in plain text between lines; use a real fragment.
                    box=link.evaluate('e=>{const r=[...e.getClientRects()].find(r=>r.width&&r.height);return {x:r.x,y:r.y,width:r.width,height:r.height}}')
                    x,y=box['x']+box['width']/2,box['y']+box['height']/2
                    hit=link.evaluate('(e,p)=>{const hit=document.elementFromPoint(p.x,p.y);return e===hit||e.contains(hit)}',dict(x=x,y=y))
                    if not hit:
                        # Standard scrolling can place focused text behind the
                        # sticky header. Center it as a user would by scrolling.
                        link.evaluate("e=>e.scrollIntoView({block:'center'})")
                        box=link.evaluate('e=>{const r=[...e.getClientRects()].find(r=>r.width&&r.height);return {x:r.x,y:r.y,width:r.width,height:r.height}}');x,y=box['x']+box['width']/2,box['y']+box['height']/2
                    page.mouse.move(x,y)
                    page.mouse.click(x,y)
                    clicked = page.evaluate('window.__qaClicks.slice(-1)[0]')
                    if page.evaluate('window.__qaClicks.length') != before + 1 or clicked != href:
                        record(route, width, 'click', dict(text=label, href=href))
                    result['links'].append(dict(text=label, href=href, clicked=True))
                except Exception as e:
                    record(route, width, 'click', dict(text=label, href=href, error=str(e)[:400]))
                    result['links'].append(dict(text=label, href=href, clicked=False))

            header = page.locator('[data-header]')
            if header.count():
                if width == 1440:
                    # Closed panels must not consume Tab; ArrowDown enters one,
                    # Escape returns focus to its trigger.
                    first = page.locator('.site-nav__trigger').first
                    first.focus(); page.keyboard.press('Tab')
                    if page.evaluate("!!document.activeElement.closest('.site-nav__panel')"):
                        record(route, width, 'closed-menu-focus', 'Tab enters a closed panel')
                    for trigger in page.locator('.site-nav__trigger').all():
                        trigger.click()
                        panel = page.locator('#' + trigger.get_attribute('aria-controls'))
                        if trigger.get_attribute('aria-expanded') != 'true' or panel.get_attribute('inert') is not None:
                            record(route, width, 'menu', trigger.inner_text())
                        for link in panel.locator('a').all(): link_click(link)
                        page.keyboard.press('Escape')
                        if trigger.get_attribute('aria-expanded') != 'false': record(route, width, 'menu-escape', trigger.inner_text())
                    first.focus(); page.keyboard.press('ArrowDown')
                    if not page.evaluate("!!document.activeElement.closest('.site-nav__panel')"):
                        record(route, width, 'menu-arrow', 'ArrowDown does not enter panel')
                    page.keyboard.press('Escape')
                    if not first.evaluate('e=>e===document.activeElement'): record(route, width, 'menu-focus-return', '')
                else:
                    toggle = page.locator('[data-menu-toggle]')
                    toggle.click()
                    for summary in page.locator('.mobile-nav summary').all():
                        summary.click()
                        if not summary.evaluate('e=>e.parentElement.open'): record(route,width,'mobile-disclosure',summary.inner_text())
                        result['disclosures'] += 1
                        for link in summary.locator('..').locator('a').all(): link_click(link)
                        summary.click()
                    link_click(page.locator('.mobile-nav__login'))
                    page.keyboard.press('Escape')
                    if toggle.get_attribute('aria-expanded') != 'false': record(route,width,'mobile-escape','')
                    if not toggle.evaluate('e=>e===document.activeElement'): record(route,width,'mobile-focus-return','')
                    # Reopening still works after a full interaction cycle.
                    toggle.click()
                    page.locator('.mobile-nav__login').focus();page.keyboard.press('Tab')
                    if toggle.get_attribute('aria-expanded') != 'false': record(route,width,'mobile-tab-exit','Menu covers focused content')

            for link in page.locator('a').all():
                if link.evaluate("e=>!!e.closest('.site-nav__panel,.mobile-nav')"): continue
                if not link.is_visible(): continue
                link_click(link)
            for summary in page.locator('main summary').all():
                summary.scroll_into_view_if_needed()
                summary.click()
                if not summary.evaluate('e=>e.parentElement.open'): record(route,width,'faq-open',summary.inner_text())
                summary.focus(); page.keyboard.press('Enter')
                if summary.evaluate('e=>e.parentElement.open'): record(route,width,'faq-close',summary.inner_text())
                result['disclosures'] += 1
            for switch in page.locator('button[aria-pressed]').all():
                switch.scroll_into_view_if_needed()
                state = switch.get_attribute('aria-pressed')
                switch.click()
                page.wait_for_function('(state)=>document.querySelector("button[aria-pressed]").getAttribute("aria-pressed")!==state',arg=state)
                switch.focus(); page.keyboard.press('Space')
                if switch.get_attribute('aria-pressed') != state: record(route,width,'switch-keyboard','')
                result['switches'] += 1
            for badge in page.locator('.plan__badge').all():
                if not badge.evaluate('e=>e.getBoundingClientRect().top>=e.parentElement.getBoundingClientRect().top'): record(route,width,'clipped-badge',badge.inner_text())
            for frame in page.locator('.frame').all():
                if not frame.evaluate('e=>{const title=e.querySelector(".frame__bar").getBoundingClientRect(),note=e.querySelector(".frame__note").getBoundingClientRect();return note.top>=title.bottom}'):
                    record(route,width,'illustration-label-overlap','Caption overlaps window title')
            hero_actions=page.locator('.phero__actions a').evaluate_all('es=>es.map(e=>e.getAttribute("href"))')
            if len(hero_actions)!=len(set(hero_actions)):record(route,width,'duplicate-hero-action',hero_actions)
            # Check actual content boxes as overflow-x:clip can hide page overflow.
            clipped = page.locator('main h1,main h2,main p,main .btn,main input,main summary').evaluate_all('''es=>es.filter(e=>{const r=e.getBoundingClientRect();return r.width && (r.left < -1 || r.right > innerWidth+1)}).map(e=>({text:e.textContent.slice(0,100),x:e.getBoundingClientRect().x,width:e.getBoundingClientRect().width}))''')
            for detail in clipped: record(route,width,'clipped-content',detail)
            if page.evaluate('document.documentElement.scrollWidth') > width: record(route,width,'overflow','document')
            broken = page.locator('img').evaluate_all('es=>es.filter(e=>!e.complete||!e.naturalWidth).map(e=>e.src)')
            for src in broken: record(route,width,'image',src)
            # Hydrate all lazy illustrations and reveal content before capture.
            for y in range(0, page.evaluate('document.body.scrollHeight'), 700):
                page.evaluate('(y)=>scrollTo(0,y)',y)
                page.wait_for_timeout(45)
            page.wait_for_timeout(450)
            for canvas in page.locator('.network-globe canvas').all():
                canvas.scroll_into_view_if_needed()
                page.wait_for_function("()=>getComputedStyle(document.querySelector('.network-globe canvas')).opacity==='1'")
                box=canvas.bounding_box()
                page.mouse.move(box['x']+box['width']*.5,box['y']+box['height']*.5)
                page.mouse.down()
                if canvas.evaluate('e=>e.style.cursor') != 'grabbing': record(route,width,'globe-drag-start','')
                page.mouse.move(box['x']+box['width']*.7,box['y']+box['height']*.5,steps=10)
                page.mouse.up()
                if canvas.evaluate('e=>e.style.cursor') != 'grab': record(route,width,'globe-drag-end','')
                canvas.focus(); page.keyboard.press('ArrowRight')
                result['globe']=True
                if args.screenshots: canvas.locator('..').locator('..').screenshot(path=str(args.output/f'{slug}-{width}-globe.png'))
            page.evaluate('scrollTo(0,0)')
            if args.screenshots:
                page.screenshot(path=str(args.output/f'{slug}-{width}.png'), full_page=True, animations='disabled')
            for error in errors: record(route,width,'console',error)
            result['errors']=list(errors)
            results.append(result)
            (args.output/'results.json').write_text(json.dumps(dict(pages=results,findings=findings),ensure_ascii=False,indent=2))
            print(width,route,'clicked',len(result['links']),'findings',len(findings),flush=True)
        context.close()
    # Independently fetch every unique target; anchors must exist in target HTML.
    request = p.request.new_context()
    statuses=[]
    for destination, sources in destinations.items():
        parts=urlparse(destination)
        if parts.scheme in ['mailto','tel']:
            statuses.append(dict(url=destination,status='protocol',sources=sources)); continue
        try:
            resp=request.get(destination.split('#')[0],timeout=20000)
            status=resp.status
            if status>=400:
                record(sources[0]['route'],sources[0]['width'],'external-status' if parts.netloc!=urlparse(args.base_url).netloc else 'link-status',dict(url=destination,status=status))
            if parts.fragment and status<400:
                import re
                if not re.search(r'id=[\"\']'+re.escape(unquote(parts.fragment))+r'[\"\']',resp.text()):
                    record(sources[0]['route'],sources[0]['width'],'anchor',destination)
            if destination.endswith('#'): record(sources[0]['route'],sources[0]['width'],'empty-anchor',destination)
            statuses.append(dict(url=destination,status=status,sources=sources))
        except Exception as e:
            record(sources[0]['route'],sources[0]['width'],'request',dict(url=destination,error=str(e)[:250]))
    request.dispose()
    browser.close()
(args.output/'results.json').write_text(json.dumps(dict(pages=results,findings=findings,destinations=statuses),ensure_ascii=False,indent=2))
print(json.dumps(dict(pages=len(results),clicks=sum(len(r['links']) for r in results),findings=findings),ensure_ascii=False,indent=2))
raise SystemExit(1 if findings else 0)
