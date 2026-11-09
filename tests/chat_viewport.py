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
