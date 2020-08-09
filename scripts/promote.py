from time import sleep
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import os

dir_path = os.path.dirname(os.path.realpath(__file__))

path = dir_path + "/gecko"

os.environ["PATH"] += os.pathsep + path

def main():
	# your account user and password, path to image, links to groups and message
	usr = "chrisevans9629@gmail.com"
	pwd = "fkT5@r6LhP2Evf"
	message = "Hello World!"
	image_path = ""
	group_links = ["https://www.facebook.com/chrisevans9629/"]

	# delete cache
	profile = webdriver.FirefoxProfile()
	profile.set_preference("browser.cache.disk.enable", False)
	profile.set_preference("browser.cache.memory.enable", False)
	profile.set_preference("browser.cache.offline.enable", False)
	profile.set_preference("network.http.use-cache", False)

	# Path to geckodriver executable
	driver = webdriver.Chrome()
	driver.implicitly_wait(15)


	# Login to facebook
	driver.get("http://www.facebook.com")
	elem = driver.find_element_by_id("email")
	elem.send_keys(usr)
	elem = driver.find_element_by_id("pass")
	elem.send_keys(pwd)
	c = driver.find_element_by_id('loginbutton')
	c.click()

	for group in group_links:
		# Go to the Facebook Group and
		driver.get(group)
		sleep(5)
		post_box=driver.find_element_by_xpath("//*[@name='xhpc_message_text']")

		post_box.send_keys(message)
		sleep(5)

		if image_path != "" :
			addMedia = driver.find_element_by_xpath("//*[@data-testid='media-attachment-selector']")
			addMedia.click()

			# Provide picture file path
			driver.find_element_by_xpath("//*[@name='composer_photo']").send_keys(image_path)

		# Get the 'Post' button and click on it
		Post_button = driver.find_element_by_xpath("//*[@data-testid='react-composer-post-button']")
		sleep(5)
		Post_button.click()
		sleep(5)
	driver.close()

if __name__ == '__main__':
  main()
# graph = facebook.GraphAPI(access_token=token, version="2.12")

# post = graph.put_object("me", "feed", message="Hello World!")
