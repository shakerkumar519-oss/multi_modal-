def split_text(text,chunk_size = 1500,chunk_overlap = 200) :
    chunks = []
    start = 0
    while start <len(text):
        end = start+chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size-chunk_overlap
    return chunks