import type { Metadata } from "next";
import { Onboarding } from "./Onboarding";

export const metadata: Metadata = {
  title: "Get started | AVision",
};

export default function OnboardingPage() {
  return <Onboarding />;
}
