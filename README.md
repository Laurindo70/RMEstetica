# Back-End RMEstética

Essa aplicação é uma aplicação de Back-end de um Tcc do Aluno Ronan Laurindo Flor do Curso de Engenharia de Software da Unigran.

## Instalação do sistema

- Primeiramente é necessario realizar a clonagem do projeto com `git clone` ou realizar o download em zip
- Após isso é necessario realizar a execução do comando `npm install` para realizar o downloads das dependências.
- Para a execução do sistema é necessario a criação de um arquivo `.env` onde é realizado o carregamento das variáveis de ambiente, no projeto há o arquivo `.env.example` que possui as variáveis necessárias. 

## Execução do sistema

Para execução do sistema em modo desenvolvedor é necessario apenas executar o comando abaixo.(É necessario possuir a instalação do cli do adonis - Caso não tenha faça o download [aqui](https://legacy.adonisjs.com/docs/4.1/installation)).

```bash
adonis serve --dev
```

ou para realizar a execução com o npm execute.
```bash
npm start
```

## Testes

Para a execução dos teste apenas execute o seguinte comando no terminal

```bash
adonis teste
```

Assim será executado todos os teste.(Também sendo necessario o cli do adonis, caso não tenha instalado faça o download [aqui](https://legacy.adonisjs.com/docs/4.1/installation))