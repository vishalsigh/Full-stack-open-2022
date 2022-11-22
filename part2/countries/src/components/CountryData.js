import {useState} from 'react'
import axios from 'axios'

const CountryData = ({country}) => {
    const [temp, setTemp] = useState(0)
    const [wind, setWind] = useState(0)
    const [image, setImage] = useState('')

    axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${process.env.REACT_APP_API_KEY}`)
    .then(response => {
        // console.log(response.data)
        setTemp(response.data.main.temp)
        setWind(response.data.wind.speed)
        setImage(response.data.weather[0].icon)
    })
    const temperature = Math.round(temp - 273.15)
    // console.log(temperature)
  return (
    <div>
        
        <h1>{country.name}</h1>
        <div>capital {country.capital[0]} </div>
        <div> area {country.area}</div>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>) 
          )}
        </ul>
        <div><img src={country.flags.png} alt={`$(country.name) flag`}/></div>
        <h3>Weather in {country.capital[0]}</h3>
        <div>temperature {temperature} Celcius </div>
        <img src={`http://openweathermap.org/img/wn/${image}@2x.png`} alt=''/>
        <div>wind {wind} m/s</div>
    </div>
  )
}

export default CountryData