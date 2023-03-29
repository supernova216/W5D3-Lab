//1
SELECT * FROM invoice
WHERE invoice_id IN(
  SELECT invoice_id FROM invoice_line WHERE unit_price>0.99);

//2
SELECT * FROM playlist_track
WHERE playlist_id IN(
  SELECT playlist_id FROM playlist WHERE name = 'Music');

//3
SELECT * FROM track
WHERE track_id IN(
  SELECT track_id FROM playlist_track WHERE playlist_id = 5);

//4
SELECT * FROM track
WHERE genre_id IN(
  SELECT genre_id FROM genre WHERE name = 'Comedy');

//5
SELECT * FROM track
WHERE album_id IN(
  SELECT album_id FROM album WHERE title = 'Fireball');

//6
SELECT * FROM track
WHERE album_id IN(
  SELECT album_id FROM album 
  WHERE artist_id IN (
    SELECT artist_id FROM artist
    WHERE name = 'Queen'));
