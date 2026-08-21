import pyttsx3

engine = pyttsx3.init()

text = """
Hello, this is a test audio file for my multimodal AI project.
This audio will be saved on my computer.
"""

engine.setProperty("rate", 150)

engine.save_to_file(
    text,
    "test_audio.wav"
)

engine.runAndWait()

print("Audio created successfully!")
engine.save_to_file(
    text,
    r"D:\project\ml_learnings\demo\audio\test_audio.wav"
)