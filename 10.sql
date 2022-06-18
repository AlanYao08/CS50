SELECT DISTINCT(name)
FROM directors, people, ratings
WHERE rating >= 9.0 AND directors.movie_id = ratings.movie_id AND person_id = people.id;