export const validEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }

  const domain = email.split('@')[1].toLowerCase();
  const isUniversityDomain =
    domain.endsWith('.edu') ||
    domain.endsWith('.ac.bd') ||
    domain.endsWith('.ac.uk') ||
    domain.endsWith('.edu.bd');

  if(!isUniversityDomain) {
    return "Email must be a valid university email address.";
  }
};

