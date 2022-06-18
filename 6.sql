SELECT AVG(rating)
FROM ratings, movies
WHERE year = 2012 AND movie_id = id;