module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'public/css/style.css' : 'public/sass/style.scss'
        }
      }
    },
    env:{
        options:{},
        dev : {
          NODE_ENV: "development",
          DEST: "TEMP",
          G_CLIENT_ID: "asdfasdf",
          G_CLIENT_SECRET: "",
          REDIRECT_URL: ""

        }
    },
    watch: {
      css: { files: '**/*.scss',
          tasks: ['sass'],
        }
    }
  })
  grunt.loadNpmTasks('grunt-env' )
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.registerTask('default',[ 'env:dev', 'watch'])

}