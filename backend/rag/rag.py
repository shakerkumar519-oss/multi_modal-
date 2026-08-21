
import os

from dotenv import load_dotenv
from groq import Groq

from .embedd import create_embeddings
from .vectorstore import search


# -----------------------------
# Configuration
# -----------------------------

load_dotenv()

API_KEY = os.getenv(
    "GROQ_APIKEY"
)

client = Groq(
    api_key=API_KEY
)


# -----------------------------
# Retrieval
# -----------------------------

def retrieve_chunks(
    question,
    n_results=5
):

    question_embedding = create_embeddings(
        [question]
    )[0]

    results = search(
        question_embedding,
        n_results
    )

    documents = results["documents"][0]

    return documents


# -----------------------------
# Generation
# -----------------------------

def generate_answer(
    question,
    context
):

    prompt = f"""
You are a helpful assistant answering
questions about a PDF.

Use the provided context to answer
the user's question.

If the answer cannot be found in
the context, say that the information
was not found in the document.

Context:

{context}

Question:

{question}

Answer:
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
# Complete RAG pipeline
# -----------------------------

def ask_question(question):

    # Retrieve relevant chunks
    chunks = retrieve_chunks(
        question
    )

    # Combine chunks into context
    context = "\n\n".join(
        chunks
    )

    # Ask Groq
    answer = generate_answer(
        question,
        context
    )

    return answer




question = input(
        "Ask a question: "
    )

answer = ask_question(
        question
    )

print("\nAI:", answer)

