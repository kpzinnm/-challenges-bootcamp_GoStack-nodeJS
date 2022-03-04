const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const server = express();
server.use(express.json());
var contRequisicao = 0

const projects = []


function validacaoArray(index,reference) {
    var a = 0;
    var saida = 0;
    const tamanhoArray = Object.keys(projects).length
    var objetoV

    for(a = 0; a <= tamanhoArray; a++){
        
        if(typeof projects[a] === "undefined"){
            objetoV = "ID Invalido"
            break
        }
        if(projects[a].id == index){
            objetoV = projects[a]
            break
        } 
    }
    
    if ((reference == "put" || reference == "delete") && (objetoV != "ID Invalido")) {
        objetoV = a
    }

    return objetoV
}

function bodyVoid(req, res, next){
    if (req.body.id.length == 0){
        return res.json("Não é possivel cadastrar um ID vazio")
    }
    
    return next();
}

function contRequi(req, res, next){
    contRequisicao++
    console.log("Requisição de numero ", contRequisicao)

    return next();
}

server.get('/projects',contRequi, (req, res) => {
    return res.json(projects);

})

server.get('/projects/:index',contRequi, (req, res) => {
    return res.json(validacaoArray(req.params.index,"get"))

})

server.post('/projects',contRequi,bodyVoid, (req, res) => {
    const objeto = req.body;

    if(validacaoArray(objeto.id, "post") == "ID Invalido"){
        projects.push(objeto)

        return res.json(projects);
    } else {
        return res.json("ID já registrado")
    }

})

server.post('/projects/:index/task',contRequi, (req, res) => {
    const title = req.body.title

    if((validacaoArray(req.params.index, "put")) == "ID Invalido") {
        return res.json("ID Invalido")

    } else {
        projects[validacaoArray(req.params.index, "put")].task.push(title)

        return res.json(projects)
    }

})

server.put('/projects/:index',contRequi,bodyVoid, (req, res) => {
    const objeto = req.body;
    const numArray = validacaoArray(req.params.index, "put")

    if((validacaoArray(req.params.index, "put")) == "ID Invalido") {
        return res.json("ID Inexistente")

    } else {
        if(validacaoArray(objeto.id, "post") == "ID Invalido"){
            projects[validacaoArray(req.params.index, "put")] = objeto

            return res.json(projects)
        } else {
            return res.json("ID já registrado")
        }
    }
})

server.delete('/projects/:index',contRequi, (req, res) => {
    const index = req.params.index;

    if((validacaoArray(index, "delete")) == "ID Invalido") {
        return res.json("ID Invalido")

    } else {
        projects.splice(validacaoArray(index, "delete"),1)

        return res.json(projects)
    }
})


server.listen(3000);