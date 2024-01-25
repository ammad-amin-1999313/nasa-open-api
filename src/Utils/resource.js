export const getTime = timestampprop => {
  // Your Unix timestamp in seconds (replace with your actual timestamp)
  const unixTimestamp = timestampprop

  // Create a new Date object and set it with the Unix timestamp
  const date = new Date(unixTimestamp * 1000) // Multiply by 1000 to convert from seconds to milliseconds

  // Get the local time in 12-hour format
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')

  let amOrPm = 'AM'
  let formattedHours = hours

  if (hours >= 12) {
    amOrPm = 'PM'
    formattedHours = hours === 12 ? 12 : hours - 12
  }

  // Convert midnight (0) and noon (12) to 12-hour format
  if (formattedHours === 0) {
    formattedHours = 12
  }

  const localTime = `${formattedHours}:${minutes} ${amOrPm}`

  return localTime
}
