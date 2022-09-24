import {
  useState,
  useRef
} from "react"
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer
} from '@react-google-maps/api';
import mapStyle from "@/utils/mapStyle"
import {
  BiCurrentLocation
} from 'react-icons/bi';
import toast, {
  Toaster
} from 'react-hot-toast';
import PriceList from "./PriceList"
import {
  uid
} from "uid"


const libraries = ["places"]

export default function Tool () {

  function secondsToHms(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 0 ? h + (h == 1 ? " hr ": " hrs "): "";
    const mDisplay = m > 0 ? m + (m == 1 ? " min ": " mins "): "";
    const sDisplay = (!h && !m) && s > 0 || !h || !m ? s + (s == 1 || 0 ? " sec": " secs"): "";
    return hDisplay + mDisplay + sDisplay;
  }

  const {
    isLoaded
  } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY,
      libraries
    })

  const center = {
    lat: -3.745,
    lng: -38.523
  };

  const pickupRef = useRef()
  const dropRef = useRef()
  const [waypointsInput,
    setWaypointsInput] = useState([])

  const [currentLocation,
    setCurrentLocation] = useState(null)
  const [directionRes,
    setDirectionRes] = useState(null)
  const [distance,
    setDistance] = useState(0)
  const [duration,
    setDuration] = useState(0)
  const date = new Date()
  const [time,
    setTime] = useState(date.toLocaleTimeString())
  const [person,
    setPerson] = useState(1)

  const isNightFn = (time) => {

    if (!time) {
      return
    }
    const hour = time.split(":")[0]

    if (hour >= 23 || hour <= 4) {
      return true
    }
    return false
  }
  const isNight = isNightFn(time)

  const handleAddStop = () => {
    console.log(0)
    setWaypointsInput([...waypointsInput,
      {
        id: uid(),
        value: ""
      }])
  }

  const handleUpdateWaypoint = (value, id) => {
    const newState = waypointsInput.map((e) => {
      if (e.id === id) {
        return {
          ...e,
          value
        }
      }
      return e
    })
    setWaypointsInput(newState)
  }

  const handleRemoveWaypoint = (id) => {
    const newState = waypointsInput.filter((e) => {
      return e.id !== id
    })
    setWaypointsInput(newState)
  }

  const getCurrentLocation = async () => {
    await navigator.geolocation.getCurrentPosition(
      position => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        toast.success('Got your current location!')
        pickupRef.current.value = "Your current location"

      },
      err => toast.error('Permission denied to get the location!')
    );

  }

  const getDirection = async () => {

    if (!currentLocation && pickupRef.current.value === "" || dropRef.current.value === "") {
      toast.error("Plese provide all fields")
      return
    }

    for (let i = 0; i < waypointsInput.length; i++) {
      if (!waypointsInput[i].value) {
        toast.error("Plese provide all fields")
        return
      }
    }


    try {
      const waypoints = waypointsInput.map(e => {
        return {
          location: e.value,
          stopover: true
        }
      })
      const directionsService = new google.maps.DirectionsService()
      const result = await directionsService.route({
        origin: currentLocation || pickupRef.current.value,
        waypoints: waypoints || [],
        destination: dropRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      })
      //  console.log(result)
      setDirectionRes(result)
      let distance = 0
      let duration = 0
      result.routes[0].legs.forEach((el) => {
        distance += el.distance.value
        duration += el.duration.value
      })
      setDuration(duration)
      setDistance(distance)
      //console.log(distance, duration)
    } catch (e) {
      toast.error("Error finding routes")
    }
  }

  // console.log(waypointsInput)

  return (
    <div className="w-full px-4 pt-6">
    <Toaster />
    {isLoaded ?
      <div>
      <div className="flex justify-between items-center mb-3">
      <p className="text-lg text-gray-800">
      Choose locations
      </p>
      <button className="px-3 py-1 text-white bg-gray-800 rounded"
        onClick={handleAddStop}
        >
      Add Stop
      </button>
      </div>

      <div className="space-y-3.5 mb-4 relative">
            <div className="w-[.1rem] h-full absolute top-0 left-[1rem] z-10 py-6">
            <div className="border-l-2 border-dashed border-gray-800 w- h-full" />
        </div>
      <Autocomplete>
      <div className="fit relative">
      <div className="absolute top-0 bottom-0 left-0 w-[2.1rem] h-full grid place-items-center z-20 bg-white/60">
      <div className="w-2 h-2 bg-gray-800" />
          </div>
      <input className="input pr-12" placeholder="Chose start location" ref={pickupRef}
            onChange={() => {
              if (currentLocation) {
                setCurrentLocation(null)
                pickupRef.current.value = ""
              }

            }} />
      <button onClick={getCurrentLocation}>
    <BiCurrentLocation className="absolute right-0 top-0 w-12 h-full py-2.5 text-slate-500" />
    </button>
        </div>
      </Autocomplete>
      {waypointsInput.map((obj) => {
          return (
            <div key={obj.id} className="grid grid-cols-[1fr_auto]">
            <Autocomplete>
            <div className="relative">
                  <div className="absolute top-0 bottom-0 left-0 w-[2.1rem] h-full grid place-items-center z-20 bg-white/60">
      <div className="z-20 w-2 h-2 bg-white border-2  border-gray-800" />
            </div>
      <input className="input" placeholder="Add stop location"
              onChange={(e) => handleUpdateWaypoint(e.target.value, obj.id)}
              onBlur={(e) => handleUpdateWaypoint(e.target.value, obj.id)}
              />
            </div>
      </Autocomplete>
      <button className="px-4 text-2xl"
              onClick={() => handleRemoveWaypoint(obj.id)}>
       ×
       </button>
          </div>
        )
      })}


    <Autocomplete>
    <div className="relative">
          <div className="absolute top-0 bottom-o left-0 w-[2.1rem] h-full grid place-items-center z-20 bg-white/60">
      <div className="w-2 h-2 rounded-full bg-gray-800" />
        </div>
      <input className="input" placeholder="Chose destination location" ref={dropRef} />
      </div>
      </Autocomplete>
  </div>
        <button onClick={getDirection} className="w-full mb-5 bg-indigo-500 text-white text-lg rounded px-2.5 py-2"> Get Fare</button>


    <div className="md:grid md:grid-cols-2 md:gap-4 ">

    <div className="bg-white rounded-[.35rem] p-1.5 shadow-sm h-fit">
  <div className="w-full aspect-square rounded-[.35rem]">
  <GoogleMap
      mapContainerStyle={ { width: "100%",
        height: "100%",
        borderRadius: ".25rem",
      }}
      center={!directionRes && center}
      zoom={10}
      options={ {
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: mapStyle,
      }}
      >
   {directionRes &&
      <DirectionsRenderer
        directions={directionRes}
        options={ {
          polylineOptions: {
            strokeColor: "rgba(99,102,241,0.908)",
            fillColor: "rgba(99,102,241,0.908)",
            strokeOpacity: 1,
            strokeWeight: 3,
          }
        }}
        />}

      </GoogleMap>
    </div>
    {directionRes &&
      <div className="flex justify-around text-center text-gray-800 p-4 pt-6">
    <div className="">
  <p className='text-2xl font-ubuntu'>
        {(distance / 1000).toFixed(1)}km
      </p>
      <p className=''>
      distance
      </p>
      </div>
    <div className="">
    <p className='text-2xl font-ubuntu'>
        {secondsToHms(duration)}
        </p>
        <p className=''>
      duration
        </p>
      </div>
      </div>
      }
    </div>
      <div>
  <div>
  <div className="py-4 flex gap-2">
  <div className="grid px-2">
  <label htmlFor="time" className="mb-2">Journey time</label>
  <input type="time" id="time" className="bg-gray-200 focus:outline-none w-full text-xl p-1"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        />
      </div>
    <div className="grid px-2">
    <p className="mb-2">
      Total person
        </p>

    <div className="shadow text-xl text-gray-800 grid grid-cols-[auto_1fr_auto]">
    <button
            className="w-10 h-10"
            onClick={() => {
              if (person === 1) {
                return
              }
              setPerson(person - 1)
            }}>
        -
      </button>
      <p className="pt-2 min-w-[2.5rem] bg-gray-200 text-center">
    {person}
          </p>
      <button className="w-10 h-10"
            onClick={() => setPerson(person + 1)}
            >
    +
    </button>
        </div>
      </div>
      </div>
      {isNight &&
      <div className="p-4 bg-white text-red-400 rounded">
      Your journey time is between 11PM to 5AM. So your bill will be 25% extra.
      </div>
      }
    </div>
    {directionRes &&
    <PriceList distance={distance} isNight={isNight} person={person} />
    }
  </div>
</div>
</div>: <center>loading...</center> } < /div >
)
}