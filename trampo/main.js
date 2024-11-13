const express = require("express");
const rotas = express();
const Sequelize = require("sequelize");
const cors = require("cors"); // Importa o CORS

// Habilita o CORS
rotas.use(cors());

// Configuração do banco de dados
const conexaoBanco = new Sequelize("teste", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Desativa o log das queries no console
});

// Definindo a tabela Aluno
const Aluno = conexaoBanco.define("alunos", {
  nome: {
    type: Sequelize.STRING,
    allowNull: false, // Nome não pode ser nulo
  },
  idade: {
    type: Sequelize.INTEGER,
    allowNull: false, // Idade não pode ser nula
  },
});

// Sincronizando as tabelas no banco de dados
Aluno.sync({ force: false }).then(() => {
  console.log("Tabela 'alunos' criada ou já existe.");
});

//### ROTAS ###

// Rota principal
rotas.get("/", (req, res) => {
  res.send("Rota principal");
});

// Salvar um novo aluno
rotas.get("/salvar/:nome/:idade", async (req, res) => {
  const { nome, idade } = req.params;

  // Validando se os parâmetros estão corretos
  if (!nome || !idade || isNaN(idade)) {
    return res.status(400).json({ mensagem: "Parâmetros inválidos" });
  }

  try {
    const novoAluno = await Aluno.create({ nome, idade: parseInt(idade, 10) });
    res.json({
      mensagem: "Aluno criado com sucesso",
      aluno: novoAluno,
    });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao criar aluno", erro: err.message });
  }
});

// Exibir todos os alunos
rotas.get("/mostrar", async (req, res) => {
  try {
    const alunos = await Aluno.findAll(); // Busca todos os alunos
    res.json(alunos); // Retorna a lista de alunos em formato JSON
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao buscar alunos", erro: err.message });
  }
});

// Editar um aluno via ID
rotas.get("/editar/:id/:nome/:idade", async (req, res) => {
  const { id, nome, idade } = req.params;

  if (isNaN(id) || !nome || isNaN(idade)) {
    return res.status(400).json({ mensagem: "Parâmetros inválidos" });
  }

  const idNumber = parseInt(id, 10);
  const idadeNumber = parseInt(idade, 10);

  try {
    const [updated] = await Aluno.update(
      { nome, idade: idadeNumber },
      { where: { id: idNumber } }
    );

    if (updated) {
      res.json({ mensagem: "Aluno atualizado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Aluno não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao atualizar aluno", erro: err.message });
  }
});

// Deletar um aluno via ID
rotas.get("/deletar/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ mensagem: "ID inválido" });
  }

  const idNumber = parseInt(id, 10);

  try {
    const deleted = await Aluno.destroy({
      where: { id: idNumber },
    });

    if (deleted) {
      res.json({ mensagem: "Aluno deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Aluno não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao deletar aluno", erro: err.message });
  }
});

// Iniciando o servidor
rotas.listen(3031, () => {
  console.log("Servidor rodando na porta 3031");
});
