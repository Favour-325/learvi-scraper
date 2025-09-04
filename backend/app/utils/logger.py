import logging
import os

LOGS_DIR = "../logs"

def get_logger(name: str):
    try:
        os.makedirs(LOGS_DIR, exist_ok=True)
        logger = logging.getLogger(name) # return or create a logger with the specified name
        logger.setLevel(logging.INFO) # Log messages with level INFO, WARNING, ERROR, and CRITICAL
        
        fh = logging.FileHandler(f"{LOGS_DIR}/journal.log") # creates a file handler that will write log messages to journal.log
        format = logging.Formatter('%(asctime)s | %(levelname)s | %(message)s')
        fh.setFormatter(format)
        logger.addHandler(fh)
        
        return logger
    
    except Exception as e:
        print(f"[ERROR] Failed to creater logger: {e}")