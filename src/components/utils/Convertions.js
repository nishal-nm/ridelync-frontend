function to12Hour(time) {
  let [hours, minutes] = time.split(':').map(Number);
  let period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 24-hour format to 12-hour, ensuring 0 becomes 12
  return `${String(hours)}:${String(minutes).padStart(2, '0')} ${period}`;
}

function toDMY(date) {
  let [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`;
}

function toLicense(plate) {
  plate = plate.toUpperCase().replace(/\s+/g, ''); // Convert to uppercase and remove spaces

  const match = plate.match(/^([A-Z]{2})(\d{1,2})([A-Z]*)(\d{1,4})$/);
  if (!match) return 'Invalid License Plate'; // Return an error for invalid formats

  let [, state, district, letters, number] = match;

  district = district.padStart(2, '0'); // Ensure district code is always 2 digits
  number = number.padStart(4, '0'); // Ensure vehicle number is always 4 digits

  return `${state} ${district} ${letters} ${number}`.trim(); // Format the output
}

export { to12Hour, toDMY, toLicense };
