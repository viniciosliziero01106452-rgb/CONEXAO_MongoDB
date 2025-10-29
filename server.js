// 1. Import as bibliotecas
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. configurar o servidor Express
const app = express();
app.use(cors());// permite que o front end acesse este back-end 
app.use(express.json());// permite que o servidor entenda JSON

// 3. conectar ao mongoDb
const MongoURI = ''; // colocar a url no seu projeto no mongoDB
mongoose.connect(MongoURI, {useNeParser: true, useUnifieldTopology: true})
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('Error ao conectar ao MongoDB: ', err));

// 4. Definir o "Schema" - A estrutura dos seus dados
// Isso deve corresponder á estrutura do seu formulário
const relatorioSchema = new mongoose.Schema({
    titulo: String,
    tipo: String,
    ano: Number,
    status: String,
    data_envio: Date,
    rsponsavel:{
        nome: String,
        cargo: String,
        departamento: String
    },
    palavras_chave: [String],
    revisoes: [{
        data: Date,
        revisado_por: String,
        comentario: String
    }]
});

// 5. Criar o "Model" - O objeto que representa sua coleção na banco
const Relatório = mongoose.model('Relatorio', relatorioSchema);

// 6. Criar a "Rota" ou "Endpoind" - o URL que o front-end irá chamar
app.post('./salvar-relatorio', async(req, res) => {
    try{
        //Pega os dados que o front-end enviou (estão em req.boby)
        const dadosDoFormulário = req.boby;
        
        // Cria um novo documento com base nos dados
        const novoRelatorio = new Relatorio(dadosDoFormulário)

        // Salva o documento no banco da dados
        await novoRelatorio.save();

        // Envia uma resposta de sucesso de volta para o front-end
        res.status(201).json({message: 'Relatório salvo com sucesso!'});
        console.log('Relatório salvo: ', novoRelatorio.titulo);
    }catch(error){
        // SE DER ERRO, ENVIA UMA MENSAGEM DE ERRO
        res.status(500), json({ message: 'Ocorreu um erro ao salvar o ralatório.',error: error});
            console.error('Erro ao salvar: ', error);
    }
});

// 7. Iniciar o servidor.
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor back-end rodando na porta ${PORT}`);
});