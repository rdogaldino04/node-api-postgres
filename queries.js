const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '10.0.40.200',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM usuarios ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM usuarios WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { login, senha } = request.body
  pool.query('INSERT INTO usuarios (login, senha) VALUES ($1, $2) RETURNING id', [login, senha], (error, result) => {
    if (error) {
        throw error
    }
    response.status(201).send(`User created with id: ${result.rows[0].id}`);
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { login, senha } = request.body

  pool.query(
    'UPDATE usuarios SET login = $1, senha = $2 WHERE id = $3',
    [login, senha, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM usuarios WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}

//script
/*
create table usuarios (
	id bigint,
	login text,
	senha text
);

ALTER TABLE public.usuarios
    ADD CONSTRAINT pk_usuarios PRIMARY KEY (id)
;

CREATE SEQUENCE SEQ_USUARIOS;

ALTER TABLE USUARIOS
  ALTER ID SET DEFAULT NEXTVAL('SEQ_USUARIOS');
  
ALTER TABLE public.usuarios
    ADD CONSTRAINT uk_usu_login UNIQUE (login)
;  
*/