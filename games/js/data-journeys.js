/* Verse Games data: JOURNEYS OF SCRIPTURE
   Bible geography: the roads the saints walked, with the verse.
   Verse text is filled/verified from the KJV by tools/fill-verses.js */
VG.register({
id:"journeys",
title:"Journeys of Scripture",
kicker:"KJV · Genesis to Gospels",
source:"Genesis · Exodus · Joshua · Kings · Ezra · Gospels",
desc:"Twenty journeys across the map of Scripture: patriarchs, exodus, exile, and the roads Jesus walked.",
meta:"5 stages · 20 questions · three-strike",
shelf:"knowledge",
playable:true,
art:"img/card-journeys.webp",
seal:{ref:"Psalm 119:105",verse:"Thy word is a lamp unto my feet, and a light unto my path."},
stages:[
{name:"Stage 1 · The Patriarchs' Roads", questions:[
{q:"When Abram left Haran at God's call, how old was he?",options:["Seventy and five years old","Sixty years old","Ninety years old","One hundred years old"],a:0,ref:"Genesis 12:4",verse:"So Abram departed, as the LORD had spoken unto him; and Lot went with him: and Abram was seventy and five years old when he departed out of Haran.",insight:"Seventy-five, and still he went, not knowing whither; faith walks before it sees the map."},
{q:"At Bethel, what did Jacob see reaching from earth to heaven?",options:["A ladder","A pillar of fire","A cloud of angels","A burning bush"],a:0,ref:"Genesis 28:12",verse:"And he dreamed, and behold a ladder set up on the earth, and the top of it reached to heaven: and behold the angels of God ascending and descending on it.",insight:"A runaway saw heaven opened over a stone pillow; God meets fugitives on the road."},
{q:"To what land did the merchants carry Joseph?",options:["Egypt","Assyria","Babylon","Philistia"],a:0,ref:"Genesis 37:28",verse:"Then there passed by Midianites merchantmen; and they drew and lifted up Joseph out of the pit, and sold Joseph to the Ishmeelites for twenty pieces of silver: and they brought Joseph into Egypt.",insight:"The road to Egypt ran through a pit; every mile of it was under God's hand."},
{q:"Where did Moses see the burning bush?",options:["Mount Horeb","Mount Sinai","Mount Nebo","Mount Carmel"],a:0,ref:"Exodus 3:1",verse:"Now Moses kept the flock of Jethro his father in law, the priest of Midian: and he led the flock to the backside of the desert, and came to the mountain of God, even to Horeb.",insight:"The mountain of God found Moses tending sheep; calling often comes disguised as an ordinary day."}
]},
{name:"Stage 2 · Exodus and Wilderness", questions:[
{q:"What did the children of Israel walk upon when they crossed the sea?",options:["Dry ground","A bridge of boats","The backs of great fish","A path of reeds"],a:0,ref:"Exodus 14:22",verse:"And the children of Israel went into the midst of the sea upon the dry ground: and the waters were a wall unto them on their right hand, and on their left.",insight:"The sea became walls on their right and left; God makes highways where there are none."},
{q:"How long was Moses in the mount receiving the law?",options:["Forty days and forty nights","Seven days","Three days","Twelve days"],a:0,ref:"Exodus 24:18",verse:"And Moses went into the midst of the cloud, and gat him up into the mount: and Moses was in the mount forty days and forty nights.",insight:"Forty days in the cloud with God; the law came down because a man went up."},
{q:"For how many years did Israel wander in the wilderness?",options:["Forty years","Twelve years","Seventy years","Seven years"],a:0,ref:"Numbers 14:33",verse:"And your children shall wander in the wilderness forty years, and bear your whoredoms, until your carcases be wasted in the wilderness.",insight:"A year for every day of unbelief; the wilderness was the classroom for a faithless generation."},
{q:"What happened when the priests' feet touched the Jordan's waters?",options:["The waters stood upon an heap","The river turned to blood","A great fish swallowed the ark","The banks overflowed"],a:0,ref:"Joshua 3:16",verse:"That the waters which came down from above stood and rose up upon an heap very far from the city Adam, that is beside Zaretan: and those that came down toward the sea of the plain, even the salt sea, failed, and were cut off: and the people passed over right against Jericho.",insight:"The water parted only when their feet got wet; obedience steps in before the way opens."}
]},
{name:"Stage 3 · Conquest and Kingdom", questions:[
{q:"How many times did Israel compass Jericho on the seventh day?",options:["Seven times","Three times","Twelve times","Once"],a:0,ref:"Joshua 6:15",verse:"And it came to pass on the seventh day, that they rose early about the dawning of the day, and compassed the city after the same manner seven times: only on that day they compassed the city seven times.",insight:"Seven circuits, then a shout; some walls fall to marching and praise, not to battering rams."},
{q:"Which city did David take from the Jebusites and make his capital?",options:["Jerusalem","Hebron","Shechem","Bethel"],a:0,ref:"2 Samuel 5:7",verse:"Nevertheless David took the strong hold of Zion: the same is the city of David.",insight:"The strong hold of Zion became the city of David; God plants his name where men said it could not be taken."},
{q:"Who built the first temple in Jerusalem?",options:["Solomon","David","Hezekiah","Josiah"],a:0,ref:"1 Kings 6:14",verse:"So Solomon built the house, and finished it.",insight:"David dreamed it, Solomon built it; one generation's longing becomes the next generation's labor."},
{q:"On which mountain did Elijah face the prophets of Baal?",options:["Mount Carmel","Mount Sinai","Mount Tabor","Mount Hermon"],a:0,ref:"1 Kings 18:19",verse:"Now therefore send, and gather to me all Israel unto mount Carmel, and the prophets of Baal four hundred and fifty, and the prophets of the groves four hundred, which eat at Jezebel’s table.",insight:"One prophet against four hundred and fifty; the contest was never about numbers."}
]},
{name:"Stage 4 · Exile and Return", questions:[
{q:"To which city were the captives of Judah carried?",options:["Babylon","Nineveh","Damascus","Memphis"],a:0,ref:"2 Kings 24:15",verse:"And he carried away Jehoiachin to Babylon, and the king’s mother, and the king’s wives, and his officers, and the mighty of the land, those carried he into captivity from Jerusalem to Babylon.",insight:"The road to Babylon was paved with ignored warnings; judgment, too, is a journey."},
{q:"Who decreed that the Jews might return and rebuild the temple?",options:["Cyrus","Darius","Artaxerxes","Nebuchadnezzar"],a:0,ref:"Ezra 1:1",verse:"Now in the first year of Cyrus king of Persia, that the word of the LORD by the mouth of Jeremiah might be fulfilled, the LORD stirred up the spirit of Cyrus king of Persia, that he made a proclamation throughout all his kingdom, and put it also in writing, saying,",insight:"God stirred the spirit of a Persian king; the hearts of rulers turn in his hand like watercourses."},
{q:"In how many days were the walls of Jerusalem rebuilt under Nehemiah?",options:["Fifty and two days","Seventy days","Twelve days","Forty days"],a:0,ref:"Nehemiah 6:15",verse:"So the wall was finished in the twenty and fifth day of the month Elul, in fifty and two days.",insight:"Fifty-two days against mockery and threats; a praying people with trowels in hand finish the work."},
{q:"Who made Esther queen in the place of Vashti?",options:["Ahasuerus","Nebuchadnezzar","Darius","Artaxerxes"],a:0,ref:"Esther 2:17",verse:"And the king loved Esther above all the women, and she obtained grace and favour in his sight more than all the virgins; so that he set the royal crown upon her head, and made her queen instead of Vashti.",insight:"A Jewish orphan on Persia's throne; God writes deliverance with unlikely pens."}
]},
{name:"Stage 5 · The Roads Jesus Walked", questions:[
{q:"In which town was Jesus born?",options:["Bethlehem","Nazareth","Capernaum","Jericho"],a:0,ref:"Matthew 2:1",verse:"Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king, behold, there came wise men from the east to Jerusalem,",insight:"Bethlehem, little among the thousands of Judah; God loves to begin in overlooked places."},
{q:"To which city did Joseph take the child after returning from Egypt?",options:["Nazareth","Bethlehem","Jerusalem","Cana"],a:0,ref:"Matthew 2:23",verse:"And he came and dwelt in a city called Nazareth: that it might be fulfilled which was spoken by the prophets, He shall be called a Nazarene.",insight:"He shall be called a Nazarene; the Savior grew up in a town people despised."},
{q:"Which city is called Jesus' own city, where he dwelt?",options:["Capernaum","Chorazin","Bethsaida","Magdala"],a:0,ref:"Matthew 9:1",verse:"And he entered into a ship, and passed over, and came into his own city.",insight:"His own city heard his teaching and saw his works; familiarity is no excuse for unbelief."},
{q:"Into which city did Jesus ride in triumph upon a colt?",options:["Jerusalem","Bethlehem","Samaria","Galilee"],a:0,ref:"Matthew 21:10",verse:"And when he was come into Jerusalem, all the city was moved, saying, Who is this?",insight:"The King came lowly, riding upon an ass; Jerusalem did not know the day of its visitation."}
]}
]
});
