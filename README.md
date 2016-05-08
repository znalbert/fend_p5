# Neighborhood Map Project [link](https://znalbert.github.io/fend_p5)

This is my submission for for Udacity's Front-End Nanodegree Neighborhood Map project. In this project we were to build a single page application with Google Maps, Knockout.js, and another API of our choosing. For my submission I decided on using [eventful.com's](http://www.eventful.com) API to get info about events happening around the user.

## Getting Started

You can check out the project [here](https://znalbert.github.io/fend_p5). The app should ask to use your location. If you decline, you should still be able to enter a US city manually. One thing to note, though, I've noticed some weird behavior with gh-pages and HTTPS. So, if it doesn't load or ask to use your location you may have to manually enter "https://" at the beginning of the URL.

Once the app has your location it will query eventful.com for events happening that same day in your city and display the first ten. If there are more than ten there are forward and back buttons that you can use below the left-side list view to navigate to the next or previous ten.

## Serve Locally

If you prefer if you prefer to serve this locally and already have gulp, you can get up and running immediately after cloning this repo by running `gulp` or `gulp distserve` in this repo's directory. Unless you make changes to the `src/` I'd recommend just running it with `gulp`.

## Future Plans

I feel that I've only scratched the surface in what a framework like Knockout is capable of. I'm not sure if I'll keep this in Knockout or try another framework, but I definitely would like to further expand on some functionality (like filtering by event category) and also see if I can finetune the event data from eventful.com to be even more useful.
