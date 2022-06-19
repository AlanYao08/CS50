SELECT DISTINCT(name)
FROM people, stars, movies
WHERE year = 2004 AND movie_id = movies.id AND person_id = people.id
ORDER BY birth;