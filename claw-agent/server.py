from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import ClawAgent
import uuid
import datetime

app = FastAPI(title="Easy Fly - Claw Agent API")

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

    result = await agent.run_task(description, log_callback=add_log)
    
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

@app.get("/")
async def root():
    return {"status": "online", "service": "Claw Agent API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
