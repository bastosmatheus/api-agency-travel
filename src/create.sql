CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(40) UNIQUE,
  password TEXT,
  cpf VARCHAR(11) UNIQUE,
  telephone VARCHAR(11) UNIQUE,
  is_admin BOOLEAN
);

CREATE TABLE IF NOT EXISTS bus_stations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  city VARCHAR(30),
  uf VARCHAR(2)
);

CREATE TABLE IF NOT EXISTS travels (
  id SERIAL PRIMARY KEY,
  departure_date TIMESTAMPZ,
  arrival_date TIMESTAMPZ,
  bus_seat VARCHAR(20),
  price DECIMAL(12, 2),
  distance_km INTEGER,
  duration VARCHAR(40),
  available_seats INTEGER[],
  id_busStation_departureLocation INTEGER,
  id_busStation_arrivalLocation INTEGER,

  FOREIGN KEY (id_busStation_departureLocation) REFERENCES bus_stations (id),
  FOREIGN KEY (id_busStation_arrivalLocation) REFERENCES bus_stations (id)
);

CREATE TABLE IF NOT EXISTS passengers (
  id SERIAL PRIMARY KEY,
  seat INTEGER,
  payment VARCHAR(6),
  id_travel INTEGER,
  id_user INTEGER,
  
  FOREIGN KEY (id_travel) REFERENCES travels (id),
  FOREIGN KEY (id_user) REFERENCES users (id)
);