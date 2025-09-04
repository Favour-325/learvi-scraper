import os
import json
import shutil # advanced file management library
import time
from datetime import datetime, timedelta

import httpx
from sqlalchemy.orm import Session
from app.db.models import Course, Scraper_log
from app.core.config import SessionLocal
from app.utils.logger import get_logger

LOGS_DIR = "../logs" # dir to log files
UDEMY_DOMAIN = "udemy.com"

logger = get_logger(__name__) # __name__ is best practice because it names the logger after the file/module in which it is found at the moment of creation, so we can trace log messages back to the file/module where they originated from.

def is_valid_udemy_link(link: str) -> bool:
    return UDEMY_DOMAIN in link

def is_reachable(url: str) -> bool:
    try:
        res = httpx.head(url, timeout=30, headers={"User-agent": "Mozilla/5.0"})
        return res.status_code < 300
    except httpx.RequestError as e: # catch httpx.RequestError or httpx.TimeOutException
        logger.error(f"[ERROR] Udemy link {url} is not reachable: {e}")
        return False

def course_exists(db: Session, udemy_link: str) -> bool:
    return db.query(Course).filter(Course.link == udemy_link).first() is not None


def save_courses_from_file(filepath: str):
    db = SessionLocal()
    processed = 0
    accepted = 0
    rejected = 0
    log_data = []
    
    with open(filepath, "r", encoding="utf-8") as file:
        try:
            data = json.load(file)
        except Exception as e:
            logger.error(f"Failed to load JSON file {filepath}: {e}")
            return
        
    # VALIDATION PROCESS BEFORE SAVING SCRAPED COURSE TO THE DATABASE
    for course in data:
        processed += 1
        
        if not course.get("title") or not course.get("udemy_link"):
            log_entry = {
                "course": "No Title",
                "udemy_link": "No Link",
                "status": "No Values",
                "timestamp": datetime.utcnow().isoformat()
            }
            log_data.append(log_entry)
            
            new_log = Scraper_log(
                course_title = "No Title",
                udemy_link = "No Link",
                status = "No Values",
                timestamp = datetime.utcnow().isoformat()
            )
            db.add(new_log)
            db.commit()
            
            continue
        
        u_link = course.get("udemy_link")
        lang = course.get("lang")
        
        if not u_link or not is_valid_udemy_link(u_link):
            reason = "Invalid Udemy Link"
        # elif not is_reachable(u_link):
        #    reason = "Udemy Link not reachable"
            time.sleep(5) # Delay execution for 2 seconds to avoid risk of rate-limiting from server
        elif lang != "English":
            reason = "Non-English course"
        elif course_exists(db, u_link):
            reason = "Duplicate LInk"
        else:
            new_course = Course(
                title = course.get("title"),
                description = course.get("description"),
                category = course.get("category"),
                publisher = course.get("publisher"),
                price = course.get("price"),
                lang = lang,
                link = u_link,
                image_url = course.get("image_url"),
                expiry_date = course.get("expires_at")
            )
            db.add(new_course)
            reason = "Accepted"
            accepted += 1
        
        db.commit()
        # Create a log entry for the course
        log_entry = {
            "course_title": course.get("title"),
            "udemy_link": u_link,
            "status": reason,
            "timestamp": datetime.utcnow().isoformat()
        }
        log_data.append(log_entry)
        
        new_log = Scraper_log(
            course_title = course.get("title"),
            udemy_link = u_link,
            status = reason,
            timestamp = datetime.utcnow().isoformat()
        )
        db.add(new_log)
        db.commit()
        
    db.close()
    
    # logging to file
    basename = os.path.basename(filepath)
    log_filename = os.path.join(LOGS_DIR, f"logs_{basename.replace('.json', '.log')}")
    
    with open(log_filename, "w", encoding="utf-8") as file:
        json.dump(log_data, file, indent=4) # Serialize log data to json format and write to the file
    
    file_dir = os.path.dirname(filepath)
    new_filename = os.path.join(file_dir, "PROCESSED_" + basename)
    
    os.rename(filepath, new_filename) # rename file
    logger.info(f"Processed file {filepath}. Total: {processed}, Accepted: {accepted}, Rejected: {processed - accepted}.")