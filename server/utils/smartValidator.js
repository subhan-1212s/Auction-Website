/**
 * Smart User Integrity Validator (AI-Lite Detection)
 * Uses heuristic patterns to detect potential bots and fake users.
 */

// Known disposable email domains to block
const DISPOSABLE_DOMAINS = [
  'yopmail.com', 'mailinator.com', 'temp-mail.org', 'guerrillamail.com', 
  '10minutemail.com', 'sharklasers.com', 'dispostable.com', 'fake-email.com'
];

/**
 * Validates user integrity score based on heuristics
 * @param {string} name 
 * @param {string} email 
 * @returns {object} { isValid: boolean, reason: string|null }
 */
const detectFakeUser = (name, email) => {
  // 1. Email Domain Check
  const domain = email.split('@')[1];
  if (!domain || DISPOSABLE_DOMAINS.includes(domain.toLowerCase())) {
    return { isValid: false, reason: 'Temporary/Disposable email addresses are not allowed.' };
  }

  // 2. Name Pattern Analysis (Bot Detection)
  // Rejects names with: digits, too many repeated chars, or single words if < 3 chars
  const nameHeuristics = [
    /\d/,                 // Contains numbers (e.g. John123)
    /(.)\1{3,}/,          // 4+ repeated chars (e.g. Aaaaaalex)
    /^[a-z]{1,2}$/i       // Extremely short names (e.g. Ab)
  ];

  if (nameHeuristics.some(regex => regex.test(name))) {
    return { isValid: false, reason: 'Name appears suspicious. Please use your real full legal name.' };
  }

  // 3. Gibberish Detection (Basic Entropy Check)
  // If name has no vowels and is long, it's likely random keysmash (e.g. "kljhsdgf")
  const vowels = name.match(/[aeiouy]/gi);
  if (name.length > 6 && (!vowels || vowels.length === 0)) {
    return { isValid: false, reason: 'Invalid name format detected.' };
  }

  return { isValid: true, reason: null };
};

module.exports = { detectFakeUser };
