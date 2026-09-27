/* Verse Games data: THE TEN PLAGUES
   Order, warning, sparing, power confronted, and the verse.
   Verse text is filled/verified from the KJV by tools/fill-verses.js */
VG.register({
id:"plagues",
title:"The Ten Plagues",
kicker:"KJV · Exodus 7–12",
source:"Exodus 7–12",
desc:"Ten judgments on Egypt's gods, in order: the warning given, who was spared, and the power confronted.",
meta:"5 stages · 15 questions · three-strike",
shelf:"knowledge",
artCss:"plagues",
playable:true,
seal:{ref:"Exodus 12:51",verse:"And it came to pass the selfsame day, that the LORD did bring the children of Israel out of the land of Egypt by their armies."},
stages:[
{name:"Stage 1 · The River Turns", questions:[
{q:"What was the first plague the LORD sent upon Egypt?",options:["The waters turned to blood","Frogs covered the land","Darkness for three days","Lice from the dust"],a:0,ref:"Exodus 7:20",verse:"And Moses and Aaron did so, as the LORD commanded; and he lifted up the rod, and smote the waters that were in the river, in the sight of Pharaoh, and in the sight of his servants; and all the waters that were in the river were turned to blood.",insight:"The Nile, worshipped as a god, became undrinkable; the LORD struck Egypt's pride at its source."},
{q:"How long did the plague of blood last upon Egypt?",options:["Seven days","Three days","Forty days","One night"],a:0,ref:"Exodus 7:25",verse:"And seven days were fulfilled, after that the LORD had smitten the river.",insight:"Seven days of blood: a complete week of judgment, and Pharaoh's heart stayed hard."},
{q:"What was the second plague?",options:["Frogs","Flies","Locusts","Boils"],a:0,ref:"Exodus 8:6",verse:"And Aaron stretched out his hand over the waters of Egypt; and the frogs came up, and covered the land of Egypt.",insight:"Frogs, sacred to Egypt's goddess Heqet, invaded bedrooms and ovens; their gods could not save them."}
]},
{name:"Stage 2 · Dust and Swarms", questions:[
{q:"Aaron stretched out his rod and smote the dust, which became what?",options:["Lice","Fleas","Gnats of fire","Scorpions"],a:0,ref:"Exodus 8:17",verse:"And they did so; for Aaron stretched out his hand with his rod, and smote the dust of the earth, and it became lice in man, and in beast; all the dust of the land became lice throughout all the land of Egypt.",insight:"From the dust of worshipped earth came torment; even the magicians confessed defeat."},
{q:"When the magicians could not copy the plague of lice, what did they tell Pharaoh?",options:["This is the finger of God","The Hebrew God is too strong","We need more time","It is only a trick"],a:0,ref:"Exodus 8:19",verse:"Then the magicians said unto Pharaoh, This is the finger of God: and Pharaoh’s heart was hardened, and he hearkened not unto them; as the LORD had said.",insight:"Egypt's own wise men named the truth; Pharaoh heard it and hardened his heart anyway."},
{q:"In the fourth plague, what did the LORD spare in the land of Goshen?",options:["Israel, from the swarms of flies","The cattle of Israel","The firstborn of Israel","The wheat and the rye"],a:0,ref:"Exodus 8:22",verse:"And I will sever in that day the land of Goshen, in which my people dwell, that no swarms of flies shall be there; to the end thou mayest know that I am the LORD in the midst of the earth.",insight:"For the first time God drew a line: judgment fell on Egypt while Goshen rested."}
]},
{name:"Stage 3 · Livestock and Boils", questions:[
{q:"What was the fifth plague?",options:["Murrain on the cattle","Boils on man and beast","Hail from heaven","Locusts on the crops"],a:0,ref:"Exodus 9:6",verse:"And the LORD did that thing on the morrow, and all the cattle of Egypt died: but of the cattle of the children of Israel died not one.",insight:"The sacred bulls and herds of Egypt died; not one of Israel's cattle fell."},
{q:"Moses took ashes of the furnace and sprinkled them toward heaven. What followed?",options:["Boils breaking forth with blains","Darkness over the land","Fire running along the ground","A great hailstorm"],a:0,ref:"Exodus 9:10",verse:"And they took ashes of the furnace, and stood before Pharaoh; and Moses sprinkled it up toward heaven; and it became a boil breaking forth with blains upon man, and upon beast.",insight:"The ash of Egypt's brick kilns, where Israel had suffered, became the instrument of judgment."},
{q:"Why could the magicians not stand before Moses during the plague of boils?",options:["The boils were upon the magicians also","Pharaoh had imprisoned them","They had fled to Goshen","Moses had bound them with a curse"],a:0,ref:"Exodus 9:11",verse:"And the magicians could not stand before Moses because of the boils; for the boil was upon the magicians, and upon all the Egyptians.",insight:"The men who once copied God's signs were silenced by his judgment."}
]},
{name:"Stage 4 · The Sky Falls", questions:[
{q:"What was the seventh plague?",options:["Hail mingled with fire","Locusts without number","Darkness that could be felt","A destroying wind"],a:0,ref:"Exodus 9:24",verse:"So there was hail, and fire mingled with the hail, very grievous, such as there was none like it in all the land of Egypt since it became a nation.",insight:"Fire and ice together from heaven: no Egyptian god of the sky answered."},
{q:"Which crops survived the hail, because they were not yet grown up?",options:["The wheat and the rye","The flax and the barley","The vines and fig trees","The olives and pomegranates"],a:0,ref:"Exodus 9:32",verse:"But the wheat and the rie were not smitten: for they were not grown up.",insight:"Even in judgment, mercy measured the stroke; the late crops were spared."},
{q:"What was the eighth plague?",options:["Locusts","Caterpillars","Palmerworms","Hornets"],a:0,ref:"Exodus 10:14",verse:"And the locusts went up over all the land of Egypt, and rested in all the coasts of Egypt: very grievous were they; before them there were no such locusts as they, neither after them shall be such.",insight:"What the hail left, the locusts took; Egypt's fields were stripped bare."}
]},
{name:"Stage 5 · Darkness and the Door", questions:[
{q:"How long did the ninth plague, the darkness, last?",options:["Three days","Seven days","Forty days","One night"],a:0,ref:"Exodus 10:22",verse:"And Moses stretched forth his hand toward heaven; and there was a thick darkness in all the land of Egypt three days:",insight:"Three days of darkness over Ra, the sun god; but Israel had light in their dwellings."},
{q:"At what hour did the LORD smite the firstborn of Egypt?",options:["At midnight","At sunrise","At the third hour","At evening"],a:0,ref:"Exodus 12:29",verse:"And it came to pass, that at midnight the LORD smote all the firstborn in the land of Egypt, from the firstborn of Pharaoh that sat on his throne unto the firstborn of the captive that was in the dungeon; and all the firstborn of cattle.",insight:"At midnight the cry went up from palace to dungeon; no house of Egypt was untouched."},
{q:"'When I see the blood, I will pass over you.' What was the blood a token of?",options:["The lamb slain for the household","The covenant with Abraham","The suffering in bondage","The Nile turned to blood"],a:0,ref:"Exodus 12:13",verse:"And the blood shall be to you for a token upon the houses where ye are: and when I see the blood, I will pass over you, and the plague shall not be upon you to destroy you, when I smite the land of Egypt.",insight:"The Passover lamb pointed to Christ, whose blood still turns judgment aside."}
]}
]
});
