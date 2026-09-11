import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, Check, Clock3, MessageCircle, Phone } from "lucide-react";
import styles from "./thank-you.module.css";

export const metadata: Metadata = {
  title: "Thank You | Skin Booster & IV Drip Consultation",
  description:
    "Your skin booster and IV wellness consultation request has been received by Dr. Nishita's Clinic.",
  robots: { index: false, follow: false },
};

const whatsappHref =
  "https://wa.me/919381218003?text=Hello%2C%20I%20have%20submitted%20a%20Skin%20Booster%20%2F%20IV%20Wellness%20consultation%20request.";

export default function ThankYouPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a
          href="https://iv-drip.drnishitaranka.in/"
          className={styles.brand}
          aria-label="Return to the Skin Boosters & IV Drips page"
        >
          <Image
            src="/brand/logo.png"
            alt="Dr. Nishita's Clinic for Skin, Hair and Aesthetics"
            width={500}
            height={89}
            priority
            unoptimized
          />
        </a>
        <span className={styles.location}>Banjara Hills, Hyderabad</span>
      </header>

      <main className={styles.main}>
        <section className={styles.card} aria-labelledby="thank-you-title">
          <div className={styles.confirmation}>
            <span className={styles.checkmark} aria-hidden="true">
              <Check size={30} strokeWidth={2.2} />
            </span>
            <p className={styles.eyebrow}>Request received</p>
            <h1 id="thank-you-title">
              Thank you. Your consultation request is with our clinic team.
            </h1>
            <p className={styles.intro}>
              We have received your Skin Booster and IV Wellness consultation
              details. A member of the clinic team will contact you to
              understand your skin concerns and help plan your assessment.
            </p>
            <p className={styles.intro}>
              Our team will reach out to you from Monday to Saturday, between
              10:00 AM and 7:00 PM.
            </p>

            <div className={styles.steps} aria-label="What happens next">
              <p className={styles.stepsTitle}>What happens next</p>
              <div className={styles.step}>
                <span>01</span>
                <p>Our team reviews the information you shared.</p>
              </div>
              <div className={styles.step}>
                <span>02</span>
                <p>We call you during clinic hours to understand your concern.</p>
              </div>
              <div className={styles.step}>
                <span>03</span>
                <p>
                  Your skin assessment and suitable Skin Booster protocol are
                  arranged, along with eligibility for a complimentary IV
                  wellness session.
                </p>
              </div>
            </div>
          </div>

          <aside className={styles.contactPanel} aria-label="Clinic contact options">
            <Clock3 size={28} aria-hidden="true" />
            <p className={styles.panelKicker}>No further form is needed</p>
            <h2>We will take it from here.</h2>
            <p>
              Your request is safely recorded. If you would like to add
              something now, you can message or call the clinic.
            </p>
            <div className={styles.actions}>
              <a className={styles.primaryAction} href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle size={19} aria-hidden="true" />
                Message on WhatsApp
              </a>
              <a className={styles.secondaryAction} href="tel:+919381219187">
                <Phone size={18} aria-hidden="true" />
                Call the clinic
              </a>
            </div>
            <a className={styles.backLink} href="https://iv-drip.drnishitaranka.in/">
              <ArrowLeft size={17} aria-hidden="true" />
              Back to Skin Boosters &amp; IV Drips
            </a>
          </aside>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Dr. Nishita&apos;s Clinic</span>
        <span>Road No. 7, Banjara Hills, Hyderabad</span>
      </footer>
    </div>
  );
}
