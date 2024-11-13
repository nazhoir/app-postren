export async function hashingPassword(password: string) {
  // Convert password to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Combine salt and password
  const saltedPassword = new Uint8Array([...salt, ...data]);

  // Hash the salted password
  const hashBuffer = await crypto.subtle.digest("SHA-256", saltedPassword);

  // Combine salt and hash to store
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const combinedHashArray = [...salt, ...hashArray];

  // Convert to base64 for storage
  const hashBase64 = btoa(String.fromCharCode(...combinedHashArray));

  return hashBase64;
}

export async function comparePassword(
  storedHashBase64: string,
  inputPassword: string,
) {
  // Decode stored hash from base64
  const combinedHashArray = Uint8Array.from(atob(storedHashBase64), (c) =>
    c.charCodeAt(0),
  );

  // Extract salt and hash from stored hash
  const salt = combinedHashArray.slice(0, 16);
  const storedHash = combinedHashArray.slice(16);

  // Hash the input password with the same salt
  const encoder = new TextEncoder();
  const data = encoder.encode(inputPassword);
  const saltedPassword = new Uint8Array([...salt, ...data]);
  const hashBuffer = await crypto.subtle.digest("SHA-256", saltedPassword);

  // Convert hash to array for comparison
  const inputHash = Array.from(new Uint8Array(hashBuffer));

  // Compare the hashes
  for (let i = 0; i < storedHash.length; i++) {
    if (storedHash[i] !== inputHash[i]) {
      return false;
    }
  }
  return true;
}
