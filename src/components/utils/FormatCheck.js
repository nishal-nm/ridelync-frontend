function isInFormat(name, value) {
  if (name === 'email') {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log(emailPattern.test(value));
    return emailPattern.test(value);
  } else if (name === 'username') {
    const usernamePattern = /^[a-zA-Z0-9_]{5,15}$/;
    return usernamePattern.test(value);
  } else if (name === 'phone') {
    const phonePattern = value.length === 10;
    return phonePattern;
  }
}

export { isInFormat };
