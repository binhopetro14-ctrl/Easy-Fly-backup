import asyncio
import os
import json
import base64
import google.generativeai as genai
from playwright.async_api import async_playwright
from playwright_stealth import Stealth
from dotenv import load_dotenv

load_dotenv()

# Configuração do Gemini (Tenta ler tanto GEMINI_API_KEY quanto GOOGLE_API_KEY)
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class ClawAgent:
    def __init__(self, model_name="gemini-1.5-flash"):
        self.model = genai.GenerativeModel(model_name)
        
    async def run_task(self, task_description: str, task_id: str = "current", log_callback=None):
        def log(msg):
            # Tenta imprimir no terminal com segurança para Windows
            try:
                print(f"[Agent] {msg}")
            except UnicodeEncodeError:
                print(f"[Agent] {msg.encode('ascii', 'ignore').decode('ascii')}")
            
            # Repassa a mensagem limpa para o callback (que adicionará o timestamp)
            if log_callback:
                log_callback(msg)

        log("🚀 Preparando ambiente Playwright...")
        async with async_playwright() as p:
            log("🌐 Lançando navegador Chromium...")
            try:
                # Tenta usar Browserless se configurado, senão local
                browser_ws = os.getenv("BROWSER_WS_ENDPOINT")
                if browser_ws:
                    log(f"Conectando ao Browserless: {browser_ws}")
                    browser = await p.chromium.connect_over_cdp(browser_ws)
                else:
                    browser = await p.chromium.launch(
                        headless=True,
                        args=['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-blink-features=AutomationControlled']
                    )
            except Exception as e:
                log(f"Falha ao lançar navegador: {e}")
                raise e
                
            context = await browser.new_context(
                viewport={'width': 1280, 'height': 800},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            )
            page = await context.new_page()
            await Stealth().apply_stealth_async(page)
            
            max_steps = 20
            final_result = "Não foi possível extrair um resultado conclusivo."
            thought = ""
            action = ""
            params = {}
            
            log(f"Iniciando Agente: {task_description}")
            
            # Garantir pasta de screenshots
            os.makedirs("screenshots", exist_ok=True)
            
            try:
                # Começa pelo Google ou vai direto se for URL
                start_url = "https://www.google.com"
                if task_description.startswith("http"):
                    start_url = task_description.split()[0]
                
                await page.goto(start_url)
                await asyncio.sleep(2)
                
                for step in range(max_steps):
                    # 1. Captura a visão atual e salva para o frontend
                    screenshot_path = f"screenshots/{task_id}.jpg"
                    screenshot = await page.screenshot(path=screenshot_path, type="jpeg", quality=60)
                    
                    log(f"Passo {step + 1} de {max_steps}...")
                    
                    # 2. Prepara o prompt de visão
                    prompt = f"""
                    Você é o Agente Claw da agência de viagens 'Easy Fly'.
                    Sua tarefa atual: {task_description}

                    Analise a captura de tela anexada e decida o próximo passo.
                    Responda APENAS com um JSON no formato:
                    {{
                        "thought": "seu raciocínio breve aqui",
                        "action": "click" | "type" | "navigate" | "scroll" | "wait" | "done" | "error",
                        "selector": "seletor CSS ou texto exato para clique/digitação",
                        "text": "texto para digitar, se aplicável",
                        "url": "url para navegar, se aplicável",
                        "result": "resultado final se action for done"
                    }}

                    Dicas para ser assertivo:
                    1. Se estiver no Google, procure pelo campo de busca (gereralmente [name='q']) e use 'type' com o texto desejado.
                    2. Para clicar, prefira seletores CSS curtos ou o texto exato do botão.
                    3. Se a página ainda estiver carregando ou em branco, use 'wait'.
                    4. Se já realizou a busca e viu os resultados, use 'done' e descreva o que encontrou.
                    5. Se encontrar um erro persistente, use 'error'.
                    6. IMPORTANTE: Use 'done' se a tarefa principal for visualizada na tela.
                    """

                    # 3. Chama o "cérebro" do Agente
                    try:
                        response = self.model.generate_content([
                            prompt,
                            {"mime_type": "image/jpeg", "data": screenshot}
                        ])
                        
                        raw_text = response.text.strip().replace('```json', '').replace('```', '')
                        # Limpeza extra para evitar erros de parsing
                        if '{' in raw_text:
                            raw_text = raw_text[raw_text.find('{'):raw_text.rfind('}')+1]
                        
                        decision = json.loads(raw_text)
                    except Exception as e:
                        log(f"Aviso: Falha ao interpretar IA (tentando mais uma vez): {e}")
                        await asyncio.sleep(2)
                        continue

                    thought = decision.get('thought', 'Analisando...')
                    log(thought)
                    
                    action = decision.get("action")
                    
                    if action == "done":
                        final_result = decision.get("result", "Tarefa finalizada com sucesso.")
                        log(f"✅ Sucesso: {final_result}")
                        break
                    
                    if action == "error":
                        final_result = f"Agente parou: {thought}"
                        log(f"❌ {final_result}")
                        break

                    try:
                        if action == "click":
                            sel = decision.get("selector", "")
                            try:
                                await page.click(sel, timeout=7000)
                            except:
                                try:
                                    await page.get_by_role("button", name=sel).click(timeout=3000)
                                except:
                                    await page.get_by_text(sel).first.click(timeout=3000)
                        
                        elif action == "type":
                            sel = decision.get("selector", "[name='q']") # Fallback para busca google
                            await page.fill(sel, decision.get("text", ""))
                            await page.keyboard.press("Enter")
                            await asyncio.sleep(2)
                        
                        elif action == "navigate":
                            await page.goto(decision.get("url", ""), wait_until="networkidle")
                        
                        elif action == "scroll":
                            await page.mouse.wheel(0, 600)
                        
                        elif action == "wait":
                            await asyncio.sleep(4)
                            
                    except Exception as action_err:
                        log(f"Tentando contornar erro na ação {action}...")
                    
                    await asyncio.sleep(2)

                return {
                    "status": "success" if action == "done" else "failed",
                    "message": final_result
                }

            except Exception as e:
                log(f"Erro crítico: {e}")
                return {"status": "error", "message": str(e)}
            finally:
                await browser.close()

if __name__ == "__main__":
    agent = ClawAgent()
    asyncio.run(agent.run_task("Vá ao Google, procure por 'Easy Fly Agencia' e me diga o título do primeiro resultado"))
