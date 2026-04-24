from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import ClawAgent
import uuid

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
    tasks_db[task_id] = {"status": "pending", "description": request.description}
    
    # Executa em background para não travar a requisição
    background_tasks.add_task(process_task, task_id, request.description)
    
    return {"task_id": task_id, "message": "Agente iniciado na VPS"}

async def process_task(task_id: str, description: str):
    tasks_db[task_id]["status"] = "running"
    result = await agent.run_task(description)
    tasks_db[task_id].update({
        "status": "completed",
        "result": result
    })
    # Aqui você poderia disparar um webhook de volta para o Easy Fly
    print(f"Tarefa {task_id} finalizada: {result}")

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    return tasks_db.get(task_id, {"status": "not_found"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
