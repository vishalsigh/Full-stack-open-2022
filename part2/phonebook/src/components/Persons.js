import React from 'react'
// import Person from './Person'

const Persons = ({people, handleDelete}) => {
  return (
    <div>
        {people.map((person)=> {
        return( 
        // <Person key={person.id} person={person} handleDelete={handleDelete} />
        <div key={person.id}>
        {person.name} {person.number} 
        <button onClick={() => handleDelete(person.id)}>Delete</button>
    </div>

      )})}

    </div>
  )
}

export default Persons