import uvicorn
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root(t):
  return {"message": "Hello World"}

uvicorn.run(port=3000, app=app)