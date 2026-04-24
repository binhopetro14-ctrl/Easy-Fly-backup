import asyncio
import os
import json
import base64
import google.generativeai as genai
from playwright.async_api import async_playwright
from dotenv import load_dotenv

load_dotenv()

# Configuração do Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ClawAgent:
    def __init__(self, model_name="gemini-1.5-flash"):
        self.model = genai.GenerativeModel(model_name)
        
    async def run_task(self, task_description: str):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                viewport={'width': 1280, 'height': 800},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            )
            page = await context.new_page()
            
            history = []
            max_steps = 15
            
            print(f"🚀 Iniciando Agente: {task_description}")
            
            try:
                # Começa pelo Google para encontrar o site de destino ou vai direto se houver URL
                await page.goto("https://www.google.com")
                
                for step in range(max_steps):
                    print(f"--- Passo {step + 1} ---")
                    
                    # 1. Captura a visão atual
                    screenshot = await page.screenshot(type="jpeg", quality=50)
                    b64_image = base64.b64encode(screenshot).decode('utf-8')
                    
                    # 2. Prepara o prompt de visão
                    prompt = f"""
                    Você é um agente de automação de navegador chamado CLAW.
                    Sua tarefa atual: {task_description}

                    Com base na captura de tela anexada, qual é a próxima ação?
                    Responda APENAS com um objeto JSON:
                    {{
                        "thought": "O que você está vendo e por que vai fazer o próximo passo",
                        "action": "click" | "type" | "scroll" | "wait" | "navigate" | "done" | "error",
                        "selector": "seletor css ou texto",
                        "text": "texto para digitar (se aplicável)",
                        "url": "url para navegar (se aplicável)"
                    }}
                    Se a tarefa estiver concluída, use action: "done".
                    """

                    # 3. Chama o "cérebro" do Agente
                    response = self.model.generate_content([
                        prompt,
                        {"mime_type": "image/jpeg", "data": screenshot}
                    ])
                    
                    # 4. Processa a resposta
                    try:
                        # Extrai o JSON da resposta (limpa possíveis markdown)
                        raw_text = response.text.strip().replace('```json', '').replace('```', '')
                        decision = json.loads(raw_text)
                    except Exception as e:
                        print(f"Erro ao parsear decisão: {e}")
                        break

                    print(f"💡 Pensamento: {decision.get('thought')}")
                    action = decision.get("action")
                    
                    if action == "done":
                        print("✅ Tarefa concluída com sucesso!")
                        break
                    
                    if action == "click":
                        await page.click(decision["selector"], timeout=5000)
                    elif action == "type":
                        await page.fill(decision["selector"], decision["text"])
                        await page.keyboard.press("Enter")
                    elif action == "navigate":
                        await page.goto(decision["url"])
                    elif action == "scroll":
                        await page.mouse.wheel(0, 500)
                    elif action == "wait":
                        await asyncio.sleep(2)
                    
                    await asyncio.sleep(1) # Pequena pausa entre ações

                return {
                    "status": "success",
                    "message": "Agente finalizou a execução"
                }

            except Exception as e:
                print(f"❌ Erro na execução: {e}")
                return {"status": "error", "message": str(e)}
            finally:
                await browser.close()

if __name__ == "__main__":
    agent = ClawAgent()
    asyncio.run(agent.run_task("Vá ao Google, procure por 'Easy Fly Agencia' e me diga o título do primeiro resultado"))
