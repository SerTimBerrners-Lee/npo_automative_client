const PATH_TO_SERVER = `http://${process.env.VUE_APP_PATH_TO_SERVER}:5000/`
console.log("PATH:", process.env.VUE_APP_PATH_TO_SERVER)
console.log("IS_PROD:", process.env.VUE_APP_IS_PROD)

export default PATH_TO_SERVER;