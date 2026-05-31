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

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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


class Link(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order: int
    title: str
    description: Optional[str] = ""
    url: Optional[str] = ""


class LinkUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    order: Optional[int] = None


class Announcement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order: int
    title: str
    body: Optional[str] = ""
    badge: Optional[str] = ""  # e.g. "NEW", "UPDATE", "REMINDER"


class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    badge: Optional[str] = None
    order: Optional[int] = None


class PinVerify(BaseModel):
    pin: str


class Feedback(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    rating: int
    highlight: str = ""
    improve: str = ""
    submitted_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class FeedbackCreate(BaseModel):
    rating: int
    highlight: str = ""
    improve: str = ""


# ===== Seed Data =====
DEFAULT_AGENDA = [
    {"order": 1, "time": "7:30–8:30 AM",
     "title": "Line Dancing, Exercising, Music, Entertainment, and Group Selection",
     "description": "All groups attend. Kick off the day, get moving, and find your group!\n\nClick on My Group to determine your assigned group.",
     "location": "Gym", "type": "general"},
    {"order": 2, "time": "8:30–9:00 AM",
     "title": "Keynote: Dr. Terry Lamar, Chief of Staff, Birmingham City Schools",
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
    {"order": 1, "title": "AI Policy & Cybersecurity", "location": "Library",
     "description": "This session provides educators with an overview of the district's Artificial Intelligence (AI) Policy and essential cybersecurity expectations for staff. Participants will explore responsible and ethical uses of AI in teaching and learning, including guidance on acceptable classroom use, human oversight, academic integrity, and protecting student information when using AI tools. The session will also review district expectations regarding student data privacy, personally identifiable information (PII), and approved digital resources.\n\nIn addition, teachers will learn practical cybersecurity habits that help protect classrooms, devices, and district systems from online threats. Topics will include identifying phishing emails, creating strong passwords, securing student accounts, recognizing suspicious activity, and understanding common cybersecurity risks impacting schools today. By the end of the session, participants will better understand how to safely integrate AI into instruction while maintaining a secure and responsible digital learning environment for students."},
    {"order": 2, "title": "MagicSchool AI", "location": "Computer Lab",
     "description": "This interactive session provides educators with hands-on experience using MagicSchool AI to support daily classroom instruction and streamline teacher workflows. Participants will explore a variety of educator-focused AI tools designed to assist with lesson planning, instructional differentiation, assessment creation, rubric development, parent communication, and classroom engagement. Teachers will learn practical strategies for using AI to save time while maintaining high-quality, student-centered instruction.\n\nThroughout the workshop, participants will have the opportunity to practice using MagicSchool AI tools in real classroom scenarios and create resources they can immediately implement in their classrooms. The session will also highlight responsible AI use, best practices for reviewing AI-generated content, and ways to align AI-supported instruction with district expectations and curriculum goals. By the end of the session, teachers will leave with practical tools and strategies to increase efficiency, personalize learning, and support student success."},
    {"order": 3, "title": "Technology Usage in Pre K", "location": "Cafeteria",
     "description": "This session focuses on developmentally appropriate technology integration in Pre K classrooms and how educators can use digital tools to enhance, rather than replace, hands-on learning and student interaction. Participants will explore when technology can effectively support early childhood instruction, including literacy development, creativity, communication, and student engagement, while also identifying moments when traditional play-based and teacher-led activities are more appropriate. The session will emphasize balancing screen time with active learning, movement, collaboration, and social-emotional development.\n\nTeachers will review best practices for selecting age-appropriate digital resources, managing screen time, and creating meaningful technology experiences for young learners. Topics will include interactive learning tools, digital citizenship foundations for early learners, classroom routines for device use, and strategies to keep students actively engaged without overreliance on technology. Participants will also discuss the role of teacher guidance and family communication in supporting healthy technology habits. By the end of the session, educators will have practical strategies for using technology intentionally and responsibly in Pre K environments while maintaining a strong focus on child development and student engagement."},
    {"order": 4, "title": "VR & Interactives", "location": "Game Room",
     "description": "Explore immersive virtual reality experiences and interactive learning tools that bring stories, science, and exploration to life for young learners."},
]

DEFAULT_RESOURCES = [
    {"order": 1, "title": "AI or Human",
     "description": "AI-generated media content has come to stay, looking more human than ever. Play the game and try to guess the difference between what is AI or Human.",
     "url": "https://ai-or-human.github.io/"},
    {"order": 2, "title": "Most Likely Machine",
     "description": "Most Likely Machine is an interactive learning experience that helps students understand how algorithms work and how bias can influence automated decisions. Through a playful, school-themed activity, students build and test algorithms, then reflect on how personal assumptions, data choices, and weighting decisions can affect outcomes. This is a strong classroom resource for teaching AI literacy, digital citizenship, fairness, and responsible technology use in a way that is engaging and age-appropriate.",
     "url": "https://mostlikelymachine.artefactgroup.com/"},
    {"order": 3, "title": "Quick Draw",
     "description": "Quick, Draw! is an interactive Google AI experiment where users quickly sketch objects while a neural network attempts to guess the drawings in real time, helping demonstrate how machine learning works through fun, hands-on gameplay.",
     "url": "https://quickdraw.withgoogle.com/"},
    {"order": 4, "title": "Say What You See",
     "description": "Say What You See is an interactive Google Arts & Culture AI experiment that helps users strengthen image-reading and AI prompting skills by carefully describing AI-generated images to recreate them as accurately as possible. The activity encourages critical thinking, observation, descriptive writing, and the creation of strategic prompts while providing a fun and engaging way for students and educators to learn how AI interprets language and visuals.",
     "url": "https://artsandculture.google.com/experiment/say-what-you-see/jwG3m7wQShZngw?hl=en"},
    {"order": 5, "title": "Semantris",
     "description": "Semantris is a Google AI word-association game that uses machine learning to understand the meaning behind words and phrases, helping students explore vocabulary, semantic relationships, critical thinking, and how AI interprets language in a fun, fast-paced way.",
     "url": "https://research.google.com/semantris"},
    {"order": 6, "title": "Test Yourself: Which image is made by AI?",
     "description": "Test Yourself is an interactive image-recognition game where users test their ability to identify which image was generated by artificial intelligence across multiple rounds. This activity is a strong classroom tool for building AI literacy, visual analysis, critical thinking, and discussion about how realistic AI-generated content can appear.",
     "url": "https://game.agcs.works/"},
    {"order": 7, "title": "Twin Pics",
     "description": "Twin Pics is a daily AI image challenge where players use prompts to recreate a mystery image as closely as possible, earning higher scores based on accuracy. Because a new challenge is released each day, participants are encouraged to return daily to strengthen their AI prompting skills while learning how concise writing, detailed descriptions, and strategic word choice impact AI-generated results. It also serves as a fun classroom icebreaker that encourages creativity, collaboration, critical thinking, and discussion around how AI interprets language and prompts.",
     "url": "https://twinpics.ai/"},
    {"order": 8, "title": "Two Truths & AI",
     "description": "An interactive digital literacy activity from Common Sense Media that challenges students to identify AI-generated content while building critical thinking and media literacy skills.",
     "url": "https://www.commonsense.org/two-truths-and-ai"},
]

DEFAULT_LINKS = [
    {"order": 1, "title": "Nurture.Guide.Empower. Conference Website",
     "description": "", "url": "https://bcsit.org/"},
    {"order": 2, "title": "PowerSchool PD",
     "description": "", "url": "https://alsde.truenorthlogic.com/ia/empari/login/index"},
    {"order": 3, "title": "Schoology",
     "description": "", "url": "https://bhm.schoology.com"},
]

DEFAULT_ANNOUNCEMENTS = [
    {"order": 1, "badge": "REMINDER",
     "title": "Check-in opens at 7:30 AM",
     "body": "Pick up your colored band in the gym to find your assigned group for the day."},
    {"order": 2, "badge": "NEW",
     "title": "Bring your charged device",
     "body": "Most sessions are hands-on with AI tools — a tablet or laptop is recommended but not required."},
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


# ===== Links =====
@api_router.get("/links", response_model=List[Link])
async def get_links():
    items = await db.links.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items


@api_router.post("/links", response_model=Link)
async def create_link(item: Link):
    doc = item.model_dump()
    await db.links.insert_one(doc)
    return item


@api_router.put("/links/{item_id}", response_model=Link)
async def update_link(item_id: str, update: LinkUpdate):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.links.update_one({"id": item_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Link not found")
    item = await db.links.find_one({"id": item_id}, {"_id": 0})
    return item


@api_router.delete("/links/{item_id}")
async def delete_link(item_id: str):
    result = await db.links.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Link not found")
    return {"deleted": True}


# ===== Announcements =====
@api_router.get("/announcements", response_model=List[Announcement])
async def get_announcements():
    items = await db.announcements.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items


@api_router.post("/announcements", response_model=Announcement)
async def create_announcement(item: Announcement):
    doc = item.model_dump()
    await db.announcements.insert_one(doc)
    return item


@api_router.put("/announcements/{item_id}", response_model=Announcement)
async def update_announcement(item_id: str, update: AnnouncementUpdate):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.announcements.update_one({"id": item_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    item = await db.announcements.find_one({"id": item_id}, {"_id": 0})
    return item


@api_router.delete("/announcements/{item_id}")
async def delete_announcement(item_id: str):
    result = await db.announcements.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return {"deleted": True}


# ===== Admin =====
@api_router.post("/admin/verify-pin")
async def verify_pin(payload: PinVerify):
    return {"valid": payload.pin == ADMIN_PIN}


# ===== Feedback =====
@api_router.post("/feedback", response_model=Feedback)
async def submit_feedback(payload: FeedbackCreate):
    fb = Feedback(**payload.model_dump())
    await db.feedback.insert_one(fb.model_dump())
    return fb


@api_router.get("/feedback", response_model=List[Feedback])
async def list_feedback():
    items = await db.feedback.find({}, {"_id": 0}).sort("submitted_at", -1).to_list(1000)
    return items


@api_router.get("/feedback/stats")
async def feedback_stats():
    items = await db.feedback.find({}, {"_id": 0, "rating": 1}).to_list(10000)
    count = len(items)
    avg = round(sum(i["rating"] for i in items) / count, 2) if count else 0
    dist = {str(n): 0 for n in range(1, 6)}
    for i in items:
        dist[str(i["rating"])] = dist.get(str(i["rating"]), 0) + 1
    return {"count": count, "average": avg, "distribution": dist}


@api_router.delete("/feedback/{item_id}")
async def delete_feedback(item_id: str):
    result = await db.feedback.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return {"deleted": True}


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
        if await db.links.count_documents({}) == 0:
            docs = [Link(**d).model_dump() for d in DEFAULT_LINKS]
            await db.links.insert_many(docs)
            logger.info("Seeded links")
        if await db.announcements.count_documents({}) == 0:
            docs = [Announcement(**d).model_dump() for d in DEFAULT_ANNOUNCEMENTS]
            await db.announcements.insert_many(docs)
            logger.info("Seeded announcements")
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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
