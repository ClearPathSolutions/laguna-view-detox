export const programNav = [
  { label: "Medical Detox", href: "/treatment/detoxification" },
  { label: "Residential Inpatient", href: "/treatment/residential-inpatient" },
  { label: "Dual Diagnosis", href: "/treatment/dual-diagnosis" },
  { label: "Addiction Therapies", href: "/treatment/addiction-therapies" },
  { label: "Aftercare & Alumni", href: "/treatment/aftercare" },
];

export function relatedPrograms(currentHref: string) {
  return programNav.filter((p) => p.href !== currentHref);
}
