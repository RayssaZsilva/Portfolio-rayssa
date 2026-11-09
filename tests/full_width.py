import os
from pathlib import Path
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(reduced_motion='reduce')
    if os.getenv('HDR_FIXTURE'):
        page.route('**/potsdamer_platz_1k.hdr',lambda r:r.fulfill(path=os.environ['HDR_FIXTURE']))
    page.goto(os.getenv('BASE_URL','http://localhost:5174'))
    for width in [320,375,390,430,768,1024,1440,1920]:
        page.set_viewport_size({'width':width,'height':900})
        page.wait_for_timeout(200)
        for selector in ['#home','#sobre','#habilidades','#projetos','#contato']:
            page.locator(selector).scroll_into_view_if_needed()
            page.wait_for_timeout(100)
        assert page.evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'),width
        for selector in ['.carousel-viewport','.background']:
            box=page.locator(selector).bounding_box()
            assert abs(box['x'])<1 and abs(box['width']-width)<1,(width,selector,box)
        for selector in ['.hero-left','.hero-right','.avatar3d','.calendar-card','.about-card','.skills-card','.social-grid']:
            box=page.locator(selector).bounding_box()
            assert box['x']>=0 and box['x']+box['width']<=width+1,(width,selector,box)
        if width>=1024:
            assert page.locator('.about-card').bounding_box()['width'] >= width*0.9
        if width<=768:
            page.get_by_role('button',name='Abrir menu',exact=True).click()
            assert page.locator('.menu').is_visible()
            page.keyboard.press('Escape')
            assert not page.locator('.menu').is_visible()
        page.get_by_role('button',name='Abrir chat',exact=True).click()
        box=page.locator('.chatbot-window').bounding_box()
        assert box['x']>=0 and box['y']>=0 and box['x']+box['width']<=width and box['y']+box['height']<=900
        page.keyboard.press('Escape')
        if width in [390,1024,1920]:
            artifacts=Path(os.getenv('ARTIFACTS','work/full-width'));artifacts.mkdir(parents=True,exist_ok=True)
            for selector,name in [('#home','hero'),('#sobre','about'),('#habilidades','skills'),('#projetos','projects')]:
                page.locator(selector).scroll_into_view_if_needed()
                page.locator(selector).screenshot(path=str(artifacts/f'{name}-{width}.png'))
        print('PASS full viewport, sections, avatar bounds, menu, chat',width,flush=True)
    browser.close()
