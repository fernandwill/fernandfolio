import { contact, experiences, metrics, project, socials, stack } from "@/lib/portfolio-data";
import { AsciiIntro } from "@/components/ascii-intro";
import { AsciiConfetti } from "@/components/ascii-confetti";

function Rule() {
  return <div className="ink-rule" aria-hidden="true">{"-".repeat(100)}</div>;
}

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">[ skip to content ]</a>
      <div className="portfolio-shell">
        <header className="masthead">
          <a href="#about" className="wordmark">[ fw ]</a>
          <nav aria-label="Main navigation">
            <a href="#projects">work</a>
            <a href="#experience">experience</a>
            <a href="#contact">say hello -&gt;</a>
          </nav>
        </header>

        <main id="main-content" tabIndex={-1}>
          <section id="about" aria-labelledby="intro-heading">
            <AsciiIntro />
            <div className="intro-copy">
              <p className="eyebrow">hello, i'm</p>
              <h1 id="intro-heading">Fernand William Citra<span className="accent" aria-hidden="true">.</span></h1>
              <p className="role">Currently Founding Engineer @ PRUaini Group</p>
              <p>Enjoy turning business problems into practical software.</p>
              <p className="availability"><span aria-hidden="true">[*] </span>{contact.availability}</p>
              <div className="link-row"><a href="#projects">[ explore my work -&gt; ]</a><a href={`mailto:${contact.email}`}>[ say hello -&gt; ]</a></div>
            </div>
            <dl className="impact-register">{metrics.map(({ value, label }) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}</dl>
          </section>

          <section id="projects" aria-labelledby="projects-heading" className="notebook-section">
            <h2 id="projects-heading"><span aria-hidden="true">01 / </span>things i've built</h2>
            <Rule />
            <article>
              <div className="entry-heading"><h3>{project.name}</h3><span className="muted">[ open source ]</span></div>
              <p>{project.description}</p>
              <p className="muted paragraph">A coordination tool for a rapidly growing local badminton club, built to make running a session as simple as playing one.</p>
              <ul className="tech-list" aria-label="Project technologies">{project.technologies.map((technology) => <li key={technology}>[ {technology} ]</li>)}</ul>
              <div className="link-row"><a href={project.liveUrl} target="_blank" rel="noopener noreferrer">[ live site -&gt; ]</a><a href={project.githubUrl} target="_blank" rel="noopener noreferrer">[ source -&gt; ]</a></div>
              <details className="project-details">
                <summary>Under the hood / project notes</summary>
                <ul>{project.achievements.map((achievement) => <li className="project-note" key={achievement}>{achievement}</li>)}</ul>
              </details>
            </article>
          </section>

          <section id="experience" aria-labelledby="experience-heading" className="notebook-section">
            <h2 id="experience-heading"><span aria-hidden="true">02 / </span>where i've been building</h2>
            <p className="muted">Yes, the dates overlap. That's intentional.</p>
            <Rule />
            <ol className="experience-list">{experiences.map((entry) => (
              <li key={`${entry.company}-${entry.role}`}>
                <p className="eyebrow">{entry.date}</p>
                <h3>{entry.role}</h3>
                <p>{entry.company} <span className="muted">/ {entry.location}</span></p>
                <p className="paragraph muted">{entry.description}</p>
                {entry.technologies.length > 0 && <ul className="tech-list" aria-label={`${entry.company} technologies`}>{entry.technologies.map((technology) => <li key={technology}>[ {technology} ]</li>)}</ul>}
              </li>
            ))}</ol>
          </section>

          <section id="terminal" aria-labelledby="stack-heading" className="notebook-section">
            <h2 id="stack-heading"><span aria-hidden="true">03 / </span>the everyday toolkit</h2>
            <Rule />
            <p className="muted">Below is the stacks I'm familiar with:</p>
            <ul className="tech-list" aria-label="Everyday technologies">{stack.map(({ label }) => <li key={label}>[ {label} ]</li>)}</ul>
          </section>

          <section id="contact" aria-labelledby="contact-heading" className="notebook-section">
            <h2 id="contact-heading"><span aria-hidden="true">04 / </span>leave a note</h2>
            <Rule />
            <p>Something worth building?</p>
            <p className="muted paragraph">I'm open to full-time roles and good conversations. Below is the list of channels I'm available on:</p>
            <div className="link-row"><a href={`mailto:${contact.email}`}>[ Email -&gt; ]</a>{socials.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer">[ {label} -&gt; ]</a>)}</div>
          </section>
        </main>

        <footer>
          <Rule />
          <div className="footer-line"><span>(c) {new Date().getFullYear()} Fernand William Citra</span><a href="#about">[ back to top ^ ]</a></div>
          <AsciiConfetti />
        </footer>
      </div>
    </>
  );
}
