// Importando o Sequelize
const Sequelize = require("sequelize");

// Configurando a conexão com o banco de dados
const sequelize = new Sequelize("teste", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Desativa o log das queries no console
});

// Verificando a conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados realizada com sucesso!");
  })
  .catch((err) => {
    console.log("Erro ao conectar com o banco de dados: " + err);
  });

// Definindo o modelo de "Postagem"
const Postagem = sequelize.define("postagens", {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false, // Garante que o título não seja nulo
  },
  conteudo: {
    type: Sequelize.TEXT,
    allowNull: false, // Garante que o conteúdo não seja nulo
  },
});

// Definindo o modelo de "Usuario"
const Usuario = sequelize.define("usuarios", {
  nome: {
    type: Sequelize.STRING,
    allowNull: false, // Garante que o nome não seja nulo
  },
  sobrenome: {
    type: Sequelize.STRING,
    allowNull: false, // Garante que o sobrenome não seja nulo
  },
  idade: {
    type: Sequelize.INTEGER,
    allowNull: false, // Garante que a idade não seja nula
  },
  email: {
    type: Sequelize.STRING,
    unique: true, // Garante que o email seja único
    allowNull: false, // Garante que o email não seja nulo
  },
});

// Criando as tabelas no banco de dados (se não existirem)
sequelize.sync({ force: false }) // Defina `force: true` apenas se quiser limpar o banco de dados
  .then(() => {
    console.log("Tabelas criadas com sucesso!");
  })
  .catch((err) => {
    console.log("Erro ao criar tabelas: " + err);
  });

// Inserindo uma postagem (descomentado para ser usado)
Postagem.create({
  titulo: "Exemplo de título",
  conteudo: "Este é um exemplo de conteúdo da postagem.",
})
  .then(() => {
    console.log("Postagem inserida com sucesso!");
  })
  .catch((err) => {
    console.log("Erro ao inserir postagem: " + err);
  });

// Inserindo um usuário (descomentado para ser usado)
Usuario.create({
  nome: "Afonso",
  sobrenome: "Silva",
  idade: 22,
  email: "afonso.silva@teste.com", // Email deve ser único
})
  .then(() => {
    console.log("Usuário inserido com sucesso!");
  })
  .catch((err) => {
    console.log("Erro ao inserir usuário: " + err);
  });
