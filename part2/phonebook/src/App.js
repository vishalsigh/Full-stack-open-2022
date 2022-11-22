import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    // console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        // console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) =>{
    event.preventDefault()

    const nameObject = {
      name: newName,
      number: newNumber,
    }
    const foundPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    // console.log('button clicked', event.target);
    if (foundPerson){
      // alert(`${newName} is already added to phonebook`)
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personService
        .update(foundPerson.id, nameObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== foundPerson.id ? person : returnedPerson))
        }).catch(error => {
          setStatus('error')
          setMessage(`Information of ${foundPerson.name} has already been removed from server`)
          setTimeout(()=>{
            setStatus(null)
            setMessage(null)
          },5000)

          setPersons(persons.filter(person => person.id !== foundPerson.id))
        })
      }
    } else {
    personService
    .create(nameObject)
    .then(returnedPerson => {
    setPersons(persons.concat(returnedPerson))
    
    setStatus('success')
    setMessage(`Added ${returnedPerson.name}`)
    setTimeout(()=>{
      setStatus(null)
      setMessage(null)
    },5000)

    setNewName('')
    setNewNumber('')
  })
  }
}

  const handleQuery = (event) =>{
    setQuery(event.target.value)
  }
  const handleName = (event) => {
    // console.log(event.target.value);
    setNewName(event.target.value)
  }
  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const person = persons.filter((person) => {
    return person.name.toLowerCase().includes(query.toLowerCase())
  })

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .deletePerson(id)
      .then(removePerson => {
        persons.map(person => person.id !== id ? person : removePerson)
      })
      setPersons(persons.filter(person => person.id !== id))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} status={status}/>
      <Filter query={query} handleQuery={handleQuery} />

      <h2>Add a new</h2>
      <PersonForm addName={addName} newName={newName} handleName={handleName} newNumber={newNumber} handleNumber={handleNumber}  />
      <h3>Numbers</h3>
      <Persons people={person} handleDelete={handleDelete}/>      
    </div>
  )
}

export default App