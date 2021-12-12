const mix = require('laravel-mix')

mix.options ({ processCssUrls: false })
mix.sass('source/scss/style.sass', 'dist/css')
mix.js('source/js/app.js', 'dist/js/app.min.js').vue()

mix.disableNotifications()