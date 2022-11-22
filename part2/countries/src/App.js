import axios from 'axios';
import {useEffect, useState} from 'react'
import CountryData from './components/CountryData';

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [show, setShow] = useState({})

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
    .then((response) => {
      // console.log(response.data)
      setCountries(response.data.map(country => 
        ({name: country.name.common, 
          capital: country.capital, 
          area: country.area, 
          languages: country.languages, 
          flags: country.flags})))
    });
  }, [])
  // console.log(countries);

  const handleQuery = (e) => {
    e.preventDefault();
    setQuery(e.target.value)
    setShow({})
  }

  const filtered = countries.filter((country) => {
    return country.name.toLowerCase().includes(query.toLowerCase())
  })

  const handleShow = name =>  () => 
  setShow(filtered.filter(country =>
    country.name.includes(name))[0]
  )

  return (
    <div>
      <p>find countries<input value={query} onChange={handleQuery}/></p>
      {filtered.length > 10 && <div>Too many matches, specify another filter </div>}
      {filtered.length <= 10 && 
      filtered.length > 1 && 
      filtered.map(country => 
      <div key={country.name}>
        {country.name}
        <button onClick={handleShow(country.name)}>show</button> 
      </div>)}
      {filtered.length === 1 && <CountryData country={filtered[0]} />}
      {show.name && <CountryData country={show} />}

    </div>
  )
}

export default App