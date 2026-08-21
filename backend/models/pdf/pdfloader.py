import fitz


def extract_text_from_pdf(pdf_path):

    document = fitz.open(pdf_path)

    all_text = ""

    for page in document:

        page_text = page.get_text()

        all_text += page_text

        all_text += "\n"

    document.close()

    return all_text


if __name__ == "__main__":

    pdf_path = input(
        "Enter PDF path: "
    )

    text = extract_text_from_pdf(
        pdf_path
    )

    print("\nExtracted PDF text:\n")

    print(text) 