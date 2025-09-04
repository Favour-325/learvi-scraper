import os
import httpx
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import json

BASE_URL = "https://www.discudemy.com"
HEADERS = {"User-agent": "Mozilla/5.0"}

def get_course_links(page: int = 1) -> list | None:
    try:
        url = f"{BASE_URL}/all/{page}"
        response = httpx.get(url, timeout=30.0, headers=HEADERS)
        soup = BeautifulSoup(response.text, "html.parser")
        
        course_divs = soup.find_all("section", class_="card")
        
        course_links = []
        for course in course_divs:
            catLink = {} # category and link
            a_tag = course.find("a", class_="card-header")
            if a_tag:
                catLink["link"] = (urljoin(BASE_URL, a_tag.get("href")))
                
            span_tag = course.find("span", class_="catSpan")
            if span_tag:
                catLink["category"] = span_tag.text.strip()
                
            course_links.append(catLink)
            
        return course_links
    
    except Exception as e:
        print(f"[ERROR] Failed to get course links: {e}") # Use loggers for better tracability
        return None


def scrape_course_details(course_url: dict) -> dict | None:
    if not course_url or not course_url.get('link'):
        return None
        
    try:
        # Step 1: Visit initial course page
        res = httpx.get(course_url.get('link'), timeout=30.0, headers=HEADERS)
        soup = BeautifulSoup(res.text, "html.parser")
        
        # Step 2: Extract link to intermediate "go to course" page
        course_btn = soup.find("a", class_="ui big inverted green button discBtn")
        if not course_btn:
            return None
        
        res1 = httpx.get(urljoin(BASE_URL, course_btn.get("href")), timeout=30.0, headers=HEADERS, follow_redirects=False)
        go_html = BeautifulSoup(res1.text, "html.parser")
        
        # Step 3: Extract final udemy link
        link_container = go_html.select_one('div[class="ui segment"]')
        udemy_link = link_container.find("a")['href'] if link_container else None
        
        # Step 4: Extract metadata
        desc_container = go_html.select_one('div[class="ui attached segment"]')
        description = desc_container.find_all("p")[0].text.strip() if desc_container else None
        
        title_tag = go_html.find("h1", class_="ui grey header")
        title = title_tag.text.strip() if title_tag else "No Title"
        
        publisher_tag = soup.select_one('span[class="publisher"]')
        publisher = publisher_tag.text.strip() if publisher_tag else "Unknown"
        
        price_tag = soup.find("span", class_="price")
        price = price_tag.text.strip() if price_tag else "Free"
        
        lang_tag = soup.find("span", class_="languages")
        lang = lang_tag.text.strip() if lang_tag else "Unknown"
        
        image_tag = soup.find("amp-img")
        image_url = image_tag.get("src") if image_tag else None
        
        return {
            "title": title,
            "description": description,
            "category": course_url['category'],
            "publisher": publisher,
            "price": price,
            "lang": lang,
            "udemy_link": udemy_link,
            "image_url": image_url,
            "scraped_at": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(days=3)).isoformat() # ISN'T WORKING !!
        }
        
    except Exception as e:
        print(f"[ERROR] Failed to scrape courses: {e}") # Use loggers
        return None
    

def scrape_discudemy_courses(pages: int = 1):
    all_courses = []
    for page in range(1, pages + 1):
        course_links = get_course_links(page)
        for link in course_links:
            course_data = scrape_course_details(link)
            if course_data:
                all_courses.append(course_data)
    
    time = (datetime.utcnow()).strftime("%Y%m%d_%H%M")
    filepath = f"../raw_courses/discudemy_{time}.json" # JSON file to hold scraped courses
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True) # Creates the directory if it doesn't exist
    
    try:
        with open(filepath, "w", encoding='utf-8') as file:
            json.dump(all_courses, file, indent=4) # serializes the data to json format and writes it to the file
            
        return filepath # returns the path to the JSON file that holds the scraped course
    
    except Exception as e:
        print(f"[ERROR] Failed to create file: {e}")
        return