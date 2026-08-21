import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
load_dotenv()
api = os.getenv("HF_TOKEN")
client = InferenceClient(api,provider = "auto")
prompt = input("YOU : ")
image = client.text_to_image(prompt = prompt,model = "black-forest-labs/FLUX.1-dev")
image.save("generated_image.png")
print("Image generated successfully")