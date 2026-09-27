/* Verse Games data: WISDOM AND WORSHIP
   Psalms, Proverbs, Ecclesiastes: the hymnbook and the proverbs of Israel.
   Verse text is filled/verified from the KJV by tools/fill-verses.js */
VG.register({
id:"wisdom",
title:"Wisdom and Worship",
kicker:"KJV · Psalms · Proverbs · Ecclesiastes",
source:"Psalms · Proverbs · Ecclesiastes",
desc:"Twenty sayings and songs: the fear of the LORD, psalms of trust and praise, and wisdom for daily life.",
meta:"5 stages · 20 questions · three-strike",
shelf:"knowledge",
playable:true,
art:"img/card-wisdom.webp",
seal:{ref:"Psalm 19:14",verse:"Let the words of my mouth, and the meditation of my heart, be acceptable in thy sight, O LORD, my strength, and my redeemer."},
stages:[
{name:"Stage 1 · The Fear of the LORD", questions:[
{q:"What is the beginning of wisdom?",options:["The fear of the LORD","Much study","A good teacher","Long life"],a:0,ref:"Proverbs 9:10",verse:"The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding.",insight:"Wisdom does not begin in the classroom but on the knees; reverence is the root of understanding."},
{q:"Whom does the LORD chasten?",options:["Whom he loveth","The rebellious only","The stranger","The poor"],a:0,ref:"Proverbs 3:12",verse:"For whom the LORD loveth he correcteth; even as a father the son in whom he delighteth.",insight:"The Father's correction proves the Father's love; only strangers are left undisciplined."},
{q:"Trust in the LORD with all thine heart, and lean not unto...",options:["Thine own understanding","The arm of flesh","Thy neighbor's counsel","Thy riches"],a:0,ref:"Proverbs 3:5",verse:"Trust in the LORD with all thine heart; and lean not unto thine own understanding.",insight:"Half trust is whole doubt; the heart divided between God and its own wisdom leans on a reed."},
{q:"In all thy ways acknowledge him, and he shall...",options:["Direct thy paths","Give thee riches","Lengthen thy days","Send thee help"],a:0,ref:"Proverbs 3:6",verse:"In all thy ways acknowledge him, and he shall direct thy paths.",insight:"Direction is promised to the acknowledging heart; God guides the life that invites him in."}
]},
{name:"Stage 2 · Psalms of Trust", questions:[
{q:"The LORD is my shepherd; I shall not...",options:["Want","Fear","Fall","Wander"],a:0,ref:"Psalm 23:1",verse:"The LORD is my shepherd; I shall not want.",insight:"With the Shepherd, want is a rumor; the sheep of his pasture lack no good thing."},
{q:"Yea, though I walk through the valley of the shadow of death, I will fear no evil: for...",options:["Thou art with me","The angels guard me","The shepherd goes before","My staff protects me"],a:0,ref:"Psalm 23:4",verse:"Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",insight:"It is the shadow of death, not death itself, and shadows cannot hurt the one the Shepherd walks beside."},
{q:"Blessed is the man that walketh not in the counsel of the...",options:["Ungodly","Proud","Rich","Violent"],a:0,ref:"Psalm 1:1",verse:"Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.",insight:"Blessing begins with refusal; the godly life starts by declining the wrong counsel."},
{q:"His delight is in the law of the LORD; and in his law doth he meditate...",options:["Day and night","Morning and evening","Sabbath to Sabbath","Year by year"],a:0,ref:"Psalm 1:2",verse:"But his delight is in the law of the LORD; and in his law doth he meditate day and night.",insight:"Delight, not duty, keeps the law in the heart; meditation turns reading into rooting."}
]},
{name:"Stage 3 · Psalms of Worship", questions:[
{q:"Make a joyful noise unto the LORD...",options:["All ye lands","O ye heavens","Ye mountains","All ye saints"],a:0,ref:"Psalm 100:1",verse:"Make a joyful noise unto the LORD, all ye lands.",insight:"The invitation to joy is addressed to all lands; worship was never meant for one nation alone."},
{q:"Enter into his gates with thanksgiving, and into his courts with...",options:["Praise","Singing","Dancing","Offerings"],a:0,ref:"Psalm 100:4",verse:"Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.",insight:"Thanksgiving is the gate, praise the court; gratitude is how we come near."},
{q:"Let every thing that hath breath...",options:["Praise the LORD","Sing a new song","Bow before him","Keep silence"],a:0,ref:"Psalm 150:6",verse:"Let every thing that hath breath praise the LORD. Praise ye the LORD.",insight:"The last word of the psalter is praise; if you have breath, you have an assignment."},
{q:"Praise him with the sound of the...",options:["Trumpet","Harp only","Drum","Flute"],a:0,ref:"Psalm 150:3",verse:"Praise him with the sound of the trumpet: praise him with the psaltery and harp.",insight:"Loud instruments for a loud God; timid praise never matched his greatness."}
]},
{name:"Stage 4 · Wisdom for Life", questions:[
{q:"A soft answer turneth away...",options:["Wrath","Evil","Sorrow","Strife"],a:0,ref:"Proverbs 15:1",verse:"A soft answer turneth away wrath: but grievous words stir up anger.",insight:"Gentleness disarms what argument inflames; the soft answer is the strong answer."},
{q:"Pleasant words are as an honeycomb, sweet to the soul, and...",options:["Health to the bones","Joy to the heart","Light to the eyes","Strength to the weak"],a:0,ref:"Proverbs 16:24",verse:"Pleasant words are as an honeycomb, sweet to the soul, and health to the bones.",insight:"Kind speech is medicine; the tongue can be a pharmacy or a poison."},
{q:"A friend loveth at all times, and a brother is born for...",options:["Adversity","Joy","Counsel","Peace"],a:0,ref:"Proverbs 17:17",verse:"A friend loveth at all times, and a brother is born for adversity.",insight:"Fair-weather friends love the feast; true brothers are born for the famine."},
{q:"He that is slow to anger is better than...",options:["The mighty","The rich","The wise","The swift"],a:0,ref:"Proverbs 16:32",verse:"He that is slow to anger is better than the mighty; and he that ruleth his spirit than he that taketh a city.",insight:"Conquering a city is easier than conquering a temper; self-rule outranks every other victory."}
]},
{name:"Stage 5 · Vanity and Eternity", questions:[
{q:"Vanity of vanities, saith the Preacher; all is...",options:["Vanity","Wisdom","Labor","Sorrow"],a:0,ref:"Ecclesiastes 1:2",verse:"Vanity of vanities, saith the Preacher, vanity of vanities; all is vanity.",insight:"Life under the sun, without God, is breath on a mirror; the Preacher says it so we will look higher."},
{q:"To every thing there is a season, and a time to every purpose...",options:["Under the heaven","Under the sun","In the earth","Among men"],a:0,ref:"Ecclesiastes 3:1",verse:"To every thing there is a season, and a time to every purpose under the heaven:",insight:"Heaven keeps a calendar; our task is to discern the season, not to curse it."},
{q:"Remember now thy Creator in the days of thy...",options:["Youth","Strength","Prosperity","Health"],a:0,ref:"Ecclesiastes 12:1",verse:"Remember now thy Creator in the days of thy youth, while the evil days come not, nor the years draw nigh, when thou shalt say, I have no pleasure in them;",insight:"Give God the morning of life, not the leftovers of the evening; youth is the seedtime of eternity."},
{q:"Let us hear the conclusion of the whole matter: Fear God, and keep his commandments: for this is...",options:["The whole duty of man","The beginning of wisdom","The path of life","The end of the law"],a:0,ref:"Ecclesiastes 12:13",verse:"Let us hear the conclusion of the whole matter: Fear God, and keep his commandments: for this is the whole duty of man.",insight:"After all the searching, the whole duty fits in one sentence: fear God and keep his commandments."}
]}
]
});
