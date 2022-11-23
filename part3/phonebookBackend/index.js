const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

morgan.token('content', (request) =>
  request.method === 'POST' && request.body.name
    ? JSON.stringify(request.body)
    : null
)

app.get('/api/persons', function (req, res) {
  Person.find({})
  .then(persons =>{
    res.json(persons)
  })
})

app.get('/api/info', (req, res) => {
  Person.find({})
  .then(persons=>{
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>
  `)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person =>{
      if(person) {
        res.json(person)
      }else {
        res.status(404).end()
      }

    }).catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  }).catch(error => next(error))
})

// const generateId = () => {
//     const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => n.id))
//     : 0
//     return maxId + 1
// }

app.post('/api/persons', (req, res, next) => {
    const {name, number} = req.body

    if(!name || !number) {
        return res.status(400).json({error:'The name or number is missing'})
    }
    // const foundPerson = persons.find(person => person.name.toLowerCase() === name.toLowerCase())
    // if(foundPerson) {
    //     return res.status(400).json({error: 'name must be unique'})
    // }

    const person = new Person({
        name: name,
        number: number,
    })

    person.save()
    .then(savePerson => {
      res.json(savePerson.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const {name, number} = req.body

  const person = {
    name: name,
    number: number,
  }
  Person.findByIdAndUpdate(req.params.id, person, {new:true})
  .then(updatePerson=>{
    res.json(updatePerson.toJSON())
  }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })

  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})