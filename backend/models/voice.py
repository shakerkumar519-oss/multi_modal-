
import os

from dotenv import load_dotenv
from groq import Groq


# -----------------------------
# 1. Load environment variables
# -----------------------------

load_dotenv()

API_KEY = os.getenv("GROQ_APIKEY")


# -----------------------------
# 2. Create Groq client
# -----------------------------

client = Groq(api_key=API_KEY)


# -----------------------------
# 3. Speech → Text
# -----------------------------

def speech_to_text(audio_path):

    with open(audio_path, "rb") as audio_file:

        transcription = client.audio.transcriptions.create(

            file=audio_file,

            model="whisper-large-v3-turbo",

            response_format="text"
        )

    return transcription





audio_path = input(
 "Enter audio file path: "
)

text = speech_to_text(audio_path)

print("\nYou said:")

print(text)

