import pymupdf
def extract_pdf(pdf_path):
    documents = pymupdf.open(pdf_path)
    pages = []
    for page in documents:
        text = page.get_text()
        pages.append(text)
    documents.close()
    return "\n".join(pages)


