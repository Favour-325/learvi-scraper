from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from routers import auth, courses, bookmark, enrollment, announcements, metrics, users
from utils.scheduler import setup_scheduler

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

# Register APIs 
apis = [auth, courses, bookmark, enrollment, announcements, metrics, users]
for route in apis:
    app.include_router(route.router)
    
    
# Run background tasks on program startup
""" @app.on_event("startup")
def start_jobs():
    setup_scheduler() """
     
""" try:
    while True
    
except KeyboardInterrupt:
    scheduler.shutdown() """


@app.get('/')
def root():
    return "Welcome to Learvi!"
        
    