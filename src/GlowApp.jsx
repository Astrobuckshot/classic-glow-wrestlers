import React, { useState, useMemo, useEffect, useRef } from "react";

/* ----------------------------------------------------------------
   DATA — Real wrestlers from the original GLOW (1986–1992)
   -----------------------------------------------------------------
   To embed YouTube videos on a wrestler's page, add a `videos`
   array to her entry with up to 2 YouTube video IDs (the part of
   the URL after "watch?v=" or after "youtu.be/").

   Example:
     For https://www.youtube.com/watch?v=dQw4w9WgXcQ
     the video ID is: dQw4w9WgXcQ

     videos: ["dQw4w9WgXcQ", "anotherVideoIdHere"],

   Wrestlers with no `videos` field (or an empty array) simply won't
   show the embedded row — only the "Search YouTube" link will
   appear. Add videos gradually, no need to do them all at once.
   ---------------------------------------------------------------- */
const WRESTLERS = [
  {
    id: "ninotchka",
    name: "Colonel Ninotchka",
    real: "Lorilyn Palmer",
    years: "1986–1990, 1992",
    role: "Heel — The Russian",
    initials: "NT",
    color: "#8d0000",
    photo: "ninotchka.jpg",
    videos: ["zOTChjTQBrc", "9JCvv_FUrA8"],
    bio: "Colonel Ninotchka was a Soviet-themed villain and GLOW Champion — among GLOW's most successful and iconic wrestlers who feuded prominently with the promotion's American-flag-waving faces. The character draped herself in the Soviet flag and smoked mini cigars, leaning into her authoritarian Cold War persona. After her fallout with Major Tanya, Ninotchka moved to Paris and transformed into a glamorous antihero who lavishly dressed in pink. She'd return for the 1992 PPV event vs. Daisy, where she was barely recognizable — with long brown hair and a green outfit.",
    quote: "I've always known that the Farmer's Daughters are stupid. But the little pig brain, Babe, actually thinks Johnny C. is adorable. But then again, next to the pigs on the farm, I guess anyone looks good.",
    finishers: ["Cross Pin"],
  },
  {
    id: "big-bad-mama",
    name: "Big Bad Mama",
    real: "Lynn Braxton (c. 1952–2013)",
    years: "1988–1990, 1992",
    role: "Heel — Voodoo Priestess",
    initials: "BM",
    color: "#7a1fa2",
    photo: "big-bad-mama.jpg",
    videos: ["xNJh6imEVi0", "_Vot1DaVBsE"],
    bio: "A towering, intimidating powerhouse with a painted face based on voodoo imagery, Big Bad Mama used curses and brute strength to torment her opponents, often feuding with Mt. Fiji.",
    quote: "I'm Big Bad Mama. I wasn't always Mama, but I've always been Big and Bad. I was 16 pounds when I came out.",
    finishers: ["Voodoo"],
  },
  {
    id: "mt-fiji",
    name: "Mt. Fiji",
    real: "Emily Dole (1957–2018)",
    years: "1986–1990, 1992",
    role: "Face — The Samoan Giant",
    initials: "MF",
    color: "#0077b6",
    colorRing: "conic-gradient(from 0deg, #0077b6 0deg 60deg, #f4c430 60deg 110deg, #2d6a4f 110deg 150deg, #0077b6 150deg 200deg, #f4c430 200deg 240deg, #c1440e 240deg 260deg, #2d6a4f 260deg 300deg, #0077b6 300deg 360deg)",
    photo: "mt-fiji.jpg",
    videos: ["kLZnThhTW_g", "DxsJwe2PJM4"],
    bio: "One of GLOW's most beloved original stars, Mt. Fiji was billed as the 'biggest female athlete in the world' at 350 lbs. — an island-themed powerhouse and fan favorite known for her size, strength, and easygoing charisma in and out of the ring.",
    quote: "They step into the ring -- two, three, four -- I don't care. They just better be ready, because Mountain Fiji has arrived.",
    finishers: ["Helicopter Spin"],
  },
  {
    id: "matilda-the-hun",
    name: "Matilda the Hun",
    real: "Dee Booher (1948–2022)",
    years: "1986–1987",
    role: "Heel — German Brute",
    initials: "MH",
    color: "#1a1a1a",
    photo: "matilda-the-hun.jpg",
    videos: ["2zMZV34mstU", "eosRmBiHnfo"],
    bio: "A founding GLOW villain and larger-than-life character, Matilda was first to wrestle for the GLOW crown in the pilot event — the 280 pound heel was known for her brutal, no-mercy approach to wrestling... and love for raw meat.",
    quote: "🎵 I eat raw meat, I eat it raw. Better give me your beef cause I bust you in the jaw 🎵",
    finishers: ["Big Splash"],
  },
  {
    id: "hollywood",
    name: "Hollywood",
    real: "Jeanne Basone",
    years: "1986–1990, 1992",
    role: "Heel — Street Punk",
    initials: "HW",
    color: "#ff4d9e",
    colorRing: "repeating-conic-gradient(#ff4d9e 0deg 45deg, #1a1a1a 45deg 90deg)",
    photo: "hollywood.jpg",
    videos: ["KI73ustqhSc", "fLsU1FScMoc"],
    bio: "Hollywood was a staple of GLOW Wrestling lasting its entire run — an L.A. klepto street punk who was among GLOW's most entertaining villains, alongside her partner Vine. Jeanne Basone went on to have a successful career after GLOW as an actress, model, author and stuntwoman.",
    quote: "Terrorizing the little wimps of GLOW beats working.",
    finishers: ["Hooligan Hammerlock"],
  },
  {
    id: "vine",
    name: "Vine",
    real: "Janet Bowers",
    years: "1986–1988",
    role: "Heel — Street Punk",
    initials: "VN",
    color: "#0047ab",
    colorRing: "repeating-conic-gradient(#0047ab 0deg 45deg, #1a1a1a 45deg 90deg)",
    photo: "vine.jpg",
    videos: ["OrfUGRrwwE0", "0CcU3K_LohQ"],
    bio: "The other half of 'Hollywood & Vine,' Vine brought street-tough attitude to GLOW's memorable kleptomaniac tag team, before leaving after Season 3.",
    quote: "Why should I get married and make one man miserable for the rest of his life?",
    finishers: [],
  },
  {
    id: "tina-ferrari",
    name: "Tina Ferrari",
    real: "Lisa Moretti",
    years: "1986–1987",
    role: "Face — Beverly Hills Girl",
    initials: "TF",
    color: "#ec407a",
    colorRing: "radial-gradient(circle, transparent 58%, rgba(179,136,255,0.9) 68%, rgba(103,58,183,1) 82%, rgba(179,136,255,0.9) 100%), conic-gradient(from 220deg, #ec407a, #ec407aee 15%, #ec407a 35%, #ec407add 55%, #ec407aee 70%, #ec407a 90%, #ec407a)",
    photo: "tina-ferrari.jpg",
    videos: ["iU211SinAOk", "PtWyOof6f3o"],
    bio: "A GLOW Champion and one half of The Beverly Hills Girls tag team, Tina Ferrari was a fan favorite who had memorable rivalries with the likes of Jungle Woman and Col. Ninotchka. Moretti went on to become one of the most successful GLOW alumni, later finding stardom in the WWE as Ivory.",
    quote: "Someday Spanish Red may come up with a few brilliant flashes of silence!",
    finishers: [],
  },
  {
    id: "ashley-cartier",
    name: "Ashley Cartier",
    real: "Nadine Kadmiri",
    years: "1986–1987",
    role: "Face — Beverly Hills Girl",
    initials: "AC",
    color: "#b8860b",
    colorRing: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 2px) 0 0 / 8px 8px, radial-gradient(circle, rgba(255,220,100,0.7) 1px, transparent 1px) 4px 4px / 8px 8px, #b8860b",
    photo: "ashley-cartier.jpg",
    videos: ["Pj0cYZlkzE0", "QahmqPc4waE"],
    bio: "The other Beverly Hills Girl, Ashley Cartier teamed with Tina Ferrari to form one of GLOW's top tag teams, mixing glamour with genuine in-ring ability. She also had her own comedic skit called Asking Ashley during her time in GLOW.",
    quote: "There are 3 words to describe Dementia: sick, sick, sick, sick! There are 4 words I mean: sick, sick, sick, sick, sick! Did I say 5 words?",
    finishers: [],
  },
  {
    id: "babe-the-farmers-daughter",
    name: "Babe the Farmer's Daughter",
    real: "Ursula Hayden (1966–2022)",
    years: "1986–1987, 1992",
    role: "Face — America's Sweetheart",
    initials: "BFD",
    color: "#ec407a",
    photo: "babe-the-farmers-daughter.jpg",
    videos: ["His-dYEcETs", "DZQ1wdVtO48"],
    bio: "A wholesome, hardworking fan favorite from Hog Hallow, Nebraska, Babe (Ursula Hayden) brought more of that country charm to the roster. Ursula Hayden later went on to purchase the GLOW brand itself in 2001, and remained owner until her passing in 2022.",
    quote: "I hate Colonel Ninotchka. She's the type of person who'd send mud to hurricane victims.",
    finishers: [],
  },
  {
    id: "sally-the-farmers-daughter",
    name: "Sally the Farmer's Daughter",
    real: "Becky Mullen (1963–2020)",
    years: "1986, 1988–1989",
    role: "Face — All-American Farm Girl",
    initials: "SFD",
    color: "#c62828",
    colorRing: "radial-gradient(circle, white 25%, transparent 26%) 0 0 / 12px 12px, #c62828",
    photo: "sally-the-farmers-daughter.jpg",
    videos: ["XDf36XR9tJo", "EkKBszDWLAM"],
    bio: "Hailing from Hog Hallow, Nebraska, Sally was one of GLOW's original farm-girl faces and a fan favorite throughout the show's run, known for her down-home charm. She was absent for Season 2 but then returned to GLOW in Season 3.",
    quote: "Dementia went with me to a Sadie's Hawkins Day Dance, 'cause I thought it might be a nice way for us to meet a couple fellas. Whew! Was I wrong!",
    finishers: ["Farmer's Roll"],
  },
  {
    id: "amy-the-farmers-daughter",
    name: "Amy the Farmer's Daughter",
    real: "Trudy Adams",
    years: "1987",
    role: "Face — All-American Farm Girl",
    initials: "AFD",
    color: "#ec407a",
    photo: "amy-the-farmers-daughter.jpg",
    videos: ["2belhDRJg0U", "nWiXzkrTeFk"],
    bio: "Amy the Farmer's Daughter joined GLOW in Season 2, replacing Sally in the recurring 'Farmer's Daughter's Letters Home' skit and bringing her own small-town sincerity to the roster.",
    quote: "Dementia reminds me of someone back on my daddy's farm — the scarecrow!",
    finishers: [],
  },
  {
    id: "palestina",
    name: "Palestina",
    real: "Janeen Jewett",
    years: "1986–1987",
    role: "Heel — Desert Rat",
    initials: "PL",
    color: "#6a1b9a",
    photo: "palestina.jpg",
    videos: ["t0prFJkNKW4", "0G9rH2iE1-Y"],
    bio: "Palestina was presented as a terrorist from Syria and came to the ring with a machete and prayer rug. She was referred to on the show as 'the desert rat' — one of her gimmicks was throwing sand in the face of her opponents.",
    quote: "I enjoy teaming up with the Princess of Darkness. She has the one quality that I admire — evilness!",
    finishers: [],
  },
  {
    id: "roxy-astor",
    name: "Roxy Astor",
    real: "Tracey Meltzer",
    years: "1988–1990",
    role: "Face — Park Avenue Knockout",
    initials: "RA",
    color: "#004d40",
    colorRing: "radial-gradient(circle 3px at 4% 18%, #006b5a 80%, transparent 81%), radial-gradient(circle 2px at 8% 42%, #005a4b 80%, transparent 81%), radial-gradient(circle 2px at 5% 68%, #007a67 80%, transparent 81%), radial-gradient(circle 3px at 10% 88%, #004d40 80%, transparent 81%), radial-gradient(circle 2px at 22% 4%, #005a4b 80%, transparent 81%), radial-gradient(circle 2px at 38% 7%, #008070 80%, transparent 81%), radial-gradient(circle 3px at 55% 3%, #003d33 80%, transparent 81%), radial-gradient(circle 2px at 72% 6%, #007a67 80%, transparent 81%), radial-gradient(circle 2px at 88% 12%, #006b5a 80%, transparent 81%), radial-gradient(circle 3px at 94% 28%, #005a4b 80%, transparent 81%), radial-gradient(circle 2px at 96% 48%, #007a67 80%, transparent 81%), radial-gradient(circle 2px at 95% 68%, #004d40 80%, transparent 81%), radial-gradient(circle 3px at 91% 84%, #005a4b 80%, transparent 81%), radial-gradient(circle 2px at 78% 94%, #008070 80%, transparent 81%), radial-gradient(circle 2px at 62% 96%, #003d33 80%, transparent 81%), radial-gradient(circle 3px at 45% 95%, #007a67 80%, transparent 81%), radial-gradient(circle 2px at 28% 93%, #006b5a 80%, transparent 81%), radial-gradient(circle 2px at 14% 88%, #005a4b 80%, transparent 81%), radial-gradient(circle 3px at 18% 35%, #007a67 80%, transparent 81%), radial-gradient(circle 2px at 82% 55%, #004d40 80%, transparent 81%), radial-gradient(circle 2px at 35% 72%, #005a4b 80%, transparent 81%), radial-gradient(circle 3px at 65% 78%, #008070 80%, transparent 81%), radial-gradient(circle 2px at 7% 23%, #003d33 80%, transparent 81%), radial-gradient(circle 2px at 19% 61%, #007a67 80%, transparent 81%), radial-gradient(circle 3px at 33% 8%, #006b5a 80%, transparent 81%), radial-gradient(circle 2px at 41% 77%, #005a4b 80%, transparent 81%), radial-gradient(circle 2px at 57% 35%, #007a67 80%, transparent 81%), radial-gradient(circle 3px at 63% 88%, #004d40 80%, transparent 81%), radial-gradient(circle 2px at 74% 14%, #005a4b 80%, transparent 81%), radial-gradient(circle 2px at 82% 52%, #008070 80%, transparent 81%), radial-gradient(circle 3px at 91% 78%, #003d33 80%, transparent 81%), radial-gradient(circle 2px at 25% 44%, #007a67 80%, transparent 81%), radial-gradient(circle 2px at 48% 58%, #006b5a 80%, transparent 81%), radial-gradient(circle 3px at 87% 30%, #005a4b 80%, transparent 81%), radial-gradient(circle 2px at 14% 72%, #007a67 80%, transparent 81%), radial-gradient(circle 2px at 52% 18%, #004d40 80%, transparent 81%), radial-gradient(circle 3px at 38% 90%, #005a4b 80%, transparent 81%), radial-gradient(circle 2px at 76% 65%, #008070 80%, transparent 81%), radial-gradient(circle 2px at 2% 30%, #003d33 80%, transparent 81%), radial-gradient(circle 3px at 2% 55%, #007a67 80%, transparent 81%), radial-gradient(circle 2px at 2% 80%, #006b5a 80%, transparent 81%), radial-gradient(circle 2px at 12% 2%, #005a4b 80%, transparent 81%), radial-gradient(circle 3px at 50% 1%, #007a67 80%, transparent 81%), radial-gradient(circle 2px at 85% 3%, #004d40 80%, transparent 81%), radial-gradient(circle 2px at 97% 35%, #005a4b 80%, transparent 81%), radial-gradient(circle 3px at 98% 60%, #008070 80%, transparent 81%), radial-gradient(circle 2px at 97% 82%, #003d33 80%, transparent 81%), radial-gradient(circle 2px at 85% 96%, #007a67 80%, transparent 81%), radial-gradient(circle 3px at 50% 98%, #006b5a 80%, transparent 81%), radial-gradient(circle 2px at 15% 97%, #005a4b 80%, transparent 81%), conic-gradient(from 220deg, #00332b, #004d40 15%, #003328 35%, #005046 55%, #00332b 70%, #004d40 90%, #00332b)",
    photo: "roxy-astor.jpg",
    videos: ["KI73ustqhSc", "PxFLJKsQGnI"],
    bio: "A fixture in GLOW's later seasons, Roxy Astor was one of the 'Park Avenue Knockouts' along with Tiffany Mellon, who she regularly teamed up with. The ritzy wrestler was a contender in the Season 3 'Run for the Rubies' tournament.",
    quote: "You have to admit, Ninotchka has done very well in this country. She was seen in a magazine, BBW -- Big Beached Women.",
    finishers: [],
  },
  {
    id: "lightning",
    name: "Lightning",
    real: "Cheryl Rusa",
    years: "1988–1989",
    role: "Face — Superhero",
    initials: "LT",
    color: "#1b5e20",
    colorRing: "repeating-conic-gradient(#1b5e20 0deg 45deg, #b71c1c 45deg 60deg)",
    photo: "lightning.jpg",
    videos: ["tjKAioQM-s8", "pKCUiIL9UmU"],
    bio: "Known for her speed and agility, Lightning formed The Superheroes tag team alongside Thunderbolt — showing off their high flying skills. Rusa went on to a legitimate, lasting career in professional wrestling after the promotion ended.",
    quote: "Dementia looks like a walking corpse. She needs to be axed from the wrestling ring.",
    finishers: [],
  },
  {
    id: "tiffany-mellon",
    name: "Tiffany Mellon",
    real: "Sandra Margot",
    years: "1988–1990",
    role: "Face — Park Avenue Knockout",
    initials: "TM",
    color: "#FFD700",
    colorRing: "radial-gradient(circle 3px at 4% 18%, #ffd740 80%, transparent 81%), radial-gradient(circle 2px at 8% 42%, #f9a825 80%, transparent 81%), radial-gradient(circle 3px at 5% 68%, #ffe57f 80%, transparent 81%), radial-gradient(circle 2px at 10% 88%, #ffc107 80%, transparent 81%), radial-gradient(circle 3px at 22% 4%, #ffd740 80%, transparent 81%), radial-gradient(circle 2px at 38% 7%, #ffe57f 80%, transparent 81%), radial-gradient(circle 3px at 55% 3%, #f9a825 80%, transparent 81%), radial-gradient(circle 2px at 72% 6%, #ffd740 80%, transparent 81%), radial-gradient(circle 3px at 88% 12%, #ffe57f 80%, transparent 81%), radial-gradient(circle 2px at 94% 28%, #ffc107 80%, transparent 81%), radial-gradient(circle 3px at 96% 48%, #ffd740 80%, transparent 81%), radial-gradient(circle 2px at 95% 68%, #f9a825 80%, transparent 81%), radial-gradient(circle 3px at 91% 84%, #ffe57f 80%, transparent 81%), radial-gradient(circle 2px at 78% 94%, #ffd740 80%, transparent 81%), radial-gradient(circle 3px at 62% 96%, #ffc107 80%, transparent 81%), radial-gradient(circle 2px at 45% 95%, #ffe57f 80%, transparent 81%), radial-gradient(circle 3px at 28% 93%, #f9a825 80%, transparent 81%), radial-gradient(circle 2px at 14% 88%, #ffd740 80%, transparent 81%), radial-gradient(circle 3px at 18% 35%, #ffe57f 80%, transparent 81%), radial-gradient(circle 2px at 82% 55%, #f9a825 80%, transparent 81%), radial-gradient(circle 3px at 35% 72%, #ffd740 80%, transparent 81%), radial-gradient(circle 2px at 65% 78%, #ffc107 80%, transparent 81%), conic-gradient(from 220deg, #FFD700, #FFD700ee 15%, #FFD700 35%, #FFD700dd 55%, #FFD700ee 70%, #FFD700 90%, #FFD700)",
    photo: "tiffany-mellon.jpg",
    videos: ["8o6IHVTHVJM", "nsNAxaGYnQY"],
    bio: "A kind if clueless 'high society' face, Tiffany Mellon teamed with best friend Roxy Astor as the Park Avenue Knockouts, bringing glamour and good-natured charm to the fan-favorite side of the roster — even accompanied to the ring by her butler Jeeves, showing off her glitz.",
    quote: "Tiffany knows how to succeed, money is all I'll ever need.",
    finishers: [],
  },
  {
    id: "melody-trouble-vixen",
    name: "Melody Trouble Vixen (MTV)",
    real: "Eileen O'Hara (Eileen Womack)",
    years: "1988–1990, 1992",
    role: "Heel — Rock 'n Roll Wrestler",
    initials: "MTV",
    color: "#8cbf2e",
    colorRing: "repeating-conic-gradient(#8cbf2e 0deg 38deg, #c2185b 38deg 56deg)",
    photo: "melody-trouble-vixen.jpg",
    videos: ["y78H7yBjeAA", "4FJV-mBguRo"],
    bio: "Self-described as 'Melody Trouble Vixen, M-T-V, your A-OK DJ!', MTV brought a rock 'n roll attitude to GLOW. She'd bring her guitar to ringside, and sometimes belt out a tune for the audience while mocking her opponent — bringing her style of neon glam to the heel roster.",
    quote: "Dementia, I know that you wanted to rap, but that didn't mean wrap your hands around Zelda's neck. Or did it?",
    finishers: [],
  },
  {
    id: "daisy",
    name: "Daisy",
    real: "Debbie Sjoberg",
    years: "1988–1990, 1992",
    role: "Face — The Tall Flower",
    initials: "DZ",
    color: "#c62828",
    photo: "daisy.jpg",
    videos: ["boEKoNB_o60", "yMRDe3Vcgvo"],
    bio: "From 'Parts Unknown', the 6'2 Daisy premiered as Gremlina's slave. She wore tattered clothes and wrestled on the villain's behalf, who'd usher her to the ring on a leash. Daisy's debt caused a temporary alliance with Kitty's Killers — but she'd finally break free and turn against Gremlina, stuffing her into a garbage can. From there, Daisy wrestled heels and faces — and eventually her way to becoming GLOW Champion.",
    quote: "I'm finally free!",
    finishers: ["Side Suplex"],
  },
  {
    id: "cheyenne-cher",
    name: "Cheyenne Cher",
    real: "Deborah Choctoot",
    years: "1988–1990",
    role: "Face — Indian Princess",
    initials: "CC",
    color: "#1565c0",
    colorRing: "conic-gradient(from 220deg, #1565c0, #1565c0ee 15%, #1565c0 35%, #1565c0dd 55%, #1565c0ee 70%, #1565c0 90%, #1565c0)",
    photo: "cheyenne-cher.jpg",
    videos: ["SZxk4ZfjYAY", "udv26y0nNeM"],
    bio: "Cheyenne Cher was an acrobatic Native American character who wrestled as part of the Cheerleaders tag team alongside Vicky Victory. She won the vacant GLOW Championship in Season 3's 'Run for the Rubies' tournament by defeating Godiva in the final, with an assist from Roxy Astor. Cheyenne also had her own skit segment called Cheyenne Cher's Indian Folklores.",
    quote: "Stinky's smell is so bad, when she lifts her arms, she sends smoke signals.",
    finishers: ["Handstand Head Scissors"],
  },
  {
    id: "godiva",
    name: "Godiva",
    real: "Dawn Rice",
    years: "1988–1990",
    role: "Heel — British Bombshell",
    initials: "GD",
    color: "#c9a227",
    photo: "godiva.jpg",
    videos: ["nsNAxaGYnQY", "dsZHbiFCh00"],
    bio: "Godiva rides on horseback to the ring with her long hair flowing reminiscent of Lady Godiva. The sassy, vain British bombshell had many memorable matches with the faces of GLOW while hosting her own skit — Godiva's Bare Facts.",
    quote: "Thunderbolt and Lightning? This is the biggest joke I've ever heard of in my life. Those little comic book zeroes couldn't zap their way out of a paper bag.",
    finishers: ["Buckingham Bounce"],
  },
  {
    id: "major-tanya",
    name: "Major Tanya",
    real: "Noelle Rose",
    years: "1987–1989",
    role: "Heel — The Russian",
    initials: "MJT",
    color: "#8d0000",
    photo: "major-tanya.jpg",
    videos: ["rVWUL58EK5Q", "PlBO5-XN1E0"],
    bio: "GLOW's other military-themed Soviet villain, Major Tanya made her debut sometime in Season 2, with her earliest known match being a tag team battle with Colonel Ninotchka vs. The Southern Belles. Tanya was a regular tag team partner of Ninotchka — before having a falling out with her comrade when the Major interfered in her match.",
    quote: "Ninotchka disgrace(d) all Russian motherland. Tonight I bring her message from her former friends in Soviet. And I will deliver this message in the ring.",
    finishers: [],
  },
  {
    id: "dementia",
    name: "Dementia",
    real: "Michelle Duze & Nancy Daly",
    years: "1986–1988",
    role: "Heel — Psychopathic Child",
    initials: "DM",
    color: "#c19a6b",
    photo: "dementia.jpg",
    videos: ["zVoPX_2kNDE", "VHjO41oiduU"],
    bio: "One of GLOW's strangest and most memorable characters, Dementia was wheeled to ringside in a restraint cage, wearing a hockey mask and carrying an axe — playing up a deranged, silent, childlike menace. Characters such as Princess of Darkness and Gremlina would take advantage of this and used her for their own bidding.",
    quote: "  ....",
    finishers: [],
  },
  {
    id: "beastie",
    name: "Beastie",
    real: "Kelle Favara",
    years: "1988–1990, 1992",
    role: "Heel — The Road Hog",
    initials: "BS",
    color: "#b8860b",
    colorRing: "conic-gradient(from 0deg, #9e9e9e, #1a1a1a 25%, #9e9e9e 50%, #1a1a1a 75%, #9e9e9e 100%)",
    photo: "beastie.jpg",
    videos: ["15GhDpSbH6I", "GuV60w_Jyq0"],
    bio: "A brawling, Mad Max-inspired brute from Australia, Beastie was an over-the-top character who wore a mohawk, shoulder pads and carried a spiked mace — all while showing a love for meat. Beastie brought post-apocalyptic attitude to GLOW's heel roster.",
    quote: "Aaarrrggghhh!",
    finishers: ["Biting"],
  },
  {
    id: "california-doll",
    name: "The California Doll",
    real: "Jane Hamlin",
    years: "1986–1987",
    role: "Face — Surfer Girl",
    initials: "CD",
    color: "#ec407a",
    colorRing: "radial-gradient(circle, transparent 60%, rgba(255,215,0,0.7) 78%, rgba(255,193,7,0.9) 90%, rgba(255,215,0,0.6) 100%), conic-gradient(from 220deg, #ec407a, #ec407aee 15%, #ec407a 35%, #ec407add 55%, #ec407aee 70%, #ec407a 90%, #ec407a)",
    photo: "california-doll.jpg",
    videos: ["cVQ-ArfcH-8", "LJqlckPCItE"],
    bio: "The California Doll was a fan favorite, and a ray of sunshine — but she was also a very formidable opponent — even defeating Col. Ninotchka. She had her own GLOW skit called 'Points to Ponder' in the first 2 seasons. Hamlin continued wrestling as 'Malibu' in David McLane's follow-up promotion, POWW.",
    quote: "Spanish Red just got back from the beach. Her tongue was sunburned!",
    finishers: [],
  },
  {
    id: "housewife-arlene",
    name: "The Housewives (Arlene & Phyllis)",
    real: "Donna Wilinsky & Sharon Wilinsky",
    years: "1986–1987",
    role: "Heel — Tag Team",
    initials: "HW",
    color: "#90caf9",
    photo: "housewife-arlene.jpg",
    videos: ["U2jgtbx0vXQ", "ld8RIR3QoaY"],
    bio: "Real-life sisters Donna and Sharon Wilinsky played Arlene and Phyllis from Newark, New Jersey. The Housewives brought a comedic act to the ring, and usually had beef with the scantily clad wrestlers of GLOW. Arlene and Phyllis came equipped with a rolling pin, aerosol sprays, frying pan, plunger, mop and bucket. Though they generally wrestled Stallone's Sweethearts, they did have a tag team match vs. The Soul Patrol in Season 2.",
    quote: "We're the only true beauties in all of GLOW!",
    finishers: [],
  },
  {
    id: "heavy-metal-spike",
    name: "Heavy Metal Sisters (Spike & Chainsaw)",
    real: "Donna Wilinsky & Sharon Wilinsky",
    years: "1986–1987",
    role: "Heel — Psycho Siblings",
    initials: "HS",
    color: "#000000",
    photo: "heavy-metal-spike.jpg",
    videos: ["qK0ac3RAUnE", "DxsJwe2PJM4"],
    bio: "The Heavy Metal Sisters debuted in the first season, and quickly established themselves as the wildest duo in GLOW. Spike (Donna Wilinsky) wielded a blowtorch while Chainsaw (Sharon Wilinsky) brandished a Black & Decker chainsaw, causing memorable chaos in and out of the ring. Rumor has it, when Ozzy Osbourne bit the head off a bat, Chainsaw & Spike were there to finish it off.",
    quote: "To conquer Mt. Fiji one day, I'd like to chop her down with my Black & Decker, like a big, fat Christmas tree.",
    quoteAttribution: "Chainsaw (Heavy Metal Sisters)",
    finishers: ["Mayhem"],
  },
  {
    id: "americana",
    name: "Americana",
    real: "Cindy Maranne (Ferda)",
    years: "1986–1987",
    role: "Face — Patriotic",
    initials: "AM",
    color: "#0d47a1",
    colorRing: "conic-gradient(from 210deg, #b22234 0deg 120deg, #ffffff 120deg 240deg, #3c3b6e 240deg 360deg)",
    photo: "americana.jpg",
    videos: ["jhfcSAU_-Wg", "lgf3U2pv94c"],
    bio: "A red-white-and-blue patriotic face, Americana held the GLOW Championship in Season 1 before losing it in the controversial title match against Col. Ninotchka that eventually forced the championship to be vacated. She also served as leader of Stallone's Sweethearts.",
    quote: "Most girls her age steal men's hearts. Vine steals hubcaps.",
    finishers: [],
  },
  {
    id: "angel",
    name: "Angel",
    real: "Andrea Micheil",
    years: "1987",
    role: "Heel — Biker Chick",
    initials: "AN",
    color: "#1a1a1a",
    colorRing: "radial-gradient(circle, transparent 68%, rgba(255,255,255,0.6) 76%, rgba(255,255,255,1) 88%, rgba(255,255,255,0.8) 100%), conic-gradient(from 220deg, #1a1a1a, #1a1a1aee 15%, #1a1a1a 35%, #1a1a1add 55%, #1a1a1aee 70%, #1a1a1a 90%, #1a1a1a)",
    photo: "angel.jpg",
    videos: ["TOma_xx60Ks", "BTVA8pe_iv8"],
    bio: "Despite the name, Angel was anything but heavenly — a tough, leather-clad biker chick heel from Oakland, CA who brought chains and attitude to GLOW's second season, even battering her opponents with a biker helmet. She later wrestled in other promotions under the name Hot Rod Andie (a tribute to Roddy Piper).",
    quote: "Zelda must have been reincarnated. Nobody can get that dumb in one lifetime!",
    finishers: [],
  },
  {
    id: "attache",
    name: "Attaché",
    real: "Laura Fisher",
    years: "1986–1987",
    role: "Heel — The Mercenary",
    initials: "AT",
    color: "#4b5320",
    photo: "attache.jpg",
    videos: ["THc59JLkOEE", "fn8Mq3z_4wg"],
    bio: "A 'mean marine' turned mercenary heel, Attaché was constantly clad in army fatigues and regularly spit on her opponents. She teamed up early on with Corporal Kelly for a brief time, and staged memorable matches with Tina Ferrari, Spanish Red, and Susie Spirit.",
    quote: "Ferrari's gonna lose today, I'm gonna smash her face into pâté.",
    finishers: ["Spitting"],
  },
  {
    id: "broadway-rose",
    name: "Broadway Rose",
    real: "Eva Chirumbolo / Andrea Janell",
    years: "1988",
    role: "Heel — New York Punk",
    initials: "BR",
    color: "#26a69a",
    colorRing: "repeating-conic-gradient(#26a69a 0deg 35deg, #4a0080 35deg 55deg)",
    photo: "broadway-rose.jpg",
    videos: ["gDjVJZ5h1ZU", "vLc50RtqufY"],
    bio: "Hollywood's cousin and fellow street punk girl, Broadway Rose replaced Vine as Hollywood's tag team partner and shared the same love of stealing and causing trouble. Portrayed by two different performers across her GLOW run.",
    quote: "Here me now and play my game, and if you don't, you'll be in pain.",
    finishers: [],
  },
  {
    id: "brunhilda",
    name: "Brunhilda",
    real: "Deanne Murray",
    years: "1988",
    role: "Heel — Viking",
    initials: "BH",
    color: "#455a64",
    colorRing: "conic-gradient(from 220deg, #cd7f32, #a0522d 15%, #cd7f32 35%, #8b4513 55%, #cd7f32 70%, #a0522d 90%, #cd7f32)",
    photo: "brunhilda.jpg",
    videos: ["-UIXO_5B8yI"],
    bio: "An obscure GLOW character who dressed in Viking garb, Brunhilda appeared later in Season 4, wrestling in a 21-person Battle Royal and Penalty Box match.",
    finishers: [],
    noSecondPhoto: true,
  },
  {
    id: "corporal-kelly",
    name: "Corporal Kelly",
    real: "Olympia Hartauer / Lillian Weaver Crabtree",
    years: "1986, 1988",
    role: "Heel — Commando",
    initials: "CK",
    color: "#33691e",
    photo: "corporal-kelly.jpg",
    videos: ["UdI4e5uHqI4", "gfrZNTad-O8"],
    bio: "A tough marine heel portrayed by two different performers, Corporal Kelly regularly teamed up with the other military heel of Kitty's Killers, Attaché, in the 1st season. During the lumberjack match between Mt. Fiji & Matilda the Hun, Kelly fired her gun in the air multiple times before referee Frank D'Amato ripped it from her hands.",
    quote: "I'm gonna make Mt. Fiji's fat head go splat and her fat body go splooey!",
    finishers: [],
  },
  {
    id: "dallas",
    name: "Dallas",
    real: "Debi Pelletier",
    years: "1986",
    role: "Face — Texas Cowgirl",
    initials: "DL",
    color: "#0d1b5e",
    colorRing: "conic-gradient(from 220deg, #0d1b5e, #0d1b5eee 15%, #0d1b5e 35%, #0d1b5edd 55%, #0d1b5eee 70%, #0d1b5e 90%, #0d1b5e)",
    photo: "dallas.jpg",
    videos: ["pfty6kxaXps", "oMpmC1kcfpc"],
    bio: "A Season 1 competitor on the original GLOW roster, this lasso-wielding Texan brought a big-and-bold attitude to the early days of the promotion. In the 1980s, Pelletier was known as the Killer Tomato, which she wrestled under during her career outside of GLOW — including with the AWA.",
    finishers: [],
  },
  {
    id: "debbie-debutante",
    name: "Debbie Debutante",
    real: "Ann LaBree",
    years: "1986–1987",
    role: "Face — Cheerleader",
    initials: "DD",
    color: "#b8860b",
    photo: "debbie-debutante.jpg",
    videos: ["aHH2wXZjeek", "j93ggRQ1-1k"],
    bio: "One half of the original GLOW Cheerleaders, Debbie Debutante was a fan favorite alongside her tag partner Susie Spirit — showing off their acrobatic skills in and out of the ring. LaBree was a gymnast and another recruit from Folies Bergère with Lauri Thompson (Susie Spirit). The Cheerleaders would team up with fellow faces Tina Ferrari and Americana throughout the first couple years of GLOW as well.",
    quote: "I love cheerleading and never want to give it up, even when I'm out of school and married with kids.",
    finishers: [],
  },
  {
    id: "ebony",
    name: "Ebony",
    real: "Jan White",
    years: "1986",
    role: "Face",
    initials: "EB",
    color: "#c0c0c0",
    colorRing: "conic-gradient(from 220deg, #e5e4e2, #c0c0c0 15%, #e8e8e8 35%, #a9a9a9 55%, #e5e4e2 70%, #c0c0c0 90%, #e5e4e2)",
    photo: "ebony.jpg",
    videos: ["-5MoplMqf7o", "zH1pofsylU4"],
    bio: "From Detroit, Michigan, Ebony debuted early in Season 1 wrestling some antagonizing heels along the way, including a memorable and heated battle with the Heavy Metal Sisters. She later followed David McLane to his follow-up promotion, POWW.",
    quote: "I wanna wrestle! Will you cancel my other match!? I'll wrestle her! I'll give you an American -- with an all year tan at that!",
    finishers: [],
  },
  {
    id: "evangelina",
    name: "Evangelina",
    real: "Christy M. Smith",
    years: "1988–1989",
    role: "Heel — Preacher",
    initials: "EV",
    color: "#1a1a1a",
    photo: "evangelina.jpg",
    videos: ["vLUoMpgKyIA", "wX355EZKVW0"],
    bio: "A 'holier than thou' preacher from GLOW's third season, Evangelina preached fire and brimstone — scolding her opponents for their sins and sermonizing during the match — even attacking Zelda before the bell over a dispute on evolution.",
    quote: "Every time I beat my opponent, I'm kicking Satan's butt.",
    finishers: [],
  },
  {
    id: "gremlina",
    name: "Gremlina",
    real: "Sandy Manley",
    years: "1988",
    role: "Heel — Evil Dwarf",
    initials: "GR",
    color: "#558b2f",
    photo: "gremlina.jpg",
    videos: ["K_cZxXWl8k4", "wKkXbkNpkuU"],
    bio: "A Season 3 villain of small stature, Gremlina was an evil menace who enslaved Daisy, forcing her to wrestle in her matches. Once she lost possession of Daisy, Gremlina didn't have a lot to contribute since she wasn't much of a wrestler in the ring.",
    quote: "Zelda lies in the sun for hours at the beach so that she can be the toast of the town!",
    finishers: [],
  },
  {
    id: "habana",
    name: "Habana",
    real: "Christina Garcia",
    years: "1988–1989",
    role: "Heel — Cuban Assassin",
    initials: "HB",
    color: "#b34700",
    photo: "habana.jpg",
    videos: ["FdPtCZwnUnw", "1jyGFBeq_8g"],
    bio: "A Cuban-themed heel from GLOW's third season, Habana played a Fidel Castro-type character — a militant, authoritarian figure who brought political menace to the villain side of the roster.",
    quote: "I'm Habana, Cuba's best / I've come to take on all the rest / I'm bringing all my country's pride / To tear apart your gringo hide",
    finishers: [],
  },
  {
    id: "the-hicks",
    name: "Sara & Mabel",
    real: "April Hom & Nadine Kadmiri",
    years: "1986, 1988–1989",
    role: "Heel — The Hicks",
    initials: "HK",
    color: "#6d4c41",
    photo: "the-hicks.jpg",
    videos: ["NQ03w3O1T5Y", "fhtOgzcWS24"],
    bio: "Sara and Mabel were a masked country-bumpkin tag team, playing up backwoods stereotypes for cheap, effective heel heat during GLOW's run. In the first season, these 'Hicks from the Sticks' would routinely use rope and chains to whip and tie up their opponents.",
    quote: "I think those Southern Belles are too doggone pretty. We're gonna have to make 'em look like a mess when we get done with them.",
    finishers: [],
  },
  {
    id: "jailbait",
    name: "Jailbait",
    real: "Trish Casella",
    years: "1988",
    role: "Heel",
    initials: "JB",
    color: "#7b6ba8",
    colorRing: "conic-gradient(from 220deg, #7b6ba8, #6a5b9a 15%, #7b6ba8 35%, #5e5090 55%, #7b6ba8 70%, #6a5b9a 90%, #7b6ba8)",
    photo: "jailbait.jpg",
    videos: ["bGN3xL55axc"],
    bio: "One of GLOW's more obscure characters, Jailbait made her first appearance in a Season 2 skit with referee Steve Blance. Her only known match was a tag team duo with MTV vs. Thunderbolt and Lightning from an unaired episode, despite being a regular in the Season 3 intro.",
    finishers: [],
  },
  {
    id: "jungle-woman",
    name: "Jungle Woman",
    real: "Annette Marroquin",
    years: "1986",
    role: "Heel — Jungle Predator",
    initials: "JW",
    color: "#4e342e",
    colorRing: "radial-gradient(ellipse 6px 8px at 3% 5%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 11% 18%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 6% 32%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 14% 48%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 8px at 4% 62%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 9% 78%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 5px at 3% 90%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 20% 8%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 28% 22%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 22% 38%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 9px at 30% 55%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 5px at 18% 68%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 5px at 25% 82%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 38% 6%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 7px at 44% 18%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 35% 34%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 42% 50%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 32% 66%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 40% 80%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 8px at 36% 94%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 52% 4%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 5px at 58% 16%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 48% 28%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 55% 42%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 46% 58%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 9px at 54% 72%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 5px at 50% 86%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 5px at 66% 10%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 72% 24%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 7px at 62% 38%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 68% 52%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 60% 66%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 70% 80%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 64% 92%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 8px at 80% 6%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 86% 20%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 5px at 76% 34%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 82% 48%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 78% 62%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 88% 76%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 9px at 84% 90%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 5px at 94% 15%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 5px at 92% 45%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 96% 70%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 7px at 10% 18%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 18% 31%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 13% 45%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 21% 61%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 11% 75%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 8px at 16% 91%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 10% 3%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 5px at 27% 21%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 35% 35%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 29% 51%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 37% 68%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 9px at 25% 81%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 5px at 32% 95%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 5px at 45% 19%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 51% 31%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 7px at 42% 47%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 49% 63%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 39% 79%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 47% 93%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 43% 7%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 8px at 59% 17%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 65% 29%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 5px at 55% 41%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 62% 55%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 53% 71%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 61% 85%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 9px at 57% 99%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 5px at 73% 23%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 5px at 79% 37%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 69% 51%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 7px at 75% 65%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 67% 79%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 77% 93%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 71% 5%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 87% 19%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 8px at 93% 33%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 83% 47%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 5px at 89% 61%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 85% 75%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 95% 89%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 91% 3%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 9px at 1% 28%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 5px at 99% 58%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 5px at 3% 83%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 16% 12%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 7px at 24% 25%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 19% 39%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 27% 55%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 17% 69%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 22% 85%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 8px at 16% 97%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 33% 15%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 5px at 41% 29%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 35% 45%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 43% 62%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 31% 75%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 9px at 38% 89%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 5px at 51% 13%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 5px at 57% 25%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 48% 41%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 7px at 55% 57%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 45% 73%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 53% 87%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 49% 1%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 65% 11%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 8px at 71% 23%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 61% 35%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 5px at 68% 49%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 59% 65%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 67% 79%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 63% 93%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 9px at 79% 17%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 5px at 85% 31%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 5px at 75% 45%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 81% 59%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 7px at 73% 73%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 83% 87%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 77% 99%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 93% 13%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 99% 27%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 8px at 89% 41%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 9px at 95% 55%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 5px at 91% 69%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 9px 7px at 1% 83%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 10px 6px at 97% 97%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 8px at 7% 22%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 8px 9px at 5% 52%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 7px 5px at 9% 77%, #1a1a1a 90%, transparent 91%), radial-gradient(ellipse 6px 6px at 15% 55%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 7px 7px at 32% 42%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 8px 8px at 48% 65%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 5px 9px at 62% 28%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 6px 5px at 74% 58%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 7px 7px at 85% 38%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 26% 85%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 4px 8px at 55% 12%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 6px 9px at 91% 88%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 5px 5px at 26% 72%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 7px 5px at 43% 59%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 59% 82%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 4px 7px at 73% 45%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 4px 8px at 85% 75%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 5px 9px at 96% 55%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 6px 6px at 37% 2%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 7px 7px at 66% 29%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 8px 8px at 2% 5%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 5px 9px at 32% 66%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 6px 5px at 49% 53%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 7px 7px at 65% 76%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 79% 39%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 4px 8px at 91% 69%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 6px 9px at 2% 49%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 5px 5px at 43% 96%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 7px 5px at 72% 23%, #d4a017 90%, transparent 91%), radial-gradient(ellipse 8px 6px at 8% 99%, #d4a017 90%, transparent 91%), #8B4513",
    photo: "jungle-woman.jpg",
    videos: ["6e7FcaslnIo", "gdOYftXXMNs"],
    bio: "A wild heel character from the Amazon, Jungle Woman came to the ring armed with an oversized club and her feral Nature Boy (played by Tony Cimber) she led on a leash. Jungle Woman had a heated rivalry with Tina Ferrari, who at one point stole Nature Boy from her. Known for climbing and clawing her opponents.",
    quote: "Tina Ferrari sounds like every Beverly Hills woman -- always trying to steal another woman's man. But she's not coming near my Nature Boy, because he's my property.",
    finishers: ["Clawing"],
  },
  {
    id: "justice",
    name: "Justice",
    real: "Narice Crockett",
    years: "1988–1990",
    role: "Face — Crimebuster",
    initials: "JU",
    color: "#1976d2",
    photo: "justice.jpg",
    videos: ["orocOrY-UgU", "mOA5rmHu-rk"],
    bio: "An ex-cop from Harlem, Justice was a tall, intimidating, law-and-order-themed face active during GLOW's third and fourth seasons. She and Liberty also formed an All-American tag team, dishing out American strength on their opponents.",
    quote: "Law and order is my game, I'm here to teach you all the same.",
    finishers: [],
  },
  {
    id: "liberty",
    name: "Liberty",
    real: "Penny Johnson",
    years: "1988, 1992",
    role: "Face — Sweet Lady Liberty",
    initials: "LB",
    color: "#0d47a1",
    colorRing: "radial-gradient(circle, #ffffff 2px, transparent 3px) 0 0 / 14px 14px, radial-gradient(circle, #ffffff 1px, transparent 2px) 7px 7px / 14px 14px, #0d47a1",
    photo: "liberty.jpg",
    videos: ["U9lcyn8Hl7c", "Y_DDidDBW3k"],
    bio: "A patriotic character who entered the arena dressed as Lady Liberty from GLOW's third season, Liberty teamed with Justice as the All-American tag team duo.",
    finishers: [],
  },
  {
    id: "little-egypt",
    name: "Little Egypt",
    real: "Angelina Altishin",
    years: "1986–1987",
    role: "Face — Belly Dancer",
    initials: "LE",
    color: "#ffab00",
    photo: "little-egypt.jpg",
    videos: ["N4nXNNKI9m4", "DSnOBVkMZps"],
    bio: "A beloved belly-dancer themed wrestler of Stallone's Sweethearts, Little Egypt's career was cut short by a torn ACL suffered in a match against the Heavy Metal Sisters — but she solidified 2 memorable seasons in GLOW. She later returned for the promotion's reunion specials and documentary.",
    quote: "When Spanish Red dies, they'll bury her face down, so that she can see where she's going!",
    finishers: [],
  },
  {
    id: "little-feather",
    name: "Little Feather",
    real: "Kuno",
    years: "1986",
    role: "Face",
    initials: "LF",
    color: "#8d6e63",
    photo: "little-feather.jpg",
    videos: ["DFoKzA_qNdo", "zH1pofsylU4"],
    bio: "From Wounded Knee, South Dakota, Little Feather was a Native American-themed face from GLOW's first season. She joined the roster after the original lineup and appeared regularly in tag team action throughout Season 1.",
    quote: "I'm Little Feather and I'm no squaw. I am a mighty warrior. I am the daughter of the land, the ring is where I make my stand.",
    finishers: [],
  },
  {
    id: "little-fiji",
    name: "Little Fiji",
    real: "Theresa Woo",
    years: "1986–1988",
    role: "Face",
    initials: "LFJ",
    color: "#e65100",
    colorRing: "conic-gradient(#e65100 0deg 90deg, #c62828 90deg 180deg, #e65100 180deg 270deg, #c62828 270deg 360deg)",
    photo: "little-fiji.jpg",
    videos: ["K_cZxXWl8k4", "GsBsONkHm_s"],
    bio: "The much smaller sister of Mt. Fiji, Little Fiji frequently found herself in over her head — only for big sister Mt. Fiji to come charging in to her rescue. Little Fiji's own rap even referenced calling on her big sister when things got tough, and Mt. Fiji became virtually unstoppable whenever she was fighting to protect her.",
    quote: "Adore and Envy (Soul Patrol) call me the runt of GLOW, because I weigh barely 100 pounds.",
    finishers: [],
  },
  {
    id: "magnolia",
    name: "Magnolia the Southern Belle",
    real: "Unknown",
    years: "1987",
    role: "Face — Southern Belle",
    initials: "MG",
    color: "#c3beb4",
    colorRing: "conic-gradient(from 220deg, #c8c3b9, #c3beb4 15%, #c8c3b9 35%, #beb9af 55%, #c8c3b9 70%, #c3beb4 90%, #c8c3b9)",
    photo: "magnolia.jpg",
    videos: [],
    bio: "Magnolia the Southern Belle had a short-lived experience in GLOW while debuting late in Season 2. She teamed up with Tara, as the Belles battled the Russians (Ninotchka & Tanya) in a tag team match.",
    finishers: [],
    noSecondPhoto: true,
  },
  {
    id: "headhunters",
    name: "The Headhunters (Mika, Mina & Mana)",
    real: "Myra Singleton & others",
    years: "1986–1987",
    role: "Heel — Tribal Trio",
    initials: "HH",
    color: "#9e9e9e",
    colorRing: "repeating-conic-gradient(#5d3a1a 0deg 45deg, #9e9e9e 45deg 90deg)",
    photo: "headhunters.jpg",
    videos: ["wqwLLgYZIXE", "B_c8qgkE1SE"],
    bio: "A trio of cannibal heels from the Pacific Islands during GLOW's early seasons, the Headhunters brought an uncivilized ferocity to Kitty's Killers. Mika and Mina fought as a tag team, while Mana mostly took part in solo matches. While Mika & Mina could speak, Mana couldn't — she was the most primal version of the trio and carried a spear.",
    finishers: ["Biting"],
  },
  {
    id: "olympia",
    name: "Olympia",
    real: "Debbie Pavlica",
    years: "1986",
    role: "Face — Bodybuilder",
    initials: "OL",
    color: "#fbc02d",
    photo: "olympia.jpg",
    videos: ["a0GMBVZCUI0", "Sox7p8iHMQo"],
    bio: "A muscular standout from GLOW's first season, Olympia showed an impressive physique, bringing classical strength and power to Stallone's Sweethearts and the original roster of wrestlers.",
    quote: "If Jungle Woman wants to bite and claw me, I'll just pick her up. I'll pick her up and throw her on the mat. And if that's not good enough for her, I'll pick her up again and throw her out of the ring.",
    finishers: [],
  },
  {
    id: "pepper",
    name: "Salt and Pepper",
    real: "Cynthia Peretti (1948–2009) & Charli Haynes",
    years: "1986",
    role: "Face — Tag Team",
    initials: "SP",
    color: "#757575",
    photo: "salt-and-pepper.jpg",
    videos: ["kGCqfsmzg0U"],
    bio: "Announced as 'Salt and Pepper,' this short-lived tag team made their one and only match appearance in GLOW's Season 1 premiere against Sara and Mabel. Pepper (Cynthia Peretti) was a veteran professional wrestler known outside GLOW as Princess Jasmine, brought in by David McLane to train the original roster before stepping into the ring herself.",
    finishers: [],
    noSecondPhoto: true,
  },
  {
    id: "princess-of-darkness",
    name: "Princess of Darkness",
    real: "Janet Bowers / Ursula Hayden",
    years: "1986–1987",
    role: "Heel — Sorceress",
    initials: "PD",
    color: "#1a1a1a",
    photo: "princess-of-darkness.jpg",
    videos: ["TxL1wPEgF5Y", "yqGpmebskMY"],
    bio: "Princess of Darkness was an evil figure who hypnotized and controlled her opponents while waving around her magic bone wand. She was portrayed by two different performers, the latter being Ursula Hayden.",
    quote: "Let them wail, and let them scream, but Princess of Darkness will reign supreme!",
    finishers: ["Black Magic"],
  },
  {
    id: "queenie",
    name: "Queenie",
    real: "Unknown",
    years: "1987",
    role: "Face",
    initials: "QN",
    color: "#ad1457",
    photo: "queenie.jpg",
    videos: ["U1bKHJp2vek"],
    bio: "Queenie was a stylishly dressed Face character who teamed up with Sunny for a tag team match against Hollywood and Vine — the only known footage of her wrestling in GLOW. Introduced as 'Ms. Tennessee herself, the beautiful Queenie'.",
    finishers: [],
    noSecondPhoto: true,
  },
  {
    id: "royal-hawaiian",
    name: "The Royal Hawaiian",
    real: "April Hom",
    years: "1986",
    role: "Heel — Island Crusher",
    initials: "RH",
    color: "#00897b",
    photo: "royal-hawaiian.jpg",
    videos: ["SYaH5YVUF1g", "yt4K8Osib6A"],
    bio: "A mean, tough heel from GLOW's debut season, The Royal Hawaiian was a GLOW Champion early on after defeating Tammy Jones. The Hawaiian had a short but successful career in GLOW Wrestling, before departing after Season 1.",
    quote: "You're gonna want me to send her flowers? When she dies, when I'm through with her -- I'll send her flowers, maybe.",
    finishers: ["Hawaiian Crush"],
  },
  {
    id: "scarlet",
    name: "Scarlet the Southern Belle",
    real: "Janice Flynn",
    years: "1986",
    role: "Face — Southern Belle",
    initials: "SC",
    color: "#81d4fa",
    photo: "scarlet.jpg",
    videos: ["J1U0hgM249U", "-LTHIRcI19Y"],
    bio: "From Charlotte, NC, Scarlet brought antebellum charm to the ring during the show's first season. Her and Tara teamed up as the 'Southern Belles' in many tag team matches.",
    finishers: [],
  },
  {
    id: "sneaky",
    name: "Sneaky",
    real: "Unknown",
    years: "1988–1989",
    role: "Heel",
    initials: "SN",
    color: "#37474f",
    colorRing: "radial-gradient(circle, #fdd835 35%, transparent 36%) 0 0 / 18px 18px, #1a1a1a",
    photo: "sneaky.jpg",
    videos: ["skUddAu4xvY", "gpCXzfCPs1c"],
    bio: "The Brooklyn punk heel was a cunning, underhanded wrestler active during GLOW's third and fourth seasons, Sneaky lived up to her name as a sidekick to Stinky.",
    finishers: [],
  },
  {
    id: "soul-patrol",
    name: "The Soul Patrol (Envy & Adore)",
    real: "Carmen Campbell & Sharon Lacey",
    years: "1986–1987",
    role: "Heel — Tag Team",
    initials: "SP",
    color: "#6a1b9a",
    photo: "soul-patrol.jpg",
    videos: ["st8Tx6qlT3I", "BTVA8pe_iv8"],
    bio: "From the streets of Chicago, Soul Patrol were an attitude-heavy tag team from GLOW's first two seasons. Envy & Adore dominated their opponents using street-tough dirty tricks — even wielding nunchakus. They also shared a skit during Season 2 called Hip Dictionary.",
    quote: "We be out for kicks-- and your butt's in the way!",
    finishers: ["Street Weapons"],
  },
  {
    id: "spanish-red",
    name: "Spanish Red",
    real: "Ericka Marr",
    years: "1986–1987",
    role: "Heel — The Latin Terror",
    initials: "SR",
    color: "#7f0000",
    photo: "spanish-red.jpg",
    videos: ["XpvI4fvB_HU", "B3xw_rXZ58Q"],
    bio: "From Latin America, and a fiery heel whose trademark was tossing out roses to the audience — Spanish Red was a popular villain who had a memorable moment in Season 2 defending the American flag against Palestina — and briefly turning face in the process. She'd revert her ways and attack her own partner Ashley Cartier in a handicap match not long after.",
    quote: "She is just a little bit too conceited for me [...] And nobody fools with me, baby — not you, Debbie Debutante! Ha!",
    finishers: ["Spanish Press"],
  },
  {
    id: "star",
    name: "Star",
    real: "Suzanne Duplessis",
    years: "1988–1990",
    role: "Heel — Under a Bad Sign",
    initials: "ST",
    color: "#b39ddb",
    photo: "star.jpg",
    videos: ["VUp94hdzv40", "kCwzn5BaZ9w"],
    bio: "From the far reaches of the galaxy, Star was the GLOW girl of the cosmos, and stylish zodiac heel — making her GLOW debut in Season 3. Before starting the match, her gimmick was to predict doom for her opponents in the ring.",
    quote: "Star knows the cosmic path, cross me, you feel my wrath.",
    finishers: [],
  },
  {
    id: "the-showgirls",
    name: "The Showgirls (Bambi & Babette)",
    real: "Unknown",
    years: "1987",
    role: "Heel — Tag Team",
    initials: "SG",
    color: "#880e4f",
    colorRing: "conic-gradient(from 220deg, #880e4f, #880e4fee 15%, #880e4f 35%, #880e4fdd 55%, #880e4fee 70%, #880e4f 90%, #880e4f)",
    photo: "the-showgirls.jpg",
    videos: [],
    bio: "The Showgirls made their one and only appearance in GLOW's second season, debuting against Hollywood & Vine. Bambi and Babette were actually men disguised as women — a secret revealed by the match's finish, which brought their brief GLOW career to an abrupt and memorable end.",
    quote: "We just wanted to get close to our favorite wrestlers.",
    finishers: [],
  },
  {
    id: "stinky",
    name: "Stinky",
    real: "Michelle Javas",
    years: "1988–1989",
    role: "Heel — Skunk",
    initials: "SK",
    color: "#558b2f",
    colorRing: "radial-gradient(circle closest-side, transparent 86%, rgba(93,64,28,0.15) 87%, rgba(93,64,28,0.4) 89%, rgba(93,64,28,0.65) 91%, rgba(62,43,19,0.75) 93%, rgba(93,64,28,0.5) 95%, rgba(93,64,28,0.25) 97%, transparent 99%), repeating-conic-gradient(#000000 0deg 8deg, #ffffff 8deg 16deg, #000000 16deg 28deg, #ffffff 28deg 34deg, #000000 34deg 45deg, #ffffff 45deg 51deg, #000000 51deg 61deg, #ffffff 61deg 65deg)",
    photo: "stinky.jpg",
    videos: ["uvjsLUc0gq8", "9YJD_D6JfSo"],
    bio: "The smelliest of GLOW characters, the heel Stinky wore a skunky hairstyle while emitting a foul odor on her opponents.",
    quote: "We're gonna make you a molehill, Mountain Fiji.",
    finishers: [],
  },
  {
    id: "sugar",
    name: "Sugar",
    real: "Michelle Duze",
    years: "1987",
    role: "Face — Southern Girl",
    initials: "SG",
    color: "#f06292",
    photo: "sugar.jpg",
    videos: [],
    bio: "From New Orleans, LA, Sugar brought Southern sweetness and great skill to the GLOW roster, making her debut in Season 2 against Attaché. After being burned in the face by Spike's blowtorch in a tag team match, Sugar was forced to wrestle using a mask for her later matches.",
    quote: "With all of your support and the love of God, I hope that I'll make it through this and someday be back again without my mask.",
    finishers: [],
  },
  {
    id: "sunny",
    name: "Sunny",
    real: "Patricia Summerland",
    years: "1988",
    role: "Face — California Girl",
    initials: "SY",
    color: "#fbc02d",
    photo: "sunny.jpg",
    videos: ["UdI4e5uHqI4", "8U3tdDMt3No"],
    bio: "From Newport Beach, CA, Sunny was an upbeat GLOW face with a tall figure who always had a knock-knock joke for Johnny C. Sunny joined GLOW's roster in the third season, typically carrying a surfboard or frisbee on her way to the stage.",
    finishers: [],
  },
  {
    id: "susie-spirit",
    name: "Susie Spirit",
    real: "Lauri Thompson",
    years: "1986–1987",
    role: "Face — Cheerleader",
    initials: "SS",
    color: "#e65100",
    colorRing: "repeating-conic-gradient(#c62828 0deg 25deg, #ff6f00 25deg 30deg)",
    photo: "susie-spirit.jpg",
    videos: ["kxWui3zxTfU", "tx5sU6moFIc"],
    bio: "A cheerleader-themed character, and one part of the Cheerleaders tag team alongside Debbie Debutante, Susie Spirit's career was painfully interrupted when the Headhunters inflicted a serious elbow injury to her in a tag team match with partner Debutante — but Susie's comeback was remarkable. She returned to the ring still wearing an arm brace in a match vs. Attaché — and even took on the third Headhunter, Mana. Afterwards, she briefly teamed up with Americana to make 'The All-Americans'. Susie was played by Lauri Thompson — the lead dancer at the Tropicana's Folies Bergère who helped recruit many of the show's other performers.",
    quote: "I love creating excitement and good sportsmanship.",
    finishers: ["Split Crush"],
  },
  {
    id: "tammy-jones",
    name: "Tammy Jones",
    real: "Tammy D'Amato",
    years: "1986",
    role: "Face — Child",
    initials: "TJ",
    color: "#0288d1",
    photo: "tammy-jones.jpg",
    videos: ["uQnqsBK63-g", "cflrCF7c0YQ"],
    bio: "Tammy Jones played a childlike caricature — complete with puffy pigtails, lollipops, and an innocent high-pitched voice — while tossing candy out to the audience, making her one of the more sympathetic fan favorites. She was GLOW's first-ever champion, defeating Matilda the Hun in the TV pilot episode.",
    quote: "I like lollipops and ice cream cones. I'm a little mini with a lot of might, don't pick on me cause this kid can fight.",
    finishers: [],
  },
  {
    id: "tara-southern-belle",
    name: "Tara the Southern Belle",
    real: "Sheila Best",
    years: "1986–1987",
    role: "Face — Southern Belle",
    initials: "TB",
    color: "#c62828",
    photo: "tara-southern-belle.jpg",
    videos: ["2CdR2SydrZU", "J1U0hgM249U"],
    bio: "Another of GLOW's recurring 'Southern Belle' characters, Tara was a striking beauty who brought genteel charm to the early seasons of the promotion. She regularly teamed with Scarlet as the Southern Belles tag team.",
    quote: "Vine was always an honor student. She was always saying, 'Yes, your Honor, no, your Honor.'",
    finishers: [],
  },
  {
    id: "thunderbolt",
    name: "Thunderbolt",
    real: "Dana Felton Howard",
    years: "1988",
    role: "Face — Superhero",
    initials: "TH",
    color: "#0d47a1",
    colorRing: "repeating-conic-gradient(#ffffff 0deg 20deg, #0d47a1 20deg 40deg)",
    photo: "thunderbolt.jpg",
    videos: ["Lm6iVRdi_jY", "M00J_MPYRBQ"],
    bio: "A high-energy face from GLOW's third season, Thunderbolt formed the tag team duo The Superheroes alongside Lightning. The 2 GLOW wrestlers were outsized nearly every match but made up for it with agility and high flying skills.",
    quote: "My opponents hit the floor, as soon as they feel thunder roar.",
    finishers: ["Flying Splash"],
  },
  {
    id: "tulsa",
    name: "Tulsa",
    real: "Jody Haselbarth",
    years: "1988–1990, 1992",
    role: "Face — Rodeo Queen",
    initials: "TL",
    color: "#ffeb3b",
    colorRing: "radial-gradient(circle, transparent 55%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.95) 85%, rgba(255,255,255,0.8) 100%), conic-gradient(from 220deg, #ffeb3b, #ffeb3bee 15%, #ffeb3b 35%, #ffeb3bdd 55%, #ffeb3bee 70%, #ffeb3b 90%, #ffeb3b)",
    photo: "tulsa.jpg",
    videos: ["HHmqr2ERqFA", "fLsU1FScMoc"],
    bio: "A sassy Oklahoma lass who carried a rope to the stage, Tulsa was active across GLOW's second through fourth seasons as an interim and recurring roster member.",
    quote: "Look at her sitting up there like the tramp she is... See they know Hollywood. They know you're queen of the back alley.",
    finishers: [],
  },
  {
    id: "vicky-victory",
    name: "Vicky Victory",
    real: "Peach Janae",
    years: "1988–1989",
    role: "Face — Cheerleader",
    initials: "VV",
    color: "#e8e8e8",
    colorRing: "repeating-conic-gradient(#c62828 0deg 30deg, #fdd835 30deg 33deg)",
    photo: "vicky-victory.jpg",
    videos: ["fqdJsX8X2Qk", "Q0pPdbG5Ql4"],
    bio: "Debuting in GLOW's 3rd Season, Vicky Victory was taken under the wing of Susie Spirit and Debbie Debutante to be the next Cheerleader — Vicky showed off her impressive acrobatic skills and passion for cheerleading in the ring.",
    quote: "Mirror, Mirror, on the wall, we both know I'm the fairest girl in GLOW.",
    finishers: ["Split Splash"],
  },
  {
    id: "the-widow",
    name: "The Widow",
    real: "Nancy Daly",
    years: "1988–1990",
    role: "Heel — Woman in Black",
    initials: "WD",
    color: "#212121",
    photo: "the-widow.jpg",
    videos: ["Q9jxvb9z18Q", "odG34jfKSC8"],
    bio: "Also known as Dementia #2, the psychotic heel supposedly switched personas to become The Widow (both characters played by Nancy Daly in the 3rd season), though unlike Dementia, The Widow speaks — and will poison her enemies.",
    quote: "When you marry me for better or worse, the honeymoon begins in my hearse.",
    finishers: ["Poison Cocktail"],
  },
  {
    id: "zelda-the-brain",
    name: "Zelda",
    real: "Marie Moore",
    years: "1988–1990, 1992",
    role: "Face — The Brain",
    initials: "ZB",
    color: "#4a148c",
    photo: "zelda-the-brain.jpg",
    videos: ["ujaw1z2OIiU", "ljzH2AiBun8"],
    bio: "A bookish, nerdy underdog, Zelda used clever tactics to take on bigger opponents, often turning brains into advantage. Zelda showed off her wit in the ring by beating Major Tanya in 3 moves at chess — and proceeded to get smashed over the chess table by the Russian.",
    quote: "I know the Russians are great chess players, but I feel Tanya will be a pawn in my hand.",
    finishers: [],
  },
  {
    id: "terminator",
    name: "The Terminator",
    real: "Unknown",
    years: "1986",
    role: "Face — From Outer Space",
    initials: "TM",
    color: "#c0c0c0",
    colorRing: "conic-gradient(from 220deg, #e5e4e2, #c0c0c0 15%, #e8e8e8 35%, #a9a9a9 55%, #e5e4e2 70%, #c0c0c0 90%, #e5e4e2)",
    photo: "terminator.jpg",
    videos: [],
    bio: "When the lights began flickering during a tag team match between Sara & Mabel vs. Ebony & Little Feather, an obscure female character named The Terminator entered the room and rushed the ring. The silvery costumed hero ('From Outer Space,' as McLane described her) brought help to Stallone's Sweethearts and wailed on the backwoods duo. There's not much information on this mysterious GLOW figure.",
    finishers: [],
  },
  {
    id: "party-animal",
    name: "Party Animal",
    real: "Cheryl Rusa",
    years: "1992",
    role: "Heel",
    initials: "PA",
    color: "#8d2c0a",
    photo: "party-animal.jpg",
    videos: [],
    bio: "Party Animal was a one-off character brought to the ring by Hollywood — portrayed by Cheryl Rusa (previously known as Lightning) — during GLOW's 1992 PPV reunion event, wrestling against Babe the Farmer's Daughter.",
    finishers: [],
    noSecondPhoto: true,
  },
];

/* Sort alphabetically by display name for the directory grid */
const SORTED_WRESTLERS = [...WRESTLERS].sort((a, b) =>
  a.name.localeCompare(b.name)
);

/* ----------------------------------------------------------------
   KEY FIGURES — Referees, managers, hosts & announcers
   Shown in their own row above the wrestler roster, in a fixed
   (non-alphabetical) order. Uses the same shape as a wrestler entry
   so the existing bio page can display them without changes.
   ---------------------------------------------------------------- */
const KEY_FIGURES = [
  {
    id: "david-mclane",
    name: "David McLane",
    real: "David B. McLane",
    years: "1986–1987, 1992",
    role: "Ring Announcer & Host",
    initials: "DM",
    color: "#000000",
    photo: "david-mclane.jpg",
    videos: [],
    bio: "The founder of GLOW, David McLane served as the show's ring announcer and on-air host during its early seasons, having gotten his start as an announcer for Dick the Bruiser's WWA promotion in Indianapolis before bringing the concept of an all-women's wrestling show to Las Vegas. McLane made his return for the 1992 PPV event in a last ditch effort to revive the company.",
    quote: "Excuse me for a minute, fans. I've gotta wipe the mustard off my face... Vine and Hollywood went a little too far there -- sticking that hotdog right in my face.",
    finishers: [],
  },
  {
    id: "aunt-kitty",
    name: "Aunt Kitty",
    real: "Kitty Burke Municino (1926-2012)",
    years: "1986–1990",
    role: "Manager — Heel Faction",
    initials: "AK",
    color: "#7a1f3d",
    photo: "aunt-kitty.jpg",
    videos: [],
    bio: "Aunt Kitty managed GLOW's villainous faction — Kitty's Killers — guiding the promotion's heels with a scheming, no-nonsense attitude that made her one of the show's most memorable non-wrestling personalities. Her presence was always known as she'd stay ringside cheering on her Killers.",
    quote: "I had these funny little things I thought were baby chestnuts, or something... but they were actually shrunken rats heads! Mana left them all around my apartment.",
    finishers: [],
  },
  {
    id: "jackie-stallone",
    name: "Jackie Stallone",
    real: "Jacqueline Stallone",
    years: "1986–1990, 1992",
    role: "Owner & Manager — Face Faction",
    initials: "JS",
    color: "#b8860b",
    photo: "jackie-stallone.jpg",
    videos: [],
    bio: "Mother of actor Sylvester Stallone, Jackie Stallone served as GLOW's storyline owner and manager of Stallone's Sweethearts. Stallone had been promoting a physical fitness gym for women when David McLane brought her onto GLOW.",
    quote: "I always told my son Sylvester Stallone, 'Win, but win the right way!' Look where it got him!",
    finishers: [],
  },
  {
    id: "johnny-cafarella",
    name: "Johnny C.",
    real: "Johnny Cafarella",
    years: "1988–1990",
    role: "Ring Announcer & Figurehead Owner",
    initials: "JC",
    color: "#1d4e89",
    photo: "johnny-cafarella.jpg",
    videos: [],
    bio: 'Known on-air as "Johnny C.", Johnny Cafarella took over as GLOW\'s ring announcer for the show\'s later seasons and played the storyline figurehead owner, also serving as the company\'s real-life manager after David McLane\'s departure.',
    quote: "Hello Dad, we didn't make any money tonight. -- but maybe if you stop hanging up on me, we could talk about... hello... hello!? Dad!?",
    finishers: [],
  },
  {
    id: "steve-blance",
    name: "Steve Blance",
    real: "Steve Blance",
    years: "1987–1990",
    role: "Senior Referee & Commissioner",
    initials: "SB",
    color: "#444444",
    photo: "steve-blance.jpg",
    videos: [],
    bio: "Steve Blance took over as GLOW's senior referee starting in Season 2, before being promoted to the storyline role of commissioner in the show's final seasons, becoming a recurring on-screen target of the GLOW Girls along the way. Blance was also one of the show's writers, credited on the pilot episode alongside David McLane.",
    quote: "Nothing else I know weighs heavier in your mind than having Mt. Fiji landing on top of your head.",
    finishers: [],
  },
  {
    id: "dr-grope",
    name: "Dr. Grope",
    real: "Unknown",
    years: "1986–1990",
    role: "Skit Physician",
    initials: "DG",
    color: "#1b5e20",
    photo: "dr-grope.jpg",
    videos: [],
    bio: "Dr. Grope was the GLOW physician, appearing in recurring comedic skits between matches. His office opened with the title card 'Drs. Fiel and Grope — Gynecology, Plastic Surgery, Psychiatry,' the location of the skit's setup and punchline between the doctor and his GLOW patient. Dr. Grope would last the entire run of the series.",
    quote: "I love my job and would happily do it even if I wasn't socking away huge chunks of cash and insurance money. My partner, Dr. Fiel, feels the same way.",
    finishers: [],
  },
  {
    id: "sir-miles-headlock",
    name: "Sir Miles Headlock",
    real: "Douglas Dunning",
    years: "1987",
    role: "Commentator",
    initials: "MH",
    color: "#006064",
    photo: "sir-miles-headlock.jpg",
    videos: [],
    bio: "A Max Headroom-style computer-generated British character played by Douglas Dunning, Sir Miles Headlock was billed as the first computerized commentator in history. He would interview GLOW wrestlers before matches and provide commentary, usually paired with a GLOW wrestler as co-commentator throughout Season 2.",
    quote: "Greetings, Sir Miles Headlock here with more GLOW gossip. People wonder why I'm privy to all the current information. I guess it's because I'm a real live wire.",
    finishers: [],
  },
  {
    id: "frank-damato",
    name: "Frank D'Amato",
    real: "Frank D'Amato",
    years: "1986–1987",
    role: "Senior Referee",
    initials: "FD",
    color: "#37474f",
    photo: "frank-damato.jpg",
    videos: [],
    noVideoSection: true,
    bio: "Frank D'Amato served as GLOW's senior referee during its first season, officiating matches from the very first episode. He was married in real life to Tammy D'Amato, who played the character Tammy Jones — GLOW's first-ever champion. D'Amato came back to ref the GLOW Games in Season 2.",
    finishers: [],
  },
  {
    id: "mike-morgan",
    name: "Mike Morgan",
    real: "Mike Morgan",
    years: "1987–1990",
    role: "Play-by-Play Announcer",
    initials: "",
    color: "#1565c0",
    colorRing: "conic-gradient(from 220deg, #0a2e6e, #0d3b8a 15%, #0a2e6e 35%, #071f4f 55%, #0a2e6e 70%, #0d3b8a 90%, #0a2e6e)",
    innerColor: "#000000",
    noPhoto: true,
    photo: "mike-morgan.jpg",
    videos: [],
    noVideoSection: true,
    bio: "'Motormouth' Mike Morgan debuted as GLOW's play-by-play voice in the middle of Season 2 and became the permanent voice of the matches by Season 3. He was known for his colorful, Howard Cosell-style delivery and entertaining roasting of the wrestlers.",
    quote: "Welcome back GLOW fans. Motormouth Mike Morgan here with the moves and maneuvers manual.",
    finishers: [],
    noSecondPhoto: true,
  },
];

/* ----------------------------------------------------------------
   PHOTOS — drop your own images in here.
   -----------------------------------------------------------------
   Each wrestler above has a `photo` field like "ninotchka.jpg".
   To add a real photo for a wrestler:
     1. Get the image as a URL (upload somewhere and copy the link,
        or use a base64 data URL).
     2. Add an entry below using that SAME filename as the key.
   Wrestlers with no entry here automatically fall back to the
   colored initials medallion, so you can fill these in gradually —
   nothing breaks if a photo is missing.

   Example:
     "ninotchka.jpg": "https://your-image-host.com/ninotchka.jpg",
   ---------------------------------------------------------------- */
const PHOTOS = {
  "americana.jpg": "/images/americana.jpg",
  "terminator.jpg": "/images/terminator.jpg",
  "party-animal.jpg": "/images/party-animal.jpg",
  "amy-the-farmers-daughter.jpg": "/images/amy-the-farmers-daughter.jpg",
  "angel.jpg": "/images/angel.jpg",
  "ashley-cartier.jpg": "/images/ashley-cartier.jpg",
  "attache.jpg": "/images/attache.jpg",
  "babe-the-farmers-daughter.jpg": "/images/babe-the-farmers-daughter.jpg",
  "david-mclane.jpg": "/images/david-mclane.jpg",
  "aunt-kitty.jpg": "/images/aunt-kitty.jpg",
  "jackie-stallone.jpg": "/images/jackie-stallone.jpg",
  "johnny-cafarella.jpg": "/images/johnny-cafarella.jpg",
  "steve-blance.jpg": "/images/steve-blance.jpg",
  "dr-grope.jpg": "/images/dr-grope.jpg",
  "sir-miles-headlock.jpg": "/images/sir-miles-headlock.jpg",
  "the-showgirls.jpg": "/images/the-showgirls.jpg",
  "frank-damato.jpg": "/images/frank-damato.jpg",
  "mike-morgan.jpg": "/images/mike-morgan.jpg",
  "heavy-metal-spike.jpg": "/images/heavy-metal-spike.jpg",
  "heavy-metal-chainsaw.jpg": "/images/heavy-metal-chainsaw.jpg",
  "beastie.jpg": "/images/beastie.jpg",
  "big-bad-mama.jpg": "/images/big-bad-mama.jpg",
  "broadway-rose.jpg": "/images/broadway-rose.jpg",
  "brunhilda.jpg": "/images/brunhilda.jpg",
  "california-doll.jpg": "/images/california-doll.jpg",
  "cheyenne-cher.jpg": "/images/cheyenne-cher.jpg",
  "corporal-kelly.jpg": "/images/corporal-kelly.jpg",
  "daisy.jpg": "/images/daisy.jpg",
  "dallas.jpg": "/images/dallas.jpg",
  "debbie-debutante.jpg": "/images/debbie-debutante.jpg",
  "dementia.jpg": "/images/dementia.jpg",
  "draculetta.jpg": "/images/draculetta.jpg",
  "ebony.jpg": "/images/ebony.jpg",
  "evangelina.jpg": "/images/evangelina.jpg",
  "godiva.jpg": "/images/godiva.jpg",
  "gremlina.jpg": "/images/gremlina.jpg",
  "habana.jpg": "/images/habana.jpg",
  "headhunters.jpg": "/images/headhunters.jpg",
  "hollywood.jpg": "/images/hollywood.jpg",
  "housewife-arlene.jpg": "/images/housewife-arlene.jpg",
  "housewife-phyllis.jpg": "/images/housewife-phyllis.jpg",
  "jailbait.jpg": "/images/jailbait.jpg",
  "jungle-woman.jpg": "/images/jungle-woman.jpg",
  "justice.jpg": "/images/justice.jpg",
  "liberty.jpg": "/images/liberty.jpg",
  "lightning.jpg": "/images/lightning.jpg",
  "little-egypt.jpg": "/images/little-egypt.jpg",
  "little-feather.jpg": "/images/little-feather.jpg",
  "little-fiji.jpg": "/images/little-fiji.jpg",
  "magnolia.jpg": "/images/magnolia.jpg",
  "major-tanya.jpg": "/images/major-tanya.jpg",
  "matilda-the-hun.jpg": "/images/matilda-the-hun.jpg",
  "melody-trouble-vixen.jpg": "/images/melody-trouble-vixen.jpg",
  "mt-fiji.jpg": "/images/mt-fiji.jpg",
  "ninotchka.jpg": "/images/ninotchka.jpg",
  "olympia.jpg": "/images/olympia.jpg",
  "palestina.jpg": "/images/palestina.jpg",
  "pepper.jpg": "/images/pepper.jpg",
  "princess-of-darkness.jpg": "/images/princess-of-darkness.jpg",
  "queenie.jpg": "/images/queenie.jpg",
  "roxy-astor.jpg": "/images/roxy-astor.jpg",
  "royal-hawaiian.jpg": "/images/royal-hawaiian.jpg",
  "sally-the-farmers-daughter.jpg": "/images/sally-the-farmers-daughter.jpg",
  "salt.jpg": "/images/salt.jpg",
  "salt-and-pepper.jpg": "/images/salt-and-pepper.jpg",
  "scarlet.jpg": "/images/scarlet.jpg",
  "shannon-obrien.jpg": "/images/shannon-obrien.jpg",
  "sneaky.jpg": "/images/sneaky.jpg",
  "soul-patrol.jpg": "/images/soul-patrol.jpg",
  "spanish-red.jpg": "/images/spanish-red.jpg",
  "star.jpg": "/images/star.jpg",
  "stinky.jpg": "/images/stinky.jpg",
  "sugar.jpg": "/images/sugar.jpg",
  "sunny.jpg": "/images/sunny.jpg",
  "susie-spirit.jpg": "/images/susie-spirit.jpg",
  "tammy-jones.jpg": "/images/tammy-jones.jpg",
  "tara-southern-belle.jpg": "/images/tara-southern-belle.jpg",
  "the-hicks.jpg": "/images/the-hicks.jpg",
  "the-widow.jpg": "/images/the-widow.jpg",
  "thunderbolt.jpg": "/images/thunderbolt.jpg",
  "tiffany-mellon.jpg": "/images/tiffany-mellon.jpg",
  "tina-ferrari.jpg": "/images/tina-ferrari.jpg",
  "tulsa.jpg": "/images/tulsa.jpg",
  "vicky-victory.jpg": "/images/vicky-victory.jpg",
  "vine.jpg": "/images/vine.jpg",
  "zelda-the-brain.jpg": "/images/zelda-the-brain.jpg",
};

function getPhotoUrl(wrestler) {
  if (wrestler.noPhoto) return null;
  return PHOTOS[wrestler.photo] || null;
}

/* ----------------------------------------------------------------
   Decorative chrome/foil ring-rope divider used in a few spots
   ---------------------------------------------------------------- */
function RopeDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 6,
        borderRadius: 999,
        margin: "0 auto",
        width: "100%",
        background:
          "linear-gradient(90deg, transparent, #ff3d9a 10%, #ffd4ec 50%, #ff3d9a 90%, transparent)",
        boxShadow: "0 0 12px rgba(255,61,154,0.7), 0 0 2px rgba(255,255,255,0.8)",
      }}
    />
  );
}

/* ----------------------------------------------------------------
   Wrestler portrait "icon" — initials medallion w/ shiny ring
   ---------------------------------------------------------------- */
function WrestlerIcon({ wrestler, size = 120 }) {
  const photoUrl = getPhotoUrl(wrestler);

  if (photoUrl) {
    return (
      <div
        style={{
          width: size + 14,
          height: size + 14,
          borderRadius: "50%",
          position: "relative",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: wrestler.colorRing || `conic-gradient(from 220deg, ${wrestler.color}, ${wrestler.color}ee 15%, ${wrestler.color} 35%, ${wrestler.color}dd 55%, ${wrestler.color}ee 70%, ${wrestler.color} 90%, ${wrestler.color})`,
          boxShadow: `
            0 6px 14px rgba(0,0,0,0.4),
            inset 0 1px 2px rgba(255,255,255,0.3),
            inset 0 -2px 3px rgba(0,0,0,0.25)
          `,
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            position: "relative",
            flexShrink: 0,
            overflow: "hidden",
            boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.35)",
          }}
        >
          <img
            src={photoUrl}
            alt={wrestler.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
            onError={(e) => {
              // If the URL is broken, hide the broken image so the
              // surrounding ring still looks intentional rather than
              // showing a broken-image icon.
              e.currentTarget.style.display = "none";
            }}
          />
          {/* subtle top-edge highlight */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              width: "80%",
              height: "18%",
              borderRadius: "50% 50% 0 0",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0))",
              filter: "blur(2px)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: size + 14,
        height: size + 14,
        borderRadius: "50%",
        position: "relative",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: wrestler.colorRing || `conic-gradient(from 220deg, ${wrestler.color}, ${wrestler.color}ee 15%, ${wrestler.color} 35%, ${wrestler.color}dd 55%, ${wrestler.color}ee 70%, ${wrestler.color} 90%, ${wrestler.color})`,
        boxShadow: `
          0 6px 14px rgba(0,0,0,0.4),
          inset 0 1px 2px rgba(255,255,255,0.3),
          inset 0 -2px 3px rgba(0,0,0,0.25)
        `,
      }}
    >
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        position: "relative",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: wrestler.innerColor
          ? wrestler.innerColor
          : `radial-gradient(circle at 32% 28%, ${wrestler.color}ee, ${wrestler.color}99 55%, #0a0e2a 100%)`,
        boxShadow: `
          inset 0 3px 5px rgba(255,255,255,0.2),
          inset 0 -5px 9px rgba(0,0,0,0.25)
        `,
      }}
    >
      {/* subtle top-edge highlight */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          width: "80%",
          height: "18%",
          borderRadius: "50% 50% 0 0",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0))",
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontWeight: 900,
          fontSize: size * 0.28,
          color: "#fff",
          textShadow: "0 2px 4px rgba(0,0,0,0.6), 0 0 18px rgba(255,255,255,0.25)",
          letterSpacing: 1,
        }}
      >
        {wrestler.initials}
      </span>
    </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Roster card — picture + name, clickable
   ---------------------------------------------------------------- */
function RosterCard({ wrestler, onSelect }) {
  return (
    <button
      onClick={() => onSelect(wrestler.id)}
      className="glow-roster-card"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "12px 6px",
        borderRadius: 16,
        transition: "transform 160ms ease, background 160ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "transparent";
      }}
      aria-label={`View ${wrestler.name}'s page`}
    >
      <div className="glow-roster-icon">
        <WrestlerIcon wrestler={wrestler} size={92} />
      </div>
      <span
        className="glow-roster-name"
        style={{
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontWeight: 700,
          fontSize: 12.5,
          color: "#ffe3f3",
          textAlign: "center",
          textShadow: "0 1px 3px rgba(0,0,0,0.6)",
          lineHeight: 1.25,
          maxWidth: 130,
        }}
      >
        {wrestler.name}
      </span>
    </button>
  );
}

function KeyFigureCard({ figure, onSelect }) {
  return (
    <button
      onClick={() => onSelect(figure.id)}
      className="glow-keyfigure-card"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "10px 6px",
        borderRadius: 14,
        transition: "transform 160ms ease, background 160ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "transparent";
      }}
      aria-label={`View ${figure.name}'s page`}
    >
      <div className="glow-keyfigure-icon">
        <WrestlerIcon wrestler={figure} size={72} />
      </div>
      <span
        style={{
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontWeight: 700,
          fontSize: 11,
          color: "#ffe3f3",
          textAlign: "center",
          textShadow: "0 1px 3px rgba(0,0,0,0.6)",
          lineHeight: 1.2,
          maxWidth: 110,
        }}
      >
        {figure.name}
      </span>
      <span
        style={{
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontWeight: 400,
          fontSize: 9.5,
          color: "#9aa6d6",
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: 110,
          letterSpacing: 0.2,
        }}
      >
        {figure.role}
      </span>
    </button>
  );
}

function KeyFiguresRow({ onSelect, factionFilter, yearFilter }) {
  const byFaction =
    factionFilter === "sweethearts"
      ? KEY_FIGURES.filter(f => f.id === "jackie-stallone")
      : factionFilter === "killers"
      ? KEY_FIGURES.filter(f => f.id === "aunt-kitty")
      : KEY_FIGURES;
  const figuresToShow =
    !yearFilter || yearFilter === "all"
      ? byFaction
      : byFaction.filter(f => getYears(f.years).includes(parseInt(yearFilter)));
  const singleFigure = figuresToShow.length === 1;
  if (figuresToShow.length === 0) return null;

  return (
    <div style={{ marginTop: 18, marginBottom: 26 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          maxWidth: 480,
          marginInline: "auto",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,120,190,0.55))",
          }}
        />
        <span
          style={{
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 10.5,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: "#d79fc2",
            whiteSpace: "nowrap",
          }}
        >
          GLOW Personalities
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(90deg, rgba(255,120,190,0.55), transparent)",
          }}
        />
      </div>
      <div
        className={singleFigure ? undefined : "glow-keyfigure-grid"}
        style={{
          display: singleFigure ? "flex" : "grid",
          justifyContent: singleFigure ? "center" : undefined,
          gridTemplateColumns: singleFigure ? undefined : "repeat(3, 1fr)",
          gap: "4px 10px",
          maxWidth: singleFigure ? 480 : 1100,
          marginInline: "auto",
          marginTop: 14,
          marginBottom: 14,
        }}
      >
        {figuresToShow.map((figure) => (
          <KeyFigureCard
            key={figure.id}
            figure={figure}
            onSelect={onSelect}
          />
        ))}
      </div>
      {!singleFigure && (
        <style>{`
          @media (min-width: 560px) {
            .glow-keyfigure-grid { grid-template-columns: repeat(4, 1fr) !important; }
          }
          @media (min-width: 820px) {
            .glow-keyfigure-grid { grid-template-columns: repeat(6, 1fr) !important; }
          }
          @media (min-width: 1040px) {
            .glow-keyfigure-grid { grid-template-columns: repeat(9, 1fr) !important; }
          }
        `}</style>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   Header
   ---------------------------------------------------------------- */
function Header() {
  return (
    <header
      style={{
        textAlign: "center",
        padding: "28px 16px 18px",
        position: "relative",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(26px, 6vw, 46px)",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          background:
            "linear-gradient(180deg, #fff 0%, #ffd9ee 35%, #ff6fb8 60%, #ff2d92 75%, #8e0a4e 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "0 2px 0 rgba(0,0,0,0.25)",
          filter: "drop-shadow(0 4px 14px rgba(255, 45, 146, 0.45))",
          lineHeight: 1.15,
        }}
      >
        Legendary
        <br />
        GLOW Wrestlers
        <br />
        of the Past
      </h1>
      <p
        style={{
          marginTop: 10,
          marginBottom: 0,
          color: "#9fb3ff",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        Gorgeous Ladies of Wrestling · 1986 – 1992
      </p>
      <div style={{ marginTop: 16, maxWidth: 360, marginInline: "auto" }}>
        <RopeDivider />
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------
   Home / roster grid screen
   ---------------------------------------------------------------- */
/* ----------------------------------------------------------------
   Decorative background photos for the home screen.
   Faint, faded archival shots placed behind the content — not
   meant to be looked at directly, just atmosphere.
   ---------------------------------------------------------------- */
const BACKGROUND_IMAGES = [
  "/images/mt-fiji-lift-bg.jpg",
];

function BackgroundPhoto({ src, topPercent, topOffset, opacity = 0.55 }) {
  const fadeMask =
    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 12%, rgba(0,0,0,0.9) 88%, transparent 100%), " +
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.9) 12%, rgba(0,0,0,0.9) 88%, transparent 100%)";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: topOffset ? topOffset : `${topPercent}%`,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(900px, 92vw)",
        pointerEvents: "none",
        zIndex: 0,
        opacity,
        WebkitMaskImage: fadeMask,
        maskImage: fadeMask,
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          filter: "saturate(0.85) contrast(0.95)",
        }}
      />
    </div>
  );
}

function HomeBackgroundLayer() {
  return (
    <BackgroundPhoto
      src={BACKGROUND_IMAGES[0]}
      topOffset="320px"
      opacity={0.6}
    />
  );
}

/* ----------------------------------------------------------------
   GLOW SKITS DATA
   ---------------------------------------------------------------- */
const SKITS = [
  {
    id: "skit-mclane-intro",
    title: "David McLane Show Intro",
    photo: "skit-mclane-intro.jpg",
    summary: "In Season 1, a gag skit opened each show with David McLane operating out of his office in a phone booth while making business calls — an inside joke towards the show's budget. In later seasons, intros included Sir Miles Headlock interviewing GLOW wrestlers, referee Steve Blance scolding the ladies in the locker room, and finally Blance as Commissioner sitting at his desk talking to a wrestler.",
  },
  {
    id: "skit-dr-grope",
    title: "Drs. Fiel & Grope Office",
    photo: "skit-dr-grope.jpg",
    summary: "A straightforward joke-punchline skit that takes place in a doctor's office (jokingly offering Gynecology, Plastic Surgery & Psychiatry) involving Dr. Grope and a GLOW wrestler. This skit lasted the entire run of the series.",
  },
  {
    id: "skit-easy-as-kgb",
    title: "Easy as KGB",
    photo: "skit-easy-as-kgb.jpg",
    summary: "Col. Ninotchka talks to her subordinate Vladimir on the phone, hoping to gain U.S. secrets — but the phone call always ends with Ninotchka berating him for his incompetence.",
  },
  {
    id: "skit-spanish-kitchen",
    title: "Spanish Kitchen / Angel's Hell's Kitchen / Beastie's Beanery",
    photo: "skit-spanish-kitchen.jpg",
    summary: "Customers being waited on by Spanish Red get either roasted or battered by the enraged heel. This skit was passed off to Angel for Season 2 (Angel's Hell's Kitchen), then to Beastie for the final two seasons (Beastie's Beanery).",
  },
  {
    id: "skit-bad-girls-poker",
    title: "Bad Girls Poker",
    photo: "skit-bad-girls-poker.jpg",
    summary: "Kitty's Killers are at the casino playing poker when cheating or a bad joke ensues — leading to some sort of pummeling, sometimes at the expense of others like David McLane. In Season 4, they'd play poker in a basic room instead, but it otherwise had the same premise.",
  },
  {
    id: "skit-asking-ashley",
    title: "Asking Ashley / Godiva's Bare Facts",
    photo: "skit-asking-ashley.jpg",
    summary: "Ashley Cartier answers letters from curious women and sleazy men. The format of this skit evolved into a phone call-in segment called Godiva's Bare Facts when Ashley left after Season 2.",
  },
  {
    id: "skit-farmers-daughter",
    title: "Farmer's Daughter's Letters Home / Amy's Letters Home",
    photo: "skit-farmers-daughter.jpg",
    summary: "Sally the Farmer's Daughter writes home to family, and humorously shows off her naivete in the big city. When Sally left in Season 2, Amy the Farmer's Daughter took over the skit and it was retitled Amy's Letters Home.",
  },
  {
    id: "skit-points-to-ponder",
    title: "Points to Ponder",
    photo: "skit-points-to-ponder.jpg",
    summary: "While wearing a graduation cap and reading a book, The California Doll uses wordplay — sharing silly metaphors (e.g. \"There are only two things you can't have for breakfast — lunch and dinner!\"). This skit ended with California Doll's departure after Season 2.",
  },
  {
    id: "skit-satanic-services",
    title: "Satanic Services",
    photo: "skit-satanic-services.jpg",
    summary: "In the short-lived skit Satanic Services with Princess of Darkness, the sorceress lies on the floor reciting incantations alongside other heels — which usually ends with silly spells or jokes. A different version of the skit was shown with the joke being between the sorceress and Jungle Woman.",
  },
  {
    id: "skit-tips-from-tina",
    title: "Tips from Tina",
    photo: "skit-tips-from-tina.jpg",
    summary: "Tina Ferrari gives women tips on 'getting the man you want' in the first 2 seasons. There's no jokes from Tina here — just rational, sound advice — given in a professional manner.",
  },
  {
    id: "skit-hip-dictionary",
    title: "Soul Patrol: Hip Dictionary / Reform School with Sara & Mabel",
    photo: "skit-hip-dictionary.jpg",
    summary: "In Hip Dictionary, someone behind the camera gives Envy & Adore a word to make a sentence out of — and they proceed to make a pun out of it. When Soul Patrol left GLOW, the skit was rebranded for Sara & Mabel in Season 3 as Reform School with Sara & Mabel.",
  },
  {
    id: "skit-tiffany-gossip",
    title: "Tiffany's GLOW Gossip",
    photo: "skit-tiffany-gossip.jpg",
    summary: "Tiffany Mellon gives the latest gossip on other GLOW wrestlers — in joke form — while she sits at her desk typing like a tabloid columnist.",
  },
  {
    id: "skit-zeldas-zingers",
    title: "Zelda's Zingers",
    photo: "skit-zeldas-zingers.jpg",
    summary: "A loud background score accompanies Zelda as she contemplates social matters while writing with a quill pen at her desk. These zingers are more serious than comedic.",
  },
  {
    id: "skit-mtv-connection",
    title: "MTV's GLOW Connection",
    photo: "skit-mtv-connection.jpg",
    summary: "Melody Trouble Vixen brings high energy and rocks out as club DJ at the GLOW Disco, all while she spins jokes and ribs her fellow GLOW wrestlers.",
  },
  {
    id: "skit-mt-miranda",
    title: "Mt. Miranda",
    photo: "skit-mt-miranda.jpg",
    summary: "Mt. Fiji dreams she's Carmen Miranda, as she dances and jokes with a fellow GLOW wrestler. In a preceding version of this skit shown during the first two seasons, Mt. Fiji would dream she was Mae West.",
  },
  {
    id: "skit-vicious-victory",
    title: "Vicious Victory",
    photo: "skit-vicious-victory.jpg",
    summary: "Vicky Victory looks vainly in the mirror, then makes fun of a fellow GLOW wrestler — and proceeds to have a pie from offscreen thrown in her face.",
  },
  {
    id: "skit-country-girl-dates",
    title: "Country Girls Dates",
    photo: "skit-country-girl-dates.jpg",
    summary: "Babe the Farmer's Daughter and Tulsa sit and talk about their dates, again playing up that small-town naivete in the big city — similar to Farmer's Daughter's Letters Home.",
  },
  {
    id: "skit-cheyenne-folklores",
    title: "Cheyenne Cher's Indian Folklores",
    photo: "skit-cheyenne-folklores.jpg",
    summary: "Cheyenne Cher shares her Native American ancestral wisdom in this later season skit.",
  },
  {
    id: "skit-glow-house",
    title: "Life in the GLOW House",
    photo: "skit-glow-house.jpg",
    summary: "Season 4's Life in the GLOW House was an ambitious attempt at a longer running comedy skit within the show, involving many of the wrestlers — though its length cut short the amount of wrestling within each episode.",
  },
  {
    id: "skit-glow-movie",
    title: "GLOW Girls: The Movie",
    photo: "skit-glow-movie.jpg",
    summary: "Wrestlers approach Steve Blance asking to be in a future GLOW movie. Blance's joke response puts him at the receiving end of a wrestler's anger.",
  },
  {
    id: "skit-mclane-outro",
    title: "David McLane Outro / Johnny C. Outro",
    photo: "skit-mclane-outro.jpg",
    summary: "At the end of each episode in the first two seasons, Aunt Kitty & Hollywood arrive at David McLane's door. Aunt Kitty would try to play matchmaker but McLane would comically spurn Hollywood. The final two seasons had an outro with Johnny C. sitting in a rundown, graffiti-filled 'office' begging his dad for money — and getting roughed up by a GLOW wrestler.",
  },
];

/* ----------------------------------------------------------------
   SKITS PAGE
   ---------------------------------------------------------------- */
function SkitsPage({ onBack, backLabel = "Main" }) {
  return (
    <div style={{ padding: "20px 18px 80px", maxWidth: 860, marginInline: "auto" }}>
      <style>{`
        @media (max-width: 600px) {
          .glow-skit-row { flex-direction: column !important; }
          .glow-skit-photo { width: 100% !important; height: auto !important; aspect-ratio: 4 / 3 !important; order: -1; }
        }
      `}</style>
      <button
        onClick={onBack}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 999,
          color: "#fff",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          padding: "8px 18px",
          cursor: "pointer",
          marginBottom: 28,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back to {backLabel}
      </button>

      <h2 style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        color: "#ff8fc3",
        fontSize: 22,
        letterSpacing: 2,
        textTransform: "uppercase",
        textAlign: "center",
        marginBottom: 8,
      }}>
        GLOW Skits
      </h2>

      <p style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        fontSize: 16,
        color: "#b9c3ff",
        textAlign: "center",
        lineHeight: 1.7,
        marginBottom: 40,
        padding: "0 8px",
      }}>
        Throughout each episode, skits were performed by various GLOW wrestlers and personalities — from comedic jabs at their opponents, to advice on life, GLOW skits were a staple of the series over its run between 1986–1992.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {SKITS.map((skit, i) => {
          const photoLeft = i % 2 === 0;
          return (
            <div
              key={skit.id}
              className="glow-skit-row"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 24,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {photoLeft && (
                <div className="glow-skit-photo" style={{
                  width: 400,
                  height: 300,
                  flexShrink: 0,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <img
                    src={`/images/${skit.photo}`}
                    alt={skit.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
              )}
              <div style={{
                flex: 1,
                minWidth: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: 300,
              }}>
                <h3 style={{
                  fontFamily: "'Trebuchet MS', Verdana, sans-serif",
                  color: "#ff8fc3",
                  fontSize: 15,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  margin: "0 0 12px",
                }}>
                  {skit.title}
                </h3>
                <p style={{
                  fontFamily: "'Trebuchet MS', Verdana, sans-serif",
                  fontSize: 13.5,
                  color: "#c8d0f0",
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  {skit.summary}
                </p>
              </div>
              {!photoLeft && (
                <div className="glow-skit-photo" style={{
                  width: 400,
                  height: 300,
                  flexShrink: 0,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <img
                    src={`/images/${skit.photo}`}
                    alt={skit.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   GLOW HISTORY & EXTRAS
   ---------------------------------------------------------------- */
const HISTORY_EXTRAS = [
  {
    id: "history-glow-intro",
    title: "GLOW Intro Rap",
    photo: "history-glow-intro.jpg",
    summary: "After the opening skit, the entire roster sings the official GLOW rap, introducing viewers to a handful of wrestlers during the song. Written by Deanna Booher (Matilda the Hun), the rap celebrates the women as street-tough champions ready for battle in the ring — hyping up the fun, rowdy energy that GLOW was known for.",
  },
  {
    id: "history-glow-raps",
    title: "GLOW Wrestler Raps",
    photo: "history-glow-raps.jpg",
    summary: "GLOW raps were a staple of the show, inspired by the Super Bowl champion Chicago Bears' \"Super Bowl Shuffle.\" Every wrestler had her own rap that was used as an introduction to the match, sometimes being match-specific — as Ninotchka had with Ferrari: \"🎵 Tina Ferrari the Capitalist dream. She won't look so cute face down in the ring. She thinks she's so sexy and so very strong. I will destroy her — it won't take long 🎵\"",
  },
  {
    id: "history-glow-roasts",
    title: "GLOW Roasting",
    photo: "history-glow-roasts.jpg",
    summary: "Wrestlers roasting other wrestlers is a standard theme throughout the series in mini segments — GLOW ladies dish out the insults while doing their makeup, getting their hair done, or in the case of the Heavy Metal Sisters — doing so while holding a cleaver, ready to chop off a hand.",
  },
  {
    id: "history-glow-games",
    title: "GLOW Games",
    photo: "history-glow-games.jpg",
    summary: "The Riviera Hotel hosted the GLOW Games in Season 2, which held various head-to-head challenges between Stallone's Sweethearts & Kitty's Killers — a race up and down escalators, tug of war, swimming on rafts, arm wrestling, and a pizza-eating contest between Mt. Fiji and Matilda the Hun — which, of course, led to a food fight.",
  },
  {
    id: "history-music-videos",
    title: "Music Videos",
    photo: "history-music-videos.jpg",
    summary: "GLOW wrestlers also performed in music videos during the show's run — Kitty's Killers have a song and dance number (\"🎵 Nasty and Mean 🎵\"), as does Matilda the Hun with \"🎵 Raw Meat 🎵\" — and Susie Spirit also leads another song and dance (and wrestle) number alongside Ninotchka called Le Musicale with Susie Spirit.",
  },
  {
    id: "history-adverts",
    title: "Adverts",
    photo: "history-adverts.jpg",
    summary: "GLOW Magazine released 6 issues that were advertised during the show's 2nd season. By the 3rd season, GLOW had a regular commercial for Fabergé Organics shampoo during every episode. Short ads for GLOW apparel ran, plus a 1-900 GLOW hotline you could call. Hollywood also had recurring drug and DUI PSAs.",
  },
];

const MOMENTS_IN_HISTORY = [
  {
    id: "history-susie-comeback",
    title: "Susie Spirit's Comeback",
    photo: "history-susie-comeback.jpg",
    summary: "Susie Spirit's brutal elbow injury during her match against the Headhunters was a shocking moment in GLOW — not a scene for the faint of heart — but the determined wrestler lived up to her name and made a remarkably swift comeback, even wrestling in an arm brace upon her return. While commentating for the GLOW Games and still wearing that arm brace, Susie was challenged to an arm wrestling match by Attaché using her other arm — and proceeded to beat the mercenary left-handed.",
  },
  {
    id: "history-spanish-red-palestina",
    title: "Spanish Red's Grudge with Palestina",
    photo: "history-spanish-red-palestina.jpg",
    summary: "In a heated match against Americana, Palestina stole the American flag from the patriotic wrestler — and with desecration in mind, the Desert Rat began stomping her feet all over it. Suddenly... out of nowhere... Spanish Red comes rushing into the ring and steals the flag away from Palestina! She holds it up high, showing her patriotism in this stunning moment and turnaround. Red's fiery stance won over the crowd, and she quickly abandoned Kitty's Killers. Her first order of business was a grudge match vs. Palestina — but she'd have trouble getting along with the good girls afterwards.",
  },
  {
    id: "history-the-showgirls",
    title: "The Showgirls",
    photo: "history-the-showgirls.jpg",
    summary: "In the premiere episode of Season 2, Hollywood & Vine were matched up against a new duo of dancers named Bambi & Babette — The Showgirls. David McLane met the dancers in the hotel lobby, and according to Susie Spirit, was \"so impressed by them,\" he offered them a chance to wrestle for GLOW. McLane would regret his decision not long after, once we hear his wails from the mic: \"Get back! Bambi and Babette — you're both men! Get back! What is this!?\" The match ended in chaos when the obvious was revealed — these Showgirls were men impersonating female wrestlers, just to get close to Hollywood & Vine and ask for a date — but the kleptomaniacs had the last laugh when they ran off with their watches.",
  },
  {
    id: "history-sugar-torched",
    title: "Sugar Gets Torched by Spike",
    photo: "history-sugar-torched.jpg",
    summary: "Sugar only had one televised match under her belt before taking on the Heavy Metal Sisters in a tag team match with California Doll. Spike decided to use her infamous blow torch on Sugar's face and burned her badly — she was then pounced on by the unhinged sisters. Sugar left the ring with her hands covering her face — upon her return, she wore a mask to hide her scars, with some opponents trying to rip it off her head (Palestina would somewhat succeed). Sugar left after Season 2 and never did take her mask off in the GLOW ring.",
  },
  {
    id: "history-tina-ferrari-crown",
    title: "Tina Ferrari Wins the GLOW Crown",
    photo: "history-tina-ferrari-crown.jpg",
    summary: "Tina Ferrari and Col. Ninotchka had a heated rivalry in Season 2. With the crown vacated for a long stretch of the season, Ferrari and Ninotchka finally battled for the championship, with Tina coming out victorious. A celebration was held at the Riviera Hotel afterward with Stallone's Sweethearts joining the newly crowned Tina. Their rematch would end in a double disqualification, and at the end of Season 2, Ninotchka would have her payback by defeating the fan-favorite in their final match and becoming new champion.",
  },
  {
    id: "history-stallone-vs-kitty",
    title: "Stallone vs. Kitty",
    photo: "history-stallone-vs-kitty.jpg",
    summary: "When Mt. Fiji and Big Bad Mama squared off in an arm wrestling match at the beginning of Season 3, a grudge between Jackie Stallone and Aunt Kitty overtook the scene. The beef between the 2 managers turned into a challenge by Aunt Kitty, taking the place of their respective wrestlers in the arm wrestling match. Jackie was in good shape to win when the table overturned — leading to chaos in the ring. Mt. Fiji/Jackie Stallone would eventually win after disqualification to Aunt Kitty's side.",
  },
  {
    id: "history-ninotchka-turns",
    title: "Ninotchka Turns",
    photo: "history-ninotchka-turns.jpg",
    summary: "In a Season 3 match for the GLOW championship, Ninotchka's opponent Daisy was blindsided by Major Tanya, who'd come to protect the Colonel. Surprisingly this enraged her comrade, as Ninotchka pushed Tanya out of the ring while verbally lashing her. Ninotchka would go on to win the match, but she'd relinquish her crown and step away from Kitty's Killers while cutting ties with the Major. Ninotchka would transform herself into a luxurious Parisian — from Kiev to Paris, she abandoned her Communist roots and embraced a wealthy lifestyle in the city of romance. She would find herself somewhere between both sides afterwards — abandoning Kitty's Killers, but not mixing with the good girls either. In the end, Ninotchka did what she did only for Ninotchka.",
  },
  {
    id: "history-daisy-breaks-free",
    title: "Daisy Breaks Free",
    photo: "history-daisy-breaks-free.jpg",
    summary: "In Season 3, Daisy started her GLOW career enslaved by the evil dwarf Gremlina — to whom she was in debt. Gremlina made Daisy wrestle her matches, while having Daisy's size advantage on her villainous side. Daisy was forced to wrestle for Kitty's Killers until she finally turned against her captor in a match versus Zelda — resulting in Gremlina being stuffed into a trash can. From there, Daisy found herself wrestling Kitty's Killers & Stallone's Sweethearts, establishing her independence as a character.",
  },
  {
    id: "history-run-for-rubies",
    title: "Run for the Rubies",
    photo: "history-run-for-rubies.jpg",
    summary: "With the crown vacant in Season 3, a tournament was held to see who'd be the next GLOW Champion. Col. Ninotchka shocked everyone by relinquishing the crown — this was the inception of Run for the Rubies. The championship tournament lasted most of Season 3, and was single elimination with a wildcard Battle Royal match. Cheyenne Cher would win the tourney, defeating Godiva in the final.",
  },
];

function HistoryRow({ item, photoLeft }) {
  const photoBox = (
    <div className="glow-skit-photo" style={{
      width: 400,
      height: 300,
      flexShrink: 0,
      borderRadius: 12,
      overflow: "hidden",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <img
        src={`/images/${item.photo}`}
        alt={item.title}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={e => { e.currentTarget.style.display = "none"; }}
      />
    </div>
  );

  return (
    <div
      className="glow-skit-row"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 24,
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      {photoLeft && photoBox}
      <div style={{
        flex: 1,
        minWidth: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: 300,
      }}>
        <h3 style={{
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          color: "#ff8fc3",
          fontSize: 15,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          margin: "0 0 12px",
        }}>
          {item.title}
        </h3>
        <p style={{
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13.5,
          color: "#c8d0f0",
          lineHeight: 1.75,
          margin: 0,
        }}>
          {item.summary}
        </p>
      </div>
      {!photoLeft && photoBox}
    </div>
  );
}

function HistoryPage({ onBack, backLabel = "Main" }) {
  return (
    <div style={{ padding: "20px 18px 80px", maxWidth: 860, marginInline: "auto" }}>
      <style>{`
        @media (max-width: 600px) {
          .glow-skit-row { flex-direction: column !important; }
          .glow-skit-photo { width: 100% !important; height: auto !important; aspect-ratio: 4 / 3 !important; order: -1; }
        }
      `}</style>
      <button
        onClick={onBack}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 999,
          color: "#fff",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          padding: "8px 18px",
          cursor: "pointer",
          marginBottom: 28,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back to {backLabel}
      </button>

      <h2 style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        color: "#ff8fc3",
        fontSize: 22,
        letterSpacing: 2,
        textTransform: "uppercase",
        textAlign: "center",
        marginBottom: 8,
      }}>
        GLOW History &amp; Extras
      </h2>

      <p style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        fontSize: 16,
        color: "#b9c3ff",
        textAlign: "center",
        lineHeight: 1.7,
        marginBottom: 40,
        padding: "0 8px",
      }}>
        Beyond the matches themselves, GLOW was packed with raps, roasts, games, and
        genuinely legendary moments that became part of the show's lasting charm.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {HISTORY_EXTRAS.map((item, i) => (
          <HistoryRow key={item.id} item={item} photoLeft={i % 2 === 0} />
        ))}
      </div>

      <h2 style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        color: "#ff8fc3",
        fontSize: 20,
        letterSpacing: 2,
        textTransform: "uppercase",
        textAlign: "center",
        marginTop: 64,
        marginBottom: 32,
      }}>
        Moments in GLOW History
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {MOMENTS_IN_HISTORY.map((item, i) => (
          <HistoryRow key={item.id} item={item} photoLeft={i % 2 === 0} />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   MISCELLANEOUS PAGE
   ---------------------------------------------------------------- */
// TODO: replace with your real contact email before going live.
const CONTACT_EMAIL = "contact@classicglowwrestlers.com";
// TODO: confirm this matches your actual domain once it's purchased/live.
const SITE_URL = "classicglowwrestlers.com";

const GLOW_CREDITS = [
  { name: "David McLane", role: "GLOW Founder & Creator" },
  { name: "Matt Cimber", role: "Writer, Director & Producer" },
  { name: "Meshulam Riklis", role: "Financier & Owner of Riviera Hotel" },
  { name: "Steve Blance", role: "Head Writer" },
  { name: "Independent Network Inc.", role: "Syndicator/Distributor (now Multicom Entertainment Group)" },
];

const GLOW_SEASONS = [
  { season: "Season 1", years: "1986" },
  { season: "Season 2", years: "1987" },
  { season: "Season 3", years: "1988" },
  { season: "Season 4", years: "1989–1990" },
];

const SITE_CHANGELOG = [
  { date: "July 2026", note: "classicglowwrestlers.com is officially live!" },
  { date: "July 2026", note: "Added the Splash Page as the new site landing page." },
  { date: "July 2026", note: "Built out the Tale of the Tape wrestler matchup simulator, including a heel/face picker for choosing your own dream matchups." },
  { date: "July 2026", note: "Expanded the Who Said It? quiz with more quotes." },
  { date: "July 2026", note: "Added the Miscellaneous page — credits, seasons, disclaimer, and contact info." },
  { date: "July 2026", note: "Added the GLOW History & Extras page." },
  { date: "July 2026", note: "Expanded wrestler roster and continued bio/summary edits." },
];

function MiscSectionHeading({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        maxWidth: 560,
        marginInline: "auto",
        marginBottom: 22,
        marginTop: 8,
      }}
    >
      <div style={{
        flex: 1,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,120,190,0.55))",
      }} />
      <span style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: 1.4,
        textTransform: "uppercase",
        color: "#d79fc2",
        whiteSpace: "nowrap",
      }}>
        {children}
      </span>
      <div style={{
        flex: 1,
        height: 1,
        background: "linear-gradient(90deg, rgba(255,120,190,0.55), transparent)",
      }} />
    </div>
  );
}

function MiscCard({ children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 14,
      padding: "22px 24px",
      maxWidth: 560,
      marginInline: "auto",
    }}>
      {children}
    </div>
  );
}

function MiscPage({ onBack, backLabel = "Main" }) {
  return (
    <div style={{ padding: "20px 18px 80px", maxWidth: 860, marginInline: "auto" }}>
      <button
        onClick={onBack}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 999,
          color: "#fff",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          padding: "8px 18px",
          cursor: "pointer",
          marginBottom: 28,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back to {backLabel}
      </button>

      <h2 style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        color: "#ff8fc3",
        fontSize: 22,
        letterSpacing: 2,
        textTransform: "uppercase",
        textAlign: "center",
        marginBottom: 40,
      }}>
        Miscellaneous
      </h2>

      {/* GLOW Credits */}
      <MiscSectionHeading>GLOW Credits (1986–1992)</MiscSectionHeading>
      <MiscCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {GLOW_CREDITS.map((c) => (
            <div key={c.name} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{
                fontFamily: "'Trebuchet MS', Verdana, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                flexShrink: 0,
                maxWidth: "45%",
              }}>
                {c.name}
              </span>
              <span style={{
                fontFamily: "'Trebuchet MS', Verdana, sans-serif",
                fontSize: 13,
                color: "#c8d0f0",
                textAlign: "right",
                flex: 1,
              }}>
                {c.role}
              </span>
            </div>
          ))}
        </div>
      </MiscCard>

      {/* GLOW Seasons */}
      <MiscSectionHeading>GLOW Seasons (Syndication)</MiscSectionHeading>
      <MiscCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {GLOW_SEASONS.map((s) => (
            <div key={s.season} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{
                fontFamily: "'Trebuchet MS', Verdana, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
              }}>
                {s.season}
              </span>
              <span style={{
                fontFamily: "'Trebuchet MS', Verdana, sans-serif",
                fontSize: 13,
                color: "#c8d0f0",
              }}>
                {s.years}
              </span>
            </div>
          ))}
        </div>
        <div style={{
          textAlign: "center",
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          color: "#d79fc2",
          letterSpacing: 0.5,
        }}>
          104 total episodes
        </div>
      </MiscCard>

      {/* Notes */}
      <MiscSectionHeading>Notes</MiscSectionHeading>
      <MiscCard>
        <p style={{
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          color: "#c8d0f0",
          lineHeight: 1.75,
          margin: 0,
        }}>
          GLOW Wrestling is a wild piece of 80s pop culture that brought a level of entertainment to 1980s television that we celebrate here at classicglowwrestlers.com. It was unpredictable, offbeat, raw and flat-out fun — it could be silly one minute, and shocking the next. GLOW gave us edgy characters, provocative situations, exciting matches, comedy skits and so much more — its campy charm was unmatched. This site is dedicated to honoring classic GLOW (1986–1992) and the wonderful performers who made it so enjoyable — especially the women who are no longer with us, and were such an integral part of GLOW's success, including: Ursula Hayden, Deanna Booher, Emily Dole, Lynn Braxton and Becky Mullen.
        </p>
      </MiscCard>

      {/* Disclaimer */}
      <MiscSectionHeading>Disclaimer</MiscSectionHeading>
      <MiscCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 13,
            color: "#c8d0f0",
            lineHeight: 1.75,
            margin: 0,
          }}>
            This is an unofficial fan tribute site and is not affiliated with, endorsed by, or sponsored by GLOW (Gorgeous Ladies of Wrestling) or its current or former rights holders. All trademarks, logos, and footage remain the property of their respective owners.
          </p>
          <p style={{
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 13,
            color: "#c8d0f0",
            lineHeight: 1.75,
            margin: 0,
          }}>
            Information on this site — including bios, summaries, and trivia — was compiled from firsthand viewing of original GLOW broadcasts, contemporary magazines, and interviews. Content reflects the author's best research and recollection; errors or omissions may exist.
          </p>
          <p style={{
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 13,
            color: "#c8d0f0",
            lineHeight: 1.75,
            margin: 0,
          }}>
            Photos and video clips are included for archival and educational purposes and remain the property of their original copyright holders. If you are a rights holder and would like content removed, please contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#ff8fc3" }}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </MiscCard>

      {/* Privacy Policy */}
      <MiscSectionHeading>Privacy Policy</MiscSectionHeading>
      <MiscCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 13,
            color: "#c8d0f0",
            lineHeight: 1.75,
            margin: 0,
          }}>
            This site may use cookies and similar technologies to help it function and to support advertising. If display ads are served on this site (for example, through Google AdSense), Google and its advertising partners may use cookies to serve ads based on a visitor's prior visits to this site or other websites across the internet.
          </p>
          <p style={{
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 13,
            color: "#c8d0f0",
            lineHeight: 1.75,
            margin: 0,
          }}>
            You can opt out of personalized advertising by visiting Google's Ads Settings at{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#ff8fc3" }}>adssettings.google.com</a>
            , or opt out of third-party vendor cookies used for personalized ads at{" "}
            <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" style={{ color: "#ff8fc3" }}>aboutads.info/choices</a>
            . Most browsers also let you block or delete cookies through their own settings.
          </p>
          <p style={{
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 13,
            color: "#c8d0f0",
            lineHeight: 1.75,
            margin: 0,
          }}>
            This site does not require account creation, does not process payments, and does not knowingly collect personal information beyond what may be gathered automatically through the cookies described above. Questions about this policy can be sent to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#ff8fc3" }}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </MiscCard>

      {/* Contact Us */}
      <MiscSectionHeading>Contact Us</MiscSectionHeading>
      <MiscCard>
        <div style={{ textAlign: "center" }}>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#ff8fc3",
              textDecoration: "none",
            }}
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </MiscCard>

      {/* Site Changelog */}
      <MiscSectionHeading>Site Changelog</MiscSectionHeading>
      <MiscCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SITE_CHANGELOG.map((entry, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{
                fontFamily: "'Trebuchet MS', Verdana, sans-serif",
                fontWeight: 700,
                fontSize: 12,
                color: "#d79fc2",
              }}>
                {entry.date}
              </span>
              <span style={{
                fontFamily: "'Trebuchet MS', Verdana, sans-serif",
                fontSize: 13,
                color: "#c8d0f0",
                lineHeight: 1.6,
              }}>
                {entry.note}
              </span>
            </div>
          ))}
        </div>
      </MiscCard>
    </div>
  );
}

/* ----------------------------------------------------------------
   WHO SAID IT? QUIZ
   ---------------------------------------------------------------- */

// Individual voices for wrestlers who are normally grouped as a single
// tag-team entry in WRESTLERS. Each has a "partner" so the pairing rule
// (partners never appear together in the same 4 choices) can be enforced.
const QUIZ_TAG_MEMBERS = [
  { name: "Spike", team: "Heavy Metal Sisters", alignment: "Heel", partner: "Chainsaw" },
  { name: "Chainsaw", team: "Heavy Metal Sisters", alignment: "Heel", partner: "Spike" },
  { name: "Arlene", team: "The Housewives", alignment: "Heel", partner: "Phyllis" },
  { name: "Phyllis", team: "The Housewives", alignment: "Heel", partner: "Arlene" },
  { name: "Envy", team: "The Soul Patrol", alignment: "Heel", partner: "Adore" },
  { name: "Adore", team: "The Soul Patrol", alignment: "Heel", partner: "Envy" },
];

// Wrestlers/tag-team combined entries excluded entirely from the quiz pool —
// no individual voice, no quotes, or too obscure to fairly quiz on.
const QUIZ_EXCLUDED_NAMES = new Set([
  "The Housewives (Arlene & Phyllis)",
  "Sara & Mabel",
  "The Headhunters (Mika, Mina & Mana)",
  "Salt and Pepper",
  "The Soul Patrol (Envy & Adore)",
  "The Showgirls (Bambi & Babette)",
  "Heavy Metal Sisters (Spike & Chainsaw)",
  "Dementia",
  "Magnolia the Southern Belle",
  "Queenie",
  "The Terminator",
]);

// Build the full quiz-eligible pool: normal roster wrestlers (minus
// exclusions) plus the individual tag-team voices above.
function buildQuizPool() {
  const pool = [];
  for (const w of WRESTLERS) {
    if (QUIZ_EXCLUDED_NAMES.has(w.name)) continue;
    const alignment = w.role && w.role.startsWith("Face") ? "Face" : "Heel";
    pool.push({ name: w.name, team: null, alignment, partner: null });
  }
  for (const m of QUIZ_TAG_MEMBERS) {
    pool.push(m);
  }
  return pool;
}
const QUIZ_POOL = buildQuizPool();

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate the 4 answer choices (1 correct + 3 wrong) for a quiz question.
function generateChoices(question) {
  const correctEntry = QUIZ_POOL.find(p => p.name === question.answer) || {
    name: question.answer, team: null, alignment: "Face", partner: null,
  };

  // Explicit choices list provided — use it (sampling 3 if more than 3 given)
  if (question.choices && question.choices.length > 0) {
    const wrongNames = question.choices.length > 3
      ? shuffleArray(question.choices).slice(0, 3)
      : question.choices;
    const wrongEntries = wrongNames.map(n =>
      QUIZ_POOL.find(p => p.name === n) || { name: n, team: null, alignment: correctEntry.alignment, partner: null }
    );
    return shuffleArray([correctEntry, ...wrongEntries]);
  }

  // Automatic pool: same alignment, not the correct answer, not excluded,
  // not the correct answer's tag partner, and never two partners together.
  const excludeSet = new Set(question.exclude || []);
  let candidates = QUIZ_POOL.filter(p =>
    p.alignment === correctEntry.alignment &&
    p.name !== correctEntry.name &&
    !excludeSet.has(p.name) &&
    p.name !== correctEntry.partner
  );
  candidates = shuffleArray(candidates);

  const picked = [];
  for (const c of candidates) {
    if (picked.length >= 3) break;
    if (picked.some(p => p.partner === c.name)) continue;
    picked.push(c);
  }
  return shuffleArray([correctEntry, ...picked]);
}

const QUIZ_QUESTIONS = [
  { quote: "The Cheerleaders say they can fly — I can kill 2 birds with one stone.", answer: "Jungle Woman" },
  { quote: "American wimps are all the same. They cry like babies when I give them pain.", answer: "Matilda the Hun", choices: ["Colonel Ninotchka", "Major Tanya", "Palestina", "Spanish Red", "Habana", "Princess of Darkness"] },
  { quote: "I want Matilda the Hun. She's the timber — but I'm the axe.", answer: "Mt. Fiji" },
  { quote: "California Doll has a tattoo of a happy face. I mean, that has got to be the stupidest thing I've ever heard — I mean, when I'm done with California Doll, that happy face is gonna be crying — crying!", answer: "Spanish Red" },
  { quote: "I'll show you puny Americans!", answer: "Colonel Ninotchka", choices: ["Matilda the Hun", "Spanish Red", "Palestina", "Habana", "Major Tanya"] },
  { quote: "We're gonna beat you till you're red, white and blue — you hear me?!", answer: "Justice" },
  { quote: "Those tramps — the bombastic tramps! Look at 'em! Look at 'em! They're making deals right now!", answer: "Phyllis" },
  { quote: "Beastie, I don't know why you even bother to have a match with me, I mean — what would she do with a crown anyhow? Eat it?", answer: "Tiffany Mellon" },
  { quote: "Daisy's brain is so scrambled, she doesn't know if she's coming or going — or good or bad!", answer: "Babe the Farmer's Daughter" },
  { quote: "Tiffany Mellon says she's very popular — good. That means there'll be a full house at her funeral.", answer: "The Widow" },
  { quote: "Palestina should know that a truly lady bends at the knees, not at the hips.", answer: "Tara the Southern Belle" },
  { quote: "What's this? You guys — you have to fight with weapons? We don't have weapons. We're confident of our power.", answer: "Ashley Cartier" },
  { quote: "We're gonna blow those blonde haired pip squeaks right outta the ring!", answer: "Attaché" },
  { quote: "I'd like to see Spanish Red try to Spanish Press on me — someone who can bench press 200 pounds.", answer: "Olympia", exclude: ["Little Feather", "Little Fiji", "Cheyenne Cher", "Vicky Victory"] },
  { quote: "Only fair way, David, is to let us have a rematch against The Headhunters.", answer: "Susie Spirit" },
  { quote: "I'm the champ — and I'm gonna stay the champ! And that's all there is to it — Americana is dead!", answer: "The Royal Hawaiian" },
  { quote: "I'll scalp Little Feather — decapitate her — and go bowling with her skull!", answer: "Chainsaw" },
  { quote: "If she has to put him (Nature Boy) under lock and key — no problem. I know how to work a lock and a key. I'm gonna set that boy free.", answer: "Tina Ferrari" },
  { quote: "I'm gonna take Dallas off the planet earth — and I'm gonna have a great time doing it, buddy!", answer: "Corporal Kelly" },
  { quote: "Olympia is simply a... mindless mass of steroids.", answer: "Palestina" },
  { quote: "In this language that I don't understand — and I think that she's saying mean things about me, but I'm not sure. So I'm gonna have to give her a drop kick to hush her up.", answer: "Sally the Farmer's Daughter" },
  { quote: "Little Feather and I want to unmask Sara and Mabel.", answer: "Ebony" },
  { quote: "I will rip them apart, chew them up and — spit them out at their fans!", answer: "Palestina" },
  { quote: "Let me say something. That's right — Ninotchka came in and interfered, but you know what? You're lucky, only in the USA you can do something like that, honey! Back home, they'd throw you out in Siberia!", answer: "Mt. Fiji" },
  { quote: "You know Chainsaw and Spike — without their weapons — they are nothing!", answer: "Olympia" },
  { quote: "David McLane I'm sure matched this up, knowing that it'd be a real war — a real battle in the ring.", answer: "Tina Ferrari" },
  { quote: "California Doll is such an airhead, we have to tie a weight onto her to keep her from floating away.", answer: "Hollywood" },
  { quote: "Mr. McLane — now there can be no doubt. I have pulverized 23 women. I want Americana, McLane!", answer: "Colonel Ninotchka" },
  { quote: "We're gonna jam the flag down your throat, Americana — and all the apple pie in the world won't be able to save you.", answer: "Vine" },
  { quote: "Johnny C., I see you did it — look at these two country bumpkins — what do you call this? This is not competition. Hey, I can take six of these kind on any day of the week, with one arm tied behind my back.", answer: "Big Bad Mama" },
  { quote: "No way! I wouldn't shoplift — do I look like somebody who steals?", answer: "Broadway Rose" },
  { quote: "Big Bad Mama has a real movie star look — The Blob — Part 2, 3, 4, 5, 6, 7...", answer: "Cheyenne Cher" },
  { quote: "I hope somebody told Tiffany that she cannot buy the GLOW crown on her Mastercharge.", answer: "Colonel Ninotchka" },
  { quote: "I hate Americana. And I'm not just fighting her for the GLOW crown — I am fighting her for dignity and pride.", answer: "Spanish Red" },
  { quote: "Back Home we got Deer Hunters and Bear Hunters — but Headhunters? Uh uh.", answer: "Amy the Farmer's Daughter" },
  { quote: "I think sometimes that if we all showed Matilda some love and kindness, she'd become a nice person.", answer: "Susie Spirit" },
  { quote: "Nino (Ninotchka) is a really, really good friend of mine. And you know, Nino? I don't even know if I could wrestle you.", answer: "Hollywood" },
  { quote: "I hate Cheerleaders. Cheyenne Cher looks like she tried to have a powwow with a lawnmower.", answer: "Melody Trouble Vixen (MTV)" },
  { quote: "So you wanted to see Gorgeous Ladies — well feast your eyes! Here's the cream of the crop!", answer: "Big Bad Mama" },
  { quote: "This is their (Housewives) chance, man — national television, in this wrestling match, and look how they dress?", answer: "Tina Ferrari" },
  { quote: "Hollywood's wrestling techniques are definitely street material — just like her. Well I plan on cleaning up the streets and using her hair as a mop.", answer: "Roxy Astor" },
  { quote: "You know, lots of friends of mine have lost a lot of money to people like Evangelina. So during this match, I'm gonna awake her pay.", answer: "Babe the Farmer's Daughter" },
];

// Each playthrough pulls a random subset of this size from the full
// question pool above — so as more quotes get added over time, no single
// round grows longer, it just draws from a bigger pool of variety.
const QUIZ_ROUND_LENGTH = 10;

function pickRoundOrder() {
  const allIndices = QUIZ_QUESTIONS.map((_, i) => i);
  const shuffled = shuffleArray(allIndices);
  return shuffled.slice(0, Math.min(QUIZ_ROUND_LENGTH, allIndices.length));
}

// A short reaction to the final score, out of a 10-question round.
function quizRatingLabel(score) {
  if (score >= 10) return "Super!";
  if (score === 9) return "Excellent!";
  if (score === 8) return "Great!";
  if (score === 7) return "Nice!";
  if (score === 6) return "Good!";
  if (score === 5) return "Fair!";
  return "Better luck next time!";
}

function QuizPage({ onBack, backLabel = "Main" }) {
  const [order, setOrder] = React.useState(() => pickRoundOrder());
  const [roundChoices, setRoundChoices] = React.useState(() =>
    order.map(i => generateChoices(QUIZ_QUESTIONS[i]))
  );
  const [current, setCurrent] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [finished, setFinished] = React.useState(false);

  const total = order.length;
  const qIndex = order[current];
  const question = QUIZ_QUESTIONS[qIndex];
  const choices = roundChoices[current];

  function handleSelect(entry) {
    if (selected) return;
    setSelected(entry.name);
    if (entry.name === question.answer) setScore(s => s + 1);
  }

  function handleNext() {
    if (current + 1 >= total) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  }

  function handlePlayAgain() {
    const newOrder = pickRoundOrder();
    setOrder(newOrder);
    setRoundChoices(newOrder.map(i => generateChoices(QUIZ_QUESTIONS[i])));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }

  const btnBase = {
    fontFamily: "'Trebuchet MS', Verdana, sans-serif",
    fontSize: 14,
    padding: "14px 18px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer",
    textAlign: "left",
    transition: "transform 120ms ease",
  };

  return (
    <div style={{ padding: "20px 18px 80px", maxWidth: 640, marginInline: "auto" }}>
      <button
        onClick={onBack}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 999,
          color: "#fff",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          padding: "8px 18px",
          cursor: "pointer",
          marginBottom: 28,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back to {backLabel}
      </button>

      <h2 style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        color: "#ff8fc3",
        fontSize: 22,
        letterSpacing: 2,
        textTransform: "uppercase",
        textAlign: "center",
        marginBottom: 8,
      }}>
        Who Said It?
      </h2>
      <p style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        fontSize: 14,
        color: "#b9c3ff",
        textAlign: "center",
        marginBottom: 32,
      }}>
        How well do you know classic GLOW?
      </p>

      {!finished ? (
        <>
          <div style={{
            textAlign: "center",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 12,
            color: "#9aa6d6",
            marginBottom: 10,
          }}>
            Question {current + 1} of {total} &nbsp;•&nbsp; Score: {score}
          </div>

          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: "22px 24px",
            marginBottom: 22,
          }}>
            <p style={{
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontSize: 16,
              color: "#fff",
              fontStyle: "italic",
              lineHeight: 1.6,
              margin: 0,
            }}>
              "{question.quote}"
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {choices.map((c) => {
              const isCorrect = c.name === question.answer;
              const isSelected = c.name === selected;
              let bg = "rgba(255,255,255,0.06)";
              let color = "#fff";
              if (selected) {
                if (isCorrect) { bg = "rgba(76,175,80,0.35)"; color = "#c8f7c5"; }
                else if (isSelected) { bg = "rgba(244,67,54,0.35)"; color = "#ffc9c5"; }
                else { bg = "rgba(255,255,255,0.03)"; color = "#7c85a6"; }
              }
              return (
                <button
                  key={c.name}
                  onClick={() => handleSelect(c)}
                  style={{ ...btnBase, background: bg, color }}
                >
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  {c.team && (
                    <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>
                      ({c.team})
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selected && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button
                onClick={handleNext}
                style={{
                  background: "linear-gradient(135deg, #ff3d9a, #8e0a4e)",
                  color: "#fff",
                  fontFamily: "'Trebuchet MS', Verdana, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "12px 32px",
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {current + 1 >= total ? "See Results" : "Next Question"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: "32px 24px",
            marginBottom: 24,
          }}>
            <div style={{
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontSize: 14,
              color: "#b9c3ff",
              marginBottom: 8,
            }}>
              You scored
            </div>
            <div style={{
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontWeight: 700,
              fontSize: 42,
              color: "#ff8fc3",
            }}>
              {score} / {total}
            </div>
            <div style={{
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "#b9c3ff",
              marginTop: 8,
            }}>
              {quizRatingLabel(score)}
            </div>
          </div>
          <button
            onClick={handlePlayAgain}
            style={{
              background: "linear-gradient(135deg, #ff3d9a, #8e0a4e)",
              color: "#fff",
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontWeight: 700,
              fontSize: 14,
              padding: "13px 40px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   TALE OF THE TAPE
   ---------------------------------------------------------------- */

// Power ratings out of 10, used to weight the random simulation —
// higher rating = better odds, but never a guaranteed win.
const TAPE_RATINGS = {
  "Americana": 8.1,
  "Amy the Farmer's Daughter": 5,
  "Angel": 8,
  "Ashley Cartier": 7.5,
  "Attaché": 7.5,
  "Babe the Farmer's Daughter": 6,
  "Beastie": 8,
  "Big Bad Mama": 8.3,
  "Broadway Rose": 6.8,
  "Cheyenne Cher": 7.8,
  "Colonel Ninotchka": 9,
  "Corporal Kelly": 7,
  "Daisy": 9.2,
  "Dallas": 7.6,
  "Debbie Debutante": 7.5,
  "Dementia": 6,
  "Ebony": 7.3,
  "Evangelina": 4.4,
  "Godiva": 8,
  "Habana": 6,
  "Spike": 6,
  "Chainsaw": 6,
  "Hollywood": 7.2,
  "Jungle Woman": 7,
  "Justice": 8,
  "Liberty": 7,
  "Lightning": 7.3,
  "Little Egypt": 5.5,
  "Little Feather": 3.5,
  "Little Fiji": 1.5,
  "Major Tanya": 8,
  "Matilda the Hun": 8.5,
  "Melody Trouble Vixen (MTV)": 4.5,
  "Mt. Fiji": 10,
  "Olympia": 8.4,
  "Palestina": 7.4,
  "Roxy Astor": 7.9,
  "Sally the Farmer's Daughter": 6,
  "Sara": 6,
  "Mabel": 6,
  "Scarlet the Southern Belle": 5.5,
  "Sneaky": 6,
  "Spanish Red": 8,
  "Star": 5.5,
  "Stinky": 6,
  "Sugar": 7.4,
  "Sunny": 7,
  "Susie Spirit": 7.7,
  "Tammy Jones": 7,
  "Tara the Southern Belle": 5.5,
  "The California Doll": 8.3,
  "Mana": 7,
  "Arlene": 4,
  "Phyllis": 4,
  "The Royal Hawaiian": 8.2,
  "Envy": 7.8,
  "Adore": 7.8,
  "The Widow": 8,
  "Thunderbolt": 7.3,
  "Tiffany Mellon": 7.5,
  "Tina Ferrari": 9,
  "Tulsa": 7,
  "Vicky Victory": 7.1,
  "Vine": 7,
  "Zelda": 4.5,
};

// This team almost always gets themselves disqualified — special-cased
// so their matches resolve differently than a normal weighted contest.
const TAPE_ALWAYS_DQ = new Set(["Spike", "Chainsaw"]);

// These five play dirty often enough that they get themselves
// disqualified roughly half the time.
const TAPE_DIRTY_WRESTLERS = new Set(["Arlene", "Phyllis", "Envy", "Adore", "Mana"]);

// The Housewives, Soul Patrol, Matilda the Hun, and Palestina sometimes
// get away clean with whatever dirty trick they're pulling and steal the
// win outright, instead of getting caught.
const TAPE_DIRTY_WIN_ELIGIBLE = new Set(["Arlene", "Phyllis", "Envy", "Adore", "Matilda the Hun", "Palestina"]);

// These wrestlers will go digging under the ring apron for a weapon —
// a length of rope, a stray stick — when the opportunity presents
// itself.
const TAPE_UNDERRING_WEAPON_WRESTLERS = new Set([
  "Dementia", "Matilda the Hun", "Attaché", "Hollywood",
  "Vine", "Sara", "Mabel", "Envy", "Adore",
]);

// Dementia is silent and unsettling, not a talker, and the Headhunters
// don't do trash talk either — so neither ever gets roasted with the
// announcer's usual trash-talk lines.
// True silent types — these four genuinely don't talk trash, so a match
// involving any of them drops roast beats entirely rather than putting
// words in their mouths.
const TAPE_NO_TRASH_TALK = new Set(["Dementia", "Mana", "Chainsaw", "Spike"]);

// Wholesome, sweet-natured types who never dish out trash talk
// themselves — their matches still get the normal roast treatment
// aimed at whoever they're facing, they just never become the target.
const TAPE_NO_ROAST_TARGET = new Set([
  "Sally the Farmer's Daughter", "Babe the Farmer's Daughter", "Amy the Farmer's Daughter",
  "Tara the Southern Belle", "Scarlet the Southern Belle",
  "Tina Ferrari",
  "Susie Spirit", "Debbie Debutante", "Vicky Victory", "Cheyenne Cher",
]);

// A handful of TAPE_ACTION_BEATS templates imply one wrestler is
// talking/arguing out loud — since {A}/{B} can land on either side,
// these get filtered out of the pool entirely whenever a silent
// wrestler (Dementia, the Headhunters) is in the match.
const TAPE_SPEECH_ACTION_BEATS = new Set([
  "{A} talks trash to the crowd, and {B} makes her pay for the distraction with a quick strike.",
  "{A} gets right up in the referee's face, arguing over a count that felt too slow for her liking.",
  "{B} throws her hands up arguing with the referee — she is NOT happy with how this is being called.",
]);

// Giants (Mt. Fiji, Matilda the Hun, Big Bad Mama, Daisy) can dish out a
// flip, but their size and no-selling style means they never get
// flipped themselves. Boston crab doesn't suit them in either
// direction. And a giant never throws a dropkick herself — though
// somebody else's dropkick landing ON a giant is a different story
// (see TAPE_DROPKICK_VS_GIANT_LINES below).
const TAPE_BOSTON_CRAB_BEATS = new Set([
  "{A} locks {B} into a Boston crab right in the center of the ring — {B} is scrambling for the ropes!",
  "{B} counters into a Boston crab of her own, and now {A} is the one in trouble!",
]);
// Daisy is tall but isn't quite in the same "unmovable giant" weight
// class as Mt. Fiji, Matilda the Hun, and Big Bad Mama — the no-dropkick
// rule is specifically for those three, not for her.
const TAPE_TRUE_GIANTS = new Set(["Mt. Fiji", "Matilda the Hun", "Big Bad Mama"]);
function tapeBeatAllowed(tpl, a, b) {
  const aGiant = TAPE_GIANT_WRESTLERS.has(a.name);
  const bGiant = TAPE_GIANT_WRESTLERS.has(b.name);
  const aTrueGiant = TAPE_TRUE_GIANTS.has(a.name);
  const bTrueGiant = TAPE_TRUE_GIANTS.has(b.name);
  if (tpl === "{A} flips {B} clean over with a well-timed hip toss." && bGiant) return false;
  if (tpl === "{B} reverses out of a hold and flips {A} onto her back." && aGiant) return false;
  if (TAPE_BOSTON_CRAB_BEATS.has(tpl) && (aGiant || bGiant)) return false;
  if (tpl === "{A} opens with a stiff clothesline, but {B} answers right back with a dropkick that sends the crowd into a frenzy." && bTrueGiant) return false;
  // The three true giants never leave their feet — no dropkicks, no
  // leaping/aerial moves of any kind. Their only air move, ever, is
  // Matilda's and Big Bad Mama's Big Splash finisher, which lives
  // entirely outside this general action-beat pool.
  if (tpl === "{B} climbs to the top rope, but {A} cuts her off before she can fly." && bTrueGiant) return false;
  if (tpl === "{B} takes to the air with a crossbody, but {A} rolls through for a near-fall of her own." && bTrueGiant) return false;
  if (tpl === "{A} catches {B} mid-air off a crossbody attempt and turns it into a devastating slam." && bTrueGiant) return false;
  // The Big Splash belongs to Matilda's and Big Bad Mama's finisher only
  // — a generic mid-match "running splash" would step on that and still
  // counts as a leaping move regardless.
  if (tpl === "{B} whips {A} into the turnbuckle, following up with a running splash." && bTrueGiant) return false;
  return true;
}

// A dropkick landing on a giant almost never does much — worth a
// mention on its own whenever one of them is in the match.
const TAPE_DROPKICK_VS_GIANT_LINES = [
  "{Y} tries a dropkick on {X} — it barely even makes her flinch!",
  "{Y} goes for a dropkick, but {X} is just too big for it to do much of anything!",
  "{Y} leaps into a dropkick against {X}, and just bounces right off her!",
];

// Individual "voices" for wrestlers normally grouped as a single combined
// tag-team entry in WRESTLERS — built from their team's own color/photo/role
// so they display consistently, since they don't have standalone entries.
const TAPE_TAG_INDIVIDUALS = [
  { name: "Spike", team: "Heavy Metal Sisters", role: "Heel — Heavy Metal Sister", initials: "SP", color: "#000000", photo: "heavy-metal-spike.jpg", finishers: ["Blow Torch Blast"] },
  { name: "Chainsaw", team: "Heavy Metal Sisters", role: "Heel — Heavy Metal Sister", initials: "CS", color: "#000000", photo: "heavy-metal-spike.jpg", finishers: ["Chainsaw Massacre"] },
  { name: "Arlene", team: "The Housewives", role: "Heel — Housewife", initials: "AR", color: "#90caf9", photo: "housewife-arlene.jpg", finishers: [] },
  { name: "Phyllis", team: "The Housewives", role: "Heel — Housewife", initials: "PH", color: "#90caf9", photo: "housewife-arlene.jpg", finishers: [] },
  { name: "Envy", team: "The Soul Patrol", role: "Heel — Street Punk", initials: "EN", color: "#6a1b9a", photo: "soul-patrol.jpg", finishers: ["Street Weapons"] },
  { name: "Adore", team: "The Soul Patrol", role: "Heel — Street Punk", initials: "AD", color: "#6a1b9a", photo: "soul-patrol.jpg", finishers: ["Street Weapons"] },
  { name: "Mana", team: "The Headhunters", role: "Heel — Tribal Warrior", initials: "MA", color: "#9e9e9e", photo: "headhunters.jpg", finishers: [] },
  { name: "Sara", team: "Sara & Mabel", role: "Heel — Hick", initials: "SR", color: "#6d4c41", photo: "the-hicks.jpg", finishers: [] },
  { name: "Mabel", team: "Sara & Mabel", role: "Heel — Hick", initials: "MB", color: "#6d4c41", photo: "the-hicks.jpg", finishers: [] },
];

const TAPE_ELIGIBLE = [
  ...Object.keys(TAPE_RATINGS)
    .map(name => WRESTLERS.find(w => w.name === name))
    .filter(Boolean),
  ...TAPE_TAG_INDIVIDUALS,
].sort((a, b) => a.name.localeCompare(b.name));

// A curated list of words that stay capitalized within a gimmick label
// even when the label is otherwise lowercased for mid-sentence use —
// genuine proper nouns/adjectives (nationalities, real place names),
// not just stylistic capitalization.
const TAPE_PROPER_WORDS = new Set([
  "American", "All-American", "Beverly", "Hills", "British", "California",
  "Cuban", "German", "Indian", "Latin", "New", "York", "Park", "Avenue",
  "Russian", "Samoan", "Southern", "Texas", "Viking", "America's",
]);

// A couple of gimmicks function as full proper nicknames rather than a
// descriptive title, so they're left exactly as written.
const TAPE_PROPER_LABELS = new Set(["Sweet Lady Liberty", "Woman in Black"]);

// Lowercases a gimmick descriptor for mid-sentence commentary use, while
// leaving real proper nouns/adjectives capitalized (e.g. "Beverly Hills
// Girl" -> "Beverly Hills girl", "The Russian" -> "Russian").
function tapeLowerGimmick(raw) {
  if (TAPE_PROPER_LABELS.has(raw)) return raw;
  return raw
    .split(" ")
    .map(word => {
      const bare = word.replace(/[".,]/g, "");
      return TAPE_PROPER_WORDS.has(bare) ? word : word.toLowerCase();
    })
    .join(" ");
}

// Pull the descriptive part of a role like "Heel — Voodoo Priestess" -> "Voodoo Priestess"
function tapeGimmick(w) {
  const override = TAPE_LABEL_OVERRIDES[w.name];
  if (override) {
    return Array.isArray(override) ? override[Math.floor(Math.random() * override.length)] : override;
  }
  if (!w.role) return "raw talent";
  const parts = w.role.split("—").map(s => s.trim());
  const descriptor = parts.length > 1 && parts[1]
    ? parts[1]
    : (parts[0] === "Face" ? "fan-favorite spirit" : "villainous instinct");
  // Strip a leading "The" (e.g. "The Russian" -> "Russian") so this bare
  // descriptor never carries its own article — every caller (templates,
  // tapeLabel, etc.) adds "the"/"The" itself where it's needed, so this
  // never risks a doubled-up "The The Russian" or "the the Russian".
  const stripped = descriptor.replace(/^The\s+/i, "");
  return tapeLowerGimmick(stripped);
}

// After the intro/entrance, some wrestlers with long compound names
// (the Southern Belles, the Farmer's Daughters) get called by just
// their first name for the rest of the commentary.
const TAPE_SHORT_NAMES = {
  "Tara the Southern Belle": "Tara",
  "Scarlet the Southern Belle": "Scarlet",
  "Sally the Farmer's Daughter": "Sally",
  "Babe the Farmer's Daughter": "Babe",
  "Amy the Farmer's Daughter": "Amy",
  // Two-name wrestlers get called by first name only once the announcer's
  // already given the full formal introduction during the entrance.
  "Tammy Jones": "Tammy",
  "Susie Spirit": "Susie",
  "Debbie Debutante": "Debbie",
  "Ashley Cartier": "Ashley",
  "Cheyenne Cher": "Cheyenne",
  "Roxy Astor": "Roxy",
  "Tiffany Mellon": "Tiffany",
  "Tina Ferrari": "Tina",
};
function tapeShortName(w) {
  // The California Doll gets called just "Doll" some of the time,
  // alongside her full name and gimmick label — not a full replacement.
  if (w.name === "The California Doll" && Math.random() < 0.35) return "Doll";
  return TAPE_SHORT_NAMES[w.name] || w.name;
}

// A gimmick-label alternative to a wrestler's name — "The Russian",
// "The Voodoo Priestess", etc. — used occasionally in match commentary
// for variety instead of repeating the same name every line. Some
// gimmicks are too long for this shorthand use, so they get a shorter
// override here (their actual role field on the bio page is untouched).
const TAPE_LABEL_OVERRIDES = {
  "Sally the Farmer's Daughter": "farm girl",
  "Amy the Farmer's Daughter": "farm girl",
  "Americana": "patriot",
  "Star": ["cosmic traveller", "zodiac girl"],
  "Daisy": "big flower",
};
// A few gimmick nicknames already function as a complete, self-contained
// title — often because of a possessive like "America's" — so putting
// "the"/"The" in front of them reads as broken grammar ("The America's
// Sweetheart"). These are used bare instead, with no article at all.
const TAPE_LABEL_NO_ARTICLE = new Set(["America's sweetheart"]);
function tapeLabel(w) {
  const raw = tapeGimmick(w);
  if (TAPE_LABEL_NO_ARTICLE.has(raw)) return raw;
  // tapeGimmick() (and every override) is always a bare descriptor with
  // no article of its own, so a single "the" in front of it can never
  // double up into "the the X" — capitalizeFirst() upgrades it to "The"
  // automatically if it lands at the start of a sentence.
  return "the " + raw;
}

// A few "finishers" are really just a plain-English wrestling move name
// rather than a stylized nickname — correctly capitalized on the bio
// page, but lowercased here for natural mid-sentence Tale of the Tape
// commentary (bio data itself is untouched).
const TAPE_FINISHER_DISPLAY_OVERRIDES = {
  "Daisy": "side suplex",
};
function tapeFinisherDisplay(w) {
  return TAPE_FINISHER_DISPLAY_OVERRIDES[w.name] || (w.finishers && w.finishers[0]);
}

// After all token substitution, capitalize the start of every sentence
// in a generated line — mid-sentence tokens like tapeLabel()'s "the X"
// stay lowercase, but any time one lands right after a ./!/? (the start
// of a new sentence, whether that's the very beginning of the line or
// somewhere in the middle of it, like after an exclamation), it needs a
// capital letter like any other sentence start.
function capitalizeFirst(str) {
  if (!str) return str;
  return str.replace(/(^\s*|[.!?]"?\s+)([a-z])/g, (match, lead, letter) => lead + letter.toUpperCase());
}

// A few templates hardcode their own "The"/"the" directly in front of a
// {winnerGimmick}/{rGimmick}-style token, which collides with a no-article
// nickname like "America's Sweetheart" (already a complete title on its
// own) to produce broken grammar like "The America's Sweetheart". This
// strips that redundant article wherever it happens to land.
function stripRedundantArticles(str) {
  return str.replace(/\b(?:The|the)\s+(America's sweetheart)\b/g, "America's sweetheart");
}

// A normalized "opening phrase" signature for a line — used to make
// sure two wrestlers in the same match don't both get an entrance
// starting with the same phrase (e.g. two "Here comes X" openers).
function tapeLineOpener(line) {
  return line.trim().split(/\s+/).slice(0, 2).join(" ").toLowerCase().replace(/[^a-z]/g, "");
}

function simulateTapeMatch(a, b) {
  // Palestina carries her machete to the ring — 5% of matches she
  // actually tries to use it, and about half the time that gets her
  // caught and disqualified (not a guaranteed DQ every time she pulls it).
  let palestinaMachete = null;
  const palestinaInMatch = [a, b].find(w => w.name === "Palestina");
  if (palestinaInMatch && Math.random() < 0.05) {
    palestinaMachete = true;
    if (Math.random() < 0.5) {
      const opponent = palestinaInMatch === a ? b : a;
      return { winner: opponent, loser: palestinaInMatch, method: "dq", palestinaMachete: true, palestinaMacheteDQ: true };
    }
  }

  // A notable in-match injury sometimes strikes before the outcome's
  // even decided — a specific move lands hard and leaves a mark. Once
  // it happens, that wrestler is carrying it for the rest of the
  // night, making her a real 25% less likely to close the show, not
  // just a line of flavor text.
  let injured = null;
  let injuryMove = null;
  if (Math.random() < 0.22) {
    injured = Math.random() < 0.5 ? a : b;
    const injuryOpponent = injured === a ? b : a;
    injuryMove = tapeMove(injuryOpponent);
  }

  // A handful of wrestlers will go digging under the ring apron for a
  // weapon — a length of rope, a stray stick — when the opportunity
  // presents itself. Grabbing it happens about a quarter of the time;
  // actually getting caught and disqualified for using it only happens
  // 5% of the times she grabs it, so the DQ itself stays rare even
  // though the weapon shows up in the match fairly often.
  const underRingCandidate = [a, b].find(w => TAPE_UNDERRING_WEAPON_WRESTLERS.has(w.name));
  let weaponGrabbed = null;
  if (underRingCandidate && Math.random() < 0.25) {
    weaponGrabbed = underRingCandidate;
    if (Math.random() < 0.05) {
      const opponent = underRingCandidate === a ? b : a;
      return { winner: opponent, loser: underRingCandidate, method: "dq", underRingWeapon: true, weaponGrabbed, injured, injuryMove, palestinaMachete };
    }
  }

  // Every so often the referee gets knocked out cold mid-match — half
  // the time (so 2.5% of matches overall) the heel takes advantage of
  // the blackout to cheat her way to an outright win; the other half
  // it's just chaos that doesn't actually change the outcome.
  let refKnockedOut = null;
  if (Math.random() < 0.05) {
    refKnockedOut = true;
    if (Math.random() < 0.5) {
      return { winner: a, loser: b, method: "normal", refKnockedOut: true, refKnockedOutDecisive: true, weaponGrabbed, injured, injuryMove, palestinaMachete };
    }
  }

  if (TAPE_ALWAYS_DQ.has(a.name) || TAPE_ALWAYS_DQ.has(b.name)) {
    const dqSide = TAPE_ALWAYS_DQ.has(a.name) ? a : b;
    const opponent = dqSide === a ? b : a;
    // Extremely rare: even the Heavy Metal Sisters' blatant weapon use
    // sometimes slips past the referee entirely, and she wins clean.
    if (Math.random() < 0.01) {
      return { winner: dqSide, loser: opponent, method: "normal", refMissed: true, weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
    }
    return { winner: opponent, loser: dqSide, method: "dq", weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
  }
  // The Dirty Wrestlers get themselves disqualified about half the time.
  const dirtyWrestler = [a, b].find(w => TAPE_DIRTY_WRESTLERS.has(w.name));
  if (dirtyWrestler && Math.random() < 0.5) {
    const opponent = dirtyWrestler === a ? b : a;
    return { winner: opponent, loser: dirtyWrestler, method: "dq", weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
  }
  // Some of the roster's dirtiest players — the Housewives, the Soul
  // Patrol, Matilda the Hun, and Palestina — occasionally get away with
  // whatever cheating they're up to (a hidden weapon, an unseen shove,
  // even help from Aunt Kitty) and steal the win outright.
  const dirtyWinCandidate = [a, b].find(w => TAPE_DIRTY_WIN_ELIGIBLE.has(w.name));
  if (dirtyWinCandidate && Math.random() < 0.05) {
    const opponent = dirtyWinCandidate === a ? b : a;
    return { winner: dirtyWinCandidate, loser: opponent, method: "normal", dirtyWin: true, weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
  }
  // A rare double disqualification — both wrestlers brawl their way
  // outside the ring, the referee completely loses control, and the
  // match is thrown out with no winner declared.
  if (Math.random() < 0.05) {
    return { winner: null, loser: null, method: "double_dq", weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
  }
  // In the spirit of GLOW's chaos, roughly 1 in 5 matches ends in a DQ
  // regardless of who's wrestling — and it's almost always the heel's
  // fault, since a is always the heel side.
  if (Math.random() < 0.2) {
    const dqSide = Math.random() < 0.97 ? a : b;
    const opponent = dqSide === a ? b : a;
    return { winner: opponent, loser: dqSide, method: "dq", weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
  }

  // Extremely rare: Aunt Kitty herself sneaks ringside and slips her
  // wrestler (always the heel, since a is always Kitty's Killers-aligned)
  // a weapon — the referee never catches it, and it's enough to win the
  // match outright.
  if (Math.random() < 0.01) {
    return { winner: a, loser: b, method: "normal", auntKitty: true, weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
  }

  // Every so often, somebody just plain cheats — nothing specific to
  // her character, just an ordinary bit of rule-breaking — and the
  // referee flat-out misses it. She gets away with it completely and
  // wins the match outright. Little Fiji never cheats — she's not
  // physically capable of winning on her own regardless of method, so
  // she's excluded from ever being picked here.
  if (Math.random() < 0.02) {
    const cheatCandidates = [a, b].filter(w => w.name !== "Little Fiji");
    if (cheatCandidates.length === 2) {
      const cheater = Math.random() < 0.5 ? a : b;
      const opponent = cheater === a ? b : a;
      return { winner: cheater, loser: opponent, method: "normal", refMissedCheating: true, weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
    } else if (cheatCandidates.length === 1) {
      const cheater = cheatCandidates[0];
      const opponent = cheater === a ? b : a;
      return { winner: cheater, loser: opponent, method: "normal", refMissedCheating: true, weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
    }
  }

  // Outside interference from a random third wrestler — she only ever
  // helps her own side (a is always the heel, b is always the face), so
  // heels get helped by heels and faces get helped by faces. Only 10% of
  // the time does the referee actually catch it and disqualify the
  // beneficiary's side over it — the rest of the time it slips by
  // entirely and just tips the match in the beneficiary's favor.
  const interferenceCandidates = TAPE_ELIGIBLE.filter(w => w.name !== a.name && w.name !== b.name && w.role);
  let interference = null;
  if (interferenceCandidates.length > 0 && Math.random() < 0.15) {
    const helper = interferenceCandidates[Math.floor(Math.random() * interferenceCandidates.length)];
    const beneficiary = helper.role.startsWith("Heel") ? a : b;
    const caught = Math.random() < 0.1;
    interference = { helper, beneficiary, caught };
    if (caught) {
      const opponent = beneficiary === a ? b : a;
      return { winner: opponent, loser: beneficiary, method: "dq", interference, weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
    }
  }

  const ra = TAPE_RATINGS[a.name] || 5;
  const rb = TAPE_RATINGS[b.name] || 5;
  // Each point of rating gap roughly doubles the favorite's odds — a big
  // gap (e.g. 10 vs 5) is a near-lock, a small gap (10 vs 9) is close but
  // still favors the higher rating almost every time.
  const oddsRatio = Math.pow(3, ra - rb);
  let pa = oddsRatio / (oddsRatio + 1);
  // Interference that slipped past the ref gives its beneficiary a real
  // boost to her actual odds of winning, not just a flavor line.
  if (interference && !interference.caught) {
    pa = interference.beneficiary === a ? Math.min(0.95, pa + 0.25) : Math.max(0.05, pa - 0.25);
  }
  // The injury picked up earlier really does cost her — a real 25%
  // knock off her odds of winning the match outright.
  if (injured) {
    pa = injured === a ? Math.max(0.05, pa - 0.25) : Math.min(0.95, pa + 0.25);
  }
  const winner = Math.random() < pa ? a : b;
  const loser = winner === a ? b : a;

  // Little Fiji is badly overmatched against just about anybody — when
  // she's about to lose, there's a real chance her big sister Mt. Fiji
  // storms the ring mid-match to save her, either pulverizing the
  // opponent or scaring her off entirely. Either way, the match gets
  // thrown out in Little Fiji's favor.
  const littleFijiInMatch = [a, b].find(w => w.name === "Little Fiji");
  if (littleFijiInMatch && loser === littleFijiInMatch && Math.random() < 0.33) {
    const opponent = littleFijiInMatch === a ? b : a;
    return { winner: littleFijiInMatch, loser: opponent, method: "dq", mtFijiRescue: true, weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
  }

  // Little Fiji never wins on her own physical merit — she's simply not
  // a threat in a straight fight. Whenever the math would otherwise hand
  // her a clean win, it gets converted into the only two ways she's ever
  // actually seen winning: a face wrestler knocking the heel out cold at
  // ringside, or the heel getting herself disqualified.
  if (littleFijiInMatch && winner === littleFijiInMatch) {
    const opponent = littleFijiInMatch === a ? b : a;
    if (Math.random() < 0.5) {
      const knockoutCandidates = TAPE_ELIGIBLE.filter(w => w.role && w.role.startsWith("Face") && w.name !== a.name && w.name !== b.name);
      const knockoutHelper = knockoutCandidates.length > 0
        ? knockoutCandidates[Math.floor(Math.random() * knockoutCandidates.length)]
        : null;
      return { winner: littleFijiInMatch, loser: opponent, method: "dq", littleFijiKnockoutWin: true, knockoutHelper, weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
    }
    return { winner: littleFijiInMatch, loser: opponent, method: "dq", weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
  }

  // Zelda isn't much of a wrestler — she gets by on wit alone — so when
  // she's about to lose, there's a decent chance she gets some kind of
  // help late in the match that turns the tide in her favor.
  const zeldaInMatch = [a, b].find(w => w.name === "Zelda");
  if (zeldaInMatch && loser === zeldaInMatch && Math.random() < 0.25) {
    const opponent = zeldaInMatch === a ? b : a;
    return { winner: zeldaInMatch, loser: opponent, method: "normal", zeldaHelp: true, weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
  }

  return { winner, loser, method: "normal", interference, weaponGrabbed, refKnockedOut, injured, injuryMove, palestinaMachete };
}

// Size-aware word banks — giants get a heavier, more brutal vocabulary,
// while everybody else draws from a lighter, more excitable pool.
const TAPE_GIANT_WRESTLERS = new Set(["Mt. Fiji", "Matilda the Hun", "Big Bad Mama", "Daisy"]);
const TAPE_ADJ_SMALL = ["crazy", "unbelievable", "impressive", "incredible", "skillful"];
const TAPE_ADJ_GIANT = ["deadly", "brutal", "powerful", "bone-crushing", "devastating"];
function tapeAdjective(w) {
  const pool = TAPE_GIANT_WRESTLERS.has(w.name) ? TAPE_ADJ_GIANT : TAPE_ADJ_SMALL;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Regular and big wrestlers throw around power moves; the smallest,
// most fragile competitors stick to dropkicks and jumps off the ropes.
const TAPE_POWER_MOVES = ["a body slam", "a powerbomb", "a backbreaker", "a big clothesline", "a suplex", "a big boot", "a sunset flip", "a sharp face smack", "a slick reversal", "a piledriver", "a monkey toss", "a choke hold"];
const TAPE_TINY_MOVES = ["a dropkick", "a flying crossbody off the top rope", "a springboard move off the ropes", "a quick jump off the ropes"];
// A handful of wrestlers have such a signature move that it overrides
// the generic size-based pools entirely.
const TAPE_WRESTLER_MOVES = {
  "Jungle Woman": ["a vicious clawing", "a clawing attack"],
};
function tapeMove(w) {
  if (TAPE_WRESTLER_MOVES[w.name]) {
    const pool = TAPE_WRESTLER_MOVES[w.name];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const pool = TAPE_FRAGILE.has(w.name) ? TAPE_TINY_MOVES : TAPE_POWER_MOVES;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Announcer exclamations dropped in for extra flavor and variety.
const TAPE_EMOTION_CALLOUTS = [
  "Oh my goodness!",
  "I don't believe what I'm seeing!",
  "Oh no!",
  "Wow!",
];
function tapeEmotion() {
  return TAPE_EMOTION_CALLOUTS[Math.floor(Math.random() * TAPE_EMOTION_CALLOUTS.length)];
}

// Wrestler-specific insulting descriptors the announcer reaches for —
// falls back to a generic pool if nothing specific applies to her.
const TAPE_WRESTLER_INSULTS = {
  "Mt. Fiji": ["behemoth", "whale", "human iceberg", "walking condo complex"],
  "Matilda the Hun": ["behemoth", "whale", "ugly", "Soviet tank", "battle-axe with a headband"],
  "Big Bad Mama": ["behemoth", "whale", "ugly", "wrecking ball in a leotard", "circus sideshow"],
  "Spike": ["maniac", "psycho", "escaped patient", "leather-clad menace"],
  "Chainsaw": ["maniac", "psycho", "power-tool lunatic", "leather-clad menace"],
  "Arlene": ["Old Maid", "ugly", "bitter old bat", "sourpuss with a rolling pin"],
  "Phyllis": ["Old Maid", "ugly", "bitter old bat", "sourpuss with a rolling pin"],
  "Little Fiji": ["tiny", "fragile", "pipsqueak", "little accident waiting to happen"],
  "Little Feather": ["tiny", "fragile", "pipsqueak", "little accident waiting to happen"],
  "Beastie": ["ugly", "animal", "zoo escapee", "road-kill reject"],
  "Stinky": ["foul-smelling", "walking dumpster", "human hazmat spill", "garbage disposal in tights"],
  "Colonel Ninotchka": ["Commie", "Traitor", "Iron Curtain reject", "Red Army washout"],
  "Major Tanya": ["Bolshevik", "Commie", "Kremlin flunky", "Soviet stooge"],
  "Zelda": ["puny", "little gremlin", "sideshow imp", "pint-sized pest"],
  "Attaché": ["mercenary washout", "army surplus reject", "gun for hire", "spitting menace"],
  "Corporal Kelly": ["trigger-happy grunt", "army surplus reject", "gun-toting menace"],
  "Habana": ["Cuban thug", "assassin wannabe", "back-alley brawler"],
  "Palestina": ["desert rat", "sand-blasted menace", "camel-riding bruiser"],
  "Gremlina": ["evil little gremlin", "sideshow imp", "pint-sized pest"],
  "Godiva": ["horned menace", "Viking reject", "battle-axe with a helmet"],
  "Envy": ["street punk", "gutter thug", "back-alley bruiser"],
  "Adore": ["street punk", "gutter thug", "back-alley bruiser"],
};
const TAPE_GENERIC_INSULTS = ["clown", "trainwreck", "disaster", "mess", "circus act", "sideshow reject", "loose cannon", "walking punchline"];
function tapeInsult(w) {
  const pool = TAPE_WRESTLER_INSULTS[w.name] || TAPE_GENERIC_INSULTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Positive/other announcer descriptors reserved for specific wrestlers —
// paired with dedicated compliment lines below, inserted separately from
// the roast system since these are the opposite tone.
const TAPE_WRESTLER_DESCRIPTORS = {
  "Tara the Southern Belle": ["beauty"],
  "The California Doll": ["beauty"],
  "Godiva": ["beauty"],
  "Ashley Cartier": ["beauty"],
  "Tina Ferrari": ["fan-favorite"],
  "Susie Spirit": ["fan-favorite"],
  "Mt. Fiji": ["fan-favorite", "powerhouse"],
  "Americana": ["fan-favorite"],
  "Matilda the Hun": ["powerhouse"],
  "Big Bad Mama": ["powerhouse"],
  "Daisy": ["tall"],
  "Beastie": ["Road Warrior"],
};
const TAPE_DESCRIPTOR_LINES = {
  "beauty": [
    "{X} is a stone-cold knockout out there — the beauty pageant judges would have a field day.",
    "Folks, {X} isn't just here to wrestle — she's here to remind everybody what a real beauty looks like.",
  ],
  "fan-favorite": [
    "This crowd is fully behind {X} tonight — she's an easy fan-favorite, and you can hear it in the building.",
    "{X} feeds off this crowd, and this crowd feeds right back — certified fan-favorite energy in the building tonight.",
  ],
  "powerhouse": [
    "{X} is an absolute powerhouse in that ring — you do not want to be on the wrong end of that strength.",
    "There is nothing subtle about {X}'s game — she is a powerhouse, plain and simple, and {Y} is finding that out the hard way.",
  ],
  "tall": [
    "{X} just towers over {Y} in that ring — that height difference is impossible to miss.",
    "You can't teach that kind of height — {X} looks down on just about everybody in this promotion.",
  ],
  "Road Warrior": [
    "{X} comes out here looking like she just stepped off the set of a post-apocalyptic movie — total Road Warrior vibes.",
    "{X} has that Road Warrior look down cold — leather, attitude, and zero patience for anybody in her way.",
  ],
};
// Godiva is genuinely vain about her looks, but the announcer's disdain
// for heels means her "beauty" compliment always comes out sarcastic —
// acting like she's not all that, even though she clearly is.
const TAPE_GODIVA_SARCASTIC_BEAUTY_LINES = [
  "Godiva clearly thinks she's some kind of knockout out there — the beauty pageant judges might have a few notes, is all I'm saying.",
  "Oh, Godiva wants you all to know how gorgeous she is tonight — folks, I'll let you be the judge of that one yourselves.",
  "Godiva struts around like she just won a beauty contest — somebody forgot to tell her which one, because I sure don't know it.",
  "Godiva keeps admiring herself like she's the belle of the ball — must be a real nice fantasy she's got going on up there.",
];

function tapeDescriptorLine(w, opponent) {
  if (w.name === "Godiva") {
    const pool = TAPE_GODIVA_SARCASTIC_BEAUTY_LINES;
    return pool[Math.floor(Math.random() * pool.length)]
      .replaceAll("{Y}", tapeShortName(opponent));
  }
  const descPool = TAPE_WRESTLER_DESCRIPTORS[w.name];
  if (!descPool) return null;
  const desc = descPool[Math.floor(Math.random() * descPool.length)];
  const linePool = TAPE_DESCRIPTOR_LINES[desc];
  if (!linePool) return null;
  return linePool[Math.floor(Math.random() * linePool.length)]
    .replaceAll("{X}", tapeShortName(w))
    .replaceAll("{Y}", tapeShortName(opponent));
}

const TAPE_ACTION_BEATS = [
  "{A} opens with a stiff clothesline, but {B} answers right back with a dropkick that sends the crowd into a frenzy.",
  "{B} takes early control with a series of forearm shots, backing {A} into the corner.",
  "{A} catches {B} off guard with a quick roll-up for a two count.",
  "The two trade holds in the center of the ring, neither willing to give an inch.",
  "{B} climbs to the top rope, but {A} cuts her off before she can fly.",
  "{A} sends {B} into the ropes for a big shoulder tackle that levels her.",
  "A wild exchange of chops leaves both wrestlers reeling.",
  "{B} locks in a tight headlock, grinding {A} down as the crowd urges on a comeback.",
  "{A} fires up with a series of strikes, turning the tide of the match.",
  "{B} goes for an early pin attempt, but {A} kicks out at two.",
  "Things spill outside the ring briefly before the referee wrangles both wrestlers back in.",
  "{A} and {B} collide in the center of the ring in a dramatic double clothesline spot — both women down!",
  "{B} whips {A} into the turnbuckle, following up with a running splash.",
  "{A} counters a suplex attempt, sending {B} crashing to the mat instead.",
  "The crowd starts a dueling chant as {A} and {B} slug it out toe-to-toe.",
  "{B} takes to the air with a crossbody, but {A} rolls through for a near-fall of her own.",
  "{A} works over {B}'s arm with a series of holds, softening her up.",
  "{B} no-sells a big strike and fires back with one of her own, popping the crowd.",
  "{A} talks trash to the crowd, and {B} makes her pay for the distraction with a quick strike.",
  "The referee warns {A} about choking her opponent — she backs off, but only for a moment.",
  "{B} tries to catch her breath in the corner, but {A} charges in with a running attack.",
  "A close two-count from {A} has the crowd on its feet, sure that's the finish.",
  "{B} reverses an Irish whip, sending {A} hard into the opposite turnbuckle.",
  "The two exchange a series of pinning combinations, each one broken up at the last second.",
  "{A} plants both feet and refuses to budge as {B} bounces off her with a shoulder block.",
  "{A} goes to the eyes — the referee doesn't see it, and {B} staggers backward.",
  "{A} catches {B} mid-air off a crossbody attempt and turns it into a devastating slam.",
  "The pace slows for a moment as {B} methodically targets {A}'s leg.",
  "{A} fires off a flurry of strikes in the corner, and the referee has to pull her back.",
  "{B} tries a sunset flip out of nowhere — {A} sits down hard to block it.",
  "Both wrestlers are down after a brutal double-clothesline spot, and the crowd erupts.",
  "{A} sets {B} up top and looks for something big — but {B} fights her off.",
  "{B} rolls to the apron to regroup, and {A} wastes no time going after her.",
  "The referee's count nearly hits ten as {A} and {B} brawl outside the ring.",
  "{A} kicks out at the very last second, and the arena goes wild.",
  "{B} tries to lock in a submission hold, but {A} makes it to the ropes just in time.",
  "{A} and {B} somehow end up tangled in the ropes together — it takes the referee a full minute to sort out whose limb is whose.",
  "A fan's popcorn goes flying as {B} sends {A} careening into the front row.",
  "{A} tries a move she's clearly never practiced, and it goes about as well as you'd expect.",
  "{B} loses a shoe mid-exchange and just keeps fighting with one foot bare — nobody seems to mind.",
  "{A} and {B} both go for the same pin attempt at the same time and just kind of collide into a heap.",
  "{B} gets tangled in her own tights mid-move, and {A} capitalizes immediately.",
  "The referee gets knocked down in the chaos and just lies there for a second, completely forgotten.",
  "{A} tries to climb the ropes and nearly falls off before she even gets going — the crowd gasps, then laughs.",
  "{B} attempts a dramatic pose mid-match, and {A} just tackles her out of it.",
  "Someone in the front row is holding up a sign that says something about {A}'s mother — she does NOT appreciate it.",
  "{A} unloads with {moveA} that looks absolutely {adjA} — {emotion}",
  "{B} answers right back with {moveB} of her own, and it's every bit as {adjB}!",
  "{A} catches {B} completely off guard with {moveA} out of nowhere — {emotion}",
  "{B} digs deep and comes back with {moveB} that has the whole building buzzing — truly {adjB} stuff!",
  "{A} times it perfectly and connects with {moveA} — {emotion} — {B} is going to feel that one tomorrow!",
  "{B} climbs back to her feet just in time to meet {A} with {moveB}, and it is downright {adjB}!",
  "{A} lets out a scream of pain that the whole arena can hear — {B} clearly connected with something!",
  "{B} is screaming bloody murder after that last exchange — the referee checks in, but she waves him off to keep fighting.",
  "{A} gets right up in the referee's face, arguing over a count that felt too slow for her liking.",
  "{B} throws her hands up arguing with the referee — she is NOT happy with how this is being called.",
  "{A} shoves the referee out of the way mid-argument — that's the kind of thing that gets a wrestler in trouble fast.",
  "{B} works {A}'s arm over, wrenching it back at an angle that has the crowd wincing — she is clearly trying to snap something.",
  "{A} locks in an armbar and just leans back with her whole body weight — {B} is in real trouble if she doesn't get to the ropes.",
  "{A} rears back and slaps {B} clean across the face — the sound alone gets a reaction from the crowd!",
  "{B} answers with a slap of her own, right across {A}'s cheek!",
  "{A} keeps kicking away at {B} while she's still down on the mat — not exactly sportsmanlike, but effective.",
  "{A} stomps {B} while she's down, drawing a stern warning from the referee.",
  "{A} grabs a fistful of {B}'s hair and hauls her up by it — {B} is not happy about that.",
  "{B} yanks {A} down by the hair, using it to control the pace of this exchange.",
  "{A} flips {B} clean over with a well-timed hip toss.",
  "{B} reverses out of a hold and flips {A} onto her back.",
  "{A} locks {B} into a Boston crab right in the center of the ring — {B} is scrambling for the ropes!",
  "{B} counters into a Boston crab of her own, and now {A} is the one in trouble!",
  "{A} comes down with a leg drop, catching {B} right across the chest.",
  "{B} answers with a leg drop of her own, and {A} feels every bit of it.",
];

// Ringside chaos that spills outside the ring — pillars sometimes take
// the impact (and sometimes don't survive it), separate from the
// McLane/Johnny C. pools below since these don't involve either of them
// and can mix freely into any match.
const TAPE_PILLAR_LINES = [
  "{B} whips {A} hard into one of the ringside support pillars — it cracks clean in half on impact!",
  "{A} sends {B} crashing into a pillar at ringside, and the whole thing splinters apart!",
  "{B} catches {A} off guard, driving her back-first into a ringside pillar — it holds, barely, but {A} felt every bit of that.",
  "{A} drives {B} into a support pillar outside the ring — it wobbles but somehow stays standing.",
];

// Ringside run-ins with the show's authority figures — David McLane
// (ring announcer) and Johnny C. (his son, ringside). These two never
// both get name-dropped in the same match — the beats-selection logic
// below picks one side or the other, not both.
const TAPE_MCLANE_LINES = [
  "Out of nowhere, {A} takes a cheap shot at ring announcer David McLane on her way past ringside — he was NOT expecting that!",
  "{A} sends {B} crashing right through David McLane's announcer table at ringside — table's in splinters, and McLane is scrambling to get clear!",
  "{B} answers back, sending {A} flying into McLane's announcer table this time — he barely gets out of the way in time!",
];
const TAPE_JOHNNY_C_LINES = [
  "{A} boots Johnny C. clean out of his chair at ringside on her way by — he did absolutely nothing to deserve that!",
  "Johnny C. barely dodges out of the way as {A} sends {B} crashing into his ringside chair!",
];

// Playful, over-the-top announcer roasting — a GLOW staple. Generic
// enough to fire on anyone, mixed right in with the action beats above.
const TAPE_ROAST_BEATS = [
  "Would ya look at {R} out there, folks — throwing clotheslines like she's got a personal vendetta against the entire roster!",
  "{R} thinks she's got this one in the bag, but confidence don't count for much once the bell rings!",
  "{R} woke up angry today and made the very reasonable decision to stay that way the whole match!",
  "Oh, {R} is TALKING now — talk's cheap, sweetheart, let's see the goods!",
  "{R} has all the grace of a rhinoceros on roller skates — and I mean that as a compliment!",
  "{R}'s {rGimmick} routine is cute, but cute don't win matches, folks!",
  "That's gotta hurt {R}'s pride more than her back!",
  "{R} came out aggressive tonight — or at least came out yelling a lot, which is basically the same thing!",
  "I've seen scarier things at a church bake sale than whatever {R} is trying to pull off right now!",
  "{R} really thinks she's some kind of {insultR} out here — sweetheart, nobody's buying it!",
  "{R} is giving it everything she's got — which, let's be honest, isn't always saying much!",
  "Somebody get {R} a towel, she's sweating through that whole gimmick tonight!",
  "Oh, THAT was original — {R}'s trash talk needs some new material, folks!",
  "{R} struts around like she already owns this ring — somebody should tell her the deed's still up for grabs!",
  "Folks, {R} just said something I can't repeat on air — and honestly, good for her!",
  "{R} just tripped over her own ego, and folks, that thing is HEAVY!",
  "Somebody wake up {R2}, she looks bored — oh wait, no, that's just {R}'s offense doing that to her!",
  "{R} is out here throwing wild forearms — sweetheart, that's not a strategy, that's just blind rage!",
  "I don't know what {R} is doing right now, but I don't think the rulebook covers it, and frankly, neither does good taste!",
  "{R} keeps yelling at the referee like it's going to change something — spoiler alert, it never does!",
  "That's a bold strategy from {R} — completely incoherent, but bold!",
  "Somebody get {R} a stress ball, because whatever's going on in that head of hers is NOT healthy!",
  "The {rGimmick} shtick was fun for about five minutes, {R} — we're well past five minutes now!",
  "{R} just called {R2} a name I can't repeat, which, considering {R}'s vocabulary, is genuinely impressive!",
  "{R} has been snarling at everybody in sight tonight — the ref, the crowd, even Aunt Kitty down at ringside, you name it!",
  "{R} is sweating more than a fan at a heat wave, and this match just started!",
  "That was a big clothesline attempt from {R} — shame it missed by about three feet, folks!",
  "{R} is one bad call away from a full meltdown, and folks, we might already be there!",
  "The crowd's booing {R} so loud I can barely hear myself talk, and honestly? Fair!",
  "{R} is out here cutting promos on herself at this point — nobody else needs to insult her, she's got it handled!",
  "Somebody tell this {insultR} that the ring isn't a dinner buffet — {R2} isn't on the menu tonight!",
  "That's some real {insultR} energy from {R} right there, folks — I don't know how else to put it!",
  "{R} is acting like a total {insultR} out there, and the referee is running out of patience!",
  "You want to talk {insultR}? Look no further than {R} tonight, ladies and gentlemen!",
  "{R2} is doing her best out there, but {R} is being a straight-up {insultR} about the whole thing!",
  "{R} looks like she's got something to prove and absolutely zero patience left to prove it with!",
  "I've had enough of {R}'s attitude to last me a whole season, and we're only one match in!",
  "{R} blows a kiss to the crowd like she's won something — she has not!",
  "Somebody explain to {R} that stalling isn't a strategy, it's just stalling!",
  "{R} is out here talking a big game — shame the wrestling isn't backing it up!",
  "{R} just no-sold a shot that clearly connected — sweetheart, we all saw that!",
  "That temper of {R}'s is doing her exactly zero favors out there tonight!",
  "{R} is out here throwing tantrums like a toddler who just had her toy taken away!",
  "I don't think {R} has landed a clean move all match, but she sure is landing plenty of attitude!",
  "{R} is stomping around like a toddler who missed her nap — somebody get this woman a juice box!",
  "{R} just no-showed an entire exchange arguing with the timekeeper — priorities, folks, priorities!",
  "{R} gets right in {R2}'s face and mouths off — {R2} doesn't say a word back, she just answers with a forearm!",
  "\"Is that all you've got?\" {R} taunts {R2} — turns out it wasn't, and {R2} makes her regret asking!",
  "{R} leans in and says something to {R2} that has the front row gasping — {R2} looks like she's about to lose it!",
  "{R} won't stop running her mouth at {R2} between holds — say what you want about her wrestling, the woman never shuts up!",
  "{R} gets in one last insult at {R2} before the ref separates them — some people just cannot help themselves!",
  "{R} won't stop running her mouth at {R2}, who just keeps wrestling and lets the offense do the talking instead.",
  "Every time {R} opens her mouth, this match gets a little bit worse — and yet here we are again!",
  "{R} is playing to the cameras more than she's playing to win — and it shows!",
  "I've refereed cockfights with better sportsmanship than {R} is showing tonight!",
  "{R} is putting on a real show out there — shame none of it involves actual wrestling!",
  "{R}'s whole strategy tonight seems to be volume — louder isn't the same as better, dear!",
  "{R} just shoved her own tag partner out of the way trying to get at {R2} — there's no team in that gimmick, folks!",
  "{R}'s patience just left the building, and so did any pretense of fair play!",
  "That's twice now {R} has shoved the timekeeper — somebody's getting a stern letter after tonight!",
  "{R} keeps flexing after every single move — sweetheart, we get it, you're strong, now WRESTLE!",
  "I've seen more restraint from a toddler in a candy aisle than {R} is showing right now!",
  "{R} just flipped off the hard camera — folks, I don't think that's going to help her case with the judges!",
];

// Genuinely villainous roast lines — picking fights with the crowd,
// ringside personnel, or inanimate objects out of pure spite. Reserved
// for the heel (roastTarget === a) only; faces don't act like this even
// on their worst night.
const TAPE_HEEL_ONLY_ROAST_BEATS = [
  "{R} is out here picking fights with the barricade now — sweetheart, it's inanimate, it can't hear you!",
  "{R} is out here trash-talking a folding chair — folks, I don't think it's listening!",
  "{R} is one step away from being escorted out of this building by security, and frankly, they're on standby!",
  "{R} just barked something at the timekeeper that I will NOT be repeating on this broadcast!",
  "{R} is picking fights with everybody at ringside tonight — the fans, the crew, the popcorn guy, everybody!",
  "Somebody explain to {R} that the ring ropes are not there for her to yell at!",
];

// Short one-line jokes that occasionally get tacked onto the end of a
// regular action beat, like a color commentator's aside after a move —
// not a full separate beat, just a quick afterthought.
// The Housewives (Arlene & Phyllis) barely wrestle at all — their
// matches are dominated by nagging, insults, and household weapons, with
// only a tiny bit of actual wrestling mixed in. They call any of the
// roster's "beauty" wrestlers a "tramp" specifically; everyone else just
// gets generically nagged at and insulted.
const TAPE_HOUSEWIFE_ROSTER = new Set(["Arlene", "Phyllis"]);
const TAPE_HOUSEWIFE_INSULT_LINES = [
  "{X} isn't even bothering to lock up — she's too busy nagging {Y} about her outfit, her hair, and everything else under the sun!",
  "{X} gets right in {Y}'s face, complaining about absolutely everything — this is more argument than wrestling match at this point!",
  "{X} points a finger at {Y} and just will not stop talking — the referee's trying to call for the bell and {X} is STILL mid-rant!",
  "{X} keeps up a running commentary of complaints the entire match — the ring, the lighting, {Y}'s wardrobe, you name it, she's got a note on it!",
  "\"You call THAT a wrestling move?\" {X} snaps at {Y}, wagging a finger instead of actually locking up!",
  "{X} is nagging {Y} so hard right now I half expect her to send {Y} to bed without any supper!",
  "{X} won't stop griping about {Y} the entire match — I don't think I've heard this much complaining outside of a PTA meeting!",
];
const TAPE_HOUSEWIFE_TRAMP_LINES = [
  "\"You're nothing but a tramp!\" {X} screams at {Y}, jabbing a finger in her face before {Y} can even respond!",
  "{X} looks {Y} up and down and doesn't hold back — \"Tramp! That's all you are, a TRAMP!\"",
  "{X} calls {Y} a tramp at the top of her lungs — half the crowd's booing, half of them are laughing!",
];
const TAPE_HOUSEWIFE_CLEANING_LINES = [
  "{X} takes a swing at {Y} with that rolling pin — more kitchen than combat, but it clearly still stings!",
  "{X} chases {Y} around the ring with a mop, still nagging the entire time — this has stopped resembling wrestling entirely!",
  "{X} unloads a spray of aerosol in {Y}'s direction — housewife warfare in full effect out here!",
  "{X} swats {Y} with a broom between complaints — somewhere in all this nagging there's actually a wrestling match trying to happen!",
  "{X} dumps the contents of a whole bucket on {Y} without missing a beat in her rant — this is chaos, folks, pure chaos!",
];
function tapeHousewifeLine(housewife, opponent, opponentIsBeauty, usedTemplates) {
  let pool;
  if (opponentIsBeauty && Math.random() < 0.5) {
    pool = TAPE_HOUSEWIFE_TRAMP_LINES;
  } else {
    pool = Math.random() < 0.5 ? TAPE_HOUSEWIFE_INSULT_LINES : TAPE_HOUSEWIFE_CLEANING_LINES;
  }
  // Never repeat the exact same line twice in one match — fall back to
  // the full combined pool (minus anything already used) if the chosen
  // category has been exhausted.
  let available = pool.filter(tpl => !usedTemplates.has(tpl));
  if (available.length === 0) {
    const allLines = [...TAPE_HOUSEWIFE_INSULT_LINES, ...TAPE_HOUSEWIFE_TRAMP_LINES, ...TAPE_HOUSEWIFE_CLEANING_LINES];
    available = allLines.filter(tpl => !usedTemplates.has(tpl));
  }
  if (available.length === 0) {
    available = pool;
  }
  const tpl = available[Math.floor(Math.random() * available.length)];
  usedTemplates.add(tpl);
  return tpl
    .replaceAll("{X}", tapeShortName(housewife))
    .replaceAll("{Y}", tapeShortName(opponent));
}

const TAPE_MOVE_AFTERTHOUGHTS = [
  " Somebody call her chiropractor.",
  " That's gonna leave a mark.",
  " I felt that one from up here.",
  " The referee winced. THE REFEREE winced!",
  " Somewhere, a stunt double just filed for workers' comp.",
  " That's coming out of somebody's paycheck.",
  " Even the ring ropes flinched.",
  " I don't think that's legal in most states.",
  " The crowd needed a minute after that one.",
  " That's going in the highlight reel — or the blooper reel.",
  " Somebody's grandmother just gasped in the third row.",
  " I've officially seen everything now.",
  " That was not in the script, folks.",
  " I need a moment. We all need a moment.",
  " The dog outside just started barking. He felt that too.",
  " That's a new one, even for this show.",
  " Somebody get the smelling salts — for the announcer, I mean.",
  " Oh my goodness!",
  " I don't believe what I'm seeing!",
  " Oh no!",
  " Wow!",
];

// A notable in-match injury — set up by simulateTapeMatch's injury roll
// (which already applies the real 25% win-probability penalty). These
// lines describe the moment it happens in detail, tied to the specific
// move that caused it, with a matching set of carryover lines that get
// used later in the same match to keep the injury feeling ongoing
// rather than forgotten the moment it happens.
const TAPE_INJURY_LINES = [
  "{Y} catches {X} with {move}, and {X} goes down hard, clutching at it in real pain — this doesn't look good at all.",
  "{Y} lands {move} flush, and {X} is moving gingerly now, favoring it noticeably with every step.",
  "{X} takes {move} right on the money from {Y} — she's still in this, but you can see her wincing every time she puts weight on it.",
  "{Y} connects with {move}, and {X}'s whole body seizes up for a second — the referee actually checks on her before the match continues.",
  "That's a nasty landing for {X} off {move} — she's holding it and shaking out the pain, trying not to let {Y} see how much that hurt.",
  "{X} crumples after {move} from {Y}, and for a second there it looks like this might be over right then and there.",
];
const TAPE_INJURY_CARRYOVER_LINES = [
  "{X} is still favoring that same spot from earlier — {Y} zeroes right back in on it like she's been waiting for the opening.",
  "You can see {X} protecting that same area she banged up before — it's clearly still bothering her, and {Y} knows it.",
  "That earlier injury hasn't gone anywhere — {X} is moving noticeably slower on that side, and {Y} isn't about to let her forget it.",
  "Every time {X} plants on that side, you can see it in her face — {Y} keeps testing it on purpose now.",
  "{X} is fighting through it, but that injury from earlier is clearly still there, and {Y} is targeting it relentlessly.",
];

const TAPE_TURNING_POINT_BEATS = [
  "You can smell it in the air, folks — {loser}'s in trouble, and {winner} is circling like she already knows how this ends.",
  "{loser} is gassed, {winner} is not — and in this business, that's usually all she wrote.",
  "This has officially become {winner}'s living room, and {loser} is just visiting.",
  "{loser} throws a Hail Mary — a desperate, low-percentage move with nothing behind it except hope — but {winner} swats it away like it's nothing.",
  "The crowd's already counting along in their heads — everybody in this building knows what's coming next.",
  "{loser} is running on fumes and bad decisions at this point, while {winner} looks like she's just getting warmed up.",
  "You could set your watch by this — {winner} is about to close the show, and {loser} can't do a thing about it.",
  "{loser} digs deep for one more push — finds absolutely nothing down there — and {winner} capitalizes immediately.",
  "Something just flipped a switch in {winner} that nobody saw coming, and {loser} has no answer for it.",
  "{winner} has that look now, folks — the one that means this is about to be over.",
  "{loser} is out of gas and out of ideas, and {winner} knows it better than anybody in this building.",
  "This crowd senses blood in the water — {winner} is closing in, and {loser} has nowhere left to go.",
  "{loser}'s legs are wobbling, her offense has dried up — {winner} smells the finish line.",
  "There's a shift in momentum you can feel from the cheap seats — {winner} is taking over completely.",
  "{loser} is completely on her own out there now — {winner} is not about to let up.",
  "It's been a fight, but {winner} is finding another level, and {loser} just doesn't have an answer for it.",
  "{loser} takes one big, wild swing with everything she has left — {winner} ducks it clean, and now it's just a matter of time.",
  "You can see it drain out of {loser} in real time — {winner} has completely broken her will to keep fighting.",
  "{winner} isn't just winning the match anymore, she's dismantling {loser} piece by piece.",
  "{loser} tries to catch her breath in the corner, but {winner} isn't giving her the chance.",
  "Every exchange from here on out is one-sided — {winner} has this thing on lockdown.",
  "{loser} is holding on more out of stubbornness than strategy at this point, and {winner} knows it.",
];

// When the talent gap is huge, the match doesn't need a real
// back-and-forth — a single decisive blow ends it fast, ratings-friendly
// squash style.
const TAPE_SQUASH_LINES = [
  "This isn't even a contest, folks — {winner} catches {loser} with one single shot, and it's already over before it started!",
  "{winner} doesn't even need a game plan here — one big move on {loser} and this one's done in a flash!",
  "That's all she wrote, folks — a single, decisive blow from {winner}, and {loser} is finished before the crowd even gets settled in!",
  "No feeling-out process needed — {winner} ends this in one shot, and {loser} never had a chance!",
];

// A rare chaos finish — both wrestlers brawl their way outside the ring
// entirely, the referee loses all control, and the match gets thrown
// out with no winner declared.
// The specific illegal chaos that tips a match into a double DQ — named
// so it feels like an actual called infraction, not just "they fought."
const TAPE_DOUBLE_DQ_ILLEGAL_LINES = [
  "{A} starts choking {B} against the ropes, and {B} isn't playing fair either — she grabs a fistful of {A}'s hair and won't let go!",
  "Both {A} and {B} completely ignore the referee's warnings — {A} goes for a choke, {B} fires back with closed fists, and this has stopped being wrestling entirely!",
  "{A} grabs a chair from ringside, {B} answers with one of her own — this has turned into an all-out brawl with weapons on both sides!",
  "{A} starts choking {B} right in the corner while {B} claws right back at her — the referee is practically screaming at both of them to stop!",
  "Both women are throwing the rulebook out entirely — {A}'s choking, {B}'s biting, and neither one is letting up!",
  "{A} has {B} by the throat against the ropes, and {B} responds by raking her across the eyes — the referee's seen more than enough!",
  "This has spilled outside the ring entirely — {A} smashes {B} into the ring post, and {B} fires right back, sending {A} into the pillar on the other side!",
  "Both women are trading shots at ringside now — {A} slams {B} into the barricade, and {B} answers by driving {A} straight into the ring post!",
];

// The referee's count escalates as both wrestlers keep going, ignoring
// every warning, before he finally throws the whole match out.
const TAPE_DOUBLE_DQ_COUNT_LINES = [
  "The referee starts counting — five, ten, fifteen — and neither {A} nor {B} is making any effort to break it up!",
  "He's up to a twenty count now, and both of them are still going at it like the referee isn't even there!",
  "The referee counts all the way to twenty, practically begging them to stop, and neither one listens for a second!",
  "Fifteen... eighteen... twenty — the referee's count runs out, and {A} and {B} are STILL brawling!",
  "The referee gets to a full twenty count with both of them still swinging — he's out of patience and out of options!",
];

const TAPE_DOUBLE_DQ_LINES = [
  "This has completely broken down — {A} and {B} have brawled their way outside the ring and neither one is stopping! The referee's had enough — this is a double disqualification! No winner tonight!",
  "Forget wrestling, folks — {A} and {B} are just flat-out brawling at ringside now, chairs flying and everything! The referee calls it off entirely — double DQ, no winner!",
  "The referee is completely losing control of this one — {A} and {B} have taken this fight into the crowd! He's calling for the bell — double disqualification, and this match has no winner!",
  "Both women are just going at it outside the ring now, nobody's listening to the referee anymore — he throws the whole match out! Double DQ — no winner tonight, folks!",
];

// The dirtiest players in GLOW occasionally get away completely clean —
// a hidden weapon, an unseen shove, even a nudge from Aunt Kitty — and
// steal the win instead of getting caught for once.
const TAPE_DIRTY_WIN_LINES = [
  "Somehow {X} gets away with every dirty trick in the book tonight — the referee just doesn't catch it, and {Y} pays the price!",
  "Is that Aunt Kitty I see slipping something to {X} at ringside? Whatever it is, the referee misses it completely — and {X} capitalizes!",
  "{X} has been cheating all match long, and for once none of it catches up with her — {Y} never sees the finish coming!",
  "The referee's looking the other way at exactly the wrong moment — {X} takes full advantage, and {Y} has no idea what just happened!",
  "{X} gets away with murder out here tonight, and the referee somehow misses every bit of it!",
];

// Even the Heavy Metal Sisters' blatant weapon use occasionally slips
// past the referee entirely.
const TAPE_REF_MISSED_LINES = [
  "The referee's back is turned at exactly the wrong moment — {X} gets away with it completely, and {Y} pays for it!",
  "Somehow the referee misses the whole thing — {X} catches an enormous break tonight, and {Y} is the one who suffers for it!",
  "I don't know how the ref didn't see that, but he didn't — {X} skates by clean, and {Y} is left picking up the pieces!",
];

// Ordinary, unglamorous cheating — a handful of tights, a boot on the
// ropes — that the referee just plain doesn't catch.
const TAPE_REF_MISSED_CHEATING_LINES = [
  "The referee's back is turned at exactly the wrong moment — {winner} grabs a fistful of tights for leverage on that pin, and nobody catches it! ONE, TWO, THREE!!",
  "{winner} has her feet up on the ropes for extra leverage on that cover — the referee doesn't see it, and counts it anyway! ONE! TWO! THREE!!",
  "Somehow the referee completely misses {winner} cheating her way through that finish — {loser} is left arguing with him after the fact, but the decision stands!",
  "{winner} gets away with one right there — a handful of hair, a boot on the ropes, something — and the referee counts the pin clean! ONE, TWO, THREE!!",
];

// These two are notoriously fragile — when either one loses, there's a
// good chance the commentary calls attention to just how outmatched
// she was physically, not just competitively.
const TAPE_FRAGILE = new Set(["Little Fiji", "Little Feather", "Zelda"]);
const TAPE_FRAGILE_LOSS_LINES = [
  "It's honestly hard to watch — {loser} is so fragile that {winner} barely had to try.",
  "{loser}'s small frame just isn't built to withstand offense like this. Tough night for her.",
  "{loser} goes down hard — she's always been one of the most fragile wrestlers on the roster, and it shows.",
];

// After a rough loss for Little Fiji specifically, her big sister Mt. Fiji
// sometimes shows up to check on her — as long as Mt. Fiji wasn't the one
// who beat her up in the first place.
const TAPE_FIJI_RESCUE_LINES = [
  "The bell's barely rung before Mt. Fiji comes STORMING down to ringside — and she's not here to check on anybody! She flattens {winner} with a clothesline that nearly takes her head clean off!",
  "Little Fiji is still down, and here comes big sister Mt. Fiji — {winner} never sees it coming before Mt. Fiji absolutely mauls her right there at ringside!",
  "This just became {winner}'s worst nightmare — Mt. Fiji charges the ring and unloads on her for what she did to Little Fiji! Somebody get security out here, NOW!",
  "Mt. Fiji doesn't even bother with a strike — she just scoops {winner} up into a crushing bear hug right there at ringside, and {winner} looks like she might actually pass out!",
];

// Little Fiji is badly overmatched physically against just about anybody
// — sometimes, right in the middle of a beating, big sister Mt. Fiji
// storms the ring mid-match to put a stop to it entirely. The match gets
// thrown out in Little Fiji's favor either way, whether {loser} gets
// pulverized or just runs for it.
const TAPE_MT_FIJI_MIDMATCH_RESCUE_LINES = [
  "Wait a minute — that's Mt. Fiji storming down to the ring! She's seen enough of {loser} manhandling her little sister, and she throws {loser} clean out of the ring! The referee's got no choice — this one's thrown out, Little Fiji wins by disqualification!",
  "Out of nowhere, Mt. Fiji charges the ring and just flattens {loser} with a clothesline — she isn't getting up anytime soon, and the referee calls the whole thing off! DQ, Little Fiji gets the win!",
  "Here comes Mt. Fiji, and she is NOT happy — one look at her and {loser} takes off running, bailing out through the crowd rather than deal with her! The referee has no choice but to call this one — Little Fiji wins by disqualification!",
  "Mt. Fiji comes barreling in to save her little sister, and {loser} wants absolutely no part of it — she scrambles out of the ring and doesn't look back! Match's thrown out, Little Fiji wins by DQ!",
];

// Little Fiji physically cannot win a fair fight — every one of her wins
// traces back to a face wrestler knocking the heel out cold at ringside.
// {helper} gets filled with whoever's doing the knocking (falls back to
// a generic "someone" if no eligible helper turned up).
const TAPE_LITTLE_FIJI_KNOCKOUT_WIN_LINES = [
  "Out of nowhere — {helper} comes flying in from ringside and lays {loser} out cold with a forearm shot! The referee has no choice — this one's over, Little Fiji wins by disqualification!",
  "Did you SEE that? {helper} just knocked {loser} out cold from behind! The ref calls it immediately — Little Fiji gets the win, and she didn't even have to lift a finger for that one!",
  "{helper} storms the ring and flattens {loser} before she even knows what hit her — {loser}'s not moving, and the referee's got no choice but to give this one to Little Fiji by DQ!",
  "Somebody call it — {helper} just cracked {loser} over the head from ringside and she's out cold! Little Fiji wins this one by disqualification, and she never landed a single blow!",
];

// Zelda isn't much of a wrestler — she gets by on wit alone — so when
// she's about to lose, help sometimes arrives late in the match to turn
// things around for her.
const TAPE_ZELDA_HELP_LINES = [
  "Late in this one, out of nowhere, {loser} gets tripped up by something at ringside — nobody's quite sure what happened, but {winner} capitalizes immediately for the pin! ONE, TWO, THREE!!",
  "Just when it looks like it's over, {winner} gets a mysterious assist out of nowhere — {loser} never sees it coming, and it's enough to steal the win! ONE! TWO! THREE!!",
  "With time running out, somebody — nobody can quite say who — gives {winner} the opening she needed, and she makes {loser} pay for it! ONE, TWO, THREE!! Where did THAT come from?",
];

// When the referee gets knocked out cold, sometimes the heel makes the
// absolute most of it before a replacement ref even gets out here.
const TAPE_REF_KNOCKOUT_DECISIVE_LINES = [
  "The referee gets caught in the crossfire and goes down HARD — completely out cold! With nobody watching, {winner} goes to work on {loser} with everything she's got — but the ref comes to just in the nick of time to see the cover, and counts it groggy but official! ONE! TWO! THREE!!",
  "Somebody clips the referee by accident, and he's out cold on the mat! {winner} wastes zero time taking full advantage while nobody's watching — and just as she goes for the cover, the referee shakes it off and slaps the mat! ONE, TWO, THREE! He's dazed, but he saw enough to count it!",
];

// Other times, the referee getting knocked out is just chaos — the
// heel gets away with plenty while he's down, but it's not enough to
// actually change how this one ends.
const TAPE_REF_KNOCKOUT_FLAVOR_LINES = [
  "The referee gets knocked out cold in the chaos — completely unconscious for a moment there! {X} tries to take advantage, getting away with all sorts of illegal stuff while he's out, but it's not quite enough to change the outcome.",
  "The referee goes down and out for a few seconds — {X} makes the most of it, getting in some cheap shots nobody's around to call, but the match still plays out the way it was always going to.",
];

// The Heavy Metal Sisters' weapons chaos sometimes gets so out of hand
// that security has to physically remove them after the match.
const TAPE_SECURITY_CARRYOFF_LINES = [
  "Security has to come out and drag {X} away from ringside — this one got completely out of hand.",
  "{X} isn't going quietly — it takes several security guards to haul her out of the arena.",
];

// Colonel Ninotchka can't just accept a win quietly — the mic comes
// right back out afterward for another round of Motherland propaganda.
const TAPE_NINOTCHKA_POST_WIN_LINES = [
  "{X} grabs the mic again after the bell — \"You see?! Russia is STRONG! America is weak, soft, pathetic — always it loses to the Motherland!\"",
  "{X} isn't done yet — she snatches the mic and gloats — \"This is what happens when America faces REAL strength! Long live the Motherland!\"",
  "{X} grabs the mic one more time, practically glowing with pride — \"Another victory for Russia! America, take note — you cannot compete with us!\"",
];

// Big Bad Mama's whole strategy is sitting on people — except against
// Mt. Fiji, who's just as big as she is.
const TAPE_MAMA_CRUSH_LINES = [
  "{winner} simply sits down right on top of {loser} and crushes her under all that weight — there's nothing {loser} can do about it.",
  "{winner} doesn't bother with fancy offense — she just plants herself on {loser} and lets her sheer size do the rest.",
];

// A handful of wrestlers occasionally go digging under the ring apron
// for a weapon — a length of rope, a stray stick — and use it on their
// opponent. This specific pool is for the rare times the referee
// actually catches it and calls for the DQ.
const TAPE_UNDERRING_WEAPON_LINES = [
  "{loser} reaches under the ring apron and comes up with a length of rope — she wraps it around {winner}'s throat, and the referee's seen enough! DISQUALIFIED!",
  "{loser} digs underneath the ring and pulls out a stray wooden stick, cracking {winner} across the back with it — that's an automatic disqualification!",
  "Where did {loser} even find that? She grabs something from underneath the ring — looks like rope — and goes to work on {winner} with it! DQ, no question about it!",
  "{loser} ducks under the apron and comes back up swinging a stick she found down there — the referee calls it immediately! Disqualified!",
  "{loser} disappears under the ring for a second and comes back with a length of rope in hand — {winner} doesn't stand a chance against it, and the ref's already calling for the bell! DISQUALIFIED!",
];

// Most of the time, grabbing that rope or stick from under the ring
// doesn't actually draw a disqualification — the referee just doesn't
// catch it, and it's simply part of the action.
const TAPE_UNDERRING_WEAPON_FLAVOR_LINES = [
  "{X} reaches under the ring apron and comes up with a length of rope — she gets a shot in on {Y} with it before the referee even notices!",
  "{X} digs underneath the ring and grabs a stray stick, cracking {Y} with it while the referee's attention is elsewhere!",
  "Did anybody else see that? {X} pulled something out from under the ring — looked like rope — and used it on {Y} right there!",
  "{X} ducks under the apron and comes back up with a stick in hand, catching {Y} off guard with it!",
];

// Palestina occasionally actually pulls her machete out mid-match — the
// DQ version gets its own finish line; the version where she gets away
// with it just becomes part of the action, same as the underring
// weapon flavor lines above.
const TAPE_PALESTINA_MACHETE_DQ_LINES = [
  "{loser} pulls out that machete and swings it right at {winner} — the referee's seen enough! DISQUALIFIED, no question about it!",
  "{loser} actually goes for the machete this time, and the referee calls it immediately — that's an automatic disqualification!",
  "There it is — {loser} pulls the machete on {winner}, and the referee wants absolutely no part of letting this continue! DQ!",
];
const TAPE_PALESTINA_MACHETE_FLAVOR_LINES = [
  "{X} flashes that machete of hers at {Y} — doesn't actually use it, but the message is loud and clear.",
  "{X} pulls the machete out for a second, waving it menacingly at {Y}, before tucking it away as the referee turns around just in time to miss it.",
  "{X} brandishes the machete right in {Y}'s face — the referee's back is turned, and somehow nobody official catches it.",
];

const TAPE_DQ_TEMPLATES = [
  "WAIT — {loser} just grabbed a chair from ringside! The referee's had enough — HE'S CALLING FOR THE BELL! {winner} wins by disqualification!",
  "{loser} chokes {winner} out with the ring rope and just won't let go — the ref counts to five and calls it right there! DISQUALIFIED!",
  "That's a low blow if I've ever seen one! {loser} goes below the belt, and the referee doesn't hesitate — DQ!",
  "{loser} just raked {winner}'s eyes right in front of the referee — no way to ignore that one! DISQUALIFIED!",
  "{loser} yanks a fistful of {winner}'s hair and just won't let go, even with the ref right there counting — that's a DQ!",
  "{loser} tosses {winner} clean over the top rope to the floor — automatic disqualification, no way around it!",
  "Somebody just ran in from the back to jump {winner} — {loser}'s getting disqualified for the interference!",
  "The referee calls for a clean break, and {loser} just keeps throwing punches anyway — that's a DQ, plain and simple!",
  "{loser} had something hidden in her boot, and the referee just found it before she could even use it — DISQUALIFIED!",
  "{loser} just can't help herself — the ref rings the bell, {winner} wins by DQ, and the ring's turned into a zoo!",
  "No, no, NO — {loser} is not supposed to do that! The referee calls it off right there — {winner} gets the win, but not the way she wanted it!",
  "{loser} keeps attacking {winner} well after the ref calls for the break — that's exactly the kind of thing that gets you disqualified!",
  "{loser} shoves the referee flat on his back trying to get at {winner} — you do NOT put your hands on the ref! DISQUALIFIED!",
];

// The dirty/crazy wrestlers get called out for their actual signature
// weapon when they cause the DQ, instead of the generic templates above.
const TAPE_DQ_WEAPON_LINES = {
  "Spike": [
    "{loser} grabs a 2x4 from under the ring and sets it ON FIRE with that blow torch! WHAT IS HAPPENING?! The ref has seen enough — {loser} is disqualified!",
    "{loser} pulls the blow torch out of her gear bag and just goes to work — the referee immediately calls for the bell! DISQUALIFIED!",
  ],
  "Chainsaw": [
    "{loser} reaches under the ring and pulls out an ACTUAL RUNNING CHAINSAW — the referee is not sticking around to see what happens next! DISQUALIFIED!",
    "{loser} revs up that chainsaw right in the middle of the ring — the ref calls it immediately! Can you blame him?!",
  ],
  "Arlene": [
    "{loser} cracks {winner} over the head with a frying pan she had hidden in her robe — the ref sees the whole thing! DISQUALIFIED!",
    "{loser} unloads a can of aerosol spray directly in {winner}'s face — the referee's had enough of this housewife nonsense! DQ!",
    "{loser} takes a broom to {winner} right in front of the referee — that's an automatic disqualification, and she doesn't even stop nagging!",
    "{loser} shoves the referee clean out of the way when he tries to break it up — that's it, that's the DQ right there!",
  ],
  "Phyllis": [
    "{loser} nails {winner} with a mop handle right across the back — that's an automatic disqualification, and the ref isn't having any of it!",
    "{loser} pulls a plunger out of nowhere and just goes after {winner} with it — the referee calls for the bell immediately!",
    "{loser} dumps an entire bucket of soapy water over {winner}'s head — the ref's seen enough of this housewife warfare! DQ!",
    "{loser} takes a swing at the REFEREE, of all people — that's an immediate disqualification, no questions asked!",
  ],
  "Sara": [
    "{loser} pulls rope out from under the ring and tries to hog-tie {winner} right there in the middle of the match! DISQUALIFIED!",
  ],
  "Mabel": [
    "{loser} wraps a chain around {winner}'s throat before the ref can even get over there — that's an immediate DQ!",
  ],
  "Envy": [
    "{loser} pulls a pair of nunchucks out of her gear bag and just goes wild on {winner} — the ref is calling for the bell RIGHT NOW!",
  ],
  "Adore": [
    "{loser} grabs a club from outside the ring and cracks {winner} across the back with it — automatic disqualification!",
  ],
  "Mana": [
    "{loser} grabs that spear from ringside and jabs it right at {winner} — the referee's not letting that fly! DISQUALIFIED!",
    "{loser} sinks her teeth into {winner} right in front of the referee — that's an automatic DQ, no way around it!",
  ],
};

// When Chainsaw already had her chainsaw out earlier in the match (from
// her entrance or a mid-match beat), the DQ finish references the one
// she's already got instead of re-introducing it a second time.
const TAPE_DQ_CHAINSAW_ALREADY_ARMED_LINES = [
  "{loser} just won't put that chainsaw down — the referee's finally had enough and calls for the bell! DISQUALIFIED!",
  "{loser} keeps right on going with that chainsaw of hers — the referee isn't waiting around any longer! DISQUALIFIED!",
];

// Chainsaw doesn't only get DQ'd over the chainsaw itself — sometimes
// it's just a good old-fashioned rope choke instead.
const TAPE_CHAINSAW_ROPE_DQ_LINES = [
  "{loser} wraps the ring rope around {winner}'s throat and won't let go — the referee's counted to five, that's it! DISQUALIFIED!",
  "{loser} grabs the rope and starts choking {winner} with it right in the corner — the ref calls for the bell immediately! DQ!",
];

// Broader pool of found-object chaos for variety — used sometimes even
// for the weapon-carriers above, and for anyone else who gets DQ'd via
// the general chaos roll.
const TAPE_DQ_RANDOM_OBJECT_LINES = [
  "{loser} grabs a trash can from ringside and just goes to town on {winner} with it — the ref's seen enough! DISQUALIFIED!",
  "{loser} rips the padding clean off the turnbuckle and starts swinging it — DQ, no question about it!",
  "{loser} snatches a TV monitor off the announce table and hurls it into the ring — that's an instant disqualification!",
  "{loser} grabs a folding table from ringside and sets it up like she means business — the referee shuts it down before it even starts! DQ!",
  "{loser} yanks a fan's sign right out of the crowd and starts whacking {winner} with it — of all the things to use as a weapon!",
  "{loser} grabs the ring bell itself and swings it at {winner} — the irony is not lost on anybody here! DISQUALIFIED!",
  "{loser} grabs a folding chair from a fan in the front row — the fan does NOT get it back! DISQUALIFIED!",
  "{loser} snatches the referee's own whistle and uses it as brass knuckles somehow — the ref calls it, obviously! DQ!",
  "{loser} rips a shoe clean off and starts hitting {winner} with it — an actual shoe! DISQUALIFIED!",
  "{loser} grabs a water bottle and just SQUEEZES it directly at {winner}'s face — that's disqualification-worthy behavior, folks!",
  "{loser} yanks the timekeeper's little table over and starts swinging pieces of it — total chaos, immediate DQ!",
];

const TAPE_FINISHER_TEMPLATES = [
  "Here it comes — {winner} nails the {winnerFinisher} OUT OF NOWHERE! Cover! ONE! TWO! THREE!! Ring the bell, this one's over!",
  "{winner} goes up top... and connects with the {winnerFinisher}! She hooks the leg — ONE! TWO! THREE! Folks, that's what we call a wrap!",
  "OH MY STARS — {winner} just planted {loser} with the {winnerFinisher}! Down goes the cover — ONE, TWO, THREE! It's ALL OVER!",
  "{winner} calls for it — and delivers the {winnerFinisher} FLUSH! The referee's hand hits the mat — ONE! TWO! THREE!! {loser} is done!",
  "THAT'S ALL, FOLKS! {winner} drops {loser} with the {winnerFinisher}, makes the cover — ONE... TWO... THREE!! And that's the match!!",
  "There it is! {winner} hits the {winnerFinisher} dead center! The referee dives for the count — ONE! TWO! THREE!! We are DONE here!",
  "{loser} never saw it coming — {winner} unloads the {winnerFinisher} and that's a wrap! ONE, TWO, THREE! Match over!",
  "And THAT'S how you close a show! {winner} lands the {winnerFinisher}, makes the cover — ONE! TWO! THREE!! Ballgame!",
];

// Used when the winner doesn't have (or isn't using) a listed finisher —
// these still name a concrete move ({winnerMove}, a real body slam,
// suplex, dropkick, etc.) rather than falling back on vague "energy" or
// "approach" language that gives the finish no actual context.
const TAPE_GIMMICK_TEMPLATES = [
  "{winner} catches {loser} completely off guard with {winnerMove}, hooks the leg — ONE! TWO! THREE!! AND THAT'S THE MATCH!",
  "Would you believe it — {winner} drops {loser} with {winnerMove} out of nowhere! Cover — ONE, TWO, THREE! The crowd is losing their minds, and frankly so am I!",
  "{loser} throws everything she's got, but {winner} answers with {winnerMove} right on the money! Down for the pin — ONE! TWO! THREE!! It's in the books!",
  "{winner} plants {loser} with {winnerMove} and drops down for the cover — ONE... TWO... THREE! Both of them are bruised, gear's torn, hair's a wreck — but {winner}'s the one still standing!",
  "{winner} catches {loser} flush with {winnerMove}! Cover — ONE! TWO! THREE!! And that's it, folks — she puts her away for good, or at least until the rematch!",
  "That's the difference right there — {winner} lands {winnerMove} and that's all she wrote! Cover — ONE, TWO, THREE!! Match over!",
  "{winner} refuses to quit, and it pays off — {winnerMove} puts {loser} away for the count — ONE! TWO! THREE!! We have a winner!",
  "Out of absolutely nowhere — {winnerMove} from {winner}! {loser} has no answer for it. Cover — ONE... TWO... THREE! That's all she wrote!",
];

// Some signature moves are a pinning pose rather than an attack — these
// wrestlers get dedicated finish language instead of the generic
// "nails/connects with/delivers" attack phrasing above.
const TAPE_POSE_FINISHERS = new Set(["Cross Pin"]);
const TAPE_PIN_POSE_TEMPLATES = [
  "{winner} takes {loser} down and strikes that signature {winnerFinisher} pose right on top of her — the referee dives in! ONE! TWO! THREE!! That's the match!",
  "{winner} doesn't need a big move here — she just drops into the {winnerFinisher}, and the ref counts it — ONE, TWO, THREE! It's over!",
  "There it is — the {winnerFinisher}! {winner} strikes the pose, the referee's hand hits the mat three times, and {loser} has nothing left to answer with!",
];

// These wrestlers have a "finisher" listed on their bio page that's
// really a recurring mid-match habit rather than an actual finishing
// move — Attaché's spitting and Beastie's biting happen throughout a
// match, and The Widow's poisoned drink is offered before the bell even
// rings. None of them are how these three actually win a match, so
// they're excluded from the generic finisher pool below.
const TAPE_NON_FINISH_SIGNATURES = new Set(["The Widow", "Attaché", "Beastie", "Cheyenne Cher"]);

// A handful of especially eccentric characters get a bonus goofy aside
// worked into the commentary when they're part of the matchup.
const TAPE_ECCENTRIC_LINES = {
  "The California Doll": [
    "{Y} grabs {X}'s own surfboard from ringside and cracks it right over her back — it splits clean in half on impact!",
    "{Y} snatches up {X}'s surfboard and just starts wailing on her with it, again and again, until it finally splinters apart!",
    "{Y} picks up {X}'s surfboard from ringside — and now she's using it against her, whacking away until the thing breaks in two!",
  ],
  "Little Feather": [
    "{Y} picks {X} clean up off her feet and just tosses her across the ring like a rag doll — she weighs practically nothing.",
    "{X} gets flung around like a rag doll out there — she's so light, {Y} barely has to put any effort into it.",
    "{Y} whips {X} around by the arm like she's swinging a sack of feathers — that's just how little {X} weighs.",
  ],
  "Cheyenne Cher": [
    "{X} pulls off a handstand head scissors on {Y}, taking her down with pure acrobatic flair — the crowd is loving it.",
    "{X} flips into a handstand and locks {Y} up in a head scissors — that's a signature move if I've ever seen one.",
  ],
  "Stinky": [
    "The unmistakable stench of {X}'s skunk gimmick has the whole front row covering their noses.",
    "{X} doesn't even need to touch {Y} to clear her out of the corner — that smell does the work for her.",
  ],
  "Dementia": [
    "{X} shuffles around the ring like a corpse — genuinely unsettling to watch.",
    "{X} stares blankly at {Y} without a word — I don't think I'll ever get used to this one.",
    "{X} suddenly starts playing with that porcelain doll of hers mid-match, completely ignoring {Y} for a second — and then, just as suddenly, rips its head clean off.",
    "{X} gets in close on {Y} and shows off some surprising strength for someone who moves like that — {Y} was not expecting that at all.",
    "{X} wobbles toward {Y} like she's barely aware of where she even is — and then she's suddenly not moving like that at all.",
    "{X} pulls that axe out from seemingly nowhere and just stares at it for a moment — {Y} backs off immediately.",
  ],
  "Jungle Woman": [
    "{X} lets out a feral screech that has {Y} visibly rattled for a moment.",
    "{X} climbs and claws at {Y} like she's back in the jungle, not a wrestling ring.",
  ],
  "Mana": [
    "{X} sinks her teeth right into {Y} — the referee warns her, but it's already done.",
    "{X} lets out a guttural yell and goes right back after {Y} — pure primal instinct out there.",
    "{X} suddenly leaps up onto the ropes and growls right at the crowd — not a word out of her, just pure animal sound.",
    "{X} bounds around the ring and lets out a growling yell at the fans in the front row — {Y} uses the distraction to get a breather.",
  ],
  "Hollywood": [
    "{X} locks in a Hooligan Hammerlock mid-match, just to remind {Y} it's there — she doesn't go for the pin, just lets it sink in.",
    "{X} cranks on {Y}'s arm with a Hooligan Hammerlock for a few seconds before letting go — a little preview of what's coming later.",
  ],
  "Beastie": [
    "{X} bites down on {Y} mid-hold, growling the whole time — the referee's shouting at her to break it up.",
    "{X} snarls and claws at {Y} like she's forgotten this is a wrestling match and not a street fight.",
  ],
  "Attaché": [
    "{X} spits right in {Y}'s face mid-hold — the referee's disgusted, and honestly, so is everybody else.",
    "{X} spits at {Y} between exchanges — that's twice now, and the referee's running out of patience.",
  ],
  "The Widow": [
    "{X} adjusts her black veil mid-move without missing a beat — pure theater.",
    "{X} moves through this match with an eerie calm, that veil never once slipping out of place.",
  ],
  "Little Fiji": [
    "All four-foot-something of {X} somehow has the entire crowd chanting her name.",
    "{X} gives up a foot or more in height to {Y} and doesn't care one bit — the crowd's fully behind her.",
  ],
  "Star": [
    "{X} flashes a peace sign at the hard camera before turning right back to business.",
    "{X} launches into some zodiac reading about {Y}'s star sign, confidently predicting a loss before a single move's been thrown.",
  ],
  "Zelda": [
    "{X} isn't relying on strength here — she's out there trying to out-think {Y} with whatever strategy fits the moment.",
    "{X} studies {Y}'s every move, looking for an opening rather than muscling her way through this one.",
  ],
  "Habana": [
    "{X} lights up an imaginary cigar mid-taunt — the crowd eats it up.",
    "{X} strikes a cool, unbothered pose mid-match, imaginary cigar and all — showmanship over urgency.",
    "{X} throws that big net of hers right over {Y}, tangling her up completely — {Y} can barely move an inch!",
    "{X} traps {Y} in the net she carried to the ring and just wails on her while she's bound up helpless.",
    "{Y} is completely tangled in {X}'s net now — this is not a fair fight while she's stuck like that.",
  ],
  "Evangelina": [
    "{X} pauses to deliver a full sermon to the booing crowd before locking back up.",
    "{X} raises her arms and preaches to the crowd mid-match — {Y} is left just standing there waiting.",
  ],
  "Sneaky": [
    "{X} tries something behind the referee's back — and almost gets away with it.",
    "{X} waits for the referee to look away before trying to get one over on {Y} — classic.",
  ],
  "Spike": [
    "{X} isn't even bothering with wrestling holds — she's just swinging that blow torch at {Y} and hoping for the worst.",
    "{Y} looks genuinely terrified to even get close to {X} — honestly, can you blame her?",
    "{X} lets out a piercing, unhinged scream that has absolutely nothing to do with the move she just landed — no words, just noise.",
    "{X} isn't saying anything coherent out there — just screaming like an absolute maniac, and somehow that's scarier than actual trash talk would be.",
  ],
  "Chainsaw": [
    "{X} revs up that chainsaw instead of locking up — this has stopped being a wrestling match entirely.",
    "{Y} keeps her distance as long as she possibly can — nobody's in a hurry to find out what happens if she gets too close to {X}.",
    "{X} doesn't say a single word — just stares at {Y} with that dead, unblinking look that's somehow more unsettling than any threat could be.",
    "{X} isn't talking, isn't flaunting, isn't doing anything but staring — and that empty, evil look in her eyes has {Y} rattled.",
  ],
  "Arlene": [
    "{X} isn't wrestling so much as chasing {Y} around with a rolling pin and a frying pan — pure kitchen warfare.",
    "{X} swings a frying pan at {Y} between complaints — even mid-chase, she's still nagging her the entire time.",
  ],
  "Phyllis": [
    "{X} unloads an aerosol can directly at {Y}, following it up with a mop to the face — housewife chaos in full effect.",
    "{X} chases {Y} down with a mop, griping the whole way — this looks more like spring cleaning than wrestling.",
  ],
  "Sara": [
    "{X} isn't interested in wrestling holds — she's got rope and chains ready to tie {Y} right up.",
    "{X} skips the lock-up entirely and goes straight for the rope, looking to hog-tie {Y} before she knows what's happening.",
  ],
  "Mabel": [
    "{X} skips the wrestling entirely and goes straight for the rope, looking to hog-tie {Y}.",
    "{X} pulls out a length of chain instead of locking up — {Y} is not thrilled about that development.",
  ],
  "Envy": [
    "{X} pulls out a pair of nunchucks mid-match — this has gone from wrestling to a straight-up weapons brawl.",
    "{X} spins those nunchucks at {Y} like she's auditioning for a martial arts film, not a wrestling match.",
  ],
  "Adore": [
    "{X} swings a club at {Y} instead of bothering with actual wrestling moves.",
    "{X} skips the holds entirely and just starts swinging that club — {Y} is having none of it.",
  ],
  "Matilda the Hun": [
    "{X} plants herself right on top of {Y}, using every ounce of her size to squash any hope of a kick-out.",
    "{X} stops mid-hold to taunt the crowd — she's not just fighting {Y} tonight, she's fighting everybody in this building.",
    "{Y} is down on the canvas in obvious pain, and {X} throws her head back cackling like a madwoman over her.",
    "{X} stands over a writhing {Y} and just laughs — a genuinely unsettling, cackling laugh that has this crowd dead silent.",
  ],
  "Palestina": [
    "{X} reaches into her boot and throws a handful of sand right in {Y}'s face — {Y} can't see a thing!",
    "{X} blinds {Y} with a fistful of sand and presses the advantage immediately — pure desert-rat cunning.",
  ],
  "Mt. Fiji": [
    "{X} doesn't even flinch — you could throw a truck at her and she'd barely blink.",
    "{Y} throws everything she's got at {X}, and {X} barely budges an inch — that size difference is no joke.",
  ],
  "Big Bad Mama": [
    "{X} doesn't bother with technical wrestling — she just overpowers {Y} with sheer strength, Mt. Fiji-style.",
    "{X} shrugs off {Y}'s offense entirely and just muscles her way through the match instead.",
  ],
  "Olympia": [
    "{X} isn't a giant, but pound for pound she might be the strongest woman on this whole roster — {Y} is finding that out the hard way.",
    "{X} overpowers {Y} with raw strength that seems impossible for someone her size.",
  ],
};

// These characters barely wrestle in the traditional sense — their whole
// gimmick is weapons or theatrics instead of standard holds — so their
// flavor line fires far more reliably than the usual eccentric chance.
const TAPE_NON_WRESTLING = new Set(["Spike", "Chainsaw", "Arlene", "Phyllis", "Dementia", "Sara", "Mabel", "Envy", "Adore"]);

// Big Bad Mama casts her spell early in the match, setting up chaos that
// echoes through the rest of the commentary — see the dedicated
// mamaInMatch handling below.
const TAPE_SPELL_CAST_LINES = {
  "Big Bad Mama": [
    "Early on, {X} throws some kind of hex at {Y} — and {Y}'s whole demeanor changes right there on the spot.",
    "Right off the bat, {X} curses {Y} under her breath — {Y} doesn't seem to notice yet, but oh, she will.",
    "Before the match even gets going, {X} slaps a voodoo charm against {Y}'s forehead — folks, that's never a good sign.",
  ],
};

// Big Bad Mama's trance only lands about half the time — and when it
// does, faces have a real chance of shaking it off before it matters.
const TAPE_MAMA_SNAP_OUT_LINES = [
  "{Y} shakes it off almost immediately — {X}'s hex doesn't seem to be sticking this time!",
  "{Y} blinks hard, clears her head, and snaps right out of whatever {X} tried to pull!",
  "For a second there {Y} looked dazed, but she shakes it off and refocuses — {X}'s trick didn't take!",
];

// Wildly goofy trance aftereffects that show up later in the match as a
// consequence of the early spell — the sillier the better.
const TAPE_TRANCE_AFTEREFFECT_LINES = [
  "{Y} is STILL clucking like a chicken from earlier — whatever {X} did, it is NOT wearing off!",
  "{Y} just tried to moonwalk across the ring for no reason — that trance has clearly not worn off yet!",
  "{Y} keeps randomly bursting into song mid-match — folks, that spell is still VERY much active!",
  "{Y} just attempted to propose marriage to the referee — I have so many questions and zero answers!",
  "{Y} is barking like a dog now?! This match has gone completely off the rails, and I am here for it!",
  "{Y} keeps trying to hug {X} instead of fighting her — that hex is really doing a number on her!",
  "{Y} just broke into a full interpretive dance mid-hold — utterly bewildering, truly spectacular!",
  "{Y} is now speaking in a British accent for some reason — nobody can explain it, least of all {Y}!",
  "{Y} just saluted the flag of a country that doesn't exist — I don't know what {X} did to her, but WOW!",
  "{Y} keeps quacking like a duck between strikes — the referee is trying so hard not to laugh!",
  "{Y} just did the entire electric slide, unprompted, in the middle of the ring — this is not normal!",
  "{Y} keeps calling {X} 'mom' for some reason — nobody in this building can explain it!",
  "{Y} just tried to referee her own match — the actual referee is very confused right now!",
  "{Y} is walking backwards for some reason — nobody's told her, and honestly it's working out fine for her.",
  "{Y} keeps trying to sell tickets to the front row — I don't think that's in her job description!",
  "{Y} just did a full curtsy in the middle of a headlock — this is NOT normal ring etiquette!",
  "{Y} is meowing now. Just — meowing. I have no explanation, folks.",
  "{Y} tried to autograph the referee's shirt mid-match — he did NOT appreciate it!",
  "{Y} keeps insisting she's actually a different wrestler entirely — {X}'s hex has really scrambled something up there!",
  "{Y} just tried to do the worm — the actual dance move — in the middle of the ring!",
];

// Whenever Matilda the Hun wrestles, the whole match tends to spiral —
// guaranteed chaos line inserted into her matches.
const TAPE_MATILDA_CHAOS_LINES = [
  "Things are already spiraling out of control with {X} in the ring — this has stopped being a normal wrestling match entirely.",
  "Whenever {X} is involved, chaos seems to follow, and tonight is no exception — this whole thing is falling apart in the best way.",
  "This has devolved into an absolute circus the second {X} got involved — I genuinely don't know what to call this anymore.",
];

// Hollywood, Vine, and Broadway Rose are all established kleptomaniacs —
// they can't help themselves around anything left unattended ringside.
// If the opponent happens to be one of the Rich Girls, the theft gets
// upgraded to something specific swiped right out of her corner.
const TAPE_KLEPTO_WRESTLERS = new Set(["Hollywood", "Vine", "Broadway Rose"]);
const TAPE_KLEPTO_GENERIC_LINES = [
  "{X} ducks outside mid-match and swipes something off the timekeeper's table — old habits die hard.",
  "{X} can't help herself — she snatches a fan's sunglasses right off his face at ringside mid-brawl.",
  "{X} pockets something from ringside without anyone noticing — except us, of course.",
];
const TAPE_KLEPTO_RICH_GIRL_LINES = [
  "{X} spots something shiny sitting in {Y}'s corner and just can't resist — she swipes it clean before anyone notices!",
  "While the referee's distracted, {X} sneaks over to {Y}'s corner and pockets whatever {Y} left sitting there!",
  "{X} makes a beeline for {Y}'s corner mid-match and steals something right off the top — classic kleptomaniac move!",
];

// The Widow tries to slip her opponent a poisoned drink right in the
// ring early in the match — not on the walk out, but as her actual
// first move. If it lands, there's a good chance of a weakened, dazed
// opponent showing up later in the commentary.
const TAPE_WIDOW_POISON_OFFER_LINES = [
  "Before the first real lock-up, {X} pulls out a drink and offers it to {Y} — a little pre-fight hospitality, or so it seems.",
  "Right out of the gate, {X} offers {Y} a drink to 'settle the nerves' — something about that smile says it's not just water.",
  "{X} extends a friendly-looking drink to {Y} early on — this has trap written all over it.",
];
const TAPE_WIDOW_POISON_AFTEREFFECT_LINES = [
  "{Y} took a sip of that drink {X} offered — and she has looked woozy and off-balance ever since!",
  "Whatever was in that drink {X} handed {Y} is clearly still working — {Y} looks dazed out there!",
  "{Y} can't seem to shake off whatever {X} slipped into that drink — she's fighting through a real fog right now!",
];

// Mt. Fiji doesn't do standard wrestling moves — she picks opponents up,
// smashes them into the ropes, and wins by planting her foot on them
// instead of a normal cover. Dedicated finish lines instead of the
// generic finisher/gimmick pools.
const TAPE_MT_FIJI_FINISH_LINES = [
  "{winner} picks {loser} straight up off the mat and SMASHES her into the ropes — then just plants a foot right on her chest for good measure! ONE! TWO! THREE!! That's all it takes!",
  "There's no fancy finisher here — {winner} hurls {loser} into the ropes, then pins her flat with a single foot! The referee counts — ONE, TWO, THREE! It's over!",
  "{winner} doesn't even bother going to the mat herself — she just stomps a foot down on {loser} for the cover! ONE! TWO! THREE!! And that's the match!",
];

// Big Bad Mama's "Voodoo" finish is a curse, not an attack — she hexes
// her opponent right into the pin.
const TAPE_VOODOO_FINISH_LINES = [
  "{winner} throws some kind of voodoo curse at {loser} — and {loser} just crumples to the mat like her strings got cut! Cover — ONE! TWO! THREE!! What in the world was THAT?!",
  "{winner} doesn't even need to lay a hand on {loser} this time — one look, one hex, and {loser} goes down for the count! ONE, TWO, THREE! Somebody explain that to me!",
  "There's that voodoo magic again — {winner} curses {loser} right where she stands, and down she goes for the pin! ONE! TWO! THREE!! I've seen a lot in this business, but never that!",
];

// Voodoo is Big Bad Mama's signature, but it's the exception — most of
// the time she just wins the old-fashioned way, with a big splash.
const TAPE_BIG_SPLASH_FINISH_LINES = [
  "{winner} climbs to the middle rope — not exactly graceful, but effective — and comes down with a massive big splash! Cover — ONE! TWO! THREE!! That's all she wrote!",
  "{winner} drops a big splash right on top of {loser}, and there's nowhere for her to go! ONE, TWO, THREE! Match over!",
  "That's a whole lot of woman coming down on {loser} — {winner} connects with the big splash, and it's academic from there! ONE! TWO! THREE!!",
  "{winner} doesn't miss with that big splash, and {loser} is not getting up from it! Cover — ONE, TWO, THREE!! Ballgame!",
];

// Shared-trait groups. When both wrestlers in a matchup belong to the
// same category, that category's matchupLines fire (more specific, more
// fun). When only one does, its soloLines can appear like the eccentric
// asides above.
const TAPE_CATEGORIES = [
  {
    name: "Rich Girls",
    members: ["Tiffany Mellon", "Roxy Astor", "Ashley Cartier", "Tina Ferrari"],
    matchupLines: [
      "Before the bell even rings, {A} and {B} are already sniping about whose jewelry costs more — this one's personal.",
      "{A} and {B} trade jabs about money and looks before they've even locked up. The ultimate rich-girl grudge match.",
      "This one's got real high-society energy — {A} and {B} clearly think they're too good to even be in the same ring.",
    ],
    soloLines: [
      "{X} makes sure the crowd gets a good look at that expensive jewelry before locking up.",
    ],
  },
  {
    name: "Cheerleader Acrobats",
    members: ["Susie Spirit", "Debbie Debutante", "Vicky Victory", "Cheyenne Cher"],
    matchupLines: [
      "{A} and {B} trade flips and acrobatics, turning this into a gymnastics showcase as much as a wrestling match.",
      "Both {A} and {B} are as much athlete as showwoman here — the crowd's eating up every cartwheel and handspring.",
      "{A} and {B} are both peppering this one with dropkicks off every gymnastics trick they've got — this is a cheerleading routine as much as it's a wrestling match.",
    ],
    soloLines: [
      "{X} breaks into another cartwheel mid-match — this isn't just an entrance trick, it's a whole style.",
      "{X} flips right out of a hold, popping the crowd with the kind of athleticism you don't see from most of this roster.",
      "{X} chains a cartwheel straight into a dropkick — that gymnastics background is on full display tonight.",
      "{X} climbs to the top rope and comes flying off with a crossbody — {Y} never saw it coming.",
      "{X} locks {Y} up in a head scissors and takes her clean off her feet with it — pure acrobatic flair.",
    ],
  },
  {
    name: "Giants",
    members: ["Mt. Fiji", "Matilda the Hun", "Big Bad Mama"],
    matchupLines: [
      "Two absolute giants collide in the center of the ring — the whole structure seems to shake.",
      "{A} and {B} lock up and neither budges an inch. This is a genuine battle of titans.",
      "The sheer size of {A} and {B} both is something else — this is a heavyweight collision in every sense.",
    ],
    soloLines: [
      "{X} looms over the ring, an intimidating presence before the bell even rings.",
      "{X} just manhandles {Y} — picks her up like she weighs nothing and tosses her clean across the ring.",
      "{Y} tries everything to put {X} down, and {X} barely even staggers — she is next to impossible to knock off her feet.",
    ],
  },
  {
    name: "High-Flyers",
    members: ["Thunderbolt", "Lightning"],
    matchupLines: [
      "Small, fast, and fearless — {A} and {B} are turning this into an aerial showcase, off the ropes and off the top rope alike.",
    ],
    soloLines: [
      "{X} is small, but she's all over the place — off the ropes, off the top rope, nowhere {Y} feels safe.",
      "{X} springs off the top rope with a flying crossbody, catching {Y} completely by surprise.",
      "{X} locks {Y} up in a head scissors and rides it all the way down — that's real technique, not just speed.",
    ],
  },
];

// A one-off special pairing that doesn't fit a broader category.
const TAPE_PAIR_LINES = [
  {
    pair: ["Hollywood", "Vine"],
    lines: [
      "Old habits die hard — {A} and {B} both seem more interested in the referee's watch than in each other for a second.",
      "Mid-match, {A} tries to lift something out of {B}'s gear bag at ringside — some things never change.",
    ],
  },
];

// Genuine, known heated rivalries — these get extra passionate
// commentary emphasizing the real dislike between them, plus a
// dedicated post-match line acknowledging the outcome no matter how the
// match itself actually ends.
const TAPE_RIVALRY_PAIRS = [
  {
    pair: ["Matilda the Hun", "Mt. Fiji"],
    matchLines: [
      "There's real bad blood here — {A} and {B} have never liked each other, and everybody in this building knows it.",
      "You can feel the hatred in the air every time {A} and {B} get within arm's reach of each other.",
    ],
    postMatchLines: [
      "Another chapter in one of GLOW's fiercest rivalries — {winner} gets the better of {loser} tonight, but nobody believes this is the last time these two throw down.",
      "{winner} walks away with it this time, but {loser} isn't going to let this one go — not against her, not ever.",
    ],
  },
  {
    pair: ["Spanish Red", "Debbie Debutante"],
    matchLines: [
      "{A} and {B} genuinely cannot stand each other — this one's personal, folks.",
      "There's no love lost between {A} and {B} — every lock-up here has real venom behind it.",
    ],
    postMatchLines: [
      "{winner} gets the win over {loser} tonight, but with the history between these two, don't expect this rivalry to cool off anytime soon.",
      "That's the win for {winner}, but {loser} will be looking for the rematch — these two have never needed much of a reason to go at it.",
    ],
  },
  {
    pair: ["Colonel Ninotchka", "Tina Ferrari"],
    matchLines: [
      "{A} and {B} do not need any introduction to this rivalry — the hatred here runs deep.",
      "You can see it in their eyes — {A} and {B} genuinely despise each other, and this crowd is loving every second of it.",
    ],
    postMatchLines: [
      "{winner} gets the better of {loser} in the latest chapter of one of GLOW's most personal rivalries.",
      "{winner} takes this one, but {loser} will be back for more — these two have been trading wins and grudges for a long time now.",
    ],
  },
  {
    pair: ["Big Bad Mama", "Mt. Fiji"],
    matchLines: [
      "Two of the biggest, toughest women in this promotion, and neither one backs down an inch — {A} and {B} genuinely hate sharing a ring.",
      "{A} and {B} have thrown down before, and every single time it's personal.",
    ],
    postMatchLines: [
      "{winner} gets the win over {loser} tonight, but with the size and the history between these two, this is far from settled.",
      "That's the victory for {winner}, but nobody in this building thinks {loser} is done with her.",
    ],
  },
  {
    pair: ["Hollywood", "Babe the Farmer's Daughter"],
    matchLines: [
      "{A} and {B} could not be more different, and {A} makes sure {B} knows exactly how she feels about it.",
      "There's real animosity between {A} and {B} here — city slicker versus farm girl, and neither one is backing down.",
    ],
    postMatchLines: [
      "{winner} gets the better of {loser} this time, but this clash of worlds is far from over.",
      "That's the win for {winner} tonight, but {loser} isn't going to let this one slide.",
    ],
  },
  {
    pair: ["Godiva", "Tiffany Mellon"],
    matchLines: [
      "{A} and {B} have never gotten along, and tonight is no exception — this one's dripping with attitude.",
      "There's real tension between {A} and {B} — this feels personal, not just business.",
    ],
    postMatchLines: [
      "{winner} takes the win over {loser} tonight, but these two have never needed much reason to clash.",
      "That's the victory for {winner}, but {loser} will be looking for a rematch before too long.",
    ],
  },
  {
    pair: ["Godiva", "Roxy Astor"],
    matchLines: [
      "{A} and {B} have never gotten along, and tonight is no exception — this one's dripping with attitude.",
      "There's real tension between {A} and {B} — this feels personal, not just business.",
    ],
    postMatchLines: [
      "{winner} takes the win over {loser} tonight, but these two have never needed much reason to clash.",
      "That's the victory for {winner}, but {loser} will be looking for a rematch before too long.",
    ],
  },
  {
    pair: ["Palestina", "Americana"],
    matchLines: [
      "{A} and {B} represent two completely different worlds, and {A} makes sure everyone knows exactly how she feels about it.",
      "There's real hatred here — {A} and {B} have never needed a storyline to want to hurt each other.",
    ],
    postMatchLines: [
      "{winner} gets the better of {loser} tonight, but with the history between these two, don't expect this to be settled.",
      "That's the win for {winner}, but {loser} will be looking for payback — these two genuinely despise each other.",
    ],
  },
];

// A guaranteed opening line for wrestlers with an iconic ring entrance —
// always the first line of the commentary when they're in the match.
const TAPE_ENTRANCE_LINES = {
  "Habana": [
    "{X} comes out carrying a big net, of all things — nobody's quite sure what she plans to do with it, but it can't be good.",
    "{X} drags that oversized net of hers to the ring — {Y} eyes it warily from across the way.",
    "Here comes {X}, net in hand — this crowd has learned to expect the unexpected from her.",
  ],
  "Olympia": [
    "{X} strides in and stops to flex for the crowd before even reaching the ring — that physique is genuinely something else.",
    "{X} hits a full double-bicep pose on her way to the ring, and the announcer can't help but be impressed — that's real muscle.",
    "{X} flexes for the crowd stepping through the ropes — you don't see conditioning like that on most of this roster.",
  ],
  "Palestina": [
    "{X} storms to the ring wielding a machete, screaming something about traitors — security keeps a very close eye on this one.",
    "{X} comes out brandishing that machete of hers, shouting at the crowd about traitors and cowards — nobody in the front rows looks thrilled about it.",
    "{X} marches in swinging her machete overhead, ranting about traitors — {Y} watches from the ring with real concern on her face.",
  ],
  "Melody Trouble Vixen (MTV)": [
    "{X} spins into the arena like she owns the DJ booth, hyping up the crowd on her way to the ring.",
    "{X} comes out bumping to her own beat, working the crowd like she's still spinning records at the GLOW Disco.",
    "{X} grabs her guitar and belts out a quick, off-the-cuff tune mocking {Y} on her way to the ring — the crowd's howling with laughter.",
    "{X} stops halfway down the aisle to strum her guitar and sing a few mocking lines about {Y} — {Y} does NOT look amused.",
    "{X} comes out cranking her boombox to deafening volume, drowning out anything {Y} tries to say before the match even starts.",
    "{X} struts out flipping her hair and sneering at the crowd like they should be thanking her for the show.",
    "{X} pauses at ringside just long enough to razz {Y}'s music taste before hopping in the ring — real mature, {X}.",
  ],
  "Little Fiji": [
    "{X} shakes hands with fans all along the aisle on her way to the ring, all smiles.",
    "{X} stops to shake hands with as many fans as she can reach — she's clearly not in a hurry to get to the ring.",
    "Here comes {X}, shaking hands the whole way down — the crowd loves her for it.",
    "{X} gives a shy little wave to the crowd, and they roar back louder than she probably expected.",
    "{X} pauses to hug a kid at ringside before continuing on, and this crowd is putty in her hands.",
    "Here comes sweet {X}, practically glowing from all the attention — she deserves every bit of it.",
  ],
  "Little Egypt": [
    "{X} belly dances her way down to the ring, and the crowd is loving every second of it.",
    "{X} makes her entrance with a full belly dance routine — this crowd came to see a show, and she's delivering one.",
    "Here comes {X}, dancing all the way to the ring — she's got rhythm to spare.",
    "{X} twirls a veil overhead as she dances her way in, and the crowd claps right along with the rhythm.",
    "{X} makes a grand, glittering entrance, and this crowd cannot get enough of the showmanship.",
    "Here comes {X}, moving like poetry down that aisle — genuinely one of the best entrances in this promotion.",
  ],
  "Angel": [
    "{X} walks in carrying a biker helmet in one hand and a chain in the other — nobody's mistaking her for friendly.",
    "{X} struts to the ring swinging a chain around like she's looking for an excuse to use it.",
    "Here comes {X}, helmet and chain in hand — this crowd knows exactly what kind of night this is going to be.",
    "{X} kicks over a fan's soda on her way past, not even bothering to apologize — charming as always.",
    "{X} swings that helmet by the strap and glares at {Y}, daring her to make something of it.",
    "Here comes {X}, chain dragging on the floor behind her — somebody's about to get an earful, or worse.",
  ],
  "Tina Ferrari": [
    "{X} waves to the crowd on her way to the ring, and this crowd absolutely loves her for it.",
    "{X} soaks up the cheers, waving to every corner of the arena — the fans can't get enough of her.",
    "Here comes {X}, waving the whole way down — this crowd is fully behind her tonight.",
    "{X} stops to sign a few autographs on her way down, and this crowd absolutely adores her for it.",
    "{X} flashes that megawatt smile the whole way to the ring — you'd think she was born for this spotlight.",
    "Here comes {X}, and the roar from this crowd tells you everything about how beloved she is.",
  ],
  "Godiva": [
    "{X} rides in on her horse, waving to the crowd like true royalty.",
    "{X} trots in on that horse like she owns the whole arena — nobody asked, dear.",
    "Here comes {X}, horse and all, looking down her nose at everybody in this building.",
    "{X} looks down her nose at the crowd from atop that horse like she's surveying her royal subjects.",
    "{X} tips an imaginary crown to absolutely nobody, because heaven forbid she acknowledge the peasants.",
    "Here comes {X}, horse clip-clopping in, sneering the whole way — regal and thoroughly insufferable.",
  ],
  "Tammy Jones": [
    "{X} tosses candy out to the crowd on her way to the ring.",
    "{X} hands out candy to fans as she makes her way down — an absolute sweetheart.",
    "Here comes {X}, tossing treats to every kid in the front row — the crowd loves her for it.",
    "{X} skips down the aisle handing out candy like it's Halloween — this crowd's heart just melted.",
    "{X} stops to give a high-five to every kid she passes, and the whole arena goes soft for her.",
    "Here comes little {X}, all smiles and sugar — you couldn't invent a more wholesome entrance if you tried.",
  ],
  "Spanish Red": [
    "{X} tosses red roses out to the crowd as she makes her entrance.",
    "{X} makes her entrance flinging roses around like she's trying to buy the crowd's forgiveness in advance.",
    "Here comes {X}, roses flying — don't let the flowers fool you, folks, she's trouble.",
    "{X} flings a rose at {Y}'s feet like it's an insult, not a gift — real subtle, that one.",
    "{X} blows past a row of fans without so much as a glance, roses be damned.",
    "Here comes {X}, all smiles and roses on the outside, pure trouble underneath — don't be fooled, folks.",
  ],
  "Matilda the Hun": [
    "{X} taunts everyone in her path on the way to the ring.",
    "{X} shoves fans out of her way just to get to the ring — real class act, this one.",
    "Here comes {X}, sneering at anyone who so much as looks at her.",
    "{X} barks something in German at a fan in the front row, and I don't think it was a compliment.",
    "{X} flexes menacingly at anyone who dares make eye contact — subtlety has never been her thing.",
    "Here comes {X}, stomping down that aisle like she's trying to crack the concrete underneath it.",
  ],
  "Ashley Cartier": [
    "{X} blows kisses to the crowd as she struts to the ring.",
    "{X} sends kisses flying to every corner of the arena — the crowd's eating it up.",
    "Here comes {X}, working the crowd with kisses and a smile — a total crowd-pleaser.",
    "{X} stops for a quick photo with a fan at ringside — always time for the people who love her.",
    "{X} works the aisle like a runway, and this crowd is eating up every second of the glamour.",
    "Here comes {X}, radiant as ever — this crowd absolutely lights up the moment she appears.",
  ],
  "Beastie": [
    "{X} comes out growling and yelling like a wild animal.",
    "{X} snarls her way to the ring, and frankly, I don't want to be anywhere near her.",
    "Here comes {X}, already barking at ringside fans — an absolute menace.",
    "{X} bites at the air toward a few front-row fans, who scramble back in their seats.",
    "{X} paws at the mat like a bull before she's even reached the ring — pure menace.",
    "Here comes {X}, growling at anyone dumb enough to get close — nobody's testing that theory tonight.",
  ],
  "Susie Spirit": [
    "{X} does a series of flips and cartwheels on her way to the ring, and the crowd applauds every one of them.",
    "{X} tumbles down the aisle with an impressive run of cartwheels — the crowd's already on its feet.",
    "Here comes {X}, flipping her way to the ring like she never left that dance floor — the crowd cheering her on the whole way.",
    "{X} tumbles in with pure energy, and this crowd is on its feet before she even reaches the ropes.",
    "{X} throws in a cartwheel just for the front row, and they go absolutely wild for it.",
    "Here comes {X}, spirit and school pride on full display — this crowd adores everything about her.",
  ],
  "Debbie Debutante": [
    "{X} does a series of flips and cartwheels on her way to the ring, and the crowd applauds every one of them.",
    "{X} cartwheels down the aisle, all smiles — a natural showwoman, and the crowd shows her plenty of love for it.",
    "Here comes {X}, tumbling her way in — the crowd loves every second of it.",
    "{X} tumbles down that aisle with a big smile, and this crowd showers her with applause the whole way.",
    "{X} throws in an extra flip just to hear the crowd roar, and roar they do.",
    "Here comes {X}, all poise and pep — the crowd's clearly got a soft spot for this one.",
  ],
  "Vicky Victory": [
    "{X} does a series of flips and cartwheels on her way to the ring, and the crowd applauds every one of them.",
    "{X} shows off some serious acrobatic skill just getting to the ring — the crowd cheering her on with every flip.",
    "Here comes {X}, flipping and tumbling her way down the aisle to a big round of applause.",
    "{X} nails a perfect cartwheel right at ringside, and the crowd erupts like she already won something.",
    "{X} tumbles in with real polish — this crowd knows genuine talent when they see it.",
    "Here comes {X}, acrobatics and all, and this building is fully behind her tonight.",
  ],
  "Cheyenne Cher": [
    "{X} does a series of flips and cartwheels on her way to the ring, and the crowd applauds every one of them.",
    "{X} tumbles to the ring with real acrobatic flair — always a treat to watch, and the crowd lets her know it.",
    "Here comes {X}, cartwheeling in like she's got something to prove tonight — the crowd cheering her on the whole way.",
    "{X} flips her way in with real flair, and this crowd is soaking up every second of it.",
    "{X} throws in an extra tumble just for show, and the fans absolutely love the extra effort.",
    "Here comes {X}, all grace and athleticism — the crowd's cheering like she's already won.",
  ],
  "Colonel Ninotchka": [
    "The crowd erupts in boos the moment {X} steps into view.",
    "{X} marches to the ring like she's leading an invasion — spare us the theatrics.",
    "Here comes {X}, glaring at the crowd like they personally offended her — charming as ever.",
    "{X} salutes nobody in particular and glares at the crowd like they're all under investigation.",
    "{X} marches down that aisle in perfect goose-step rhythm — somebody remind her this isn't a parade.",
    "Here comes {X}, sneering at the flags in the crowd like they personally betrayed the motherland.",
  ],
  "Mt. Fiji": [
    "{X} slaps hands with fans all along the aisle on her way to the ring.",
    "{X} takes her time greeting every fan she passes — an absolute fan favorite.",
    "Here comes {X}, high-fiving the front row the whole way down — the crowd adores her.",
    "{X} takes her sweet time down that aisle, soaking up every ounce of love this crowd's got for her.",
    "{X} scoops up a kid for a photo on her way in, and this whole arena melts on the spot.",
    "Here comes {X}, and the pop she gets just walking out could power the whole arena.",
  ],
  "Chainsaw": [
    "{X} fires up her chainsaw the moment she steps through the entrance — it's already roaring before she's even in full view.",
    "{X} revs that chainsaw the second she comes through the curtain — the sound alone has fans in the front rows covering their ears.",
    "Here comes {X}, chainsaw already roaring from the second she walked out — I would very much like her to turn that thing off.",
    "{X} waves that chainsaw at a few fans in the front row, who scatter like it's an actual threat.",
    "{X} cackles over the roar of the chainsaw, and honestly, security should be a lot more concerned than they look.",
    "Here comes {X}, chainsaw blazing, and I would very much like everyone within ten feet of her to reconsider their seating.",
  ],
  "Zelda": [
    "{X} trips right over the middle rope getting into the ring — smooth entrance, that was not.",
    "{X} nearly takes a spill on the ring steps — grace has never been her strong suit.",
    "Here comes {X}, fumbling her way in as usual — somehow the crowd loves her more for it.",
    "{X} trips over her own shoelace before she's even off the ramp — bless her heart.",
    "{X} waves enthusiastically at the wrong section of the crowd entirely — they wave back anyway.",
    "Here comes {X}, tripping and stumbling as always — somehow this crowd cheers louder every time she does.",
  ],
  "Hollywood": [
    "{X} doesn't even wait for the bell — she jumps {Y} from behind before the introductions are even finished! Absolutely no honor in that.",
    "{X} skips the introductions entirely and blindsides {Y} before she can even get her bearings — a real coward's move.",
    "There's no formal entrance from {X} tonight — she just attacks {Y} outright. Somebody remind her this is supposed to be a sport.",
    "{X} doesn't bother with the aisle at all tonight — she's already climbing in over the barricade to get at {Y}.",
    "{X} shoves a cameraman out of her way just to get to the ring quicker — patience was never her strong suit.",
    "Here comes {X}, or rather, here's {X} already mid-attack — she skipped the whole 'walking down the aisle' part entirely.",
  ],
  "Tiffany Mellon": [
    "{X} is escorted to the ring by her butler Jeeves, who looks thoroughly unimpressed by the whole affair.",
    "{X} arrives with Jeeves in tow, carrying her robe like she's walking into a ballroom, not a wrestling ring.",
    "Here comes {X}, every bit the Park Avenue socialite, Jeeves trailing dutifully behind.",
    "{X} waves a gloved hand to the crowd, every inch the Park Avenue socialite, Jeeves shuffling along behind her.",
    "{X} pauses to let Jeeves adjust her robe mid-aisle — the crowd finds the whole spectacle charming.",
    "Here comes {X}, dripping in old money glamour, Jeeves trailing along right on cue.",
  ],
  "The California Doll": [
    "{X} comes strolling out carrying a surfboard, because of course she does.",
    "{X} rides that surfboard-carrying entrance all the way to the ring — pure California cool.",
    "Here comes {X}, surfboard in hand, looking like she just walked off the beach.",
    "{X} hangs ten off the edge of the ramp just for laughs, and the crowd absolutely eats it up.",
    "{X} tosses her surfboard to a fan at ringside to hold for her — total California cool.",
    "Here comes {X}, sunny as ever, surfboard in tow — this crowd's fully caught the wave with her.",
  ],
  "Dallas": [
    "{X} makes her entrance swinging a lasso around like she just rode in off the range.",
    "{X} twirls that lasso the whole way to the ring — the crowd loves the showmanship.",
    "Here comes {X}, lasso spinning, boots stomping — pure Texas through and through.",
    "{X} tips her hat to the crowd on the way down, lasso spinning the whole time.",
    "{X} lassos an imaginary steer just for showmanship, and the crowd whoops it up.",
    "Here comes {X}, boots and lasso, every inch the cowgirl — this crowd's fully saddled up behind her.",
  ],
  "Tulsa": [
    "{X} makes her entrance swinging a lasso around like she just rode in off the range.",
    "{X} comes out lasso in hand, working the crowd like she's at a rodeo.",
    "Here comes {X}, twirling that rope with real skill — this isn't just for show.",
    "{X} tips her hat and gives the crowd a wink on her way down — pure rodeo charm.",
    "{X} spins that lasso into a big loop just to hear the crowd cheer, and cheer they do.",
    "Here comes {X}, rodeo queen sash and all — this crowd's rooting hard for her tonight.",
  ],
  "Attaché": [
    "{X} storms out like she's on a military mission, spitting on the ring announcer, the referee, and anyone else unlucky enough to be nearby.",
    "{X} marches to the ring barking orders at nobody in particular — someone tell her the war's over.",
    "Here comes {X}, spitting at ringside fans on her way in — utterly classless.",
    "{X} snaps a salute at nobody, then spits directly at a fan's shoes — absolutely zero class.",
    "{X} barks a mock cadence count at the crowd like they're new recruits — nobody signed up for this, ma'am.",
    "Here comes {X}, marching in like she's storming a beach, sneering at everyone within fatigues' reach.",
  ],
  "Dementia": [
    "{X} is wheeled to the ring in a restraint cage, silent behind that hockey mask and clutching an axe — dead quiet, and deeply unsettling.",
    "Here comes {X}, still in that cage — this time clutching that porcelain doll of hers instead, staring blankly at nothing.",
    "{X} is rolled out in the restraint cage as usual — not a word out of her, just that mask staring back at the crowd.",
    "{X} presses her mask against the cage bars, staring silently at {Y} — dead quiet, and somehow worse for it.",
    "The restraint cage creaks to a stop, and {X} just sits there, motionless, axe in hand — the whole arena goes quiet.",
    "Here comes {X} again, silent as ever behind that mask — there's something about the stillness that unsettles this crowd more than any noise could.",
  ],
  "Arlene": [
    "{X} nags and complains the entire way to the ring — the outfits, the lighting, the crowd, nothing is good enough for her tonight.",
    "{X} marches to the ring already mid-rant about something — I stopped listening two complaints ago.",
    "Here comes {X}, griping at everyone she passes — somebody get this woman a vacation.",
    "{X} stops mid-rant to complain about the ring lighting specifically — she truly has a note for everything.",
    "{X} snaps at a cameraman for getting her 'bad side,' whatever that means for a Housewife.",
    "Here comes {X}, already listing grievances before she's even reached the ropes — exhausting, just exhausting.",
  ],
  "Phyllis": [
    "{X} nags and complains the entire way to the ring — the outfits, the lighting, the crowd, nothing is good enough for her tonight.",
    "{X} is already fussing at ringside staff before she's even reached the ring — exhausting, honestly.",
    "Here comes {X}, complaining under her breath the whole way down — some things never change.",
    "{X} stops mid-rant to gripe about the ring lighting specifically — a note for absolutely everything, this one.",
    "{X} snaps at a stagehand over something nobody else even noticed — the complaints never stop with her.",
    "Here comes {X}, already muttering complaints before she's reached the ring — some things never change.",
  ],
  "Jungle Woman": [
    "{X} comes out to the ring leading Nature Boy on a leash, stationing him ringside as she climbs in.",
    "{X} stalks to the ring with Nature Boy trailing meekly right behind her, eyes darting everywhere — he clearly doesn't want to be here.",
    "Here comes {X}, Nature Boy keeping close to her heel the whole way, timid as ever — she's got him thoroughly trained.",
    "{X} yanks Nature Boy's leash sharply just to remind everyone who's in charge out here.",
    "{X} snarls at a few ringside fans who get too close to Nature Boy — protective, in the coldest possible way.",
    "Here comes {X}, Nature Boy cowering right on cue — she rules that leash with an iron fist.",
  ],
};

// One in four times, whichever Heavy Metal Sister is in the match gets
// escorted to the ring in a straitjacket instead of her usual entrance —
// orderlies walking her down, freed right before the bell.
const TAPE_STRAITJACKET_ENTRANCE_LINES = [
  "{X} is escorted to the ring in a straitjacket tonight, a couple of very nervous orderlies walking her down the aisle.",
  "They've got {X} in a straitjacket for this one — the orderlies undo the straps right at ringside and get out of there as fast as they can.",
  "Here comes {X}, strapped into a straitjacket and grinning the whole way down — the crowd doesn't know whether to laugh or run.",
];

// When only one wrestler in the match has a signature entrance, the
// other one isn't just standing there waiting — she gets a reaction of
// her own, usually somewhere between unimpressed and disgusted.
// What third-wrestler interference actually DOES physically, rather
// than just a generic "helped out" mention — filled with the name of
// whoever's on the receiving end of it (the beneficiary's opponent).
const TAPE_INTERFERENCE_ACTIONS = [
  "cracks {opp} across the back with a forearm shot from the apron",
  "reaches through the ropes and yanks {opp}'s ankle out from under her at exactly the wrong moment",
  "slides a foot in to trip {opp} up mid-charge",
  "grabs a fistful of {opp}'s hair from ringside and hauls her backward",
  "blindsides {opp} with a cheap shot the second her back is turned",
  "chokes {opp} from outside the ring while the referee's attention is elsewhere",
  "shoves {opp} face-first into the ring post from the apron",
  "trips {opp} clean off her feet from the apron, timed perfectly",
];

const TAPE_ENTRANCE_REACTION_LINES = [
  "{X} watches all that from the entrance ramp with an expression of pure disgust.",
  "{X} just stands there, completely unimpressed by the whole spectacle {Y} just put on.",
  "{X} rolls her eyes at {Y}'s entrance — clearly not a fan of the theatrics.",
  "{X} looks like she's already regretting being in the same building as {Y}, let alone the same ring.",
  "{X} watches {Y}'s entrance with a look somewhere between disgust and disbelief.",
  "{X} just shakes her head — she is clearly not buying whatever {Y} is selling.",
  "{X} crosses her arms and waits, visibly unimpressed by {Y}'s whole routine.",
  "{X} makes a face like she just smelled something rotten — {Y}'s entrance did NOT land well with her.",
];

// Used to open the commentary when neither wrestler has a signature
// entrance of their own.
const TAPE_GENERIC_INTROS = [
  "Ladies and gentlemen, we have a battle here today between {A} and {B}!",
  "It's time — {A} and {B} are set to square off right here!",
  "Get ready, folks — {A} takes on {B} in what promises to be a wild one!",
  "Here we go — {A} versus {B}, and the crowd is already on its feet!",
  "Welcome back to GLOW! Tonight's main event: {A} versus {B}!",
  "You've been waiting for this one, folks — {A} and {B}, right here, right now!",
  "This is the matchup everybody's been talking about — {A} against {B}!",
  "The arena is PACKED tonight for {A} and {B} — let's get to it!",
  "Two very different women, one ring — {A} takes on {B} tonight!",
  "It's the moment you've all been waiting for — {A} versus {B}!",
  "Buckle up, folks — {A} and {B} are about to tear this place apart!",
  "The crowd's already buzzing — {A} and {B} make their way to the ring!",
];

// The announcer never bothers hiding his disdain for the heel side —
// this fires as a sneering aside for any heel who doesn't already have
// her own signature entrance line above.
const TAPE_HEEL_DISDAIN_LINES = [
  "And of course, {X} can't just walk to the ring like a normal competitor.",
  "There's {X} — and already I can feel this crowd's collective eye-roll.",
  "{X} soaks in the boos like she's earned a standing ovation. She has not.",
  "I'll say this for {X} — she's exactly as unpleasant in person as she is on paper.",
  "Here's {X}, folks. Try to contain your excitement.",
  "{X} struts down that aisle like she owns the place. She does not.",
  "Somebody remind {X} that the fans booing her are not, in fact, cheering.",
  "{X} makes her way down looking pleased with herself, as usual — I can't imagine why.",
];

// A guaranteed opener right after the intro — the bell rings and the
// match actually kicks off, so it doesn't drift straight from
// introductions into random mid-match action.
// Not every match explodes out of the gate — some start slower, feeling
// each other out before the real action kicks in.
const TAPE_SLOW_KICKOFF_BEATS = [
  "The bell rings, but {A} and {B} take their time here, circling for a few seconds before anything happens.",
  "Not exactly a fast start — {A} and {B} feel each other out for a moment before the real action begins.",
  "{A} and {B} take a slow lap around the ring first — no rush to get started just yet.",
  "The bell's rung, but nobody's exactly sprinting into this one — {A} and {B} are sizing each other up first.",
  "A slower start to this one, folks — {A} and {B} trade a few tentative feints before committing to anything.",
  "{A} and {B} circle the ring for a beat, neither one wanting to make the first mistake.",
  "This one's starting cautious — {A} and {B} both know better than to rush in blind.",
  "Not much urgency out of the gate here — {A} and {B} take their sweet time getting into this one.",
];

// Sometimes the bell rings and nobody moves for a second — just a long
// staredown first. The heel is usually the intimidating one here, except
// when Mt. Fiji's involved — her size means she's always the one who
// has the room, heel or not.
const TAPE_STAREDOWN_LINES = [
  "Before the bell even rings, {X} and {Y} share a long staredown in the middle of the ring — and it's clear {Y} isn't exactly thrilled to be this close to {X}.",
  "{X} and {Y} stand nose to nose after the bell, neither one blinking — but it's {Y} who looks rattled first.",
  "There's a long staredown before the first move gets thrown — {X} clearly has the psychological edge here, and {Y} knows it.",
  "{X} gets right in {Y}'s face before the action even starts — {Y} holds her ground, but just barely.",
  "The two of them just stand there for a second, sizing each other up — {X} looks like she's already won this part of the fight.",
];

// Little Fiji is timid and never goes straight after her opponent — her
// matches open with her looking scared, getting chased around, or just
// plain avoiding the fight for as long as she possibly can.
const TAPE_LITTLE_FIJI_KICKOFF_LINES = [
  "The bell rings and {X} immediately backs away, looking downright terrified of {Y} — this could be over before it even starts.",
  "{Y} takes one step toward {X}, and {X} yelps and scrambles to the far side of the ring!",
  "{X} looks absolutely scared stiff standing across from {Y} — can you blame her?",
  "The bell rings and {X} takes off running, with {Y} chasing her all the way around the ring!",
  "{X} keeps glancing nervously at the crowd, like she's looking for any way out of this one.",
  "{X} puts both hands up defensively before {Y} has even moved a muscle — she knows exactly what she's up against.",
  "{X} ducks behind the referee, using him as a human shield from {Y} — the crowd's howling with laughter.",
];

// Half the time, the heel doesn't wait for a fair start at all — she
// gets a cheap shot in while the face isn't looking.
const TAPE_HEEL_CHEAPSHOT_KICKOFF_LINES = [
  "The bell barely rings before {A} blindsides {B} with a dropkick while she's still getting her bearings!",
  "{B} isn't even looking, and {A} catches her with a cheap-shot dropkick right out of the gate!",
  "{A} doesn't wait for a lock-up — she dropkicks {B} the second her back is turned!",
  "{B} is still waving to the crowd when {A} blindsides her with a dropkick — so much for a fair start!",
];

// Mt. Fiji, Matilda the Hun, and Big Bad Mama never leave their feet —
// no dropkicks, no leaping moves of any kind. Their cheap shots are all
// ground-based power instead.
const TAPE_GIANT_CHEAPSHOT_KICKOFF_LINES = [
  "The bell barely rings before {A} blindsides {B} with a clothesline while she's still getting her bearings!",
  "{B} isn't even looking, and {A} catches her with a cheap-shot shoulder tackle right out of the gate!",
  "{A} doesn't wait for a lock-up — she flattens {B} with a forearm smash the second her back is turned!",
  "{B} is still waving to the crowd when {A} blindsides her with a clothesline — so much for a fair start!",
];

// Some of the nicer faces — Sally and Amy especially — offer a
// good-sportsmanship handshake before the bell, only for the heel to
// attack instead.
const TAPE_HANDSHAKE_ATTACK_KICKOFF_LINES = [
  "{B} extends a hand for a good, clean handshake — and {A} answers with a dropkick instead! So much for sportsmanship!",
  "{B} offers her hand before the bell even finishes ringing, and {A} just attacks her outright — that handshake was NOT reciprocated!",
  "{B} sticks her hand out, all smiles, looking for a fair shake — {A} slaps it away and blindsides her instead!",
];
const TAPE_GIANT_HANDSHAKE_ATTACK_KICKOFF_LINES = [
  "{B} extends a hand for a good, clean handshake — and {A} answers with a clothesline instead! So much for sportsmanship!",
  "{B} offers her hand before the bell even finishes ringing, and {A} just flattens her with a forearm smash — that handshake was NOT reciprocated!",
  "{B} sticks her hand out, all smiles, looking for a fair shake — {A} slaps it away and levels her with a shoulder tackle instead!",
];

const TAPE_KICKOFF_BEATS = [
  "There's the bell! {A} charges right at {B} and — OHHH! Sends her flying over the top rope before the ring announcer's even sat down!",
  "And we are UNDERWAY! {A} and {B} lock up immediately — no feeling-out process at all in this one!",
  "Bell rings and {A} comes out swinging! {B} barely gets her guard up in time!",
  "Here we go, folks! {B} goes for a handshake — and {A} just clotheslines her instead! Not exactly sporting, but that's how we do it around here!",
  "The bell hasn't even finished ringing and {A} is already in {B}'s face! This one's starting HOT!",
  "And it's on! {A} and {B} circle each other for about half a second before it turns into an all-out brawl!",
  "There's the bell, and {A} wastes zero time going right after {B}!",
  "And we're off! {B} tries to establish some distance, but {A} isn't having any of it!",
  "The referee barely gets out of the way before {A} and {B} collide right in the middle of the ring!",
  "Bell sounds, and it's {B} who gets the jump on {A} this time — quick start for her!",
  "Right out of the gate, {A} and {B} are already trading shots — this crowd is LOUD!",
  "No handshake, no formalities — {A} and {B} go straight at each other the second that bell rings!",
  "The bell rings and {A} lets out a roar before charging straight at {B}!",
  "Here we go! {B} tries to get her bearings, but {A} is already three steps ahead!",
];

// Hollywood's already jumped her opponent before the bell — no formal
// kickoff needed, the fight's already spilling into the ring.
const TAPE_HOLLYWOOD_AMBUSH_KICKOFF = [
  "The referee scrambles to get this thing under control, but {A} and {B} are already going at it!",
  "There's no bell to ring here — this fight already started, and the referee's just trying to catch up!",
  "{B} is still trying to get her bearings from that ambush as {A} keeps the pressure on!",
];

// Envy and Adore of the Soul Patrol have a 25% chance of pulling the
// same trick as Hollywood — jumping their opponent before the bell
// instead of waiting through a formal entrance.
const TAPE_STREET_PUNK_AMBUSH_LINES = [
  "{X} doesn't even wait for the bell — she jumps {Y} from behind before the introductions are even finished! Absolutely no honor in that.",
  "{X} skips the introductions entirely and blindsides {Y} before she can even get her bearings — a real coward's move.",
  "There's no formal entrance from {X} tonight — she just attacks {Y} outright. Somebody remind her this is supposed to be a sport.",
];

// A handful of wrestlers can't resist grabbing the mic from the ring
// announcer right after their intro to get one last insult in before the
// bell even rings.
const TAPE_MIC_GRAB_LINES = {
  "Colonel Ninotchka": [
    "Before the bell, {X} snatches the mic right out of the ring announcer's hand — \"{Y} is weak, like all Americans — I will crush her!\"",
    "{X} grabs the mic and glares at {Y} — \"You are soft! The Motherland does not produce weaklings like you!\"",
  ],
  "Spanish Red": [
    "{X} grabs the mic away from the ring announcer before the bell, fired up — \"I fight for my people, for my country! {Y} doesn't know the meaning of real pride!\"",
    "{X} snatches the mic, shouting to the crowd — \"Tonight I fight for my homeland! {Y} will learn what pride looks like!\"",
    "{X} grabs the mic before the bell, practically shaking with passion — \"Everything I do, I do for my country! {Y} doesn't stand a chance against that!\"",
  ],
  "Matilda the Hun": [
    "{X} rips the mic out of the ring announcer's hands before the bell even rings — \"I will BREAK her! She's nothing — a puny opponent, unworthy of this ring!\"",
    "{X} snatches the mic, screaming — \"I'll eat {Y} like raw meat! There will be NOTHING left when I'm through!\"",
    "{X} grabs the mic before the bell — \"{Y} doesn't stand a chance against me — nobody does! I will BREAK her!\"",
    "{X} grabs the mic before the bell, but she's not even looking at {Y} anymore — she's screaming right at the crowd — \"You are ALL weak! Every last one of you!\"",
    "{X} snatches the mic and turns on the crowd entirely, roaring — \"Sit down and shut up, all of you! This is not a circus!\"",
  ],
  "Tiffany Mellon": [
    "{X} grabs the mic before the bell, looking {Y} up and down — \"Sweetheart, that outfit is a tragedy, and your face isn't doing you any favors either!\"",
    "{X} snatches the mic and sneers at {Y} — \"Did you get dressed in the dark, honey? Because that is NOT a good look!\"",
  ],
  "Star": [
    "{X} grabs the mic before the bell, staring intently at {Y} — \"The stars have already decided your fate tonight... and it is not a good one.\"",
    "{X} snatches the mic and reads {Y}'s future right there in the ring — \"I see... darkness. A very bad night for you.\"",
    "{X} grabs the mic before the bell and looks {Y} dead in the eye — \"Mercury is in retrograde, and so is your luck tonight.\"",
  ],
  "Evangelina": [
    "{X} takes the mic before the bell, not to trash-talk, but to preach — \"{Y} comes to this ring dressed like a common sinner! Cover yourself, child, before the Lord sees fit to punish you Himself!\"",
    "{X} grabs the mic and delivers a full sermon at {Y}'s expense — \"Look at this outfit! Shameless! You'll answer for this display one day, {Y}, mark my words!\"",
    "{X} snatches the mic, not for insults, but for scripture — \"{Y}, that get-up you're wearing is an affront to decency itself! Repent before it's too late!\"",
  ],
};

// Tiffany Mellon doesn't grab the mic nearly as often as the others —
// she's choosier about when she bothers. Evangelina's sermon is one of
// her defining traits, so she gives it "usually" rather than always.
const TAPE_MIC_GRAB_CHANCE = {
  "Tiffany Mellon": 0.33,
  "Evangelina": 0.7,
};

// Ninotchka reserves special contempt for the roster's Rich Girls —
// when she's up against one of them specifically, her mic moment turns
// into a full political tirade instead of her usual line.
const TAPE_NINOTCHKA_RICH_GIRL_MIC_LINES = [
  "Before the bell, {X} grabs the mic and sneers at {Y} — \"Capitalist pig! All your money, your jewels — it means NOTHING! The Motherland will bury you!\"",
  "{X} snatches the mic and points right at {Y} — \"Look at this Capitalist pig, flaunting her riches! Disgusting! Tonight you answer for it!\"",
];

// Big Bad Mama demands opponents with some meat on their bones — these
// are the wrestlers scrawny enough to set her off.
const TAPE_MAMA_SMALL_OPPONENT_TARGETS = new Set([
  "Sally the Farmer's Daughter", "Babe the Farmer's Daughter", "Amy the Farmer's Daughter",
  "Susie Spirit", "Debbie Debutante", "Vicky Victory", "Cheyenne Cher",
  "Little Fiji", "Little Egypt", "Little Feather",
]);
const TAPE_MAMA_SMALL_OPPONENT_MIC_LINES = [
  "{X} grabs the mic before the bell, hands on hips — \"{authority}, somebody, ANYBODY — why do you keep giving me these scrawny little girls?! Give me somebody with some MEAT on her bones!\"",
  "{X} snatches the mic and complains straight to {authority} — \"I asked for a REAL opponent! Look at {Y}! There's nothing to her! Bring me some meat next time!\"",
  "{X} grabs the mic, clearly fed up — \"{authority}, this is the last time you send me a toothpick like {Y}! I want a challenge, not a light snack!\"",
];

// Zelda's too timid to grab the mic herself — David McLane or Johnny C.
// hold it out for her instead, and she offers up quiet, nerdy little
// criticisms rather than any real trash talk.
const TAPE_ZELDA_PRE_MATCH_LINES = [
  "{authority} holds the mic out for {X}, who mumbles something about {Y}'s technique being \"statistically below average\" — not exactly fighting words, but she means it.",
  "{X} leans nervously into the mic {authority}'s holding for her and offers a timid little critique of {Y}'s form — the crowd can barely hear it.",
  "{authority} has to hold the mic right up to {X}'s mouth just to catch her quiet, nerdy dig at {Y}'s wrestling fundamentals.",
];

// Zelda uses a piece of meat as bait to lure and distract Beastie or
// Matilda the Hun mid-match — pure wit over strength, exactly her style.
const TAPE_ZELDA_MEAT_BAIT_TARGETS = new Set(["Beastie", "Matilda the Hun"]);
const TAPE_ZELDA_MEAT_BAIT_LINES = [
  "{X} pulls out a piece of meat from seemingly nowhere and tosses it — {Y} completely loses focus chasing after it!",
  "{X} dangles a piece of meat just out of reach, and {Y} is too distracted by it to see the next move coming!",
  "Where did {X} even get that? She waves a piece of meat at {Y}, who abandons the match entirely just to get at it!",
];

// Matilda reserves a special line for the roster's more wholesome,
// all-American types — calling them out as "puny Americans" instead of
// her usual generic threat.
const TAPE_MATILDA_PUNY_AMERICAN_TARGETS = new Set([
  "Americana", "Susie Spirit", "Tina Ferrari", "Debbie Debutante", "Vicky Victory",
  "Lightning", "Thunderbolt", "Amy the Farmer's Daughter", "Sally the Farmer's Daughter",
  "Tara the Southern Belle", "Babe the Farmer's Daughter",
]);
const TAPE_MATILDA_PUNY_AMERICAN_MIC_LINES = [
  "{X} rips the mic out of the ring announcer's hands — \"You puny American! You don't stand a chance against me!\"",
  "{X} grabs the mic before the bell and sneers at {Y} — \"Puny American! I will BREAK you!\"",
];

// The Heavy Metal Sisters and the Hicks can't resist doing a mocking
// impression of their opponent before the bell rings — imitating her
// entrance, her walk, her poses — physical performance, not talking.
const TAPE_IMAGE_MOCK_LINES = {
  "Spike": [
    "{X} does an exaggerated, mocking impression of {Y}'s entrance, strutting around like a total goofball — the crowd's laughing at {Y}, not with her.",
    "{X} mimics {Y}'s signature pose, hamming it up for the crowd — {Y} does NOT find it funny.",
  ],
  "Chainsaw": [
    "{X} does an exaggerated, mocking impression of {Y}'s entrance, strutting around like a total goofball — the crowd's laughing at {Y}, not with her.",
    "{X} mimics {Y}'s signature pose, hamming it up for the crowd — {Y} does NOT find it funny.",
  ],
  "Sara": [
    "{X} puts on a mocking impression of {Y}, exaggerating every little mannerism for laughs.",
    "{X} imitates {Y}'s pose from her entrance, hamming it up for the crowd — {Y} is not amused.",
  ],
  "Mabel": [
    "{X} puts on a mocking impression of {Y}, exaggerating every little mannerism for laughs.",
    "{X} imitates {Y}'s pose from her entrance, hamming it up for the crowd — {Y} is not amused.",
  ],
};


function tapeSoloCandidates(w, other, chainsawAlreadyOut) {
  const lines = [];
  const eccentric = TAPE_ECCENTRIC_LINES[w.name];
  if (eccentric) {
    let options = Array.isArray(eccentric) ? eccentric : [eccentric];
    if (w.name === "Chainsaw" && chainsawAlreadyOut) {
      options = options.filter(opt => !opt.includes("revs up that chainsaw instead of locking up"));
    }
    if (options.length > 0) {
      const pick = options[Math.floor(Math.random() * options.length)];
      lines.push(pick.replaceAll("{X}", tapeShortName(w)).replaceAll("{Y}", tapeShortName(other)));
    }
  }
  for (const cat of TAPE_CATEGORIES) {
    if (cat.members.includes(w.name)) {
      const tpl = cat.soloLines[Math.floor(Math.random() * cat.soloLines.length)];
      lines.push(tpl.replaceAll("{X}", tapeShortName(w)).replaceAll("{Y}", tapeShortName(other)));
    }
  }
  return lines;
}

// Builds a short multi-beat "commentary" of the match — a couple of
// generic action exchanges (plus optional shared-trait, rivalry, or
// individual-quirk asides), followed by an in-the-moment announcer call
// for the finish.
function generateTapeBlurb(a, b, result) {
  const { winner, loser, method, interference, auntKitty, dirtyWin, refMissed, mtFijiRescue, underRingWeapon, weaponGrabbed, refMissedCheating, zeldaHelp, refKnockedOut, refKnockedOutDecisive, injured, injuryMove, littleFijiKnockoutWin, knockoutHelper, palestinaMachete, palestinaMacheteDQ } = result;

  // A handful of matchups are known, heated rivalries — these get extra
  // passionate mid-match commentary and a dedicated post-match line
  // acknowledging the outcome, regardless of how the match actually ends.
  const rivalryMatch = TAPE_RIVALRY_PAIRS.find(p =>
    (p.pair[0] === a.name && p.pair[1] === b.name) ||
    (p.pair[0] === b.name && p.pair[1] === a.name)
  );
  function rivalryPostMatchLine() {
    if (!rivalryMatch || !winner || !loser) return [];
    const tpl = rivalryMatch.postMatchLines[Math.floor(Math.random() * rivalryMatch.postMatchLines.length)];
    return [tpl.replaceAll("{winner}", tapeShortName(winner)).replaceAll("{loser}", tapeShortName(loser))];
  }

  // The announcer's roasting is heavily biased toward the heel (a) —
  // faces get roasted only rarely, and never at all if the face happens
  // to be one of the wholesome, never-trash-talked types.
  const bIsWholesome = TAPE_NO_ROAST_TARGET.has(b.name);
  const roastTarget = (bIsWholesome || Math.random() < 0.95) ? a : b;
  const roastOther = roastTarget === a ? b : a;
  // Dementia, Mana, Chainsaw, and Spike never talk trash at all — pure
  // physical, silent, or screaming characters. Roast beats sometimes
  // name-drop BOTH wrestlers (not just the primary target), so if either
  // one is a true silent type, roast beats are dropped from the pool
  // entirely rather than risk her getting namedropped in a
  // trash-talk-flavored line.
  const anySilent = TAPE_NO_TRASH_TALK.has(a.name) || TAPE_NO_TRASH_TALK.has(b.name);
  // Getting flipped or bent into a Boston crab doesn't suit the giants'
  // size and no-selling style, so those specific beats get filtered out
  // whenever one of them is in the match.
  const anyGiant = TAPE_GIANT_WRESTLERS.has(a.name) || TAPE_GIANT_WRESTLERS.has(b.name);

  // Intro-phase filler (entrance only) always uses full names — that's
  // the one formal "introduction" moment. Everything from kickoff
  // onward uses fillABShort below instead, once the introduction's done.
  const fillAB = (tpl) => capitalizeFirst(stripRedundantArticles(tpl
    .replaceAll("{A}", a.name)
    .replaceAll("{B}", b.name)
    .replaceAll("{aGimmick}", tapeGimmick(a))
    .replaceAll("{bGimmick}", tapeGimmick(b))
    .replaceAll("{R}", roastTarget.name)
    .replaceAll("{R2}", roastOther.name)
    .replaceAll("{rGimmick}", tapeGimmick(roastTarget))));

  // Match-phase filler (everything after kickoff) uses each wrestler's
  // shortened name most of the time, occasionally swapping in her
  // gimmick label instead ("The Russian") for natural variety.
  const matchDisplay = (w) => Math.random() < 0.3 ? tapeLabel(w) : tapeShortName(w);
  // Kickoff and double-DQ content come after the entrance's already
  // introduced everyone by full name, so these use the same shortened
  // display as the rest of the match instead of the full compound name.
  const fillABShort = (tpl) => capitalizeFirst(stripRedundantArticles(tpl
    .replaceAll("{A}", matchDisplay(a))
    .replaceAll("{B}", matchDisplay(b))
    .replaceAll("{aGimmick}", tapeGimmick(a))
    .replaceAll("{bGimmick}", tapeGimmick(b))
    .replaceAll("{R}", matchDisplay(roastTarget))
    .replaceAll("{R2}", matchDisplay(roastOther))
    .replaceAll("{rGimmick}", tapeGimmick(roastTarget))));
  const fillMatch = (tpl) => {
    // Same duplication risk as fillWL: if a template also references a
    // gimmick token directly, force the plain short name for that side
    // instead of the gimmick-label variant (which would otherwise
    // sometimes read as "the Russian's Russian act...").
    const aNeedsShort = tpl.includes("{aGimmick}") || (tpl.includes("{rGimmick}") && roastTarget === a);
    const bNeedsShort = tpl.includes("{bGimmick}") || (tpl.includes("{rGimmick}") && roastTarget === b);
    const aName = aNeedsShort ? tapeShortName(a) : matchDisplay(a);
    const bName = bNeedsShort ? tapeShortName(b) : matchDisplay(b);
    const rName = roastTarget === a ? aName : bName;
    const r2Name = roastOther === a ? aName : bName;
    return capitalizeFirst(stripRedundantArticles(tpl
      .replaceAll("{A}", aName)
      .replaceAll("{B}", bName)
      .replaceAll("{aGimmick}", tapeGimmick(a))
      .replaceAll("{bGimmick}", tapeGimmick(b))
      .replaceAll("{R}", rName)
      .replaceAll("{R2}", r2Name)
      .replaceAll("{rGimmick}", tapeGimmick(roastTarget))
      .replaceAll("{adjA}", tapeAdjective(a))
      .replaceAll("{adjB}", tapeAdjective(b))
      .replaceAll("{moveA}", tapeMove(a))
      .replaceAll("{moveB}", tapeMove(b))
      .replaceAll("{insultR}", tapeInsult(roastTarget))
      .replaceAll("{insultR2}", tapeInsult(roastOther))
      .replaceAll("{emotion}", tapeEmotion())));
  };
  const fillWL = (tpl) => {
    // If a template also references the gimmick text directly
    // ({winnerGimmick}/{loserGimmick}), force the plain short name
    // instead of the gimmick-label variant for {winner}/{loser} — since
    // tapeLabel() IS that same gimmick text, using both in one template
    // would otherwise risk an exact duplication ("the rodeo queen's
    // rodeo queen style just wins out!").
    const winnerName = tpl.includes("{winnerGimmick}") ? tapeShortName(winner) : matchDisplay(winner);
    const loserName = tpl.includes("{loserGimmick}") ? tapeShortName(loser) : matchDisplay(loser);
    return capitalizeFirst(stripRedundantArticles(tpl
      .replaceAll("{winner}", winnerName)
      .replaceAll("{loser}", loserName)
      .replaceAll("{winnerGimmick}", tapeGimmick(winner))
      .replaceAll("{loserGimmick}", tapeGimmick(loser))
      .replaceAll("{winnerMove}", tapeMove(winner))
      .replaceAll("{winnerFinisher}", tapeFinisherDisplay(winner))));
  };

  const hollywoodInMatch = [a, b].find(w => w.name === "Hollywood");
  const palestinaInMatch = [a, b].find(w => w.name === "Palestina");
  // Envy and Adore each get a 25% chance of ambushing their opponent the
  // same way Hollywood always does — rolled once per match.
  const streetPunkCandidate = [a, b].find(w => w.name === "Envy" || w.name === "Adore");
  const streetPunkAmbush = streetPunkCandidate && Math.random() < 0.25;
  // Whoever's actually doing the ambushing this match, if anyone —
  // Hollywood always does; Envy/Adore only if their roll hit.
  const ambusherInMatch = hollywoodInMatch || (streetPunkAmbush ? streetPunkCandidate : null);
  // Chainsaw should only ever be shown getting her chainsaw ONCE per
  // Chainsaw's entrance (revving the chainsaw on the way out) is its own
  // independent moment and always fine on its own. What shouldn't happen
  // together is the mid-match "reveal" beat and the DQ finish both
  // treating the chainsaw as a first-time surprise — this tracks
  // whether the mid-match reveal already fired so the finish knows to
  // reference the chainsaw she already has instead of re-introducing it.
  let chainsawAlreadyOut = false;

  let entranceLines;
  // MTV's entrance needs to come after her opponent's — and after
  // everything else that happens pre-bell (reactions, mic-grabs,
  // mocking) — so her own line is held aside here and appended dead
  // last, once the whole pre-bell sequence is otherwise finished.
  const mtvInMatch = [a, b].find(w => w.name === "Melody Trouble Vixen (MTV)");
  let mtvOwnEntranceLine = null;
  if (ambusherInMatch) {
    // The ambusher jumps her opponent before the bell — but if the
    // opponent has her own signature entrance, that happens first (as
    // normal), and the ambush comes in as the second "entrance" instead
    // of skipping the opponent's moment entirely. Either way, we go
    // straight into the action right after — no formal mic-grab/reaction
    // beats once the ambush has already happened.
    const opponent = ambusherInMatch === a ? b : a;
    const pool = TAPE_ENTRANCE_LINES[ambusherInMatch.name] || TAPE_STREET_PUNK_AMBUSH_LINES;
    const ambushLine = pool[Math.floor(Math.random() * pool.length)]
      .replaceAll("{X}", ambusherInMatch.name)
      .replaceAll("{Y}", opponent.name);
    const opponentPool = TAPE_ENTRANCE_LINES[opponent.name];
    if (opponentPool) {
      const opponentLine = opponentPool[Math.floor(Math.random() * opponentPool.length)]
        .replaceAll("{X}", opponent.name)
        .replaceAll("{Y}", ambusherInMatch.name);
      entranceLines = [opponentLine, ambushLine];
    } else {
      entranceLines = [ambushLine];
    }
  } else {
    // 25% of the time, whichever Heavy Metal Sister is in the match gets
    // escorted to the ring in a straitjacket instead of her usual
    // entrance (Spike doesn't otherwise have a signature entrance of
    // her own, so this is the only one she ever gets).
    const straitjacketMember = [a, b].find(w => w.name === "Spike" || w.name === "Chainsaw");
    const useStraitjacket = !!straitjacketMember && Math.random() < 0.25;

    const usedOpeners = new Set();
    entranceLines = [a, b]
      .filter(w => TAPE_ENTRANCE_LINES[w.name] || (useStraitjacket && w === straitjacketMember))
      .map(w => {
        const opponent = w === a ? b : a;
        const isStraitjacket = useStraitjacket && w === straitjacketMember;
        const pool = isStraitjacket ? TAPE_STRAITJACKET_ENTRANCE_LINES : TAPE_ENTRANCE_LINES[w.name];
        // Avoid two entrances in the same match opening with the same
        // phrase (e.g. both starting with "Here comes X").
        let candidates = pool.filter(tpl => !usedOpeners.has(tapeLineOpener(tpl)));
        if (candidates.length === 0) candidates = pool;
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        usedOpeners.add(tapeLineOpener(chosen));
        const line = chosen
          .replaceAll("{X}", w.name)
          .replaceAll("{Y}", opponent.name);
        if (mtvInMatch && w === mtvInMatch) {
          mtvOwnEntranceLine = line;
          return null;
        }
        if (w.name === "Beastie" && Math.random() < 0.5) {
          return `${line} She's got a spiked mace in hand tonight, too — this crowd gives her an even wider berth than usual.`;
        }
        return line;
      })
      .filter(line => line !== null);

    // If only one wrestler has a signature entrance, the other one
    // doesn't just stand there quietly — she gets a reaction of her own.
    // Spike and Chainsaw are a special case: their "reaction" is always
    // the mocking impression (handled right here, immediately after the
    // entrances), never the generic disgust line, and never delayed
    // until later in the pre-bell sequence.
    const hmsMocker = [a, b].find(w => (w.name === "Spike" || w.name === "Chainsaw"));
    if (hmsMocker && Math.random() < 0.5) {
      const opponent = hmsMocker === a ? b : a;
      const pool = TAPE_IMAGE_MOCK_LINES[hmsMocker.name];
      const line = pool[Math.floor(Math.random() * pool.length)]
        .replaceAll("{X}", hmsMocker.name)
        .replaceAll("{Y}", opponent.name);
      entranceLines.push(line);
    }

    const aHasEntrance = !!TAPE_ENTRANCE_LINES[a.name] || (useStraitjacket && a === straitjacketMember);
    const bHasEntrance = !!TAPE_ENTRANCE_LINES[b.name] || (useStraitjacket && b === straitjacketMember);
    if (aHasEntrance !== bHasEntrance) {
      const performer = aHasEntrance ? a : b;
      const reactor = aHasEntrance ? b : a;
      if (reactor !== hmsMocker) {
        const tpl = TAPE_ENTRANCE_REACTION_LINES[Math.floor(Math.random() * TAPE_ENTRANCE_REACTION_LINES.length)];
        entranceLines.push(tpl.replaceAll("{X}", reactor.name).replaceAll("{Y}", performer.name));
      }
    }
  }

  if (entranceLines.length === 0) {
    const intro = TAPE_GENERIC_INTROS[Math.floor(Math.random() * TAPE_GENERIC_INTROS.length)];
    entranceLines = [fillAB(intro)];
  }

  // The announcer doesn't hide his disdain for the heels — even the ones
  // without a signature entrance of their own still get a sneering aside
  // worked in after the intro.
  if (!TAPE_ENTRANCE_LINES[a.name] && !ambusherInMatch && Math.random() < 0.5) {
    const tpl = TAPE_HEEL_DISDAIN_LINES[Math.floor(Math.random() * TAPE_HEEL_DISDAIN_LINES.length)];
    entranceLines = [...entranceLines, tpl.replaceAll("{X}", a.name)];
  }

  // A handful of wrestlers grab the mic from the ring announcer after
  // their intro to insult their opponent one last time before the bell
  // rings — skipped if Hollywood's already ambushed her opponent, since
  // there's no formal announcer moment left to interrupt.
  if (!ambusherInMatch) {
    const micGrabber = [a, b].find(w => TAPE_MIC_GRAB_LINES[w.name]);
    const micGrabberOpponent = micGrabber === a ? b : a;
    const micGrabberSkipped = micGrabber && micGrabber.name === "Evangelina" && micGrabberOpponent.name === "Mt. Fiji";
    const micGrabChance = (micGrabber && !micGrabberSkipped) ? (TAPE_MIC_GRAB_CHANCE[micGrabber.name] ?? 0.85) : 0;
    if (micGrabber && !micGrabberSkipped && Math.random() < micGrabChance) {
      const opponent = micGrabber === a ? b : a;
      const richGirls = TAPE_CATEGORIES.find(c => c.name === "Rich Girls").members;
      const pool = micGrabber.name === "Colonel Ninotchka" && richGirls.includes(opponent.name)
        ? TAPE_NINOTCHKA_RICH_GIRL_MIC_LINES
        : micGrabber.name === "Matilda the Hun" && TAPE_MATILDA_PUNY_AMERICAN_TARGETS.has(opponent.name)
        ? TAPE_MATILDA_PUNY_AMERICAN_MIC_LINES
        : TAPE_MIC_GRAB_LINES[micGrabber.name];
      const line = pool[Math.floor(Math.random() * pool.length)]
        .replaceAll("{X}", micGrabber.name)
        .replaceAll("{Y}", opponent.name);
      entranceLines = [...entranceLines, line];
    }
  }

  // Big Bad Mama can't stand getting matched up against the smaller,
  // scrawnier wrestlers on the roster — she grabs the mic to complain
  // straight to David McLane or Johnny C. about it before the bell.
  if (!ambusherInMatch) {
    const mamaComplainCandidate = [a, b].find(w => w.name === "Big Bad Mama");
    if (mamaComplainCandidate) {
      const mamaOpponent = mamaComplainCandidate === a ? b : a;
      if (TAPE_MAMA_SMALL_OPPONENT_TARGETS.has(mamaOpponent.name) && Math.random() < 0.6) {
        const tpl = TAPE_MAMA_SMALL_OPPONENT_MIC_LINES[Math.floor(Math.random() * TAPE_MAMA_SMALL_OPPONENT_MIC_LINES.length)];
        const line = tpl
          .replaceAll("{X}", mamaComplainCandidate.name)
          .replaceAll("{Y}", mamaOpponent.name)
          .replaceAll("{authority}", Math.random() < 0.5 ? "David McLane" : "Johnny C.");
        entranceLines = [...entranceLines, line];
      }
    }
  }

  // Zelda isn't a mic-grabber — she's too timid for that — but she does
  // offer up nerdy, mumbled criticisms of her opponent before the bell,
  // with David McLane or Johnny C. holding the mic out for her since she
  // won't take it herself.
  if (!ambusherInMatch) {
    const zeldaPreMatch = [a, b].find(w => w.name === "Zelda");
    if (zeldaPreMatch && Math.random() < 0.5) {
      const zeldaOpponent = zeldaPreMatch === a ? b : a;
      const tpl = TAPE_ZELDA_PRE_MATCH_LINES[Math.floor(Math.random() * TAPE_ZELDA_PRE_MATCH_LINES.length)];
      const line = tpl
        .replaceAll("{X}", tapeShortName(zeldaPreMatch))
        .replaceAll("{Y}", tapeShortName(zeldaOpponent))
        .replaceAll("{authority}", Math.random() < 0.5 ? "David McLane" : "Johnny C.");
      entranceLines = [...entranceLines, line];
    }
  }

  // The Hicks can't resist mocking their opponent's look before the bell
  // rings — half the time, whichever one of the two is in the match gets
  // a shot in about it. Spike and Chainsaw are handled separately,
  // immediately after entrances, so they're excluded here to avoid
  // mocking twice or out of order.
  if (!ambusherInMatch) {
    const imageMocker = [a, b].find(w => TAPE_IMAGE_MOCK_LINES[w.name] && w.name !== "Spike" && w.name !== "Chainsaw");
    if (imageMocker && Math.random() < 0.5) {
      const opponent = imageMocker === a ? b : a;
      const pool = TAPE_IMAGE_MOCK_LINES[imageMocker.name];
      const line = pool[Math.floor(Math.random() * pool.length)]
        .replaceAll("{X}", imageMocker.name)
        .replaceAll("{Y}", opponent.name);
      entranceLines = [...entranceLines, line];
    }
  }

  // MTV's own entrance line (if she has one this match) always comes
  // dead last in the pre-bell sequence — after her opponent, after any
  // reactions, mic-grabs, or mocking — since it wouldn't make sense for
  // her to show up and then have all of that still happen afterward.
  if (mtvOwnEntranceLine) {
    entranceLines = [...entranceLines, mtvOwnEntranceLine];
  }

  // Since Hollywood already jumped her opponent, there's no formal bell
  // to ring — the fight is already happening. Little Fiji is timid and
  // never rushes her opponent (or gets rushed), so her matches skip
  // straight to her own dedicated staredown/slow-build content. For
  // everyone else, half the time the heel gets a cheap shot in — a
  // sneaky dropkick while the face isn't looking — before a fair start
  // even happens; Sally and Amy specifically offer a handshake first and
  // get attacked instead. The remaining matches start with the usual
  // staredown, slow build, or fast lock-up.
  const intimidatorInMatch = [a, b].find(w => w.name === "Mt. Fiji");
  const intimidator = intimidatorInMatch || a;
  const intimidated = intimidator === a ? b : a;
  const littleFijiKickoff = [a, b].some(w => w.name === "Little Fiji");
  const niceFaceInMatch = [a, b].find(w => w.name === "Sally the Farmer's Daughter" || w.name === "Amy the Farmer's Daughter");
  const kickoffRoll = Math.random();
  let kickoff;
  if (ambusherInMatch) {
    kickoff = fillAB(TAPE_HOLLYWOOD_AMBUSH_KICKOFF[Math.floor(Math.random() * TAPE_HOLLYWOOD_AMBUSH_KICKOFF.length)]);
  } else if (littleFijiKickoff) {
    if (kickoffRoll < 0.3) {
      kickoff = TAPE_STAREDOWN_LINES[Math.floor(Math.random() * TAPE_STAREDOWN_LINES.length)]
        .replaceAll("{X}", tapeShortName(intimidator))
        .replaceAll("{Y}", tapeShortName(intimidated));
    } else {
      if (Math.random() < 0.6) {
        const littleFiji = [a, b].find(w => w.name === "Little Fiji");
        const opponent = littleFiji === a ? b : a;
        kickoff = TAPE_LITTLE_FIJI_KICKOFF_LINES[Math.floor(Math.random() * TAPE_LITTLE_FIJI_KICKOFF_LINES.length)]
          .replaceAll("{X}", tapeShortName(littleFiji))
          .replaceAll("{Y}", tapeShortName(opponent));
      } else {
        kickoff = fillABShort(TAPE_SLOW_KICKOFF_BEATS[Math.floor(Math.random() * TAPE_SLOW_KICKOFF_BEATS.length)]);
      }
      // A slower start leaves room for a quick color-commentator aside
      // before things actually get going.
      if (Math.random() < 0.3) {
        kickoff += TAPE_MOVE_AFTERTHOUGHTS[Math.floor(Math.random() * TAPE_MOVE_AFTERTHOUGHTS.length)];
      }
    }
  } else if (Math.random() < 0.5) {
    const heelIsGiant = TAPE_TRUE_GIANTS.has(a.name);
    if (niceFaceInMatch) {
      const pool = heelIsGiant ? TAPE_GIANT_HANDSHAKE_ATTACK_KICKOFF_LINES : TAPE_HANDSHAKE_ATTACK_KICKOFF_LINES;
      kickoff = fillABShort(pool[Math.floor(Math.random() * pool.length)]);
    } else {
      const pool = heelIsGiant ? TAPE_GIANT_CHEAPSHOT_KICKOFF_LINES : TAPE_HEEL_CHEAPSHOT_KICKOFF_LINES;
      kickoff = fillABShort(pool[Math.floor(Math.random() * pool.length)]);
    }
  } else if (kickoffRoll < 0.15) {
    kickoff = TAPE_STAREDOWN_LINES[Math.floor(Math.random() * TAPE_STAREDOWN_LINES.length)]
      .replaceAll("{X}", tapeShortName(intimidator))
      .replaceAll("{Y}", tapeShortName(intimidated));
  } else if (kickoffRoll < 0.35) {
    kickoff = fillABShort(TAPE_SLOW_KICKOFF_BEATS[Math.floor(Math.random() * TAPE_SLOW_KICKOFF_BEATS.length)]);
    // A slower start leaves room for a quick color-commentator aside
    // before things actually get going.
    if (Math.random() < 0.3) {
      kickoff += TAPE_MOVE_AFTERTHOUGHTS[Math.floor(Math.random() * TAPE_MOVE_AFTERTHOUGHTS.length)];
    }
  } else {
    // "No handshake, no formalities" implies there was ever an
    // expectation of one — doesn't fit Dementia or Mana, who never
    // engage in that kind of thing to begin with.
    const kickoffPool = [a, b].some(w => w.name === "Dementia" || w.name === "Mana")
      ? TAPE_KICKOFF_BEATS.filter(tpl => tpl !== "No handshake, no formalities — {A} and {B} go straight at each other the second that bell rings!")
      : TAPE_KICKOFF_BEATS;
    kickoff = fillABShort(kickoffPool[Math.floor(Math.random() * kickoffPool.length)]);
  }

  // A big enough talent gap (e.g. an 8 vs. a 3) doesn't need a full
  // back-and-forth match — one single decisive blow settles it, and the
  // commentary wraps up quickly instead of manufacturing a competitive
  // back-and-forth that wouldn't have actually happened.
  const ratingGap = Math.abs((TAPE_RATINGS[a.name] || 5) - (TAPE_RATINGS[b.name] || 5));
  if (method === "normal" && !interference && !auntKitty && !dirtyWin && !refMissed && !weaponGrabbed && !refMissedCheating && !zeldaHelp && !refKnockedOutDecisive && !rivalryMatch && ratingGap >= 5) {
    const squashLine = fillWL(TAPE_SQUASH_LINES[Math.floor(Math.random() * TAPE_SQUASH_LINES.length)]);
    return [...entranceLines, kickoff, squashLine];
  }

  // A double disqualification skips the normal pin-or-DQ finish entirely
  // — the match ends in mutual outside-the-ring chaos, no winner. Built
  // from three beats: the specific illegal chaos, the ref's escalating
  // count as neither wrestler lets up, then the final call.
  if (method === "double_dq") {
    const illegalLine = fillABShort(TAPE_DOUBLE_DQ_ILLEGAL_LINES[Math.floor(Math.random() * TAPE_DOUBLE_DQ_ILLEGAL_LINES.length)]);
    const countLine = fillABShort(TAPE_DOUBLE_DQ_COUNT_LINES[Math.floor(Math.random() * TAPE_DOUBLE_DQ_COUNT_LINES.length)]);
    const chaosLine = fillABShort(TAPE_DOUBLE_DQ_LINES[Math.floor(Math.random() * TAPE_DOUBLE_DQ_LINES.length)]);
    return [...entranceLines, kickoff, illegalLine, countLine, chaosLine, ...rivalryPostMatchLine()];
  }

  // The Housewives barely wrestle — their matches are dominated by
  // nagging, insults, and household weapons, with only a tiny bit of
  // real wrestling mixed in. This overrides the normal beat pool
  // entirely instead of just nudging the odds.
  const housewifeMember = [a, b].find(w => TAPE_HOUSEWIFE_ROSTER.has(w.name));
  let beats;
  if (housewifeMember) {
    const opponent = housewifeMember === a ? b : a;
    const opponentIsBeauty = (TAPE_WRESTLER_DESCRIPTORS[opponent.name] || []).includes("beauty");
    beats = [];
    const usedHousewifeLines = new Set();
    for (let i = 0; i < 4; i++) {
      beats.push(capitalizeFirst(tapeHousewifeLine(housewifeMember, opponent, opponentIsBeauty, usedHousewifeLines)));
    }
    if (Math.random() < 0.4) {
      const actionPool = anyGiant ? TAPE_ACTION_BEATS.filter(tpl => tapeBeatAllowed(tpl, a, b)) : TAPE_ACTION_BEATS;
      const tpl = actionPool[Math.floor(Math.random() * actionPool.length)];
      beats.push(fillMatch(tpl));
    }
  } else {
    // Dementia and the Headhunters don't talk trash — if both wrestlers
    // in this match are silent types, roast beats are dropped from the
    // pool entirely instead of firing on nobody in particular. A few
    // moves get filtered the same way based on who's actually giving or
    // receiving them, since giants can dish some things out but never
    // receive them (see tapeBeatAllowed).
    const heelRoastBeats = roastTarget === a ? TAPE_HEEL_ONLY_ROAST_BEATS : [];
    // McLane and Johnny C. never both get name-dropped in the same
    // match — pick one side's pool per match, never both.
    const ringsideAuthorityPool = Math.random() < 0.5 ? TAPE_MCLANE_LINES : TAPE_JOHNNY_C_LINES;
    let pool = anySilent
      ? TAPE_ACTION_BEATS.filter(tpl => !TAPE_SPEECH_ACTION_BEATS.has(tpl))
      : [...TAPE_ACTION_BEATS, ...TAPE_ROAST_BEATS, ...heelRoastBeats, ...TAPE_PILLAR_LINES, ...ringsideAuthorityPool];
    if (anyGiant) {
      pool = pool.filter(tpl => tapeBeatAllowed(tpl, a, b));
    }
    beats = shuffleArray(pool).slice(0, 3).map(tpl => {
      let line = fillMatch(tpl);
      // A regular action beat (not a roast, which is already a joke on its
      // own) occasionally gets a short color-commentator aside tacked on.
      if (!TAPE_ROAST_BEATS.includes(tpl) && !TAPE_HEEL_ONLY_ROAST_BEATS.includes(tpl) && Math.random() < 0.3) {
        line += TAPE_MOVE_AFTERTHOUGHTS[Math.floor(Math.random() * TAPE_MOVE_AFTERTHOUGHTS.length)];
      }
      return line;
    });
  }

  // A dropkick landing on a giant almost never does much — worth
  // mentioning on its own whenever Mt. Fiji, Matilda the Hun, or Big Bad
  // Mama specifically is in the match (Daisy isn't in their weight class
  // for this one).
  const trueGiantInMatch = TAPE_TRUE_GIANTS.has(a.name) ? a : (TAPE_TRUE_GIANTS.has(b.name) ? b : null);
  if (trueGiantInMatch && Math.random() < 0.2) {
    const giant = trueGiantInMatch;
    const dropkickOpponent = giant === a ? b : a;
    const tpl = TAPE_DROPKICK_VS_GIANT_LINES[Math.floor(Math.random() * TAPE_DROPKICK_VS_GIANT_LINES.length)];
    const line = tpl
      .replaceAll("{X}", tapeShortName(giant))
      .replaceAll("{Y}", tapeShortName(dropkickOpponent));
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  }

  // Aunt Kitty's rare ringside weapon assist — always slips right past
  // the referee.
  if (auntKitty) {
    const line = `Wait just a minute — is that Aunt Kitty down at ringside? She just slipped ${tapeShortName(a)} something metal, and the referee's back is completely turned — ${tapeShortName(a)} isn't wasting this opportunity!`;
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  }

  // A notable injury from earlier in the match doesn't just vanish once
  // it happens — the initial hit goes into the beats now, and a
  // carryover line referencing that same injury gets saved for later
  // (near the turning point), so the outcome feels earned rather than
  // like the injury was forgotten the moment it happened.
  let injuryCarryoverLine = null;
  if (injured) {
    const injuryVictimOpponent = injured === a ? b : a;
    const initTpl = TAPE_INJURY_LINES[Math.floor(Math.random() * TAPE_INJURY_LINES.length)];
    const initLine = capitalizeFirst(initTpl
      .replaceAll("{X}", tapeShortName(injured))
      .replaceAll("{Y}", tapeShortName(injuryVictimOpponent))
      .replaceAll("{move}", injuryMove));
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, initLine);

    const carryTpl = TAPE_INJURY_CARRYOVER_LINES[Math.floor(Math.random() * TAPE_INJURY_CARRYOVER_LINES.length)];
    injuryCarryoverLine = capitalizeFirst(carryTpl
      .replaceAll("{X}", tapeShortName(injured))
      .replaceAll("{Y}", tapeShortName(injuryVictimOpponent)));
  }

  // One of the roster's dirtiest players got away completely clean this
  // time and stole the win outright.
  if (dirtyWin) {
    const tpl = TAPE_DIRTY_WIN_LINES[Math.floor(Math.random() * TAPE_DIRTY_WIN_LINES.length)];
    const line = tpl
      .replaceAll("{X}", tapeShortName(winner))
      .replaceAll("{Y}", tapeShortName(loser));
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  }

  // Even the Heavy Metal Sisters' blatant weapon use occasionally slips
  // past the referee entirely, and she wins clean instead of getting DQ'd.
  if (refMissed) {
    const tpl = TAPE_REF_MISSED_LINES[Math.floor(Math.random() * TAPE_REF_MISSED_LINES.length)];
    const line = tpl
      .replaceAll("{X}", tapeShortName(winner))
      .replaceAll("{Y}", tapeShortName(loser));
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  }

  // She went digging under the ring for a weapon and got away with it —
  // no DQ this time, just a moment worth mentioning.
  if (weaponGrabbed && !underRingWeapon) {
    const weaponOpponent = weaponGrabbed === a ? b : a;
    const tpl = TAPE_UNDERRING_WEAPON_FLAVOR_LINES[Math.floor(Math.random() * TAPE_UNDERRING_WEAPON_FLAVOR_LINES.length)];
    const line = tpl
      .replaceAll("{X}", tapeShortName(weaponGrabbed))
      .replaceAll("{Y}", tapeShortName(weaponOpponent));
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  }

  // Palestina pulled the machete out and got away with it — no DQ this
  // time (the DQ version is handled separately as the finish itself).
  if (palestinaMachete && !palestinaMacheteDQ) {
    const macheteOpponent = palestinaInMatch === a ? b : a;
    const tpl = TAPE_PALESTINA_MACHETE_FLAVOR_LINES[Math.floor(Math.random() * TAPE_PALESTINA_MACHETE_FLAVOR_LINES.length)];
    const line = tpl
      .replaceAll("{X}", tapeShortName(palestinaInMatch))
      .replaceAll("{Y}", tapeShortName(macheteOpponent));
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  }

  // The referee got knocked out cold, but it wasn't enough to actually
  // change the outcome — just a chaotic moment worth mentioning.
  if (refKnockedOut && !refKnockedOutDecisive) {
    const tpl = TAPE_REF_KNOCKOUT_FLAVOR_LINES[Math.floor(Math.random() * TAPE_REF_KNOCKOUT_FLAVOR_LINES.length)];
    const line = tpl.replaceAll("{X}", tapeShortName(a));
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  }

  // Outside interference from a third wrestler — narrates the specific
  // physical action taken (not just a generic "helped out" mention),
  // plus whether it actually cost the match (caught, straight to DQ) or
  // slipped by and tipped the odds (not caught — this already boosted
  // the beneficiary's real win probability back in simulateTapeMatch).
  if (interference) {
    const helperName = interference.helper.name;
    const beneficiaryName = tapeShortName(interference.beneficiary);
    const opponentOfBeneficiary = interference.beneficiary === a ? b : a;
    const action = TAPE_INTERFERENCE_ACTIONS[Math.floor(Math.random() * TAPE_INTERFERENCE_ACTIONS.length)]
      .replaceAll("{opp}", tapeShortName(opponentOfBeneficiary));
    const line = interference.caught
      ? `Out of nowhere, ${helperName} comes flying down to ringside and ${action} — the referee sees every bit of it, and ${beneficiaryName} is getting disqualified over it!`
      : `Did anybody else catch that? ${helperName} sneaks in from ringside and ${action} — the referee's back is completely turned, and that interference just swings this match hard in ${beneficiaryName}'s favor!`;
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  }

  // A wrestler with a signature reputation (beauty, fan-favorite,
  // powerhouse, etc.) occasionally gets a dedicated compliment line from
  // the announcer, separate from the roast system since it's the
  // opposite tone.
  const descCandidate = [a, b].find(w => TAPE_WRESTLER_DESCRIPTORS[w.name]);
  if (descCandidate && Math.random() < 0.4) {
    const opponent = descCandidate === a ? b : a;
    const line = tapeDescriptorLine(descCandidate, opponent);
    if (line) beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, capitalizeFirst(line));
  }

  // Matilda the Hun's matches tend to spiral into chaos — guaranteed line.
  const matildaInMatch = [a, b].find(w => w.name === "Matilda the Hun");
  if (matildaInMatch && Math.random() < 0.75) {
    const tpl = TAPE_MATILDA_CHAOS_LINES[Math.floor(Math.random() * TAPE_MATILDA_CHAOS_LINES.length)];
    const line = tpl.replaceAll("{X}", tapeShortName(matildaInMatch));
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  }

  // Hollywood, Vine, and Broadway Rose are all established kleptomaniacs
  // — a real chance they can't help themselves mid-match. Against a Rich
  // Girl specifically, the theft gets upgraded to something swiped right
  // out of her corner.
  const kleptoInMatch = [a, b].find(w => TAPE_KLEPTO_WRESTLERS.has(w.name));
  if (kleptoInMatch && Math.random() < 0.3) {
    const kleptoOpponent = kleptoInMatch === a ? b : a;
    const richGirls = TAPE_CATEGORIES.find(c => c.name === "Rich Girls").members;
    const pool = richGirls.includes(kleptoOpponent.name) ? TAPE_KLEPTO_RICH_GIRL_LINES : TAPE_KLEPTO_GENERIC_LINES;
    const tpl = pool[Math.floor(Math.random() * pool.length)];
    const line = tpl
      .replaceAll("{X}", tapeShortName(kleptoInMatch))
      .replaceAll("{Y}", tapeShortName(kleptoOpponent));
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  }

  // Zelda uses a piece of meat as bait to lure and distract Beastie or
  // Matilda the Hun — pure wit over strength.
  const zeldaMeatBaiter = [a, b].find(w => w.name === "Zelda");
  if (zeldaMeatBaiter) {
    const zeldaMeatTarget = zeldaMeatBaiter === a ? b : a;
    if (TAPE_ZELDA_MEAT_BAIT_TARGETS.has(zeldaMeatTarget.name) && Math.random() < 0.4) {
      const tpl = TAPE_ZELDA_MEAT_BAIT_LINES[Math.floor(Math.random() * TAPE_ZELDA_MEAT_BAIT_LINES.length)];
      const line = tpl
        .replaceAll("{X}", tapeShortName(zeldaMeatBaiter))
        .replaceAll("{Y}", tapeShortName(zeldaMeatTarget));
      beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
    }
  }

  // Big Bad Mama's voodoo trance only lands about half the time — and
  // faces have a real shot at snapping out of it before it matters.
  const mamaInMatch = [a, b].find(w => w.name === "Big Bad Mama");
  if (mamaInMatch && Math.random() < 0.5) {
    const victim = mamaInMatch === a ? b : a;
    const castPool = TAPE_SPELL_CAST_LINES["Big Bad Mama"];
    const castLine = castPool[Math.floor(Math.random() * castPool.length)]
      .replaceAll("{X}", tapeShortName(mamaInMatch))
      .replaceAll("{Y}", tapeShortName(victim));
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, castLine);

    const victimIsFace = victim.role && victim.role.startsWith("Face");
    if (victimIsFace && Math.random() < 0.5) {
      const snapLine = TAPE_MAMA_SNAP_OUT_LINES[Math.floor(Math.random() * TAPE_MAMA_SNAP_OUT_LINES.length)]
        .replaceAll("{X}", tapeShortName(mamaInMatch))
        .replaceAll("{Y}", tapeShortName(victim));
      beats.push(snapLine);
    } else if (Math.random() < 0.85) {
      const afterLine = TAPE_TRANCE_AFTEREFFECT_LINES[Math.floor(Math.random() * TAPE_TRANCE_AFTEREFFECT_LINES.length)]
        .replaceAll("{X}", tapeShortName(mamaInMatch))
        .replaceAll("{Y}", tapeShortName(victim));
      beats.push(afterLine);
    }
  }

  // The Widow's poisoned drink is her first move in the ring — not part
  // of her entrance — and it sometimes catches up with her opponent
  // later in the match.
  // Tina Ferrari has a long-running feud over Jungle Woman's Nature Boy —
  // whenever these two meet, there's a real chance Tina makes a play for
  // him ringside, sometimes actually pulling it off, and Jungle Woman
  // does not take it well either way.
  const jungleWomanInMatch = [a, b].find(w => w.name === "Jungle Woman");
  const tinaInMatch = [a, b].find(w => w.name === "Tina Ferrari");
  if (jungleWomanInMatch && tinaInMatch && Math.random() < 0.5) {
    const succeeds = Math.random() < 0.5;
    const line = succeeds
      ? "Wait — Tina Ferrari just made a break for ringside and actually got her hands on Nature Boy, leading him away by the leash! Jungle Woman is LOSING HER MIND over this!"
      : "Tina Ferrari tries to make off with Nature Boy at ringside, but he cowers and whimpers his way loose before she can get away with it! Jungle Woman is still absolutely furious!";
    beats.push(line);
  }

  const widowInMatch = [a, b].find(w => w.name === "The Widow");
  if (widowInMatch) {
    const victim = widowInMatch === a ? b : a;
    const offerTpl = TAPE_WIDOW_POISON_OFFER_LINES[Math.floor(Math.random() * TAPE_WIDOW_POISON_OFFER_LINES.length)];
    const offerLine = offerTpl
      .replaceAll("{X}", tapeShortName(widowInMatch))
      .replaceAll("{Y}", tapeShortName(victim));
    beats.unshift(offerLine);
    if (Math.random() < 0.55) {
      const afterTpl = TAPE_WIDOW_POISON_AFTEREFFECT_LINES[Math.floor(Math.random() * TAPE_WIDOW_POISON_AFTEREFFECT_LINES.length)];
      const afterLine = afterTpl
        .replaceAll("{X}", tapeShortName(widowInMatch))
        .replaceAll("{Y}", tapeShortName(victim));
      beats.push(afterLine);
    }
  }

  // Priority 1: both wrestlers share a category (rich girls, giants, etc.)
  const sharedCategory = TAPE_CATEGORIES.find(cat =>
    cat.members.includes(a.name) && cat.members.includes(b.name)
  );
  // Priority 2: a specific scripted rivalry pair (e.g. Hollywood & Vine)
  const pairMatch = TAPE_PAIR_LINES.find(p =>
    (p.pair[0] === a.name && p.pair[1] === b.name) ||
    (p.pair[0] === b.name && p.pair[1] === a.name)
  );

  if (rivalryMatch && Math.random() < 0.95) {
    const tpl = rivalryMatch.matchLines[Math.floor(Math.random() * rivalryMatch.matchLines.length)];
    const line = fillMatch(tpl);
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
    // Heated rivalries sometimes earn a second passionate beat on top of
    // the first, for extra intensity.
    if (Math.random() < 0.5) {
      const tpl2 = rivalryMatch.matchLines[Math.floor(Math.random() * rivalryMatch.matchLines.length)];
      const line2 = fillMatch(tpl2);
      beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line2);
    }
  } else if (sharedCategory && Math.random() < 0.8) {
    const tpl = sharedCategory.matchupLines[Math.floor(Math.random() * sharedCategory.matchupLines.length)];
    const line = fillMatch(tpl);
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  } else if (pairMatch && Math.random() < 0.8) {
    const orderedA = pairMatch.pair[0] === a.name ? a : b;
    const orderedB = pairMatch.pair[0] === a.name ? b : a;
    const tpl = pairMatch.lines[Math.floor(Math.random() * pairMatch.lines.length)];
    const line = tpl
      .replaceAll("{A}", tapeShortName(orderedA))
      .replaceAll("{B}", tapeShortName(orderedB));
    beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
  } else {
    // Priority 3: an individual quirk or category solo trait
    const soloCandidates = [
      ...tapeSoloCandidates(a, b, chainsawAlreadyOut),
      ...tapeSoloCandidates(b, a, chainsawAlreadyOut),
    ];
    const hasNonWrestler = TAPE_NON_WRESTLING.has(a.name) || TAPE_NON_WRESTLING.has(b.name);
    const chance = hasNonWrestler ? 0.95 : 0.65;
    if (soloCandidates.length > 0 && Math.random() < chance) {
      const line = soloCandidates[Math.floor(Math.random() * soloCandidates.length)];
      beats.splice(Math.floor(Math.random() * (beats.length + 1)), 0, line);
      if (line.includes("revs up that chainsaw instead of locking up")) {
        chainsawAlreadyOut = true;
      }
    }
  }

  let finish;
  if (mtFijiRescue) {
    finish = fillWL(TAPE_MT_FIJI_MIDMATCH_RESCUE_LINES[Math.floor(Math.random() * TAPE_MT_FIJI_MIDMATCH_RESCUE_LINES.length)]);
  } else if (littleFijiKnockoutWin) {
    const tpl = TAPE_LITTLE_FIJI_KNOCKOUT_WIN_LINES[Math.floor(Math.random() * TAPE_LITTLE_FIJI_KNOCKOUT_WIN_LINES.length)];
    finish = fillWL(tpl.replaceAll("{helper}", knockoutHelper ? knockoutHelper.name : "someone from ringside"));
  } else if (zeldaHelp) {
    finish = fillWL(TAPE_ZELDA_HELP_LINES[Math.floor(Math.random() * TAPE_ZELDA_HELP_LINES.length)]);
  } else if (refKnockedOutDecisive) {
    finish = fillWL(TAPE_REF_KNOCKOUT_DECISIVE_LINES[Math.floor(Math.random() * TAPE_REF_KNOCKOUT_DECISIVE_LINES.length)]);
  } else if (underRingWeapon) {
    finish = fillWL(TAPE_UNDERRING_WEAPON_LINES[Math.floor(Math.random() * TAPE_UNDERRING_WEAPON_LINES.length)]);
  } else if (palestinaMacheteDQ) {
    finish = fillWL(TAPE_PALESTINA_MACHETE_DQ_LINES[Math.floor(Math.random() * TAPE_PALESTINA_MACHETE_DQ_LINES.length)]);
  } else if (refMissedCheating) {
    finish = fillWL(TAPE_REF_MISSED_CHEATING_LINES[Math.floor(Math.random() * TAPE_REF_MISSED_CHEATING_LINES.length)]);
  } else if (method === "dq") {
    const weaponPool = loser.name === "Chainsaw"
      ? [...(chainsawAlreadyOut ? TAPE_DQ_CHAINSAW_ALREADY_ARMED_LINES : TAPE_DQ_WEAPON_LINES["Chainsaw"]), ...TAPE_CHAINSAW_ROPE_DQ_LINES]
      : TAPE_DQ_WEAPON_LINES[loser.name];
    if (weaponPool && Math.random() < 0.7) {
      finish = fillWL(weaponPool[Math.floor(Math.random() * weaponPool.length)]);
    } else if (Math.random() < 0.5) {
      finish = fillWL(TAPE_DQ_RANDOM_OBJECT_LINES[Math.floor(Math.random() * TAPE_DQ_RANDOM_OBJECT_LINES.length)]);
    } else {
      finish = fillWL(TAPE_DQ_TEMPLATES[Math.floor(Math.random() * TAPE_DQ_TEMPLATES.length)]);
    }
  } else if (winner.name === "Mt. Fiji") {
    finish = fillWL(TAPE_MT_FIJI_FINISH_LINES[Math.floor(Math.random() * TAPE_MT_FIJI_FINISH_LINES.length)]);
  } else if (winner.name === "Big Bad Mama") {
    finish = Math.random() < 0.75
      ? fillWL(TAPE_BIG_SPLASH_FINISH_LINES[Math.floor(Math.random() * TAPE_BIG_SPLASH_FINISH_LINES.length)])
      : fillWL(TAPE_VOODOO_FINISH_LINES[Math.floor(Math.random() * TAPE_VOODOO_FINISH_LINES.length)]);
  } else {
    // A "finisher" listed on the bio page is sometimes really a
    // signature mid-match action rather than an actual finishing move —
    // The Widow's poisoned drink is offered before the match even
    // starts, and Attaché's spitting and Beastie's biting are things
    // they do throughout a match, not how they win it. These fall back
    // to the generic gimmick finish instead, even though the bio page
    // still lists them as their signature.
    const hasFinisher = !TAPE_NON_FINISH_SIGNATURES.has(winner.name) && winner.finishers && winner.finishers.length > 0;
    const finisherIsPose = hasFinisher && TAPE_POSE_FINISHERS.has(winner.finishers[0]);
    const useFinisher = hasFinisher && Math.random() < 0.8;
    const pool = finisherIsPose && useFinisher
      ? TAPE_PIN_POSE_TEMPLATES
      : useFinisher
      ? TAPE_FINISHER_TEMPLATES
      : TAPE_GIMMICK_TEMPLATES;
    finish = fillWL(pool[Math.floor(Math.random() * pool.length)]);
  }

  // Fragile wrestlers get called out when they lose — not just outmatched
  // competitively, but physically overwhelmed.
  if (TAPE_FRAGILE.has(loser.name) && Math.random() < 0.7) {
    const line = fillWL(TAPE_FRAGILE_LOSS_LINES[Math.floor(Math.random() * TAPE_FRAGILE_LOSS_LINES.length)]);
    beats.push(line);
  }

  // Big Bad Mama's whole strategy is sitting on people — except against
  // Mt. Fiji, who's just as massive as she is.
  if (winner.name === "Big Bad Mama" && loser.name !== "Mt. Fiji" && Math.random() < 0.6) {
    const line = fillWL(TAPE_MAMA_CRUSH_LINES[Math.floor(Math.random() * TAPE_MAMA_CRUSH_LINES.length)]);
    beats.push(line);
  }

  // Aftermath lines — appended after the finish, not part of the action itself.
  const aftermath = [];

  // Little Fiji's big sister sometimes shows up after a rough loss —
  // unless Mt. Fiji herself was the one who beat her.
  if (loser.name === "Little Fiji" && winner.name !== "Mt. Fiji" && Math.random() < 0.5) {
    aftermath.push(fillWL(TAPE_FIJI_RESCUE_LINES[Math.floor(Math.random() * TAPE_FIJI_RESCUE_LINES.length)]));
  }

  // The Heavy Metal Sisters' weapons chaos sometimes needs security to
  // step in and haul one of them off, win or lose.
  const hmsMember = [a, b].find(w => w.name === "Spike" || w.name === "Chainsaw");
  if (hmsMember && Math.random() < 0.35) {
    const tpl = TAPE_SECURITY_CARRYOFF_LINES[Math.floor(Math.random() * TAPE_SECURITY_CARRYOFF_LINES.length)];
    aftermath.push(tpl.replaceAll("{X}", tapeShortName(hmsMember)));
  }

  // Colonel Ninotchka can't help herself after a win — half the time
  // she grabs the mic again to boast about Russia and berate America.
  if (winner.name === "Colonel Ninotchka" && Math.random() < 0.5) {
    const tpl = TAPE_NINOTCHKA_POST_WIN_LINES[Math.floor(Math.random() * TAPE_NINOTCHKA_POST_WIN_LINES.length)];
    aftermath.push(tpl.replaceAll("{X}", tapeShortName(winner)));
  }

  // A normal (non-DQ) finish gets a turning-point line right before it,
  // so the outcome feels earned rather than sudden.
  const opening = [...entranceLines, kickoff];
  const carryover = injuryCarryoverLine ? [injuryCarryoverLine] : [];

  if (method !== "dq") {
    const turn = fillWL(TAPE_TURNING_POINT_BEATS[Math.floor(Math.random() * TAPE_TURNING_POINT_BEATS.length)]);
    return [...opening, ...beats, ...carryover, turn, finish, ...aftermath, ...rivalryPostMatchLine()];
  }

  return [...opening, ...beats, ...carryover, finish, ...aftermath, ...rivalryPostMatchLine()];
}

// Reveals a sequence of commentary lines one at a time, each typing itself
// out character by character with a pause before the next line begins —
// simulates a live play-by-play feed rather than a static paragraph.
function TapeLiveFeed({ lines, onDone }) {
  const [started, setStarted] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(0);
  const [typedChars, setTypedChars] = React.useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1000);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (!started) return;
    if (visibleCount >= lines.length) {
      if (onDone) onDone();
      return;
    }
    const currentLine = lines[visibleCount];
    if (typedChars < currentLine.length) {
      const t = setTimeout(() => setTypedChars(c => c + 1), 32);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setVisibleCount(v => v + 1);
      setTypedChars(0);
    }, 1500);
    return () => clearTimeout(t);
  }, [started, visibleCount, typedChars, lines, onDone]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <style>{`
        @keyframes tapeCursorBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .tape-cursor { animation: tapeCursorBlink 0.9s step-end infinite; }
      `}</style>
      {lines.slice(0, visibleCount).map((line, i) => (
        <p key={i} style={{
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 14,
          color: "#c8d0f0",
          lineHeight: 1.7,
          margin: 0,
        }}>
          {line}
        </p>
      ))}
      {visibleCount < lines.length && (
        <p style={{
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 14,
          color: "#c8d0f0",
          lineHeight: 1.7,
          margin: 0,
        }}>
          {lines[visibleCount].slice(0, typedChars)}
          <span className="tape-cursor">▌</span>
        </p>
      )}
    </div>
  );
}

function TapeCard({ wrestler, isWinner, isDQ }) {
  const rawAlignment = wrestler.role ? wrestler.role.split("—")[0].trim() : "";
  const alignmentLabel = rawAlignment === "Heel" ? "KITTY'S KILLERS" : rawAlignment === "Face" ? "STALLONE'S SWEETHEARTS" : "";
  return (
    <div style={{
      flex: 1,
      minWidth: 140,
      textAlign: "center",
      background: isWinner ? "rgba(76,175,80,0.15)" : "rgba(255,255,255,0.04)",
      border: isWinner ? "1px solid rgba(76,175,80,0.5)" : "1px solid rgba(255,255,255,0.1)",
      borderRadius: 14,
      padding: "18px 12px",
    }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <WrestlerIcon wrestler={wrestler} size={80} />
      </div>
      <div style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        fontWeight: 700,
        fontSize: 14,
        color: "#fff",
        marginBottom: 4,
      }}>
        {wrestler.name}
      </div>
      {wrestler.team && (
        <div style={{
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 11,
          fontStyle: "italic",
          color: "#7c85a6",
          marginBottom: 4,
        }}>
          ({wrestler.team})
        </div>
      )}
      <div style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.3,
        color: "#9aa6d6",
        marginBottom: 8,
      }}>
        {alignmentLabel}
      </div>
      {isWinner && (
        <div style={{
          marginTop: 10,
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: 1,
          color: "#8ee08a",
          textTransform: "uppercase",
        }}>
          Winner
          {isDQ && (
            <div style={{
              marginTop: 3,
              fontSize: 10,
              letterSpacing: 0.5,
              color: "#c8d0f0",
            }}>
              (Win by DQ)
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function tapePickPair(heelChoice, faceChoice) {
  const heels = TAPE_ELIGIBLE.filter(w => w.role && w.role.startsWith("Heel"));
  const faces = TAPE_ELIGIBLE.filter(w => w.role && w.role.startsWith("Face"));
  const heel = heelChoice
    ? TAPE_ELIGIBLE.find(w => w.name === heelChoice)
    : heels[Math.floor(Math.random() * heels.length)];
  const face = faceChoice
    ? TAPE_ELIGIBLE.find(w => w.name === faceChoice)
    : faces[Math.floor(Math.random() * faces.length)];
  return [heel, face];
}

function TalePage({ onBack, backLabel = "Main" }) {
  const heelNames = React.useMemo(
    () => TAPE_ELIGIBLE.filter(w => w.role && w.role.startsWith("Heel")).map(w => w.name).sort(),
    []
  );
  const faceNames = React.useMemo(
    () => TAPE_ELIGIBLE.filter(w => w.role && w.role.startsWith("Face")).map(w => w.name).sort(),
    []
  );
  const [heelChoice, setHeelChoice] = React.useState("");
  const [faceChoice, setFaceChoice] = React.useState("");
  const [pair, setPair] = React.useState(() => tapePickPair("", ""));
  const [result, setResult] = React.useState(null);
  const [feedLines, setFeedLines] = React.useState(null);
  const [simKey, setSimKey] = React.useState(0);
  const [revealComplete, setRevealComplete] = React.useState(false);

  function resetForNewPair(newPair) {
    setPair(newPair);
    setResult(null);
    setFeedLines(null);
    setRevealComplete(false);
  }

  function handleNewMatchup() {
    resetForNewPair(tapePickPair(heelChoice, faceChoice));
  }

  function handleHeelChange(e) {
    const value = e.target.value;
    setHeelChoice(value);
    resetForNewPair(tapePickPair(value, faceChoice));
  }

  function handleFaceChange(e) {
    const value = e.target.value;
    setFaceChoice(value);
    resetForNewPair(tapePickPair(heelChoice, value));
  }

  function handleSimulate() {
    const newResult = simulateTapeMatch(pair[0], pair[1]);
    setResult(newResult);
    setFeedLines(generateTapeBlurb(pair[0], pair[1], newResult));
    setRevealComplete(false);
    setSimKey(k => k + 1);
  }

  return (
    <div style={{ padding: "20px 18px 80px", maxWidth: 680, marginInline: "auto" }}>
      <button
        onClick={onBack}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 999,
          color: "#fff",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          padding: "8px 18px",
          cursor: "pointer",
          marginBottom: 28,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back to {backLabel}
      </button>

      <h2 style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        color: "#ff8fc3",
        fontSize: 22,
        letterSpacing: 2,
        textTransform: "uppercase",
        textAlign: "center",
        marginBottom: 8,
      }}>
        Tale of the Tape
      </h2>
      <p style={{
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        fontSize: 14,
        color: "#b9c3ff",
        textAlign: "center",
        marginBottom: 28,
      }}>
        Simulate a dream matchup between two GLOW wrestlers.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <label style={{
            display: "block",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            color: "#9aa6d6",
            marginBottom: 6,
          }}>
            Kitty's Killers
          </label>
          <select
            value={heelChoice}
            onChange={handleHeelChange}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 10,
              color: "#fff",
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontSize: 13,
              padding: "10px 12px",
            }}
          >
            <option value="" style={{ color: "#f0e6fa", background: "#2a1140" }}>🎲 Random Heel</option>
            {heelNames.map(name => (
              <option key={name} value={name} style={{ color: "#f0e6fa", background: "#2a1140" }}>{name}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{
            display: "block",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            color: "#9aa6d6",
            marginBottom: 6,
          }}>
            Stallone's Sweethearts
          </label>
          <select
            value={faceChoice}
            onChange={handleFaceChange}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 10,
              color: "#fff",
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontSize: 13,
              padding: "10px 12px",
            }}
          >
            <option value="" style={{ color: "#f0e6fa", background: "#2a1140" }}>🎲 Random Face</option>
            {faceNames.map(name => (
              <option key={name} value={name} style={{ color: "#f0e6fa", background: "#2a1140" }}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <TapeCard wrestler={pair[0]} isWinner={revealComplete && result && result.winner === pair[0]} isDQ={result && result.method === "dq"} />
        <div style={{
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontWeight: 700,
          fontSize: 16,
          color: "#ff8fc3",
        }}>
          VS
        </div>
        <TapeCard wrestler={pair[1]} isWinner={revealComplete && result && result.winner === pair[1]} isDQ={result && result.method === "dq"} />
      </div>

      {revealComplete && result && result.method === "double_dq" && (
        <div style={{
          textAlign: "center",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 1,
          color: "#ff6b6b",
          textTransform: "uppercase",
          marginTop: -12,
          marginBottom: 22,
        }}>
          Double Disqualification
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
        <button
          onClick={handleNewMatchup}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 999,
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            padding: "12px 26px",
            cursor: "pointer",
          }}
        >
          New Matchup
        </button>
        <button
          onClick={handleSimulate}
          style={{
            background: "linear-gradient(135deg, #ffb300, #b45f00)",
            border: "none",
            borderRadius: 999,
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            padding: "12px 30px",
            cursor: "pointer",
          }}
        >
          {result ? "Simulate Again" : "Simulate Match!"}
        </button>
      </div>

      {feedLines && (
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          padding: "20px 22px",
        }}>
          <div style={{
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#ff8fc3",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: revealComplete ? "#7c85a6" : "#ff4444",
              display: "inline-block",
            }} />
            {revealComplete ? "Final" : "Live"}
          </div>
          <TapeLiveFeed
            key={simKey}
            lines={feedLines}
            onDone={() => setRevealComplete(true)}
          />
        </div>
      )}
    </div>
  );
}

const GLOW_FACTS = [
  "Roxy Astor, Tiffany Mellon, Major Tanya, Zelda, Godiva, Big Bad Mama and other new recruits made their syndicated wrestling debut in Season 3, but were introduced to us in the Season 2 intros.",
  "Beastie regularly led Godiva's horse when the British heel rode to the ring.",
  "Michelle Duze played both Sugar and Dementia in the early seasons of GLOW.",
  "In 1987, Matilda the Hun & Mt. Fiji had cameos on the TV sitcom Mama's Family, both playing masked wrestlers called The Mabels.",
  "In 1990, GLOW wrestlers were on a charity episode of Family Feud vs. the WCW led by Sting.",
  "The show's theme song was written by Deanna Booher (Matilda the Hun).",
  "Deanna Booher (Matilda the Hun) had a cameo in Mel Brooks' 1987 comedy Spaceballs.",
  "Jody Haselbarth (Tulsa) has 41 stunt film credits, most notably for Transformers: Age of Extinction (2014), Arlington Road (1999) and Idiocracy (2006).",
  "Sandy Manly's (Gremlina) favorite wrestler is Roddy Piper.",
  "Mando Guerrero — brother of WWE legend Eddie Guerrero — was trainer of the GLOW wrestlers.",
  "Hollywood, Babe the Farmer's Daughter, Big Bad Mama, Sally the Farmer's Daughter and Susie Spirit all had cameos on the TV sitcom Married with Children.",
  "Americana was the original leader of Stallone's Sweethearts, managed by Jackie Stallone.",
  "Jungle Woman's 'Nature Boy' is the son of actress Jayne Mansfield and Matt Cimber (Producer & Director of GLOW).",
  "The GLOW pilot was filmed on December 5th, 1985, with an original roster consisting of 12 wrestlers.",
  "Tammy Jones defeated Matilda the Hun to become the first GLOW Champion.",
  "GLOW used a crown for its top prize, often referred to as the GLOW Championship or GLOW Crown.",
  "Lisa Moretti, who portrayed Tina Ferrari in GLOW, went on to sign with the WWE in 1999 and became Ivory.",
  "The GLOW wrestler raps were inspired by the 1985 Chicago Bears Super Bowl Shuffle.",
  "Originally the matches were set in a ring made of plywood boards with thin foam padding on top, inside a boxing ring structure — leading to many injuries.",
  "The early seasons of GLOW Wrestling were filmed at the Riviera Hotel & Casino.",
  "Mt. Fiji was the only person to appear barefoot on the TV game show Card Sharks during the CBS run, and proceeded to lift host Bob Eubanks over her head.",
  "GLOW Wrestling made its debut in syndication in the United States and Canada on September 13, 1986.",
  "The Heavy Metal Sisters (Chainsaw & Spike) and The Housewives (Arlene & Phyllis) were both played by real-life sisters Donna & Sharon Wilinsky.",
  "According to commentator Mike Morgan, Zelda's IQ is 165.",
  "Upon her return from the serious elbow injury she endured, Susie Spirit wrestled in a handicap match against Attaché, where both wrestlers wore arm braces.",
  "Nearly a dozen wrestlers joined David McLane's POWW after his departure from GLOW, including Tina Ferrari, Matilda the Hun, Palestina, California Doll and more, wrestling under different names.",
  "Cheryl Rusa (Lightning) also wrestled as a character named Party Animal vs. Babe the Farmer's Daughter in GLOW's PPV reunion event, taped in 1992 and aired in 1993.",
  "Mt. Fiji defeated Matilda the Hun in the arm wrestling match of Season 2's GLOW Games.",
];

function FactPanel() {
  const shuffled = React.useMemo(() => {
    const arr = [...GLOW_FACTS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const [index, setIndex] = React.useState(0);
  const [phase, setPhase] = React.useState("visible"); // "visible" | "exit" | "enter"

  React.useEffect(() => {
    const timer = setInterval(() => {
      // Slide out to left
      setPhase("exit");
      setTimeout(() => {
        setIndex(i => (i + 1) % GLOW_FACTS.length);
        setPhase("enter");
        // Slide in from right, then settle
        setTimeout(() => setPhase("visible"), 400);
      }, 400);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const transform =
    phase === "exit" ? "translateX(-110%)" :
    phase === "enter" ? "translateX(110%)" :
    "translateX(0)";

  return (
    <div
      style={{
        maxWidth: 640,
        marginInline: "auto",
        marginTop: 28,
        marginBottom: 8,
        padding: "16px 24px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,120,190,0.25)",
        textAlign: "center",
        minHeight: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          color: "#d79fc2",
          lineHeight: 1.6,
          transform,
          opacity: phase === "visible" ? 1 : 0,
          transition: "transform 0.4s ease, opacity 0.4s ease",
        }}
      >
        {shuffled[index]}
      </p>
    </div>
  );
}

// Parse "1986–1990" or "1986" or "1986–1988, 1992" into a flat array of years
function getYears(yearsStr) {
  if (!yearsStr) return [];
  const segments = yearsStr.split(',');
  let allYears = [];
  for (let seg of segments) {
    const clean = seg.trim().replace(/\u2013|-/g, '-');
    const parts = clean.split('-').map(s => parseInt(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      for (let y = parts[0]; y <= parts[1]; y++) allYears.push(y);
    } else if (!isNaN(parts[0])) {
      allYears.push(parts[0]);
    }
  }
  return allYears;
}

/* ----------------------------------------------------------------
   Splash / landing screen
   ---------------------------------------------------------------- */
function SplashButton({ onClick, gradient, shadowRGB, icon, label, spanFull }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        background: gradient,
        color: "#fff",
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: 0.5,
        padding: "16px 18px",
        minHeight: 56,
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: `0 6px 16px rgba(${shadowRGB},0.45)`,
        cursor: "pointer",
        transition: "transform 160ms ease, box-shadow 160ms ease",
        width: "100%",
        gridColumn: spanFull ? "1 / -1" : undefined,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 9px 20px rgba(${shadowRGB},0.6)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 6px 16px rgba(${shadowRGB},0.45)`;
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function SplashScreen({ onWrestlers, onRandomWrestler, onSkits, onHistory, onQuiz, onTape, onMisc }) {
  return (
    <div style={{ padding: "48px 18px 80px", maxWidth: 620, marginInline: "auto" }}>
      <header style={{ textAlign: "center", padding: "0 16px 18px", position: "relative" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(28px, 7vw, 50px)",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            background:
              "linear-gradient(180deg, #fff 0%, #ffd9ee 35%, #ff6fb8 60%, #ff2d92 75%, #8e0a4e 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 2px 0 rgba(0,0,0,0.25)",
            filter: "drop-shadow(0 4px 14px rgba(255, 45, 146, 0.45))",
            lineHeight: 1.15,
          }}
        >
          Classic
          <br />
          GLOW Wrestlers
        </h1>
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            color: "#9fb3ff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 13,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          Gorgeous Ladies of Wrestling · 1986 – 1992
        </p>
        <div style={{ marginTop: 16, maxWidth: 300, marginInline: "auto" }}>
          <RopeDivider />
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 14,
          marginTop: 24,
        }}
      >
        <SplashButton
          onClick={onWrestlers}
          gradient="linear-gradient(135deg, #1565c0, #0d2b52)"
          shadowRGB="21,101,192"
          label="GLOW Wrestlers"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c5 0 9 2.5 9 6v2H3v-2c0-3.5 4-6 9-6z" />
            </svg>
          }
        />
        <SplashButton
          onClick={onRandomWrestler}
          gradient="linear-gradient(135deg, #c62828, #4a0000)"
          shadowRGB="198,40,40"
          label="Random Wrestler"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M4 4h16v16H4V4zm4 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
            </svg>
          }
        />
        <SplashButton
          onClick={onSkits}
          gradient="linear-gradient(135deg, #6a1b9a, #38006b)"
          shadowRGB="106,27,154"
          label="GLOW Skits"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M2 6h20v12H2z M8 6V4h8v2" />
            </svg>
          }
        />
        <SplashButton
          onClick={onHistory}
          gradient="linear-gradient(135deg, #ad1457, #4a0026)"
          shadowRGB="173,20,87"
          label="History & Extras"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z" />
            </svg>
          }
        />
        <SplashButton
          onClick={onQuiz}
          gradient="linear-gradient(135deg, #2e7d32, #0d3b12)"
          shadowRGB="46,125,50"
          label="Who Said It?"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M9 21h6v-1H9v1zm3-19C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" />
            </svg>
          }
        />
        <SplashButton
          onClick={onTape}
          gradient="linear-gradient(135deg, #ffb300, #b45f00)"
          shadowRGB="180,95,0"
          label="Tale of the Tape"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-4z" />
            </svg>
          }
        />
        <SplashButton
          onClick={onMisc}
          gradient="linear-gradient(135deg, #3a3a3a, #141414)"
          shadowRGB="0,0,0"
          label="Miscellaneous/Credits"
          spanFull
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-1.5 5h3v6h-3z" />
            </svg>
          }
        />
      </div>

      <p style={{
        textAlign: "center",
        marginTop: 24,
        marginBottom: 0,
        fontFamily: "'Trebuchet MS', Verdana, sans-serif",
        fontSize: 11,
        color: "#7c85a6",
        opacity: 0.7,
      }}>
        Not affiliated with, endorsed by, or sponsored by GLOW
      </p>
    </div>
  );
}

function HomeScreen({ onSelect, onSkits, onHistory, onMisc, onQuiz, onTape, onBackToSplash }) {
  const [factionFilter, setFactionFilter] = React.useState("all");
  const [yearFilter, setYearFilter] = React.useState("all");

  const filteredWrestlers = SORTED_WRESTLERS.filter(w => {
    const factionMatch =
      factionFilter === "all" ||
      factionFilter === "wrestlersOnly" ||
      (factionFilter === "sweethearts" && w.role && w.role.startsWith("Face")) ||
      (factionFilter === "killers" && w.role && w.role.startsWith("Heel"));
    const yearMatch =
      yearFilter === "all" ||
      getYears(w.years).includes(parseInt(yearFilter));
    return factionMatch && yearMatch;
  });

  const dropdownStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,120,190,0.35)",
    borderRadius: 8,
    color: "#e8d5f5",
    fontFamily: "'Trebuchet MS', Verdana, sans-serif",
    fontSize: 12,
    padding: "6px 10px",
    cursor: "pointer",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    minWidth: 150,
  };

  return (
    <div style={{ padding: "8px 18px 60px", position: "relative" }}>
      <div style={{ position: "relative", zIndex: 1 }}>
      <button
        onClick={onBackToSplash}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 999,
          color: "#fff",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          padding: "8px 18px",
          cursor: "pointer",
          marginTop: 12,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back to Splash
      </button>
      <Header />

      {/* Filter bar */}
      <div style={{
        display: "flex",
        gap: 12,
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 18,
        marginTop: 4,
      }}>
        <select
          value={factionFilter}
          onChange={e => setFactionFilter(e.target.value)}
          style={dropdownStyle}
        >
          <option value="all" style={{ color: "#f0e6fa", background: "#2a1140" }}>All</option>
          <option value="wrestlersOnly" style={{ color: "#f0e6fa", background: "#2a1140" }}>Wrestlers Only</option>
          <option value="personalitiesOnly" style={{ color: "#f0e6fa", background: "#2a1140" }}>Personalities Only</option>
          <option value="sweethearts" style={{ color: "#f0e6fa", background: "#2a1140" }}>Stallone's Sweethearts</option>
          <option value="killers" style={{ color: "#f0e6fa", background: "#2a1140" }}>Kitty's Killers</option>
        </select>
        <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          style={dropdownStyle}
        >
          <option value="all" style={{ color: "#f0e6fa", background: "#2a1140" }}>All Years</option>
          {[1986,1987,1988,1989,1990,1992].map(y => (
            <option key={y} value={y} style={{ color: "#f0e6fa", background: "#2a1140" }}>{y}</option>
          ))}
        </select>
      </div>

      {factionFilter !== "wrestlersOnly" && <KeyFiguresRow onSelect={onSelect} factionFilter={factionFilter} yearFilter={yearFilter} />}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          maxWidth: 480,
          marginInline: "auto",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,120,190,0.55))",
          }}
        />
        <span
          style={{
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 10.5,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: "#d79fc2",
            whiteSpace: "nowrap",
          }}
        >
          GLOW Wrestlers
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(90deg, rgba(255,120,190,0.55), transparent)",
          }}
        />
      </div>
      {factionFilter !== "personalitiesOnly" && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "4px 2px",
          maxWidth: 1100,
          marginInline: "auto",
        }}
        className="glow-roster-grid"
      >
        {filteredWrestlers.length > 0 ? filteredWrestlers.map((w) => (
          <RosterCard key={w.id} wrestler={w} onSelect={onSelect} />
        )) : (
          <div style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            color: "#9aa6d6",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 13,
            padding: "40px 0",
          }}>
            No wrestlers found for these filters.
          </div>
        )}
      </div>
      )}
      <style>{`
        @media (min-width: 560px) {
          .glow-roster-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 6px 4px !important; }
          .glow-roster-name { font-size: 13.5px !important; }
        }
        @media (min-width: 820px) {
          .glow-roster-grid { grid-template-columns: repeat(5, 1fr) !important; }
          .glow-roster-name { font-size: 14.5px !important; }
        }
        @media (min-width: 1040px) {
          .glow-roster-grid { grid-template-columns: repeat(6, 1fr) !important; }
        }
      `}</style>

      <div
        style={{
          maxWidth: 700,
          marginInline: "auto",
          marginTop: 40,
          textAlign: "center",
          color: "#7e8fd6",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 12.5,
          lineHeight: 1.6,
          opacity: 0.8,
        }}
      >
        Tap any wrestler's photo to step into her page — bio,
        <br />
        signature moves, and classic match footage from the GLOW TV era.
      </div>

      {/* GLOW Skits button */}
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <button
          onClick={onSkits}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "linear-gradient(135deg, #6a1b9a, #38006b)",
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 0.5,
            padding: "13px 40px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 6px 16px rgba(106,27,154,0.45)",
            cursor: "pointer",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            width: 340,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 9px 20px rgba(106,27,154,0.6)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(106,27,154,0.45)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M2 6h20v12H2z M8 6V4h8v2" />
          </svg>
          GLOW Skits
        </button>
      </div>

      {/* GLOW History & Extras button */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          onClick={onHistory}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "linear-gradient(135deg, #ad1457, #4a0026)",
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 0.5,
            padding: "13px 40px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 6px 16px rgba(173,20,87,0.45)",
            cursor: "pointer",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            width: 340,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 9px 20px rgba(173,20,87,0.6)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(173,20,87,0.45)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z" />
          </svg>
          GLOW History &amp; Extras
        </button>
      </div>

      {/* Who Said It? Quiz button */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          onClick={onQuiz}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "linear-gradient(135deg, #2e7d32, #0d3b12)",
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 0.5,
            padding: "13px 40px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 6px 16px rgba(46,125,50,0.45)",
            cursor: "pointer",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            width: 340,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 9px 20px rgba(46,125,50,0.6)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(46,125,50,0.45)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M9 21h6v-1H9v1zm3-19C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" />
          </svg>
          Who Said It?
        </button>
      </div>

      {/* Tale of the Tape button */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          onClick={onTape}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "linear-gradient(135deg, #ffb300, #b45f00)",
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 0.5,
            padding: "13px 40px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 6px 16px rgba(180,95,0,0.45)",
            cursor: "pointer",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            width: 340,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 9px 20px rgba(180,95,0,0.6)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(180,95,0,0.45)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-4z" />
          </svg>
          Tale of the Tape
        </button>
      </div>

      {/* Miscellaneous button */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          onClick={onMisc}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "linear-gradient(135deg, #3a3a3a, #141414)",
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: 0.5,
            padding: "13px 40px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
            cursor: "pointer",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            width: 340,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 9px 20px rgba(0,0,0,0.65)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.5)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-1.5 5h3v6h-3z" />
          </svg>
          Miscellaneous
        </button>
      </div>

      <FactPanel />

      <div
        style={{
          maxWidth: 640,
          marginInline: "auto",
          marginTop: 28,
          textAlign: "center",
          color: "#b9c3ff",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          lineHeight: 1.7,
          opacity: 0.9,
          padding: "0 16px",
        }}
      >
        <p style={{ margin: 0 }}>
          GLOW — the Gorgeous Ladies of Wrestling — was a syndicated American
          television show that aired from 1986 to 1990, blending
          professional wrestling with sketch comedy and over-the-top
          characters. Filmed in Las Vegas, the series built a colorful
          roster of fan-favorite heroes and wildly entertaining villains,
          quickly becoming a cult phenomenon of '80s pop culture, paving
          the way for the wave of women's wrestling promotions that
          followed.
        </p>
        <p style={{ margin: "14px 0 0" }}>
          After its original run, GLOW lived on through a pay-per-view
          revival special taped in 1992 and aired in 1993, a 2012 reunion
          documentary, and Netflix's fictionalized comedy-drama series
          (2017–2019), keeping the brand's legacy alive for new
          generations of fans.
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: 24, marginBottom: 8 }}>
        <a
          href="https://glowwrestlingoriginals.tumblr.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textDecoration: "none",
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 14.5,
            letterSpacing: 0.5,
            padding: "12px 26px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #ff2d92, #b3001f)",
            boxShadow: "0 6px 16px rgba(255,45,146,0.45)",
            border: "1px solid rgba(255,255,255,0.25)",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            width: 340,
            textAlign: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 9px 20px rgba(255,45,146,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(255,45,146,0.45)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M14.563 24c-5.093 0-8.9-2.734-8.9-9.354V9.42H2.478V5.44c3.216-.815 4.57-3.632 4.735-5.44h3.652v6.14h4.66V9.42h-4.66v5.14c0 1.94.97 2.611 2.512 2.611h2.32v6.828h-.334z" />
          </svg>
          Visit the Official GLOW Tumblr
        </a>
      </div>
      <div style={{ textAlign: "center", marginTop: 14, marginBottom: 8 }}>
        <a
          href="https://tubitv.com/series/4270/the-original-ladies-of-wrestling"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textDecoration: "none",
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 14.5,
            letterSpacing: 0.5,
            padding: "12px 26px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #ff2d92, #b3001f)",
            boxShadow: "0 6px 16px rgba(255,45,146,0.45)",
            border: "1px solid rgba(255,255,255,0.25)",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            width: 340,
            textAlign: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 9px 20px rgba(255,45,146,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(255,45,146,0.45)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
          Watch Classic GLOW Season 3 on Tubi
        </a>
      </div>
      <div style={{ textAlign: "center", marginTop: 14, marginBottom: 8 }}>
        <a
          href="https://link.tubi.tv/8eZ2sFywp4b"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textDecoration: "none",
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 11.5,
            letterSpacing: 0.3,
            padding: "12px 26px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #ff2d92, #b3001f)",
            boxShadow: "0 6px 16px rgba(255,45,146,0.45)",
            border: "1px solid rgba(255,255,255,0.25)",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            width: 340,
            textAlign: "center",
            lineHeight: 1.5,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 9px 20px rgba(255,45,146,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(255,45,146,0.45)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
          Watch GLOW: The Story of the Gorgeous Ladies of Wrestling on Tubi
        </a>
      </div>
      <div style={{ textAlign: "center", marginTop: 14, marginBottom: 8 }}>
        <a
          href="https://pluto.tv/us/shows/the-original-ladies-of-wrestling/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textDecoration: "none",
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 14.5,
            letterSpacing: 0.5,
            padding: "12px 26px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #ff2d92, #b3001f)",
            boxShadow: "0 6px 16px rgba(255,45,146,0.45)",
            border: "1px solid rgba(255,255,255,0.25)",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            width: 340,
            textAlign: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 9px 20px rgba(255,45,146,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(255,45,146,0.45)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
          Watch Classic GLOW Season 3 on Pluto TV
        </a>
      </div>
      <div style={{ textAlign: "center", marginTop: 14, marginBottom: 8 }}>
        <a
          href="https://pluto.tv/us/movies/66ce185a73aa5100130b8377/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textDecoration: "none",
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 11.5,
            letterSpacing: 0.3,
            padding: "12px 26px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #ff2d92, #b3001f)",
            boxShadow: "0 6px 16px rgba(255,45,146,0.45)",
            border: "1px solid rgba(255,255,255,0.25)",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            width: 340,
            textAlign: "center",
            lineHeight: 1.5,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 9px 20px rgba(255,45,146,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(255,45,146,0.45)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
          Watch GLOW: The Story of the Gorgeous Ladies of Wrestling on Pluto TV
        </a>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          minHeight: 160,
          padding: "16px 16px",
        }}
      >
        <div
          style={{
            maxWidth: 600,
            textAlign: "center",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 10.5,
            color: "#6b7280",
            fontStyle: "italic",
            lineHeight: 1.6,
            opacity: 0.8,
          }}
        >
        This app is an unofficial fan tribute, not affiliated with or endorsed
        by the producers of GLOW (Gorgeous Ladies of Wrestling) or any
        associated rights holders. All wrestler names, characters, and
        likenesses are the property of their respective owners. Photos and
        media are sourced from publicly available historical material for fan
        and entertainment purposes only. No copyright infringement is intended.
        </div>
      </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Individual wrestler page
   ---------------------------------------------------------------- */
function VideoLinkCard({ href, title, subtitle }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        textDecoration: "none",
        position: "relative",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 12,
        padding: "14px 16px",
        transition: "border-color 160ms ease, transform 160ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,90,170,0.55)";
        e.currentTarget.style.transform = "translateX(3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 42,
          height: 42,
          borderRadius: 10,
          background: "linear-gradient(135deg, #ff2d92, #b3001f)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(255,45,146,0.4)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          textAlign: "center",
          paddingRight: 56,
        }}
      >
        <span
          style={{
            color: "#fff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontWeight: 700,
            fontSize: 14.5,
          }}
        >
          {title}
        </span>
        <span
          style={{
            color: "#b9c3ff",
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
            fontSize: 12,
            opacity: 0.8,
          }}
        >
          {subtitle}
        </span>
      </div>
    </a>
  );
}

function WrestlerPage({ wrestlerId, onBack, backLabel = "Roster" }) {
  const wrestler = useMemo(
    () =>
      WRESTLERS.find((w) => w.id === wrestlerId) ||
      KEY_FIGURES.find((k) => k.id === wrestlerId),
    [wrestlerId]
  );

  if (!wrestler) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#fff" }}>
        <p>Wrestler not found.</p>
        <button onClick={onBack}>Back to {backLabel}</button>
      </div>
    );
  }

  const ytSearchQuery = encodeURIComponent(`GLOW Gorgeous Ladies of Wrestling ${wrestler.name} vs`);
  const ytSearchUrl = `https://www.youtube.com/results?search_query=${ytSearchQuery}`;

  return (
    <div style={{ padding: "20px 18px 60px", maxWidth: 760, marginInline: "auto" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#ffe3f3",
          borderRadius: 999,
          padding: "8px 16px",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 24,
        }}
      >
        ← Back to {backLabel}
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 14,
          marginBottom: 8,
        }}
      >
        <WrestlerIcon wrestler={wrestler} size={150} />
        <h2
          style={{
            margin: 0,
            fontFamily: "'Arial Black', Arial, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(24px, 5vw, 34px)",
            color: "#fff",
            textShadow: `0 0 24px ${wrestler.color}aa, 0 2px 4px rgba(0,0,0,0.5)`,
            letterSpacing: 0.5,
          }}
        >
          {wrestler.name}
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          }}
        >
          <span
            style={{
              color: "#9fb3ff",
              fontSize: 14,
            }}
          >
            Real name: {wrestler.real}
          </span>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
              color: "#9fb3ff",
              fontSize: 14,
              fontWeight: 400,
            }}
          >
            <span>Active: {wrestler.years}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              color: "#ff9fd2",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          >
            <span>{wrestler.role}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 320, marginInline: "auto", margin: "18px auto 26px" }}>
        <RopeDivider />
      </div>

      <p
        style={{
          color: "#dfe5ff",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 15.5,
          lineHeight: 1.7,
          textAlign: "center",
          maxWidth: 620,
          marginInline: "auto",
        }}
      >
        {wrestler.bio}
      </p>

      {wrestler.finishers && wrestler.finishers.length > 0 && (
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <span
            style={{
              color: "#ff8fc3",
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Routine | Signature Move{wrestler.finishers.length > 1 ? "s" : ""}
          </span>
          <div
            style={{
              marginTop: 6,
              color: "#fff",
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontSize: 14,
            }}
          >
            {wrestler.finishers.join("  •  ")}
          </div>
        </div>
      )}

      {/* Second photo slot — add photo later */}
      {!wrestler.noSecondPhoto && (() => {
        const secondPhotoUrl = `/images/${wrestler.id}-2.jpg`;
        return (
          <div
            style={{
              width: "100%",
              maxWidth: 340,
              aspectRatio: "1 / 1",
              marginInline: "auto",
              marginTop: 32,
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              position: "relative",
            }}
          >
            <img
              src={secondPhotoUrl}
              alt={`${wrestler.name} alternate photo`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.style.display = "flex";
                e.currentTarget.parentElement.style.alignItems = "center";
                e.currentTarget.parentElement.style.justifyContent = "center";
                const label = document.createElement("span");
                label.textContent = "Photo coming soon";
                label.style.cssText = "color:rgba(255,255,255,0.18);font-family:'Trebuchet MS',Verdana,sans-serif;font-size:13px;letter-spacing:0.5px;";
                e.currentTarget.parentElement.appendChild(label);
              }}
            />
          </div>
        );
      })()}

      {/* Quote block — only shown if wrestler has a quote */}
      {wrestler.quote && (
        <div
          style={{
            maxWidth: 560,
            marginInline: "auto",
            marginTop: 28,
            padding: "18px 24px",
            borderLeft: `4px solid ${wrestler.color || "#ff2d92"}`,
            background: "rgba(255,255,255,0.04)",
            borderRadius: "0 12px 12px 0",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#e8d5f5",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 14.5,
              fontStyle: "italic",
              lineHeight: 1.7,
              textAlign: "left",
            }}
          >
            "{wrestler.quote}"
          </p>
          <p
            style={{
              margin: "10px 0 0",
              color: wrestler.color || "#ff8fc3",
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.5,
              textAlign: "left",
            }}
          >
            — {wrestler.quoteAttribution || wrestler.name}
          </p>
        </div>
      )}

      {wrestler.videos && wrestler.videos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8,
            maxWidth: 900,
            marginInline: "auto",
            marginTop: 32,
            marginBottom: 8,
          }}
          className="glow-video-row"
        >
          {wrestler.videos.slice(0, 2).map((videoId, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "85%",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`${wrestler.name} match clip ${i + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {!wrestler.noVideoSection && (
        <>
          <h3
            style={{
              marginTop: 38,
              marginBottom: 14,
              color: "#fff",
              fontFamily: "'Arial Black', Arial, sans-serif",
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: 1,
              textAlign: "center",
              textShadow: "0 0 16px rgba(255,61,154,0.5)",
            }}
          >
            Classic Match Footage
          </h3>
          <p
            style={{
              textAlign: "center",
              color: "#9aa6e0",
              fontFamily: "'Trebuchet MS', Verdana, sans-serif",
              fontSize: 12.5,
              marginBottom: 20,
              maxWidth: 560,
              marginInline: "auto",
              lineHeight: 1.6,
            }}
          >
            Original broadcast video is scattered across fan uploads and archives.
            This link jumps straight to live search results for {wrestler.name} so
            you always see the latest available clips.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxWidth: 480,
              marginInline: "auto",
            }}
          >
            <VideoLinkCard
              href={ytSearchUrl}
              title="Search YouTube"
              subtitle={`Matches & clips featuring ${wrestler.name}`}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   Background — dark blue/dark pink gradient w/ ring-rope texture
   ---------------------------------------------------------------- */
function Sparkles({ count = 45 }) {
  const sparkles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 6,
      duration: 2.5 + Math.random() * 3.5,
    }));
  }, [count]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {sparkles.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 0 6px 1px rgba(255,255,255,0.9)",
            animation: `glow-sparkle-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes glow-sparkle-twinkle {
          0%, 100% { opacity: 0; transform: scale(0.4); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

function AppBackground({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(circle 1400px at 50% 0%, #2a1140 0%, #170b35 35%, #0a0824 65%, #050514 100%)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <Sparkles />
      {/* spotlight glows */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-40%",
          left: "-40%",
          width: "140%",
          height: "140%",
          background:
            "radial-gradient(circle, rgba(255,45,146,0.18), transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: "-45%",
          right: "-40%",
          width: "145%",
          height: "145%",
          background:
            "radial-gradient(circle, rgba(50,90,255,0.18), transparent)",
          pointerEvents: "none",
        }}
      />
      {/* subtle diagonal ring-canvas texture lines */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 2px, transparent 2px, transparent 26px)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Root App
   ---------------------------------------------------------------- */
// Encode a view object into a URL hash string, e.g. "#wrestler/hollywood"
const NAV_FROM_SCREENS = new Set(["skits", "history", "misc", "quiz", "tape"]);

function viewToHash(view) {
  if (view.screen === "wrestler" && view.wrestlerId) {
    const from = view.from || "home";
    return `#wrestler/${view.wrestlerId}/from-${from}`;
  }
  if (view.screen === "splash") return "#splash";
  if (view.screen === "home") return "#home";
  if (NAV_FROM_SCREENS.has(view.screen)) {
    const from = view.from || "home";
    return `#${view.screen}/from-${from}`;
  }
  return `#${view.screen}`;
}

// Decode the current URL hash back into a view object
function hashToView() {
  const raw = window.location.hash.replace(/^#/, "");
  if (raw.startsWith("wrestler/")) {
    const rest = raw.slice("wrestler/".length);
    const fromMatch = rest.match(/\/from-(\w+)$/);
    const id = fromMatch ? rest.slice(0, fromMatch.index) : rest;
    const from = fromMatch ? fromMatch[1] : "home";
    return { screen: "wrestler", wrestlerId: id, from };
  }
  const simpleMatch = raw.match(/^(skits|history|misc|quiz|tape)\/from-(\w+)$/);
  if (simpleMatch) {
    return { screen: simpleMatch[1], from: simpleMatch[2] };
  }
  if (raw === "home" || raw === "skits" || raw === "history" || raw === "misc" || raw === "quiz" || raw === "tape") {
    return { screen: raw, from: "home" };
  }
  return { screen: "splash", wrestlerId: null };
}

export default function GlowApp() {
  const [view, setView] = useState(() => hashToView());
  const scrollPositions = useRef({});

  const navigate = (newView) => {
    // remember where we were on the screen we're leaving
    scrollPositions.current[view.screen] = window.scrollY;
    setView(newView);
    window.location.hash = viewToHash(newView);
  };

  // Keep state in sync with the URL for refreshes, deep links, and the
  // browser's back/forward buttons.
  useEffect(() => {
    const onHashChange = () => setView(hashToView());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const savedY = scrollPositions.current[view.screen];
    window.scrollTo(0, typeof savedY === "number" ? savedY : 0);
  }, [view]);

  return (
    <AppBackground>
      {view.screen === "splash" ? (
        <SplashScreen
          onWrestlers={() => navigate({ screen: "home" })}
          onRandomWrestler={() => {
            const pick = SORTED_WRESTLERS[Math.floor(Math.random() * SORTED_WRESTLERS.length)];
            navigate({ screen: "wrestler", wrestlerId: pick.id, from: "splash" });
          }}
          onSkits={() => navigate({ screen: "skits", from: "splash" })}
          onHistory={() => navigate({ screen: "history", from: "splash" })}
          onQuiz={() => navigate({ screen: "quiz", from: "splash" })}
          onTape={() => navigate({ screen: "tape", from: "splash" })}
          onMisc={() => navigate({ screen: "misc", from: "splash" })}
        />
      ) : view.screen === "home" ? (
        <HomeScreen
          onSelect={(id) => navigate({ screen: "wrestler", wrestlerId: id, from: "home" })}
          onSkits={() => navigate({ screen: "skits", from: "home" })}
          onHistory={() => navigate({ screen: "history", from: "home" })}
          onMisc={() => navigate({ screen: "misc", from: "home" })}
          onQuiz={() => navigate({ screen: "quiz", from: "home" })}
          onTape={() => navigate({ screen: "tape", from: "home" })}
          onBackToSplash={() => navigate({ screen: "splash" })}
        />
      ) : view.screen === "skits" ? (
        <SkitsPage onBack={() => navigate({ screen: view.from || "home" })} backLabel={view.from === "splash" ? "Splash" : "Main"} />
      ) : view.screen === "history" ? (
        <HistoryPage onBack={() => navigate({ screen: view.from || "home" })} backLabel={view.from === "splash" ? "Splash" : "Main"} />
      ) : view.screen === "misc" ? (
        <MiscPage onBack={() => navigate({ screen: view.from || "home" })} backLabel={view.from === "splash" ? "Splash" : "Main"} />
      ) : view.screen === "quiz" ? (
        <QuizPage onBack={() => navigate({ screen: view.from || "home" })} backLabel={view.from === "splash" ? "Splash" : "Main"} />
      ) : view.screen === "tape" ? (
        <TalePage onBack={() => navigate({ screen: view.from || "home" })} backLabel={view.from === "splash" ? "Splash" : "Main"} />
      ) : (
        <WrestlerPage
          wrestlerId={view.wrestlerId}
          onBack={() => navigate({ screen: view.from || "home", wrestlerId: null })}
          backLabel={view.from === "splash" ? "Splash" : "Roster"}
        />
      )}
      <footer
        style={{
          textAlign: "center",
          padding: "4px 16px 20px",
          color: "#5a63a0",
          fontFamily: "'Trebuchet MS', Verdana, sans-serif",
          fontSize: 11,
          opacity: 0.7,
        }}
      >
        A tribute fan app · GLOW: Gorgeous Ladies of Wrestling, 1986–1992
        <br />
        {SITE_URL}
      </footer>
    </AppBackground>
  );
}
