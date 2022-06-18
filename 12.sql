SELECT title
FROM movies, stars, people
check50 cs50/problems/2022/x/moviesWHERE person_id = (SELECT id FROM people WHERE name = "Johnny Depp");