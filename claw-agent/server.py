from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from agent import ClawAgent
import uuid
import datetime
import os

app = FastAPI(title="Easy Fly - Claw Agent API")

# Configurar diretório de screenshots
SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
agent = ClawAgent()

class TaskRequest(BaseModel):
    description: str
    callback_url: str = None

tasks_db = {}

@app.post("/execute")
async def execute_task(request: TaskRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    tasks_db[task_id] = {
        "id": task_id,
        "status": "pending", 
        "description": request.description,
        "logs": [f"[{datetime.datetime.now().strftime('%H:%M:%S')}] Aguardando início..."],
        "result": None
    }
    
    background_tasks.add_task(process_task, task_id, request.description)
    
    return {"task_id": task_id, "message": "Agente iniciado na VPS"}

async def process_task(task_id: str, description: str):
    tasks_db[task_id]["status"] = "running"
    
    def add_log(message):
        timestamp = datetime.datetime.now().strftime("%H:%M:%S")
        tasks_db[task_id]["logs"].append(f"[{timestamp}] {message}")

    add_log("Chamando motor do Agente Claw...")
    try:
        # Passa o task_id para o agente salvar o screenshot correto
        result = await agent.run_task(description, task_id=task_id, log_callback=add_log)
    except Exception as e:
        add_log(f"Erro ao iniciar o motor: {str(e)}")
        result = {"status": "error", "message": str(e)}
    
    tasks_db[task_id].update({
        "status": "completed" if result["status"] == "success" else "failed",
        "result": {"message": result["message"]}
    })
    
    add_log(f"Tarefa finalizada com status: {tasks_db[task_id]['status']}")

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    task = tasks_db.get(task_id)
    if not task:
        return {"status": "not_found"}
    return task

@app.get("/screenshot/{task_id}")
async def get_screenshot(task_id: str):
    # Procura pelo screenshot do task_id ou o "current" como fallback
    path = os.path.join(SCREENSHOTS_DIR, f"{task_id}.jpg")
    if not os.path.exists(path):
        # Tenta o "current" se o específico não existir
        path = os.path.join(SCREENSHOTS_DIR, "current.jpg")
        
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Screenshot not found")
        
    return FileResponse(path)

@app.get("/")
async def root():
    return {"status": "online", "service": "Claw Agent API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
