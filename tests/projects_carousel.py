"""Run against Vite: BASE_URL=http://localhost:5174 python tests/projects_carousel.py."""
import os
from pathlib import Path

ARTIFACTS = Path(os.getenv("ARTIFACTS", "work/carousel"))
ARTIFACTS.mkdir(parents=True, exist_ok=True)
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':390,'height':844}, reduced_motion='reduce')
    if os.getenv('HDR_FIXTURE'):
        page.route('**/potsdamer_platz_1k.hdr', lambda r: r.fulfill(path=os.environ['HDR_FIXTURE']))
    page.goto(os.getenv('BASE_URL', 'http://localhost:5174'))
    carousel = page.locator('.carousel-viewport')
    carousel.scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    for width in [320,375,390,430,768,1024,1440]:
        page.set_viewport_size({'width':width,'height':844})
        page.wait_for_timeout(150)
        assert page.evaluate('document.documentElement.scrollWidth === innerWidth')
        dims = page.locator('.carousel-group').first.locator('.project-card').evaluate_all('(cards)=>cards.map(c=>({w:c.offsetWidth,h:c.offsetHeight}))')
        assert len({d['w'] for d in dims}) == 1, dims
        assert len({d['h'] for d in dims}) == 1, dims
        assert page.locator('.carousel-group:not([aria-hidden]) .project-card').count() == 4
        assert page.locator('.carousel-group[aria-hidden] a:not([tabindex="-1"])').count() == 0
        assert page.get_by_role('heading', name='Achô').count() == 1
        before = carousel.evaluate('(e)=>e.scrollLeft')
        page.get_by_role('button',name='Próximo projeto',exact=True).click()
        page.wait_for_timeout(100)
        after = carousel.evaluate('(e)=>e.scrollLeft')
        assert abs(after-before)>10
        # A whole cycle changes coordinates, never the rendered phase.
        phase = carousel.evaluate('''e=>{const g=e.querySelectorAll('.carousel-group');const c=g[1].offsetLeft-g[0].offsetLeft;e.scrollLeft=c*1.5+10;return {c,phase:(e.scrollLeft%c)}}''')
        page.wait_for_timeout(100)
        actual=carousel.evaluate('(e)=>e.scrollLeft')
        assert abs((actual % phase['c']) - phase['phase']) <= 1
        print('PASS layout/loop/accessibility',width,flush=True)
    page.set_viewport_size({'width':390,'height':844})
    carousel.scroll_into_view_if_needed()
    page.wait_for_timeout(200)
    box=carousel.bounding_box()
    page.mouse.move(box['x']+250,box['y']+160)
    start=carousel.evaluate('(e)=>e.scrollLeft')
    page.mouse.down();page.mouse.move(box['x']+90,box['y']+160,steps=12);page.mouse.up()
    assert abs(carousel.evaluate('(e)=>e.scrollLeft')-start)>100
    # Autoplay and hover pause (move focus away from the scrolling viewport).
    page.emulate_media(reduced_motion='no-preference')
    page.get_by_role('button',name='Retomar movimento',exact=True).click()
    page.mouse.move(0,0)
    page.wait_for_timeout(1700)
    start=carousel.evaluate('(e)=>e.scrollLeft');page.wait_for_timeout(600)
    assert carousel.evaluate('(e)=>e.scrollLeft')>start+5
    box=carousel.bounding_box();page.mouse.move(box['x']+50,box['y']+80)
    page.wait_for_timeout(100);start=carousel.evaluate('(e)=>e.scrollLeft');page.wait_for_timeout(350)
    assert abs(carousel.evaluate('(e)=>e.scrollLeft')-start)<2
    page.get_by_role('button',name='Pausar movimento',exact=True).click();page.mouse.move(0,0)
    start=carousel.evaluate('(e)=>e.scrollLeft');page.wait_for_timeout(350)
    assert abs(carousel.evaluate('(e)=>e.scrollLeft')-start)<2
    page.emulate_media(reduced_motion='reduce')
    assert page.get_by_role('button',name='Movimento reduzido').is_disabled()
    # Native touch scrolling, delivered through Chromium's touch input pipeline.
    carousel.scroll_into_view_if_needed()
    client = page.context.new_cdp_session(page)
    client.send('Emulation.setTouchEmulationEnabled', {'enabled': True})
    box = carousel.bounding_box()
    y = max(100, box['y'] + 100)
    start = carousel.evaluate('(e)=>e.scrollLeft')
    client.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[{'x':280,'y':y}]})
    for x in range(260, 99, -20):
        client.send('Input.dispatchTouchEvent', {'type':'touchMove','touchPoints':[{'x':x,'y':y}]})
        page.wait_for_timeout(20)
    client.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[]})
    page.wait_for_timeout(200)
    assert abs(carousel.evaluate('(e)=>e.scrollLeft')-start)>40
    client.send('Emulation.setTouchEmulationEnabled', {'enabled': False})
    link = page.locator('.carousel-group:not([aria-hidden]) .btn-demo')
    link.focus()
    with page.expect_popup() as popup:
        link.click()
    assert link.get_attribute('href') == 'https://acho-ten.vercel.app/'
    assert not popup.value.is_closed()
    popup.value.close()
    link.focus()
    button_box = link.bounding_box()
    page.mouse.move(button_box['x']+20, button_box['y']+20)
    page.mouse.down()
    page.mouse.move(button_box['x']-100, button_box['y']+20, steps=10)
    page.mouse.up()
    page.wait_for_timeout(100)
    assert len(page.context.pages) == 1, 'Dragging a link must not open it'
    assert page.locator('.carousel-group:not([aria-hidden]) .btn-github').count() == 3
    for width in [390,768,1440]:
        page.set_viewport_size({'width':width,'height':900})
        carousel.scroll_into_view_if_needed()
        page.wait_for_timeout(150)
        carousel.evaluate('(e)=>{const g=e.querySelectorAll(".carousel-group");e.scrollLeft=g[1].offsetLeft-g[0].offsetLeft}')
        page.locator('.projects-carousel').screenshot(path=str(ARTIFACTS / f'carousel-{width}.png'))
    print('PASS drag, native swipe, links, autoplay, hover, pause, reduced motion',flush=True)
    browser.close()
