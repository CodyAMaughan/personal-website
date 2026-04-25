// Generated from the Doctrinal Mastery Core Document and linked scripture pages.
// Source list: https://www.churchofjesuschrist.org/study/manual/doctrinal-mastery-core-document-2023/doctrinal-mastery-passages-and-key-phrases?lang=eng

export type ScriptureCourseId =
  | "old-testament"
  | "new-testament"
  | "book-of-mormon"
  | "doctrine-and-covenants";

export interface ScriptureChunk {
  verse: string;
  text: string;
}

export interface ScripturePassage {
  id: string;
  order: number;
  unit: number;
  course: string;
  courseId: ScriptureCourseId;
  reference: string;
  keyPhrase: string;
  text: string;
  chunks: ScriptureChunk[];
  sourceUrl: string;
}

export const SCRIPTURE_PASSAGES = [
  {
    "id": "moses-1-39",
    "order": 1,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 1,
    "reference": "Moses 1:39",
    "keyPhrase": "“This is my work and my glory—to bring to pass the immortality and eternal life of man.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/1?lang=eng&id=p39#p39",
    "chunks": [
      {
        "verse": "39",
        "text": "For behold, this is my work and my glory—to bring to pass the immortality and eternal life of man."
      }
    ],
    "text": "For behold, this is my work and my glory—to bring to pass the immortality and eternal life of man."
  },
  {
    "id": "moses-7-18",
    "order": 2,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 1,
    "reference": "Moses 7:18",
    "keyPhrase": "“The Lord called his people Zion, because they were of one heart and one mind.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/pgp/moses/7?lang=eng&id=p18#p18",
    "chunks": [
      {
        "verse": "18",
        "text": "And the Lord called his people Zion, because they were of one heart and one mind, and dwelt in righteousness; and there was no poor among them."
      }
    ],
    "text": "And the Lord called his people Zion, because they were of one heart and one mind, and dwelt in righteousness; and there was no poor among them."
  },
  {
    "id": "abraham-2-9-11",
    "order": 3,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 1,
    "reference": "Abraham 2:9–11",
    "keyPhrase": "The Lord promised Abraham that his seed would “bear this ministry and Priesthood unto all nations.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/pgp/abr/2?lang=eng&id=p9-p11#p9",
    "chunks": [
      {
        "verse": "9",
        "text": "And I will make of thee a great nation, and I will bless thee above measure, and make thy name great among all nations, and thou shalt be a blessing unto thy seed after thee, that in their hands they shall bear this ministry and Priesthood unto all nations;"
      },
      {
        "verse": "10",
        "text": "And I will bless them through thy name; for as many as receive this Gospel shall be called after thy name, and shall be accounted thy seed, and shall rise up and bless thee, as their father;"
      },
      {
        "verse": "11",
        "text": "And I will bless them that bless thee, and curse them that curse thee; and in thee (that is, in thy Priesthood) and in thy seed (that is, thy Priesthood), for I give unto thee a promise that this right shall continue in thee, and in thy seed after thee (that is to say, the literal seed, or the seed of the body) shall all the families of the earth be blessed, even with the blessings of the Gospel, which are the blessings of salvation, even of life eternal."
      }
    ],
    "text": "And I will make of thee a great nation, and I will bless thee above measure, and make thy name great among all nations, and thou shalt be a blessing unto thy seed after thee, that in their hands they shall bear this ministry and Priesthood unto all nations; And I will bless them through thy name; for as many as receive this Gospel shall be called after thy name, and shall be accounted thy seed, and shall rise up and bless thee, as their father; And I will bless them that bless thee, and curse them that curse thee; and in thee (that is, in thy Priesthood) and in thy seed (that is, thy Priesthood), for I give unto thee a promise that this right shall continue in thee, and in thy seed after thee (that is to say, the literal seed, or the seed of the body) shall all the families of the earth be blessed, even with the blessings of the Gospel, which are the blessings of salvation, even of life eternal."
  },
  {
    "id": "abraham-3-22-23",
    "order": 4,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 1,
    "reference": "Abraham 3:22–23",
    "keyPhrase": "As spirits we “were organized before the world was.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/pgp/abr/3?lang=eng&id=p22-p23#p22",
    "chunks": [
      {
        "verse": "22",
        "text": "Now the Lord had shown unto me, Abraham, the intelligences that were organized before the world was; and among all these there were many of the noble and great ones;"
      },
      {
        "verse": "23",
        "text": "And God saw these souls that they were good, and he stood in the midst of them, and he said: These I will make my rulers; for he stood among those that were spirits, and he saw that they were good; and he said unto me: Abraham, thou art one of them; thou wast chosen before thou wast born."
      }
    ],
    "text": "Now the Lord had shown unto me, Abraham, the intelligences that were organized before the world was; and among all these there were many of the noble and great ones; And God saw these souls that they were good, and he stood in the midst of them, and he said: These I will make my rulers; for he stood among those that were spirits, and he saw that they were good; and he said unto me: Abraham, thou art one of them; thou wast chosen before thou wast born."
  },
  {
    "id": "genesis-1-26-27",
    "order": 5,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 2,
    "reference": "Genesis 1:26–27",
    "keyPhrase": "“God created man in his own image.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/gen/1?lang=eng&id=p26-p27#p26",
    "chunks": [
      {
        "verse": "26",
        "text": "¶ And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth."
      },
      {
        "verse": "27",
        "text": "So God created man in his own image, in the image of God created he him; male and female created he them."
      }
    ],
    "text": "¶ And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth. So God created man in his own image, in the image of God created he him; male and female created he them."
  },
  {
    "id": "genesis-2-24",
    "order": 6,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 2,
    "reference": "Genesis 2:24",
    "keyPhrase": "“A man … shall cleave unto his wife: and they shall be one.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/gen/2?lang=eng&id=p24#p24",
    "chunks": [
      {
        "verse": "24",
        "text": "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh."
      }
    ],
    "text": "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh."
  },
  {
    "id": "genesis-39-9",
    "order": 7,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 2,
    "reference": "Genesis 39:9",
    "keyPhrase": "“How then can I do this great wickedness, and sin against God?”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/gen/39?lang=eng&id=p9#p9",
    "chunks": [
      {
        "verse": "9",
        "text": "There is none greater in this house than I; neither hath he kept back any thing from me but thee, because thou art his wife: how then can I do this great wickedness, and sin against God?"
      }
    ],
    "text": "There is none greater in this house than I; neither hath he kept back any thing from me but thee, because thou art his wife: how then can I do this great wickedness, and sin against God?"
  },
  {
    "id": "exodus-20-3-17",
    "order": 8,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 2,
    "reference": "Exodus 20:3–17",
    "keyPhrase": "The Ten Commandments",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/ex/20?lang=eng&id=p3-p17#p3",
    "chunks": [
      {
        "verse": "3",
        "text": "Thou shalt have no other gods before me."
      },
      {
        "verse": "4",
        "text": "Thou shalt not make unto thee any graven image, or any likeness of any thing that is in heaven above, or that is in the earth beneath, or that is in the water under the earth:"
      },
      {
        "verse": "5",
        "text": "Thou shalt not bow down thyself to them, nor serve them: for I the Lord thy God am a jealous God, visiting the iniquity of the fathers upon the children unto the third and fourth generation of them that hate me;"
      },
      {
        "verse": "6",
        "text": "And shewing mercy unto thousands of them that love me, and keep my commandments."
      },
      {
        "verse": "7",
        "text": "Thou shalt not take the name of the Lord thy God in vain; for the Lord will not hold him guiltless that taketh his name in vain."
      },
      {
        "verse": "8",
        "text": "Remember the sabbath day, to keep it holy."
      },
      {
        "verse": "9",
        "text": "Six days shalt thou labour, and do all thy work:"
      },
      {
        "verse": "10",
        "text": "But the seventh day is the sabbath of the Lord thy God: in it thou shalt not do any work, thou, nor thy son, nor thy daughter, thy manservant, nor thy maidservant, nor thy cattle, nor thy stranger that is within thy gates:"
      },
      {
        "verse": "11",
        "text": "For in six days the Lord made heaven and earth, the sea, and all that in them is, and rested the seventh day: wherefore the Lord blessed the sabbath day, and hallowed it."
      },
      {
        "verse": "12",
        "text": "¶ Honour thy father and thy mother: that thy days may be long upon the land which the Lord thy God giveth thee."
      },
      {
        "verse": "13",
        "text": "Thou shalt not kill."
      },
      {
        "verse": "14",
        "text": "Thou shalt not commit adultery."
      },
      {
        "verse": "15",
        "text": "Thou shalt not steal."
      },
      {
        "verse": "16",
        "text": "Thou shalt not bear false witness against thy neighbour."
      },
      {
        "verse": "17",
        "text": "Thou shalt not covet thy neighbour’s house, thou shalt not covet thy neighbour’s wife, nor his manservant, nor his maidservant, nor his ox, nor his ass, nor any thing that is thy neighbour’s."
      }
    ],
    "text": "Thou shalt have no other gods before me. Thou shalt not make unto thee any graven image, or any likeness of any thing that is in heaven above, or that is in the earth beneath, or that is in the water under the earth: Thou shalt not bow down thyself to them, nor serve them: for I the Lord thy God am a jealous God, visiting the iniquity of the fathers upon the children unto the third and fourth generation of them that hate me; And shewing mercy unto thousands of them that love me, and keep my commandments. Thou shalt not take the name of the Lord thy God in vain; for the Lord will not hold him guiltless that taketh his name in vain. Remember the sabbath day, to keep it holy. Six days shalt thou labour, and do all thy work: But the seventh day is the sabbath of the Lord thy God: in it thou shalt not do any work, thou, nor thy son, nor thy daughter, thy manservant, nor thy maidservant, nor thy cattle, nor thy stranger that is within thy gates: For in six days the Lord made heaven and earth, the sea, and all that in them is, and rested the seventh day: wherefore the Lord blessed the sabbath day, and hallowed it. ¶ Honour thy father and thy mother: that thy days may be long upon the land which the Lord thy God giveth thee. Thou shalt not kill. Thou shalt not commit adultery. Thou shalt not steal. Thou shalt not bear false witness against thy neighbour. Thou shalt not covet thy neighbour’s house, thou shalt not covet thy neighbour’s wife, nor his manservant, nor his maidservant, nor his ox, nor his ass, nor any thing that is thy neighbour’s."
  },
  {
    "id": "joshua-24-15",
    "order": 9,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 3,
    "reference": "Joshua 24:15",
    "keyPhrase": "“Choose you this day whom ye will serve.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/josh/24?lang=eng&id=p15#p15",
    "chunks": [
      {
        "verse": "15",
        "text": "And if it seem evil unto you to serve the Lord, choose you this day whom ye will serve; whether the gods which your fathers served that were on the other side of the flood, or the gods of the Amorites, in whose land ye dwell: but as for me and my house, we will serve the Lord."
      }
    ],
    "text": "And if it seem evil unto you to serve the Lord, choose you this day whom ye will serve; whether the gods which your fathers served that were on the other side of the flood, or the gods of the Amorites, in whose land ye dwell: but as for me and my house, we will serve the Lord."
  },
  {
    "id": "psalm-24-3-4",
    "order": 10,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 3,
    "reference": "Psalm 24:3–4",
    "keyPhrase": "“Who shall stand in his holy place? He that hath clean hands, and a pure heart.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/ps/24?lang=eng&id=p3-p4#p3",
    "chunks": [
      {
        "verse": "3",
        "text": "Who shall ascend into the hill of the Lord? or who shall stand in his holy place?"
      },
      {
        "verse": "4",
        "text": "He that hath clean hands, and a pure heart; who hath not lifted up his soul unto vanity, nor sworn deceitfully."
      }
    ],
    "text": "Who shall ascend into the hill of the Lord? or who shall stand in his holy place? He that hath clean hands, and a pure heart; who hath not lifted up his soul unto vanity, nor sworn deceitfully."
  },
  {
    "id": "proverbs-3-5-6",
    "order": 11,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 3,
    "reference": "Proverbs 3:5–6",
    "keyPhrase": "“Trust in the Lord with all thine heart … and he shall direct thy paths.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/prov/3?lang=eng&id=p5-p6#p5",
    "chunks": [
      {
        "verse": "5",
        "text": "¶ Trust in the Lord with all thine heart; and lean not unto thine own understanding."
      },
      {
        "verse": "6",
        "text": "In all thy ways acknowledge him, and he shall direct thy paths."
      }
    ],
    "text": "¶ Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths."
  },
  {
    "id": "isaiah-1-18",
    "order": 12,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 3,
    "reference": "Isaiah 1:18",
    "keyPhrase": "“Though your sins be as scarlet, they shall be as white as snow.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/isa/1?lang=eng&id=p18#p18",
    "chunks": [
      {
        "verse": "18",
        "text": "Come now, and let us reason together, saith the Lord: though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool."
      }
    ],
    "text": "Come now, and let us reason together, saith the Lord: though your sins be as scarlet, they shall be as white as snow; though they be red like crimson, they shall be as wool."
  },
  {
    "id": "isaiah-5-20",
    "order": 13,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 4,
    "reference": "Isaiah 5:20",
    "keyPhrase": "“Woe unto them that call evil good, and good evil.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/isa/5?lang=eng&id=p20#p20",
    "chunks": [
      {
        "verse": "20",
        "text": "¶ Woe unto them that call evil good, and good evil; that put darkness for light, and light for darkness; that put bitter for sweet, and sweet for bitter!"
      }
    ],
    "text": "¶ Woe unto them that call evil good, and good evil; that put darkness for light, and light for darkness; that put bitter for sweet, and sweet for bitter!"
  },
  {
    "id": "isaiah-29-13-14",
    "order": 14,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 4,
    "reference": "Isaiah 29:13–14",
    "keyPhrase": "The restoration of the gospel is “a marvellous work and a wonder.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/isa/29?lang=eng&id=p13-p14#p13",
    "chunks": [
      {
        "verse": "13",
        "text": "¶ Wherefore the Lord said, Forasmuch as this people draw near me with their mouth, and with their lips do honour me, but have removed their heart far from me, and their fear toward me is taught by the precept of men:"
      },
      {
        "verse": "14",
        "text": "Therefore, behold, I will proceed to do a marvellous work among this people, even a marvellous work and a wonder: for the wisdom of their wise men shall perish, and the understanding of their prudent men shall be hid."
      }
    ],
    "text": "¶ Wherefore the Lord said, Forasmuch as this people draw near me with their mouth, and with their lips do honour me, but have removed their heart far from me, and their fear toward me is taught by the precept of men: Therefore, behold, I will proceed to do a marvellous work among this people, even a marvellous work and a wonder: for the wisdom of their wise men shall perish, and the understanding of their prudent men shall be hid."
  },
  {
    "id": "isaiah-53-3-5",
    "order": 15,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 4,
    "reference": "Isaiah 53:3–5",
    "keyPhrase": "“Surely [Jesus Christ] hath borne our griefs, and carried our sorrows.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/isa/53?lang=eng&id=p3-p5#p3",
    "chunks": [
      {
        "verse": "3",
        "text": "He is despised and rejected of men; a man of sorrows, and acquainted with grief: and we hid as it were our faces from him; he was despised, and we esteemed him not."
      },
      {
        "verse": "4",
        "text": "¶ Surely he hath borne our griefs, and carried our sorrows: yet we did esteem him stricken, smitten of God, and afflicted."
      },
      {
        "verse": "5",
        "text": "But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed."
      }
    ],
    "text": "He is despised and rejected of men; a man of sorrows, and acquainted with grief: and we hid as it were our faces from him; he was despised, and we esteemed him not. ¶ Surely he hath borne our griefs, and carried our sorrows: yet we did esteem him stricken, smitten of God, and afflicted. But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed."
  },
  {
    "id": "isaiah-58-6-7",
    "order": 16,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 4,
    "reference": "Isaiah 58:6–7",
    "keyPhrase": "The blessings of a proper fast",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/isa/58?lang=eng&id=p6-p7#p6",
    "chunks": [
      {
        "verse": "6",
        "text": "Is not this the fast that I have chosen? to loose the bands of wickedness, to undo the heavy burdens, and to let the oppressed go free, and that ye break every yoke?"
      },
      {
        "verse": "7",
        "text": "Is it not to deal thy bread to the hungry, and that thou bring the poor that are cast out to thy house? when thou seest the naked, that thou cover him; and that thou hide not thyself from thine own flesh?"
      }
    ],
    "text": "Is not this the fast that I have chosen? to loose the bands of wickedness, to undo the heavy burdens, and to let the oppressed go free, and that ye break every yoke? Is it not to deal thy bread to the hungry, and that thou bring the poor that are cast out to thy house? when thou seest the naked, that thou cover him; and that thou hide not thyself from thine own flesh?"
  },
  {
    "id": "isaiah-58-13-14",
    "order": 17,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 5,
    "reference": "Isaiah 58:13–14",
    "keyPhrase": "“Turn away … from doing thy pleasure on my holy day; and call the sabbath a delight.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/isa/58?lang=eng&id=p13-p14#p13",
    "chunks": [
      {
        "verse": "13",
        "text": "¶ If thou turn away thy foot from the sabbath, from doing thy pleasure on my holy day; and call the sabbath a delight, the holy of the Lord, honourable; and shalt honour him, not doing thine own ways, nor finding thine own pleasure, nor speaking thine own words:"
      },
      {
        "verse": "14",
        "text": "Then shalt thou delight thyself in the Lord; and I will cause thee to ride upon the high places of the earth, and feed thee with the heritage of Jacob thy father: for the mouth of the Lord hath spoken it."
      }
    ],
    "text": "¶ If thou turn away thy foot from the sabbath, from doing thy pleasure on my holy day; and call the sabbath a delight, the holy of the Lord, honourable; and shalt honour him, not doing thine own ways, nor finding thine own pleasure, nor speaking thine own words: Then shalt thou delight thyself in the Lord; and I will cause thee to ride upon the high places of the earth, and feed thee with the heritage of Jacob thy father: for the mouth of the Lord hath spoken it."
  },
  {
    "id": "jeremiah-1-4-5",
    "order": 18,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 5,
    "reference": "Jeremiah 1:4–5",
    "keyPhrase": "“Before I formed thee in the belly … I ordained thee a prophet unto the nations.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/jer/1?lang=eng&id=p4-p5#p4",
    "chunks": [
      {
        "verse": "4",
        "text": "Then the word of the Lord came unto me, saying,"
      },
      {
        "verse": "5",
        "text": "Before I formed thee in the belly I knew thee; and before thou camest forth out of the womb I sanctified thee, and I ordained thee a prophet unto the nations."
      }
    ],
    "text": "Then the word of the Lord came unto me, saying, Before I formed thee in the belly I knew thee; and before thou camest forth out of the womb I sanctified thee, and I ordained thee a prophet unto the nations."
  },
  {
    "id": "ezekiel-3-16-17",
    "order": 19,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 5,
    "reference": "Ezekiel 3:16–17",
    "keyPhrase": "The prophet is “a watchman unto the house of Israel.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/ezek/3?lang=eng&id=p16-p17#p16",
    "chunks": [
      {
        "verse": "16",
        "text": "And it came to pass at the end of seven days, that the word of the Lord came unto me, saying,"
      },
      {
        "verse": "17",
        "text": "Son of man, I have made thee a watchman unto the house of Israel: therefore hear the word at my mouth, and give them warning from me."
      }
    ],
    "text": "And it came to pass at the end of seven days, that the word of the Lord came unto me, saying, Son of man, I have made thee a watchman unto the house of Israel: therefore hear the word at my mouth, and give them warning from me."
  },
  {
    "id": "ezekiel-37-15-17",
    "order": 20,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 5,
    "reference": "Ezekiel 37:15–17",
    "keyPhrase": "The Bible and the Book of Mormon “shall become one in thine hand.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/ezek/37?lang=eng&id=p15-p17#p15",
    "chunks": [
      {
        "verse": "15",
        "text": "¶ The word of the Lord came again unto me, saying,"
      },
      {
        "verse": "16",
        "text": "Moreover, thou son of man, take thee one stick, and write upon it, For Judah, and for the children of Israel his companions: then take another stick, and write upon it, For Joseph, the stick of Ephraim, and for all the house of Israel his companions:"
      },
      {
        "verse": "17",
        "text": "And join them one to another into one stick; and they shall become one in thine hand."
      }
    ],
    "text": "¶ The word of the Lord came again unto me, saying, Moreover, thou son of man, take thee one stick, and write upon it, For Judah, and for the children of Israel his companions: then take another stick, and write upon it, For Joseph, the stick of Ephraim, and for all the house of Israel his companions: And join them one to another into one stick; and they shall become one in thine hand."
  },
  {
    "id": "daniel-2-44-45",
    "order": 21,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 6,
    "reference": "Daniel 2:44–45",
    "keyPhrase": "God shall “set up a kingdom, which shall never be destroyed.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/dan/2?lang=eng&id=p44-p45#p44",
    "chunks": [
      {
        "verse": "44",
        "text": "And in the days of these kings shall the God of heaven set up a kingdom, which shall never be destroyed: and the kingdom shall not be left to other people, but it shall break in pieces and consume all these kingdoms, and it shall stand for ever."
      },
      {
        "verse": "45",
        "text": "Forasmuch as thou sawest that the stone was cut out of the mountain without hands, and that it brake in pieces the iron, the brass, the clay, the silver, and the gold; the great God hath made known to the king what shall come to pass hereafter: and the dream is certain, and the interpretation thereof sure."
      }
    ],
    "text": "And in the days of these kings shall the God of heaven set up a kingdom, which shall never be destroyed: and the kingdom shall not be left to other people, but it shall break in pieces and consume all these kingdoms, and it shall stand for ever. Forasmuch as thou sawest that the stone was cut out of the mountain without hands, and that it brake in pieces the iron, the brass, the clay, the silver, and the gold; the great God hath made known to the king what shall come to pass hereafter: and the dream is certain, and the interpretation thereof sure."
  },
  {
    "id": "amos-3-7",
    "order": 22,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 6,
    "reference": "Amos 3:7",
    "keyPhrase": "“The Lord God … revealeth his secret unto his servants the prophets.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/amos/3?lang=eng&id=p7#p7",
    "chunks": [
      {
        "verse": "7",
        "text": "Surely the Lord God will do nothing, but he revealeth his secret unto his servants the prophets."
      }
    ],
    "text": "Surely the Lord God will do nothing, but he revealeth his secret unto his servants the prophets."
  },
  {
    "id": "malachi-3-8-10",
    "order": 23,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 6,
    "reference": "Malachi 3:8–10",
    "keyPhrase": "The blessings of paying tithing",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/mal/3?lang=eng&id=p8-p10#p8",
    "chunks": [
      {
        "verse": "8",
        "text": "¶ Will a man rob God? Yet ye have robbed me. But ye say, Wherein have we robbed thee? In tithes and offerings."
      },
      {
        "verse": "9",
        "text": "Ye are cursed with a curse: for ye have robbed me, even this whole nation."
      },
      {
        "verse": "10",
        "text": "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the Lord of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it."
      }
    ],
    "text": "¶ Will a man rob God? Yet ye have robbed me. But ye say, Wherein have we robbed thee? In tithes and offerings. Ye are cursed with a curse: for ye have robbed me, even this whole nation. Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the Lord of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it."
  },
  {
    "id": "malachi-4-5-6",
    "order": 24,
    "course": "Old Testament",
    "courseId": "old-testament",
    "unit": 6,
    "reference": "Malachi 4:5–6",
    "keyPhrase": "Elijah “shall turn … the heart of the children to their fathers.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/ot/mal/4?lang=eng&id=p5-p6#p5",
    "chunks": [
      {
        "verse": "5",
        "text": "¶ Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the Lord:"
      },
      {
        "verse": "6",
        "text": "And he shall turn the heart of the fathers to the children, and the heart of the children to their fathers, lest I come and smite the earth with a curse."
      }
    ],
    "text": "¶ Behold, I will send you Elijah the prophet before the coming of the great and dreadful day of the Lord: And he shall turn the heart of the fathers to the children, and the heart of the children to their fathers, lest I come and smite the earth with a curse."
  },
  {
    "id": "matthew-5-14-16",
    "order": 25,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 7,
    "reference": "Matthew 5:14–16",
    "keyPhrase": "“Let your light so shine before men.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/matt/5?lang=eng&id=p14-p16#p14",
    "chunks": [
      {
        "verse": "14",
        "text": "Ye are the light of the world. A city that is set on an hill cannot be hid."
      },
      {
        "verse": "15",
        "text": "Neither do men light a candle, and put it under a bushel, but on a candlestick; and it giveth light unto all that are in the house."
      },
      {
        "verse": "16",
        "text": "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."
      }
    ],
    "text": "Ye are the light of the world. A city that is set on an hill cannot be hid. Neither do men light a candle, and put it under a bushel, but on a candlestick; and it giveth light unto all that are in the house. Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."
  },
  {
    "id": "matthew-11-28-30",
    "order": 26,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 7,
    "reference": "Matthew 11:28–30",
    "keyPhrase": "“Come unto me, all ye that labour and are heavy laden, and I will give you rest.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/matt/11?lang=eng&id=p28-p30#p28",
    "chunks": [
      {
        "verse": "28",
        "text": "¶ Come unto me, all ye that labour and are heavy laden, and I will give you rest."
      },
      {
        "verse": "29",
        "text": "Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls."
      },
      {
        "verse": "30",
        "text": "For my yoke is easy, and my burden is light."
      }
    ],
    "text": "¶ Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For my yoke is easy, and my burden is light."
  },
  {
    "id": "matthew-16-15-19",
    "order": 27,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 7,
    "reference": "Matthew 16:15–19",
    "keyPhrase": "Jesus said, “I will give unto thee the keys of the kingdom.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/matt/16?lang=eng&id=p15-p19#p15",
    "chunks": [
      {
        "verse": "15",
        "text": "He saith unto them, But whom say ye that I am?"
      },
      {
        "verse": "16",
        "text": "And Simon Peter answered and said, Thou art the Christ, the Son of the living God."
      },
      {
        "verse": "17",
        "text": "And Jesus answered and said unto him, Blessed art thou, Simon Bar-jona: for flesh and blood hath not revealed it unto thee, but my Father which is in heaven."
      },
      {
        "verse": "18",
        "text": "And I say also unto thee, That thou art Peter, and upon this rock I will build my church; and the gates of hell shall not prevail against it."
      },
      {
        "verse": "19",
        "text": "And I will give unto thee the keys of the kingdom of heaven: and whatsoever thou shalt bind on earth shall be bound in heaven: and whatsoever thou shalt loose on earth shall be loosed in heaven."
      }
    ],
    "text": "He saith unto them, But whom say ye that I am? And Simon Peter answered and said, Thou art the Christ, the Son of the living God. And Jesus answered and said unto him, Blessed art thou, Simon Bar-jona: for flesh and blood hath not revealed it unto thee, but my Father which is in heaven. And I say also unto thee, That thou art Peter, and upon this rock I will build my church; and the gates of hell shall not prevail against it. And I will give unto thee the keys of the kingdom of heaven: and whatsoever thou shalt bind on earth shall be bound in heaven: and whatsoever thou shalt loose on earth shall be loosed in heaven."
  },
  {
    "id": "matthew-22-36-39",
    "order": 28,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 7,
    "reference": "Matthew 22:36–39",
    "keyPhrase": "“Thou shalt love the Lord thy God. … Thou shalt love thy neighbour.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/matt/22?lang=eng&id=p36-p39#p36",
    "chunks": [
      {
        "verse": "36",
        "text": "Master, which is the great commandment in the law?"
      },
      {
        "verse": "37",
        "text": "Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind."
      },
      {
        "verse": "38",
        "text": "This is the first and great commandment."
      },
      {
        "verse": "39",
        "text": "And the second is like unto it, Thou shalt love thy neighbour as thyself."
      }
    ],
    "text": "Master, which is the great commandment in the law? Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind. This is the first and great commandment. And the second is like unto it, Thou shalt love thy neighbour as thyself."
  },
  {
    "id": "luke-2-10-12",
    "order": 29,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 8,
    "reference": "Luke 2:10–12",
    "keyPhrase": "“For unto you is born this day in the city of David a Saviour, which is Christ the Lord.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/luke/2?lang=eng&id=p10-p12#p10",
    "chunks": [
      {
        "verse": "10",
        "text": "And the angel said unto them, Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people."
      },
      {
        "verse": "11",
        "text": "For unto you is born this day in the city of David a Saviour, which is Christ the Lord."
      },
      {
        "verse": "12",
        "text": "And this shall be a sign unto you; Ye shall find the babe wrapped in swaddling clothes, lying in a manger."
      }
    ],
    "text": "And the angel said unto them, Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people. For unto you is born this day in the city of David a Saviour, which is Christ the Lord. And this shall be a sign unto you; Ye shall find the babe wrapped in swaddling clothes, lying in a manger."
  },
  {
    "id": "luke-22-19-20",
    "order": 30,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 8,
    "reference": "Luke 22:19–20",
    "keyPhrase": "Jesus Christ commanded, partake of the sacrament “in remembrance of me.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/luke/22?lang=eng&id=p19-p20#p19",
    "chunks": [
      {
        "verse": "19",
        "text": "¶ And he took bread, and gave thanks, and brake it, and gave unto them, saying, This is my body which is given for you: this do in remembrance of me."
      },
      {
        "verse": "20",
        "text": "Likewise also the cup after supper, saying, This cup is the new testament in my blood, which is shed for you."
      }
    ],
    "text": "¶ And he took bread, and gave thanks, and brake it, and gave unto them, saying, This is my body which is given for you: this do in remembrance of me. Likewise also the cup after supper, saying, This cup is the new testament in my blood, which is shed for you."
  },
  {
    "id": "luke-24-36-39",
    "order": 31,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 8,
    "reference": "Luke 24:36–39",
    "keyPhrase": "“For a spirit hath not flesh and bones, as ye see me have.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/luke/24?lang=eng&id=p36-p39#p36",
    "chunks": [
      {
        "verse": "36",
        "text": "¶ And as they thus spake, Jesus himself stood in the midst of them, and saith unto them, Peace be unto you."
      },
      {
        "verse": "37",
        "text": "But they were terrified and affrighted, and supposed that they had seen a spirit."
      },
      {
        "verse": "38",
        "text": "And he said unto them, Why are ye troubled? and why do thoughts arise in your hearts?"
      },
      {
        "verse": "39",
        "text": "Behold my hands and my feet, that it is I myself: handle me, and see; for a spirit hath not flesh and bones, as ye see me have."
      }
    ],
    "text": "¶ And as they thus spake, Jesus himself stood in the midst of them, and saith unto them, Peace be unto you. But they were terrified and affrighted, and supposed that they had seen a spirit. And he said unto them, Why are ye troubled? and why do thoughts arise in your hearts? Behold my hands and my feet, that it is I myself: handle me, and see; for a spirit hath not flesh and bones, as ye see me have."
  },
  {
    "id": "john-3-5",
    "order": 32,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 8,
    "reference": "John 3:5",
    "keyPhrase": "“Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/john/3?lang=eng&id=p5#p5",
    "chunks": [
      {
        "verse": "5",
        "text": "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God."
      }
    ],
    "text": "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God."
  },
  {
    "id": "john-3-16",
    "order": 33,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 9,
    "reference": "John 3:16",
    "keyPhrase": "“For God so loved the world, that he gave his only begotten Son.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/john/3?lang=eng&id=p16#p16",
    "chunks": [
      {
        "verse": "16",
        "text": "¶ For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
      }
    ],
    "text": "¶ For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
  },
  {
    "id": "john-7-17",
    "order": 34,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 9,
    "reference": "John 7:17",
    "keyPhrase": "“If any man will do his will, he shall know of the doctrine.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/john/7?lang=eng&id=p17#p17",
    "chunks": [
      {
        "verse": "17",
        "text": "If any man will do his will, he shall know of the doctrine, whether it be of God, or whether I speak of myself."
      }
    ],
    "text": "If any man will do his will, he shall know of the doctrine, whether it be of God, or whether I speak of myself."
  },
  {
    "id": "john-17-3",
    "order": 35,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 9,
    "reference": "John 17:3",
    "keyPhrase": "“And this is life eternal, that they might know thee the only true God, and Jesus Christ.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/john/17?lang=eng&id=p3#p3",
    "chunks": [
      {
        "verse": "3",
        "text": "And this is life eternal, that they might know thee the only true God, and Jesus Christ, whom thou hast sent."
      }
    ],
    "text": "And this is life eternal, that they might know thee the only true God, and Jesus Christ, whom thou hast sent."
  },
  {
    "id": "1-corinthians-6-19-20",
    "order": 36,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 9,
    "reference": "1 Corinthians 6:19–20",
    "keyPhrase": "“Your body is the temple of the Holy Ghost.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/1-cor/6?lang=eng&id=p19-p20#p19",
    "chunks": [
      {
        "verse": "19",
        "text": "What? know ye not that your body is the temple of the Holy Ghost which is in you, which ye have of God, and ye are not your own?"
      },
      {
        "verse": "20",
        "text": "For ye are bought with a price: therefore glorify God in your body, and in your spirit, which are God’s."
      }
    ],
    "text": "What? know ye not that your body is the temple of the Holy Ghost which is in you, which ye have of God, and ye are not your own? For ye are bought with a price: therefore glorify God in your body, and in your spirit, which are God’s."
  },
  {
    "id": "1-corinthians-11-11",
    "order": 37,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 10,
    "reference": "1 Corinthians 11:11",
    "keyPhrase": "“Neither is the man without the woman, neither the woman without the man, in the Lord.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/1-cor/11?lang=eng&id=p11#p11",
    "chunks": [
      {
        "verse": "11",
        "text": "Nevertheless neither is the man without the woman, neither the woman without the man, in the Lord."
      }
    ],
    "text": "Nevertheless neither is the man without the woman, neither the woman without the man, in the Lord."
  },
  {
    "id": "1-corinthians-15-20-22",
    "order": 38,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 10,
    "reference": "1 Corinthians 15:20–22",
    "keyPhrase": "“As in Adam all die, even so in Christ shall all be made alive.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/1-cor/15?lang=eng&id=p20-p22#p20",
    "chunks": [
      {
        "verse": "20",
        "text": "But now is Christ risen from the dead, and become the firstfruits of them that slept."
      },
      {
        "verse": "21",
        "text": "For since by man came death, by man came also the resurrection of the dead."
      },
      {
        "verse": "22",
        "text": "For as in Adam all die, even so in Christ shall all be made alive."
      }
    ],
    "text": "But now is Christ risen from the dead, and become the firstfruits of them that slept. For since by man came death, by man came also the resurrection of the dead. For as in Adam all die, even so in Christ shall all be made alive."
  },
  {
    "id": "1-corinthians-15-40-42",
    "order": 39,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 10,
    "reference": "1 Corinthians 15:40–42",
    "keyPhrase": "In the Resurrection, there are three degrees of glory.",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/1-cor/15?lang=eng&id=p40-p42#p40",
    "chunks": [
      {
        "verse": "40",
        "text": "There are also celestial bodies, and bodies terrestrial: but the glory of the celestial is one, and the glory of the terrestrial is another."
      },
      {
        "verse": "41",
        "text": "There is one glory of the sun, and another glory of the moon, and another glory of the stars: for one star differeth from another star in glory."
      },
      {
        "verse": "42",
        "text": "So also is the resurrection of the dead. It is sown in corruption; it is raised in incorruption:"
      }
    ],
    "text": "There are also celestial bodies, and bodies terrestrial: but the glory of the celestial is one, and the glory of the terrestrial is another. There is one glory of the sun, and another glory of the moon, and another glory of the stars: for one star differeth from another star in glory. So also is the resurrection of the dead. It is sown in corruption; it is raised in incorruption:"
  },
  {
    "id": "ephesians-1-10",
    "order": 40,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 10,
    "reference": "Ephesians 1:10",
    "keyPhrase": "“In the dispensation of the fulness of times he might gather together in one all things in Christ.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/eph/1?lang=eng&id=p10#p10",
    "chunks": [
      {
        "verse": "10",
        "text": "That in the dispensation of the fulness of times he might gather together in one all things in Christ, both which are in heaven, and which are on earth; even in him:"
      }
    ],
    "text": "That in the dispensation of the fulness of times he might gather together in one all things in Christ, both which are in heaven, and which are on earth; even in him:"
  },
  {
    "id": "ephesians-2-19-20",
    "order": 41,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 11,
    "reference": "Ephesians 2:19–20",
    "keyPhrase": "The Church is “built upon the foundation of the apostles and prophets, Jesus Christ himself being the chief corner stone.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/eph/2?lang=eng&id=p19-p20#p19",
    "chunks": [
      {
        "verse": "19",
        "text": "Now therefore ye are no more strangers and foreigners, but fellowcitizens with the saints, and of the household of God;"
      },
      {
        "verse": "20",
        "text": "And are built upon the foundation of the apostles and prophets, Jesus Christ himself being the chief corner stone;"
      }
    ],
    "text": "Now therefore ye are no more strangers and foreigners, but fellowcitizens with the saints, and of the household of God; And are built upon the foundation of the apostles and prophets, Jesus Christ himself being the chief corner stone;"
  },
  {
    "id": "2-thessalonians-2-1-3",
    "order": 42,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 11,
    "reference": "2 Thessalonians 2:1–3",
    "keyPhrase": "“The day of Christ … shall not come, except there come a falling away first.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/2-thes/2?lang=eng&id=p1-p3#p1",
    "chunks": [
      {
        "verse": "1",
        "text": "Now we beseech you, brethren, by the coming of our Lord Jesus Christ, and by our gathering together unto him,"
      },
      {
        "verse": "2",
        "text": "That ye be not soon shaken in mind, or be troubled, neither by spirit, nor by word, nor by letter as from us, as that the day of Christ is at hand."
      },
      {
        "verse": "3",
        "text": "Let no man deceive you by any means: for that day shall not come, except there come a falling away first, and that man of sin be revealed, the son of perdition;"
      }
    ],
    "text": "Now we beseech you, brethren, by the coming of our Lord Jesus Christ, and by our gathering together unto him, That ye be not soon shaken in mind, or be troubled, neither by spirit, nor by word, nor by letter as from us, as that the day of Christ is at hand. Let no man deceive you by any means: for that day shall not come, except there come a falling away first, and that man of sin be revealed, the son of perdition;"
  },
  {
    "id": "2-timothy-3-15-17",
    "order": 43,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 11,
    "reference": "2 Timothy 3:15–17",
    "keyPhrase": "“The holy scriptures … are able to make thee wise unto salvation.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/2-tim/3?lang=eng&id=p15-p17#p15",
    "chunks": [
      {
        "verse": "15",
        "text": "And that from a child thou hast known the holy scriptures, which are able to make thee wise unto salvation through faith which is in Christ Jesus."
      },
      {
        "verse": "16",
        "text": "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness:"
      },
      {
        "verse": "17",
        "text": "That the man of God may be perfect, throughly furnished unto all good works."
      }
    ],
    "text": "And that from a child thou hast known the holy scriptures, which are able to make thee wise unto salvation through faith which is in Christ Jesus. All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness: That the man of God may be perfect, throughly furnished unto all good works."
  },
  {
    "id": "hebrews-12-9",
    "order": 44,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 11,
    "reference": "Hebrews 12:9",
    "keyPhrase": "Heavenly Father is “the Father of spirits.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/heb/12?lang=eng&id=p9#p9",
    "chunks": [
      {
        "verse": "9",
        "text": "Furthermore we have had fathers of our flesh which corrected us, and we gave them reverence: shall we not much rather be in subjection unto the Father of spirits, and live?"
      }
    ],
    "text": "Furthermore we have had fathers of our flesh which corrected us, and we gave them reverence: shall we not much rather be in subjection unto the Father of spirits, and live?"
  },
  {
    "id": "james-1-5-6",
    "order": 45,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 12,
    "reference": "James 1:5–6",
    "keyPhrase": "“If any of you lack wisdom, let him ask of God.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/james/1?lang=eng&id=p5-p6#p5",
    "chunks": [
      {
        "verse": "5",
        "text": "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him."
      },
      {
        "verse": "6",
        "text": "But let him ask in faith, nothing wavering. For he that wavereth is like a wave of the sea driven with the wind and tossed."
      }
    ],
    "text": "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him. But let him ask in faith, nothing wavering. For he that wavereth is like a wave of the sea driven with the wind and tossed."
  },
  {
    "id": "james-2-17-18",
    "order": 46,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 12,
    "reference": "James 2:17–18",
    "keyPhrase": "“Faith, if it hath not works, is dead.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/james/2?lang=eng&id=p17-p18#p17",
    "chunks": [
      {
        "verse": "17",
        "text": "Even so faith, if it hath not works, is dead, being alone."
      },
      {
        "verse": "18",
        "text": "Yea, a man may say, Thou hast faith, and I have works: shew me thy faith without thy works, and I will shew thee my faith by my works."
      }
    ],
    "text": "Even so faith, if it hath not works, is dead, being alone. Yea, a man may say, Thou hast faith, and I have works: shew me thy faith without thy works, and I will shew thee my faith by my works."
  },
  {
    "id": "1-peter-4-6",
    "order": 47,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 12,
    "reference": "1 Peter 4:6",
    "keyPhrase": "“The gospel [was] preached also to them that are dead.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/1-pet/4?lang=eng&id=p6#p6",
    "chunks": [
      {
        "verse": "6",
        "text": "For for this cause was the gospel preached also to them that are dead, that they might be judged according to men in the flesh, but live according to God in the spirit."
      }
    ],
    "text": "For for this cause was the gospel preached also to them that are dead, that they might be judged according to men in the flesh, but live according to God in the spirit."
  },
  {
    "id": "revelation-20-12",
    "order": 48,
    "course": "New Testament",
    "courseId": "new-testament",
    "unit": 12,
    "reference": "Revelation 20:12",
    "keyPhrase": "“And the dead were judged … according to their works.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/nt/rev/20?lang=eng&id=p12#p12",
    "chunks": [
      {
        "verse": "12",
        "text": "And I saw the dead, small and great, stand before God; and the books were opened: and another book was opened, which is the book of life: and the dead were judged out of those things which were written in the books, according to their works."
      }
    ],
    "text": "And I saw the dead, small and great, stand before God; and the books were opened: and another book was opened, which is the book of life: and the dead were judged out of those things which were written in the books, according to their works."
  },
  {
    "id": "1-nephi-3-7",
    "order": 49,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 13,
    "reference": "1 Nephi 3:7",
    "keyPhrase": "“I will go and do the things which the Lord hath commanded.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/3?lang=eng&id=p7#p7",
    "chunks": [
      {
        "verse": "7",
        "text": "And it came to pass that I, Nephi, said unto my father: I will go and do the things which the Lord hath commanded, for I know that the Lord giveth no commandments unto the children of men, save he shall prepare a way for them that they may accomplish the thing which he commandeth them."
      }
    ],
    "text": "And it came to pass that I, Nephi, said unto my father: I will go and do the things which the Lord hath commanded, for I know that the Lord giveth no commandments unto the children of men, save he shall prepare a way for them that they may accomplish the thing which he commandeth them."
  },
  {
    "id": "2-nephi-2-25",
    "order": 50,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 13,
    "reference": "2 Nephi 2:25",
    "keyPhrase": "“Adam fell that men might be; and men are, that they might have joy.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/2?lang=eng&id=p25#p25",
    "chunks": [
      {
        "verse": "25",
        "text": "Adam fell that men might be; and men are, that they might have joy."
      }
    ],
    "text": "Adam fell that men might be; and men are, that they might have joy."
  },
  {
    "id": "2-nephi-2-27",
    "order": 51,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 13,
    "reference": "2 Nephi 2:27",
    "keyPhrase": "“They are free to choose liberty and eternal life … or … captivity and death.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/2?lang=eng&id=p27#p27",
    "chunks": [
      {
        "verse": "27",
        "text": "Wherefore, men are free according to the flesh; and all things are given them which are expedient unto man. And they are free to choose liberty and eternal life, through the great Mediator of all men, or to choose captivity and death, according to the captivity and power of the devil; for he seeketh that all men might be miserable like unto himself."
      }
    ],
    "text": "Wherefore, men are free according to the flesh; and all things are given them which are expedient unto man. And they are free to choose liberty and eternal life, through the great Mediator of all men, or to choose captivity and death, according to the captivity and power of the devil; for he seeketh that all men might be miserable like unto himself."
  },
  {
    "id": "2-nephi-26-33",
    "order": 52,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 13,
    "reference": "2 Nephi 26:33",
    "keyPhrase": "“All are alike unto God.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/26?lang=eng&id=p33#p33",
    "chunks": [
      {
        "verse": "33",
        "text": "For none of these iniquities come of the Lord; for he doeth that which is good among the children of men; and he doeth nothing save it be plain unto the children of men; and he inviteth them all to come unto him and partake of his goodness; and he denieth none that come unto him, black and white, bond and free, male and female; and he remembereth the heathen; and all are alike unto God, both Jew and Gentile."
      }
    ],
    "text": "For none of these iniquities come of the Lord; for he doeth that which is good among the children of men; and he doeth nothing save it be plain unto the children of men; and he inviteth them all to come unto him and partake of his goodness; and he denieth none that come unto him, black and white, bond and free, male and female; and he remembereth the heathen; and all are alike unto God, both Jew and Gentile."
  },
  {
    "id": "2-nephi-28-30",
    "order": 53,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 14,
    "reference": "2 Nephi 28:30",
    "keyPhrase": "God “will give unto the children of men line upon line, precept upon precept.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/28?lang=eng&id=p30#p30",
    "chunks": [
      {
        "verse": "30",
        "text": "For behold, thus saith the Lord God: I will give unto the children of men line upon line, precept upon precept, here a little and there a little; and blessed are those who hearken unto my precepts, and lend an ear unto my counsel, for they shall learn wisdom; for unto him that receiveth I will give more; and from them that shall say, We have enough, from them shall be taken away even that which they have."
      }
    ],
    "text": "For behold, thus saith the Lord God: I will give unto the children of men line upon line, precept upon precept, here a little and there a little; and blessed are those who hearken unto my precepts, and lend an ear unto my counsel, for they shall learn wisdom; for unto him that receiveth I will give more; and from them that shall say, We have enough, from them shall be taken away even that which they have."
  },
  {
    "id": "2-nephi-32-3",
    "order": 54,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 14,
    "reference": "2 Nephi 32:3",
    "keyPhrase": "“Feast upon the words of Christ; for behold, the words of Christ will tell you all things what ye should do.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/32?lang=eng&id=p3#p3",
    "chunks": [
      {
        "verse": "3",
        "text": "Angels speak by the power of the Holy Ghost; wherefore, they speak the words of Christ. Wherefore, I said unto you, feast upon the words of Christ; for behold, the words of Christ will tell you all things what ye should do."
      }
    ],
    "text": "Angels speak by the power of the Holy Ghost; wherefore, they speak the words of Christ. Wherefore, I said unto you, feast upon the words of Christ; for behold, the words of Christ will tell you all things what ye should do."
  },
  {
    "id": "2-nephi-32-8-9",
    "order": 55,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 14,
    "reference": "2 Nephi 32:8–9",
    "keyPhrase": "“Ye must pray always.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/2-ne/32?lang=eng&id=p8-p9#p8",
    "chunks": [
      {
        "verse": "8",
        "text": "And now, my beloved brethren, I perceive that ye ponder still in your hearts; and it grieveth me that I must speak concerning this thing. For if ye would hearken unto the Spirit which teacheth a man to pray, ye would know that ye must pray; for the evil spirit teacheth not a man to pray, but teacheth him that he must not pray."
      },
      {
        "verse": "9",
        "text": "But behold, I say unto you that ye must pray always, and not faint; that ye must not perform any thing unto the Lord save in the first place ye shall pray unto the Father in the name of Christ, that he will consecrate thy performance unto thee, that thy performance may be for the welfare of thy soul."
      }
    ],
    "text": "And now, my beloved brethren, I perceive that ye ponder still in your hearts; and it grieveth me that I must speak concerning this thing. For if ye would hearken unto the Spirit which teacheth a man to pray, ye would know that ye must pray; for the evil spirit teacheth not a man to pray, but teacheth him that he must not pray. But behold, I say unto you that ye must pray always, and not faint; that ye must not perform any thing unto the Lord save in the first place ye shall pray unto the Father in the name of Christ, that he will consecrate thy performance unto thee, that thy performance may be for the welfare of thy soul."
  },
  {
    "id": "mosiah-2-17",
    "order": 56,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 14,
    "reference": "Mosiah 2:17",
    "keyPhrase": "“When ye are in the service of your fellow beings ye are only in the service of your God.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/2?lang=eng&id=p17#p17",
    "chunks": [
      {
        "verse": "17",
        "text": "And behold, I tell you these things that ye may learn wisdom; that ye may learn that when ye are in the service of your fellow beings ye are only in the service of your God."
      }
    ],
    "text": "And behold, I tell you these things that ye may learn wisdom; that ye may learn that when ye are in the service of your fellow beings ye are only in the service of your God."
  },
  {
    "id": "mosiah-2-41",
    "order": 57,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 15,
    "reference": "Mosiah 2:41",
    "keyPhrase": "“Those that keep the commandments of God … are blessed in all things.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/2?lang=eng&id=p41#p41",
    "chunks": [
      {
        "verse": "41",
        "text": "And moreover, I would desire that ye should consider on the blessed and happy state of those that keep the commandments of God. For behold, they are blessed in all things, both temporal and spiritual; and if they hold out faithful to the end they are received into heaven, that thereby they may dwell with God in a state of never-ending happiness. O remember, remember that these things are true; for the Lord God hath spoken it."
      }
    ],
    "text": "And moreover, I would desire that ye should consider on the blessed and happy state of those that keep the commandments of God. For behold, they are blessed in all things, both temporal and spiritual; and if they hold out faithful to the end they are received into heaven, that thereby they may dwell with God in a state of never-ending happiness. O remember, remember that these things are true; for the Lord God hath spoken it."
  },
  {
    "id": "mosiah-3-19",
    "order": 58,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 15,
    "reference": "Mosiah 3:19",
    "keyPhrase": "“[Put] off the natural man and [become] a saint through the atonement of Christ the Lord.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/3?lang=eng&id=p19#p19",
    "chunks": [
      {
        "verse": "19",
        "text": "For the natural man is an enemy to God, and has been from the fall of Adam, and will be, forever and ever, unless he yields to the enticings of the Holy Spirit, and putteth off the natural man and becometh a saint through the atonement of Christ the Lord, and becometh as a child, submissive, meek, humble, patient, full of love, willing to submit to all things which the Lord seeth fit to inflict upon him, even as a child doth submit to his father."
      }
    ],
    "text": "For the natural man is an enemy to God, and has been from the fall of Adam, and will be, forever and ever, unless he yields to the enticings of the Holy Spirit, and putteth off the natural man and becometh a saint through the atonement of Christ the Lord, and becometh as a child, submissive, meek, humble, patient, full of love, willing to submit to all things which the Lord seeth fit to inflict upon him, even as a child doth submit to his father."
  },
  {
    "id": "mosiah-4-9",
    "order": 59,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 15,
    "reference": "Mosiah 4:9",
    "keyPhrase": "“Believe in God; … believe that he has all wisdom.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/4?lang=eng&id=p9#p9",
    "chunks": [
      {
        "verse": "9",
        "text": "Believe in God; believe that he is, and that he created all things, both in heaven and in earth; believe that he has all wisdom, and all power, both in heaven and in earth; believe that man doth not comprehend all the things which the Lord can comprehend."
      }
    ],
    "text": "Believe in God; believe that he is, and that he created all things, both in heaven and in earth; believe that he has all wisdom, and all power, both in heaven and in earth; believe that man doth not comprehend all the things which the Lord can comprehend."
  },
  {
    "id": "mosiah-18-8-10",
    "order": 60,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 15,
    "reference": "Mosiah 18:8–10",
    "keyPhrase": "Be “baptized in the name of the Lord, as a witness … that ye have entered into a covenant with him.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/18?lang=eng&id=p8-p10#p8",
    "chunks": [
      {
        "verse": "8",
        "text": "And it came to pass that he said unto them: Behold, here are the waters of Mormon (for thus were they called) and now, as ye are desirous to come into the fold of God, and to be called his people, and are willing to bear one another’s burdens, that they may be light;"
      },
      {
        "verse": "9",
        "text": "Yea, and are willing to mourn with those that mourn; yea, and comfort those that stand in need of comfort, and to stand as witnesses of God at all times and in all things, and in all places that ye may be in, even until death, that ye may be redeemed of God, and be numbered with those of the first resurrection, that ye may have eternal life—"
      },
      {
        "verse": "10",
        "text": "Now I say unto you, if this be the desire of your hearts, what have you against being baptized in the name of the Lord, as a witness before him that ye have entered into a covenant with him, that ye will serve him and keep his commandments, that he may pour out his Spirit more abundantly upon you?"
      }
    ],
    "text": "And it came to pass that he said unto them: Behold, here are the waters of Mormon (for thus were they called) and now, as ye are desirous to come into the fold of God, and to be called his people, and are willing to bear one another’s burdens, that they may be light; Yea, and are willing to mourn with those that mourn; yea, and comfort those that stand in need of comfort, and to stand as witnesses of God at all times and in all things, and in all places that ye may be in, even until death, that ye may be redeemed of God, and be numbered with those of the first resurrection, that ye may have eternal life— Now I say unto you, if this be the desire of your hearts, what have you against being baptized in the name of the Lord, as a witness before him that ye have entered into a covenant with him, that ye will serve him and keep his commandments, that he may pour out his Spirit more abundantly upon you?"
  },
  {
    "id": "alma-7-11-13",
    "order": 61,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 16,
    "reference": "Alma 7:11–13",
    "keyPhrase": "“And he shall go forth, suffering pains and afflictions and temptations of every kind.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/7?lang=eng&id=p11-p13#p11",
    "chunks": [
      {
        "verse": "11",
        "text": "And he shall go forth, suffering pains and afflictions and temptations of every kind; and this that the word might be fulfilled which saith he will take upon him the pains and the sicknesses of his people."
      },
      {
        "verse": "12",
        "text": "And he will take upon him death, that he may loose the bands of death which bind his people; and he will take upon him their infirmities, that his bowels may be filled with mercy, according to the flesh, that he may know according to the flesh how to succor his people according to their infirmities."
      },
      {
        "verse": "13",
        "text": "Now the Spirit knoweth all things; nevertheless the Son of God suffereth according to the flesh that he might take upon him the sins of his people, that he might blot out their transgressions according to the power of his deliverance; and now behold, this is the testimony which is in me."
      }
    ],
    "text": "And he shall go forth, suffering pains and afflictions and temptations of every kind; and this that the word might be fulfilled which saith he will take upon him the pains and the sicknesses of his people. And he will take upon him death, that he may loose the bands of death which bind his people; and he will take upon him their infirmities, that his bowels may be filled with mercy, according to the flesh, that he may know according to the flesh how to succor his people according to their infirmities. Now the Spirit knoweth all things; nevertheless the Son of God suffereth according to the flesh that he might take upon him the sins of his people, that he might blot out their transgressions according to the power of his deliverance; and now behold, this is the testimony which is in me."
  },
  {
    "id": "alma-34-9-10",
    "order": 62,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 16,
    "reference": "Alma 34:9–10",
    "keyPhrase": "“There must be an atonement made, … an infinite and eternal sacrifice.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/34?lang=eng&id=p9-p10#p9",
    "chunks": [
      {
        "verse": "9",
        "text": "For it is expedient that an atonement should be made; for according to the great plan of the Eternal God there must be an atonement made, or else all mankind must unavoidably perish; yea, all are hardened; yea, all are fallen and are lost, and must perish except it be through the atonement which it is expedient should be made."
      },
      {
        "verse": "10",
        "text": "For it is expedient that there should be a great and last sacrifice; yea, not a sacrifice of man, neither of beast, neither of any manner of fowl; for it shall not be a human sacrifice; but it must be an infinite and eternal sacrifice."
      }
    ],
    "text": "For it is expedient that an atonement should be made; for according to the great plan of the Eternal God there must be an atonement made, or else all mankind must unavoidably perish; yea, all are hardened; yea, all are fallen and are lost, and must perish except it be through the atonement which it is expedient should be made. For it is expedient that there should be a great and last sacrifice; yea, not a sacrifice of man, neither of beast, neither of any manner of fowl; for it shall not be a human sacrifice; but it must be an infinite and eternal sacrifice."
  },
  {
    "id": "alma-39-9",
    "order": 63,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 16,
    "reference": "Alma 39:9",
    "keyPhrase": "“Go no more after the lusts of your eyes.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/39?lang=eng&id=p9#p9",
    "chunks": [
      {
        "verse": "9",
        "text": "Now my son, I would that ye should repent and forsake your sins, and go no more after the lusts of your eyes, but cross yourself in all these things; for except ye do this ye can in nowise inherit the kingdom of God. Oh, remember, and take it upon you, and cross yourself in these things."
      }
    ],
    "text": "Now my son, I would that ye should repent and forsake your sins, and go no more after the lusts of your eyes, but cross yourself in all these things; for except ye do this ye can in nowise inherit the kingdom of God. Oh, remember, and take it upon you, and cross yourself in these things."
  },
  {
    "id": "alma-41-10",
    "order": 64,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 16,
    "reference": "Alma 41:10",
    "keyPhrase": "“Wickedness never was happiness.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/41?lang=eng&id=p10#p10",
    "chunks": [
      {
        "verse": "10",
        "text": "Do not suppose, because it has been spoken concerning restoration, that ye shall be restored from sin to happiness. Behold, I say unto you, wickedness never was happiness."
      }
    ],
    "text": "Do not suppose, because it has been spoken concerning restoration, that ye shall be restored from sin to happiness. Behold, I say unto you, wickedness never was happiness."
  },
  {
    "id": "helaman-5-12",
    "order": 65,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 17,
    "reference": "Helaman 5:12",
    "keyPhrase": "“It is upon the rock of our Redeemer … that ye must build your foundation.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/hel/5?lang=eng&id=p12#p12",
    "chunks": [
      {
        "verse": "12",
        "text": "And now, my sons, remember, remember that it is upon the rock of our Redeemer, who is Christ, the Son of God, that ye must build your foundation; that when the devil shall send forth his mighty winds, yea, his shafts in the whirlwind, yea, when all his hail and his mighty storm shall beat upon you, it shall have no power over you to drag you down to the gulf of misery and endless wo, because of the rock upon which ye are built, which is a sure foundation, a foundation whereon if men build they cannot fall."
      }
    ],
    "text": "And now, my sons, remember, remember that it is upon the rock of our Redeemer, who is Christ, the Son of God, that ye must build your foundation; that when the devil shall send forth his mighty winds, yea, his shafts in the whirlwind, yea, when all his hail and his mighty storm shall beat upon you, it shall have no power over you to drag you down to the gulf of misery and endless wo, because of the rock upon which ye are built, which is a sure foundation, a foundation whereon if men build they cannot fall."
  },
  {
    "id": "3-nephi-11-10-11",
    "order": 66,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 17,
    "reference": "3 Nephi 11:10–11",
    "keyPhrase": "“I have suffered the will of the Father in all things from the beginning.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/11?lang=eng&id=p10-p11#p10",
    "chunks": [
      {
        "verse": "10",
        "text": "Behold, I am Jesus Christ, whom the prophets testified shall come into the world."
      },
      {
        "verse": "11",
        "text": "And behold, I am the light and the life of the world; and I have drunk out of that bitter cup which the Father hath given me, and have glorified the Father in taking upon me the sins of the world, in the which I have suffered the will of the Father in all things from the beginning."
      }
    ],
    "text": "Behold, I am Jesus Christ, whom the prophets testified shall come into the world. And behold, I am the light and the life of the world; and I have drunk out of that bitter cup which the Father hath given me, and have glorified the Father in taking upon me the sins of the world, in the which I have suffered the will of the Father in all things from the beginning."
  },
  {
    "id": "3-nephi-12-48",
    "order": 67,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 17,
    "reference": "3 Nephi 12:48",
    "keyPhrase": "“Be perfect even as I, or your Father who is in heaven is perfect.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/12?lang=eng&id=p48#p48",
    "chunks": [
      {
        "verse": "48",
        "text": "Therefore I would that ye should be perfect even as I, or your Father who is in heaven is perfect."
      }
    ],
    "text": "Therefore I would that ye should be perfect even as I, or your Father who is in heaven is perfect."
  },
  {
    "id": "3-nephi-27-20",
    "order": 68,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 17,
    "reference": "3 Nephi 27:20",
    "keyPhrase": "“Come unto me and be baptized … that ye may be sanctified by the reception of the Holy Ghost.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/3-ne/27?lang=eng&id=p20#p20",
    "chunks": [
      {
        "verse": "20",
        "text": "Now this is the commandment: Repent, all ye ends of the earth, and come unto me and be baptized in my name, that ye may be sanctified by the reception of the Holy Ghost, that ye may stand spotless before me at the last day."
      }
    ],
    "text": "Now this is the commandment: Repent, all ye ends of the earth, and come unto me and be baptized in my name, that ye may be sanctified by the reception of the Holy Ghost, that ye may stand spotless before me at the last day."
  },
  {
    "id": "ether-12-6",
    "order": 69,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 18,
    "reference": "Ether 12:6",
    "keyPhrase": "“Ye receive no witness until after the trial of your faith.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/12?lang=eng&id=p6#p6",
    "chunks": [
      {
        "verse": "6",
        "text": "And now, I, Moroni, would speak somewhat concerning these things; I would show unto the world that faith is things which are hoped for and not seen; wherefore, dispute not because ye see not, for ye receive no witness until after the trial of your faith."
      }
    ],
    "text": "And now, I, Moroni, would speak somewhat concerning these things; I would show unto the world that faith is things which are hoped for and not seen; wherefore, dispute not because ye see not, for ye receive no witness until after the trial of your faith."
  },
  {
    "id": "ether-12-27",
    "order": 70,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 18,
    "reference": "Ether 12:27",
    "keyPhrase": "“If men come unto me … then will I make weak things become strong unto them.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/ether/12?lang=eng&id=p27#p27",
    "chunks": [
      {
        "verse": "27",
        "text": "And if men come unto me I will show unto them their weakness. I give unto men weakness that they may be humble; and my grace is sufficient for all men that humble themselves before me; for if they humble themselves before me, and have faith in me, then will I make weak things become strong unto them."
      }
    ],
    "text": "And if men come unto me I will show unto them their weakness. I give unto men weakness that they may be humble; and my grace is sufficient for all men that humble themselves before me; for if they humble themselves before me, and have faith in me, then will I make weak things become strong unto them."
  },
  {
    "id": "moroni-7-45-48",
    "order": 71,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 18,
    "reference": "Moroni 7:45–48",
    "keyPhrase": "“Charity is the pure love of Christ.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/7?lang=eng&id=p45-p48#p45",
    "chunks": [
      {
        "verse": "45",
        "text": "And charity suffereth long, and is kind, and envieth not, and is not puffed up, seeketh not her own, is not easily provoked, thinketh no evil, and rejoiceth not in iniquity but rejoiceth in the truth, beareth all things, believeth all things, hopeth all things, endureth all things."
      },
      {
        "verse": "46",
        "text": "Wherefore, my beloved brethren, if ye have not charity, ye are nothing, for charity never faileth. Wherefore, cleave unto charity, which is the greatest of all, for all things must fail—"
      },
      {
        "verse": "47",
        "text": "But charity is the pure love of Christ, and it endureth forever; and whoso is found possessed of it at the last day, it shall be well with him."
      },
      {
        "verse": "48",
        "text": "Wherefore, my beloved brethren, pray unto the Father with all the energy of heart, that ye may be filled with this love, which he hath bestowed upon all who are true followers of his Son, Jesus Christ; that ye may become the sons of God; that when he shall appear we shall be like him, for we shall see him as he is; that we may have this hope; that we may be purified even as he is pure. Amen."
      }
    ],
    "text": "And charity suffereth long, and is kind, and envieth not, and is not puffed up, seeketh not her own, is not easily provoked, thinketh no evil, and rejoiceth not in iniquity but rejoiceth in the truth, beareth all things, believeth all things, hopeth all things, endureth all things. Wherefore, my beloved brethren, if ye have not charity, ye are nothing, for charity never faileth. Wherefore, cleave unto charity, which is the greatest of all, for all things must fail— But charity is the pure love of Christ, and it endureth forever; and whoso is found possessed of it at the last day, it shall be well with him. Wherefore, my beloved brethren, pray unto the Father with all the energy of heart, that ye may be filled with this love, which he hath bestowed upon all who are true followers of his Son, Jesus Christ; that ye may become the sons of God; that when he shall appear we shall be like him, for we shall see him as he is; that we may have this hope; that we may be purified even as he is pure. Amen."
  },
  {
    "id": "moroni-10-4-5",
    "order": 72,
    "course": "Book of Mormon",
    "courseId": "book-of-mormon",
    "unit": 18,
    "reference": "Moroni 10:4–5",
    "keyPhrase": "“Ask with a sincere heart, with real intent, having faith in Christ … [and] by the power of the Holy Ghost ye may know the truth of all things.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/bofm/moro/10?lang=eng&id=p4-p5#p4",
    "chunks": [
      {
        "verse": "4",
        "text": "And when ye shall receive these things, I would exhort you that ye would ask God, the Eternal Father, in the name of Christ, if these things are not true; and if ye shall ask with a sincere heart, with real intent, having faith in Christ, he will manifest the truth of it unto you, by the power of the Holy Ghost."
      },
      {
        "verse": "5",
        "text": "And by the power of the Holy Ghost ye may know the truth of all things."
      }
    ],
    "text": "And when ye shall receive these things, I would exhort you that ye would ask God, the Eternal Father, in the name of Christ, if these things are not true; and if ye shall ask with a sincere heart, with real intent, having faith in Christ, he will manifest the truth of it unto you, by the power of the Holy Ghost. And by the power of the Holy Ghost ye may know the truth of all things."
  },
  {
    "id": "joseph-smith-history-1-15-20",
    "order": 73,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 19,
    "reference": "Joseph Smith—History 1:15–20",
    "keyPhrase": "Joseph Smith “saw two Personages, whose brightness and glory defy all description.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/pgp/js-h/1?lang=eng&id=p15-p20#p15",
    "chunks": [
      {
        "verse": "15",
        "text": "After I had retired to the place where I had previously designed to go, having looked around me, and finding myself alone, I kneeled down and began to offer up the desires of my heart to God. I had scarcely done so, when immediately I was seized upon by some power which entirely overcame me, and had such an astonishing influence over me as to bind my tongue so that I could not speak. Thick darkness gathered around me, and it seemed to me for a time as if I were doomed to sudden destruction."
      },
      {
        "verse": "16",
        "text": "But, exerting all my powers to call upon God to deliver me out of the power of this enemy which had seized upon me, and at the very moment when I was ready to sink into despair and abandon myself to destruction—not to an imaginary ruin, but to the power of some actual being from the unseen world, who had such marvelous power as I had never before felt in any being—just at this moment of great alarm, I saw a pillar of light exactly over my head, above the brightness of the sun, which descended gradually until it fell upon me."
      },
      {
        "verse": "17",
        "text": "It no sooner appeared than I found myself delivered from the enemy which held me bound. When the light rested upon me I saw two Personages, whose brightness and glory defy all description, standing above me in the air. One of them spake unto me, calling me by name and said, pointing to the other—This is My Beloved Son. Hear Him!"
      },
      {
        "verse": "18",
        "text": "My object in going to inquire of the Lord was to know which of all the sects was right, that I might know which to join. No sooner, therefore, did I get possession of myself, so as to be able to speak, than I asked the Personages who stood above me in the light, which of all the sects was right (for at this time it had never entered into my heart that all were wrong)—and which I should join."
      },
      {
        "verse": "19",
        "text": "I was answered that I must join none of them, for they were all wrong; and the Personage who addressed me said that all their creeds were an abomination in his sight; that those professors were all corrupt; that: “they draw near to me with their lips, but their hearts are far from me, they teach for doctrines the commandments of men, having a form of godliness, but they deny the power thereof.”"
      },
      {
        "verse": "20",
        "text": "He again forbade me to join with any of them; and many other things did he say unto me, which I cannot write at this time. When I came to myself again, I found myself lying on my back, looking up into heaven. When the light had departed, I had no strength; but soon recovering in some degree, I went home. And as I leaned up to the fireplace, mother inquired what the matter was. I replied, “Never mind, all is well—I am well enough off.” I then said to my mother, “I have learned for myself that Presbyterianism is not true.” It seems as though the adversary was aware, at a very early period of my life, that I was destined to prove a disturber and an annoyer of his kingdom; else why should the powers of darkness combine against me? Why the opposition and persecution that arose against me, almost in my infancy?"
      }
    ],
    "text": "After I had retired to the place where I had previously designed to go, having looked around me, and finding myself alone, I kneeled down and began to offer up the desires of my heart to God. I had scarcely done so, when immediately I was seized upon by some power which entirely overcame me, and had such an astonishing influence over me as to bind my tongue so that I could not speak. Thick darkness gathered around me, and it seemed to me for a time as if I were doomed to sudden destruction. But, exerting all my powers to call upon God to deliver me out of the power of this enemy which had seized upon me, and at the very moment when I was ready to sink into despair and abandon myself to destruction—not to an imaginary ruin, but to the power of some actual being from the unseen world, who had such marvelous power as I had never before felt in any being—just at this moment of great alarm, I saw a pillar of light exactly over my head, above the brightness of the sun, which descended gradually until it fell upon me. It no sooner appeared than I found myself delivered from the enemy which held me bound. When the light rested upon me I saw two Personages, whose brightness and glory defy all description, standing above me in the air. One of them spake unto me, calling me by name and said, pointing to the other—This is My Beloved Son. Hear Him! My object in going to inquire of the Lord was to know which of all the sects was right, that I might know which to join. No sooner, therefore, did I get possession of myself, so as to be able to speak, than I asked the Personages who stood above me in the light, which of all the sects was right (for at this time it had never entered into my heart that all were wrong)—and which I should join. I was answered that I must join none of them, for they were all wrong; and the Personage who addressed me said that all their creeds were an abomination in his sight; that those professors were all corrupt; that: “they draw near to me with their lips, but their hearts are far from me, they teach for doctrines the commandments of men, having a form of godliness, but they deny the power thereof.” He again forbade me to join with any of them; and many other things did he say unto me, which I cannot write at this time. When I came to myself again, I found myself lying on my back, looking up into heaven. When the light had departed, I had no strength; but soon recovering in some degree, I went home. And as I leaned up to the fireplace, mother inquired what the matter was. I replied, “Never mind, all is well—I am well enough off.” I then said to my mother, “I have learned for myself that Presbyterianism is not true.” It seems as though the adversary was aware, at a very early period of my life, that I was destined to prove a disturber and an annoyer of his kingdom; else why should the powers of darkness combine against me? Why the opposition and persecution that arose against me, almost in my infancy?"
  },
  {
    "id": "doctrine-and-covenants-1-30",
    "order": 74,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 19,
    "reference": "Doctrine and Covenants 1:30",
    "keyPhrase": "“The only true and living church.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/1?lang=eng&id=p30#p30",
    "chunks": [
      {
        "verse": "30",
        "text": "And also those to whom these commandments were given, might have power to lay the foundation of this church, and to bring it forth out of obscurity and out of darkness, the only true and living church upon the face of the whole earth, with which I, the Lord, am well pleased, speaking unto the church collectively and not individually—"
      }
    ],
    "text": "And also those to whom these commandments were given, might have power to lay the foundation of this church, and to bring it forth out of obscurity and out of darkness, the only true and living church upon the face of the whole earth, with which I, the Lord, am well pleased, speaking unto the church collectively and not individually—"
  },
  {
    "id": "doctrine-and-covenants-1-37-38",
    "order": 75,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 19,
    "reference": "Doctrine and Covenants 1:37–38",
    "keyPhrase": "“Whether by mine own voice or by the voice of my servants, it is the same.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/1?lang=eng&id=p37-p38#p37",
    "chunks": [
      {
        "verse": "37",
        "text": "Search these commandments, for they are true and faithful, and the prophecies and promises which are in them shall all be fulfilled."
      },
      {
        "verse": "38",
        "text": "What I the Lord have spoken, I have spoken, and I excuse not myself; and though the heavens and the earth pass away, my word shall not pass away, but shall all be fulfilled, whether by mine own voice or by the voice of my servants, it is the same."
      }
    ],
    "text": "Search these commandments, for they are true and faithful, and the prophecies and promises which are in them shall all be fulfilled. What I the Lord have spoken, I have spoken, and I excuse not myself; and though the heavens and the earth pass away, my word shall not pass away, but shall all be fulfilled, whether by mine own voice or by the voice of my servants, it is the same."
  },
  {
    "id": "doctrine-and-covenants-6-36",
    "order": 76,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 19,
    "reference": "Doctrine and Covenants 6:36",
    "keyPhrase": "“Look unto me in every thought; doubt not, fear not.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/6?lang=eng&id=p36#p36",
    "chunks": [
      {
        "verse": "36",
        "text": "Look unto me in every thought; doubt not, fear not."
      }
    ],
    "text": "Look unto me in every thought; doubt not, fear not."
  },
  {
    "id": "doctrine-and-covenants-8-2-3",
    "order": 77,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 20,
    "reference": "Doctrine and Covenants 8:2–3",
    "keyPhrase": "“I will tell you in your mind and in your heart, by the Holy Ghost.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/8?lang=eng&id=p2-p3#p2",
    "chunks": [
      {
        "verse": "2",
        "text": "Yea, behold, I will tell you in your mind and in your heart, by the Holy Ghost, which shall come upon you and which shall dwell in your heart."
      },
      {
        "verse": "3",
        "text": "Now, behold, this is the spirit of revelation; behold, this is the spirit by which Moses brought the children of Israel through the Red Sea on dry ground."
      }
    ],
    "text": "Yea, behold, I will tell you in your mind and in your heart, by the Holy Ghost, which shall come upon you and which shall dwell in your heart. Now, behold, this is the spirit of revelation; behold, this is the spirit by which Moses brought the children of Israel through the Red Sea on dry ground."
  },
  {
    "id": "doctrine-and-covenants-13-1",
    "order": 78,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 20,
    "reference": "Doctrine and Covenants 13:1",
    "keyPhrase": "The Aaronic Priesthood “holds the keys of the ministering of angels, and of the gospel of repentance, and of baptism.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/13?lang=eng&id=p1#p1",
    "chunks": [
      {
        "verse": "1",
        "text": "Upon you my fellow servants, in the name of Messiah I confer the Priesthood of Aaron, which holds the keys of the ministering of angels, and of the gospel of repentance, and of baptism by immersion for the remission of sins; and this shall never be taken again from the earth, until the sons of Levi do offer again an offering unto the Lord in righteousness."
      }
    ],
    "text": "Upon you my fellow servants, in the name of Messiah I confer the Priesthood of Aaron, which holds the keys of the ministering of angels, and of the gospel of repentance, and of baptism by immersion for the remission of sins; and this shall never be taken again from the earth, until the sons of Levi do offer again an offering unto the Lord in righteousness."
  },
  {
    "id": "doctrine-and-covenants-18-10-11",
    "order": 79,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 20,
    "reference": "Doctrine and Covenants 18:10–11",
    "keyPhrase": "“The worth of souls is great in the sight of God.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/18?lang=eng&id=p10-p11#p10",
    "chunks": [
      {
        "verse": "10",
        "text": "Remember the worth of souls is great in the sight of God;"
      },
      {
        "verse": "11",
        "text": "For, behold, the Lord your Redeemer suffered death in the flesh; wherefore he suffered the pain of all men, that all men might repent and come unto him."
      }
    ],
    "text": "Remember the worth of souls is great in the sight of God; For, behold, the Lord your Redeemer suffered death in the flesh; wherefore he suffered the pain of all men, that all men might repent and come unto him."
  },
  {
    "id": "doctrine-and-covenants-18-15-16",
    "order": 80,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 20,
    "reference": "Doctrine and Covenants 18:15–16",
    "keyPhrase": "“How great will be your joy if you should bring many souls unto me!”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/18?lang=eng&id=p15-p16#p15",
    "chunks": [
      {
        "verse": "15",
        "text": "And if it so be that you should labor all your days in crying repentance unto this people, and bring, save it be one soul unto me, how great shall be your joy with him in the kingdom of my Father!"
      },
      {
        "verse": "16",
        "text": "And now, if your joy will be great with one soul that you have brought unto me into the kingdom of my Father, how great will be your joy if you should bring many souls unto me!"
      }
    ],
    "text": "And if it so be that you should labor all your days in crying repentance unto this people, and bring, save it be one soul unto me, how great shall be your joy with him in the kingdom of my Father! And now, if your joy will be great with one soul that you have brought unto me into the kingdom of my Father, how great will be your joy if you should bring many souls unto me!"
  },
  {
    "id": "doctrine-and-covenants-19-16-19",
    "order": 81,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 21,
    "reference": "Doctrine and Covenants 19:16–19",
    "keyPhrase": "“I, [Jesus Christ], have suffered these things for all.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/19?lang=eng&id=p16-p19#p16",
    "chunks": [
      {
        "verse": "16",
        "text": "For behold, I, God, have suffered these things for all, that they might not suffer if they would repent;"
      },
      {
        "verse": "17",
        "text": "But if they would not repent they must suffer even as I;"
      },
      {
        "verse": "18",
        "text": "Which suffering caused myself, even God, the greatest of all, to tremble because of pain, and to bleed at every pore, and to suffer both body and spirit—and would that I might not drink the bitter cup, and shrink—"
      },
      {
        "verse": "19",
        "text": "Nevertheless, glory be to the Father, and I partook and finished my preparations unto the children of men."
      }
    ],
    "text": "For behold, I, God, have suffered these things for all, that they might not suffer if they would repent; But if they would not repent they must suffer even as I; Which suffering caused myself, even God, the greatest of all, to tremble because of pain, and to bleed at every pore, and to suffer both body and spirit—and would that I might not drink the bitter cup, and shrink— Nevertheless, glory be to the Father, and I partook and finished my preparations unto the children of men."
  },
  {
    "id": "doctrine-and-covenants-21-4-6",
    "order": 82,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 21,
    "reference": "Doctrine and Covenants 21:4–6",
    "keyPhrase": "The prophet’s “word ye shall receive, as if from mine own mouth.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/21?lang=eng&id=p4-p6#p4",
    "chunks": [
      {
        "verse": "4",
        "text": "Wherefore, meaning the church, thou shalt give heed unto all his words and commandments which he shall give unto you as he receiveth them, walking in all holiness before me;"
      },
      {
        "verse": "5",
        "text": "For his word ye shall receive, as if from mine own mouth, in all patience and faith."
      },
      {
        "verse": "6",
        "text": "For by doing these things the gates of hell shall not prevail against you; yea, and the Lord God will disperse the powers of darkness from before you, and cause the heavens to shake for your good, and his name’s glory."
      }
    ],
    "text": "Wherefore, meaning the church, thou shalt give heed unto all his words and commandments which he shall give unto you as he receiveth them, walking in all holiness before me; For his word ye shall receive, as if from mine own mouth, in all patience and faith. For by doing these things the gates of hell shall not prevail against you; yea, and the Lord God will disperse the powers of darkness from before you, and cause the heavens to shake for your good, and his name’s glory."
  },
  {
    "id": "doctrine-and-covenants-29-10-11",
    "order": 83,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 21,
    "reference": "Doctrine and Covenants 29:10–11",
    "keyPhrase": "“I will reveal myself from heaven with power and great glory … and dwell in righteousness with men on earth a thousand years.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/29?lang=eng&id=p10-p11#p10",
    "chunks": [
      {
        "verse": "10",
        "text": "For the hour is nigh, and that which was spoken by mine apostles must be fulfilled; for as they spoke so shall it come to pass;"
      },
      {
        "verse": "11",
        "text": "For I will reveal myself from heaven with power and great glory, with all the hosts thereof, and dwell in righteousness with men on earth a thousand years, and the wicked shall not stand."
      }
    ],
    "text": "For the hour is nigh, and that which was spoken by mine apostles must be fulfilled; for as they spoke so shall it come to pass; For I will reveal myself from heaven with power and great glory, with all the hosts thereof, and dwell in righteousness with men on earth a thousand years, and the wicked shall not stand."
  },
  {
    "id": "doctrine-and-covenants-49-15-17",
    "order": 84,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 21,
    "reference": "Doctrine and Covenants 49:15–17",
    "keyPhrase": "“Marriage is ordained of God.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/49?lang=eng&id=p15-p17#p15",
    "chunks": [
      {
        "verse": "15",
        "text": "And again, verily I say unto you, that whoso forbiddeth to marry is not ordained of God, for marriage is ordained of God unto man."
      },
      {
        "verse": "16",
        "text": "Wherefore, it is lawful that he should have one wife, and they twain shall be one flesh, and all this that the earth might answer the end of its creation;"
      },
      {
        "verse": "17",
        "text": "And that it might be filled with the measure of man, according to his creation before the world was made."
      }
    ],
    "text": "And again, verily I say unto you, that whoso forbiddeth to marry is not ordained of God, for marriage is ordained of God unto man. Wherefore, it is lawful that he should have one wife, and they twain shall be one flesh, and all this that the earth might answer the end of its creation; And that it might be filled with the measure of man, according to his creation before the world was made."
  },
  {
    "id": "doctrine-and-covenants-58-42-43",
    "order": 85,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 22,
    "reference": "Doctrine and Covenants 58:42–43",
    "keyPhrase": "“He who has repented of his sins, the same is forgiven.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/58?lang=eng&id=p42-p43#p42",
    "chunks": [
      {
        "verse": "42",
        "text": "Behold, he who has repented of his sins, the same is forgiven, and I, the Lord, remember them no more."
      },
      {
        "verse": "43",
        "text": "By this ye may know if a man repenteth of his sins—behold, he will confess them and forsake them."
      }
    ],
    "text": "Behold, he who has repented of his sins, the same is forgiven, and I, the Lord, remember them no more. By this ye may know if a man repenteth of his sins—behold, he will confess them and forsake them."
  },
  {
    "id": "doctrine-and-covenants-64-9-11",
    "order": 86,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 22,
    "reference": "Doctrine and Covenants 64:9–11",
    "keyPhrase": "“Of you it is required to forgive all men.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/64?lang=eng&id=p9-p11#p9",
    "chunks": [
      {
        "verse": "9",
        "text": "Wherefore, I say unto you, that ye ought to forgive one another; for he that forgiveth not his brother his trespasses standeth condemned before the Lord; for there remaineth in him the greater sin."
      },
      {
        "verse": "10",
        "text": "I, the Lord, will forgive whom I will forgive, but of you it is required to forgive all men."
      },
      {
        "verse": "11",
        "text": "And ye ought to say in your hearts—let God judge between me and thee, and reward thee according to thy deeds."
      }
    ],
    "text": "Wherefore, I say unto you, that ye ought to forgive one another; for he that forgiveth not his brother his trespasses standeth condemned before the Lord; for there remaineth in him the greater sin. I, the Lord, will forgive whom I will forgive, but of you it is required to forgive all men. And ye ought to say in your hearts—let God judge between me and thee, and reward thee according to thy deeds."
  },
  {
    "id": "doctrine-and-covenants-76-22-24",
    "order": 87,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 22,
    "reference": "Doctrine and Covenants 76:22–24",
    "keyPhrase": "“By [Jesus Christ] the worlds are and were created.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/76?lang=eng&id=p22-p24#p22",
    "chunks": [
      {
        "verse": "22",
        "text": "And now, after the many testimonies which have been given of him, this is the testimony, last of all, which we give of him: That he lives!"
      },
      {
        "verse": "23",
        "text": "For we saw him, even on the right hand of God; and we heard the voice bearing record that he is the Only Begotten of the Father—"
      },
      {
        "verse": "24",
        "text": "That by him, and through him, and of him, the worlds are and were created, and the inhabitants thereof are begotten sons and daughters unto God."
      }
    ],
    "text": "And now, after the many testimonies which have been given of him, this is the testimony, last of all, which we give of him: That he lives! For we saw him, even on the right hand of God; and we heard the voice bearing record that he is the Only Begotten of the Father— That by him, and through him, and of him, the worlds are and were created, and the inhabitants thereof are begotten sons and daughters unto God."
  },
  {
    "id": "doctrine-and-covenants-82-10",
    "order": 88,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 22,
    "reference": "Doctrine and Covenants 82:10",
    "keyPhrase": "“I, the Lord, am bound when ye do what I say.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/82?lang=eng&id=p10#p10",
    "chunks": [
      {
        "verse": "10",
        "text": "I, the Lord, am bound when ye do what I say; but when ye do not what I say, ye have no promise."
      }
    ],
    "text": "I, the Lord, am bound when ye do what I say; but when ye do not what I say, ye have no promise."
  },
  {
    "id": "doctrine-and-covenants-84-20-22",
    "order": 89,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 23,
    "reference": "Doctrine and Covenants 84:20–22",
    "keyPhrase": "“In the ordinances thereof, the power of godliness is manifest.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/84?lang=eng&id=p20-p22#p20",
    "chunks": [
      {
        "verse": "20",
        "text": "Therefore, in the ordinances thereof, the power of godliness is manifest."
      },
      {
        "verse": "21",
        "text": "And without the ordinances thereof, and the authority of the priesthood, the power of godliness is not manifest unto men in the flesh;"
      },
      {
        "verse": "22",
        "text": "For without this no man can see the face of God, even the Father, and live."
      }
    ],
    "text": "Therefore, in the ordinances thereof, the power of godliness is manifest. And without the ordinances thereof, and the authority of the priesthood, the power of godliness is not manifest unto men in the flesh; For without this no man can see the face of God, even the Father, and live."
  },
  {
    "id": "doctrine-and-covenants-88-118",
    "order": 90,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 23,
    "reference": "Doctrine and Covenants 88:118",
    "keyPhrase": "“Seek learning, even by study and also by faith.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/88?lang=eng&id=p118#p118",
    "chunks": [
      {
        "verse": "118",
        "text": "And as all have not faith, seek ye diligently and teach one another words of wisdom; yea, seek ye out of the best books words of wisdom; seek learning, even by study and also by faith."
      }
    ],
    "text": "And as all have not faith, seek ye diligently and teach one another words of wisdom; yea, seek ye out of the best books words of wisdom; seek learning, even by study and also by faith."
  },
  {
    "id": "doctrine-and-covenants-89-18-21",
    "order": 91,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 23,
    "reference": "Doctrine and Covenants 89:18–21",
    "keyPhrase": "The blessings of the Word of Wisdom",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/89?lang=eng&id=p18-p21#p18",
    "chunks": [
      {
        "verse": "18",
        "text": "And all saints who remember to keep and do these sayings, walking in obedience to the commandments, shall receive health in their navel and marrow to their bones;"
      },
      {
        "verse": "19",
        "text": "And shall find wisdom and great treasures of knowledge, even hidden treasures;"
      },
      {
        "verse": "20",
        "text": "And shall run and not be weary, and shall walk and not faint."
      },
      {
        "verse": "21",
        "text": "And I, the Lord, give unto them a promise, that the destroying angel shall pass by them, as the children of Israel, and not slay them. Amen."
      }
    ],
    "text": "And all saints who remember to keep and do these sayings, walking in obedience to the commandments, shall receive health in their navel and marrow to their bones; And shall find wisdom and great treasures of knowledge, even hidden treasures; And shall run and not be weary, and shall walk and not faint. And I, the Lord, give unto them a promise, that the destroying angel shall pass by them, as the children of Israel, and not slay them. Amen."
  },
  {
    "id": "doctrine-and-covenants-107-8",
    "order": 92,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 23,
    "reference": "Doctrine and Covenants 107:8",
    "keyPhrase": "“The Melchizedek Priesthood … has power and authority … to administer in spiritual things.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/107?lang=eng&id=p8#p8",
    "chunks": [
      {
        "verse": "8",
        "text": "The Melchizedek Priesthood holds the right of presidency, and has power and authority over all the offices in the church in all ages of the world, to administer in spiritual things."
      }
    ],
    "text": "The Melchizedek Priesthood holds the right of presidency, and has power and authority over all the offices in the church in all ages of the world, to administer in spiritual things."
  },
  {
    "id": "doctrine-and-covenants-121-36-41-42",
    "order": 93,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 24,
    "reference": "Doctrine and Covenants 121:36, 41–42",
    "keyPhrase": "“The rights of the priesthood … cannot be controlled nor handled only on the principles of righteousness.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/121?lang=eng&id=p36,41-p42#p36",
    "chunks": [
      {
        "verse": "36",
        "text": "That the rights of the priesthood are inseparably connected with the powers of heaven, and that the powers of heaven cannot be controlled nor handled only upon the principles of righteousness."
      },
      {
        "verse": "41",
        "text": "No power or influence can or ought to be maintained by virtue of the priesthood, only by persuasion, by long-suffering, by gentleness and meekness, and by love unfeigned;"
      },
      {
        "verse": "42",
        "text": "By kindness, and pure knowledge, which shall greatly enlarge the soul without hypocrisy, and without guile—"
      }
    ],
    "text": "That the rights of the priesthood are inseparably connected with the powers of heaven, and that the powers of heaven cannot be controlled nor handled only upon the principles of righteousness. No power or influence can or ought to be maintained by virtue of the priesthood, only by persuasion, by long-suffering, by gentleness and meekness, and by love unfeigned; By kindness, and pure knowledge, which shall greatly enlarge the soul without hypocrisy, and without guile—"
  },
  {
    "id": "doctrine-and-covenants-130-22-23",
    "order": 94,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 24,
    "reference": "Doctrine and Covenants 130:22–23",
    "keyPhrase": "“The Father has a body of flesh and bones … ; the Son also; but the Holy Ghost … is a personage of Spirit.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/130?lang=eng&id=p22-p23#p22",
    "chunks": [
      {
        "verse": "22",
        "text": "The Father has a body of flesh and bones as tangible as man’s; the Son also; but the Holy Ghost has not a body of flesh and bones, but is a personage of Spirit. Were it not so, the Holy Ghost could not dwell in us."
      },
      {
        "verse": "23",
        "text": "A man may receive the Holy Ghost, and it may descend upon him and not tarry with him."
      }
    ],
    "text": "The Father has a body of flesh and bones as tangible as man’s; the Son also; but the Holy Ghost has not a body of flesh and bones, but is a personage of Spirit. Were it not so, the Holy Ghost could not dwell in us. A man may receive the Holy Ghost, and it may descend upon him and not tarry with him."
  },
  {
    "id": "doctrine-and-covenants-131-1-4",
    "order": 95,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 24,
    "reference": "Doctrine and Covenants 131:1–4",
    "keyPhrase": "“The new and everlasting covenant of marriage.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/131?lang=eng&id=p1-p4#p1",
    "chunks": [
      {
        "verse": "1",
        "text": "In the celestial glory there are three heavens or degrees;"
      },
      {
        "verse": "2",
        "text": "And in order to obtain the highest, a man must enter into this order of the priesthood [meaning the new and everlasting covenant of marriage];"
      },
      {
        "verse": "3",
        "text": "And if he does not, he cannot obtain it."
      },
      {
        "verse": "4",
        "text": "He may enter into the other, but that is the end of his kingdom; he cannot have an increase."
      }
    ],
    "text": "In the celestial glory there are three heavens or degrees; And in order to obtain the highest, a man must enter into this order of the priesthood [meaning the new and everlasting covenant of marriage]; And if he does not, he cannot obtain it. He may enter into the other, but that is the end of his kingdom; he cannot have an increase."
  },
  {
    "id": "doctrine-and-covenants-135-3",
    "order": 96,
    "course": "Doctrine and Covenants and Church History",
    "courseId": "doctrine-and-covenants",
    "unit": 24,
    "reference": "Doctrine and Covenants 135:3",
    "keyPhrase": "Joseph Smith “brought forth the Book of Mormon, which he translated by the gift and power of God.”",
    "sourceUrl": "https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/135?lang=eng&id=p3#p3",
    "chunks": [
      {
        "verse": "3",
        "text": "Joseph Smith, the Prophet and Seer of the Lord, has done more, save Jesus only, for the salvation of men in this world, than any other man that ever lived in it. In the short space of twenty years, he has brought forth the Book of Mormon, which he translated by the gift and power of God, and has been the means of publishing it on two continents; has sent the fulness of the everlasting gospel, which it contained, to the four quarters of the earth; has brought forth the revelations and commandments which compose this book of Doctrine and Covenants, and many other wise documents and instructions for the benefit of the children of men; gathered many thousands of the Latter-day Saints, founded a great city, and left a fame and name that cannot be slain. He lived great, and he died great in the eyes of God and his people; and like most of the Lord’s anointed in ancient times, has sealed his mission and his works with his own blood; and so has his brother Hyrum. In life they were not divided, and in death they were not separated!"
      }
    ],
    "text": "Joseph Smith, the Prophet and Seer of the Lord, has done more, save Jesus only, for the salvation of men in this world, than any other man that ever lived in it. In the short space of twenty years, he has brought forth the Book of Mormon, which he translated by the gift and power of God, and has been the means of publishing it on two continents; has sent the fulness of the everlasting gospel, which it contained, to the four quarters of the earth; has brought forth the revelations and commandments which compose this book of Doctrine and Covenants, and many other wise documents and instructions for the benefit of the children of men; gathered many thousands of the Latter-day Saints, founded a great city, and left a fame and name that cannot be slain. He lived great, and he died great in the eyes of God and his people; and like most of the Lord’s anointed in ancient times, has sealed his mission and his works with his own blood; and so has his brother Hyrum. In life they were not divided, and in death they were not separated!"
  }
] satisfies ScripturePassage[];

export const COURSE_ORDER: ScriptureCourseId[] = [
  "old-testament",
  "new-testament",
  "book-of-mormon",
  "doctrine-and-covenants",
];
