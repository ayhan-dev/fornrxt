import pyperclip
import re
import webbrowser
import requests


def is_valid_github_link(link):
    pattern = r"https://github.com/[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+"
    return re.match(pattern, link) is not None
def open_link_in_browser(link):
    webbrowser.open(link)
def send_link_to_api(link):
    api_url = "https://DevDiwan.com/API.php?text="
    try:
        response = requests.get(api_url + link)
        response.raise_for_status()
        print("لینک با موفقیت به API ارسال شد.")
    except requests.exceptions.HTTPError as errh:
        error_message = f"HTTP Error: {errh}\n"
        log_error(error_message)
    except Exception as err:
        error_message = f"General Error: {err}\n"
        log_error(error_message)
def log_error(error_message):
    with open("error_log.txt", "a") as error_file:
        error_file.write(error_message)
def save_github_links_to_file(file_path):
    while True:
        clipboard_content = pyperclip.paste().strip()
        if is_valid_github_link(clipboard_content):
            with open(file_path, "a") as file:
                file.write(clipboard_content + "\n")
            open_link_in_browser(clipboard_content)
            send_link_to_api(clipboard_content)
        else:
            print("لینک معتبر نیست.")
        while pyperclip.paste().strip() == clipboard_content:
            pass
if __name__ == "__main__":
    file_path = "github_links.txt"
    save_github_links_to_file(file_path)
