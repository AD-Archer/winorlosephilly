// Game constants and configurations
export const MOBILE_BREAKPOINT = 768;
export const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
export const MOBILE_GESTURES = {
    SWIPE_THRESHOLD: 50,
    SHAKE_THRESHOLD: 15
};

export const scenarios = {
    win: [
        "FLY EAGLES FLY!",
        "THATS SAQUON BARKLEY YB!", // for those unaware of the philly slang yb stands for young bull, or young boy its a term of endearment.
        "WE BLEED GREEN!",
        "WE ON BROAD STREET!",
        "HOST A PARADE FOR THE FLYING PHILLY PHANATIC!",
        "Its a Philly thing!",
        "E.L.G.S.E.S. EAGLES!" // Incase you didn't know Phialdelphias current mayor(2025) cannot spell Eagles https://www.cbsnews.com/philadelphia/news/philadelphia-mayor-misspells-eagles-chant/
    ],
    lose: [ // i intend to source more lose scenarios from people i know in real life. 
        "ACCIDENTALLY START A SOFT PRETZEL RIOT!",
        "TRIGGER A CHEESESTEAK GREASE TSUNAMI!",
        "RELEASE A HORDE OF ANGRY PHILLY PHANATICS!",
        "GET STUCK IN A NEVER-ENDING LINE FOR WATER ICE!",
        "HAVE A PIZZA FIGHT AT THE LIBERTY BELL!",
        "FIND YOURSELF IN A BATTLE WITH A RIVAL FAN OVER A TASTY CAKE!"
    ]
};

export const powerUps = {
    eagleBoost: { icon: '🦅', multiplier: 2, duration: 5000 },
    bellRinger: { icon: '🔔', multiplier: 3, duration: 3000 },
    cheesesteak: { icon: '🥖', multiplier: 1.5, duration: 7000 },
    shakeSmash: { icon: '📱', multiplier: 2.5, duration: 4000 }
};

export const BOSS_IMAGES = [
    '/images/traviskelce.jpg',
    '/images/mahomes.jpg',
    '/images/izaiahgathings.jpg',
    '/images/tyreekhill.jpg',
    '/images/taylor.jpg',
];

export const targets = {
    basic: [
        { name: 'trash_can', icon: '🗑️', points: 10, health: 2 },
        { name: 'street_light', icon: '🏮', points: 15, health: 3, moves: true, speed: 1 },
        { name: 'hydrant', icon: '🚰', points: 20, health: 4 }
    ],
    special: [
        { name: 'pretzel_cart', icon: '🥨', points: 50, health: 8, moves: true, speed: 2 },
        { name: 'news_stand', icon: '📰', points: 75, health: 10 },
        { name: 'food_truck', icon: '🚚', points: 100, health: 15, moves: true, speed: 1.5 }
    ],
    boss: [
        { name: 'city_hall', icon: null, points: 500, health: 50, isImageBoss: true },
        { name: 'liberty_bell', icon: null, points: 750, health: 75, isImageBoss: true },
        { name: 'art_museum', icon: null, points: 1000, health: 100, isImageBoss: true }
    ]
};

export const SOUNDS = {
    click: {
        src: 'sounds/select.wav',
        volume: 0.5
    },
    destroy: {
        src: 'sounds/destroy.wav',
        volume: 0.5
    },
    powerup: {
        src: 'sounds/powerup.wav',
        volume: 0.5
    },
    levelUp: {
        src: 'sounds/level-up.wav',
        volume: 0.8
    },
    eagleScream: {
        src: 'sounds/hawk.wav',
        volume: 0.6
    },
    swipe: {
        src: 'sounds/swipe.wav',
        volume: 0.5
    },
    background: {
        src: 'sounds/blow.wav',
        volume: 0.3,
        loop: true
    }
}; 