from selenium import webdriver
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.chrome import ChromeDriverManager
import time

LOGIN_URL = 'https://www.facebook.com/login.php'

class FacebookLogin():
    def __init__(self, email, password, browser='Chrome'):
        self.email = email
        self.password = password
        if browser == 'Chrome':
            self.driver = webdriver.Chrome(executable_path=ChromeDriverManager().install())
        elif browser == 'Firefox':
            self.driver = webdriver.Firefox(executable_path=GeckoDriverManager().install())
        self.driver.get(LOGIN_URL)
        time.sleep(1)
    def login(self):
        email_element = self.driver.find_element_by_id('email')
        email_element.send_keys(self.email)

        password_element = self.driver.find_element_by_id('pass')
        password_element.send_keys(self.password)

        login_button = self.driver.find_element_by_id('loginbutton')
        login_button.click()

        time.sleep(2)

fb = FacebookLogin('mickreys249@gmail.com', 'kmatthieu15')
fb.login()