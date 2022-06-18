SELECT title
FROM movies, stars, people, ratings
WHERE person_id = (SELECT id FROM people WHERE name = "Chadwick Boseman") AND person_id = people.id AND stars.movie_id = ratings.movie_id
ORDER BY rating DESC LIMIT 5;