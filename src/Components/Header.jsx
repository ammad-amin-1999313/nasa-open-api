import React, {useState, useEffect} from 'react'
import logo from '../images/nasalogo.png'
import axios from 'axios'
import {AiOutlineHeart} from 'react-icons/ai'
import {AiTwotoneHeart} from 'react-icons/ai'
import {getTime} from '../Utils/resource'
import {useLocation, useNavigate} from 'react-router-dom'
import {signOut} from 'firebase/auth'
import {auth} from '../firebase/Firebase'

function Header() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [neoData, setNeoData] = useState([])
  const [selectedDiameter, setSelectedDiameter] = useState('kilo Meters')
  const [selectedVelocity, setSelectedVelocity] = useState('km/s')
  const [favorite, setFavorite] = useState([])
  const [favoriteData, setFavoriteData] = useState([])
  const [singleId, setSingleId] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [dateSelected, setDateSelected] = useState(false)
  const [favoriteSelected, setFavoriteSelected] = useState(false)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const [inputId, setInputId] = useState('')

  const userEmail = location.state && location.state.userEmail

  const apiKey = 'THSkesmFqoZa0PidXCP8JzujNMhgh38ZpP5hhgWy'

  const filterFavoritesByUserEmail = (favorite, userEmail) => {
    return favorite.filter(favorite => favorite.userEmail === userEmail)
  }

  useEffect(() => {
    console.log('selected ID :', selectedId)
    if (selectedId !== '') {
      setLoading(true)
      axios
        .get(
          `https://api.nasa.gov/neo/rest/v1/neo/${selectedId}?api_key=${apiKey}`,
        )
        .then(response => {
          setSingleId(response.data)
          console.log('API response by id', response)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching single Id', error)
          setLoading(false)
        })
    }
  }, [selectedId, apiKey])

  useEffect(() => {
    const fetchNeoData = () => {
      if (startDate && endDate) {
        setLoading(true)
        axios
          .get(
            `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`,
          )
          .then(response => {
            // console.log('API response:::::', response)
            setNeoData(response.data.near_earth_objects)
            setDateSelected(true)
            setLoading(false)
          })
          .catch(error => {
            console.error('Error fetching NEO data: ', error)
            setLoading(false)
          })
      }
    }

    fetchNeoData()
  }, [startDate, endDate, apiKey])

  const fetchDataFromJSONServer = async () => {
    try {
      const response = await axios.get('http://localhost:3000/favorites')
      console.log('data recieved ', response.data)
      // if (response.status === 200||) {
      const data = response.data
      setFavoriteData(data)
      // } else {
      console.error('Error fetching data from local server')
      // }
    } catch (error) {
      console.error('Error fetching Data from local server', error)
    }
  }
  useEffect(() => {
    fetchDataFromJSONServer()
  }, [])

  const AddToFavorite = (neo, userEmail) => {
    try {
      const Data = axios.post('http://localhost:3000/favorites', {
        neo,
        userEmail,
      })
      console.log('Data of ', Data)
      setFavorite([...favorite, neo])
      setFavoriteSelected(true)
      console.log(favorite)
    } catch (error) {
      console.error('error fetching data to favorites', error)
    }
  }

  // const RemoveFromFavorite = id => {
  //   const updatedFavorites = favorite.filter(favorite => favorite.id !== id)
  //   setFavorite(updatedFavorites)
  // }

  const RemoveFromFavorite = id => {
    console.log('Removing ID:', id, favorite)
    const updatedFavorites = favoriteData
      .filter(item => item.id !== id)
      .map(data => data)
    console.log('updatedFavorites', updatedFavorites)
    setFavoriteData(updatedFavorites)
    deleteData(id)
  }

  const deleteData = async id => {
    try {
      // Make a DELETE request to the JSON server's endpoint with the ID of the data you want to delete
      const response = await axios.delete(
        `http://localhost:3000/favorites/${id}`,
      )
      console.log('response delete', response)
      // Handle the response or update your component's state if necessary
      console.log('Data deleted successfully')
    } catch (error) {
      console.error('Error deleting data: ', error)
    }
  }

  console.log('favorite', favorite)
  console.log('favoriteData', favoriteData)
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/')
        console.log('Log Out Successfully ')
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
  }
  useEffect(() => {
    if (inputId.length > 6) {
      setSelectedId(inputId)
      setDateSelected(false)
    }
  }, [inputId])

  return (
    <>
      <div>
        <div className="main bg-white-800 w-full shadow">
          <div className="w-12/12 mx-auto">
            <div className="main-inside lg:w-12/12 justify-between mx-auto flex p-5 ">
              <div className="logo w-8/12">
                <h1 className="text-xl font-bold">
                  <img src={logo} width={35} alt="" />
                </h1>
              </div>
              <div className="account">
                <div className="account-detail flex justify-between  mx-auto ">
                  <a href="/home" className="">
                    <h2 className="user px-3 font-semibold">
                      {userEmail ? `Hello ${userEmail}` : 'Hello User'}
                    </h2>
                  </a>
                  <span className="border-set my-auto px-3"></span>
                  <a href="/">
                    {' '}
                    <h2 className="logout font-semibold" onClick={handleLogout}>
                      Logout
                    </h2>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ----------------------- */}
        <div className="w-full py-5">
          <div className="w-12/12 flex justify-between px-12 py-5">
            <div>
              <h2 className="text-2xl text-[#718096]">
                Search Nearest Asteroids
              </h2>
            </div>
            <div className="flex">
              <div className="">
                <h2 className="text-[#718096]">Enter Asteroid ID</h2>
                <input
                  type="number"
                  name="ID"
                  placeholder="1234"
                  className="border p-2 "
                  value={inputId}
                  onChange={e => setInputId(e.target.value)}
                />
              </div>
              <div className="px-5">
                <h2 className="text-[#718096]">Start Date</h2>
                <input
                  type="date"
                  className="border p-2"
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <h2 className="text-[#718096]">End Date</h2>
                <input
                  type="date"
                  className="border p-2 "
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* ------------------ */}
        {loading && (
          <div className="loader text-3xl text-center shadow transition-all"></div>
        )}
        {dateSelected && (
          <div className="p-8">
            <table className="mx-auto text-sm border border-slate-300 border-separate">
              <thead className="">
                <tr>
                  <th className="w-1/12 p-2 text-start text-[#718096] font-semibold ">
                    ID
                  </th>
                  <th className="w-1/12 p-2 text-start text-[#718096] font-semibold">
                    Name
                  </th>
                  <th className="w-1/12 p-2 text-start text-[#718096] font-semibold">
                    Date
                  </th>
                  <th className="w-1/12 p-2 text-[#718096] font-semibold text-start">
                    Time
                  </th>
                  <th className="w-1/12 p-2 text-start text-[#718096] font-semibold">
                    Ab Magnitude
                  </th>
                  <th className=" w-2/12 p-2 text-start text-[#718096] font-semibold">
                    Min-Max Est Diameter
                    <select
                      name="Diameter"
                      id="Diameter"
                      value={selectedDiameter}
                      className="border-2 border-black text-black"
                      onChange={e => setSelectedDiameter(e.target.value)}
                    >
                      <option value="kilo Meters">Kilo Meters</option>
                      <option value="Meters">Meters</option>
                      <option value="Miles">Miles</option>
                      <option value="Feet">Feet</option>
                    </select>
                  </th>
                  <th className=" w-2/12  text-start p-2 text-[#718096] font-semibold">
                    Velocity{' '}
                    <select
                      name="Velocity"
                      id="Velocity"
                      value={selectedVelocity}
                      className="border-2 text-black border-black"
                      onChange={e => setSelectedVelocity(e.target.value)}
                    >
                      <option value="Km/Sec">Km/Sec</option>
                      <option value="Km/hour">Km/hour</option>
                      <option value="Miles/hour">Miles/hour</option>
                    </select>
                  </th>
                  <th className="w-1/12 text-start p-2 text-[#718096] font-semibold">
                    Hazard
                  </th>
                  <th className="w-1/12 text-start p-2  text-[#718096] font-semibold">
                    Add to Favorites
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(neoData).map(date =>
                  neoData[date].map(neo => {
                    const isFavorite = favorite.find(x => x.id === neo.id)
                    const HandleRowClick = neo => {
                      console.log(neo)
                      setSelectedId(neo)
                      setDateSelected(false)
                    }
                    return (
                      <tr
                        key={neo.id}
                        className={`border-4 mt-5 bg-[#FAF7FC] ${
                          selectedId === neo.id ? 'selected-id' : ''
                        }`}
                        onClick={() => HandleRowClick(neo.id)}
                      >
                        <td className="w-1/12 p-2 cursor-pointer">{neo.id}</td>
                        <td className="p-2">{neo.name}</td>
                        <td className="p-2">{date}</td>
                        <td className="p-2">
                          {neo?.close_approach_data &&
                            getTime(
                              neo?.close_approach_data[0]
                                ?.epoch_date_close_approach,
                            )}
                          {/* {neo.close_approach_data[0].close_approach_time} */}
                        </td>
                        <td className="p-2">{neo.absolute_magnitude_h}</td>
                        <td className="p-2">
                          {selectedDiameter === 'kilo Meters'
                            ? `${neo.estimated_diameter.kilometers.estimated_diameter_min} - ${neo.estimated_diameter.kilometers.estimated_diameter_max} `
                            : selectedDiameter === 'Meters'
                            ? `${neo.estimated_diameter.meters.estimated_diameter_min} - ${neo.estimated_diameter.meters.estimated_diameter_max} `
                            : selectedDiameter === 'Miles'
                            ? `${neo.estimated_diameter.miles.estimated_diameter_min} - ${neo.estimated_diameter.miles.estimated_diameter_max} `
                            : `${neo.estimated_diameter.feet.estimated_diameter_min} - ${neo.estimated_diameter.feet.estimated_diameter_max} `}
                        </td>
                        <td className="p-2">
                          {selectedVelocity === 'Km/Sec'
                            ? `${neo.close_approach_data[0].relative_velocity.kilometers_per_second}`
                            : selectedVelocity === 'Km/hour'
                            ? `${neo.close_approach_data[0].relative_velocity.kilometers_per_hour}`
                            : `${neo.close_approach_data[0].relative_velocity.miles_per_hour}`}
                          {/* {
                        neo.close_approach_data[0].relative_velocity
                          .kilometers_per_second
                      } */}
                        </td>
                        <td className="p-2">
                          {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                        </td>
                        <td className="p-2 text-center text-2xl">
                          <button
                            onClick={event => {
                              event.stopPropagation()
                              AddToFavorite(neo, userEmail)
                            }}
                          >
                            {isFavorite ? (
                              <AiTwotoneHeart />
                            ) : (
                              <AiOutlineHeart />
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  }),
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ----------------- single ID ------------------------*/}
        {selectedId && (
          <div className="p-8">
            <table className="mx-auto text-sm border border-slate-300 border-separate">
              <thead className="">
                <tr>
                  <th className="w-1/12 px-3 text-start text-[#718096] font-semibold ">
                    ID
                  </th>
                  <th className="w-1/12 px-1 text-start text-[#718096] font-semibold">
                    Name
                  </th>
                  <th className="w-1/12 px-1 text-start text-[#718096] font-semibold">
                    Date
                  </th>
                  <th className="w-1/12 px-1 text-[#718096] font-semibold text-start">
                    Time
                  </th>
                  <th className="w-1/12 px-1 text-start text-[#718096] font-semibold">
                    Ab Magnitude
                  </th>
                  <th className=" w-2/12 px-2 text-start text-[#718096] font-semibold">
                    Min-Max Est Diameter
                    <select
                      name="Diameter"
                      id="Diameter"
                      value={selectedDiameter}
                      className="border-2"
                      onChange={e => setSelectedDiameter(e.target.value)}
                    >
                      <option value="kilo Meters">Kilo Meters</option>
                      <option value="Meters">Meters</option>
                      <option value="Miles">Miles</option>
                      <option value="Feet">Feet</option>
                    </select>
                  </th>
                  <th className=" w-2/12  text-start text-[#718096] font-semibold">
                    Velocity{' '}
                    <select
                      name="Velocity"
                      id="Velocity"
                      value={selectedVelocity}
                      className="border-2"
                      onChange={e => setSelectedVelocity(e.target.value)}
                    >
                      <option value="Km/Sec">Km/Sec</option>
                      <option value="Km/hour">Km/hour</option>
                      <option value="Miles/hour">Miles/hour</option>
                    </select>
                  </th>
                  <th className="w-1/12 text-start text-[#718096] font-semibold">
                    Hazard
                  </th>
                  <th className="w-1/12 text-start text-[#718096] font-semibold ">
                    Add to Favorites
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(singleId).length !== 0 &&
                  singleId.close_approach_data?.map(data => (
                    <tr className="border-4 mt-5 bg-[#FAF7FC]">
                      <td className="w-1/12 p-2 cursor-pointer">
                        {singleId.id}
                      </td>
                      <td className="p-2">{singleId.name}</td>
                      <td className="p-2">{data?.close_approach_date}</td>
                      <td className="p-2">
                        {data?.epoch_date_close_approach &&
                          getTime(data?.epoch_date_close_approach)}
                      </td>

                      <td className="p-2">{singleId.absolute_magnitude_h}</td>
                      <td className="p-2">
                        {selectedDiameter === 'kilo Meters'
                          ? `${singleId.estimated_diameter.kilometers.estimated_diameter_min} - ${singleId.estimated_diameter.kilometers.estimated_diameter_max}`
                          : selectedDiameter === 'Meters'
                          ? `${singleId.estimated_diameter.meters.estimated_diameter_min} - ${singleId.estimated_diameter.meters.estimated_diameter_max}`
                          : selectedDiameter === 'Miles'
                          ? `${singleId.estimated_diameter.miles.estimated_diameter_min} - ${singleId.estimated_diameter.miles.estimated_diameter_max}`
                          : `${singleId.estimated_diameter.feet.estimated_diameter_min} - ${singleId.estimated_diameter.feet.estimated_diameter_max}`}
                      </td>
                      <td className="p-2">
                        {selectedVelocity === 'Km/Sec'
                          ? data?.relative_velocity?.kilometers_per_second
                          : selectedVelocity === 'Km/hour'
                          ? data?.relative_velocity?.kilometers_per_hour
                          : data?.relative_velocity?.miles_per_hour}
                      </td>
                      <td className="p-2">
                        {singleId.is_potentially_hazardous_asteroid
                          ? 'Yes'
                          : 'No'}
                      </td>
                      <td className="p-2 text-center text-2xl ">
                        <button onClick={() => AddToFavorite(singleId)}>
                          {favorite.find(x => x.id === singleId.id) ? (
                            <AiTwotoneHeart />
                          ) : (
                            <AiOutlineHeart />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        {/* -------------------- */}
        {favoriteSelected && (
          <div className="mb-20">
            <h1 className="text-2xl text-center p-5 text-[#718096]">
              Favorite Data
            </h1>
            <table className="w-4/12 mx-auto">
              <thead>
                <tr className="flex justify-between bg-slate-100">
                  <th className="w-2/12 text-[#718096] font-semibold text-sm text-start p-2">
                    ID
                  </th>
                  <th className="w-2/12 text-[#718096] font-semibold text-sm text-start p-2">
                    Name
                  </th>
                  <th className="w-4/12 text-[#718096] font-semibold text-sm p-2">
                    Remove From Favorite
                  </th>
                </tr>
              </thead>
              <tbody>
                {filterFavoritesByUserEmail(favoriteData, userEmail).map(
                  neo => (
                    <tr
                      key={neo.item}
                      className="flex justify-between border-2 bg-slate-300"
                    >
                      <td className="w-2/12 p-1">{neo.id}</td>
                      <td className="w-4/12 p-1">{neo.neo.name}</td>
                      <td className="w-2/12 text-2xl p-1">
                        <button onClick={() => RemoveFromFavorite(neo.id)}>
                          <AiTwotoneHeart />
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* ------------------- */}
        <div className="hidden">
          <h1 className="text-center p-5 text-[#718096] text-2xl  mt-5">
            Data Coming From JSON Server Stored in Local Storage
          </h1>
          <table className="w-2/12 mx-auto">
            <thead>
              <tr>
                <th className="text-[#718096] w-1/12 text-start border-2">
                  ID
                </th>
                <th className="text-[#718096] text-center w-1/12 text-start border-2">
                  Neo ID
                </th>
                <th className="text-[#718096] text-center w-1/12 text-start border-2">
                  Name
                </th>
                <th className="text-[#718096] text-center w-1/12 text-start border-2">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {favoriteData.map(item => (
                <tr key={item.ids}>
                  <td className="border-2 p-3 ">{item.id}</td>
                  <td className="border-2 p-3">{item.neo.neo_reference_id}</td>
                  <td className="border-2 p-3">{item.neo.name}</td>
                  <td className="border-2 p-3">{item.userEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* --------------------- */}
      </div>
    </>
  )
}

export default Header
