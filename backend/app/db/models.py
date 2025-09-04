from sqlalchemy import Column, Integer, String, Enum, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from datetime import datetime, timedelta
from app.core.config import Base

    
class Status(str, enum.Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"

class User(Base):
    __tablename__ = "user"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_pwd = Column(String, nullable=False)
    role = Column(String, default="User", nullable=False, index=True)
    joined_at = Column(DateTime(timezone=True), default=datetime.now().replace(microsecond=0))
    
    affiliate_id = Column(Integer, ForeignKey('affiliate.id'), nullable=True)
    
    bookmark = relationship('Bookmark', back_populates='user')
    enrollment = relationship('Enrollment', back_populates='user')
    affiliate = relationship('Affiliate', back_populates='user')
    refresh_token = relationship('RefreshToken', back_populates='user')
    
    
class RefreshToken(Base):
    __tablename__ = "refreshtokens"
    
    id = Column(Integer, primary_key=True, index=True)
    token_hash = Column(String, unique=True, index=True, nullable=False)
    is_revoked = Column(Boolean, default=False)
    
    user_id = Column(Integer, ForeignKey('user.id'), index=True, nullable=False)
    
    expires_at = Column(DateTime(timezone=True), index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now())
    
    user = relationship('User', back_populates='refresh_token') 

class Affiliate(Base):
    __tablename__ = "affiliate"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    code = Column(String, unique=True, nullable=False)
    status = Column(Enum(Status), default=Status.ACTIVE, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    
    user = relationship('User', back_populates='affiliate')
    
    
class Course(Base):
    __tablename__ = "course"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    publisher = Column(String, nullable=False)
    price = Column(String, nullable=False)
    lang = Column(String, nullable=False)
    link = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    expiry_date = Column(DateTime(timezone=True), nullable=False, default=(lambda: datetime.now() + timedelta(days=3)))
    
    enrollment = relationship('Enrollment', back_populates='course')
    
    
class Enrollment(Base):
    __tablename__ = "enrollment"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.now, nullable=False)
    
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    course_id = Column(Integer, ForeignKey('course.id'), nullable=False)
    
    user = relationship('User', back_populates='enrollment')
    course = relationship('Course', back_populates='enrollment')
    metric = relationship('Metrics', back_populates='enrollment_rel')
    

# MIGHT BECOME USELESS!!!
class Bookmark(Base):
    __tablename__ = "bookmark"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.now)
    
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    course_id = Column(Integer, ForeignKey('course.id'), nullable=False)
    
    user = relationship('User', back_populates='bookmark')
    course = relationship('Course')
    

class AnnounType(str, enum.Enum):
    ANNOUNCEMENT = "info"
    RESOURCE = "resource"
    JOB = "job"
    INTERNSHIP = "internship"
   
class Announcement(Base):
    __tablename__ = "announcement"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(AnnounType), default=AnnounType.ANNOUNCEMENT, nullable=False)
    title = Column(String, nullable=False)
    responsibilities = Column(String, nullable=True, default=None)
    requirements = Column(String, nullable=True, default=None)
    preview = Column(String, nullable=False)
    description = Column(String, nullable=False)
    source = Column(String, nullable=True, default=None)
    location = Column(String, nullable=True, default=None)
    email = Column(String, nullable=True, default=None)
    phone = Column(String, nullable=True, default=None)
    link = Column(String, nullable=True, default=None)
    
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
    

class Scraper_log(Base):
    __tablename__ = "scraper_log"
    
    id = Column(Integer, primary_key=True, index=True)
    course_title = Column(String, nullable=False)
    udemy_link = Column(String, nullable=False)
    status = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=datetime.now)
    

# After 30 days count the total number of users from the User table and compare it to the value in the metrics table then perform the calculations using these values.
class Metrics(Base):
    __tablename__ = "metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    total_users = Column(Integer, nullable=False)
    total_courses = Column(Integer, nullable=False)
    most_enrolled_course = Column(Integer, ForeignKey('course.id'), nullable=False)
    
    change_users = Column(Integer, nullable=False)
    change_courses = Column(Integer, nullable=False)
    
    growth_rate = Column(Integer, nullable=False)
    
    timestamp = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
    
    enrollment_id = Column(Integer, ForeignKey('enrollment.id'), nullable=False)
    
    enrollment_rel = relationship('Enrollment', back_populates='metric')
    