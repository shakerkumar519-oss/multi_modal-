
from .pdf_loader import extract_pdf
from .chunker import split_text
from .embedd import create_embeddings
from .vectorstore import add_documents



def ingest_pdf(pdf_path):

    # 1. Extract text
    text = extract_pdf(pdf_path)

    # 2. Split text into chunks
    chunks = split_text(text)

    # 3. Create embeddings
    embeddings = create_embeddings(chunks)

    # 4. Create unique IDs
    ids = [
        f"chunk_{i}"
        for i in range(len(chunks))
    ]

    # 5. Store in vector database
    add_documents(
        chunks,
        embeddings,
        ids
    )

    print(
        f"Stored {len(chunks)} chunks."
    )




pdf_path = input(
        "Enter PDF path: "
    )

ingest_pdf(pdf_path)
