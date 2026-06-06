import Image from "next/image";
import styles from "./page.module.css";

export default function Team() {
  const teamMembers = [
    {
      name: "AHMED GHAREAB",
      role: "LEAD ENGINEER, LORE",
      desc: "Historical research, system lead, narrative direction.",
      image: "/photos/1.png",
      highlight: true
    },
    {
      name: "MOAMEN MOHAMED",
      role: "FULL STACK DEVELOPER",
      desc: "NEXT.js Developer, chatbot integration, database design, performance optimization.",
      image: "/photos/moamen.png"
    },
    {
      name: "ABDULLAH HAMADA",
      role: "BACKEND ENGINEER",
      desc: "Cloud infrastructure, RAG search database, API integration.",
      image: "/photos/2.png"
    },
    {
      name: "ZIAD NAGIB",
      role: "UI / UX DESIGNER",
      desc: "Interface, brand, motion system, design tokens.",
      image: "/photos/3.png"
    },
    {
      name: "NOUR ELDIN WAEL",
      role: "MOBILE APP ENGINEER",
      desc: "Three.js, performance optimization, mobile experience.",
      image: "/photos/1.png"
    },
    {
      name: "ABDALRAHMAN SHERIF",
      role: "3D DESIGNER, DEVELOPER",
      desc: "Modeling, texturing, lighting, environment art.",
      image: "/photos/2.png"
    },

    {
      name: "AMR GOMAA",
      role: "LIGHTING ARTIST",
      desc: "Creating the visual atmosphere that makes virtual worlds feel real.",
      image: "/photos/3.png"
    },
    {
      name: "ALAA ATEF",
      role: "BLENDER ANIMATOR",
      desc: "Adds a spark to the game.",
      image: "/photos/3.png"
    },
    {
      name: "AHMED HAMDY",
      role: "CYBER SECURITY ENGINEER",
      desc: "Secures our digital borders.",
      image: "/photos/3.png"
    },

  ];

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerBackground}></div>
        <div className={styles.headerContent}>
          <p className={styles.sectionTag}>THE TEAM</p>
          <p className={styles.subtitle}>We met in a graduation studio. We left it builders.</p>
        </div>
      </header>

      <section className={styles.teamSection}>
        <div className={styles.teamHeader}>
          <p className={styles.tag}>HISTORY GUARDIANS</p>
          <h2>MEET THE MAKERS.</h2>
        </div>

        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div key={index} className={`${styles.memberCard} ${member.highlight ? styles.highlightCard : ""}`}>
              <div className={styles.avatarWrapper}>
                <Image
                  src={member.image}
                  alt={member.name}
                  width={112}
                  height={112}
                  className={styles.avatarImage}
                />
              </div>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}>{member.role}</p>
              <p className={styles.memberDesc}>{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.villageSection}>
        <div className={styles.villageHeader}>
          <p className={styles.tag}>IT TAKES A VILLAGE</p>
          <h2>IT TAKES A VILLAGE.</h2>
        </div>

        <div className={styles.villageGrid}>
          <div className={styles.villageColumn}>
            <h4>ACADEMIC ADVISORS</h4>
            <ul>
              <li>Prof. Dr.Amna Ramadan &middot; KFS University</li>
              <li>Prof. Dr.Alaa El-Lakany  &middot; KFS University</li>
              <li>Prof. Dr.Mostafa El-Baz &middot; KFS University</li>
            </ul>
          </div>
          <div className={styles.villageColumn}>
            <h4>SPECIAL THANKS</h4>
            <ul>
              <li>KFS University Faculty of Computers</li>
              <li>Egypt Ministry of Tourism & Antiquities</li>
              <li>Beta Testers - 127 of you</li>
              <li>Our families, for the patience</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>WANT TO HELP BUILD THE NEXT CHAPTER?</h2>
        <p>We&apos;re hiring nobody — but we&apos;d love your feedback.</p>
        <button className={styles.contactBtn}>GET IN TOUCH &rarr;</button>
      </section>
    </main>
  );
}
