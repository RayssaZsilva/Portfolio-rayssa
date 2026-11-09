from playwright.sync_api import sync_playwright
import json
import os
from pathlib import Path

BASE_URL = os.getenv("BASE_URL", "http://localhost:5174")
ARTIFACTS = Path(os.getenv("ARTIFACTS", "work/responsive"))
ARTIFACTS.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(is_mobile=True,has_touch=True,reduced_motion="reduce")
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 # Same city HDR; test fixture only, avoids external preset fetch in restricted environment.
 if os.getenv('HDR_FIXTURE'):
  page.route('**/potsdamer_platz_1k.hdr',lambda r:r.fulfill(path=os.environ['HDR_FIXTURE']))
 for w in [320,375,390,430,600,768,950,1024,1440]:
  page.set_viewport_size({'width':w,'height':844})
  page.goto(BASE_URL);page.wait_for_timeout(1800)
  for section in ['#sobre','#habilidades','#projetos','#contato']:
   page.locator(section).scroll_into_view_if_needed();page.wait_for_timeout(900)
  assert page.evaluate('document.documentElement.scrollWidth')==w,(w,'overflow')
  assert page.locator('.carousel-group:not([aria-hidden]) .project-card').count()==4
  for selector in ['.about-card','.skills-card','.carousel-viewport','.social-grid a']:
   for box in page.locator(selector).all():
    r=box.bounding_box();assert r['x']>=0 and r['x']+r['width']<=w+1,(w,selector,r)
  if w<=768:
   page.get_by_role('button',name='Abrir menu',exact=True).click()
   assert page.locator('.menu').is_visible()
   page.keyboard.press('Escape');assert not page.locator('.menu').is_visible()
   page.get_by_role('button',name='Abrir menu',exact=True).click()
   page.get_by_role('button',name='Sobre',exact=True).click();page.wait_for_timeout(900)
   assert page.locator('.about-card').bounding_box()['y'] >= 76
  page.get_by_role('button',name='Abrir chat',exact=True).click()
  assert page.get_by_role('dialog').is_visible()
  page.get_by_role('textbox').fill('Teste de layout')
  page.screenshot(path=str(ARTIFACTS / f'chat-{w}.png')) if w in [320,390] else None
  page.set_viewport_size({'width':w,'height':350});page.wait_for_timeout(150)
  for sel in ['.chatbot-window','.chatbot-input','.chatbot-send','.chatbot-close']:
   r=page.locator(sel).bounding_box();assert r['y']>=0 and r['y']+r['height']<=350,(w,sel,r)
  page.keyboard.press('Escape');assert not page.locator('.chatbot-window').count()
  page.set_viewport_size({'width':w,'height':844})
  page.evaluate('window.scrollTo({top:0,behavior:"instant"})');page.wait_for_timeout(800)
  if w in [320,390,1440]:page.screenshot(path=str(ARTIFACTS / f'after-{w}.png'),full_page=True)
  print('PASS',w,flush=True)
 assert not errors, json.dumps(errors)
 print('No JavaScript exceptions')
 b.close()
