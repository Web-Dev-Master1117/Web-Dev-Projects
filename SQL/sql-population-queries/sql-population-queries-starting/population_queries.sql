-- This is the first query:

SELECT DISTINCT year from population_years;

-- Largest population size for 'Gabon' in db:

SELECT MAX(population), country FROM population_years WHERE country = 'Gabon';

-- 10 Lowest population countries in 2005

SELECT country, population FROM population_years WHERE year = 2005 ORDER BY population LIMIT 10;

-- distinct countries with population over 100 million in the year 2010

SELECT DISTINCT country FROM population_years WHERE population > 100 AND year = 2010;

-- number of countries having 'Islands' in their name

SELECT count(country) AS `Number` FROM population_years WHERE country like '%Islands%';

-- difference between population of 2000 and 2010 in indonesia

SELECT population - (SELECT population FROM population_years WHERE year = 2000 AND country = 'Indonesia') AS `Population Difference` FROM population_years WHERE year = 2010 AND country = 'Indonesia';
