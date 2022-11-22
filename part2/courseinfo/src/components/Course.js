import React from 'react'

const Header = ({course}) => {
return <h2>{course.name}</h2>
}

const Part = ({part}) =>{ 
  return <p>{part.name} {part.exercises}</p>
}

const Content = ({course}) =>{ 
    return(
  <>
    {course.parts.map((part) =>{
        return <Part key={part.id} part={part} />
    })}
  </>
  )}

const Total = ({parts}) => {
    const all = parts.reduce((total, value) => total + value.exercises, 0)
    return <h3>total of {all} exercises</h3>
}
  

const Course = ({course}) => {
    // console.log({course})

  return (
    <div>
        <h1>Web Development curriculum</h1>
        
        {course.map((course, i, id) => {
            return (
            <>
            <Header key={course.id} course={course}/>
            <Content key={id} course={course} />
            <Total key={i} parts={course.parts} />
            </>
            )
        }
        )}
    </div>
  )
}

export default Course