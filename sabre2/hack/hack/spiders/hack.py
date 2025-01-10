import scrapy
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import re
import time
from selenium.webdriver.support.select import Select
import requests

class Hack(scrapy.Spider):

    # query = None
    
    # def __init__(self, query='', **kwargs):
    #     self.query = query
    #     super().__init__(**kwargs)

    op = Options()
    op = webdriver.ChromeOptions()
    op.add_argument('headless')

    browser = webdriver.Chrome(service = ChromeService(ChromeDriverManager().install()),options=op)

    # browser.get(<your website >)
    # location_name = browser.get_element_by_xpath("<xpath of input area>").text()

    with open('/home/sandeep/Desktop/sabre2/hack/hack/spiders/cityName.txt', 'r') as file:
    # Read the contents of the file into a string variable
        data = file.read()


    

    # q = query
    browser.get(f"https://www.tripadvisor.com/Search?q={data}")
    time.sleep(3)

    current_url = browser.find_element("xpath", '/html/body/div[2]/div/div[2]/div/div/div/div/div[1]/div/div[1]/div/div[3]/div/div[1]/div/div[2]/div/div/div/div/div/div')

    print(current_url.get_attribute('innerHTML').split(',')[3])

    nextLink = current_url.get_attribute('innerHTML').split(',')[3]

    browser.get("https://www.tripadvisor.com/"+nextLink)

    currUrl = browser.current_url

    print(currUrl)


    name = "hack"
    start_urls = [
        currUrl
    ]

    def parse(self, response):
        for div in response.css("div.RVjQe"):
            for a in div.css("a"):
                link = a.css("a::attr(href)").get()
                yield scrapy.Request(response.urljoin(link), self.parse_page)

    def parse_page(self, response):

        # name = response.css("div.nrbon h1::text").get()

        attrType = response.xpath('//*[@id="lithium-root"]/main/div[1]/div[2]/div[2]/div[2]/div/div[1]/section[1]/div/div/div/div/div[1]/div[3]/div/div/div[1]/text()').get()

        
        
        op=""
        a=attrType.split(" ")
        for i in a:
            if(i in ("Architectural Buildings Observation Decks Gardens Historic Landmarks Castles Bridges Cemeteries Observatories Planetariums Monuments Statues Points of Interest Landmarks momentous")):
                
                op="Historical"
                
            if(i in ("Religious Sites Temple Speciality Museums Devotion praise")):
                
                op="Worship"
                
            if(i in ("Flea Street Markets Malls Shopping Purchasing ")):
                
                op="Shopping"
                
            if(i in ("Gardens Parks Theme Aquariums Carnival Rides Hiking Trails")):
                
                op="Amusement"
                
            if(i in ("Neighbourhoods Nature Wildlife Areas Beaches Scenic Drives")):
                
                op="Adventure"
                
        if(op==""):
            op="Historical"
        
        


        name = response.css("div.iSVKr h1::text").get()

        ratings = response.css('span.biGQs._P.vvmrG::text').getall()[3:]

        lst = response.css("div.jKOuM").getall()

        rest = lst[0][59:77]
        attr = lst[1][59:77]
            
        yield {
                'name' : name,
                'restaurant': rest,
                'attraction' : attr,
                'ratings' : ratings,
                'attractionType' : op
        }
