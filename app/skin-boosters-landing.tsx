"use client";

import Image from "next/image";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock3,
  Droplets,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  UserRoundCheck,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";

let exitIntentShown = false;

const leadApiUrl = "https://api.drnishitaranka.in/v1/leads";

const concernOptions = [
  "Dehydration & Dullness",
  "Fine Lines & Crepey Texture",
  "Reduced Skin Firmness",
  "Neck or Hand Concerns",
  "General Skin Quality",
  "Other",
];

const proofPoints = [
  {
    icon: Stethoscope,
    title: "Dermatologist-led",
    detail: "Skin booster protocols selected around your skin and concerns",
  },
  {
    icon: Sparkles,
    title: "Quality-focused",
    detail: "Treatments chosen to improve hydration and texture, not add volume",
  },
  {
    icon: UserRoundCheck,
    title: "Personalised protocols",
    detail: "Product, quantity and session plan confirmed after assessment",
  },
  {
    icon: Activity,
    title: "Progress reviewed",
    detail: "Treatment response monitored and plans adjusted over time",
  },
];

const publications = [
  { src: "/brand/deccan-chronicle.png", alt: "Deccan Chronicle" },
  { src: "/brand/hindustan-times.png", alt: "Hindustan Times" },
  { src: "/brand/new-indian-express.png", alt: "The New Indian Express" },
  { src: "/brand/deccan-herald.png", alt: "Deccan Herald" },
  { src: "/brand/lifestyle-asia.png", alt: "Lifestyle Asia" },
  { src: "/brand/hauterfly.png", alt: "Hauterfly" },
];

const treatmentOptions = [
  {
    number: "01",
    name: "SKINVIVE™",
    description:
      "An injectable hyaluronic acid treatment selected to improve cheek skin smoothness and hydration while preserving natural facial contours and expressions. Performed as a single doctor-planned session, with quantity selected after facial and skin assessment.",
    idealFor:
      "Dehydrated, dull-looking cheek skin and patients seeking a single-session hydration boost.",
  },
  {
    number: "02",
    name: "RD1 Skin Renewal Protocol",
    description:
      "A structured protocol for patients who may benefit from a progressive approach to improving skin quality over time — 3 ml per session across three sessions, spaced approximately three months apart.",
    idealFor:
      "Progressive dehydration and textural change, and patients seeking a structured, multi-session renewal plan.",
  },
  {
    number: "03",
    name: "Profhilo® Protocol",
    description:
      "An injectable hyaluronic acid treatment used to support hydration, firmness and skin quality, administered at specific treatment points — two doctor-planned sessions, with the second approximately one month after the first.",
    idealFor:
      "Skin laxity alongside dehydration, and patients seeking firmness and quality improvement without volumising.",
  },
];

const compareRows: Array<{
  label: string;
  values: [string, string, string];
}> = [
  {
    label: "Typical protocol",
    values: [
      "One session",
      "3 ml × 3 sessions; ~3 months apart",
      "2 sessions; ~1 month apart",
    ],
  },
  {
    label: "Primary focus",
    values: [
      "Hydration and smoothness",
      "Progressive skin renewal",
      "Hydration, firmness and bio-remodelling",
    ],
  },
  {
    label: "Complimentary IV benefit*",
    values: ["1 session", "3 sessions", "2 sessions"],
  },
];

const journeySteps = [
  {
    number: "01",
    title: "Assess",
    body: "Your skin quality, hydration, texture, medical history and treatment goals are evaluated.",
  },
  {
    number: "02",
    title: "Plan",
    body: "The most appropriate product, quantity and protocol are recommended for you.",
  },
  {
    number: "03",
    title: "Treat",
    body: "The procedure is performed in a clinical setting using an individualised technique, followed by treatment-specific aftercare guidance.",
  },
  {
    number: "04",
    title: "Review",
    body: "Progress is monitored over time, and the corresponding IV wellness session is scheduled only after separate medical clearance.",
  },
];

const skinConcerns = [
  "Dehydration & dullness",
  "Fine lines & crepey texture",
  "Reduced skin firmness",
  "Neck concerns",
  "Hand concerns",
  "General skin quality maintenance",
];

const reviews = [
  {
    quote:
      "I have been regularly visiting Dr Nishita's clinic for the past 2+ years and have been extremely happy with the results, be it managing my acne and skin.",
    author: "Vaidehi Agarwal",
  },
  {
    quote:
      "I am really happy that I visited this clinic and it was a great experience. I highly recommend Dr. Nishita's clinic for any skin problems.",
    author: "Snehitha Kodali",
  },
  {
    quote:
      "It was a great experience at Nishita's Clinic, and the staff were very helpful and humble.",
    author: "Sravani Gubba",
  },
  {
    quote:
      "Dr. Nishita Ranka is the best dermatologist I've visited till date. After consulting Nishita ma'am there is great improvement.",
    author: "Shamili Praharsha",
  },
];

const faqs = [
  {
    question: "Are skin boosters the same as dermal fillers?",
    answer:
      "No. Skin boosters primarily target hydration, texture and skin quality. Dermal fillers are generally chosen to restore volume, enhance contours or improve facial proportions.",
  },
  {
    question: "Which skin booster is right for me?",
    answer:
      "That depends on your skin, age, concerns, treatment history and desired outcome. Your doctor will recommend an option only after an in-person assessment.",
  },
  {
    question: "Will a skin booster change my facial shape?",
    answer:
      "Skin boosters are selected mainly for skin quality rather than significant structural change. Effects vary by product, technique and individual response.",
  },
  {
    question: "Is the IV session compulsory?",
    answer:
      "No. It is an optional complimentary benefit. Declining it does not affect the injectable treatment and it cannot be converted into cash, products or a discount.",
  },
  {
    question: "Can everyone receive IV therapy?",
    answer:
      "No. IV therapy requires separate medical assessment. The doctor may request investigations, modify the formulation, postpone the session or decline treatment when appropriate.",
  },
  {
    question: "Is there downtime?",
    answer:
      "Temporary redness, swelling, tenderness, bruising or small injection-point elevations may occur. Expected recovery and aftercare will be explained before treatment.",
  },
];

const termsAndDisclaimer = [
  "This is a limited-period promotional privilege, subject to availability and clinic terms.",
  "Injectable treatment is undertaken only after consultation, medical assessment and informed consent.",
  "Product, quantity, treatment area, technique, interval and number of sessions are determined exclusively by the treating doctor.",
  "IV therapy requires a separate medical assessment and is subject to individual suitability.",
  "The IV formulation is selected by the medical team and cannot be self-prescribed.",
  "One complimentary IV session corresponds to each eligible skin booster session completed under the qualifying protocol.",
  "Complimentary sessions are personal, non-transferable, have no cash value and cannot be combined with another offer.",
  "Unused IV sessions lapse if the corresponding injectable protocol is discontinued or not completed within its validity period.",
  "Outcomes and duration vary between individuals; no particular result is guaranteed.",
  "The doctor may modify, postpone or decline either treatment when it is not medically appropriate.",
  "Brand names and trademarks belong to their respective owners.",
];

type FormErrors = Partial<Record<"name" | "phone" | "area" | "submit", string>>;
type FormValues = Record<"name" | "phone" | "area", string>;
type StickyFormPhase = "hidden" | "visible" | "hiding";
type StickyFormMode = "auto" | "mobile";
type MobileCtaTone = "on-light" | "on-dark";

type ConcernDropdownProps = {
  className?: string;
  error?: string;
  id: string;
  label: string;
  options: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function ConcernDropdown({
  className,
  error,
  id,
  label,
  options,
  placeholder,
  value,
  onChange,
}: ConcernDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = `${id}-options`;
  const errorId = `${id}-error`;

  const focusOption = useCallback((index: number) => {
    window.requestAnimationFrame(() => optionRefs.current[index]?.focus());
  }, []);

  const openMenu = useCallback(
    (preferredIndex?: number) => {
      const selectedIndex = options.indexOf(value);
      const nextIndex =
        preferredIndex ?? (selectedIndex >= 0 ? selectedIndex : 0);
      setActiveIndex(nextIndex);
      setIsOpen(true);
      focusOption(nextIndex);
    },
    [focusOption, options, value],
  );

  const closeMenu = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeMenu]);

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Home") {
      event.preventDefault();
      openMenu(event.key === "Home" ? 0 : undefined);
    }

    if (event.key === "ArrowUp" || event.key === "End") {
      event.preventDefault();
      openMenu(event.key === "End" ? options.length - 1 : undefined);
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeMenu(true);
    }
  }

  function handleOptionKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChange(options[index]);
      closeMenu(true);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key === "Tab") {
      closeMenu();
      return;
    }

    let nextIndex = index;
    if (event.key === "ArrowDown") nextIndex = (index + 1) % options.length;
    if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + options.length) % options.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = options.length - 1;

    if (nextIndex !== index) {
      event.preventDefault();
      setActiveIndex(nextIndex);
      focusOption(nextIndex);
    }
  }

  return (
    <div className={`field-group custom-select-field${className ? ` ${className}` : ""}`}>
      <label id={`${id}-label`} htmlFor={id}>
        {label} <span className="required-mark" aria-hidden="true">*</span>
      </label>
      <input type="hidden" name="area" value={value} />
      <div ref={rootRef} className="custom-select" data-open={isOpen}>
        <button
          ref={triggerRef}
          id={id}
          className="custom-select-trigger"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-labelledby={`${id}-label ${id}-value`}
          data-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onClick={() => (isOpen ? closeMenu() : openMenu())}
          onKeyDown={handleTriggerKeyDown}
        >
          <span id={`${id}-value`} className={value ? undefined : "is-placeholder"}>
            {value || placeholder}
          </span>
          <ChevronDown className="custom-select-chevron" size={18} aria-hidden="true" />
        </button>
        <div
          id={menuId}
          className="custom-select-menu"
          role="listbox"
          aria-labelledby={`${id}-label`}
          aria-hidden={!isOpen}
        >
          {options.map((option, index) => (
            <button
              key={option}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              className="custom-select-option"
              type="button"
              role="option"
              aria-selected={value === option}
              tabIndex={isOpen && index === activeIndex ? 0 : -1}
              onClick={() => {
                onChange(option);
                closeMenu(true);
              }}
              onFocus={() => setActiveIndex(index)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >
              <span>{option}</span>
              <Check size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
      {error && (
        <span className="field-error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

const getBackgroundLuminance = (element: Element | null) => {
  let currentElement: Element | null = element;

  while (currentElement && currentElement !== document.documentElement) {
    const backgroundColor = window.getComputedStyle(currentElement).backgroundColor;
    const match = backgroundColor.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
    );

    if (match && Number(match[4] ?? 1) > 0.08) {
      const [, red, green, blue] = match.map(Number);
      return (red * 299 + green * 587 + blue * 114) / 1000;
    }

    currentElement = currentElement.parentElement;
  }

  return 255;
};

export default function SkinBoostersLanding() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    phone: "",
    area: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stickyFormPhase, setStickyFormPhase] =
    useState<StickyFormPhase>("hidden");
  const [stickyFormMode, setStickyFormMode] =
    useState<StickyFormMode | null>(null);
  const [stickyFormHeight, setStickyFormHeight] = useState(0);
  const [mobileCtaVisible, setMobileCtaVisible] = useState(false);
  const [mobileCtaTone, setMobileCtaTone] =
    useState<MobileCtaTone>("on-light");
  const [reviewsPaused, setReviewsPaused] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [exitPopupOpen, setExitPopupOpen] = useState(false);
  const [exitPopupIsAutoTrigger, setExitPopupIsAutoTrigger] = useState(false);
  const exitPopupCloseRef = useRef<HTMLButtonElement>(null);
  const stickyFormRef = useRef<HTMLElement>(null);
  const stickyCloseButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCtaRef = useRef<HTMLButtonElement>(null);
  const stickyPhaseRef = useRef<StickyFormPhase>("hidden");
  const stickyModeRef = useRef<StickyFormMode | null>(null);
  const stickyDismissedRef = useRef(false);
  const stickyExitTimerRef = useRef<number | null>(null);
  const stickyFormMounted = stickyFormPhase !== "hidden";
  const stickyFormHiding = stickyFormPhase === "hiding";
  const mobileConsultationOpen =
    stickyFormPhase === "visible" && stickyFormMode === "mobile";
  const mobileCtaInteractive = mobileCtaVisible && !stickyFormMounted;

  const clearStickyExitTimer = useCallback(() => {
    if (stickyExitTimerRef.current === null) return;
    window.clearTimeout(stickyExitTimerRef.current);
    stickyExitTimerRef.current = null;
  }, []);

  const showStickyForm = useCallback((mode: StickyFormMode) => {
    if (mode === "auto" && stickyDismissedRef.current) return;

    clearStickyExitTimer();
    stickyModeRef.current = mode;
    setStickyFormMode(mode);
    if (stickyPhaseRef.current === "visible") return;

    stickyPhaseRef.current = "visible";
    setStickyFormPhase("visible");
  }, [clearStickyExitTimer]);

  const hideStickyForm = useCallback(() => {
    if (
      stickyPhaseRef.current === "hidden" ||
      stickyPhaseRef.current === "hiding"
    ) {
      return;
    }

    clearStickyExitTimer();
    const closingMode = stickyModeRef.current;
    stickyPhaseRef.current = "hiding";
    setStickyFormPhase("hiding");
    stickyExitTimerRef.current = window.setTimeout(() => {
      stickyPhaseRef.current = "hidden";
      stickyModeRef.current = null;
      stickyExitTimerRef.current = null;
      setStickyFormMode(null);
      setStickyFormPhase("hidden");

      if (
        closingMode === "mobile" &&
        window.matchMedia("(max-width: 560px)").matches
      ) {
        window.requestAnimationFrame(() => {
          mobileCtaRef.current?.focus({ preventScroll: true });
        });
      }
    }, 320);
  }, [clearStickyExitTimer]);

  const dismissStickyForm = useCallback(() => {
    if (stickyModeRef.current === "auto") {
      stickyDismissedRef.current = true;
    }
    hideStickyForm();
  }, [hideStickyForm]);

  const openMobileConsultation = useCallback(() => {
    stickyDismissedRef.current = false;
    showStickyForm("mobile");
  }, [showStickyForm]);

  const handleConsultationLinkClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      if (!window.matchMedia("(max-width: 560px)").matches) return;

      event.preventDefault();
      openMobileConsultation();
    },
    [openMobileConsultation],
  );

  const closeExitPopup = useCallback(() => {
    setExitPopupOpen(false);
  }, []);

  const openExitPopup = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setExitPopupIsAutoTrigger(false);
      setFormValues({ name: "", phone: "", area: "" });
      setErrors({});
      setExitPopupOpen(true);
    },
    [],
  );

  useEffect(() => {
    if (window.matchMedia("(max-width: 560px)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (exitIntentShown) return;

    let armed = false;
    const armTimer = window.setTimeout(() => {
      armed = true;
    }, 3000);

    function handleMouseOut(event: MouseEvent) {
      if (!armed) return;
      if (exitIntentShown) return;
      if (event.relatedTarget !== null) return;
      if (event.clientY > 0) return;

      exitIntentShown = true;
      setExitPopupIsAutoTrigger(true);
      setFormValues({ name: "", phone: "", area: "" });
      setErrors({});
      setExitPopupOpen(true);
      document.removeEventListener("mouseout", handleMouseOut);
    }

    document.addEventListener("mouseout", handleMouseOut);
    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  useEffect(() => {
    if (!exitPopupOpen) return;

    exitPopupCloseRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeExitPopup();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [exitPopupOpen, closeExitPopup]);

  useEffect(() => {
    let animationFrame = 0;

    const updateStickyVisibility = () => {
      const consultationForm = document.getElementById("consultation");
      if (!consultationForm) return;

      const hasPassedForm = consultationForm.getBoundingClientRect().bottom <= 0;
      const isMobile = window.matchMedia("(max-width: 560px)").matches;
      if (isMobile) {
        setMobileCtaVisible(hasPassedForm);
        const ctaElement = mobileCtaRef.current;
        const sampleX = window.innerWidth / 2;
        const sampleY = window.innerHeight - 36;
        const backdropElement =
          document
            .elementsFromPoint(sampleX, sampleY)
            .find((element) => !ctaElement?.contains(element))
            ?.closest("section, footer, header, main") ??
          document.body;
        const backdropLuminance = getBackgroundLuminance(backdropElement);
        setMobileCtaTone(backdropLuminance < 150 ? "on-dark" : "on-light");
        if (stickyModeRef.current === "auto") hideStickyForm();
        return;
      }

      setMobileCtaVisible(false);
      if (hasPassedForm) {
        showStickyForm("auto");
      } else {
        stickyDismissedRef.current = false;
        hideStickyForm();
      }
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateStickyVisibility);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      clearStickyExitTimer();
    };
  }, [clearStickyExitTimer, hideStickyForm, showStickyForm]);

  useEffect(() => {
    if (!mobileConsultationOpen) return;

    const focusFrame = window.requestAnimationFrame(() => {
      stickyCloseButtonRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [mobileConsultationOpen]);

  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 8% 0px",
      },
    );

    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!stickyFormMounted) return;

    const stickyForm = stickyFormRef.current;
    if (!stickyForm) return;

    const updateHeight = () => {
      setStickyFormHeight(
        Math.ceil(stickyForm.getBoundingClientRect().height),
      );
    };

    const initialMeasureFrame = window.requestAnimationFrame(updateHeight);
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(stickyForm);

    return () => {
      window.cancelAnimationFrame(initialMeasureFrame);
      resizeObserver.disconnect();
    };
  }, [stickyFormMounted]);

  function updateField(field: keyof FormValues, value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      submit: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const area = String(form.get("area") ?? "").trim();
    const digits = phone.replace(/\D/g, "");
    const nextErrors: FormErrors = {};

    if (name.length < 2) nextErrors.name = "Please enter your full name.";
    if (digits.length < 10 || digits.length > 13) {
      nextErrors.phone = "Please enter a valid mobile number.";
    }
    if (form.has("area") && !area) nextErrors.area = "Please choose a concern.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = Object.keys(nextErrors)[0];
      const fieldPrefix = event.currentTarget.dataset.formPrefix ?? "";
      window.requestAnimationFrame(() => {
        document.getElementById(fieldPrefix + firstInvalidField)?.focus();
      });
      return;
    }

    setIsSubmitting(true);

    const searchParams = new URLSearchParams(window.location.search);
    const gclid =
      searchParams.get("gclid")?.trim() ||
      searchParams.get("gcl_id")?.trim() ||
      "";

    fetch("/api/telecrm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email: "",
        area,
        landing_page_1: "skin-boosters-iv-drip",
      }),
      keepalive: true,
    }).catch((error) => {
      console.error("TeleCRM lead submission failed", error);
    });

    try {
      const response = await fetch(leadApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "complete",
          name,
          phone,
          email: "",
          landingPage: "Skin Boosters & IV Drips",
          treatmentAreas: [area],
          plannedStart: "",
          referrer: document.referrer || "Direct / none",
          utmSource: searchParams.get("utm_source") || "direct",
          utmMedium: searchParams.get("utm_medium") || "none",
          utmCampaign:
            searchParams.get("utm_campaign") || "Skin Boosters & IV Drips",
          utmContent: searchParams.get("utm_content") || "",
          utmTerm: searchParams.get("utm_term") || "",
          gclid,
          formAnswers: { "Primary skin concern": area },
          website: "",
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        leadId?: string;
      };
      if (!response.ok || !result.leadId) {
        throw new Error(result.error || "Lead submission failed");
      }

      (
        window as Window & {
          dataLayer?: Array<Record<string, string>>;
        }
      ).dataLayer?.push({
        event: "consultation_form_submit",
        treatment: "skin_boosters_iv_drips",
        selected_concern: area,
        lead_id: result.leadId,
        utm_source: searchParams.get("utm_source") ?? "",
        utm_medium: searchParams.get("utm_medium") ?? "",
        utm_campaign: searchParams.get("utm_campaign") ?? "",
        utm_content: searchParams.get("utm_content") ?? "",
        utm_term: searchParams.get("utm_term") ?? "",
        gclid,
      });

      window.location.assign("/thank-you");
    } catch {
      setErrors((current) => ({
        ...current,
        submit:
          "We could not save your request. Please try again in a moment.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main id="main-content">
      <a className="skip-link" href="#hero-title">
        Skip to treatment information
      </a>
      <header className="site-header" aria-label="Clinic header">
        <div className="header-inner">
          <a
            className="brand-link"
            href="#top"
            aria-label="Dr. Nishita's Clinic home"
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
          <div className="header-actions">
            <span className="header-location">Banjara Hills, Hyderabad</span>
          </div>
        </div>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-inner">
          <div className="hero-copy">
            <div
              className="rating-line hero-reveal"
              style={{ "--delay": "80ms" } as CSSProperties}
            >
              <Image
                src="/brand/google.png"
                alt="Google"
                width={36}
                height={36}
                unoptimized
                loading="eager"
              />
              <span className="rating-score">4.8</span>
              <span className="stars" aria-label="4.8 out of 5 stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} size={15} fill="currentColor" aria-hidden="true" />
                ))}
              </span>
              <span className="rating-count">700+ patient reviews</span>
            </div>
            <p
              className="eyebrow hero-reveal"
              style={{ "--delay": "150ms" } as CSSProperties}
            >
              Dermatologist-led skin booster treatments in Hyderabad
            </p>
            <div
              className="hero-offer hero-reveal"
              style={{ "--delay": "185ms" } as CSSProperties}
            >
              <Sparkles size={14} aria-hidden="true" />
              <span className="hero-offer-copy">
                <span className="hero-offer-kicker">New patient privilege</span>
                <span className="hero-offer-value">
                  Complimentary IV wellness session with eligible protocols
                </span>
              </span>
            </div>
            <h1
              id="hero-title"
              className="hero-reveal"
              style={{ "--delay": "220ms" } as CSSProperties}
            >
              Better skin quality begins beneath the surface.
            </h1>
            <div className="hero-media-frame">
              <picture className="hero-media-picture">
                <source
                  media="(max-width: 560px)"
                  srcSet="/brand/ivdripsmobile.png"
                />
                <img
                  className="hero-media"
                  src="/brand/ivdrips.png"
                  alt="Patient relaxing in a robe while receiving an IV wellness drip at Dr. Nishita's clinic"
                  width={1804}
                  height={872}
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </div>
            <p
              className="hero-intro hero-reveal"
              style={{ "--delay": "300ms" } as CSSProperties}
            >
              Personalised, doctor-led injectable skin booster treatments
              designed to improve hydration, texture and overall skin
              quality — without changing your natural facial features.
            </p>
            <a
              className="hero-mobile-cta hero-reveal"
              href="#consultation"
              onClick={handleConsultationLinkClick}
              style={{ "--delay": "340ms" } as CSSProperties}
            >
              Request a consultation
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <ul
              className="hero-benefits hero-reveal"
              style={{ "--delay": "360ms" } as CSSProperties}
            >
              <li>
                <Check size={18} aria-hidden="true" /> Doctor-led skin
                assessment before any product is selected
              </li>
              <li>
                <Check size={18} aria-hidden="true" /> SKINVIVE™, RD1 and
                Profhilo® considered on their individual merits, not as a
                fixed menu
              </li>
              <li>
                <Check size={18} aria-hidden="true" /> Natural-looking
                hydration and skin quality — not added volume
              </li>
            </ul>
          </div>

          <form
            className="consultation-form hero-reveal"
            id="consultation"
            onSubmit={handleSubmit}
            data-form-prefix=""
            noValidate
            style={{ "--delay": "440ms" } as CSSProperties}
          >
            <div className="form-heading">
              <p className="form-kicker">Personal consultation</p>
              <h2>Share your details to get started.</h2>
            </div>
            <div className="field-group">
              <label htmlFor="name">
                Full name <span className="required-mark" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formValues.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                onChange={(event) => updateField("name", event.target.value)}
              />
              {errors.name && (
                <span className="field-error" id="name-error" role="alert">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="field-group">
              <label htmlFor="phone">
                Mobile number <span className="required-mark" aria-hidden="true">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91"
                required
                value={formValues.phone}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                onChange={(event) => updateField("phone", event.target.value)}
              />
              {errors.phone && (
                <span className="field-error" id="phone-error" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>
            <ConcernDropdown
              id="area"
              label="Primary skin concern"
              placeholder="Select"
              options={concernOptions}
              value={formValues.area}
              error={errors.area}
              onChange={(value) => updateField("area", value)}
            />
            <div className="form-submit">
              <button
                type="submit"
                data-testid="consultation-submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Saving your request..." : "Request a consultation"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
            {errors.submit && (
              <p className="form-submit-error" role="alert">
                {errors.submit}
              </p>
            )}
            <p className="form-disclaimer">
              * By continuing, you agree to be contacted by the clinic.
            </p>
          </form>
        </div>
      </section>

      <section className="proof-band" aria-label="Clinic treatment principles">
        <div className="section-inner proof-grid">
          {proofPoints.map(({ icon: Icon, title, detail }, index) => (
            <div
              className="proof-item"
              key={title}
              data-reveal="rise"
              style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
            >
              <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <strong>{title}</strong>
                <span>{detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-section" aria-labelledby="featured-title">
        <div className="section-inner">
          <p className="section-label" id="featured-title" data-reveal="fade">
            Dr. Ranka has been featured in
          </p>
        </div>
        <div className="publication-marquee" data-reveal="fade">
          <div className="publication-track">
            {[0, 1].map((groupIndex) => (
              <div
                className="publication-group"
                key={groupIndex}
                aria-hidden={groupIndex === 1}
              >
                {publications.map((publication) => (
                  <div className="publication-logo" key={`${groupIndex}-${publication.alt}`}>
                    <Image
                      src={publication.src}
                      alt={groupIndex === 0 ? publication.alt : ""}
                      width={300}
                      height={150}
                      unoptimized
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="doctor-section" aria-labelledby="doctor-title">
        <div className="doctor-media" data-reveal="left">
          <Image
            src="/brand/dr-nishita.jpg"
            alt="Dr. Nishita Ranka"
            fill
            unoptimized
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
        <div className="doctor-copy" data-reveal="right">
          <p className="eyebrow">Dermatologist and founder</p>
          <h2 id="doctor-title">Medical precision, made personal.</h2>
          <p className="large-copy">
            Dr. Nishita Ranka is a board-certified dermatologist with over
            eight years of experience across clinical and aesthetic
            dermatology.
          </p>
          <p>
            At her Banjara Hills clinic, skin booster treatments are
            approached by first understanding your skin&apos;s hydration,
            texture and quality — not by selecting a product first. Based on
            assessment, Dr. Ranka and her team recommend the appropriate
            protocol, quantity and session plan.
          </p>
          <div className="doctor-signals">
            <span>
              <BadgeCheck size={20} aria-hidden="true" /> Dermatologist-led
              protocols
            </span>
            <span>
              <ShieldCheck size={20} aria-hidden="true" /> Personalised
              treatment planning
            </span>
          </div>
          <a
            className="primary-button"
            href="#consultation"
            onClick={openExitPopup}
          >
            Book a consultation <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="peel-overview-section" aria-labelledby="options-overview-title">
        <div className="section-inner">
          <div className="section-heading split-heading peel-overview-heading" data-reveal="rise">
            <div>
              <p className="eyebrow">Your skin booster options</p>
              <h2 id="options-overview-title">
                Different concerns need different protocols.
              </h2>
            </div>
            <p>
              Skin boosters are injectable treatments selected primarily to
              support skin hydration, smoothness and quality — not to create
              conventional facial volume. Dryness, fine lines, crepey
              texture and a tired appearance cannot always be addressed with
              topical skincare alone.
            </p>
          </div>
        </div>
      </section>

      <section className="peel-options-section" aria-labelledby="options-title">
        <div className="section-inner">
          <h2 id="options-title" className="sr-only">
            Skin booster treatment options
          </h2>
          <div className="peel-options-grid" aria-label="Skin booster options">
            {treatmentOptions.map((option, index) => (
              <article
                className="peel-option-card"
                key={option.name}
                data-reveal="rise"
                style={{ "--reveal-delay": `${index * 75}ms` } as CSSProperties}
              >
                <span className="peel-option-number">{option.number}</span>
                <h3>{option.name}</h3>
                <p>{option.description}</p>
                <div className="peel-ideal-for">
                  <strong>Ideal for</strong>
                  <p>{option.idealFor}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="technology-note" data-reveal="fade">
            Treatment choice, dose, technique, intervals and eligibility for
            the complimentary IV wellness benefit remain subject to the
            treating doctor&apos;s assessment. The promotional benefit does
            not determine the treatment recommendation.
          </p>
        </div>
      </section>

      <section className="compare-table-section" aria-labelledby="compare-title">
        <div className="section-inner">
          <div className="compare-table-heading" data-reveal="rise">
            <p className="eyebrow">Compare the protocols</p>
            <h2 id="compare-title">
              SKINVIVE™ vs RD1 vs Profhilo®: how are they different?
            </h2>
          </div>
          <div className="compare-table-wrap" data-reveal="fade">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Treatment</th>
                  <th scope="col">SKINVIVE™</th>
                  <th scope="col">RD1</th>
                  <th scope="col">Profhilo®</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.values.map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="compare-table-note" data-reveal="fade">
            Treatment choice, dose, technique and intervals remain subject to
            the treating doctor&apos;s assessment. The promotional benefit
            does not determine the treatment recommendation.
          </p>
        </div>
      </section>

      <section className="process-section" aria-labelledby="journey-title">
        <div className="section-inner">
          <div className="section-heading split-heading" data-reveal="rise">
            <div>
              <p className="eyebrow">Your treatment journey</p>
              <h2 id="journey-title">A protocol built around your skin.</h2>
            </div>
            <p>
              Skin ageing and dehydration can involve several processes at
              once. The treatment journey begins by understanding your skin
              before deciding what protocol may be appropriate.
            </p>
          </div>
          <div className="process-grid">
            {journeySteps.map((step, index) => (
              <article
                className="process-step"
                key={step.number}
                data-reveal="rise"
                style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
              >
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
          <p className="medical-note" data-reveal="fade">
            Treatment recommendations depend on assessment, medical history,
            suitability and individual treatment goals.
          </p>
        </div>
      </section>

      <section className="areas-section" aria-labelledby="concerns-title">
        <div className="section-inner areas-layout">
          <div className="areas-copy" data-reveal="left">
            <p className="eyebrow">Skin concerns we address</p>
            <h2 id="concerns-title">Start with what&apos;s changed in your skin.</h2>
            <p>
              Your skin booster protocol is selected around what your skin
              actually needs.
            </p>
            <a
              className="primary-button"
              href="#consultation"
              onClick={openExitPopup}
            >
              Discuss a concern <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="areas-list" aria-label="Skin concerns">
            {skinConcerns.map((concern, index) => (
              <div
                key={concern}
                data-reveal="right"
                style={{ "--reveal-delay": `${index * 65}ms` } as CSSProperties}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{concern}</strong>
                <Check size={18} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reviews-section" aria-labelledby="reviews-title">
        <div className="section-inner">
          <div className="review-heading" data-reveal="rise">
            <div>
              <p className="eyebrow">Patient voices</p>
              <h2 id="reviews-title">
                The experience matters as much as the plan.
              </h2>
            </div>
            <div className="review-score">
              <Image
                src="/brand/google.png"
                alt="Google"
                width={48}
                height={48}
                unoptimized
                loading="lazy"
              />
              <span>4.8</span>
              <small>from 700+ reviews</small>
            </div>
          </div>
          <div
            className={`review-grid is-visible ${reviewsPaused ? "is-paused" : ""}`}
            data-reveal="rise"
            role="button"
            tabIndex={0}
            aria-pressed={reviewsPaused}
            aria-label={
              reviewsPaused
                ? "Resume testimonial scrolling"
                : "Pause testimonial scrolling"
            }
            onClick={() => setReviewsPaused((current) => !current)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              setReviewsPaused((current) => !current);
            }}
          >
            <div className="review-track">
              {[0, 1].map((groupIndex) => (
                <div className="review-group" key={groupIndex} aria-hidden={groupIndex === 1}>
                  {reviews.map((review, index) => (
                    <blockquote
                      key={`${review.author}-${groupIndex}-${index}`}
                      style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
                    >
                      <span className="quote-mark" aria-hidden="true">
                        &quot;
                      </span>
                      <p>&quot;{review.quote}&quot;</p>
                      <footer>{review.author}</footer>
                    </blockquote>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <p className="medical-note" data-reveal="fade">
            Selected excerpts from patient reviews. Individual experiences
            and results vary.
          </p>
        </div>
      </section>

      <section className="iv-benefit-section" aria-labelledby="iv-benefit-title">
        <div className="section-inner">
          <div className="iv-benefit-panel" data-reveal="rise">
            <span className="iv-benefit-icon" aria-hidden="true">
              <Droplets size={26} />
            </span>
            <p className="eyebrow">Your complimentary benefit</p>
            <h2 id="iv-benefit-title">Your IV wellness experience</h2>
            <p>
              Each eligible skin booster session completed under a
              qualifying protocol currently carries one corresponding
              complimentary IV wellness session, subject to a separate
              medical assessment. The formulation is selected according to
              medical history, relevant nutritional considerations and
              suitability — it is not a standardised &ldquo;beauty,&rdquo;
              &ldquo;whitening&rdquo; or &ldquo;detox&rdquo; drip. The
              benefit is optional, personal, non-transferable and has no
              cash value.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section" aria-labelledby="faq-title">
        <div className="section-inner faq-layout">
          <div className="faq-intro" data-reveal="left">
            <p className="eyebrow">FAQs</p>
            <h2 id="faq-title">
              Questions worth asking before your treatment.
            </h2>
            <p>
              These answers provide general information. Your consultation
              determines what may be appropriate for your skin.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                className="faq-item"
                key={faq.question}
                data-reveal="right"
                style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}
              >
                <button
                  className="faq-trigger"
                  type="button"
                  aria-expanded={openFaqIndex === index}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() =>
                    setOpenFaqIndex((current) => (current === index ? null : index))
                  }
                >
                  {faq.question}
                  <span aria-hidden="true">+</span>
                </button>
                <div
                  className="faq-answer"
                  id={`faq-answer-${index}`}
                  aria-hidden={openFaqIndex !== index}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-cta-title">
        <Image
          src="/brand/clinic.jpg"
          alt="Reception at Dr. Nishita's Clinic in Banjara Hills"
          fill
          unoptimized
          loading="lazy"
          sizes="100vw"
        />
        <div className="final-cta-inner" data-reveal="rise">
          <p className="eyebrow">Banjara Hills, Hyderabad</p>
          <h2 id="final-cta-title">
            Not sure which skin booster is right for you?
          </h2>
          <p>
            Book a consultation for a personalised skin assessment and
            doctor-led recommendation.
          </p>
          <div className="cta-actions">
            <a
              className="primary-button"
              href="#consultation"
              onClick={openExitPopup}
            >
              Request a consultation <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="terms-disclaimer-section" aria-labelledby="terms-disclaimer-title">
        <div className="section-inner">
          <div className="terms-disclaimer-heading">
            <h2 id="terms-disclaimer-title">Terms and Medical Disclaimer</h2>
          </div>
          <ul className="terms-disclaimer-list">
            {termsAndDisclaimer.map((item) => (
              <li key={item}>
                <Check size={16} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="clinic-details" aria-label="Clinic details">
        <div className="section-inner">
          <div className="clinic-details-heading" data-reveal="rise">
            <p className="eyebrow">Banjara Hills, Hyderabad</p>
            <h2>Dr. Nishita&apos;s Clinic for Skin, Hair &amp; Aesthetics</h2>
          </div>
          <div className="details-grid">
            <div data-reveal="rise">
              <MapPin size={22} aria-hidden="true" />
              <h3>Visit the clinic</h3>
              <p>
                Road No. 7, 1st Floor, Sowbhagya Abode, beside Iran Embassy,
                Banjara Hills, Telangana 500034.
              </p>
            </div>
            <div data-reveal="rise" style={{ "--reveal-delay": "80ms" } as CSSProperties}>
              <Clock3 size={22} aria-hidden="true" />
              <h3>Clinic hours</h3>
              <p>Monday to Saturday, 10:00 AM to 7:00 PM. Sunday closed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="legal-section" aria-label="Privacy and terms">
        <div className="section-inner legal-grid">
          <div id="privacy" data-reveal="left">
            <h2>Privacy notice</h2>
            <p>
              Details entered in the consultation form are securely
              submitted to Dr. Nishita&apos;s Clinic and included in the
              WhatsApp message you choose to send. The clinic uses this
              information to respond to your enquiry and coordinate care.
              To request access, correction or deletion, email
              support@drnishitaranka.com.
            </p>
          </div>
          <div id="terms" data-reveal="right">
            <h2>Terms and medical note</h2>
            <p>
              This page provides general information and does not replace a
              medical consultation. Treatment recommendations, suitability,
              number of sessions, timelines, pricing and expected response
              depend on individual assessment. Results vary between
              individuals.
            </p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner" data-reveal="fade">
          <div className="footer-brand">
            <Image
              src="/brand/logo.png"
              alt="Dr. Nishita's Clinic"
              width={500}
              height={89}
              unoptimized
              loading="lazy"
            />
            <div className="footer-meta">
              <nav aria-label="Legal links">
                <a href="#privacy">Privacy Policy</a>
                <span aria-hidden="true">|</span>
                <a href="#terms">Terms &amp; Conditions</a>
              </nav>
              <p>(c) 2026 Dr. Nishita Ranka. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <div
        className="sticky-form-spacer"
        aria-hidden="true"
        style={{ height: stickyFormMounted ? `${stickyFormHeight}px` : "0px" }}
      />

      {stickyFormMounted && (
        <section
          id="mobile-consultation-sheet"
          ref={stickyFormRef}
          className={`sticky-consultation ${stickyFormHiding ? "is-hiding" : "is-showing"}`}
          aria-label="Sticky consultation form"
          data-testid="sticky-consultation"
        >
          <button
            ref={stickyCloseButtonRef}
            className="sticky-form-close"
            type="button"
            aria-label="Close sticky consultation form"
            title="Close"
            onClick={dismissStickyForm}
          >
            <X size={18} aria-hidden="true" />
          </button>
          <form
            className="sticky-consultation-form"
            onSubmit={handleSubmit}
            data-form-prefix="sticky-"
            noValidate
          >
            <div className="sticky-form-heading">
              <h2>Share your details to get started.</h2>
            </div>
            <div className="field-group">
              <label htmlFor="sticky-name">
                Full name <span className="required-mark" aria-hidden="true">*</span>
              </label>
              <input
                id="sticky-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formValues.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "sticky-name-error" : undefined}
                onChange={(event) => updateField("name", event.target.value)}
              />
              {errors.name && (
                <span className="field-error" id="sticky-name-error" role="alert">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="field-group">
              <label htmlFor="sticky-phone">
                Mobile number <span className="required-mark" aria-hidden="true">*</span>
              </label>
              <input
                id="sticky-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91"
                required
                value={formValues.phone}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "sticky-phone-error" : undefined}
                onChange={(event) => updateField("phone", event.target.value)}
              />
              {errors.phone && (
                <span className="field-error" id="sticky-phone-error" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>
            <ConcernDropdown
              className="sticky-area-field"
              id="sticky-area"
              label="Primary skin concern"
              placeholder="Select"
              options={concernOptions}
              value={formValues.area}
              error={errors.area}
              onChange={(value) => updateField("area", value)}
            />
            <div className="sticky-form-submit">
              <button
                type="submit"
                data-testid="sticky-consultation-submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Saving your request..." : "Request a consultation"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
            {errors.submit && (
              <p className="form-submit-error" role="alert">
                {errors.submit}
              </p>
            )}
            <p className="sticky-form-disclaimer">
              * By continuing, you agree to be contacted by the clinic.
            </p>
          </form>
        </section>
      )}

      {exitPopupOpen && (
        <div
          className="booking-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeExitPopup();
          }}
        >
          <div
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-popup-title"
          >
            <button
              ref={exitPopupCloseRef}
              type="button"
              className="booking-modal-close"
              aria-label="Close"
              onClick={closeExitPopup}
            >
              <X size={18} aria-hidden="true" />
            </button>
            <div className="booking-modal-heading">
              <p className="booking-modal-kicker">Before you go</p>
              <h2 id="exit-popup-title">Get a free skin consultation.</h2>
            </div>
            <form
              className="booking-modal-form"
              onSubmit={handleSubmit}
              data-form-prefix="exit-"
              noValidate
            >
              <div className="field-group">
                <label htmlFor="exit-name">
                  Full name <span className="required-mark" aria-hidden="true">*</span>
                </label>
                <input
                  id="exit-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formValues.name}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "exit-name-error" : undefined}
                  onChange={(event) => updateField("name", event.target.value)}
                />
                {errors.name && (
                  <span className="field-error" id="exit-name-error" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>
              <div className="field-group">
                <label htmlFor="exit-phone">
                  Mobile number <span className="required-mark" aria-hidden="true">*</span>
                </label>
                <input
                  id="exit-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91"
                  required
                  value={formValues.phone}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "exit-phone-error" : undefined}
                  onChange={(event) => updateField("phone", event.target.value)}
                />
                {errors.phone && (
                  <span className="field-error" id="exit-phone-error" role="alert">
                    {errors.phone}
                  </span>
                )}
              </div>
              {!exitPopupIsAutoTrigger && (
                <ConcernDropdown
                  id="exit-area"
                  label="Primary skin concern"
                  placeholder="Select"
                  options={concernOptions}
                  value={formValues.area}
                  error={errors.area}
                  onChange={(value) => updateField("area", value)}
                />
              )}
              <div className="form-submit">
                <button
                  type="submit"
                  data-testid="exit-consultation-submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Saving your request..." : "Request a consultation"}
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
              {errors.submit && (
                <p className="form-submit-error" role="alert">
                  {errors.submit}
                </p>
              )}
              <p className="form-disclaimer">
                * By continuing, you agree to be contacted by the clinic.
              </p>
            </form>
          </div>
        </div>
      )}

      <button
        ref={mobileCtaRef}
        className={`mobile-sticky-cta ${mobileCtaVisible ? "is-visible" : ""} is-${mobileCtaTone} ${stickyFormMounted ? "is-sheet-open" : ""}`}
        type="button"
        aria-controls="mobile-consultation-sheet"
        aria-expanded={mobileConsultationOpen}
        aria-hidden={!mobileCtaInteractive}
        tabIndex={mobileCtaInteractive ? undefined : -1}
        onClick={openMobileConsultation}
      >
        Request a consultation <ArrowRight size={18} aria-hidden="true" />
      </button>
    </main>
  );
}
