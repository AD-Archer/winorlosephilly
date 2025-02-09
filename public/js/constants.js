// Game constants and configurations
export const MOBILE_BREAKPOINT = 768;
export const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
export const MOBILE_GESTURES = {
    SWIPE_THRESHOLD: 50,
    SHAKE_THRESHOLD: 15
};

export const scenarios = {
    win: [
        "SMASH THE LIBERTY BELL WITH JALEN HURTS' HELMET!",
        "BOWL OVER CITY HALL WITH A FLYING EAGLE!",
        "COVER THE ART MUSEUM IN MIDNIGHT GREEN CONFETTI!"
    ],
    lose: [
        "ACCIDENTALLY START A SOFT PRETZEL RIOT!",
        "TRIGGER A CHEESESTEAK GREASE TSUNAMI!",
        "RELEASE A HORDE OF ANGRY PHILLY PHANATICS!"
    ]
};

export const powerUps = {
    eagleBoost: { icon: '🦅', multiplier: 2, duration: 5000 },
    bellRinger: { icon: '🔔', multiplier: 3, duration: 3000 },
    cheesesteak: { icon: '🥖', multiplier: 1.5, duration: 7000 },
    shakeSmash: { icon: '📱', multiplier: 2.5, duration: 4000 }
};

export const targets = {
    basic: [
        { name: 'trash_can', icon: '🗑️', points: 10, health: 2 },
        { name: 'street_light', icon: '🏮', points: 15, health: 3 },
        { name: 'hydrant', icon: '🚰', points: 20, health: 4 }
    ],
    special: [
        { name: 'pretzel_cart', icon: '🥨', points: 50, health: 8 },
        { name: 'news_stand', icon: '📰', points: 75, health: 10 },
        { name: 'food_truck', icon: '🚚', points: 100, health: 15 }
    ],
    boss: [
        { name: 'city_hall', icon: '🏛️', points: 500, health: 50 },
        { name: 'liberty_bell', icon: '🔔', points: 750, health: 75 },
        { name: 'art_museum', icon: '🏛️', points: 1000, health: 100 }
    ]
};

export const SOUNDS = {
    click: {
        src: 'sounds/click.wav',
        volume: 0.5
    },
    destroy: {
        src: 'sounds/destroy.wav',
        volume: 0.6
    },
    powerup: {
        src: 'sounds/powerup.wav',
        volume: 0.7
    },
    levelUp: {
        src: 'sounds/levelup.wav',
        volume: 0.8
    },
    eagleScream: {
        src: 'sounds/eagle.wav',
        volume: 0.6
    },
    background: {
        src: 'sounds/blow.wav',
        volume: 0.3,  // Lower volume for background music
        loop: true    // Enable looping
    }
}; 