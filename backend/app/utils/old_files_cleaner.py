import os
from datetime import datetime, timedelta
from app.utils.logger import get_logger

RAW_DATA_DIR = "../raw_courses" # directory holding scraped courses in json format
LOGS_DATA_DIR = "../logs"
logger = get_logger(__name__)

def delete_files(DIR, prefix, cut_off):
    if prefix == "PROCESSED_":
        logger.info(f"Deleting old PROCESSED files...")
    
    elif prefix == "logs":
        logger.info(f"Deleting old LOG files...")
        
    processed_file = 0
    
    for file in os.listdir(DIR): # get the list of files found in RAW_DATA_DIR
        if file.startswith(prefix):
            fullpath = os.path.join(DIR, file)
            mtime = datetime.fromtimestamp(os.path.getmtime(fullpath)) # get the last modification time of the file
            
            if mtime < cut_off:
                processed_file += 1
                logger.info(f"Deleting file {fullpath}")
                
                os.remove(fullpath) # deletes the file
                
    logger.info(f"Deleted {processed_file} files.")
                

def clean_old_files():
    cut_off = datetime.now() - timedelta(days=21)
    
    delete_files(RAW_DATA_DIR, "PROCESSED_", cut_off) # delete old json files
    delete_files(LOGS_DATA_DIR, "logs_", cut_off) # delete old log files