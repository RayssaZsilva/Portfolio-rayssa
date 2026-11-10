from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
 if os.getenv('HDR_FIXTURE'):
  page.route('**/potsdamer_platz_1k.hdr',lambda r:r.fulfill(path=os.environ['HDR_FIXTURE']))
 payloads=[]
 def chat(route):
  payloads.append(route.request.post_data_json)
  route.fulfill(json={'response':'Resposta de teste.\n\n'+('Texto longo para testar a conversa. '*100)})
 page.route('**/api/chat',chat)
 page.goto(os.getenv('BASE_URL', 'http://localhost:5174'));page.wait_for_timeout(2000)
 page.get_by_role('button',name='Abrir chat',exact=True).click()
 for width in [320,375,390,430,768,1440,1920]:
  page.set_viewport_size({'width':width,'height':844})
  page.wait_for_timeout(100)
  r=page.locator('.chatbot-window').bounding_box()
  assert r['x']>=0 and r['y']>=0 and r['x']+r['width']<=width and r['y']+r['height']<=844
  if width<=600:
   assert abs(r['width']/width-0.94)<0.01 and r['height']>=700
  else:
   assert 420<=r['width']<=480 and r['height']==620
  assert page.evaluate('document.documentElement.scrollWidth === innerWidth')
  assert page.locator('.chatbot-messages').evaluate('(e)=>e.scrollWidth<=e.clientWidth')
  page.set_viewport_size({'width':width,'height':350})
  page.wait_for_timeout(100)
  for sel in ['.chatbot-window','.chatbot-input','.chatbot-send','.chatbot-close']:
   r=page.locator(sel).bounding_box()
   assert r['y']>=0 and r['y']+r['height']<=350,(width,sel,r)
  print('PASS chat size and short viewport',width,flush=True)
 page.set_viewport_size({'width':390,'height':844})
 page.evaluate('''() => {
   Object.defineProperty(visualViewport,'height',{configurable:true,value:300});
   Object.defineProperty(visualViewport,'offsetTop',{configurable:true,value:120});
   visualViewport.dispatchEvent(new Event('resize'));
 }''')
 for sel in ['.chatbot-window','.chatbot-input','.chatbot-close']:
  r=page.locator(sel).bounding_box();assert r['y']>=120 and r['y']+r['height']<=420,(sel,r)
 page.get_by_role('textbox').fill('Quais projetos?');page.get_by_role('button',name='Enviar mensagem').click()
 page.get_by_text('Resposta de teste.',exact=False).wait_for()
 assert payloads==[{'message':'Quais projetos?','history':[]}],payloads
 assert page.evaluate("document.querySelector('.chatbot-messages').scrollHeight > document.querySelector('.chatbot-messages').clientHeight")
 page.get_by_role('button',name='Limpar conversa').click()
 assert page.locator('.rai-suggestions button').count()==3
 page.keyboard.press('Escape')
 page.wait_for_function("document.activeElement?.classList.contains('chatbot-button')")
 print('PASS visualViewport 300px + offset 120px; mocked send/history, long response, clear, focus; reduced motion')
 b.close()
