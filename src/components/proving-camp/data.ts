export type CampPillar = {
  title: string;
  description: string;
  iconLabel: string;
};

export type CampSession = {
  title: string;
  time: string;
  days: string;
  duration: string;
  ratio: string;
  note: string;
};

export type CampCoach = {
  name: string;
  badge: string;
  role: string;
  bio: string;
  image: string;
};

export type CampFaqItem = {
  q: string;
  a: string;
};

export type CampPartner = {
  name: string;
  image: string;
};

export const campPillars: CampPillar[] = [
  {
    title: "Credentialed Coaches",
    description:
      "Former pros, NTX Lions players, college athletes, and top local talent.",
    iconLabel: "FD",
  },
  {
    title: "Small Groups",
    description: "10:1 ratio session so every player gets real attention.",
    iconLabel: "SG",
  },
  {
    title: "All Skill Levels",
    description:
      "From recreation and first-timers to elite club level players — all welcome.",
    iconLabel: "3V",
  },
  {
    title: "Gear Included",
    description: "Every registrant gets a camp ball and branded t-shirt.",
    iconLabel: "CS",
  },
];

export const campSessions: CampSession[] = [
  {
    title: "AM Session",
    time: "8:45 AM",
    days: "Monday to Thursday",
    duration: "9:00 AM - 12:00 PM",
    ratio: "8:1",
    note: "Built for players ages 8–10 who are developing fundamentals, building confidence, and falling in love with the game. High energy, game-based learning, and a pace that keeps everyone moving and smiling. All players receive a written evaluation at the end of the week.",
  },
  {
    title: "PM Session",
    time: "11:45 PM",
    days: "Monday to Thursday",
    duration: "12:00 PM - 3:00 PM",
    ratio: "7:1",
    note: "For players ages 11–14 who are ready to be pushed. Technical and  tactical work, competitive small-sided games, and goalie-specific training for eligible players. Coached at a pace that challenges even the most experienced players in the group.",
  },
];

export const campSchedule: string[][] = [
  ["1", "June 2 - 4", "Allen Training Facility", "50", "50"],
  ["2", "June 8 - 10", "Allen Training Facility", "50", "50"],
  ["3", "June 16 - 18", "Allen Training Facility", "50", "50"],
  ["4", "June 22 - 24", "Allen Training Facility", "50", "50"],
  ["5", "July 7 - 9", "Allen Training Facility", "50", "50"],
  ["6", "July 13 - 15", "Allen Training Facility", "50", "50"],
  ["7", "July 21 - 23", "Allen Training Facility", "50", "50"],
  ["8", "July 27 - 29", "Allen Training Facility", "50", "50"],
  ["9", "August 3 - 5", "Allen Training Facility", "50", "50"],
];

export const campCoaches: CampCoach[] = [
  {
    name: "Dean Robertson",
    badge: "Welsh International · 58 Caps",
    role: "Camp Director · NTX Lions FC Head Coach",
    bio: "Dean Robertson began his playing career as a schoolboy professional with Bristol City before representing Wales at Youth and U21 level — earning 58 Welsh Youth caps. He came to the United States to play collegiately at the University of Virginia and Loyola University before transitioning into coaching. Over 25 years on the sideline, Dean has built one of the most decorated coaching records in Texas — three national championships, 14 state cups, eight regional titles, and three Coach of the Year awards across stints at FC Dallas, Liverpool FC America, and Solar Soccer Club. He holds a USSF A License and Director of Coaching Diploma. At Crown & Pitch Proving Camp, Dean serves as Camp Director and personally reviews every written player evaluation delivered at the end of the week.",
    image: "/camp/coach/comming.png",
  },
  {
    name: "Waleed Cherif",
    badge: "Former Pro · Algeria & USA",
    role: "NTX Lions FC · Camp Coach",
    bio: "Waleed Cherif's path to the pitch started at Solar Academy and Coppell High School, where he won a state championship before earning a Division I scholarship to Duquesne University. He went on to compete professionally in Algeria's top division with RC Arba, and across U.S. professional leagues including Michigan Stars, Gold Star Detroit, Denton Diablos (USL2), and NTX Lions (UPSL). Off the field, Waleed serves as Director of Coaching for Texas Thunder and coaches the upper school girls program at Greenhill School — bringing the same standard of play he competed at to the next generation of players.",
    image: "/camp/coach/comming.png",
  },
  {
    name: "Pablo Soto",
    badge: "GK Specialist · USC GK Diploma Level 3",
    role: "Goalkeeper Coach · Proving Camp PM Session",
    bio: "Originally from Bogota, Colombia, Pablo Soto brought his game to the United States and played four years of collegiate soccer at Bethany College before competing across U.S. semi-pro leagues including the Dallas Dynamo, NTX Legends, Denton Diablos, and Texas Spurs. He has since dedicated his career to goalkeeper development at every level — serving as GK coach at Liverpool Academy and Paul Quinn College, coaching youth players at BVB Academy, and founding Prime GK Academy, his own goalkeeper-specific training program. Pablo holds a USSF D License and USC Goalkeeper Diploma Level 3. At Crown & Pitch Proving Camp he leads goalie-specific training alongside a dedicated second GK coach in the PM session — 20 slots available per week",
    image: "/camp/coach/comming.png",
  },
  {
    name: "Andrew Hernandez",
    badge: "",
    role: "NTX Lions FC · Camp Coach",
    bio: "Andrew Hernandez came up through the FC Dallas Academy before earning MVP honors at Allen High School and earning a spot in the NCAA Division III program at Southwestern University in Georgetown, Texas. He now competes at the semi-professional level with the Denton Diablos (USL2, US Open Cup) and NTX Lions (UPSL) while building his coaching career in parallel. He serves as Assistant Head Coach and JV Head Coach for the girls soccer program at Faith Family Academy in Dallas — where he led the team to the 2026 TCAL State Championship — and teaches Physical Education at the school. In 2026, Andrew was selected as a FIFA World Cup volunteer in Guest Operations at AT&T Stadium, earning a feature on Telemundo as one of the faces of the tournament in North Texas.",
    image: "/camp/coach/comming.png",
  },
  {
    name: "Lea Cataggio",
    badge: "",
    role: "Camp Coach · Maryland Coach of the Year 2023",
    bio: "Lea Cataggio developed her foundation as a player with the Baltimore Bays Soccer Club under Dean Robertson — a connection that brought her to Crown & Pitch Proving Camp decades later. A former collegiate player at Lincoln Memorial University, Lea holds a Bachelor of Science in Kinesiology and a Master of Science in Applied Health Physiology with a concentration in Strength and Conditioning from Salisbury University, where she also served as an assistant soccer coach for three seasons. In 2023, she made history by leading Havre de Grace High School to Maryland's first-ever female 1A soccer state championship — earning Maryland Coach of the Year for the 2023-2024 school year. She currently serves as Executive Director of Success Journey Sports and founder of Top Notch Sports, and brings over a decade of athlete development experience to every session she coaches.",
    image: "/camp/coach/coach5.png",
  },
];

export const campFeatures: string[] = [
  "Professional-level coaching for every session.",
  "Crown & Pitch Proving Camp branded t-shirt (size selected at registration — YL, YXL, XS, S, M, L, XL)",
  "Official camp soccer ball.",
  "Written player evaluation — delivered by email at the end of your camp week, completed by your player's lead coach and reviewed by Dean Robertson.",
  "Small-sided games and structured drills every day.",
  "Safe, supervised environment — certified coaches on site.",
  "Access to Crown & Pitch tournament information and early registration offers.",
];

export const campFaqItems: CampFaqItem[] = [
  {
    q: "What should my player bring?",
    a: "Bring cleats or turf shoes, shin guards, water bottle, and a light snack. A reversible training top is recommended.",
  },
  {
    q: "What is the refund policy?",
    a: "30+ days before camp: Parents may choose either (1) full credit toward any 2026 session (no fee deducted) or (2) a cash refund minus a $25 administrative fee. 7–30 days before camp: No refunds or credits are available; however, registration may be transferred to another eligible player at no charge if requested before the 7-day cutoff. Under 7 days or no-show: Registration is fully forfeited with no refund, credit, or transfer. If the camp is canceled by the organizer, a full refund or full credit will be provided with no administrative fee.",
  },
  {
    q: "Can my player attend more than one week?",
    a: "Yes. Multi-week registration is encouraged for stronger progression and more detailed coaching feedback.",
  },
  // {
  //   q: "My 10-year-old is advanced. Can they join the afternoon session?",
  //   a: "Yes, after coach review. We may recommend PM placement based on prior competition level and technical readiness.",
  // },
  {
    q: "What is the written player evaluation?",
    a: "Each player receives end-of-week notes covering strengths, growth targets, and next training priorities.",
  },
  {
    q: "Is this affiliated with NTX Lions FC?",
    a: "Yes. Crown and Pitch Proving Camp works alongside NTX Lions FC staff and coaching standards for player development pathways.",
  },
  {
    q: "Is goalie training available?",
    a: "Yes. Goalie training is available for eligible players and is limited by weekly capacity.",
  },
  {
    q: "What happens if a session is full?",
    a: "You can join the waitlist. If spots open, families are notified in order and have a limited window to confirm registration.",
  },
  {
    q: "Can I transfer my registration to another player?",
    a: "Transfers may be approved before session start. Contact support with both player details so eligibility can be confirmed.",
  },
  {
    q: "Are there any tryouts or skill requirements?",
    a: "No formal tryout is required. We place players by age and observed level to keep training challenging and safe.",
  },
];

export const campPartnerLogos: CampPartner[] = [
  { name: "NTX Lions", image: "/camp/partner/logo1.png" },
  { name: "MAP", image: "/camp/partner/logo2.png" },
];
