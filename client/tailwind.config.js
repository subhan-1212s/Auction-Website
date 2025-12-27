/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'amazon-blue': '#007bff',
        'amazon-dark-blue': '#0056b3',
        'amazon-gray': '#6c757d',
        'amazon-light-gray': '#f8f9fa',
        'amazon-dark-gray': '#343a40',
        'amazon-white': '#ffffff',
        'amazon-black': '#000000'
      },
      backgroundImage: theme => ({
        'gradient-blue-purple': 'linear-gradient(90deg,#4F46E5 0%,#7C3AED 100%)',
        'gradient-green-teal': 'linear-gradient(90deg,#10B981 0%,#06B6D4 100%)',
        'gradient-pink-purple': 'linear-gradient(90deg,#EC4899 0%,#7C3AED 100%)',
        'gradient-orange-red': 'linear-gradient(90deg,#F97316 0%,#EF4444 100%)',
        'gradient-neon-mix': 'linear-gradient(90deg,#06D6A0 0%,#118AB2 30%,#06B6D4 60%,#7C3AED 100%)',
        'gradient-rainbow': 'linear-gradient(135deg,#667eea 0%,#764ba2 25%,#f093fb 50%,#f5576c 75%,#4facfe 100%)',
        'gradient-sunset': 'linear-gradient(135deg,#ff9a9e 0%,#fecfef 50%,#fecfef 100%)',
        'gradient-ocean': 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
        'gradient-fire': 'linear-gradient(135deg,#ff9a9e 0%,#fecfef 50%,#fecfef 100%)',
        'gradient-forest': 'linear-gradient(135deg,#a8edea 0%,#fed6e3 100%)',
        'gradient-cosmic': 'linear-gradient(135deg,#667eea 0%,#764ba2 25%,#f093fb 50%,#f5576c 75%,#4facfe 100%)'
      })
    }
  },
  plugins: []
}
