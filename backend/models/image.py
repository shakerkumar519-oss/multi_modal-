import os
from dotenv import load_dotenv
from groq import Groq
import base64
load_dotenv()
API_KEY = os.getenv("GROQ_APIKEY")
client = Groq(api_key = API_KEY)
def encode_image(image_path):
    with open(image_path,"rb") as image_file:
        image_bytes = image_file.read()
    base64_image = base64.b64encode(image_bytes)
    base64_image = base64_image.decode("utf-8")
    return base64_image
def analyse_image(image_path,question):
    base64_image = encode_image(image_path)
    messages=[ { "role": "user", "content": [ { "type": "text", "text": question }, { "type": "image_url", "image_url": { "url": f"data:image/jpeg;base64,{base64_image}" } }
                                             ] } ] 
    response = client.chat.completions.create(
        model="qwen/qwen3.6-27b",
        messages=messages
    )
    answer = response.choices[0].message.content
    return answer


image_path = input("Enter image path: ")
question = input( "Ask something about the image: " )
answer = analyse_image( image_path, question ) 
print("\nAI:", answer)

    


