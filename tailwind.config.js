module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.js', './src/**/*.html'],
    options: {
      keyframes: true
    }
  },
  prefix: 'erb-',
  corePlugins: {
    preflight: false
  }
}
