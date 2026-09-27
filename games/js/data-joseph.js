/* Verse Games data: JOSEPH, FROM PIT TO PALACE
   A narrative journey in five stages. Each stage ends at a Scripture quiz gate.
   Verse text is filled/verified from the KJV by tools/fill-verses.js */
VG.register({
id:"joseph",
title:"Joseph: From Pit to Palace",
kicker:"KJV · Genesis 37–50",
source:"Genesis 37–50",
desc:"Five stages from the pit to the palace. Read each passage slowly, then face the quiz gate to walk on.",
meta:"5 stages · quiz gates · three-strike",
shelf:"narrative",
art:"img/card-joseph.webp",
playable:true,
journey:[
{
title:"The Pit",img:"img/joseph-pit.webp",
teaser:"A coat of many colors, two dreams, and a caravan to Egypt.",
ref:"Genesis 37",
text:"Jacob loved Joseph more than all his children, and made him a coat of many colors. Joseph dreamed dreams of sheaves bowing and stars bowing, and told them to his brothers, who hated him for it.\n\nIn Dothan the brothers stripped him of his coat, cast him into a pit, and sold him to Ishmaelite merchants for twenty pieces of silver. They dipped the coat in goat's blood and carried it home to their father.\n\nThe pit was empty. There was no water in it. But God was already writing the next chapter.",
gate:[
{q:"For how many pieces of silver did Joseph's brothers sell him?",options:["Twenty","Thirty","Fifty","Ten"],a:0,ref:"Genesis 37:28",verse:"Then there passed by Midianites merchantmen; and they drew and lifted up Joseph out of the pit, and sold Joseph to the Ishmeelites for twenty pieces of silver: and they brought Joseph into Egypt.",insight:"Twenty pieces of silver: the price of a young slave, and the beginning of God's great reversal."},
{q:"What did the brothers do with Joseph's coat of many colors?",options:["Dipped it in goat's blood","Tore it into twelve pieces","Buried it in the pit","Sold it with Joseph"],a:0,ref:"Genesis 37:31",verse:"And they took Joseph’s coat, and killed a kid of the goats, and dipped the coat in the blood;",insight:"The coat of favor became the evidence of a lie; Jacob mourned a son who was alive."},
{q:"In Joseph's second dream, what bowed down to him?",options:["The sun, the moon, and eleven stars","Eleven sheaves of wheat","Seven fat and seven thin kine","Twelve olive trees"],a:0,ref:"Genesis 37:9",verse:"And he dreamed yet another dream, and told it his brethren, and said, Behold, I have dreamed a dream more; and, behold, the sun and the moon and the eleven stars made obeisance to me.",insight:"The dream told the future plainly; even Jacob wondered, but he observed the saying."}
]
},
{
title:"Potiphar's House",img:"img/joseph-potiphar.webp",
teaser:"Prosperity as a slave, and a refusal that cost him everything.",
ref:"Genesis 39",
text:"In Egypt Joseph was bought by Potiphar, captain of Pharaoh's guard. The LORD was with Joseph, and he became a prosperous man in his master's house. Potiphar saw it and made him overseer of all he had.\n\nPotiphar's wife cast her eyes upon Joseph day after day. He refused her, saying, How then can I do this great wickedness, and sin against God? When she caught his garment, he fled, leaving it in her hand.\n\nShe accused him falsely, and Joseph was cast into prison. But the LORD was with Joseph, even there.",
gate:[
{q:"What did Joseph say when Potiphar's wife tempted him?",options:["How can I do this great wickedness, and sin against God?","My master trusts me with all he has","I will tell Pharaoh of this","Flee with me to Canaan"],a:0,ref:"Genesis 39:9",verse:"There is none greater in this house than I; neither hath he kept back any thing from me but thee, because thou art his wife: how then can I do this great wickedness, and sin against God?",insight:"Joseph saw sin as first against God, not merely against his master."},
{q:"What did Joseph leave in Potiphar's wife's hand when he fled?",options:["His garment","His signet ring","His money","His shoes"],a:0,ref:"Genesis 39:12",verse:"And she caught him by his garment, saying, Lie with me: and he left his garment in her hand, and fled, and got him out.",insight:"He lost his garment but kept his conscience; the garment became false evidence."},
{q:"Where was Joseph sent after the false accusation?",options:["Into prison","Into the fields","Back to Canaan","To Pharaoh's court"],a:0,ref:"Genesis 39:20",verse:"And Joseph’s master took him, and put him into the prison, a place where the king’s prisoners were bound: and he was there in the prison.",insight:"The prison became Joseph's next promotion; God was with him behind bars."}
]
},
{
title:"The Prison",img:"img/joseph-prison.webp",
teaser:"Two dreams in the dark, and an interpreter who gives God the glory.",
ref:"Genesis 40",
text:"In prison Joseph served Pharaoh's chief butler and chief baker, both cast down for offending their lord. One night each dreamed a dream, and both were troubled by morning.\n\nJoseph saw their sadness and asked, Wherefore look ye so sadly to day? They told him no one could interpret their dreams. Joseph answered, Do not interpretations belong to God? Tell me them, I pray you.\n\nThe butler's dream meant restoration in three days; the baker's meant death in three days. Both came to pass exactly. But the butler forgot Joseph for two full years.",
gate:[
{q:"What did Joseph say when asked to interpret dreams in prison?",options:["Do not interpretations belong to God?","I learned this art in Canaan","Dreams are only shadows","Tell Pharaoh to release me first"],a:0,ref:"Genesis 40:8",verse:"And they said unto him, We have dreamed a dream, and there is no interpreter of it. And Joseph said unto them, Do not interpretations belong to God? tell me them, I pray you.",insight:"Joseph refused the credit and gave it to God; the gift was never his to boast of."},
{q:"What did the chief butler's dream of three branches mean?",options:["In three days he would be restored","In three years famine would come","Three kings would fall","Three vineyards would wither"],a:0,ref:"Genesis 40:12",verse:"And Joseph said unto him, This is the interpretation of it: The three branches are three days:",insight:"Three branches, three days: God speaks plainly when his servants listen."},
{q:"After Joseph interpreted his dream, what did the chief butler do?",options:["Forgot Joseph for two years","Freed Joseph at once","Told Pharaoh that same day","Gave Joseph silver"],a:0,ref:"Genesis 40:23",verse:"Yet did not the chief butler remember Joseph, but forgat him.",insight:"Men forget; God does not. The two years of silence were part of the plan."}
]
},
{
title:"The Palace",img:"img/joseph-palace.webp",
teaser:"Pharaoh's dream, seven years of plenty, and the second chariot.",
ref:"Genesis 41",
text:"Two years later Pharaoh dreamed: seven fat kine eaten by seven lean, seven full ears devoured by seven thin. None of Egypt's magicians could interpret it. Then the butler remembered Joseph.\n\nJoseph was shaved, changed, and brought before Pharaoh. He said, It is not in me: God shall give Pharaoh an answer of peace. Seven years of plenty would come, then seven years of famine; let Pharaoh appoint a wise man over the land.\n\nPharaoh set Joseph over all Egypt, second only to the throne. He gave him the name Zaphnathpaaneah and arrayed him in fine linen, with a gold chain and his own signet ring.",
gate:[
{q:"What did Joseph tell Pharaoh about interpreting dreams?",options:["It is not in me: God shall give Pharaoh an answer of peace","I have studied the Egyptian books","The magicians are fools","Only the gods of Egypt know"],a:0,ref:"Genesis 41:16",verse:"And Joseph answered Pharaoh, saying, It is not in me: God shall give Pharaoh an answer of peace.",insight:"Before the most powerful man on earth, Joseph still pointed away from himself."},
{q:"What did Pharaoh's dreams of kine and ears foretell?",options:["Seven years of plenty, then seven years of famine","Seven wars with Canaan","Seven sons for Pharaoh","Seven temples to be built"],a:0,ref:"Genesis 41:29",verse:"Behold, there come seven years of great plenty throughout all the land of Egypt:",insight:"God showed Pharaoh the future so that Egypt, and Joseph's family, might live."},
{q:"What sign of authority did Pharaoh give Joseph?",options:["His signet ring","His crown","His sword","His palace"],a:0,ref:"Genesis 41:42",verse:"And Pharaoh took off his ring from his hand, and put it upon Joseph’s hand, and arrayed him in vestures of fine linen, and put a gold chain about his neck;",insight:"From prison to the signet ring in a day: promotion belongs to the LORD."}
]
},
{
title:"The Provision",img:"img/joseph-provision.webp",
teaser:"The brothers bow, the silver cup, and the word that heals the story.",
ref:"Genesis 42–50",
text:"The famine reached Canaan, and Jacob sent ten sons to buy corn in Egypt. They bowed before the governor, not knowing he was Joseph. He knew them, tested them, and at last wept aloud: I am Joseph your brother.\n\nJoseph sent for his father and all their households, and settled them in Goshen. Jacob lived seventeen more years in Egypt, and blessed Joseph's sons before he died.\n\nAfter Jacob's death the brothers feared revenge. Joseph wept and said, Fear not: ye thought evil against me; but God meant it unto good, to save much people alive. The pit, the prison, and the palace were one story all along.",
gate:[
{q:"When Joseph's brothers first came to Egypt, what did they do before him?",options:["Bowed themselves before him","Offered him silver","Fled back to Canaan","Denied knowing Jacob"],a:0,ref:"Genesis 42:6",verse:"And Joseph was the governor over the land, and he it was that sold to all the people of the land: and Joseph’s brethren came, and bowed down themselves before him with their faces to the earth.",insight:"The sheaves of the old dream bowed at last; God's word never falls to the ground."},
{q:"What did Joseph say when he revealed himself to his brothers?",options:["I am Joseph your brother","Behold, Pharaoh's governor","You shall all be slaves","Flee, for famine comes"],a:0,ref:"Genesis 45:4",verse:"And Joseph said unto his brethren, Come near to me, I pray you. And they came near. And he said, I am Joseph your brother, whom ye sold into Egypt.",insight:"No revenge, only tears: the brother they sold became the brother who saved them."},
{q:"'Ye thought evil against me; but God meant it unto good.' What good did Joseph name?",options:["To save much people alive","To make me ruler of Egypt","To punish my brothers","To enrich our family"],a:0,ref:"Genesis 50:20",verse:"But as for you, ye thought evil against me; but God meant it unto good, to bring to pass, as it is this day, to save much people alive.",insight:"The whole journey in one sentence: man's evil, God's good, many lives saved."}
]
}
]
});
