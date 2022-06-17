text = input("Text: ")
letters = 0
words = 1
sentences = 0
for i in range(0, len(text), 1):
    if (text[i] >= 'a' and text[i] <= 'z') or (text[i] >= 'A' and text[i] <= 'Z'):
        letters += 1
    elif (text[i] == ' '):
        words += 1
    elif (text[i] == '.' or text[i] == '!' or text[i] == '?'):
        sentences += 1
level = round(0.0588 * letters / words * 100 - 0.296 * sentences / words * 100 - 15.8)
if (level < 0):
    print("Before Grade 1")
elif (level >= 16):
    print("Grade 16+")
else:
    print(f"Grade {level}")