/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./output/*.{html,js}"],
  theme: {
    extend: {
		colors: {
			'blues': {
			  100: '#2b4e78',
			  200: '#274973',
			  300: '#21446c',
			},
			'golds': {
			  100: '#c2930a',
			},
			'tans': {
			  100: '#ebe8e4',
			  200: '#e2dcd2',
			  300: '#d8d3c9',
			},
			'whites': {
			  100: '#fdfdfc',
			},
			'blacks': {
			  100: '#212121',
			},
		},
	},
  },
  plugins: [],
}
