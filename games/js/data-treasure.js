/* Verse Games data: HIDDEN TREASURE, A JOURNEY THROUGH MATTHEW
   A narrative journey in five stages. Each stage ends at a Scripture quiz gate.
   Verse text is filled/verified from the KJV by tools/fill-verses.js */
VG.register({
id:"treasure",
title:"Hidden Treasure: A Journey Through Matthew",
kicker:"KJV · Matthew",
source:"Matthew",
desc:"Five stages through Matthew's Gospel: the King is born, teaches, heals, dies, and rises. Read each passage slowly, then face the quiz gate to walk on.",
meta:"5 stages · quiz gates · three-strike",
shelf:"narrative",
playable:true,
art:"img/card-treasure.webp",
journey:[
{
title:"The King Is Born",img:"img/treasure-born.webp",
teaser:"A virgin, a star, and wise men from the east.",
ref:"Matthew 1–2",
text:"The Gospel opens with a genealogy: Abraham to David, David to the captivity, the captivity to Christ. Fourteen generations of waiting, and then a virgin in Nazareth was found with child of the Holy Ghost.\n\nJoseph, her espoused husband, was minded to put her away privily. But the angel of the Lord appeared to him in a dream, saying, Joseph, thou son of David, fear not to take unto thee Mary thy wife. And she brought forth her firstborn son, and he called his name JESUS.\n\nWise men from the east followed his star to Bethlehem, fell down, and worshipped him, opening their treasures. But Herod raged, and Joseph fled with the young child into Egypt by night.",
gate:[
{q:"What did the angel tell Joseph to name Mary's son?",options:["JESUS","Emmanuel","Christ","John"],a:0,ref:"Matthew 1:21",verse:"And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins.",insight:"JESUS, for he shall save his people from their sins; the name is the mission."},
{q:"From where did the wise men come to worship the child?",options:["The east","The north","Egypt","Rome"],a:0,ref:"Matthew 2:1",verse:"Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king, behold, there came wise men from the east to Jerusalem,",insight:"Gentiles from the east found him while Jerusalem slept; the seeking heart is led by a star."},
{q:"To what country did Joseph flee with the young child?",options:["Egypt","Syria","Galilee","Arabia"],a:0,ref:"Matthew 2:14",verse:"When he arose, he took the young child and his mother by night, and departed into Egypt:",insight:"Out of Egypt have I called my son; even the flight was fulfilling prophecy."}
]
},
{
title:"The Sermon on the Mount",img:"img/treasure-sermon.webp",
teaser:"The King's manifesto: blessed are the meek, the merciful, the pure in heart.",
ref:"Matthew 5–7",
text:"Seeing the multitudes, Jesus went up into a mountain, and when he was set, his disciples came unto him. And he opened his mouth, and taught them, saying, Blessed are the poor in spirit: for theirs is the kingdom of heaven.\n\nHe taught them to pray, Our Father which art in heaven, hallowed be thy name. He taught them to give, to fast, and to forgive in secret, and to lay up treasures in heaven where neither moth nor rust doth corrupt.\n\nAnd it came to pass, when Jesus had ended these sayings, the people were astonished at his doctrine: for he taught them as one having authority, and not as the scribes.",
gate:[
{q:"Who shall inherit the earth, according to the Beatitudes?",options:["The meek","The mighty","The rich","The wise"],a:0,ref:"Matthew 5:5",verse:"Blessed are the meek: for they shall inherit the earth.",insight:"The meek inherit the earth; the kingdom reverses the world's arithmetic."},
{q:"What did Jesus say to do when the right cheek is smitten?",options:["Turn the other also","Strike back quickly","Flee to another city","Call for justice"],a:0,ref:"Matthew 5:39",verse:"But I say unto you, That ye resist not evil: but whosoever shall smite thee on thy right cheek, turn to him the other also.",insight:"Turn the other also; the King's subjects conquer evil by absorbing it."},
{q:"What did Jesus call those who hear his sayings and do them?",options:["A wise man who built his house upon a rock","A good and faithful servant","The salt of the earth","Children of light"],a:0,ref:"Matthew 7:24",verse:"Therefore whosoever heareth these sayings of mine, and doeth them, I will liken him unto a wise man, which built his house upon a rock:",insight:"Hearing plus doing is rock; hearing alone is sand."}
]
},
{
title:"Miracles of the Kingdom",img:"img/treasure-miracles.webp",
teaser:"The King's credentials: lepers cleansed, storms stilled, the dead raised.",
ref:"Matthew 8–9",
text:"When he was come down from the mountain, great multitudes followed him. And, behold, there came a leper and worshipped him, saying, Lord, if thou wilt, thou canst make me clean. And Jesus put forth his hand, and touched him, saying, I will; be thou clean. And immediately his leprosy was cleansed.\n\nA centurion sought him for his servant, saying, Lord, I am not worthy that thou shouldest come under my roof: but speak the word only, and my servant shall be healed. And Jesus marvelled, and said, I have not found so great faith, no, not in Israel.\n\nHe entered the ruler's house, took the dead damsel by the hand, and the maid arose. And the fame hereof went abroad into all that land.",
gate:[
{q:"What did the centurion say Jesus needed only to do to heal his servant?",options:["Speak the word only","Touch him","Come under his roof","Lay hands on him"],a:0,ref:"Matthew 8:8",verse:"The centurion answered and said, Lord, I am not worthy that thou shouldest come under my roof: but speak the word only, and my servant shall be healed.",insight:"Speak the word only; the centurion's faith amazed the Lord himself."},
{q:"When Jesus touched the leper, what happened?",options:["Immediately his leprosy was cleansed","He was told to wash seven times","He was sent to the priests first","He fell down and worshipped"],a:0,ref:"Matthew 8:3",verse:"And Jesus put forth his hand, and touched him, saying, I will; be thou clean. And immediately his leprosy was cleansed.",insight:"Immediately; the King's touch does not delay."},
{q:"What did Jesus say when the ruler's daughter was declared dead?",options:["The maid is not dead, but sleepeth","Weep not, she shall rise","Have faith, and she shall live","Bring her to me"],a:0,ref:"Matthew 9:24",verse:"He said unto them, Give place: for the maid is not dead, but sleepeth. And they laughed him to scorn.",insight:"Not dead, but sleepeth; death is a nap when Jesus is in the room."}
]
},
{
title:"The Cup and the Cross",img:"img/treasure-upperroom.webp",
teaser:"The last supper, Gethsemane, and the hill called Calvary.",
ref:"Matthew 21, 26–27",
text:"They brought the ass, and the colt, and put on them their clothes, and they set him thereon. And a very great multitude spread their garments in the way, crying, Hosanna to the son of David. And when he was come into Jerusalem, all the city was moved.\n\nIn the upper room Jesus took bread, and blessed it, and brake it, and gave it to the disciples, and said, Take, eat; this is my body. And he took the cup, saying, Drink ye all of it; for this is my blood of the new testament.\n\nIn Gethsemane he prayed, O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt. Then they crucified him, and the centurion said, Truly this was the Son of God.",
gate:[
{q:"Upon what did Jesus ride into Jerusalem?",options:["An ass, and a colt the foal of an ass","A white horse","A chariot","A camel"],a:0,ref:"Matthew 21:5",verse:"Tell ye the daughter of Sion, Behold, thy King cometh unto thee, meek, and sitting upon an ass, and a colt the foal of an ass.",insight:"Lowly, and riding upon an ass; the King of glory chose the humblest throne."},
{q:"In Gethsemane, what did Jesus pray?",options:["O my Father, if it be possible, let this cup pass from me","Father, forgive them","My God, why hast thou forsaken me","Into thy hands I commend my spirit"],a:0,ref:"Matthew 26:39",verse:"And he went a little farther, and fell on his face, and prayed, saying, O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt.",insight:"Not as I will, but as thou wilt; obedience prayed through the agony."},
{q:"What did the centurion at the cross confess?",options:["Truly this was the Son of God","Surely he was a prophet","This was a righteous man","We have crucified the Christ"],a:0,ref:"Matthew 27:54",verse:"Now when the centurion, and they that were with him, watching Jesus, saw the earthquake, and those things that were done, they feared greatly, saying, Truly this was the Son of God.",insight:"A Gentile soldier preached the first sermon of the cross: Truly this was the Son of God."}
]
},
{
title:"Risen and Reigning",img:"img/treasure-risen.webp",
teaser:"The empty tomb, the mountain in Galilee, and the commission to all nations.",
ref:"Matthew 28",
text:"In the end of the sabbath, as it began to dawn toward the first day of the week, came Mary Magdalene and the other Mary to see the sepulchre. And, behold, there was a great earthquake: for the angel of the Lord descended from heaven, and came and rolled back the stone.\n\nAnd the angel said unto the women, Fear not ye: for I know that ye seek Jesus, which was crucified. He is not here: for he is risen, as he said. Come, see the place where the Lord lay.\n\nThen the eleven disciples went away into Galilee, into a mountain where Jesus had appointed them. And Jesus came and spake unto them, saying, All power is given unto me in heaven and in earth. Go ye therefore, and teach all nations.",
gate:[
{q:"What did the angel say to the women at the tomb?",options:["He is not here: for he is risen","Fear not, he sleepeth","Behold the place","Go tell the disciples"],a:0,ref:"Matthew 28:6",verse:"He is not here: for he is risen, as he said. Come, see the place where the Lord lay.",insight:"He is not here: for he is risen; four words that remade the world."},
{q:"What did the risen Jesus say when he met the women?",options:["All hail","Peace be unto you","Touch me not","Go in peace"],a:0,ref:"Matthew 28:9",verse:"And as they went to tell his disciples, behold, Jesus met them, saying, All hail. And they came and held him by the feet, and worshipped him.",insight:"All hail; the first word of the risen Christ is joy."},
{q:"What command did Jesus give on the mountain in Galilee?",options:["Go ye therefore, and teach all nations","Tarry in Jerusalem","Preach to Israel only","Build my church"],a:0,ref:"Matthew 28:19",verse:"Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:",insight:"All nations; the treasure found is for the whole world."}
]
}
],
seal:{ref:"Matthew 28:20",verse:"Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen."}
});
