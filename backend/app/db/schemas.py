from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import enum

class Status(str, enum.Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    
class UserCreate(BaseModel):
    email: EmailStr
    pwd: str
    
class UserOut(BaseModel):
    id: int
    email: EmailStr
    joined_at: datetime
    
    class Config:
        from_attributes=True
        
class LoginRequest(BaseModel):
    email: EmailStr
    pwd: str
    
class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    
class RefreshTokenReq(BaseModel):
    refresh_token: str
    
class AffiliateCreate(BaseModel):
    name: str
    code: str
    
class AffiliateOut(AffiliateCreate):
    id: int
    status: Status
    
    class Config:
        from_attributes=True
        
class CourseCreate(BaseModel):
    title: str
    description: str
    category: str
    publisher: str
    price: str
    lang: str
    link: str
    image_url: str
    is_active: bool
    
class CourseOut(CourseCreate):
    id: int
    
    class Config:
        from_attributes=True
        
class PaginatedOut(BaseModel):
    total: int
    limit: int
    offset: int
    results: list[CourseOut] # This ensures that the response matches the expected schema of the get_all_courses endpoint

class EnrollmentCreate(BaseModel):
    user_id: int
    course_id: int
    
class EnrollmentOut(EnrollmentCreate):
    id: int
    
    class Config:
        from_attributes=True
        
class BookmarkCreate(BaseModel):
    user_id: int
    course_id: int
    
class BookmarkOut(BookmarkCreate):
    id: int
    
    class Config:
        from_attributes=True
        
class AnnounType(str, enum.Enum):
    INFORMATION = "info"
    RESOURCE = "resource"
    JOB = "job"
    INTERNSHIP = "internship"
        
class Announcement(BaseModel):
    type: AnnounType
    title: str
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    preview: str
    description: str
    source: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    link: Optional[str] = None
    
class AnnouncementOut(Announcement):
    id: int
    
    class Config:
        from_attributes = True
        
class Scraper_logs(BaseModel):
    course_title: str
    udemy_link: str
    status: str
    timestamp: datetime
    
class Scraper_logsOut(Scraper_logs):
    id: int
    
    class Config:
         from_attributes = True
         
class MetricsOut(BaseModel):
    id: int
    total_users: int
    total_courses: int
    most_enrolled_course: int
    change_users: int
    change_courses: int
    growth_rate: int
    timestamp: datetime
    
    class Config:
         from_attributes = True
         
class MetricsRes(BaseModel):
    records: MetricsOut
    users: int
    courses: int