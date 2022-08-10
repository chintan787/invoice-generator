/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{html,js,ts,tsx}"],
  theme: {
    textColor: {
      'primary': '#3e484f',
      'secondary': '#404a51',
      'info':'#898e92',
      'danger': '#898e92',
      'button-text':"#fff",
      
    },
    fill:{
      'primary': '#3e484f',
      'secondary': '#404a51',
    },
    borderColor:{
      'real-gray':'#d8dadb'
    },
    backgroundColor:{
      "input-hover":"#fdf4db",
      "disabled" :"#fff",
      "button-bg" :"#3e484f",
      "page-background":"#f7fafc",
      "page":"#fff"
    },
    boxShadow:{
      "card": "0px 0px 1px 0px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 6%), 0px 0px 2px 0px rgb(0 0 0 / 6%)"
    },
    fontSize: {
      xs: "14px",
      xl: "36px"
    },
    maxWidth: {
      
      'a4 ': '210mm',
    },
    maxHeight:{
      'a4': '297mm'
    },
    top:{
      '5px':'5px'
    },
    right:{
      "-20px":"-20px"
    },
    
    
    extend: {
      width: {
        'a4 ': '210mm',
        'div-width':"40%",
        'input-width':"48%"
      },
      height: {
        'a4': '297mm'
      },
      colors: {
        'gray': '#3e484f',
      },
      

    },
    
  },
  plugins: [],
}
