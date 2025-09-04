from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.events import EVENT_JOB_EXECUTED, JobExecutionEvent
from datetime import datetime, timedelta
from app.core.config import SessionLocal

from app.services.course_cleanup import delete_expired_courses
from app.services.scraper.discudemy import scrape_discudemy_courses
from app.utils.scraped_course_saver import save_courses_from_file
from app.utils.old_files_cleaner import clean_old_files
from app.utils.growth_rate_calc import growth_rate_calc
from app.utils.logger import get_logger

logger = get_logger(__name__)

# 1. creates a BackgroundScheduler instance
# 2. schedules the functions to run automatically on defined periods
# 3. starts the scheduler which will run in the background and periodically execute the job

def delayed_save_courses(filepath: str):
    save_courses_from_file(filepath)
    
def run_growth_rate_calc():
    db = SessionLocal()
    try:
        growth_rate_calc(db)
    finally:
        db.close()

def job_listener(event: JobExecutionEvent):
    if event.job_id == 'scraper':
        filepath = event.retval # gets the filepath as a returned value from the scraper function
        run_at = datetime.now() + timedelta(minutes=1) # SET TO 30 MINUTES IN PRODUCTION
        
        logger.info(f"Scraper job completed. Scheduling course-saver job for run at {run_at}")
        
        scheduler.add_job(delayed_save_courses, 'date', run_date=run_at, args=[filepath], id=f"save_courses_{datetime.now()}", misfire_grace_time=60) # Allow 60 second grace period if job can't run exactly on time

def setup_scheduler():
    global scheduler # make the variable accessible within and out of its scope of definition
    scheduler = BackgroundScheduler()
    
    #scheduler.add_job(scrape_discudemy_courses, 'interval', hours=4, next_run_time=datetime.now(), id='scraper') # schedules function to run on app startup and after every 4h
    #scheduler.add_listener(job_listener, EVENT_JOB_EXECUTED) # listens for an execution event
    
    #scheduler.add_job(delete_expired_courses, 'interval', hours=24, next_run_time=datetime.now())
    scheduler.add_job(clean_old_files, 'interval', days=30, next_run_time=datetime.now())
    #scheduler.add_job(run_growth_rate_calc, 'interval', days=30, next_run_time=datetime.now())
    
    scheduler.start()
    
    # return scheduler