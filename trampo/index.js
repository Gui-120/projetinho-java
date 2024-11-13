// Importando bibliotecas
const Sequelize = require("sequelize"); // Sequelize
const express = require("express"); // Express
const { create } = require("express-handlebars"); // Express Handlebars

// Clonando a variável com poderes das bibliotecas
const app = express(); // Express

// ### CONEXÃO COM BANCO DE DADOS ###
const conexaoComBanco = new Sequelize("teste", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
// ### FIM CONEXÃO COM BANCO DE DADOS ###

// ### MODELOS DE BANCO DE DADOS ###

// Modelo de Usuário
const User = conexaoComBanco.define("User", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

// Modelo de Curso
const Course = conexaoComBanco.define("Course", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  endDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

// Modelo de Inscrição
const Registration = conexaoComBanco.define("Registration", {
  dateOfRegistration: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

// Relacionamentos
User.belongsToMany(Course, { through: Registration });
Course.belongsToMany(User, { through: Registration });

// Sincronizando os modelos com o banco de dados
conexaoComBanco.sync({ force: true })
  .then(() => {
    console.log("Banco de dados sincronizado");
  })
  .catch((err) => {
    console.error("Erro ao sincronizar banco de dados:", err);
  });

// ### FIM MODELOS DE BANCO DE DADOS ###

// ### CONFIGURAÇÃO DE EXPRESS ###

// Configurando o motor de template Handlebars
const abs = create({ defaultLayout: "main" });
app.engine("handlebars", abs.engine);
app.set("view engine", "handlebars");

// Middleware para processar os dados do corpo da requisição
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ### ROTAS ###

// Rota inicial
app.get("/", function (req, res) {
  res.send("Bem-vindo ao sistema de inscrição de cursos!");
});

// Rota para listar todos os cursos
app.get("/cursos", async (req, res) => {
  try {
    const cursos = await Course.findAll();
    res.render("cursos", { cursos });
  } catch (err) {
    res.status(500).send("Erro ao listar cursos: " + err.message);
  }
});

// Rota para exibir detalhes de um curso
app.get("/curso/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const curso = await Course.findByPk(id);
    res.render("curso", { curso });
  } catch (err) {
    res.status(500).send("Erro ao buscar o curso: " + err.message);
  }
});

// Rota para inscrever um usuário em um curso
app.post("/inscrever/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const course = await Course.findByPk(courseId);

    if (!user || !course) {
      return res.status(404).send("Usuário ou curso não encontrado");
    }

    // Inscrever o usuário no curso
    await user.addCourse(course);

    res.send(`Inscrição realizada com sucesso no curso: ${course.name}`);
  } catch (err) {
    res.status(500).send("Erro ao realizar inscrição: " + err.message);
  }
});

// Rota para cadastrar um novo usuário
app.get("/cadastro", (req, res) => {
  res.render("cadastro"); // Renderizando o formulário de cadastro
});

// Rota para processar o cadastro de um novo usuário
app.post("/cadastro", async (req, res) => {
  const { name, email, password, age } = req.body;

  try {
    const user = await User.create({ name, email, password, age });
    res.send(`Usuário ${user.name} cadastrado com sucesso!`);
  } catch (err) {
    res.status(500).send("Erro ao cadastrar o usuário: " + err.message);
  }
});

// ### FIM DAS ROTAS ###

// Iniciando o servidor
app.listen(3031, function () {
  console.log("Servidor rodando na porta 3031");
});
