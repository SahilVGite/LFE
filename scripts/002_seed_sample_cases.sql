-- Seed sample legal cases for testing

INSERT INTO public.legal_cases (title, summary, tags, court, year, content) VALUES
(
  'Kesavananda Bharati v. State of Kerala',
  'Landmark case establishing the Basic Structure doctrine of the Indian Constitution, limiting Parliament''s power to amend the Constitution.',
  ARRAY['constitutional law', 'basic structure', 'fundamental rights'],
  'Supreme Court of India',
  1973,
  'This landmark case established that while Parliament has wide powers to amend the Constitution under Article 368, it cannot alter the basic structure of the Constitution. The 13-judge bench held that certain features of the Constitution are so essential that they cannot be abrogated even by a constitutional amendment. These include supremacy of the Constitution, republican and democratic form of government, secular character, separation of powers, and federal character.'
),
(
  'Maneka Gandhi v. Union of India',
  'Expanded the scope of Article 21 (Right to Life) to include the right to live with dignity and established the principle of natural justice.',
  ARRAY['fundamental rights', 'article 21', 'natural justice', 'due process'],
  'Supreme Court of India',
  1978,
  'The Supreme Court held that the right to life and personal liberty under Article 21 cannot be taken away except by procedure established by law, and such procedure must be fair, just, and reasonable. This case expanded the interpretation of Article 21 to include various rights essential for a dignified life. The court also established that Articles 14, 19, and 21 are interconnected and must be read together.'
),
(
  'Vishaka v. State of Rajasthan',
  'Laid down guidelines for prevention of sexual harassment at workplace, which later became the basis for the Sexual Harassment of Women at Workplace Act, 2013.',
  ARRAY['sexual harassment', 'workplace', 'women rights', 'guidelines'],
  'Supreme Court of India',
  1997,
  'In the absence of enacted law, the Supreme Court laid down detailed guidelines to prevent sexual harassment of women at workplace. The court defined sexual harassment and mandated employers to establish complaints committees. These guidelines, known as the Vishaka Guidelines, remained in force until the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act was enacted in 2013.'
),
(
  'Shah Bano Begum v. Mohammad Ahmed Khan',
  'Landmark case on Muslim women''s right to maintenance under Section 125 CrPC, sparking debate on uniform civil code.',
  ARRAY['muslim law', 'maintenance', 'section 125 crpc', 'personal law'],
  'Supreme Court of India',
  1985,
  'The Supreme Court held that a Muslim woman is entitled to maintenance from her former husband under Section 125 of the Code of Criminal Procedure even after the iddat period. The court observed that Section 125 is a secular provision applicable to all citizens irrespective of religion. This judgment sparked significant debate about the Uniform Civil Code and led to the enactment of the Muslim Women (Protection of Rights on Divorce) Act, 1986.'
),
(
  'Navtej Singh Johar v. Union of India',
  'Decriminalized consensual homosexual acts between adults by reading down Section 377 of the Indian Penal Code.',
  ARRAY['lgbtq rights', 'section 377', 'privacy', 'equality'],
  'Supreme Court of India',
  2018,
  'A five-judge Constitution Bench unanimously held that Section 377 of the Indian Penal Code, insofar as it criminalizes consensual sexual conduct between adults of the same sex, is unconstitutional. The court held that sexual orientation is an intrinsic part of identity and dignity, protected under Article 21. The judgment recognized that LGBTQ persons are entitled to equal citizenship and protection of fundamental rights.'
);
