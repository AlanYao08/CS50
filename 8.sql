SELECT name
FROM people, stars, movies
WHERE title = "Toy Story" AND movie_id = movies.id AND person_id = people.id;