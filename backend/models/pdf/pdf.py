import os

from dotenv import load_dotenv
from groq import Groq

from pdfloader import extract_text_from_pdf


# -----------------------------
# 1. Load environment
# -----------------------------

load_dotenv()

API_KEY = os.getenv("GROQ_APIKEY")


# -----------------------------
# 2. Create Groq client
# -----------------------------

client = Groq(api_key=API_KEY)


# -----------------------------
# 3. Ask question about PDF
# -----------------------------

def ask_pdf(pdf_path, question):

    pdf_text = extract_text_from_pdf(
        pdf_path
    )

    prompt = f"""
You are answering questions about a PDF.

Here is the PDF text:

{pdf_text}

User question:

{question}

Answer the question using the PDF text.
If the answer is not present in the PDF,
say that you could not find the answer.
"""

    response = client.chat.completions.create(

        model=os.getenv("GROQ_MODEL", "openai/gpt-oss-120b"),

        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content


# -----------------------------
# 4. Test
# -----------------------------

if __name__ == "__main__":

    pdf_path = input(
        "Enter PDF path: "
    )

    question = input(
        "Ask a question about the PDF: "
    )

    answer = ask_pdf(
        pdf_path,
        question
    )

    print("\nAI:", answer) 