rows = songs.execute("SELECT name FROM songs")
for row in rows:
    print(row["name"])