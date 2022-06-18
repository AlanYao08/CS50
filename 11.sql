SELECT title
FROM movies, stars, people, ratings
WHERE name = "Chadwick Boseman"AND person_id = people.id AND stars.movie_id = ratings.movie_id
ORDER BY rating DESC LIMIT 5;