from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PIN = os.environ.get('ADMIN_PIN', '4321')

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ===== Models =====
class AgendaItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order: int
    time: str
    title: str
    description: str
    location: str
    type: str  # general | keynote | rotation | break


class AgendaItemUpdate(BaseModel):
    time: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    order: Optional[int] = None


class Session(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order: int
    title: str
    location: str
    description: str


class SessionUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None


class Resource(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order: int
    title: str
    description: Optional[str] = ""
    url: Optional[str] = ""


class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    order: Optional[int] = None


class PinVerify(BaseModel):
    pin: str


# ===== Seed Data =====
DEFAULT_AGENDA = [
    {"order": 1, "time": "7:30–8:30 AM",
     "title": "Line Dancing, Exercising, Music, Entertainment, and Group Selection",
     "description": "All groups attend. Kick off the day, get moving, and find your group!\n\nClick on My Group to determine your assigned group.",
     "location": "Gym", "type": "general"},
    {"order": 2, "time": "8:30–9:00 AM",
     "title": "Keynote: Superintendent Dr. Mark Sullivan",
     "description": "Welcome and opening keynote address.",
     "location": "Cafeteria", "type": "keynote"},
    {"order": 3, "time": "9:15–9:55 AM",
     "title": "Session 1",
     "description": "First session — see Group Rotation for your assigned room.",
     "location": "Various", "type": "rotation"},
    {"order": 4, "time": "10:10–10:50 AM",
     "title": "Session 2",
     "description": "Second session — see Group Rotation for your assigned room.",
     "location": "Various", "type": "rotation"},
    {"order": 5, "time": "11:05–11:45 AM",
     "title": "Session 3",
     "description": "Third session — see Group Rotation for your assigned room.",
     "location": "Various", "type": "rotation"},
    {"order": 6, "time": "11:45 AM–1:15 PM",
     "title": "Lunch",
     "description": "All groups break for lunch together.",
     "location": "Cafeteria", "type": "break"},
    {"order": 7, "time": "1:30–2:10 PM",
     "title": "Session 4",
     "description": "Final session — see Group Rotation for your assigned room.",
     "location": "Various", "type": "rotation"},
]

DEFAULT_SESSIONS = [
    {"order": 1, "title": "AI Policy & Cybersecurity", "location": "Media Center",
     "description": "Understand district AI usage policy, student data privacy, and practical cybersecurity habits to keep your classroom and students safe online."},
    {"order": 2, "title": "MagicSchool AI", "location": "Mac Lab",
     "description": "Hands-on workshop with MagicSchool AI tools — lesson planning, differentiation, parent communication, and time-saving classroom assistants designed for educators."},
    {"order": 3, "title": "Technology Usage in Pre K", "location": "Cafeteria",
     "description": "Developmentally appropriate technology use in Pre K classrooms — when to use it, when to step back, and best practices for screen time and engagement."},
    {"order": 4, "title": "VR & Interactives", "location": "Game Room",
     "description": "Explore immersive virtual reality experiences and interactive learning tools that bring stories, science, and exploration to life for young learners."},
]

DEFAULT_RESOURCES = [
    {"order": 1, "title": "Two Truths & AI",
     "description": "An interactive digital literacy activity from Common Sense Media that challenges students to identify AI-generated content while building critical thinking and media literacy skills.",
     "url": ""},
    {"order": 2, "title": "Session Slide Deck", "description": "", "url": ""},
    {"order": 3, "title": "Workshop Handout PDF", "description": "", "url": ""},
    {"order": 4, "title": "Conference Padlet", "description": "", "url": ""},
]


# ===== Health check =====
@app.get("/")
async def health():
    return {"status": "ok"}


@api_router.get("/")
async def root():
    return {"status": "ok", "message": "BCS Pre K Conference API"}


# ===== Agenda =====
@api_router.get("/agenda", response_model=List[AgendaItem])
async def get_agenda():
    items = await db.agenda.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items


@api_router.post("/agenda", response_model=AgendaItem)
async def create_agenda(item: AgendaItem):
    doc = item.model_dump()
    await db.agenda.insert_one(doc)
    return item


@api_router.put("/agenda/{item_id}", response_model=AgendaItem)
async def update_agenda(item_id: str, update: AgendaItemUpdate):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.agenda.update_one({"id": item_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agenda item not found")
    item = await db.agenda.find_one({"id": item_id}, {"_id": 0})
    return item


@api_router.delete("/agenda/{item_id}")
async def delete_agenda(item_id: str):
    result = await db.agenda.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agenda item not found")
    return {"deleted": True}


# ===== Sessions =====
@api_router.get("/sessions", response_model=List[Session])
async def get_sessions():
    items = await db.sessions_data.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items


@api_router.post("/sessions", response_model=Session)
async def create_session(item: Session):
    doc = item.model_dump()
    await db.sessions_data.insert_one(doc)
    return item


@api_router.put("/sessions/{item_id}", response_model=Session)
async def update_session(item_id: str, update: SessionUpdate):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.sessions_data.update_one({"id": item_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    item = await db.sessions_data.find_one({"id": item_id}, {"_id": 0})
    return item


@api_router.delete("/sessions/{item_id}")
async def delete_session(item_id: str):
    result = await db.sessions_data.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"deleted": True}


# ===== Resources =====
@api_router.get("/resources", response_model=List[Resource])
async def get_resources():
    items = await db.resources.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items


@api_router.post("/resources", response_model=Resource)
async def create_resource(item: Resource):
    doc = item.model_dump()
    await db.resources.insert_one(doc)
    return item


@api_router.put("/resources/{item_id}", response_model=Resource)
async def update_resource(item_id: str, update: ResourceUpdate):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.resources.update_one({"id": item_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Resource not found")
    item = await db.resources.find_one({"id": item_id}, {"_id": 0})
    return item


@api_router.delete("/resources/{item_id}")
async def delete_resource(item_id: str):
    result = await db.resources.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"deleted": True}


# ===== Admin =====
@api_router.post("/admin/verify-pin")
async def verify_pin(payload: PinVerify):
    return {"valid": payload.pin == ADMIN_PIN}


# ===== Startup seeding =====
@app.on_event("startup")
async def seed_defaults():
    try:
        if await db.agenda.count_documents({}) == 0:
            docs = [AgendaItem(**d).model_dump() for d in DEFAULT_AGENDA]
            await db.agenda.insert_many(docs)
            logger.info("Seeded agenda")
        if await db.sessions_data.count_documents({}) == 0:
            docs = [Session(**d).model_dump() for d in DEFAULT_SESSIONS]
            await db.sessions_data.insert_many(docs)
            logger.info("Seeded sessions")
        if await db.resources.count_documents({}) == 0:
            docs = [Resource(**d).model_dump() for d in DEFAULT_RESOURCES]
            await db.resources.insert_many(docs)
            logger.info("Seeded resources")
    except Exception as e:
        logger.warning(f"Seeding failed: {e}")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
