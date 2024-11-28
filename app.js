const express = require('express');
const { create } = require('express-handlebars');
const Sequelize = require('sequelize');
const cors = require('cors');

// Inicializa o aplicativo Express
const app = express();

// Habilita o CORS
app.use(cors());

// Configuração do banco de dados
const conexaoBanco = new Sequelize('curso', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Desativa o log das queries no console
});

// Definindo o modelo de Aluno
const Aluno = conexaoBanco.define('alunos', {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  idade: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});

// Definindo o modelo de Curso/Workshop
const Curso = conexaoBanco.define('cursos', {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  dataInicio: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  dataFim: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

// Relacionamento entre Aluno e Curso (Many-to-Many)
Aluno.belongsToMany(Curso, { through: 'inscricoes' });
Curso.belongsToMany(Aluno, { through: 'inscricoes' });

// Sincronizando os modelos no banco de dados
conexaoBanco.sync({ force: false }).then(() => {
  console.log('Tabelas criadas ou já existem.');
});

// Configuração do Handlebars com Express
const hbs = create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware para processar os dados do corpo da requisição
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.render('home');  // Renderiza a página home.handlebars
});

// Exibir todos os alunos
app.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    res.render('alunos', { alunos });
  } catch (err) {
    res.status(500).send('Erro ao buscar alunos: ' + err.message);
  }
});

// Exibir todos os cursos
app.get('/cursos', async (req, res) => {
  try {
    const cursos = await Curso.findAll();
    res.render('cursos', { cursos });
  } catch (err) {
    res.status(500).send('Erro ao buscar cursos: ' + err.message);
  }
});

// Salvar um novo aluno
app.get('/salvarAluno/:nome/:idade/:email', async (req, res) => {
  const { nome, idade, email } = req.params;

  try {
    const aluno = await Aluno.create({ nome, idade: parseInt(idade, 10), email });
    res.json({ mensagem: "Aluno criado com sucesso", aluno });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao criar aluno", erro: err.message });
  }
});

// Salvar um novo curso
app.get('/salvarCurso/:nome/:descricao/:dataInicio/:dataFim', async (req, res) => {
  const { nome, descricao, dataInicio, dataFim } = req.params;

  try {
    const curso = await Curso.create({
      nome,
      descricao,
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
    });
    res.json({ mensagem: "Curso criado com sucesso", curso });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao criar curso", erro: err.message });
  }
});

// Iniciando o servidor
app.listen(3031, () => {
  console.log('Servidor rodando na porta 3031');
});
