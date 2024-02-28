# Manga Multiplayer

Web application that allows multiple individuals to read manga at the same time by synchronizinig page swiping, meaning that only until all individuals are willing to move onto the next page, the reading will move forward.

## Rationale

I tried reading manga with my girlfriend by screen sharing while I was doing the page swiping. Needless to say I got annoyed very quickly by the fact that I always had to ask for confirmation about whether my girlfriend had finished reading the page or not. So what better way of solving the issue than creating an application that allows both of us to immediately and non-verbally send feedback of when each one of us is done reading each page so that we can have a smooth read together.

## Specifics

- Uses Express, React and Tailwind CSS
- Hosts, who will be selecting the manga to be read, can create rooms, while clients can connect to the rooms via a websocket
- Manga are imported and sourced from websites via scraping
- Currently supports [Manganato](https://manganato.com/) imported manga
- 99% of styling was taken from [Flowbite](https://flowbite.com/)
